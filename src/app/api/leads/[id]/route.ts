/**
 * Single Lead API Routes
 * 
 * GET /api/leads/[id] - Get lead details
 * PATCH /api/leads/[id] - Update a lead
 * DELETE /api/leads/[id] - Delete a lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { requireAuth, canAccessLead, AuthError } from '@/lib/auth/server';
import { GetLeadDetailResponse, UpdateLeadRequest } from '@/types/api';
import { Lead, Property, Opportunity, Activity, User } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/leads/[id]
 * Get lead details with related data
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id } = params;
    
    // Get the lead
    const leadDoc = await adminDb.collection(COLLECTIONS.LEADS).doc(id).get();
    
    if (!leadDoc.exists) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    const lead = { id: leadDoc.id, ...leadDoc.data() } as Lead;
    
    // Check access permissions
    // For staff, we need to fetch their linked agents
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
    
    // Get related property (if any)
    let property: Property | undefined;
    const propertiesQuery = await adminDb
      .collection(COLLECTIONS.PROPERTIES)
      .where('linked_lead_ids', 'array-contains', id)
      .limit(1)
      .get();
    
    if (!propertiesQuery.empty) {
      property = { id: propertiesQuery.docs[0].id, ...propertiesQuery.docs[0].data() } as Property;
    }
    
    // Get opportunity
    let opportunity: Opportunity | undefined;
    const opportunitiesQuery = await adminDb
      .collection(COLLECTIONS.OPPORTUNITIES)
      .where('lead_id', '==', id)
      .limit(1)
      .get();
    
    if (!opportunitiesQuery.empty) {
      opportunity = { id: opportunitiesQuery.docs[0].id, ...opportunitiesQuery.docs[0].data() } as Opportunity;
    }
    
    // Get recent activities
    const activitiesQuery = await adminDb
      .collection(COLLECTIONS.ACTIVITIES)
      .where('lead_id', '==', id)
      .orderBy('created_at', 'desc')
      .limit(20)
      .get();
    
    const recent_activities: Activity[] = activitiesQuery.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Activity));
    
    // Get assigned agent info
    let assigned_agent: Pick<User, 'id' | 'first_name' | 'last_name' | 'phone' | 'avatar_url'> | undefined;
    if (lead.assigned_agent_id) {
      const agentDoc = await adminDb.collection(COLLECTIONS.USERS).doc(lead.assigned_agent_id).get();
      if (agentDoc.exists) {
        const agentData = agentDoc.data() as User;
        assigned_agent = {
          id: agentDoc.id,
          first_name: agentData.first_name,
          last_name: agentData.last_name,
          phone: agentData.phone,
          avatar_url: agentData.avatar_url,
        };
      }
    }
    
    const response: GetLeadDetailResponse = {
      lead,
      property,
      opportunity,
      recent_activities,
      assigned_agent,
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching lead:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/leads/[id]
 * Update a lead
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id } = params;
    
    const body: UpdateLeadRequest = await request.json();
    
    // Get the lead
    const leadRef = adminDb.collection(COLLECTIONS.LEADS).doc(id);
    const leadDoc = await leadRef.get();
    
    if (!leadDoc.exists) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    const lead = { id: leadDoc.id, ...leadDoc.data() } as Lead;
    
    // Check access permissions
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
    
    // Build update object
    const updates: Partial<Lead> = {
      updated_at: Timestamp.now(),
    };
    
    if (body.first_name !== undefined) updates.first_name = body.first_name;
    if (body.last_name !== undefined) updates.last_name = body.last_name;
    if (body.email !== undefined) updates.email = body.email;
    if (body.property_address !== undefined) updates.property_address = body.property_address;
    
    // Only admin can change exclusive status
    if (body.is_exclusive !== undefined && user.role === 'admin') {
      updates.is_exclusive = body.is_exclusive;
    }
    
    // Only admin/staff can reassign
    if (body.assigned_agent_id !== undefined && (user.role === 'admin' || user.role === 'staff')) {
      updates.assigned_agent_id = body.assigned_agent_id;
      
      // Create activity for assignment change
      await adminDb.collection(COLLECTIONS.ACTIVITIES).add({
        lead_id: id,
        type: 'assignment_change',
        content: `Lead reassigned`,
        metadata: {
          from_agent_id: lead.assigned_agent_id,
          to_agent_id: body.assigned_agent_id,
        },
        created_by_id: user.uid,
        created_at: Timestamp.now(),
      });
    }
    
    // Update the lead
    await leadRef.update(updates);
    
    // Get updated lead
    const updatedDoc = await leadRef.get();
    
    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
    
  } catch (error) {
    console.error('Error updating lead:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/leads/[id]
 * Delete a lead (admin only)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { id } = params;
    
    // Only admin can delete leads
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can delete leads' },
        { status: 403 }
      );
    }
    
    // Get the lead
    const leadRef = adminDb.collection(COLLECTIONS.LEADS).doc(id);
    const leadDoc = await leadRef.get();
    
    if (!leadDoc.exists) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // Delete related opportunities
    const opportunities = await adminDb
      .collection(COLLECTIONS.OPPORTUNITIES)
      .where('lead_id', '==', id)
      .get();
    
    const batch = adminDb.batch();
    
    opportunities.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete related activities
    const activities = await adminDb
      .collection(COLLECTIONS.ACTIVITIES)
      .where('lead_id', '==', id)
      .get();
    
    activities.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the lead
    batch.delete(leadRef);
    
    await batch.commit();
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting lead:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}
