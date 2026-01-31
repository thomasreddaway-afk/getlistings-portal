/**
 * API Client for prop.deals MongoDB Backend
 * 
 * This mirrors the approach in demo.html - calling api.prop.deals directly
 * with JWT tokens stored in localStorage.
 * 
 * Set NEXT_PUBLIC_API_URL environment variable to override the API base URL.
 * For local testing: NEXT_PUBLIC_API_URL=http://localhost:3200/v1
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

/**
 * Get the stored auth token
 */
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  // Check both possible token keys - propdeals_jwt is primary, propdeals_token is fallback
  return localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
}

/**
 * API Error class for typed error handling
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Make an authenticated API request with timeout
 */
export async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: unknown,
  timeoutMs: number = 30000 // 30 second default timeout
): Promise<T> {
  const token = getToken();
  
  if (!token) {
    throw new ApiError('Not authenticated', 401);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-access-token': token,
    },
    signal: controller.signal,
  };

  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }

  console.log('API Request:', method, endpoint);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    clearTimeout(timeoutId);

    console.log('API Response:', response.status, endpoint);

    if (response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('propdeals_jwt');
      localStorage.removeItem('propdeals_token');
      localStorage.removeItem('propdeals_refresh');
      localStorage.removeItem('propdeals_user');
      
      // Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      
      throw new ApiError('Session expired. Please log in again.', 401);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // Handle array of error messages from API validation
      let errorMessage = `API error: ${response.status}`;
      if (Array.isArray(errorData.message)) {
        errorMessage = errorData.message.map((m: any) => m.message || String(m)).join(', ');
      } else if (typeof errorData.message === 'string') {
        errorMessage = errorData.message;
      }
      throw new ApiError(
        errorMessage,
        response.status,
        errorData
      );
    }

    return response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(`Request timeout after ${timeoutMs / 1000}s: ${endpoint}`, 408);
    }
    throw err;
  }
}

// ===== API ENDPOINTS =====

/**
 * Lead filters for getAllLeads
 */
export interface LeadFilters {
  page?: number;
  perPage?: number;
  search?: string;
  placeId?: string;
  distance?: number;
  suburbs?: string[];
  sellingScore?: {
    min: number;
    max: number;
  };
  insights?: {
    garageSale?: boolean;
    listedForSale?: boolean;
    listedForRent?: boolean;
    requested?: boolean;
    neighbourSold?: boolean;
    recentlySold?: boolean;
    socialTag?: boolean;
    fsboListing?: boolean;
  };
}

/**
 * Lead response from API
 */
export interface LeadResponse {
  leads: unknown[];
  total: number;
  page: number;
  perPage: number;
}

/**
 * Get all leads with optional filters
 */
export async function getAllLeads(options: LeadFilters = {}): Promise<LeadResponse> {
  const body: LeadFilters = {
    page: options.page || 1,
    perPage: options.perPage || 20,
  };

  if (options.search) {
    body.search = options.search;
  }

  if (options.placeId) {
    body.placeId = options.placeId;
    body.distance = options.distance || 5000;
  }

  if (options.suburbs && options.suburbs.length > 0) {
    body.suburbs = options.suburbs.slice(0, 4);
  }

  if (options.sellingScore) {
    body.sellingScore = {
      min: options.sellingScore.min || 0,
      max: options.sellingScore.max || 100,
    };
  }

  if (options.insights) {
    body.insights = options.insights;
  }

  return apiRequest<LeadResponse>('/lead/all', 'POST', body);
}

/**
 * Inbox/chat filters
 */
export interface InboxFilters {
  page?: number;
  perPage?: number;
  isCompleted?: boolean;
}

/**
 * Inbox response from API
 */
export interface InboxResponse {
  inboxData: unknown[];
  total: number;
}

/**
 * Get inbox/branding opportunities
 */
export async function getInbox(options: InboxFilters = {}): Promise<InboxResponse> {
  const body = {
    page: options.page || 1,
    perPage: options.perPage || 20,
    isCompleted: options.isCompleted || false,
  };

  return apiRequest<InboxResponse>('/chat', 'POST', body);
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<unknown> {
  return apiRequest('/user/profile', 'GET');
}

/**
 * Get user's subscribed suburbs
 */
export async function getSubscribedSuburbs(): Promise<string[]> {
  const profile = await getUserProfile() as { subscribedSuburbs?: string[] };
  return profile.subscribedSuburbs || [];
}

/**
 * Update user's subscribed suburbs
 */
export async function updateSubscribedSuburbs(suburbs: string[]): Promise<void> {
  await apiRequest('/stripe-payment/update-suburbs', 'POST', {
    subscribedSuburbs: suburbs,
  });
}

/**
 * Get referral leaderboard
 */
export interface LeaderboardEntry {
  userId: string;
  name: string;
  referralCount: number;
  rank: number;
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  return apiRequest<LeaderboardEntry[]>('/referrals/leaderboard', 'GET');
}
