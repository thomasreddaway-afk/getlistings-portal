/**
 * Pipeline Kanban API
 * 
 * GET /api/pipeline/kanban - Get full kanban board data
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { requireExclusiveAccess, AuthError } from '@/lib/auth/server';
import { GetKanbanResponse, KanbanColumn, KanbanCard } from '@/types/api';
import { PipelineConfig, DEFAULT_PIPELINE_CONFIG } from '@/types/config';
import { Opportunity, Lead, Property } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const user = await requireExclusiveAccess(request);
    
    // Get pipeline config
    const configDoc = await adminDb.collection(COLLECTIONS.CONFIG).doc('pipeline').get();
    const pipelineConfig: PipelineConfig = configDoc.exists 
      ? (configDoc.data()?.data as PipelineConfig)
      : DEFAULT_PIPELINE_CONFIG;
    
    // Parse query params
    const searchParams = request.nextUrl.searchParams;
    const limitPerColumn = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const excludeTerminal = searchParams.get('exclude_terminal') === 'true';
    
    // Get stages to show
    let stages = pipelineConfig.stages;
    if (excludeTerminal) {
      stages = stages.filter(s => !s.is_terminal);
    }
    
    // Build kanban columns
    const columns: KanbanColumn[] = await Promise.all(
      stages.map(async (stage) => {
        // Build query based on user role
        let query = adminDb
          .collection(COLLECTIONS.OPPORTUNITIES)
          .where('stage_id', '==', stage.id)
          .orderBy('updated_at', 'desc')
          .limit(limitPerColumn);
        
        if (user.role === 'agent') {
          query = query.where('assigned_agent_id', '==', user.uid);
        }
        
        const snapshot = await query.get();
        
        // Get opportunities with related data
        const cards: KanbanCard[] = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const opportunity = { id: doc.id, ...doc.data() } as Opportunity;
            
            // Get lead
            const leadDoc = await adminDb.collection(COLLECTIONS.LEADS).doc(opportunity.lead_id).get();
            const lead = leadDoc.exists 
              ? { id: leadDoc.id, ...leadDoc.data() } as Lead
              : null;
            
            // Get property if linked
            let property: Property | undefined;
            if (opportunity.property_id) {
              const propertyDoc = await adminDb.collection(COLLECTIONS.PROPERTIES).doc(opportunity.property_id).get();
              if (propertyDoc.exists) {
                property = { id: propertyDoc.id, ...propertyDoc.data() } as Property;
              }
            }
            
            return {
              opportunity,
              lead: lead!,
              property,
            };
          })
        );
        
        // Filter out any cards with missing leads
        const validCards = cards.filter(c => c.lead !== null);
        
        // Calculate totals
        let totalValue = 0;
        validCards.forEach(card => {
          if (card.opportunity.expected_value) {
            totalValue += card.opportunity.expected_value;
          }
        });
        
        return {
          stage,
          count: snapshot.size,
          total_value: totalValue,
          opportunities: validCards,
        };
      })
    );
    
    const response: GetKanbanResponse = {
      columns,
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching kanban:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch kanban data' },
      { status: 500 }
    );
  }
}
