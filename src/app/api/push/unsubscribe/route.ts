/**
 * Push Unsubscribe API Route
 * 
 * POST /api/push/unsubscribe - Remove push subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const body = await request.json();
    
    if (!body.endpoint) {
      return NextResponse.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }

    // Forward to backend API
    const response = await fetch(`${API_BASE_URL}/push/unsubscribe`, {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('Authorization') || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.uid,
        endpoint: body.endpoint,
      }),
    });

    if (!response.ok) {
      console.error('[Push Unsubscribe] Backend error:', response.status);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Push Unsubscribe] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove subscription' },
      { status: error.status || 500 }
    );
  }
}
