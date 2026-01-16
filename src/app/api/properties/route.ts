import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import { verifyAuth } from '@/lib/auth/server';
import type { Property } from '@/types/entities';

/**
 * GET /api/properties
 * List properties with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 100);
    const search = searchParams.get('search');
    const minScore = searchParams.get('minScore');

    // Build query
    let query = adminDb.collection('properties')
      .orderBy('seller_score', 'desc');

    // Apply min score filter
    if (minScore) {
      query = query.where('seller_score', '>=', parseInt(minScore));
    }

    // Get total count (without pagination)
    const countSnapshot = await query.count().get();
    const total = countSnapshot.data().count;

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.offset(offset).limit(limit);

    // Execute query
    const snapshot = await query.get();

    let properties: Property[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      created_at: doc.data().created_at?.toDate?.() || new Date(doc.data().created_at),
      updated_at: doc.data().updated_at?.toDate?.() || new Date(doc.data().updated_at),
    })) as Property[];

    // Apply search filter (client-side for address searching)
    if (search) {
      const searchLower = search.toLowerCase();
      properties = properties.filter(p => 
        p.full_address.toLowerCase().includes(searchLower) ||
        p.suburb?.toLowerCase().includes(searchLower) ||
        p.postcode?.includes(search)
      );
    }

    return NextResponse.json({
      properties,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/properties
 * Create a new property
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request);
    if (!authResult.authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.full_address) {
      return NextResponse.json(
        { error: 'full_address is required' },
        { status: 400 }
      );
    }

    const now = new Date();

    const propertyData: Omit<Property, 'id'> = {
      full_address: body.full_address,
      street_number: body.street_number || null,
      street_name: body.street_name || null,
      suburb: body.suburb || null,
      state: body.state || 'NSW',
      postcode: body.postcode || null,
      property_type: body.property_type || null,
      bedrooms: body.bedrooms || null,
      bathrooms: body.bathrooms || null,
      parking: body.parking || null,
      land_size: body.land_size || null,
      estimated_value: body.estimated_value || null,
      last_sale_price: body.last_sale_price || null,
      last_sale_date: body.last_sale_date || null,
      seller_score: body.seller_score || 50,
      score_factors: body.score_factors || [],
      linked_lead_ids: body.linked_lead_ids || [],
      notes: body.notes || null,
      created_at: now,
      updated_at: now,
    };

    const docRef = await adminDb.collection('properties').add(propertyData);

    return NextResponse.json({
      id: docRef.id,
      ...propertyData,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
