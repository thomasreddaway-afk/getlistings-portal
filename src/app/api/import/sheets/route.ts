/**
 * Sheets Import API
 * 
 * POST /api/import/sheets - Start a new import
 * GET /api/import/sheets/preview - Preview sheet data
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireRole, AuthError } from '@/lib/auth/server';
import { importFromSheets, getAvailableSheets, previewSheet, SheetImportConfig } from '@/lib/services/sheets-import';
import { SheetsImportRequest, SheetsImportResponse } from '@/types/api';

/**
 * POST /api/import/sheets
 * Start a new import from Google Sheets
 */
export async function POST(request: NextRequest) {
  try {
    // Only admin can import
    const user = await requireRole(request, ['admin']);
    
    const body: SheetsImportRequest = await request.json();
    
    // Validate required fields
    if (!body.spreadsheet_id || !body.sheet_name) {
      return NextResponse.json(
        { error: 'Spreadsheet ID and sheet name are required' },
        { status: 400 }
      );
    }
    
    if (!body.column_mapping.first_name || !body.column_mapping.phone) {
      return NextResponse.json(
        { error: 'First name and phone column mappings are required' },
        { status: 400 }
      );
    }
    
    // Build config
    const config: SheetImportConfig = {
      spreadsheetId: body.spreadsheet_id,
      sheetName: body.sheet_name,
      columnMapping: {
        first_name: body.column_mapping.first_name,
        last_name: body.column_mapping.last_name,
        phone: body.column_mapping.phone,
        email: body.column_mapping.email,
        address: body.column_mapping.address,
        stage: body.column_mapping.stage,
      },
      options: {
        skipDuplicates: body.options.skip_duplicates,
        defaultStageId: body.options.default_stage_id,
        isExclusive: body.options.is_exclusive,
        assignedAgentId: body.options.assigned_agent_id,
        startRow: body.options.start_row || 2,
        endRow: body.options.end_row,
      },
    };
    
    // Start import (runs synchronously for now, could be async in production)
    const result = await importFromSheets(config, user.uid);
    
    const response: SheetsImportResponse = {
      import_id: result.importId,
      status: result.status === 'completed' ? 'completed' : 'failed',
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error importing from sheets:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to import from sheets' },
      { status: 500 }
    );
  }
}
