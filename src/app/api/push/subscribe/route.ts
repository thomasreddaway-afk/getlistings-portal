/**
 * Push Subscribe API Route
 * 
 * POST /api/push/subscribe - Save push subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    
    if (!body.subscription) {
      return NextResponse.json(
        { error: 'Subscription data is required' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${API_BASE_URL}/push/subscribe`, {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.uid,
        subscription: body.subscription,
        userAgent: request.headers.get('user-agent') || '',
      }),
    });

    if (!response.ok) {
      console.error('[Push Subscribe] Backend error:', response.status);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Push Subscribe] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save subscription' },
      { status: error.status || 500 }
    );
  }
}
