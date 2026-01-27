'use client';

import { DemoLayout } from '@/components/layout';
import { useAuth } from '@/lib/auth/client';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Check, 
  Clock, 
  MapPin, 
  Award,
  Megaphone,
  Lock,
  RefreshCw
} from 'lucide-react';

// Types for API responses
interface DashboardMetrics {
  unLockedLeadsCount?: number;
  subscribedSuburbs?: number;
  leaderboardPosition?: number;
  marketingOpportunities?: number;
  topLead?: {
    address: string;
    ownerName: string;
    score: number;
    estimatedValue: string;
    estimatedCommission: string;
    signals: string[];
    lastActivity: string;
  };
}

interface Lead {
  _id: string;
  streetAddress: string;
  suburb: string;
  sellingScore: number;
  salePrice?: string;
  garageSale?: boolean;
  listedForSale?: boolean;
  listedForRent?: boolean;
  requested?: boolean;
  neighbourSold?: boolean;
  recentlySold?: boolean;
  socialTag?: boolean;
  fsboListing?: boolean;
  updatedAt: string;
  owner1Name?: string;
  bed?: number;
  bath?: number;
  car?: number;
}

interface ExpiredListing {
  _id: string;
  streetAddress: string;
  suburb: string;
  totalDaysInMarket?: number;
  agentName?: string;
  salePrice?: string;
  note?: string;
}

const signalStyleMap: Record<string, { text: string; color: string }> = {
  garageSale: { text: 'Garage sale', color: 'amber' },
  listedForSale: { text: 'Listed for sale', color: 'green' },
  listedForRent: { text: 'Listed for rent', color: 'cyan' },
  requested: { text: 'Valuation requested', color: 'pink' },
  neighbourSold: { text: 'Neighbour sold', color: 'purple' },
  recentlySold: { text: 'Recently sold', color: 'gray' },
  socialTag: { text: 'Tagged on social', color: 'blue' },
  fsboListing: { text: 'FSBO', color: 'red' },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

function getTagColorClasses(color: string): string {
  const colorMap: Record<string, string> = {
    green: 'bg-green-50 text-green-600 border border-green-200',
    blue: 'bg-blue-50 text-blue-600 border border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border border-amber-200',
    purple: 'bg-purple-50 text-purple-600 border border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border border-orange-200',
    red: 'bg-red-50 text-red-600 border border-red-200',
    pink: 'bg-pink-50 text-pink-600 border border-pink-200',
    cyan: 'bg-cyan-50 text-cyan-600 border border-cyan-200',
    gray: 'bg-gray-50 text-gray-600 border border-gray-200',
  };
  return colorMap[color] || 'bg-gray-50 text-gray-600 border border-gray-200';
}

function getUrgencyColorClasses(daysOnMarket: number | undefined): string {
  const days = daysOnMarket ?? 0;
  if (days > 365) return 'bg-red-100 text-red-700';
  if (days > 180) return 'bg-orange-100 text-orange-700';
  if (days > 90) return 'bg-amber-100 text-amber-700';
  return 'bg-green-100 text-green-700';
}

function getLeadSignals(lead: Lead) {
  const signals: { label: string; color: string }[] = [];
  if (lead.garageSale) signals.push({ label: signalStyleMap.garageSale.text, color: signalStyleMap.garageSale.color });
  if (lead.listedForSale) signals.push({ label: signalStyleMap.listedForSale.text, color: signalStyleMap.listedForSale.color });
  if (lead.requested) signals.push({ label: signalStyleMap.requested.text, color: signalStyleMap.requested.color });
  if (lead.neighbourSold) signals.push({ label: signalStyleMap.neighbourSold.text, color: signalStyleMap.neighbourSold.color });
  if (lead.fsboListing) signals.push({ label: signalStyleMap.fsboListing.text, color: signalStyleMap.fsboListing.color });
  return signals;
}

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`;
  return `${Math.floor(diffMins / 10080)}w ago`;
}

function formatValue(salePrice?: string): string {
  if (!salePrice) return 'Est. value unknown';
  // If already formatted with $, just return with Est. prefix
  if (salePrice.includes('$')) return `Est. ${salePrice}`;
  // Parse number and format with $ and commas
  const numValue = parseFloat(salePrice.replace(/[^0-9.]/g, ''));
  if (isNaN(numValue)) return 'Est. value unknown';
  return `Est. $${numValue.toLocaleString()}`;
}

function calculateCommission(salePrice?: string): string {
  if (!salePrice) return '$0';
  const price = parseFloat(salePrice.replace(/[$,]/g, ''));
  const commission = price * 0.02; // 2% commission
  return `$${Math.round(commission).toLocaleString()}`;
}

// Cache keys for localStorage
const CACHE_KEYS = {
  metrics: 'gl_cache_dashboard_metrics',
  hotLeads: 'gl_cache_dashboard_hotleads',
  expiredListings: 'gl_cache_dashboard_expired',
  timestamp: 'gl_cache_dashboard_ts',
};

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// Module-level flag to prevent duplicate API calls (survives hot reload)
let dashboardLoadingPromise: Promise<void> | null = null;

function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(key);
    const timestamp = localStorage.getItem(CACHE_KEYS.timestamp);
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_DURATION) {
        return JSON.parse(cached);
      }
    }
  } catch (e) {}
  return null;
}

function setCachedData(key: string, data: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
    localStorage.setItem(CACHE_KEYS.timestamp, Date.now().toString());
  } catch (e) {}
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const cachedMetrics = getCachedData<DashboardMetrics>(CACHE_KEYS.metrics);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(cachedMetrics);
  const [hotLeads, setHotLeads] = useState<Lead[]>(() => getCachedData(CACHE_KEYS.hotLeads) || []);
  const [expiredListings, setExpiredListings] = useState<ExpiredListing[]>(() => getCachedData(CACHE_KEYS.expiredListings) || []);
  const [loading, setLoading] = useState(!cachedMetrics); // Only show loading if no cache
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data - uses module-level promise to prevent duplicate calls
  const loadDashboardData = async () => {
    // If already loading, wait for existing request
    if (dashboardLoadingPromise) {
      await dashboardLoadingPromise;
      return;
    }
    
    // Only show loading spinner if we don't have cached data
    if (!cachedMetrics) {
      setLoading(true);
    }
    setError(null);
    
    // Create the loading promise
    dashboardLoadingPromise = (async () => {
      try {
        // Fetch dashboard metrics and suburbs in parallel
        const [metricsResponse, suburbsResponse] = await Promise.all([
          apiRequest<{ 
            unLockedLeadsCount?: number;
            rank?: number;
          }>('/lead/dashboard-matrix?isDepricated=false', 'GET'),
          apiRequest<{ 
            result?: { suburb: string; state: string }[];
          }>('/lead/my-suburbs-list', 'GET')
        ]);
        
        // Get subscribed suburbs from the dedicated endpoint (like demo.html)
        // Keep as objects with suburb and state for the API
        const subscribedSuburbObjects = suburbsResponse.result || [];
      
        const newMetrics = {
          unLockedLeadsCount: metricsResponse.unLockedLeadsCount || 0,
          subscribedSuburbs: subscribedSuburbObjects.length,
          leaderboardPosition: metricsResponse.rank,
        };
        setMetrics(newMetrics);
        setCachedData(CACHE_KEYS.metrics, newMetrics);

        // Fetch hot leads (top scoring, excluding 100 which are already listed)
        // Use sellingScore filter and suburbs filter like demo.html
        const hotLeadsBody: any = {
          page: 1,
          perPage: 10,
          sellingScore: { min: 0, max: 99 }
        };
        
        // Filter by subscribed suburbs if available (API expects objects with suburb/state)
        if (subscribedSuburbObjects.length > 0) {
          hotLeadsBody.suburbs = subscribedSuburbObjects.slice(0, 4).map(s => ({
            suburb: s.suburb,
            state: s.state
          }));
        }
        
        const leadsResponse = await apiRequest<{ leads: Lead[] }>('/lead/all', 'POST', hotLeadsBody);
        
        if (leadsResponse.leads) {
          // Sort by score descending and take top 3
          const sorted = [...leadsResponse.leads].sort((a, b) => (b.sellingScore || 0) - (a.sellingScore || 0));
          const topLeads = sorted.slice(0, 3);
          setHotLeads(topLeads);
          setCachedData(CACHE_KEYS.hotLeads, topLeads);
        }

        // Fetch expired listings
        const expiredResponse = await apiRequest<{ expiredLeads: ExpiredListing[] }>('/lead/expired-listings', 'POST', {
          page: 1,
          perPage: 5
        });
        
        if (expiredResponse.expiredLeads) {
          const expired = expiredResponse.expiredLeads.slice(0, 3).map((listing: any) => ({
            ...listing,
            totalDaysInMarket: listing.totalDaysInMarket || 0,
          }));
          setExpiredListings(expired);
          setCachedData(CACHE_KEYS.expiredListings, expired);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setLoading(false);
        dashboardLoadingPromise = null; // Reset for next navigation
      }
    })();
    
    await dashboardLoadingPromise;
  };

  useEffect(() => {
    // Load data if we have a token (don't wait for user object)
    const token = typeof window !== 'undefined' ? (localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token')) : null;
    if (!authLoading && token) {
      loadDashboardData();
    }
  }, [authLoading]);

  if (authLoading) {
    return (
      <DemoLayout currentPage="dashboard">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DemoLayout>
    );
  }

  const greeting = getGreeting();
  const todayDate = formatDate();
  const topLead = hotLeads[0];

  return (
    <DemoLayout currentPage="dashboard">
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting}, {(user as any)?.firstName || user?.first_name || 'there'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Here's what needs your attention today
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadDashboardData}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <div className="text-right">
                <p className="text-xs text-gray-500">Today's Date</p>
                <p className="text-sm font-semibold text-gray-900">{todayDate}</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button 
              onClick={loadDashboardData}
              className="mt-2 text-sm text-red-600 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* TOP PRIORITY: Call This Person Now */}
          {loading ? (
            <div className="bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl p-5 animate-pulse h-40" />
          ) : topLead ? (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white/80">🎯 Your #1 Priority Today</span>
                </div>
                <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-bold rounded-full animate-pulse">
                  HOT LEAD
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    {topLead.owner1Name || 'Owner'} • {topLead.streetAddress}
                  </h2>
                  <p className="text-green-100 text-sm mb-3">
                    {topLead.suburb} • Score: {Math.round(topLead.sellingScore)}/100
                  </p>
                  <div className="flex items-center space-x-3 text-xs text-green-100">
                    {getLeadSignals(topLead).slice(0, 3).map((signal, idx) => (
                      <span key={idx} className="flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>{signal.label}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-100 text-xs mb-1">Est. Commission</p>
                  <p className="text-2xl font-bold mb-3">{calculateCommission(topLead.salePrice)}</p>
                  <button className="px-5 py-2.5 bg-white text-green-600 rounded-xl text-sm font-bold hover:bg-green-50 shadow-lg flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call Now</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-2xl p-5 text-center">
              <p className="text-gray-500">No hot leads yet. Subscribe to suburbs to start receiving leads.</p>
              <Link href="/settings" className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                Manage Suburbs
              </Link>
            </div>
          )}

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            <Link
              href="/leads"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                  <Lock className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-sky-600">
                    {loading ? '—' : (metrics?.unLockedLeadsCount || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">Leads Unlocked</p>
                </div>
              </div>
            </Link>

            <Link
              href="/settings"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-green-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {loading ? '—' : metrics?.subscribedSuburbs || 0}
                  </p>
                  <p className="text-xs text-gray-500">Suburbs Subscribed</p>
                </div>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">#{metrics?.leaderboardPosition?.toLocaleString() || '—'}</p>
                  <p className="text-xs text-gray-500">Leaderboard Position</p>
                </div>
              </div>
            </Link>

            <Link
              href="/branding"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Megaphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">—</p>
                  <p className="text-xs text-gray-500">Marketing Opportunities</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Two Column Layout: Hot Leads + Expiring Listings */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Hot Leads */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔥</span>
                  <h3 className="font-semibold text-gray-900">Hot Leads</h3>
                </div>
                <Link
                  href="/leads"
                  className="text-xs text-red-500 font-medium hover:underline"
                >
                  See all
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {loading ? (
                  <div className="px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : hotLeads.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No leads found. Subscribe to suburbs to start receiving leads.
                  </div>
                ) : (
                  hotLeads.map((lead) => (
                    <Link
                      key={lead._id}
                      href={`/properties/${lead._id}`}
                      className="block px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{lead.streetAddress}, {lead.suburb}</span>
                        <span
                          className={`min-w-[28px] h-7 px-1.5 ${
                            lead.sellingScore >= 80 ? 'bg-green-50 text-green-600 border border-green-200' : 
                            lead.sellingScore >= 50 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 
                            'bg-gray-50 text-gray-600 border border-gray-200'
                          } rounded-full text-xs font-semibold flex items-center justify-center`}
                        >
                          {Math.round(lead.sellingScore)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{formatValue(lead.salePrice)}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        {getLeadSignals(lead).slice(0, 2).map((signal, idx) => (
                          <span
                            key={idx}
                            className={`px-1.5 py-0.5 ${getTagColorClasses(signal.color)} text-xs rounded`}
                          >
                            {signal.label}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Right Column: Expiring Listings */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">Expiring Listings</h3>
                </div>
                <Link
                  href="/expired"
                  className="text-xs text-red-500 font-medium hover:underline"
                >
                  See all
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {loading ? (
                  <div className="px-4 py-8 text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : expiredListings.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No expiring listings found.
                  </div>
                ) : (
                  expiredListings.map((listing) => (
                    <Link key={listing._id} href={`/properties/${listing._id}`} className="block px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{listing.streetAddress}</span>
                        <span
                          className={`px-2 py-0.5 ${getUrgencyColorClasses(listing.totalDaysInMarket)} text-xs font-medium rounded-full`}
                        >
                          {listing.totalDaysInMarket ?? 0} days
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {listing.suburb}
                        {listing.agentName && ` • Listed with ${listing.agentName}`}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className="text-xs text-gray-400">{listing.salePrice ? (listing.salePrice.includes('$') ? listing.salePrice : `$${parseFloat(listing.salePrice).toLocaleString()}`) : 'Price TBA'}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
