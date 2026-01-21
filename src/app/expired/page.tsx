'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';
import { RefreshCw, Clock, Phone, ExternalLink } from 'lucide-react';

interface ExpiredListing {
  _id: string;
  streetAddress: string;
  suburb: string;
  state?: string;
  daysUntilExpiry?: number;
  daysOnMarket?: number;
  agentName?: string;
  agencyName?: string;
  listingPrice?: string;
  salePrice?: string;
  listingUrl?: string;
  propertyType?: string;
  bed?: number;
  bath?: number;
  car?: number;
  updatedAt?: string;
}

function getUrgencyColor(days?: number): string {
  if (!days || days <= 3) return 'bg-red-100 text-red-700';
  if (days <= 7) return 'bg-orange-100 text-orange-700';
  if (days <= 14) return 'bg-amber-100 text-amber-700';
  return 'bg-gray-100 text-gray-700';
}

function getUrgencyBorder(days?: number): string {
  if (!days || days <= 3) return 'border-l-4 border-l-red-500';
  if (days <= 7) return 'border-l-4 border-l-orange-500';
  if (days <= 14) return 'border-l-4 border-l-amber-500';
  return 'border-l-4 border-l-gray-300';
}

export default function ExpiredListingsPage() {
  const [listings, setListings] = useState<ExpiredListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExpiredListings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<{ leads: ExpiredListing[] }>('/lead/expired-listings', 'POST', {
        page: 1,
        perPage: 100
      });
      
      if (response.leads) {
        // Sort by days until expiry
        const sorted = [...response.leads].sort((a, b) => 
          (a.daysUntilExpiry || 0) - (b.daysUntilExpiry || 0)
        );
        setListings(sorted);
      }
    } catch (err) {
      console.error('Failed to load expired listings:', err);
      setError(err instanceof Error ? err.message : 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpiredListings();
  }, []);

  return (
    <DemoLayout currentPage="expired">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expiring Listings</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Properties with listings about to expire - prime opportunities
              </p>
            </div>
            <button
              onClick={loadExpiredListings}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={loadExpiredListings} className="mt-2 text-sm text-red-600 underline">Retry</button>
          </div>
        )}

        <div className="p-4">
          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <p className="text-gray-500">Loading expiring listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p>No expiring listings found in your areas.</p>
              </div>
            ) : (
              listings.map((listing) => (
                <div 
                  key={listing._id} 
                  className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow ${getUrgencyBorder(listing.daysUntilExpiry)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="font-semibold text-gray-900">{listing.streetAddress}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getUrgencyColor(listing.daysUntilExpiry)}`}>
                          {listing.daysUntilExpiry ? `${listing.daysUntilExpiry} days left` : 'Expired'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-500">{listing.suburb}{listing.state && `, ${listing.state}`}</p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        {listing.agentName && (
                          <span>Listed with <span className="font-medium">{listing.agentName}</span></span>
                        )}
                        {listing.agencyName && (
                          <span className="text-gray-400">({listing.agencyName})</span>
                        )}
                        {listing.daysOnMarket && (
                          <span>{listing.daysOnMarket} days on market</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
                        {listing.bed && <span>{listing.bed} bed</span>}
                        {listing.bath && <span>{listing.bath} bath</span>}
                        {listing.car && <span>{listing.car} car</span>}
                        {listing.propertyType && <span>{listing.propertyType}</span>}
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-gray-900">
                        {listing.listingPrice || listing.salePrice || 'Price TBA'}
                      </p>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        {listing.listingUrl && (
                          <a 
                            href={listing.listingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        )}
                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                          Contact Owner
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
