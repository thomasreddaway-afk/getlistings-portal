/**
 * Firebase Admin Configuration
 * 
 * Server-side Firebase Admin SDK initialization.
 * Used in API routes and server components.
 */

import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

function getFirebaseAdmin(): App {
  if (getApps().length === 0) {
    // Parse the private key (handles escaped newlines from env)
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }
  return getApps()[0];
}

// Initialize admin app
const adminApp = getFirebaseAdmin();

// Export admin services
export const adminAuth: Auth = getAuth(adminApp);
export const adminDb: Firestore = getFirestore(adminApp);

// Collection references
export const COLLECTIONS = {
  LEADS: 'leads',
  PROPERTIES: 'properties',
  OPPORTUNITIES: 'opportunities',
  ACTIVITIES: 'activities',
  USERS: 'users',
  RAW_LEADS: 'raw_leads',
  CONFIG: 'config',
  IMPORTS: 'imports',
} as const;

/**
 * Get a typed collection reference
 */
export function getCollection(name: keyof typeof COLLECTIONS) {
  return adminDb.collection(COLLECTIONS[name]);
}
