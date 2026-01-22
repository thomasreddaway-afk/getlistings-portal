'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { RefreshCw, ChevronUp, ChevronDown, Search, Settings } from 'lucide-react';
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

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [signalFilter, setSignalFilter] = useState<string>('all');
  const [hideSoldListed, setHideSoldListed] = useState(false);
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('sellingScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 50;

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get subscribed suburbs first - returns {result: [...]}
      const suburbsResponse = await apiRequest<{ result: Suburb[] } | Suburb[]>('/lead/my-suburbs-list', 'GET');
      const suburbsList = Array.isArray(suburbsResponse) ? suburbsResponse : (suburbsResponse?.result || []);
      setSuburbs(suburbsList);
      
      // Get leads - API expects suburbs as {suburb, state} objects
      const leadsResponse = await apiRequest<{ leads: Lead[]; total: number }>('/lead/all', 'POST', {
        page: 1,
        perPage: 10000, // Load all like demo.html
        suburbs: suburbsList.map(s => ({ suburb: s.suburb, state: s.state })),
      });
      
      if (leadsResponse.leads) {
        setLeads(leadsResponse.leads);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter and sort leads
  const filteredLeads = useMemo(() => {
    let result = [...leads];
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        lead.streetAddress?.toLowerCase().includes(query) ||
        lead.suburb?.toLowerCase().includes(query) ||
        lead.owner1Name?.toLowerCase().includes(query)
      );
    }
    
    // Suburb filter
    if (selectedSuburb !== 'all') {
      result = result.filter(lead => 
        lead.suburb?.toLowerCase() === selectedSuburb.toLowerCase()
      );
    }
    
    // Score filter
    if (scoreFilter === 'high') {
      result = result.filter(lead => lead.sellingScore >= 75);
    } else if (scoreFilter === 'medium') {
      result = result.filter(lead => lead.sellingScore >= 50 && lead.sellingScore < 75);
    } else if (scoreFilter === 'low') {
      result = result.filter(lead => lead.sellingScore >= 10 && lead.sellingScore < 50);
    }
    
    // Signal filter
    if (signalFilter !== 'all') {
      result = result.filter(lead => {
        if (signalFilter === 'expiring') return lead.listedForSale; // Adjust based on actual data
        if (signalFilter === 'listed') return lead.listedForSale;
        if (signalFilter === 'valuation') return lead.requested;
        if (signalFilter === 'neighbour') return lead.neighbourSold;
        if (signalFilter === 'fsbo') return lead.fsboListing;
        return true;
      });
    }
    
    // Hide sold & listed
    if (hideSoldListed) {
      result = result.filter(lead => !lead.listedForSale && !lead.recentlySold);
    }
    
    // Sort
    result.sort((a, b) => {
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
    
    return result;
  }, [leads, searchQuery, selectedSuburb, scoreFilter, signalFilter, hideSoldListed, sortField, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredLeads.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, filteredLeads.length);
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSuburb, scoreFilter, signalFilter, hideSoldListed]);

  // Suburb counts for tabs
  const suburbCounts = useMemo(() => {
    const counts: Record<string, number> = { all: leads.length };
    suburbs.forEach(s => {
      counts[s.suburb.toLowerCase()] = leads.filter(l => 
        l.suburb?.toLowerCase() === s.suburb.toLowerCase()
      ).length;
    });
    return counts;
  }, [leads, suburbs]);

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

  return (
    <DemoLayout currentPage="leads">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Scores</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {filteredLeads.length.toLocaleString()} leads in your subscribed suburbs
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={loadData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Suburb Tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setSelectedSuburb('all')}
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
                {suburbCounts.all?.toLocaleString()}
              </span>
            </button>
            {suburbs.map(s => (
              <button
                key={s.suburb}
                onClick={() => setSelectedSuburb(s.suburb.toLowerCase())}
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
                  {suburbCounts[s.suburb.toLowerCase()]?.toLocaleString() || 0}
                </span>
              </button>
            ))}
            <div className="flex-1"></div>
            <Link 
              href="/settings?section=suburbs"
              className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Manage Suburbs</span>
            </Link>
          </div>
        </div>

        {/* Filter Row - Quick Filter Buttons */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            <span className="text-xs text-gray-500 font-medium mr-1">Filter:</span>
            
            {/* All button */}
            <button
              onClick={() => { setScoreFilter('all'); setSignalFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                scoreFilter === 'all' && signalFilter === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            
            {/* Score Filters */}
            <button
              onClick={() => { setScoreFilter('high'); setSignalFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                scoreFilter === 'high'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              75%+
            </button>
            <button
              onClick={() => { setScoreFilter('medium'); setSignalFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                scoreFilter === 'medium'
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              50-75%
            </button>
            <button
              onClick={() => { setScoreFilter('low'); setSignalFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                scoreFilter === 'low'
                  ? 'bg-gray-200 text-gray-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              10-50%
            </button>
            
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            
            {/* Signal Filters */}
            <button
              onClick={() => { setSignalFilter('expiring'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                signalFilter === 'expiring'
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              Expiring
            </button>
            <button
              onClick={() => { setSignalFilter('listed'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                signalFilter === 'listed'
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              Listed
            </button>
            <button
              onClick={() => { setSignalFilter('valuation'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                signalFilter === 'valuation'
                  ? 'bg-pink-100 text-pink-700 border border-pink-300'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700'
              }`}
            >
              Valuation
            </button>
            <button
              onClick={() => { setSignalFilter('neighbour'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                signalFilter === 'neighbour'
                  ? 'bg-purple-100 text-purple-700 border border-purple-300'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              Neighbour
            </button>
            <button
              onClick={() => { setSignalFilter('fsbo'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                signalFilter === 'fsbo'
                  ? 'bg-red-100 text-red-700 border border-red-300'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              FSBO
            </button>
            
            <div className="w-px h-5 bg-gray-300 mx-1"></div>
            
            {/* Hide Sold & Listed Toggle */}
            <button
              onClick={() => setHideSoldListed(!hideSoldListed)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full ${
                hideSoldListed
                  ? 'bg-gray-700 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hide Sold & Listed
            </button>
            
            <div className="flex-1"></div>
            
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-primary w-40 bg-white"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={loadData} className="mt-2 text-sm text-red-600 underline">Retry</button>
          </div>
        )}

        {/* Data Table */}
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('streetAddress')}
                  >
                    Property <SortIcon field="streetAddress" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('suburb')}
                  >
                    Suburb <SortIcon field="suburb" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sellingScore')}
                  >
                    AI Seller Score <SortIcon field="sellingScore" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Signals
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('salePrice')}
                  >
                    Last Sale <SortIcon field="salePrice" />
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('updatedAt')}
                  >
                    Updated <SortIcon field="updatedAt" />
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        <span className="text-gray-500">Loading leads...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      {leads.length === 0 
                        ? 'No leads found. Subscribe to suburbs to start receiving leads.'
                        : 'No leads match your filters.'}
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => {
                    const scoreStyle = getScoreStyle(lead.sellingScore);
                    return (
                    <tr key={lead._id} className="hover:bg-gray-50 cursor-pointer" onClick={() => router.push(`/properties/${lead._id}`)}>
                      <td className="px-6 py-3">
                        <span className="font-medium text-gray-900">{lead.streetAddress}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-600">{lead.suburb}</span>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div className={`${scoreStyle.barColor} h-2 rounded-full`} style={{ width: `${lead.sellingScore}%` }}></div>
                          </div>
                          <span className={`${scoreStyle.textColor} font-bold`}>{lead.sellingScore}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {getLeadSignals(lead).map((signal, idx) => (
                            <span key={idx} className={`px-2 py-0.5 text-xs rounded ${signal.bg} ${signal.color}`}>
                              {signal.text}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-600">{formatValue(lead.salePrice)}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-400">{formatTimeAgo(lead.updatedAt)}</span>
                      </td>
                    </tr>
                  );})
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="mt-4 bg-white rounded-xl border border-gray-200 px-6 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredLeads.length > 0 ? startIndex + 1 : 0}-{endIndex} of {filteredLeads.length.toLocaleString()} properties
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1.5 border border-gray-200 rounded-lg text-sm ${
                    currentPage === 1 
                      ? 'opacity-50 cursor-not-allowed text-gray-400' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {(() => {
                  const pages: (number | string)[] = [];
                  pages.push(1);
                  if (currentPage > 3) pages.push('...');
                  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                    if (!pages.includes(i)) pages.push(i);
                  }
                  if (currentPage < totalPages - 2) pages.push('...');
                  if (totalPages > 1) pages.push(totalPages);
                  
                  return pages.map((page, idx) => (
                    page === '...' ? (
                      <span key={`ellipsis-${idx}`} className="text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page as number)}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                          currentPage === page
                            ? 'bg-primary text-white'
                            : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ));
                })()}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1.5 border border-gray-200 rounded-lg text-sm ${
                    currentPage === totalPages 
                      ? 'opacity-50 cursor-not-allowed text-gray-400' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
