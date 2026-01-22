/**
 * Client-side Authentication Hook
 * 
 * React hook for managing authentication state.
 * Uses Twilio OTP + MongoDB API (same as demo.html)
 */

'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

/**
 * Auth context value
 */
interface AuthContextValue {
  // State
  user: User | null;
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
  getToken: () => string | null;
  pendingPhoneNumber: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Format phone number for API (Australian format)
 */
function formatPhoneNumber(phone: string): string {
  let formatted = phone.replace(/\s+/g, '').replace(/^\+/, '');
  if (formatted.startsWith('0')) {
    formatted = '61' + formatted.substring(1);
  }
  if (!formatted.startsWith('61')) {
    formatted = '61' + formatted;
  }
  return formatted;
}

/**
 * Auth Provider component
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingPhoneNumber, setPendingPhoneNumber] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
    const savedUser = localStorage.getItem('propdeals_user');
    
    if (token && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('propdeals_jwt');
        localStorage.removeItem('propdeals_token');
        localStorage.removeItem('propdeals_user');
      }
    }
    
    setLoading(false);
  }, []);

  // Send OTP to phone number via Twilio
  const sendOTP = useCallback(async (phoneNumber: string) => {
    setError(null);
    setLoading(true);
    
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      const response = await fetch(`${API_BASE_URL}/auth/get-code-VBAjxKD7`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send OTP');
      }
      
      // Store formatted phone for verification step
      setPendingPhoneNumber(formattedPhone);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send verification code';
      console.error('Error sending OTP:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Verify OTP code
  const verifyOTP = useCallback(async (code: string) => {
    if (!pendingPhoneNumber) {
      throw new Error('No pending verification. Please request OTP first.');
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-9G8LNToV`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: pendingPhoneNumber, 
          code 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Invalid OTP code');
      }
      
      // Store tokens
      if (data.accessToken) {
        localStorage.setItem('propdeals_jwt', data.accessToken);
        
        if (data.refreshToken) {
          localStorage.setItem('propdeals_refresh', data.refreshToken);
        }
      }
      
      // Store and set user profile
      const userProfile = data.user || data.profile || data.userData;
      if (userProfile) {
        localStorage.setItem('propdeals_user', JSON.stringify(userProfile));
        setUser(userProfile);
      }
      
      // Clear pending phone
      setPendingPhoneNumber(null);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Invalid verification code';
      console.error('Error verifying OTP:', err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [pendingPhoneNumber]);

  // Sign out
  const signOut = useCallback(async () => {
    localStorage.removeItem('propdeals_jwt');
    localStorage.removeItem('propdeals_token');
    localStorage.removeItem('propdeals_refresh');
    localStorage.removeItem('propdeals_user');
    setUser(null);
    setPendingPhoneNumber(null);
    setError(null);
  }, []);

  // Get stored token for API calls
  const getToken = useCallback((): string | null => {
    return localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    error,
    sendOTP,
    verifyOTP,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    hasExclusiveAccess: user?.has_exclusive_access ?? false,
    getToken,
    pendingPhoneNumber,
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
      window.location.href = '/upgrade';
    }
  }, [auth.loading, auth.isAuthenticated, auth.hasExclusiveAccess]);
  
  return auth;
}
