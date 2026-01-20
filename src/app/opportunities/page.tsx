'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import { PipelineKanban } from '@/components/pipeline/PipelineKanban';
import { apiRequest } from '@/lib/api';
import type { PipelineStage, Opportunity } from '@/types/entities';

interface KanbanResponse {
  stages: PipelineStage[];
  opportunities: Record<string, Opportunity[]>;
  totals: Record<string, { count: number; value: number }>;
}

async function fetchKanbanData(): Promise<KanbanResponse> {
  // Use MongoDB API directly - pipeline data
  // Note: If endpoint doesn't exist yet, this will use mock data
  try {
    return await apiRequest<KanbanResponse>('/pipeline/kanban', 'GET');
  } catch {
    // Return empty data if endpoint doesn't exist
    return { stages: [], opportunities: {}, totals: {} };
  }
}

export default function OpportunitiesPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['pipeline-kanban'],
    queryFn: fetchKanbanData,
  });

  const handleOpportunityMove = async (opportunityId: string, newStageId: string) => {
    try {
      await apiRequest('/pipeline/move', 'POST', {
        opportunity_id: opportunityId,
        stage_id: newStageId,
      });
      refetch();
    } catch (err) {
      console.error('Error moving opportunity:', err);
    }
  };

  // Calculate totals
  const totalOpportunities = data?.totals 
    ? Object.values(data.totals).reduce((sum, t) => sum + t.count, 0) 
    : 0;
  const totalValue = data?.totals 
    ? Object.values(data.totals).reduce((sum, t) => sum + t.value, 0) 
    : 0;

  return (
    <AppLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
              <p className="text-sm text-gray-500 mt-1">
                {totalOpportunities} opportunities • ${totalValue.toLocaleString()} total value
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('kanban')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'kanban'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                    <span>Kanban</span>
                  </span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    <span>List</span>
                  </span>
                </button>
              </div>

              {/* Create Opportunity Button */}
              <button
                onClick={() => {
                  // TODO: Open create opportunity modal
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>New Opportunity</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <p className="text-red-600 mb-2">Failed to load pipeline</p>
                <button onClick={() => refetch()} className="text-primary hover:underline">
                  Try again
                </button>
              </div>
            </div>
          ) : viewMode === 'kanban' && data ? (
            <PipelineKanban
              stages={data.stages}
              opportunities={data.opportunities}
              onOpportunityMove={handleOpportunityMove}
            />
          ) : (
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Opportunity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data && Object.values(data.opportunities).flat().map((opp) => {
                    const stage = data.stages.find(s => s.id === opp.stage_id);
                    return (
                      <tr key={opp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{opp.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${stage?.color}20`,
                              color: stage?.color,
                            }}
                          >
                            {stage?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {opp.estimated_value ? `$${opp.estimated_value.toLocaleString()}` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(opp.updated_at).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
