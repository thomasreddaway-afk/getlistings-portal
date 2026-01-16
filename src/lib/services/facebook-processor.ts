/**
 * Facebook Lead Processing Service
 * 
 * Processes raw leads stored by the webhook.
 * This runs as a background job (Cloud Function or cron).
 * 
 * Responsibilities:
 * 1. Fetch full lead data from Facebook Graph API
 * 2. Deduplicate by facebook_lead_id and phone
 * 3. Create Lead entity
 * 4. Attempt property match
 * 5. Create Opportunity in default stage
 */

import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { RawLead, Lead, Opportunity } from '@/types';
import { normalizePhone } from '@/lib/utils/phone';

const FACEBOOK_GRAPH_API = 'https://graph.facebook.com/v18.0';

interface FacebookLeadField {
  name: string;
  values: string[];
}

interface FacebookLeadResponse {
  id: string;
  created_time: string;
  field_data: FacebookLeadField[];
}

/**
 * Process pending raw leads
 */
export async function processRawLeads(batchSize: number = 50): Promise<{
  processed: number;
  created: number;
  duplicates: number;
  errors: number;
}> {
  const stats = { processed: 0, created: 0, duplicates: 0, errors: 0 };
  
  // Get unprocessed raw leads
  const rawLeadsQuery = await adminDb
    .collection(COLLECTIONS.RAW_LEADS)
    .where('processed', '==', false)
    .where('processing_attempts', '<', 3) // Max 3 retries
    .orderBy('processing_attempts')
    .orderBy('received_at')
    .limit(batchSize)
    .get();
  
  if (rawLeadsQuery.empty) {
    return stats;
  }
  
  for (const doc of rawLeadsQuery.docs) {
    const rawLead = { id: doc.id, ...doc.data() } as RawLead;
    stats.processed++;
    
    try {
      // Increment processing attempts
      await doc.ref.update({
        processing_attempts: FieldValue.increment(1),
      });
      
      // Fetch full lead data from Facebook
      const fbLeadData = await fetchFacebookLead(rawLead.source_id);
      
      if (!fbLeadData) {
        throw new Error('Failed to fetch Facebook lead data');
      }
      
      // Extract fields
      const fields = parseLeadFields(fbLeadData.field_data);
      
      // Check for duplicate by phone (if we have phone)
      if (fields.phone) {
        const normalizedPhone = normalizePhone(fields.phone);
        const existingByPhone = await adminDb
          .collection(COLLECTIONS.LEADS)
          .where('phone', '==', normalizedPhone)
          .limit(1)
          .get();
        
        if (!existingByPhone.empty) {
          // Duplicate - update raw lead and skip
          await doc.ref.update({
            processed: true,
            processed_at: Timestamp.now(),
            processed_lead_id: existingByPhone.docs[0].id,
            processing_error: 'Duplicate by phone',
          });
          stats.duplicates++;
          continue;
        }
      }
      
      // Create the lead
      const leadData: Omit<Lead, 'id'> = {
        first_name: fields.first_name || 'Unknown',
        last_name: fields.last_name || '',
        phone: normalizePhone(fields.phone || ''),
        email: fields.email,
        source: 'facebook',
        facebook_lead_id: rawLead.source_id,
        is_exclusive: true, // Facebook leads are always exclusive (agency-managed)
        created_by_id: 'system',
        raw_payload: fbLeadData,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        current_stage_id: 'lead', // Default stage
        current_stage_name: 'Lead',
        follow_up_count: 0,
      };
      
      // Add property address if available
      if (fields.street_address || fields.city) {
        leadData.property_address = [
          fields.street_address,
          fields.city,
          fields.state,
          fields.zip_code,
        ].filter(Boolean).join(', ');
      }
      
      // Create lead document
      const leadRef = await adminDb.collection(COLLECTIONS.LEADS).add(leadData);
      
      // Create opportunity in default stage
      const opportunityData: Omit<Opportunity, 'id'> = {
        lead_id: leadRef.id,
        stage_id: 'lead',
        stage_entered_at: Timestamp.now(),
        is_exclusive: true,
        assigned_agent_id: 'unassigned', // Will be assigned by staff
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      };
      
      await adminDb.collection(COLLECTIONS.OPPORTUNITIES).add(opportunityData);
      
      // Update raw lead as processed
      await doc.ref.update({
        processed: true,
        processed_at: Timestamp.now(),
        processed_lead_id: leadRef.id,
      });
      
      stats.created++;
      
    } catch (error: any) {
      console.error(`Error processing raw lead ${rawLead.id}:`, error);
      
      await doc.ref.update({
        processing_error: error.message || 'Unknown error',
      });
      
      stats.errors++;
    }
  }
  
  return stats;
}

/**
 * Fetch lead data from Facebook Graph API
 */
async function fetchFacebookLead(leadId: string): Promise<FacebookLeadResponse | null> {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  
  if (!accessToken) {
    throw new Error('Facebook access token not configured');
  }
  
  try {
    const response = await fetch(
      `${FACEBOOK_GRAPH_API}/${leadId}?access_token=${accessToken}`
    );
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Facebook API error: ${error}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Facebook lead:', error);
    return null;
  }
}

/**
 * Parse Facebook lead field data into structured object
 */
function parseLeadFields(fieldData: FacebookLeadField[]): Record<string, string> {
  const fields: Record<string, string> = {};
  
  for (const field of fieldData) {
    const value = field.values?.[0] || '';
    
    // Map common Facebook field names to our schema
    switch (field.name.toLowerCase()) {
      case 'first_name':
      case 'firstname':
        fields.first_name = value;
        break;
      case 'last_name':
      case 'lastname':
        fields.last_name = value;
        break;
      case 'full_name':
        // Try to split full name
        const parts = value.split(' ');
        fields.first_name = parts[0] || '';
        fields.last_name = parts.slice(1).join(' ') || '';
        break;
      case 'phone_number':
      case 'phone':
        fields.phone = value;
        break;
      case 'email':
        fields.email = value;
        break;
      case 'street_address':
      case 'address':
        fields.street_address = value;
        break;
      case 'city':
        fields.city = value;
        break;
      case 'state':
      case 'province':
        fields.state = value;
        break;
      case 'zip_code':
      case 'postcode':
      case 'post_code':
        fields.zip_code = value;
        break;
      default:
        // Store unknown fields as-is
        fields[field.name] = value;
    }
  }
  
  return fields;
}
