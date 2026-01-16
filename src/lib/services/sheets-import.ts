/**
 * Google Sheets Import Service
 * 
 * Handles one-time import and optional sync from Google Sheets.
 * Used for migrating from the existing Sheets-based workflow.
 */

import { google, sheets_v4 } from 'googleapis';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { Timestamp } from 'firebase-admin/firestore';
import { Lead, Import, ImportConfig, ImportError } from '@/types';
import { normalizePhone, isValidPhone } from '@/lib/utils/phone';

// Initialize Google Sheets API
function getSheetsClient(): sheets_v4.Sheets {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Import configuration for mapping sheet columns to lead fields
 */
export interface SheetImportConfig {
  spreadsheetId: string;
  sheetName: string;
  columnMapping: {
    first_name: string;      // Column letter (A, B, C) or header name
    last_name: string;
    phone: string;
    email?: string;
    address?: string;
    stage?: string;
    notes?: string;
    date_received?: string;
    source?: string;
  };
  options: {
    skipDuplicates: boolean;
    defaultStageId: string;
    isExclusive: boolean;
    assignedAgentId?: string;
    startRow: number;        // Usually 2 (skip header)
    endRow?: number;         // Optional limit
  };
}

/**
 * Import result
 */
export interface ImportResult {
  importId: string;
  status: 'completed' | 'failed';
  totalRows: number;
  imported: number;
  skippedDuplicates: number;
  errors: ImportError[];
}

/**
 * Start a new import from Google Sheets
 */
export async function importFromSheets(
  config: SheetImportConfig,
  userId: string
): Promise<ImportResult> {
  const sheets = getSheetsClient();
  
  // Create import record
  const importRef = await adminDb.collection(COLLECTIONS.IMPORTS).add({
    source: 'google_sheets',
    source_reference: config.spreadsheetId,
    status: 'processing',
    total_rows: 0,
    processed_rows: 0,
    imported_count: 0,
    skipped_duplicates: 0,
    error_count: 0,
    errors: [],
    config: {
      column_mapping: config.columnMapping,
      skip_duplicates: config.options.skipDuplicates,
      default_stage_id: config.options.defaultStageId,
      is_exclusive: config.options.isExclusive,
      assigned_agent_id: config.options.assignedAgentId,
    },
    created_by_id: userId,
    started_at: Timestamp.now(),
    created_at: Timestamp.now(),
  });

  const result: ImportResult = {
    importId: importRef.id,
    status: 'completed',
    totalRows: 0,
    imported: 0,
    skippedDuplicates: 0,
    errors: [],
  };

  try {
    // Fetch sheet data
    const range = config.options.endRow
      ? `${config.sheetName}!A${config.options.startRow}:Z${config.options.endRow}`
      : `${config.sheetName}!A${config.options.startRow}:Z`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range,
    });

    const rows = response.data.values || [];
    result.totalRows = rows.length;

    // Get header row to map column letters to indices
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: config.spreadsheetId,
      range: `${config.sheetName}!A1:Z1`,
    });
    const headers = headerResponse.data.values?.[0] || [];
    const columnIndices = mapColumnsToIndices(config.columnMapping, headers);

    // Process each row
    const batch = adminDb.batch();
    let batchCount = 0;
    const MAX_BATCH_SIZE = 500;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = config.options.startRow + i;

      try {
        // Extract lead data from row
        const leadData = extractLeadFromRow(row, columnIndices, config.options);

        // Validate phone
        if (!leadData.phone || !isValidPhone(leadData.phone)) {
          result.errors.push({
            row: rowNumber,
            field: 'phone',
            message: 'Invalid or missing phone number',
          });
          continue;
        }

        // Check for duplicates
        if (config.options.skipDuplicates) {
          const existing = await adminDb
            .collection(COLLECTIONS.LEADS)
            .where('phone', '==', leadData.phone)
            .limit(1)
            .get();

          if (!existing.empty) {
            result.skippedDuplicates++;
            continue;
          }
        }

        // Create lead
        const leadRef = adminDb.collection(COLLECTIONS.LEADS).doc();
        batch.set(leadRef, {
          ...leadData,
          source: 'import',
          is_exclusive: config.options.isExclusive,
          assigned_agent_id: config.options.assignedAgentId || 'unassigned',
          created_by_id: userId,
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
          current_stage_id: config.options.defaultStageId,
          current_stage_name: getStageNameById(config.options.defaultStageId),
          follow_up_count: 0,
        });

        // Create opportunity
        const oppRef = adminDb.collection(COLLECTIONS.OPPORTUNITIES).doc();
        batch.set(oppRef, {
          lead_id: leadRef.id,
          stage_id: config.options.defaultStageId,
          stage_entered_at: Timestamp.now(),
          is_exclusive: config.options.isExclusive,
          assigned_agent_id: config.options.assignedAgentId || 'unassigned',
          created_at: Timestamp.now(),
          updated_at: Timestamp.now(),
        });

        result.imported++;
        batchCount++;

        // Commit batch if it's getting large
        if (batchCount >= MAX_BATCH_SIZE) {
          await batch.commit();
          batchCount = 0;
        }

      } catch (error: any) {
        result.errors.push({
          row: rowNumber,
          message: error.message || 'Unknown error',
        });
      }

      // Update progress periodically
      if (i % 100 === 0) {
        await importRef.update({
          processed_rows: i + 1,
          imported_count: result.imported,
          skipped_duplicates: result.skippedDuplicates,
          error_count: result.errors.length,
        });
      }
    }

    // Commit remaining batch
    if (batchCount > 0) {
      await batch.commit();
    }

    // Update final status
    await importRef.update({
      status: 'completed',
      total_rows: result.totalRows,
      processed_rows: result.totalRows,
      imported_count: result.imported,
      skipped_duplicates: result.skippedDuplicates,
      error_count: result.errors.length,
      errors: result.errors.slice(0, 100), // Keep first 100 errors
      completed_at: Timestamp.now(),
    });

  } catch (error: any) {
    result.status = 'failed';
    result.errors.push({
      row: 0,
      message: `Import failed: ${error.message}`,
    });

    await importRef.update({
      status: 'failed',
      error_count: 1,
      errors: [{ row: 0, message: error.message }],
      completed_at: Timestamp.now(),
    });
  }

  return result;
}

/**
 * Map column names/letters to array indices
 */
function mapColumnsToIndices(
  mapping: SheetImportConfig['columnMapping'],
  headers: string[]
): Record<string, number> {
  const indices: Record<string, number> = {};

  for (const [field, column] of Object.entries(mapping)) {
    if (!column) continue;

    // Check if column is a letter (A, B, C)
    if (/^[A-Z]+$/i.test(column)) {
      indices[field] = columnLetterToIndex(column);
    } else {
      // Assume it's a header name - find matching header
      const headerIndex = headers.findIndex(
        h => h.toLowerCase().trim() === column.toLowerCase().trim()
      );
      if (headerIndex >= 0) {
        indices[field] = headerIndex;
      }
    }
  }

  return indices;
}

/**
 * Convert column letter (A, B, ..., Z, AA, AB) to array index
 */
function columnLetterToIndex(letter: string): number {
  let index = 0;
  const letters = letter.toUpperCase();
  for (let i = 0; i < letters.length; i++) {
    index = index * 26 + (letters.charCodeAt(i) - 64);
  }
  return index - 1; // 0-indexed
}

/**
 * Extract lead data from a spreadsheet row
 */
function extractLeadFromRow(
  row: string[],
  indices: Record<string, number>,
  options: SheetImportConfig['options']
): Partial<Lead> {
  const getValue = (field: string): string => {
    const index = indices[field];
    if (index === undefined || index >= row.length) return '';
    return (row[index] || '').trim();
  };

  const phone = normalizePhone(getValue('phone'));

  return {
    first_name: getValue('first_name') || 'Unknown',
    last_name: getValue('last_name') || '',
    phone,
    email: getValue('email') || undefined,
    property_address: getValue('address') || undefined,
  };
}

/**
 * Get stage name by ID (simplified - in real app, fetch from config)
 */
function getStageNameById(stageId: string): string {
  const stages: Record<string, string> = {
    lead: 'Lead',
    qualified: 'Qualified Lead',
    contact: 'Contact Made',
    appointment: 'Appointment',
    listing: 'Listing',
    sale: 'Sale',
    lost: 'Lost',
  };
  return stages[stageId] || 'Lead';
}

/**
 * Get available sheets from a spreadsheet
 */
export async function getAvailableSheets(spreadsheetId: string): Promise<string[]> {
  const sheets = getSheetsClient();
  
  const response = await sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'sheets.properties.title',
  });

  return response.data.sheets?.map(s => s.properties?.title || '') || [];
}

/**
 * Preview first N rows of a sheet
 */
export async function previewSheet(
  spreadsheetId: string,
  sheetName: string,
  rowCount: number = 5
): Promise<string[][]> {
  const sheets = getSheetsClient();
  
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `${sheetName}!A1:Z${rowCount}`,
  });

  return response.data.values || [];
}
