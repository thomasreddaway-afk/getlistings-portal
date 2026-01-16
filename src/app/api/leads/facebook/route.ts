/**
 * Facebook Lead Ads Webhook
 * 
 * POST /api/leads/facebook
 * 
 * Critical endpoint for high-volume lead ingestion (50k+/month).
 * 
 * Design principles:
 * - Accept fast, process async
 * - Store raw payload unmodified
 * - Idempotent (safe to retry)
 * - No business logic in webhook handler
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { FacebookWebhookPayload, FacebookWebhookResponse } from '@/types/api';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import crypto from 'crypto';

/**
 * Webhook verification (GET request from Facebook)
 * Facebook sends this when setting up the webhook
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  
  // Verify the token matches our configured token
  if (mode === 'subscribe' && token === process.env.FACEBOOK_VERIFY_TOKEN) {
    console.log('Facebook webhook verified');
    return new NextResponse(challenge, { status: 200 });
  }
  
  console.warn('Facebook webhook verification failed');
  return NextResponse.json({ error: 'Verification failed' }, { status: 403 });
}

/**
 * Receive lead data (POST request from Facebook)
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse the payload
    const payload: FacebookWebhookPayload = await request.json();
    
    // Validate basic structure
    if (payload.object !== 'page' || !payload.entry?.length) {
      return NextResponse.json(
        { success: false, received_count: 0, message: 'Invalid payload structure' },
        { status: 400 }
      );
    }
    
    // Optional: Verify request signature
    const signature = request.headers.get('X-Hub-Signature-256');
    if (signature && process.env.FACEBOOK_APP_SECRET) {
      const isValid = verifySignature(
        await request.text(),
        signature,
        process.env.FACEBOOK_APP_SECRET
      );
      
      if (!isValid) {
        console.warn('Invalid Facebook webhook signature');
        return NextResponse.json(
          { success: false, received_count: 0, message: 'Invalid signature' },
          { status: 403 }
        );
      }
    }
    
    // Extract all lead IDs from the payload
    const leadEntries: Array<{
      leadgen_id: string;
      form_id: string;
      created_time: number;
      page_id: string;
      ad_id?: string;
      entry_time: number;
    }> = [];
    
    for (const entry of payload.entry) {
      for (const change of entry.changes) {
        if (change.field === 'leadgen' && change.value.leadgen_id) {
          leadEntries.push({
            leadgen_id: change.value.leadgen_id,
            form_id: change.value.form_id,
            created_time: change.value.created_time,
            page_id: change.value.page_id,
            ad_id: change.value.ad_id,
            entry_time: entry.time,
          });
        }
      }
    }
    
    if (leadEntries.length === 0) {
      return NextResponse.json(
        { success: true, received_count: 0, message: 'No leads in payload' },
        { status: 200 }
      );
    }
    
    // Store raw leads (batch write for efficiency)
    const batch = adminDb.batch();
    const rawLeadsCollection = adminDb.collection(COLLECTIONS.RAW_LEADS);
    
    for (const leadEntry of leadEntries) {
      // Create dedup key (using facebook_lead_id)
      const dedupKey = `facebook:${leadEntry.leadgen_id}`;
      
      // Check if already exists (idempotency)
      const existing = await rawLeadsCollection
        .where('dedup_key', '==', dedupKey)
        .limit(1)
        .get();
      
      if (!existing.empty) {
        // Already processed, skip
        continue;
      }
      
      // Create raw lead document
      const docRef = rawLeadsCollection.doc();
      batch.set(docRef, {
        source: 'facebook',
        source_id: leadEntry.leadgen_id,
        dedup_key: dedupKey,
        payload: leadEntry,
        full_payload: payload, // Store entire webhook payload for debugging
        processed: false,
        processing_attempts: 0,
        received_at: Timestamp.now(),
      });
    }
    
    // Commit the batch
    await batch.commit();
    
    // Log metrics
    const duration = Date.now() - startTime;
    console.log(`Facebook webhook processed: ${leadEntries.length} leads in ${duration}ms`);
    
    // Return success immediately
    // Background processing will happen via Cloud Function or cron job
    const response: FacebookWebhookResponse = {
      success: true,
      received_count: leadEntries.length,
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Facebook webhook error:', error);
    
    // Return 200 to prevent Facebook from retrying
    // We'll handle errors in our own retry logic
    return NextResponse.json(
      { success: false, received_count: 0, message: 'Internal error' },
      { status: 200 }
    );
  }
}

/**
 * Verify Facebook webhook signature
 */
function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')}`;
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
