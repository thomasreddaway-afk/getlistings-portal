'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
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
    <AppLayout>
      <div className="flex h-full">
        {/* Main content area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedLeadId ? 'mr-[500px]' : ''}`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {data?.total ?? 0} total leads
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search leads..."
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

                {/* Source Filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => {
                    setSourceFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">All Sources</option>
                  <option value="facebook_ad">Facebook Ads</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="manual">Manual Entry</option>
                </select>

                {/* Stage Filter */}
                <select
                  value={stageFilter}
                  onChange={(e) => {
                    setStageFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">All Stages</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="appointment_set">Appointment Set</option>
                  <option value="appraisal_done">Appraisal Done</option>
                  <option value="proposal_sent">Proposal Sent</option>
                  <option value="listed">Listed</option>
                  <option value="sold">Sold</option>
                  <option value="lost">Lost</option>
                </select>
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
    </AppLayout>
  );
}
