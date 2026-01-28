'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { RefreshCw, ChevronUp, ChevronDown, Search, Settings, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Types from API
interface Lead {
  _id: string;
  streetAddress: string;
  fullAddress?: string;
  suburb: string;
  state?: string;
  postCode?: string;
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
  ownerType?: string;
  bed?: number;
  bath?: number;
  car?: number;
  propertyType?: string;
  unLocked?: boolean;
}

interface Suburb {
  suburb: string;
  state?: string;
}

type SortField = 'streetAddress' | 'suburb' | 'sellingScore' | 'salePrice' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

const signalStyleMap: Record<string, { text: string; bg: string; color: string }> = {
  garageSale: { text: 'Garage sale', bg: 'bg-amber-100', color: 'text-amber-700' },
  listedForSale: { text: 'Listed for sale', bg: 'bg-green-100', color: 'text-green-700' },
  listedForRent: { text: 'Listed for rent', bg: 'bg-cyan-100', color: 'text-cyan-700' },
  requested: { text: 'Requested valuation', bg: 'bg-pink-100', color: 'text-pink-700' },
  neighbourSold: { text: 'Neighbour selling', bg: 'bg-purple-100', color: 'text-purple-700' },
  recentlySold: { text: 'Recently sold', bg: 'bg-gray-100', color: 'text-gray-700' },
  socialTag: { text: 'Tagged on social', bg: 'bg-blue-100', color: 'text-blue-700' },
  fsboListing: { text: 'FSBO', bg: 'bg-red-100', color: 'text-red-700' },
};

function getLeadSignals(lead: Lead) {
  const signals: { text: string; bg: string; color: string }[] = [];
  if (lead.garageSale) signals.push(signalStyleMap.garageSale);
  if (lead.listedForSale) signals.push(signalStyleMap.listedForSale);
  if (lead.listedForRent) signals.push(signalStyleMap.listedForRent);
  if (lead.requested) signals.push(signalStyleMap.requested);
  if (lead.neighbourSold) signals.push(signalStyleMap.neighbourSold);
  if (lead.recentlySold) signals.push(signalStyleMap.recentlySold);
  if (lead.socialTag) signals.push(signalStyleMap.socialTag);
  if (lead.fsboListing) signals.push(signalStyleMap.fsboListing);
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
  if (diffMins < 43200) return `${Math.floor(diffMins / 10080)}w ago`;
  return `${Math.floor(diffMins / 43200)}mo ago`;
}

function formatValue(salePrice?: string): string {
  if (!salePrice) return '—';
  const price = parseFloat(salePrice.replace(/[$,]/g, ''));
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${(price / 1000).toFixed(0)}K`;
  return salePrice;
}

function getScoreStyle(score: number): { barColor: string; textColor: string } {
  if (score >= 85) return { barColor: 'bg-green-500', textColor: 'text-green-600' };
  if (score >= 70) return { barColor: 'bg-lime-500', textColor: 'text-lime-600' };
  if (score >= 55) return { barColor: 'bg-yellow-500', textColor: 'text-yellow-600' };
  return { barColor: 'bg-orange-500', textColor: 'text-orange-600' };
}

// Cache for suburb counts (doesn't change often)
const SUBURB_COUNTS_CACHE_KEY = 'gl_cache_suburb_counts';
const SUBURBS_CACHE_KEY = 'gl_cache_suburbs';
const CACHE_TS_KEY = 'gl_cache_suburbs_ts';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache for first page of leads
const LEADS_CACHE_KEY = 'gl_cache_leads_page1';
const LEADS_CACHE_TS_KEY = 'gl_cache_leads_ts';
const LEADS_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

function getCachedSuburbData(): { suburbs: Suburb[], counts: Record<string, number> } | null {
  if (typeof window === 'undefined') return null;
  try {
    const ts = localStorage.getItem(CACHE_TS_KEY);
    if (ts && Date.now() - parseInt(ts, 10) < CACHE_DURATION) {
      const suburbs = JSON.parse(localStorage.getItem(SUBURBS_CACHE_KEY) || '[]');
      const counts = JSON.parse(localStorage.getItem(SUBURB_COUNTS_CACHE_KEY) || '{}');
      if (suburbs.length > 0) return { suburbs, counts };
    }
  } catch (e) {}
  return null;
}

function setCachedSuburbData(suburbs: Suburb[], counts: Record<string, number>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SUBURBS_CACHE_KEY, JSON.stringify(suburbs));
    localStorage.setItem(SUBURB_COUNTS_CACHE_KEY, JSON.stringify(counts));
    localStorage.setItem(CACHE_TS_KEY, Date.now().toString());
  } catch (e) {}
}

function getCachedLeads(): Lead[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const ts = localStorage.getItem(LEADS_CACHE_TS_KEY);
    if (ts && Date.now() - parseInt(ts, 10) < LEADS_CACHE_DURATION) {
      const leads = localStorage.getItem(LEADS_CACHE_KEY);
      if (leads) return JSON.parse(leads);
    }
  } catch (e) {}
  return null;
}

function setCachedLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LEADS_CACHE_KEY, JSON.stringify(leads));
    localStorage.setItem(LEADS_CACHE_TS_KEY, Date.now().toString());
  } catch (e) {}
}

export default function LeadsPage() {
  // URL search params for filter presets (e.g., /leads?filter=hottest)
  const searchParams = useSearchParams();
  
  // Check cache on initial render - must be inside useState to work with SSR/hydration
  const [cachedData] = useState<{ suburbs: Suburb[], counts: Record<string, number> } | null>(() => getCachedSuburbData());
  const [cachedLeads] = useState<Lead[] | null>(() => getCachedLeads());
  const hasCachedLeads = cachedLeads && cachedLeads.length > 0;
  
  // Core data
  const [leads, setLeads] = useState<Lead[]>(cachedLeads || []);
  const [suburbs, setSuburbs] = useState<Suburb[]>(cachedData?.suburbs || []);
  const [suburbCounts, setSuburbCounts] = useState<Record<string, number>>(cachedData?.counts || {});
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Loading states - don't show loading if we have cached leads
  const [loading, setLoading] = useState(!hasCachedLeads);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [loadingFresh, setLoadingFresh] = useState(false); // Background refresh indicator
  const [loadingCounts, setLoadingCounts] = useState(!cachedData?.counts || Object.keys(cachedData.counts).length === 0);
  const [error, setError] = useState<string | null>(null);
  
  // Filters (these trigger API calls)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Debounced input
  const [selectedSuburb, setSelectedSuburb] = useState<string>('all');
  // Initialize score filter from URL param (e.g., ?filter=hottest sets to 'high')
  const [scoreFilter, setScoreFilter] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('filter') === 'hottest' ? 'high' : 'all';
    }
    return 'all';
  });
  const [signalFilter, setSignalFilter] = useState<string>('all');
  const [hideSoldListed, setHideSoldListed] = useState(false);
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('sellingScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Pagination - TRUE server-side pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 50;
  
  // Debounce timer for search
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Build API request body based on current filters
  const buildRequestBody = useCallback((page: number, suburbFilter?: string, suburbsList?: Suburb[]) => {
    const body: any = {
      page,
      perPage,
    };
    
    const availableSuburbs = suburbsList || suburbs;
    
    // Suburb filter - if specific suburb selected, only query that one
    // Otherwise query all subscribed suburbs
    if (suburbFilter && suburbFilter !== 'all') {
      const suburb = availableSuburbs.find(s => s.suburb.toLowerCase() === suburbFilter.toLowerCase());
      if (suburb) {
        body.suburbs = [{ suburb: suburb.suburb, state: suburb.state }];
      }
    } else if (availableSuburbs.length > 0) {
      body.suburbs = availableSuburbs.map(s => ({ suburb: s.suburb, state: s.state }));
    }
    
    // Search
    if (searchQuery.trim()) {
      body.search = searchQuery.trim();
    }
    
    // Score filter
    if (scoreFilter === 'high') {
      body.sellingScore = { min: 75, max: 100 };
    } else if (scoreFilter === 'medium') {
      body.sellingScore = { min: 50, max: 74 };
    } else if (scoreFilter === 'low') {
      body.sellingScore = { min: 10, max: 49 };
    }
    
    // Signal/insight filters
    const insights: any = {};
    if (signalFilter === 'listed') insights.listedForSale = true;
    if (signalFilter === 'valuation') insights.requested = true;
    if (signalFilter === 'neighbour') insights.neighbourSold = true;
    if (signalFilter === 'fsbo') insights.fsboListing = true;
    
    // Hide Sold & Listed filter - exclude leads with these flags
    if (hideSoldListed) {
      insights.listedForSale = false;
      insights.recentlySold = false;
    }
    
    if (Object.keys(insights).length > 0) {
      body.insights = insights;
    }
    
    return body;
  }, [suburbs, searchQuery, scoreFilter, signalFilter, hideSoldListed, perPage]);

  // Load ONLY suburbs list (fast - no counting)
  const loadSuburbsOnly = async (): Promise<Suburb[]> => {
    try {
      const suburbsResponse = await apiRequest<{ result: Suburb[] } | Suburb[]>('/lead/my-suburbs-list', 'GET');
      const suburbsList = Array.isArray(suburbsResponse) ? suburbsResponse : (suburbsResponse?.result || []);
      setSuburbs(suburbsList);
      return suburbsList;
    } catch (err) {
      console.error('Failed to load suburbs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load suburbs');
      return [];
    }
  };

  // Load suburb counts using NEW efficient endpoint (fast aggregation query)
  const loadSuburbCountsInBackground = async (suburbsList: Suburb[]) => {
    if (suburbsList.length === 0) {
      setLoadingCounts(false);
      return;
    }
    
    // Check cache first
    const cached = getCachedSuburbData();
    if (cached && cached.counts && Object.keys(cached.counts).length > 0) {
      setSuburbCounts(cached.counts);
      setLoadingCounts(false);
      return;
    }
    
    setLoadingCounts(true);
    
    try {
      // Use the new efficient counts-by-suburb endpoint
      // This uses MongoDB aggregation - much faster than loading all leads
      // Use shorter timeout (5s) since this is optional/non-blocking
      const countsResponse = await apiRequest<{ counts: Record<string, number>; total: number }>('/lead/counts-by-suburb', 'POST', {
        suburbs: suburbsList.map(s => ({ suburb: s.suburb, state: s.state })),
      }, 5000); // 5 second timeout - this endpoint may not exist on production yet
      
      if (countsResponse.counts) {
        setSuburbCounts(countsResponse.counts);
        setCachedSuburbData(suburbsList, countsResponse.counts);
      }
    } catch (err) {
      console.error('Failed to load suburb counts:', err);
      // Fallback: counts just won't show (non-blocking)
    } finally {
      setLoadingCounts(false);
    }
  };

  // Load leads with current filters and pagination (server-side)
  const loadLeads = useCallback(async (page: number = 1, suburbFilter?: string, suburbsList?: Suburb[]) => {
    const availableSuburbs = suburbsList || suburbs;
    if (availableSuburbs.length === 0) return;
    
    setLoadingLeads(true);
    
    try {
      const body = buildRequestBody(page, suburbFilter ?? selectedSuburb, availableSuburbs);
      
      const response = await apiRequest<{ leads: Lead[]; total: number; page: number; perPage: number }>('/lead/all', 'POST', body);
      
      if (response.leads) {
        setLeads(response.leads);
        // Calculate total based on our suburb counts for the selected filter
        // (Don't use API total as it returns entire DB count)
        if (suburbFilter === 'all' || !suburbFilter) {
          setTotalCount(suburbCounts['all'] || response.leads.length);
        } else {
          setTotalCount(suburbCounts[suburbFilter?.toLowerCase() || ''] || response.leads.length);
        }
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoadingLeads(false);
    }
  }, [suburbs, selectedSuburb, buildRequestBody, suburbCounts]);

  // Initial load - FAST: Use cache if available, refresh in background
  useEffect(() => {
    const init = async () => {
      // If we have cached leads, show them immediately and refresh in background
      const hasCached = cachedLeads && cachedLeads.length > 0;
      
      if (hasCached) {
        // Already showing cached leads, refresh in background
        setLoadingFresh(true);
      } else {
        setLoading(true);
      }
      
      // Step 1: Get suburbs list (fast)
      const loadedSuburbs = await loadSuburbsOnly();
      
      if (loadedSuburbs.length > 0) {
        // Step 2: Load first page of leads
        const body = {
          page: 1,
          perPage,
          suburbs: loadedSuburbs.map(s => ({ suburb: s.suburb, state: s.state })),
        };
        
        try {
          const response = await apiRequest<{ leads: Lead[]; total: number }>('/lead/all', 'POST', body);
          if (response.leads) {
            setLeads(response.leads);
            // Cache the first page for next visit
            setCachedLeads(response.leads);
          }
        } catch (err) {
          console.error('Failed to load initial leads:', err);
        }
        
        // Page is now ready - user can browse
        setLoading(false);
        setLoadingFresh(false);
        
        // Step 3: Load suburb counts in BACKGROUND (slow, but non-blocking)
        loadSuburbCountsInBackground(loadedSuburbs);
      } else {
        setLoading(false);
        setLoadingFresh(false);
      }
    };
    
    init();
  }, []);

  // Reload leads when filters change
  useEffect(() => {
    if (!loading && suburbs.length > 0) {
      setCurrentPage(1);
      loadLeads(1, selectedSuburb);
    }
  }, [selectedSuburb, scoreFilter, signalFilter, hideSoldListed, searchQuery]);

  // Reload leads when page changes
  useEffect(() => {
    if (!loading && suburbs.length > 0 && currentPage > 1) {
      loadLeads(currentPage, selectedSuburb);
    }
  }, [currentPage]);

  // Debounced search
  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    searchTimerRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 500);
  };

  // Client-side sort (since API doesn't support sorting)
  const sortedLeads = [...leads].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case 'streetAddress':
        comparison = (a.streetAddress || '').localeCompare(b.streetAddress || '');
        break;
      case 'suburb':
        comparison = (a.suburb || '').localeCompare(b.suburb || '');
        break;
      case 'sellingScore':
        comparison = (a.sellingScore || 0) - (b.sellingScore || 0);
        break;
      case 'salePrice':
        const priceA = parseFloat((a.salePrice || '0').replace(/[$,]/g, ''));
        const priceB = parseFloat((b.salePrice || '0').replace(/[$,]/g, ''));
        comparison = priceA - priceB;
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
    }
    return sortDirection === 'desc' ? -comparison : comparison;
  });

  // Use sorted leads directly - Hide Sold & Listed is now handled server-side
  const displayLeads = sortedLeads;

  // Calculate pagination info
  // Use suburbCounts if available, otherwise estimate based on loaded leads
  const currentSuburbCount = selectedSuburb === 'all' 
    ? (suburbCounts['all'] || 0)
    : (suburbCounts[selectedSuburb.toLowerCase()] || 0);
  
  // If counts aren't available yet, check if we have a full page (meaning there's probably more)
  const hasMorePages = displayLeads.length >= perPage;
  // Show pagination if: we have counts > perPage, OR we got a full page of results (likely more exist)
  const showPagination = currentSuburbCount > perPage || hasMorePages || currentPage > 1;
  
  // For filtered results, estimate based on filter
  let estimatedTotal = currentSuburbCount;
  if (scoreFilter !== 'all' || signalFilter !== 'all' || searchQuery) {
    // When filters are active, we can't know exact count without loading all
    // Use the number of results returned as a guide
    estimatedTotal = displayLeads.length < perPage ? displayLeads.length : currentSuburbCount;
  }
  
  // If counts not loaded yet but we have full page, assume there are more
  const effectiveTotal = currentSuburbCount > 0 ? currentSuburbCount : (hasMorePages ? (currentPage * perPage + perPage) : displayLeads.length);
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / perPage));
  const showingFrom = displayLeads.length > 0 ? (currentPage - 1) * perPage + 1 : 0;
  const showingTo = showingFrom + displayLeads.length - 1;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4 inline ml-1" /> : 
      <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  const handleRefresh = async () => {
    // Clear cache and reload
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SUBURBS_CACHE_KEY);
      localStorage.removeItem(SUBURB_COUNTS_CACHE_KEY);
      localStorage.removeItem(CACHE_TS_KEY);
      localStorage.removeItem(LEADS_CACHE_KEY);
      localStorage.removeItem(LEADS_CACHE_TS_KEY);
    }
    setLoading(true);
    const loadedSuburbs = await loadSuburbsOnly();
    if (loadedSuburbs.length > 0) {
      await loadLeads(1, selectedSuburb, loadedSuburbs);
      loadSuburbCountsInBackground(loadedSuburbs);
    }
    setLoading(false);
  };

  return (
    <DemoLayout currentPage="leads">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Seller Scores</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {loadingCounts ? (
                    <span className="inline-flex items-center">
                      <span className="animate-pulse">Loading counts...</span>
                    </span>
                  ) : (
                    <>{(suburbCounts['all'] || 0).toLocaleString()} leads in your subscribed suburbs</>
                  )}
                </p>
              </div>
              {loadingFresh && (
                <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Updating...</span>
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={loading || loadingLeads}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${(loading || loadingLeads) ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Suburb Tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex items-center space-x-1 overflow-x-auto">
            <button
              onClick={() => { setSelectedSuburb('all'); setCurrentPage(1); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                selectedSuburb === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              All Suburbs
              <span className={`ml-1.5 px-2 py-0.5 text-xs rounded-full ${
                selectedSuburb === 'all' ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
              }`}>
                {loadingCounts ? '...' : (suburbCounts['all'] || 0).toLocaleString()}
              </span>
            </button>
            {suburbs.map(s => (
              <button
                key={s.suburb}
                onClick={() => { setSelectedSuburb(s.suburb.toLowerCase()); setCurrentPage(1); }}
                className={`px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  selectedSuburb === s.suburb.toLowerCase()
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {s.suburb}
                <span className={`ml-1.5 px-2 py-0.5 text-xs rounded-full ${
                  selectedSuburb === s.suburb.toLowerCase() ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'
                }`}>
                  {loadingCounts ? '...' : (suburbCounts[s.suburb.toLowerCase()] || 0).toLocaleString()}
                </span>
              </button>
            ))}
            <div className="flex-1"></div>
            <Link 
              href="/settings?tab=subscription"
              className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Suburbs</span>
            </Link>
          </div>
        </div>

        {/* Filter Row */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <span className="text-xs text-gray-500 font-medium mr-1">Filter:</span>
            
            {/* Score Filters */}
            {['all', 'high', 'medium', 'low'].map(filter => {
              const labels: Record<string, string> = { all: 'All', high: '75%+', medium: '50-75%', low: '10-50%' };
              return (
                <button
                  key={filter}
                  onClick={() => setScoreFilter(filter)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    scoreFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {labels[filter]}
                </button>
              );
            })}

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Signal Filters */}
            {[
              { key: 'listed', label: 'Listed' },
              { key: 'valuation', label: 'Valuation' },
              { key: 'neighbour', label: 'Neighbour Selling' },
              { key: 'fsbo', label: 'FSBO' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSignalFilter(signalFilter === key ? 'all' : key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  signalFilter === key
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}

            <div className="w-px h-6 bg-gray-300 mx-2"></div>

            {/* Hide Sold & Listed */}
            <button
              onClick={() => setHideSoldListed(!hideSoldListed)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                hideSoldListed
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Hide Sold & Listed
            </button>

            <div className="flex-1"></div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search address, owner..."
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
              <p className="text-gray-500">Loading leads...</p>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={handleRefresh} className="text-primary hover:underline">
              Try again
            </button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <>
            <div className="bg-white border-b border-gray-200">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                <div 
                  className="col-span-4 cursor-pointer hover:text-gray-700 flex items-center"
                  onClick={() => handleSort('streetAddress')}
                >
                  Property <SortIcon field="streetAddress" />
                </div>
                <div 
                  className="col-span-2 cursor-pointer hover:text-gray-700 flex items-center"
                  onClick={() => handleSort('suburb')}
                >
                  Suburb <SortIcon field="suburb" />
                </div>
                <div 
                  className="col-span-2 cursor-pointer hover:text-gray-700 flex items-center justify-center"
                  onClick={() => handleSort('sellingScore')}
                >
                  Seller Score <SortIcon field="sellingScore" />
                </div>
                <div className="col-span-3">Signals</div>
                <div 
                  className="col-span-1 cursor-pointer hover:text-gray-700 text-right flex items-center justify-end"
                  onClick={() => handleSort('updatedAt')}
                >
                  Updated <SortIcon field="updatedAt" />
                </div>
              </div>

              {/* Loading overlay when fetching new page */}
              {loadingLeads && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              )}

              {/* Table Body */}
              <div className="relative divide-y divide-gray-100">
                {displayLeads.length === 0 ? (
                  <div className="px-4 py-12 text-center text-gray-500">
                    No leads found matching your filters
                  </div>
                ) : (
                  displayLeads.map((lead) => {
                    const signals = getLeadSignals(lead);
                    const { barColor, textColor } = getScoreStyle(lead.sellingScore);
                    
                    return (
                      <Link
                        key={lead._id}
                        href={`/properties/${lead._id}`}
                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors items-center"
                      >
                        {/* Property */}
                        <div className="col-span-4">
                          <p className="font-medium text-gray-900 truncate">{lead.streetAddress}</p>
                          <p className="text-xs text-gray-500">
                            {lead.bed && `${lead.bed} bed`}
                            {lead.bath && ` • ${lead.bath} bath`}
                            {lead.car && ` • ${lead.car} car`}
                            {lead.propertyType && ` • ${lead.propertyType}`}
                          </p>
                        </div>
                        
                        {/* Suburb */}
                        <div className="col-span-2">
                          <p className="text-sm text-gray-700">{lead.suburb}</p>
                          <p className="text-xs text-gray-400">{lead.state} {lead.postCode}</p>
                        </div>
                        
                        {/* Score */}
                        <div className="col-span-2 flex items-center justify-center">
                          <div className="w-full max-w-[80px]">
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-sm font-bold ${textColor}`}>{lead.sellingScore}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full ${barColor} rounded-full`} style={{ width: `${lead.sellingScore}%` }}></div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Signals */}
                        <div className="col-span-3 flex flex-wrap gap-1">
                          {signals.slice(0, 3).map((signal, idx) => (
                            <span key={idx} className={`px-2 py-0.5 text-xs rounded-full ${signal.bg} ${signal.color}`}>
                              {signal.text}
                            </span>
                          ))}
                          {signals.length > 3 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">
                              +{signals.length - 3}
                            </span>
                          )}
                        </div>
                        
                        {/* Updated */}
                        <div className="col-span-1 text-right">
                          <span className="text-xs text-gray-500">{formatTimeAgo(lead.updatedAt)}</span>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>

            {/* Pagination */}
            {showPagination && (
              <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {showingFrom.toLocaleString()} - {showingTo.toLocaleString()}
                  {currentSuburbCount > 0 && ` of ${currentSuburbCount.toLocaleString()}`}
                  {loadingCounts && currentSuburbCount === 0 && ' of ...'}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loadingLeads}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loadingLeads}
                          className={`px-3 py-1.5 text-sm rounded-lg ${
                            currentPage === pageNum
                              ? 'bg-primary text-white'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-400">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={loadingLeads}
                          className="px-3 py-1.5 text-sm rounded-lg hover:bg-gray-100 text-gray-700"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || loadingLeads}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DemoLayout>
  );
}
