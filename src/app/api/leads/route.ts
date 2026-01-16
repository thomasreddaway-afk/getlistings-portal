/**
 * Leads API Routes
 * 
 * GET /api/leads - List leads with filters
 * POST /api/leads - Create a new lead
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { requireAuth, canAccessLead, AuthError } from '@/lib/auth/server';
import { GetLeadsParams, GetLeadsResponse, CreateLeadRequest } from '@/types/api';
import { Lead } from '@/types';
import { normalizePhone, isValidPhone } from '@/lib/utils/phone';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * GET /api/leads
 * List leads with pagination and filters
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const params: GetLeadsParams = {
      limit: Math.min(parseInt(searchParams.get('limit') || '50'), 200),
      cursor: searchParams.get('cursor') || undefined,
      is_exclusive: searchParams.get('is_exclusive') === 'true' ? true : 
                    searchParams.get('is_exclusive') === 'false' ? false : undefined,
      stage_id: searchParams.get('stage_id') || undefined,
      assigned_agent_id: searchParams.get('assigned_agent_id') || undefined,
      source: searchParams.get('source') as any || undefined,
      search: searchParams.get('search') || undefined,
      sort_by: searchParams.get('sort_by') as any || 'created_at',
      sort_order: searchParams.get('sort_order') as any || 'desc',
    };
    
    // Build query
    let query = adminDb.collection(COLLECTIONS.LEADS) as FirebaseFirestore.Query;
    
    // Role-based filtering
    if (user.role === 'agent') {
      // Agents only see their own leads
      query = query.where('assigned_agent_id', '==', user.uid);
    }
    // Staff and admin see all (staff filtering by linked_agents happens in code)
    
    // Apply filters
    if (params.is_exclusive !== undefined) {
      query = query.where('is_exclusive', '==', params.is_exclusive);
    }
    
    if (params.stage_id) {
      query = query.where('current_stage_id', '==', params.stage_id);
    }
    
    if (params.assigned_agent_id && user.role !== 'agent') {
      query = query.where('assigned_agent_id', '==', params.assigned_agent_id);
    }
    
    if (params.source) {
      query = query.where('source', '==', params.source);
    }
    
    // Apply sorting
    const sortField = params.sort_by || 'created_at';
    const sortOrder = params.sort_order || 'desc';
    query = query.orderBy(sortField, sortOrder);
    
    // Apply cursor pagination
    if (params.cursor) {
      const cursorDoc = await adminDb.collection(COLLECTIONS.LEADS).doc(params.cursor).get();
      if (cursorDoc.exists) {
        query = query.startAfter(cursorDoc);
      }
    }
    
    // Apply limit (+1 to check if there are more)
    query = query.limit(params.limit! + 1);
    
    // Execute query
    const snapshot = await query.get();
    
    // Process results
    const leads: Lead[] = [];
    let hasMore = false;
    
    snapshot.docs.forEach((doc, index) => {
      if (index < params.limit!) {
        leads.push({ id: doc.id, ...doc.data() } as Lead);
      } else {
        hasMore = true;
      }
    });
    
    // Apply search filter in memory (Firestore doesn't support full-text search)
    let filteredLeads = leads;
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filteredLeads = leads.filter(lead => 
        lead.first_name?.toLowerCase().includes(searchLower) ||
        lead.last_name?.toLowerCase().includes(searchLower) ||
        lead.phone?.includes(params.search!) ||
        lead.email?.toLowerCase().includes(searchLower) ||
        lead.property_address?.toLowerCase().includes(searchLower)
      );
    }
    
    const response: GetLeadsResponse = {
      items: filteredLeads,
      has_more: hasMore,
      next_cursor: hasMore && leads.length > 0 ? leads[leads.length - 1].id : undefined,
      total_count: filteredLeads.length,
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/leads
 * Create a new lead
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    const body: CreateLeadRequest = await request.json();
    
    // Validate required fields
    if (!body.first_name || !body.phone) {
      return NextResponse.json(
        { error: 'First name and phone are required' },
        { status: 400 }
      );
    }
    
    // Validate and normalize phone
    if (!isValidPhone(body.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }
    
    const normalizedPhone = normalizePhone(body.phone);
    
    // Check for duplicate by phone
    const existingLead = await adminDb
      .collection(COLLECTIONS.LEADS)
      .where('phone', '==', normalizedPhone)
      .limit(1)
      .get();
    
    if (!existingLead.empty) {
      return NextResponse.json(
        { error: 'A lead with this phone number already exists', existing_id: existingLead.docs[0].id },
        { status: 409 }
      );
    }
    
    // Create lead document
    const leadData: Omit<Lead, 'id'> = {
      first_name: body.first_name,
      last_name: body.last_name || '',
      phone: normalizedPhone,
      email: body.email,
      source: body.source || 'manual',
      is_exclusive: body.is_exclusive ?? false,
      assigned_agent_id: body.assigned_agent_id || user.uid,
      created_by_id: user.uid,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
      current_stage_id: 'lead',
      current_stage_name: 'Lead',
      follow_up_count: 0,
      property_address: body.property_address,
    };
    
    const docRef = await adminDb.collection(COLLECTIONS.LEADS).add(leadData);
    
    // Create opportunity in default stage
    await adminDb.collection(COLLECTIONS.OPPORTUNITIES).add({
      lead_id: docRef.id,
      stage_id: 'lead',
      stage_entered_at: Timestamp.now(),
      is_exclusive: leadData.is_exclusive,
      assigned_agent_id: leadData.assigned_agent_id,
      created_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    });
    
    // Create activity for lead creation
    await adminDb.collection(COLLECTIONS.ACTIVITIES).add({
      lead_id: docRef.id,
      type: 'system',
      content: 'Lead created',
      created_by_id: user.uid,
      created_at: Timestamp.now(),
    });
    
    // Return the created lead
    const createdLead = await docRef.get();
    
    return NextResponse.json(
      { id: docRef.id, ...createdLead.data() },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating lead:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}
