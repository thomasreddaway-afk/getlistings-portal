/**
 * Referrals API Routes
 * 
 * GET /api/referrals/stats - Get user's referral stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

/**
 * GET /api/referrals/stats
 * Get the current user's referral statistics
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    // Forward to backend API
    const response = await fetch(`${API_BASE_URL}/referrals/user/${user.uid}`, {
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Return default stats if backend not available
      return NextResponse.json({
        referralCode: user.uid.slice(0, 8).toUpperCase(),
        totalReferrals: 0,
        pendingReferrals: 0,
        completedReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        referrals: [],
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[Referrals API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch referral stats' },
      { status: error.status || 500 }
    );
  }
}
