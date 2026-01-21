'use client';

import { DemoLayout } from '@/components/layout';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

type ScoreFilter = 'all' | 'high' | 'medium' | 'low';
type SignalFilter = 'all' | 'Expiring listing' | 'Listed for sale' | 'Requested valuation' | 'Neighbour selling' | 'FSBO';
type SortField = 'property' | 'suburb' | 'score' | 'value' | 'updated';
type SortDirection = 'asc' | 'desc';

interface Signal {
  type: string;
  color: string;
  bgColor: string;
}

interface Lead {
  id: string;
  address: string;
  suburb: string;
  score: number;
  signals: Signal[];
  estimatedValue: number;
  updated: string;
  updatedDays: number;
  beds: number;
  baths: number;
  cars: number;
  propertyType: string;
}

// Mock data matching demo.html structure
const mockLeads: Lead[] = [
  {
    id: '1',
    address: '42 Ocean View Drive',
    suburb: 'Bondi Beach',
    score: 94,
    signals: [
      { type: 'Expiring listing', color: 'text-amber-700', bgColor: 'bg-amber-100' },
      { type: 'Requested valuation', color: 'text-pink-700', bgColor: 'bg-pink-100' },
    ],
    estimatedValue: 2850000,
    updated: '2 hours ago',
    updatedDays: 0,
    beds: 4,
    baths: 2,
    cars: 2,
    propertyType: 'House',
  },
  {
    id: '2',
    address: '15/88 Raglan Street',
    suburb: 'Mosman',
    score: 91,
    signals: [
      { type: 'Listed for sale', color: 'text-green-700', bgColor: 'bg-green-100' },
    ],
    estimatedValue: 1800000,
    updated: '5 hours ago',
    updatedDays: 0,
    beds: 3,
    baths: 2,
    cars: 1,
    propertyType: 'Apartment',
  },
  {
    id: '3',
    address: '7 Burrawong Avenue',
    suburb: 'Cremorne',
    score: 87,
    signals: [
      { type: 'Neighbour selling', color: 'text-purple-700', bgColor: 'bg-purple-100' },
      { type: 'Expiring listing', color: 'text-amber-700', bgColor: 'bg-amber-100' },
    ],
    estimatedValue: 2500000,
    updated: '1 day ago',
    updatedDays: 1,
    beds: 3,
    baths: 2,
    cars: 2,
    propertyType: 'House',
  },
  {
    id: '4',
    address: '23/12 The Corso',
    suburb: 'Manly',
    score: 82,
    signals: [
      { type: 'FSBO', color: 'text-red-700', bgColor: 'bg-red-100' },
    ],
    estimatedValue: 1400000,
    updated: '2 days ago',
    updatedDays: 2,
    beds: 2,
    baths: 1,
    cars: 1,
    propertyType: 'Apartment',
  },
  {
    id: '5',
    address: '88 Military Road',
    suburb: 'Neutral Bay',
    score: 78,
    signals: [
      { type: 'Listed for sale', color: 'text-green-700', bgColor: 'bg-green-100' },
      { type: 'Requested valuation', color: 'text-pink-700', bgColor: 'bg-pink-100' },
    ],
    estimatedValue: 2100000,
    updated: '3 days ago',
    updatedDays: 3,
    beds: 4,
    baths: 3,
    cars: 2,
    propertyType: 'Townhouse',
  },
  {
    id: '6',
    address: '5/22 Wycombe Road',
    suburb: 'Neutral Bay',
    score: 72,
    signals: [
      { type: 'Expiring listing', color: 'text-amber-700', bgColor: 'bg-amber-100' },
    ],
    estimatedValue: 950000,
    updated: '5 days ago',
    updatedDays: 5,
    beds: 2,
    baths: 1,
    cars: 1,
    propertyType: 'Apartment',
  },
  {
    id: '7',
    address: '124 Spit Road',
    suburb: 'Mosman',
    score: 65,
    signals: [
      { type: 'Neighbour selling', color: 'text-purple-700', bgColor: 'bg-purple-100' },
    ],
    estimatedValue: 4500000,
    updated: '1 week ago',
    updatedDays: 7,
    beds: 5,
    baths: 4,
    cars: 3,
    propertyType: 'House',
  },
  {
    id: '8',
    address: '9 Bay View Street',
    suburb: 'McMahons Point',
    score: 58,
    signals: [
      { type: 'Listed for sale', color: 'text-green-700', bgColor: 'bg-green-100' },
    ],
    estimatedValue: 1200000,
    updated: '2 weeks ago',
    updatedDays: 14,
    beds: 2,
    baths: 1,
    cars: 1,
    propertyType: 'Apartment',
  },
  {
    id: '9',
    address: '33 Beach Road',
    suburb: 'Bondi Beach',
    score: 52,
    signals: [
      { type: 'FSBO', color: 'text-red-700', bgColor: 'bg-red-100' },
      { type: 'Expiring listing', color: 'text-amber-700', bgColor: 'bg-amber-100' },
    ],
    estimatedValue: 3200000,
    updated: '3 weeks ago',
    updatedDays: 21,
    beds: 3,
    baths: 2,
    cars: 2,
    propertyType: 'House',
  },
  {
    id: '10',
    address: '156 Blues Point Road',
    suburb: 'McMahons Point',
    score: 45,
    signals: [
      { type: 'Requested valuation', color: 'text-pink-700', bgColor: 'bg-pink-100' },
    ],
    estimatedValue: 1650000,
    updated: '1 month ago',
    updatedDays: 30,
    beds: 3,
    baths: 2,
    cars: 1,
    propertyType: 'Apartment',
  },
  {
    id: '11',
    address: '78 Bradleys Head Road',
    suburb: 'Mosman',
    score: 38,
    signals: [
      { type: 'Neighbour selling', color: 'text-purple-700', bgColor: 'bg-purple-100' },
    ],
    estimatedValue: 5800000,
    updated: '1 month ago',
    updatedDays: 35,
    beds: 6,
    baths: 4,
    cars: 4,
    propertyType: 'House',
  },
  {
    id: '12',
    address: '12/45 Ben Boyd Road',
    suburb: 'Neutral Bay',
    score: 28,
    signals: [
      { type: 'Listed for sale', color: 'text-green-700', bgColor: 'bg-green-100' },
    ],
    estimatedValue: 780000,
    updated: '2 months ago',
    updatedDays: 60,
    beds: 1,
    baths: 1,
    cars: 1,
    propertyType: 'Apartment',
  },
];

const suburbs = ['All Suburbs', 'Bondi Beach', 'Mosman', 'Cremorne', 'Manly', 'Neutral Bay', 'McMahons Point'];

export default function LeadsPage() {
  const router = useRouter();
  const [activeSuburb, setActiveSuburb] = useState('All Suburbs');
  const [scoreFilter, setScoreFilter] = useState<ScoreFilter>('all');
  const [signalFilter, setSignalFilter] = useState<SignalFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [hideSoldListed, setHideSoldListed] = useState(false);
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredLeads = useMemo(() => {
    let filtered = [...mockLeads];

    // Suburb filter
    if (activeSuburb !== 'All Suburbs') {
      filtered = filtered.filter((lead) => lead.suburb === activeSuburb);
    }

    // Score filter
    if (scoreFilter === 'high') {
      filtered = filtered.filter((lead) => lead.score >= 75);
    } else if (scoreFilter === 'medium') {
      filtered = filtered.filter((lead) => lead.score >= 50 && lead.score < 75);
    } else if (scoreFilter === 'low') {
      filtered = filtered.filter((lead) => lead.score >= 10 && lead.score < 50);
    }

    // Signal filter
    if (signalFilter !== 'all') {
      filtered = filtered.filter((lead) =>
        lead.signals.some((s) => s.type === signalFilter)
      );
    }

    // Hide sold & listed
    if (hideSoldListed) {
      filtered = filtered.filter((lead) =>
        !lead.signals.some((s) => s.type === 'Listed for sale')
      );
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.address.toLowerCase().includes(query) ||
          lead.suburb.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'property':
          comparison = a.address.localeCompare(b.address);
          break;
        case 'suburb':
          comparison = a.suburb.localeCompare(b.suburb);
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'value':
          comparison = a.estimatedValue - b.estimatedValue;
          break;
        case 'updated':
          comparison = a.updatedDays - b.updatedDays;
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [activeSuburb, scoreFilter, signalFilter, searchQuery, hideSoldListed, sortField, sortDirection]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600 bg-green-100';
    if (score >= 50) return 'text-amber-600 bg-amber-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getSuburbCount = (suburb: string) => {
    if (suburb === 'All Suburbs') return mockLeads.length;
    return mockLeads.filter((l) => l.suburb === suburb).length;
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <svg
      className={`w-4 h-4 ${sortField === field ? 'text-primary' : 'text-gray-400'}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {sortField === field && sortDirection === 'desc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      ) : sortField === field && sortDirection === 'asc' ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      )}
    </svg>
  );

  return (
    <DemoLayout currentPage="leads">
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Scores</h1>
              <p className="text-sm text-gray-500 mt-0.5">Your {suburbs.length - 1} subscribed suburbs</p>
            </div>
          </div>
        </div>

        {/* Suburb Tabs */}
        <div className="bg-white border-b border-gray-200 px-4">
          <div className="flex items-center space-x-1 overflow-x-auto">
            {suburbs.map((suburb) => (
              <button
                key={suburb}
                onClick={() => {
                  setActiveSuburb(suburb);
                  setCurrentPage(1);
                }}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeSuburb === suburb
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {suburb}
                <span
                  className={`ml-1.5 px-2 py-0.5 text-xs rounded-full ${
                    activeSuburb === suburb
                      ? 'bg-primary/10 text-primary'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {getSuburbCount(suburb)}
                </span>
              </button>
            ))}
            <div className="flex-1"></div>
            <button
              onClick={() => router.push('/settings')}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Manage Suburbs</span>
            </button>
          </div>
        </div>

        {/* Filter Row */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-xs text-gray-500 font-medium mr-1 flex-shrink-0">Filter:</span>

            {/* All filter */}
            <button
              onClick={() => {
                setScoreFilter('all');
                setSignalFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
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
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                scoreFilter === 'high'
                  ? 'bg-green-100 border border-green-300 text-green-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              75%+
            </button>
            <button
              onClick={() => { setScoreFilter('medium'); setSignalFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                scoreFilter === 'medium'
                  ? 'bg-amber-100 border border-amber-300 text-amber-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              50-75%
            </button>
            <button
              onClick={() => { setScoreFilter('low'); setSignalFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                scoreFilter === 'low'
                  ? 'bg-gray-200 border border-gray-400 text-gray-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              10-50%
            </button>

            <div className="w-px h-5 bg-gray-300 mx-1 flex-shrink-0"></div>

            {/* Signal Filters */}
            <button
              onClick={() => { setSignalFilter('Expiring listing'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                signalFilter === 'Expiring listing'
                  ? 'bg-amber-100 border border-amber-300 text-amber-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700'
              }`}
            >
              Expiring
            </button>
            <button
              onClick={() => { setSignalFilter('Listed for sale'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                signalFilter === 'Listed for sale'
                  ? 'bg-green-100 border border-green-300 text-green-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              Listed
            </button>
            <button
              onClick={() => { setSignalFilter('Requested valuation'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                signalFilter === 'Requested valuation'
                  ? 'bg-pink-100 border border-pink-300 text-pink-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700'
              }`}
            >
              Valuation
            </button>
            <button
              onClick={() => { setSignalFilter('Neighbour selling'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                signalFilter === 'Neighbour selling'
                  ? 'bg-purple-100 border border-purple-300 text-purple-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              Neighbour
            </button>
            <button
              onClick={() => { setSignalFilter('FSBO'); setScoreFilter('all'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                signalFilter === 'FSBO'
                  ? 'bg-red-100 border border-red-300 text-red-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700'
              }`}
            >
              FSBO
            </button>

            <div className="w-px h-5 bg-gray-300 mx-1 flex-shrink-0"></div>

            {/* Hide Sold & Listed Toggle */}
            <button
              onClick={() => setHideSoldListed(!hideSoldListed)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 transition-colors ${
                hideSoldListed
                  ? 'bg-gray-200 border border-gray-400 text-gray-700'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              Hide Sold & Listed
            </button>

            <div className="flex-1"></div>

            {/* Search */}
            <div className="relative flex-shrink-0">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-primary w-40 bg-white"
              />
              <svg
                className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Leads Table */}
        <div className="flex-1 overflow-auto">
          <div className="bg-white overflow-x-auto">
            <table className="min-w-full" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th style={{ width: 240, minWidth: 140 }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div onClick={() => handleSort('property')} className="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                      <span>Property</span>
                      <SortIcon field="property" />
                    </div>
                  </th>
                  <th style={{ width: 120, minWidth: 90 }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div onClick={() => handleSort('suburb')} className="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                      <span>Suburb</span>
                      <SortIcon field="suburb" />
                    </div>
                  </th>
                  <th style={{ width: 130, minWidth: 100 }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div onClick={() => handleSort('score')} className="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                      <span>AI Seller Score</span>
                      <SortIcon field="score" />
                    </div>
                  </th>
                  <th style={{ width: 280, minWidth: 160 }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <span>Signals</span>
                  </th>
                  <th style={{ width: 110, minWidth: 90 }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div onClick={() => handleSort('value')} className="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                      <span>Est. Value</span>
                      <SortIcon field="value" />
                    </div>
                  </th>
                  <th style={{ width: 100, minWidth: 80 }} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <div onClick={() => handleSort('updated')} className="flex items-center space-x-1 cursor-pointer hover:text-gray-700">
                      <span>Updated</span>
                      <SortIcon field="updated" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/leads/${lead.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{lead.address}</p>
                        <p className="text-xs text-gray-500">
                          {lead.beds} bed • {lead.baths} bath • {lead.cars} car • {lead.propertyType}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">{lead.suburb}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {lead.signals.map((signal, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 text-xs font-medium rounded-full ${signal.bgColor} ${signal.color}`}
                          >
                            {signal.type}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900">{formatValue(lead.estimatedValue)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">{lead.updated}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {paginatedLeads.length === 0 && (
              <div className="p-12 text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-500">No leads match your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredLeads.length)}-
            {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} properties
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  currentPage === page
                    ? 'bg-primary text-white'
                    : 'border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
