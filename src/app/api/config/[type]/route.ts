/**
 * Config API Routes
 * 
 * GET /api/config/[type] - Get config by type
 * PUT /api/config/[type] - Update config (admin only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminDb, COLLECTIONS } from '@/lib/firebase/admin';
import { requireAuth, requireRole, AuthError } from '@/lib/auth/server';
import { Config, ConfigType, ConfigData, PipelineConfig, DEFAULT_PIPELINE_CONFIG } from '@/types/config';
import { UpdateConfigRequest, UpdateConfigResponse } from '@/types/api';
import { Timestamp } from 'firebase-admin/firestore';

interface RouteParams {
  params: { type: string };
}

const VALID_CONFIG_TYPES: ConfigType[] = ['pipeline', 'scripts', 'rules', 'copy'];

/**
 * GET /api/config/[type]
 * Get configuration by type
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await requireAuth(request);
    const { type } = params;
    
    if (!VALID_CONFIG_TYPES.includes(type as ConfigType)) {
      return NextResponse.json(
        { error: 'Invalid config type' },
        { status: 400 }
      );
    }
    
    const configDoc = await adminDb.collection(COLLECTIONS.CONFIG).doc(type).get();
    
    if (!configDoc.exists) {
      // Return default config for pipeline
      if (type === 'pipeline') {
        return NextResponse.json({
          id: 'pipeline',
          data: DEFAULT_PIPELINE_CONFIG,
          version: 0,
        });
      }
      
      return NextResponse.json(
        { error: 'Config not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: configDoc.id,
      ...configDoc.data(),
    });
    
  } catch (error) {
    console.error('Error fetching config:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch config' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/config/[type]
 * Update configuration (admin only)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Only admins can update config
    const user = await requireRole(request, ['admin']);
    const { type } = params;
    
    if (!VALID_CONFIG_TYPES.includes(type as ConfigType)) {
      return NextResponse.json(
        { error: 'Invalid config type' },
        { status: 400 }
      );
    }
    
    const body: UpdateConfigRequest = await request.json();
    
    if (!body.data) {
      return NextResponse.json(
        { error: 'Data is required' },
        { status: 400 }
      );
    }
    
    const configRef = adminDb.collection(COLLECTIONS.CONFIG).doc(type);
    const configDoc = await configRef.get();
    
    // Optimistic locking - check version
    if (configDoc.exists) {
      const currentVersion = configDoc.data()?.version || 0;
      if (body.version !== undefined && body.version !== currentVersion) {
        return NextResponse.json(
          { error: 'Config has been modified. Please refresh and try again.', current_version: currentVersion },
          { status: 409 }
        );
      }
    }
    
    const newVersion = (configDoc.data()?.version || 0) + 1;
    
    // Validate config based on type
    if (type === 'pipeline') {
      const pipelineData = body.data as PipelineConfig;
      if (!pipelineData.stages || pipelineData.stages.length === 0) {
        return NextResponse.json(
          { error: 'Pipeline must have at least one stage' },
          { status: 400 }
        );
      }
      if (!pipelineData.default_stage_id) {
        return NextResponse.json(
          { error: 'Default stage is required' },
          { status: 400 }
        );
      }
    }
    
    // Update or create config
    await configRef.set({
      id: type,
      data: body.data,
      updated_by_id: user.uid,
      updated_at: Timestamp.now(),
      version: newVersion,
    });
    
    const response: UpdateConfigResponse = {
      success: true,
      version: newVersion,
    };
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error updating config:', error);
    
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update config' },
      { status: 500 }
    );
  }
}
