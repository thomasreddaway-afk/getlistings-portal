'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AppLayout } from '@/components/layout/AppLayout';
import type { Property, Lead } from '@/types/entities';
import { formatDistanceToNow } from 'date-fns';

interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
}

async function fetchProperties(params: {
  page: number;
  limit: number;
  search?: string;
  minScore?: number;
}): Promise<PropertiesResponse> {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
  });
  
  if (params.search) searchParams.set('search', params.search);
  if (params.minScore) searchParams.set('minScore', params.minScore.toString());

  const response = await fetch(`/api/properties?${searchParams}`);
  if (!response.ok) throw new Error('Failed to fetch properties');
  return response.json();
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  if (score >= 40) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Hot';
  if (score >= 60) return 'Warm';
  if (score >= 40) return 'Cool';
  return 'Cold';
}

export default function PropertiesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState<number | undefined>();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['properties', page, search, minScoreFilter],
    queryFn: () => fetchProperties({
      page,
      limit: 30,
      search: search || undefined,
      minScore: minScoreFilter,
    }),
  });

  return (
    <AppLayout>
      <div className="flex h-full">
        {/* Main content */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedProperty ? 'mr-[400px]' : ''}`}>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {data?.total ?? 0} properties tracked
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by address..."
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

                {/* Score Filter */}
                <select
                  value={minScoreFilter ?? ''}
                  onChange={(e) => {
                    setMinScoreFilter(e.target.value ? parseInt(e.target.value) : undefined);
                    setPage(1);
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="">All Scores</option>
                  <option value="80">Hot (80+)</option>
                  <option value="60">Warm+ (60+)</option>
                  <option value="40">Cool+ (40+)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1 overflow-auto p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-red-600 mb-2">Failed to load properties</p>
                  <button onClick={() => refetch()} className="text-primary hover:underline">
                    Try again
                  </button>
                </div>
              </div>
            ) : data?.properties.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No properties found</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Properties are created when leads mention an address.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.properties.map((property) => (
                  <div
                    key={property.id}
                    onClick={() => setSelectedProperty(property)}
                    className={`bg-white rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedProperty?.id === property.id 
                        ? 'border-primary ring-2 ring-primary ring-opacity-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {/* Score Badge */}
                    <div className="flex items-start justify-between mb-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getScoreColor(property.seller_score)}`}>
                        {getScoreLabel(property.seller_score)} • {property.seller_score}
                      </span>
                      <span className="text-xs text-gray-400">
                        {property.linked_lead_ids.length} lead{property.linked_lead_ids.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Address */}
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">
                      {property.full_address}
                    </h3>

                    {/* Property Type & Beds/Baths */}
                    {(property.property_type || property.bedrooms || property.bathrooms) && (
                      <div className="flex items-center space-x-3 text-sm text-gray-500 mb-2">
                        {property.property_type && (
                          <span className="capitalize">{property.property_type}</span>
                        )}
                        {property.bedrooms && (
                          <span>{property.bedrooms} bed</span>
                        )}
                        {property.bathrooms && (
                          <span>{property.bathrooms} bath</span>
                        )}
                      </div>
                    )}

                    {/* Estimated Value */}
                    {property.estimated_value && (
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        ${property.estimated_value.toLocaleString()}
                      </p>
                    )}

                    {/* Score Factors */}
                    {property.score_factors && property.score_factors.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-gray-100">
                        {property.score_factors.slice(0, 3).map((factor, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {factor}
                          </span>
                        ))}
                        {property.score_factors.length > 3 && (
                          <span className="px-2 py-0.5 text-gray-400 text-xs">
                            +{property.score_factors.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Updated time */}
                    <p className="text-xs text-gray-400 mt-3">
                      Updated {formatDistanceToNow(property.updated_at)} ago
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {data && data.total > 30 && (
            <div className="px-6 py-3 border-t border-gray-200 bg-white flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Showing {(page - 1) * 30 + 1} to {Math.min(page * 30, data.total)} of {data.total}
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
                  disabled={page * 30 >= data.total}
                  className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Property Detail Sidebar */}
        {selectedProperty && (
          <div className="fixed top-0 right-0 w-[400px] h-full bg-white border-l border-gray-200 shadow-xl overflow-y-auto">
            <div className="p-6">
              {/* Close button */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Property Details</h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Score */}
              <div className="text-center mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold ${getScoreColor(selectedProperty.seller_score)}`}>
                  Seller Score: {selectedProperty.seller_score}
                </div>
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Address
                </label>
                <p className="text-gray-900 font-medium">{selectedProperty.full_address}</p>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedProperty.property_type && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Type
                    </label>
                    <p className="text-gray-900 capitalize">{selectedProperty.property_type}</p>
                  </div>
                )}
                {selectedProperty.bedrooms && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Bedrooms
                    </label>
                    <p className="text-gray-900">{selectedProperty.bedrooms}</p>
                  </div>
                )}
                {selectedProperty.bathrooms && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Bathrooms
                    </label>
                    <p className="text-gray-900">{selectedProperty.bathrooms}</p>
                  </div>
                )}
                {selectedProperty.land_size && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      Land Size
                    </label>
                    <p className="text-gray-900">{selectedProperty.land_size} m²</p>
                  </div>
                )}
              </div>

              {/* Estimated Value */}
              {selectedProperty.estimated_value && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Estimated Value
                  </label>
                  <p className="text-2xl font-bold text-gray-900">
                    ${selectedProperty.estimated_value.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Score Factors */}
              {selectedProperty.score_factors && selectedProperty.score_factors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Score Factors
                  </label>
                  <div className="space-y-2">
                    {selectedProperty.score_factors.map((factor, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedProperty.notes && (
                <div className="mb-6">
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Notes
                  </label>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedProperty.notes}</p>
                </div>
              )}

              {/* Linked Leads */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Linked Leads ({selectedProperty.linked_lead_ids.length})
                </label>
                {selectedProperty.linked_lead_ids.length === 0 ? (
                  <p className="text-sm text-gray-500">No leads linked to this property</p>
                ) : (
                  <div className="space-y-2">
                    {selectedProperty.linked_lead_ids.map((leadId) => (
                      <a
                        key={leadId}
                        href={`/leads?selected=${leadId}`}
                        className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm text-primary font-medium">View Lead →</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
