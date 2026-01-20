/**
 * Authentication Utilities
 * 
 * Server-side auth verification and session management.
 * Uses JWT tokens from MongoDB API (same as demo.html)
 */

import { NextRequest } from 'next/server';
import { User, UserRole } from '@/types';

const API_BASE_URL = 'https://api.prop.deals/v1';

/**
 * Decoded token with user info
 */
export interface AuthenticatedUser {
  uid: string;
  phone?: string;
  email?: string;
  role?: UserRole;
  has_exclusive_access?: boolean;
}

/**
 * Auth result from verification
 */
export interface AuthResult {
  authenticated: boolean;
  user?: AuthenticatedUser;
  error?: string;
}

/**
 * Verify JWT token from request by calling the API
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'Missing or invalid Authorization header',
      };
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token by calling the profile endpoint
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return {
        authenticated: false,
        error: 'Invalid or expired token',
      };
    }
    
    const userData = await response.json();
    
    return {
      authenticated: true,
      user: {
        uid: userData._id || userData.id,
        phone: userData.phoneNumber || userData.phone,
        email: userData.email,
        role: userData.role as UserRole,
        has_exclusive_access: userData.has_exclusive_access || userData.hasExclusiveAccess,
      },
    };
  } catch (error) {
    console.error('Auth verification failed:', error);
    return {
      authenticated: false,
      error: 'Invalid or expired token',
    };
  }
}

/**
 * Require authentication - throws if not authenticated
 */
export async function requireAuth(request: NextRequest): Promise<AuthenticatedUser> {
  const result = await verifyAuth(request);
  
  if (!result.authenticated || !result.user) {
    throw new AuthError(result.error || 'Not authenticated', 401);
  }
  
  return result.user;
}

/**
 * Require specific role
 */
export async function requireRole(
  request: NextRequest, 
  allowedRoles: UserRole[]
): Promise<AuthenticatedUser> {
  const user = await requireAuth(request);
  
  if (!user.role || !allowedRoles.includes(user.role)) {
    throw new AuthError('Insufficient permissions', 403);
  }
  
  return user;
}

/**
 * Check if user can access exclusive leads
 */
export async function requireExclusiveAccess(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await requireAuth(request);
  
  if (!user.has_exclusive_access) {
    throw new AuthError('Exclusive access required', 403);
  }
  
  return user;
}

/**
 * Custom auth error class
 */
export class AuthError extends Error {
  constructor(
    message: string,
    public statusCode: number = 401
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

/**
 * Check if user can access a specific lead
 * Agents can only see their own leads, staff can see linked agents' leads, admin sees all
 */
export function canAccessLead(
  user: AuthenticatedUser,
  leadAssignedAgentId?: string,
  linkedAgentIds?: string[]
): boolean {
  // Admin sees everything
  if (user.role === 'admin') {
    return true;
  }
  
  // Staff can see their linked agents' leads
  if (user.role === 'staff' && linkedAgentIds) {
    return linkedAgentIds.includes(leadAssignedAgentId || '');
  }
  
  // Agents can only see their own leads
  if (user.role === 'agent') {
    return leadAssignedAgentId === user.uid;
  }
  
  return false;
}
