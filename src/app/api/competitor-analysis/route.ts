import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth/server';
import { generateMockCompetitorAnalysis, AVAILABLE_SUBURBS } from '@/lib/competitor-analysis/mock-data';
import type { CompetitorAnalysisResponse } from '@/types/competitor-analysis';

/**
 * GET /api/competitor-analysis
 * 
 * Fetch competitor analysis for a suburb.
 * Query params:
 *   - suburb: string (required)
 * 
 * Returns mock data for now, structured for easy backend integration later.
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { status: 'error', data: null, error: 'Unauthorized' } as CompetitorAnalysisResponse,
        { status: 401 }
      );
    }

    // Get suburb from query params
    const { searchParams } = new URL(request.url);
    const suburb = searchParams.get('suburb') || 'Paddington';

    // Validate suburb
    if (!AVAILABLE_SUBURBS.includes(suburb)) {
      return NextResponse.json(
        { 
          status: 'error', 
          data: null, 
          error: `Invalid suburb. Available: ${AVAILABLE_SUBURBS.join(', ')}` 
        } as CompetitorAnalysisResponse,
        { status: 400 }
      );
    }

    // Generate mock data (replace with real data fetch later)
    const data = generateMockCompetitorAnalysis(
      auth.user?.uid || 'demo-user',
      suburb,
      AVAILABLE_SUBURBS.slice(0, 3) // User's suburbs
    );

    return NextResponse.json({
      status: 'ready',
      data,
    } as CompetitorAnalysisResponse);

  } catch (error) {
    console.error('Competitor analysis error:', error);
    return NextResponse.json(
      { status: 'error', data: null, error: 'Internal server error' } as CompetitorAnalysisResponse,
      { status: 500 }
    );
  }
}

/**
 * POST /api/competitor-analysis/generate
 * 
 * Trigger generation of a new competitor analysis report.
 * In production, this would queue a background job.
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { status: 'error', data: null, error: 'Unauthorized' } as CompetitorAnalysisResponse,
        { status: 401 }
      );
    }

    // Get suburb from body
    const body = await request.json();
    const suburb = body.suburb || 'Paddington';

    // Validate suburb
    if (!AVAILABLE_SUBURBS.includes(suburb)) {
      return NextResponse.json(
        { 
          status: 'error', 
          data: null, 
          error: `Invalid suburb. Available: ${AVAILABLE_SUBURBS.join(', ')}` 
        } as CompetitorAnalysisResponse,
        { status: 400 }
      );
    }

    // Simulate generation delay (in production, this would queue a job)
    // For now, just return the mock data immediately

    const data = generateMockCompetitorAnalysis(
      auth.user?.uid || 'demo-user',
      suburb,
      AVAILABLE_SUBURBS.slice(0, 3)
    );

    return NextResponse.json({
      status: 'ready',
      data,
    } as CompetitorAnalysisResponse);

  } catch (error) {
    console.error('Competitor analysis generation error:', error);
    return NextResponse.json(
      { status: 'error', data: null, error: 'Internal server error' } as CompetitorAnalysisResponse,
      { status: 500 }
    );
  }
}
