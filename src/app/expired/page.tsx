'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';
import { RefreshCw, Clock, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ExpiredListing {
  _id: string;
  streetAddress?: string;
  fullAddress?: string;
  suburb: string;
  state?: string;
  totalDaysInMarket?: number;
  agent?: string;
  agency?: string;
  salePrice?: number | string;
  price?: number | string;
  listingPrice?: string;
  listedForSaleDate?: string;
  listedDate?: string;
  createdAt?: string;
  propertyType?: string;
  bed?: number;
  bath?: number;
  car?: number;
}

// Urgency based on days on market (stale listings)
function getUrgencyStyle(daysOnMarket?: number): { class: string; text: string } {
  if (!daysOnMarket) return { class: 'bg-amber-100 text-amber-700', text: 'On Market' };
  if (daysOnMarket > 365) return { class: 'bg-red-100 text-red-700', text: `${daysOnMarket} days on market` };
  if (daysOnMarket > 180) return { class: 'bg-amber-100 text-amber-700', text: `${daysOnMarket} days on market` };
  if (daysOnMarket > 90) return { class: 'bg-yellow-100 text-yellow-700', text: `${daysOnMarket} days on market` };
  return { class: 'bg-green-100 text-green-700', text: `${daysOnMarket} days on market` };
}

function formatPrice(value?: number | string): string {
  if (!value) return '';
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  if (isNaN(num) || num <= 0) return '';
  return '$' + num.toLocaleString();
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

export default function ExpiredListingsPage() {
  const router = useRouter();
  const [listings, setListings] = useState<ExpiredListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, urgentCount: 0, soonCount: 0 });

  const loadExpiredListings = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<{ expiredLeads?: ExpiredListing[]; leads?: ExpiredListing[]; total?: number }>('/lead/expired-listings', 'POST', {
        page: 1,
        perPage: 100
      });
      
      // Handle different response structures - API returns expiredLeads
      const data = response.expiredLeads || response.leads || [];
      const total = response.total || data.length;
      
      // Sort by days on market (most stale first)
      const sorted = [...data].sort((a, b) => 
        (b.totalDaysInMarket || 0) - (a.totalDaysInMarket || 0)
      );
      setListings(sorted);
      
      // Calculate stats
      let urgentCount = 0; // > 365 days
      let soonCount = 0;   // > 180 days
      sorted.forEach(listing => {
        const days = listing.totalDaysInMarket || 0;
        if (days > 365) urgentCount++;
        else if (days > 180) soonCount++;
      });
      
      setStats({ total, urgentCount, soonCount });
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
      <div className="flex-1 overflow-auto bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expiring Listings</h1>
              <p className="text-gray-600 text-sm mt-1">
                Properties with listings about to expire - prime opportunity to connect
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* LIVE Badge */}
              <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-700">LIVE</span>
              </div>
              <button
                onClick={loadExpiredListings}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{stats.total}</span> Expiring Listings</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{stats.urgentCount}</span> Expiring This Week</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{stats.soonCount}</span> Expiring This Month</span>
            </div>
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
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mb-4"></div>
                <p className="text-gray-500">Loading expiring listings...</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-10 h-10 text-orange-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Expiring Listings</h3>
                <p className="text-gray-500 text-center max-w-md">There are currently no listings about to expire in your areas. Check back later for new opportunities.</p>
              </div>
            ) : (
              listings.map((listing) => {
                const address = listing.streetAddress || listing.fullAddress || 'No Address';
                const urgency = getUrgencyStyle(listing.totalDaysInMarket);
                const price = formatPrice(listing.salePrice || listing.price || listing.listingPrice);
                const listedDate = formatDate(listing.listedForSaleDate || listing.listedDate || listing.createdAt);
                const propertyType = listing.propertyType?.trim() || 'Property';
                
                return (
                  <div 
                    key={listing._id} 
                    onClick={() => router.push(`/properties/${listing._id}`)}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">{address}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${urgency.class}`}>
                            {urgency.text}
                          </span>
                        </div>
                        
                        {listing.suburb && (
                          <p className="text-sm text-gray-500 mb-2">{listing.suburb}{listing.state ? `, ${listing.state}` : ''}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {propertyType !== 'Property' && (
                            <span className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                              <span>{propertyType}</span>
                            </span>
                          )}
                          {listing.bed && <span>{listing.bed} bed</span>}
                          {listing.bath && <span>{listing.bath} bath</span>}
                          {listing.car && <span>{listing.car} car</span>}
                          {price && <span className="font-semibold text-gray-900">{price}</span>}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end space-y-2">
                        {listedDate && (
                          <p className="text-xs text-gray-400">Listed: {listedDate}</p>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors mt-2" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
