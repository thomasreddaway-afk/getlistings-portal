/**
 * Client-side Authentication Hook
 * 
 * React hook for managing authentication state.
 * Uses Firebase phone auth (existing auth system).
 */

'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, COLLECTIONS } from '@/lib/firebase/client';
import { User, UserRole } from '@/types';

/**
 * Auth context value
 */
interface AuthContextValue {
  // State
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  
  // Auth methods
  sendOTP: (phoneNumber: string) => Promise<void>;
  verifyOTP: (code: string) => Promise<void>;
  signOut: () => Promise<void>;
  
  // Helpers
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  hasExclusiveAccess: boolean;
  getIdToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Auth Provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Listen to Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      
      if (fbUser) {
        // Fetch user profile from Firestore
        try {
          const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, fbUser.uid));
          if (userDoc.exists()) {
            setUser({ id: userDoc.id, ...userDoc.data() } as User);
          } else {
            // User exists in Firebase Auth but not in Firestore
            // This shouldn't happen in normal flow, but handle gracefully
            setUser(null);
            setError('User profile not found');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Failed to load user profile');
        }
      } else {
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Send OTP to phone number
  const sendOTP = useCallback(async (phoneNumber: string) => {
    setError(null);
    setLoading(true);
    
    try {
      // Ensure recaptcha container exists
      const recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        throw new Error('Recaptcha container not found');
      }
      
      // Initialize recaptcha
      const recaptcha = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
      
      // Send OTP
      const result = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      setError(err.message || 'Failed to send verification code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify OTP code
  const verifyOTP = useCallback(async (code: string) => {
    if (!confirmationResult) {
      throw new Error('No pending verification');
    }
    
    setError(null);
    setLoading(true);
    
    try {
      await confirmationResult.confirm(code);
      // Firebase auth state listener will handle the rest
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      setError(err.message || 'Invalid verification code');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [confirmationResult]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setConfirmationResult(null);
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message || 'Failed to sign out');
    }
  }, []);

  // Get ID token for API calls
  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!firebaseUser) return null;
    try {
      return await firebaseUser.getIdToken();
    } catch (err) {
      console.error('Error getting ID token:', err);
      return null;
    }
  }, [firebaseUser]);

  const value: AuthContextValue = {
    user,
    firebaseUser,
    loading,
    error,
    sendOTP,
    verifyOTP,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    hasExclusiveAccess: user?.has_exclusive_access ?? false,
    getIdToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use auth context
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook that requires authentication
 * Redirects to login if not authenticated
 */
export function useRequireAuth() {
  const auth = useAuth();
  
  useEffect(() => {
    if (!auth.loading && !auth.isAuthenticated) {
      // Could redirect to login page here
      window.location.href = '/login';
    }
  }, [auth.loading, auth.isAuthenticated]);
  
  return auth;
}

/**
 * Hook that requires exclusive access
 */
export function useRequireExclusiveAccess() {
  const auth = useRequireAuth();
  
  useEffect(() => {
    if (!auth.loading && auth.isAuthenticated && !auth.hasExclusiveAccess) {
      // Redirect to upgrade page
      window.location.href = '/upgrade';
    }
  }, [auth.loading, auth.isAuthenticated, auth.hasExclusiveAccess]);
  
  return auth;
}
