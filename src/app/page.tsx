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
  daysUntilExpiry: number;
  agentName?: string;
  daysOnMarket?: number;
  priceRange?: string;
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
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    pink: 'bg-pink-100 text-pink-700',
    cyan: 'bg-cyan-100 text-cyan-700',
    gray: 'bg-gray-100 text-gray-700',
  };
  return colorMap[color] || 'bg-gray-100 text-gray-700';
}

function getUrgencyColorClasses(daysLeft: number): string {
  if (daysLeft <= 3) return 'bg-red-100 text-red-700';
  if (daysLeft <= 7) return 'bg-orange-100 text-orange-700';
  return 'bg-amber-100 text-amber-700';
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
  return `Est. ${salePrice}`;
}

function calculateCommission(salePrice?: string): string {
  if (!salePrice) return '$0';
  const price = parseFloat(salePrice.replace(/[$,]/g, ''));
  const commission = price * 0.02; // 2% commission
  return `$${Math.round(commission).toLocaleString()}`;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [hotLeads, setHotLeads] = useState<Lead[]>([]);
  const [expiredListings, setExpiredListings] = useState<ExpiredListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch dashboard metrics
      const metricsResponse = await apiRequest<{ 
        unLockedLeadsCount?: number;
        mySuburbs?: { suburb: string }[];
      }>('/lead/dashboard-matrix?isDepricated=false', 'GET');
      
      setMetrics({
        unLockedLeadsCount: metricsResponse.unLockedLeadsCount || 0,
        subscribedSuburbs: metricsResponse.mySuburbs?.length || 0,
      });

      // Fetch hot leads (top scoring)
      const leadsResponse = await apiRequest<{ leads: Lead[] }>('/lead/all', 'POST', {
        page: 1,
        perPage: 5,
        sortBy: 'sellingScore',
        sortOrder: 'desc'
      });
      
      if (leadsResponse.leads) {
        // Sort by score and take top 3
        const sorted = [...leadsResponse.leads].sort((a, b) => (b.sellingScore || 0) - (a.sellingScore || 0));
        setHotLeads(sorted.slice(0, 3));
      }

      // Fetch expired listings
      const expiredResponse = await apiRequest<{ leads: ExpiredListing[] }>('/lead/expired-listings', 'POST', {
        page: 1,
        perPage: 5
      });
      
      if (expiredResponse.leads) {
        setExpiredListings(expiredResponse.leads.slice(0, 3));
      }
      
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadDashboardData();
    }
  }, [authLoading, user]);

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
                {greeting}, {user?.first_name || 'there'}
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
                    {formatTimeAgo(topLead.updatedAt)} • Score: {topLead.sellingScore}/100
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
                    {loading ? '—' : metrics?.unLockedLeadsCount || 0}
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
                  <p className="text-2xl font-bold text-amber-600">—</p>
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
                      href={`/leads?id=${lead._id}`}
                      className="block px-4 py-3 hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{lead.streetAddress}</span>
                        <span
                          className={`w-6 h-6 ${
                            lead.sellingScore >= 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          } rounded-full text-xs font-bold flex items-center justify-center`}
                        >
                          {lead.sellingScore}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{formatValue(lead.salePrice)} • {lead.suburb}</p>
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
                    <div key={listing._id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{listing.streetAddress}</span>
                        <span
                          className={`px-2 py-0.5 ${getUrgencyColorClasses(listing.daysUntilExpiry)} text-xs font-medium rounded-full`}
                        >
                          {listing.daysUntilExpiry} days
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {listing.suburb}
                        {listing.agentName && ` • Listed with ${listing.agentName}`}
                        {listing.daysOnMarket && listing.daysOnMarket > 0 && ` • ${listing.daysOnMarket} days on market`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{listing.priceRange || 'Price TBA'}</span>
                        <button className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600">
                          Contact
                        </button>
                      </div>
                    </div>
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
