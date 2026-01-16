export { AuthProvider, useAuth, useRequireAuth, useRequireExclusiveAccess } from './client';
export { verifyAuth, requireAuth, requireRole, requireExclusiveAccess, AuthError, canAccessLead } from './server';
export type { AuthenticatedUser, AuthResult } from './server';
