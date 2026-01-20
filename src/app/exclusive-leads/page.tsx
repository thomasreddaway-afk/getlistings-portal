'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DemoLayout } from '@/components/layout';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { LeadProfile } from '@/components/leads/LeadProfile';
import { getAllLeads, apiRequest } from '@/lib/api';
import type { Lead, Property } from '@/types/entities';

interface LeadsResponse {
  leads: Lead[];
  total: number;
  page: number;
  perPage: number;
}

async function fetchExclusiveLeads(params: {
  page: number;
  limit: number;
  search?: string;
}): Promise<LeadsResponse> {
  // Use MongoDB API directly for exclusive leads
  const response = await getAllLeads({
    page: params.page,
    perPage: params.limit,
    search: params.search,
    // Filter for exclusive leads - high selling score
    sellingScore: { min: 85, max: 100 },
  });
  
  return {
    leads: response.leads as Lead[],
    total: response.total,
    page: response.page,
    perPage: response.perPage,
  };
}

async function fetchLead(id: string): Promise<{ lead: Lead; property?: Property }> {
  return apiRequest<{ lead: Lead; property?: Property }>(`/lead/${id}`, 'GET');
}

export default function ExclusiveLeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['exclusive-leads', page, search],
    queryFn: () => fetchExclusiveLeads({
      page,
      limit: 50,
      search: search || undefined,
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
    <DemoLayout currentPage="exclusive">
      <div className="flex h-full">
        {/* Main content area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedLeadId ? 'mr-[500px]' : ''}`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl font-bold text-gray-900">Exclusive Appraisal Leads</h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    Premium
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {data?.total ?? 0} exclusive leads • High-intent sellers requesting appraisals
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search exclusive leads..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

            {/* Premium banner */}
            <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-amber-900">
                    Exclusive Lead Package
                  </h3>
                  <p className="mt-1 text-sm text-amber-700">
                    These are high-intent sellers who have specifically requested property appraisals. 
                    Each lead is exclusive to you - no competition from other agents.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-900">{data?.total ?? 0}</p>
                  <p className="text-xs text-amber-600">This Month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-red-600 mb-2">Failed to load exclusive leads</p>
                  <button
                    onClick={() => refetch()}
                    className="text-primary hover:underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            ) : data?.leads.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No exclusive leads yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Exclusive leads will appear here as they come in from your premium campaigns.
                  </p>
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
            <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 50 + 1} to {Math.min(page * 50, data.total)} of {data.total}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * 50 >= data.total}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Lead Profile Sidebar */}
        {selectedLeadId && (
          <div className="fixed top-0 right-0 w-[500px] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
            {isLoadingLead ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
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
