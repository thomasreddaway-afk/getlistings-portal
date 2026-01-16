/**
 * Lead Activities API
 * 
 * GET /api/leads/[id]/activities - Get activities for a lead
 * POST /api/leads/[id]/activities - Create a new activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { requireAuth, canAccessLead, AuthError } from '@/lib/auth/server';
import { GetActivitiesParams, CreateActivityRequest } from '@/types/api';
import { Activity, Lead, User } from '@/types';
import { Timestamp, FieldValue } from 'firebase-admin/firestore';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/leads/[id]/activities
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id } = params;
    
    // Verify lead exists and user has access
    const leadDoc = await adminDb.collection(COLLECTIONS.LEADS).doc(id).get();
    
    if (!leadDoc.exists) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    const lead = leadDoc.data() as Lead;
    
    // Check access
    let linkedAgentIds: string[] | undefined;
    if (user.role === 'staff') {
      const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(user.uid).get();
      if (userDoc.exists) {
        linkedAgentIds = (userDoc.data() as User).linked_agent_ids;
      }
    }
    
    if (!canAccessLead(user, lead.assigned_agent_id, linkedAgentIds)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const cursor = searchParams.get('cursor');
    const type = searchParams.get('type');
    
    // Build query
    let query = adminDb
      .collection(COLLECTIONS.ACTIVITIES)
      .where('lead_id', '==', id)
      .orderBy('created_at', 'desc');
    
    if (type) {
      query = query.where('type', '==', type);
    }
    
    if (cursor) {
      const cursorDoc = await adminDb.collection(COLLECTIONS.ACTIVITIES).doc(cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }
    
    query = query.limit(limit + 1);
    
    const snapshot = await query.get();
    
    const activities: Activity[] = [];
    let hasMore = false;
    
    snapshot.docs.forEach((doc, index) => {
      if (index < limit) {
        activities.push({ id: doc.id, ...doc.data() } as Activity);
      } else {
        hasMore = true;
      }
    });
    
    return NextResponse.json({
      items: activities,
      has_more: hasMore,
      next_cursor: hasMore && activities.length > 0 ? activities[activities.length - 1].id : undefined,
    });
    
  } catch (error) {
    console.error('Error fetching activities:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads/[id]/activities
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id } = params;
    
    const body: CreateActivityRequest = await request.json();
    
    // Validate required fields
    if (!body.type || !body.content) {
      return NextResponse.json(
        { error: 'Type and content are required' },
        { status: 400 }
      );
    }
    
    // Verify lead exists and user has access
    const leadRef = adminDb.collection(COLLECTIONS.LEADS).doc(id);
    const leadDoc = await leadRef.get();
    
    if (!leadDoc.exists) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    const lead = leadDoc.data() as Lead;
    
    // Check access
    let linkedAgentIds: string[] | undefined;
    if (user.role === 'staff') {
      const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(user.uid).get();
      if (userDoc.exists) {
        linkedAgentIds = (userDoc.data() as User).linked_agent_ids;
      }
    }
    
    if (!canAccessLead(user, lead.assigned_agent_id, linkedAgentIds)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Create the activity
    const activityData: Omit<Activity, 'id'> = {
      lead_id: id,
      opportunity_id: body.opportunity_id,
      type: body.type,
      content: body.content,
      metadata: body.metadata,
      created_by_id: user.uid,
      created_at: Timestamp.now(),
    };
    
    const docRef = await adminDb.collection(COLLECTIONS.ACTIVITIES).add(activityData);
    
    // Update lead's last_activity_at and increment follow_up_count if applicable
    const leadUpdates: Record<string, any> = {
      last_activity_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };
    
    // Increment follow_up_count for contact activities
    if (['call', 'sms', 'email'].includes(body.type)) {
      leadUpdates.follow_up_count = FieldValue.increment(1);
    }
    
    // Set flags for specific activities
    if (body.type === 'appraisal_sent') {
      leadUpdates.appraisal_sent = true;
    }
    
    if (body.type === 'appointment' && body.metadata?.appointment_datetime) {
      leadUpdates.appointment_scheduled = true;
    }
    
    await leadRef.update(leadUpdates);
    
    // Return the created activity
    const createdDoc = await docRef.get();
    
    return NextResponse.json(
      { id: docRef.id, ...createdDoc.data() },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating activity:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    );
  }
}
