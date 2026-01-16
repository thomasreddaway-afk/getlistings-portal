/**
 * Pipeline API Routes
 * 
 * GET /api/pipeline/stages - Get all stages with counts
 * GET /api/pipeline/kanban - Get kanban board data
 * POST /api/pipeline/move - Move opportunity to a different stage
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { requireAuth, requireExclusiveAccess, AuthError } from '@/lib/auth/server';
import { GetStagesResponse, GetKanbanResponse, MoveOpportunityRequest, KanbanColumn, KanbanCard } from '@/types/api';
import { PipelineConfig, DEFAULT_PIPELINE_CONFIG } from '@/types/config';
import { Opportunity, Lead, Property, Activity } from '@/types';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * GET /api/pipeline/stages
 * Get all stages with counts
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireExclusiveAccess(request);
    
    // Get pipeline config
    const configDoc = await adminDb.collection(COLLECTIONS.CONFIG).doc('pipeline').get();
    const pipelineConfig: PipelineConfig = configDoc.exists 
      ? (configDoc.data()?.data as PipelineConfig)
      : DEFAULT_PIPELINE_CONFIG;
    
    // Get counts per stage
    const stagesWithCounts = await Promise.all(
      pipelineConfig.stages.map(async (stage) => {
        // Build query based on user role
        let query = adminDb
          .collection(COLLECTIONS.OPPORTUNITIES)
          .where('stage_id', '==', stage.id);
        
        if (user.role === 'agent') {
          query = query.where('assigned_agent_id', '==', user.uid);
        }
        
        const snapshot = await query.get();
        
        // Calculate total value
        let totalValue = 0;
        snapshot.docs.forEach(doc => {
          const opp = doc.data() as Opportunity;
          if (opp.expected_value) {
            totalValue += opp.expected_value;
          }
        });
        
        return {
          ...stage,
          count: snapshot.size,
          total_value: totalValue,
        };
      })
    );
    
    const response: GetStagesResponse = {
      stages: stagesWithCounts,
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching stages:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch stages' },
      { status: 500 }
    );
  }
}
