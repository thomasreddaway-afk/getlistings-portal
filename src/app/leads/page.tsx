'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DemoLayout } from '@/components/layout';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadProfile } from '@/components/leads/LeadProfile';
import { getAllLeads, apiRequest } from '@/lib/api';
import type { Lead, Property } from '@/types/entities';
import { Settings } from 'lucide-react';

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  perPage: number;
}

async function fetchLeads(params: {
  page: number;
  limit: number;
  search?: string;
  source?: string;
  stage?: string;
}): Promise<LeadsResponse> {
  // Use the MongoDB API directly (same as demo.html)
  const response = await getAllLeads({
    page: params.page,
    perPage: params.limit,
    search: params.search,
  });
  
  return {
    leads: response.leads as Lead[],
    total: response.total,
    page: response.page,
    perPage: response.perPage,
  };
}

async function fetchLead(id: string): Promise<{ lead: Lead; property?: Property }> {
  // Get single lead from API
  const response = await apiRequest<{ lead: Lead; property?: Property }>(`/lead/${id}`, 'GET');
  return response;
}

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['leads', page, search, sourceFilter, stageFilter],
    queryFn: () => fetchLeads({
      page,
      limit: 50,
      search: search || undefined,
      source: sourceFilter || undefined,
      stage: stageFilter || undefined,
    }),
  });

  const { data: selectedLeadData, isLoading: isLoadingLead } = useQuery({
    queryKey: ['lead', selectedLeadId],
    queryFn: () => fetchLead(selectedLeadId!),
    enabled: !!selectedLeadId,
  });

  const handleRowClick = (lead: Lead) => {
    setSelectedLeadId(lead.id);
  };

  const handleCloseProfile = () => {
    setSelectedLeadId(null);
  };

  const handleLeadUpdate = () => {
    refetch();
  };

  return (
    <DemoLayout currentPage="leads">
      <div className="flex h-full flex-col">
        {/* Header - matching demo.html */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Scores</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {data?.total ?? 0} properties in your subscribed suburbs
              </p>
            </div>
          </div>
        </div>

        {/* Filter Row - matching demo.html */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-xs text-gray-500 font-medium mr-1 flex-shrink-0">Filter:</span>
            <button
              onClick={() => { setSourceFilter(''); setStageFilter(''); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full flex-shrink-0 ${
                !sourceFilter && !stageFilter
                  ? 'bg-red-500 text-white'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              All
            </button>
            
            {/* Score Filters */}
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:border-green-300 hover:bg-green-50 hover:text-green-700 flex-shrink-0">
              75%+
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 flex-shrink-0">
              50-75%
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:border-gray-400 hover:bg-gray-100 hover:text-gray-700 flex-shrink-0">
              10-50%
            </button>
            
            <div className="w-px h-5 bg-gray-300 mx-1 flex-shrink-0"></div>
            
            {/* Signal Filters */}
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 flex-shrink-0">
              Expiring
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:border-green-300 hover:bg-green-50 hover:text-green-700 flex-shrink-0">
              Listed
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-medium rounded-full hover:border-pink-300 hover:bg-pink-50 hover:text-pink-700 flex-shrink-0">
              Valuation
            </button>
            
            {/* Spacer */}
            <div className="flex-1"></div>
            
            {/* Search */}
            <div className="relative flex-shrink-0">
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-full text-xs focus:outline-none focus:border-red-500 w-40 bg-white"
              />
              <svg
                className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className={`flex-1 flex flex-col overflow-hidden ${selectedLeadId ? 'mr-[500px]' : ''}`}>

          {/* Table */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-red-600 mb-2">Failed to load leads</p>
                  <button
                    onClick={() => refetch()}
                    className="text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : (
              <LeadsTable
                leads={data?.leads ?? []}
                onRowClick={handleRowClick}
                selectedLeadId={selectedLeadId}
              />
            )}
          </div>

          {/* Pagination */}
          {data && data.total > 50 && (
            <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing <span className="font-medium">{(page - 1) * 50 + 1}-{Math.min(page * 50, data.total)}</span> of <span className="font-medium">{data.total.toLocaleString()}</span> properties
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 50 >= data.total}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lead Profile Sidebar */}
        {selectedLeadId && (
          <div className="fixed top-0 right-0 w-[500px] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto z-50">
            {isLoadingLead ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            ) : selectedLeadData ? (
              <LeadProfile
                lead={selectedLeadData.lead}
                property={selectedLeadData.property}
                onClose={handleCloseProfile}
                onUpdate={handleLeadUpdate}
              />
            ) : null}
          </div>
        )}
      </div>
    </DemoLayout>
  );
}
