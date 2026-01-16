/**
 * Firebase Client Configuration
 * 
 * Client-side Firebase initialization for browser usage.
 * Uses environment variables for configuration.
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (singleton pattern for Next.js)
function getFirebaseApp(): FirebaseApp {
  if (getApps().length === 0) {
    return initializeApp(firebaseConfig);
  }
  return getApps()[0];
}

// Export initialized services
export const app: FirebaseApp = getFirebaseApp();
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Collection names (centralized for consistency)
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
