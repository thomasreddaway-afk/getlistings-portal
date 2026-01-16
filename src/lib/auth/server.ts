/**
 * Authentication Utilities
 * 
 * Server-side auth verification and session management.
 * Integrates with existing phone-based Firebase auth.
 */

import { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { User, UserRole } from '@/types';

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
 * Verify Firebase ID token from request
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
    
    // Verify the token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    return {
      authenticated: true,
      user: {
        uid: decodedToken.uid,
        phone: decodedToken.phone_number,
        email: decodedToken.email,
        role: decodedToken.role as UserRole,
        has_exclusive_access: decodedToken.has_exclusive_access as boolean,
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
