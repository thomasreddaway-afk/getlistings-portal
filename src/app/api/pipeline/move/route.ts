/**
 * Pipeline Move API
 * 
 * POST /api/pipeline/move - Move opportunity to a different stage
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { requireAuth, canAccessLead, AuthError } from '@/lib/auth/server';
import { MoveOpportunityRequest } from '@/types/api';
import { PipelineConfig, DEFAULT_PIPELINE_CONFIG } from '@/types/config';
import { Opportunity, Lead, User } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    const body: MoveOpportunityRequest = await request.json();
    
    // Validate required fields
    if (!body.opportunity_id || !body.to_stage_id) {
      return NextResponse.json(
        { error: 'opportunity_id and to_stage_id are required' },
        { status: 400 }
      );
    }
    
    // Get the opportunity
    const oppRef = adminDb.collection(COLLECTIONS.OPPORTUNITIES).doc(body.opportunity_id);
    const oppDoc = await oppRef.get();
    
    if (!oppDoc.exists) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      );
    }
    
    const opportunity = { id: oppDoc.id, ...oppDoc.data() } as Opportunity;
    
    // Get the lead to check access
    const leadDoc = await adminDb.collection(COLLECTIONS.LEADS).doc(opportunity.lead_id).get();
    
    if (!leadDoc.exists) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    const lead = leadDoc.data() as Lead;
    
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
    
    // Get pipeline config to validate stage
    const configDoc = await adminDb.collection(COLLECTIONS.CONFIG).doc('pipeline').get();
    const pipelineConfig: PipelineConfig = configDoc.exists 
      ? (configDoc.data()?.data as PipelineConfig)
      : DEFAULT_PIPELINE_CONFIG;
    
    const toStage = pipelineConfig.stages.find(s => s.id === body.to_stage_id);
    const fromStage = pipelineConfig.stages.find(s => s.id === opportunity.stage_id);
    
    if (!toStage) {
      return NextResponse.json(
        { error: 'Invalid stage' },
        { status: 400 }
      );
    }
    
    // Don't move if already in same stage
    if (opportunity.stage_id === body.to_stage_id) {
      return NextResponse.json({
        id: opportunity.id,
        ...opportunity,
        message: 'Already in this stage',
      });
    }
    
    // Update the opportunity
    const updates: Partial<Opportunity> = {
      stage_id: body.to_stage_id,
      previous_stage_id: opportunity.stage_id,
      stage_entered_at: Timestamp.now(),
      updated_at: Timestamp.now(),
    };
    
    // If moving to terminal stage, set outcome
    if (toStage.is_terminal) {
      updates.outcome = toStage.terminal_type || 'won';
      updates.closed_at = Timestamp.now();
    }
    
    await oppRef.update(updates);
    
    // Update lead's current stage
    await adminDb.collection(COLLECTIONS.LEADS).doc(opportunity.lead_id).update({
      current_stage_id: body.to_stage_id,
      current_stage_name: toStage.name,
      updated_at: Timestamp.now(),
    });
    
    // Create stage change activity
    await adminDb.collection(COLLECTIONS.ACTIVITIES).add({
      lead_id: opportunity.lead_id,
      opportunity_id: opportunity.id,
      type: 'stage_change',
      content: body.note || `Moved from ${fromStage?.name || 'Unknown'} to ${toStage.name}`,
      metadata: {
        from_stage_id: opportunity.stage_id,
        from_stage_name: fromStage?.name,
        to_stage_id: body.to_stage_id,
        to_stage_name: toStage.name,
      },
      created_by_id: user.uid,
      created_at: Timestamp.now(),
    });
    
    // Get updated opportunity
    const updatedDoc = await oppRef.get();
    
    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedDoc.data(),
    });
    
  } catch (error) {
    console.error('Error moving opportunity:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to move opportunity' },
      { status: 500 }
    );
  }
}
