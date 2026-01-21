'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, ChevronUp, ChevronDown, Search, Filter } from 'lucide-react';

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

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-700';
  if (score >= 60) return 'bg-yellow-100 text-yellow-700';
  return 'bg-orange-100 text-orange-700';
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSuburb, setSelectedSuburb] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  
  // Sorting
  const [sortField, setSortField] = useState<SortField>('sellingScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Load data from API
  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get subscribed suburbs first
      const suburbsResponse = await apiRequest<Suburb[]>('/lead/my-suburbs-list', 'GET');
      setSuburbs(suburbsResponse || []);
      
      // Get leads
      const leadsResponse = await apiRequest<{ leads: Lead[]; total: number }>('/lead/all', 'POST', {
        page: 1,
        perPage: 10000, // Load all like demo.html
        suburbs: suburbsResponse?.map(s => s.suburb) || [],
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
      result = result.filter(lead => lead.sellingScore >= 80);
    } else if (scoreFilter === 'medium') {
      result = result.filter(lead => lead.sellingScore >= 50 && lead.sellingScore < 80);
    } else if (scoreFilter === 'low') {
      result = result.filter(lead => lead.sellingScore < 50);
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
  }, [leads, searchQuery, selectedSuburb, scoreFilter, sortField, sortDirection]);

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
        <div className="bg-white border-b border-gray-200 px-4 overflow-x-auto">
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
          </div>
        </div>

        {/* Filters Row */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by address, suburb, or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            
            {/* Score Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Scores</option>
                <option value="high">High (80+)</option>
                <option value="medium">Medium (50-79)</option>
                <option value="low">Low (&lt;50)</option>
              </select>
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
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('streetAddress')}
                  >
                    Property <SortIcon field="streetAddress" />
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('suburb')}
                  >
                    Suburb <SortIcon field="suburb" />
                  </th>
                  <th 
                    className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('sellingScore')}
                  >
                    Score <SortIcon field="sellingScore" />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Signals
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('salePrice')}
                  >
                    Est. Value <SortIcon field="salePrice" />
                  </th>
                  <th 
                    className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
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
                  filteredLeads.slice(0, 100).map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                            🏠
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{lead.streetAddress}</p>
                            <p className="text-xs text-gray-500">
                              {lead.bed && `${lead.bed} bed`}
                              {lead.bath && ` • ${lead.bath} bath`}
                              {lead.car && ` • ${lead.car} car`}
                              {lead.propertyType && ` • ${lead.propertyType}`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-700">{lead.suburb}</span>
                        {lead.state && <span className="text-xs text-gray-400 ml-1">{lead.state}</span>}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${getScoreColor(lead.sellingScore)}`}>
                          {lead.sellingScore}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {getLeadSignals(lead).slice(0, 2).map((signal, idx) => (
                            <span key={idx} className={`px-2 py-0.5 text-xs rounded ${signal.bg} ${signal.color}`}>
                              {signal.text}
                            </span>
                          ))}
                          {getLeadSignals(lead).length > 2 && (
                            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-600">
                              +{getLeadSignals(lead).length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-medium text-gray-900">{formatValue(lead.salePrice)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-xs text-gray-500">{formatTimeAgo(lead.updatedAt)}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {filteredLeads.length > 100 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-500">
                Showing 100 of {filteredLeads.length.toLocaleString()} leads. Use filters to narrow down results.
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
