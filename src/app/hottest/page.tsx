'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

interface Suburb {
  suburb: string;
  state?: string;
}

interface Lead {
  _id: string;
  streetAddress: string;
  fullAddress?: string;
  suburb: string;
  state?: string;
  postCode?: string;
  sellingScore: number;
  salePrice?: string;
  estimatedValue?: number;
  owner1Name?: string;
  ownerType?: string;
  bed?: number;
  bath?: number;
  car?: number;
}

function getScoreStyle(score: number) {
  if (score >= 95) {
    return {
      border: 'border-orange-200 hover:border-orange-300',
      badge: 'bg-orange-100 text-orange-700',
      gradient: 'from-orange-500 to-red-500',
      emoji: '🔥'
    };
  } else if (score >= 90) {
    return {
      border: 'border-orange-100 hover:border-orange-200',
      badge: 'bg-orange-100 text-orange-700',
      gradient: 'from-orange-400 to-orange-600',
      emoji: '🔥'
    };
  } else if (score >= 85) {
    return {
      border: 'border-amber-100 hover:border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      gradient: 'from-amber-400 to-orange-500',
      emoji: '🔥'
    };
  } else {
    return {
      border: 'border-gray-200 hover:border-amber-200',
      badge: 'bg-yellow-100 text-yellow-700',
      gradient: 'from-yellow-400 to-amber-500',
      emoji: '⚡'
    };
  }
}

function formatPrice(lead: Lead): { display: string; commission: string } {
  // First try actual sale price
  if (lead.salePrice && lead.salePrice !== '') {
    const priceStr = String(lead.salePrice).replace(/[$,]/g, '');
    const price = parseFloat(priceStr);
    if (!isNaN(price) && price > 0) {
      if (price >= 1000000) {
        return {
          display: `$${(price / 1000000).toFixed(1)}M`,
          commission: `~$${Math.round(price * 0.025 / 1000)}K commission`
        };
      } else if (price >= 1000) {
        return {
          display: `$${Math.round(price / 1000)}K`,
          commission: `~$${Math.round(price * 0.025 / 1000)}K commission`
        };
      }
    }
  }
  
  // Then try estimated value
  if (lead.estimatedValue) {
    const price = lead.estimatedValue;
    if (price >= 1000000) {
      return {
        display: `~$${(price / 1000000).toFixed(1)}M`,
        commission: `~$${Math.round(price * 0.025 / 1000)}K commission`
      };
    } else if (price >= 1000) {
      return {
        display: `~$${Math.round(price / 1000)}K`,
        commission: `~$${Math.round(price * 0.025 / 1000)}K commission`
      };
    }
  }
  
  return { display: 'N/A', commission: '' };
}

export default function HottestLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHottestLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get subscribed suburbs - returns objects with {suburb, state}
      const suburbsResponse = await apiRequest<{ result: Suburb[] }>('/lead/my-suburbs-list', 'GET');
      const suburbs = suburbsResponse.result || [];
      
      // Get leads sorted by score - send suburbs as objects like API expects
      const response = await apiRequest<{ leads: Lead[] }>('/lead/all', 'POST', {
        page: 1,
        perPage: 100,
        sellingScore: { min: 0, max: 99 }, // Exclude already-listed (score 100)
        suburbs: suburbs.map(s => ({ suburb: s.suburb, state: s.state })),
      });
      
      if (response.leads) {
        // Sort by score and take top 20
        const sorted = [...response.leads].sort((a, b) => (b.sellingScore || 0) - (a.sellingScore || 0));
        setLeads(sorted.slice(0, 20));
      }
    } catch (err) {
      console.error('Failed to load hottest leads:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHottestLeads();
  }, []);

  return (
    <DemoLayout currentPage="hottest">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hottest Leads</h1>
              <p className="text-sm text-gray-500 mt-0.5">Your highest-scoring leads ready for action</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <span>LIVE</span>
              </span>
              <Link
                href="/leads"
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <span>View All Leads</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={loadHottestLeads} className="mt-2 text-sm text-red-600 underline">Retry</button>
          </div>
        )}

        <div className="p-4">
          {/* Lead Cards - Matching demo.html exactly */}
          <div className="space-y-3" id="hottest-leads-list">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <p className="text-gray-500">Loading hottest leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center">
                <p className="text-gray-600 font-medium">No hot leads found</p>
                <p className="text-gray-400 text-sm mt-1">Check back later for high-scoring leads</p>
              </div>
            ) : (
              leads.map((lead, index) => {
                const rank = index + 1;
                const score = lead.sellingScore || 0;
                const style = getScoreStyle(score);
                const { display: priceDisplay, commission } = formatPrice(lead);
                
                // Build details like demo.html
                const details: string[] = [];
                if (lead.suburb) {
                  details.push(`${lead.suburb} ${lead.state || ''} ${lead.postCode || ''}`.trim());
                }
                if (lead.bed) details.push(`${lead.bed} bed`);
                if (lead.bath) details.push(`${lead.bath} bath`);
                
                return (
                  <div 
                    key={lead._id}
                    className={`bg-white rounded-xl border-2 ${style.border} p-5 cursor-pointer hover:shadow-lg transition-all flex items-center`}
                  >
                    {/* Rank Circle */}
                    <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${style.gradient} rounded-full text-white font-bold text-lg mr-4 flex-shrink-0`}>
                      {rank}
                    </div>
                    
                    {/* Lead Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {lead.streetAddress || lead.fullAddress || 'Unknown Address'}
                        </h3>
                        <span className={`px-2.5 py-1 ${style.badge} text-xs font-bold rounded-full flex-shrink-0`}>
                          {style.emoji} {score}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5 truncate">
                        {details.join(' • ')}
                      </p>
                    </div>
                    
                    {/* Price + Commission */}
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-lg font-bold text-gray-900">{priceDisplay}</p>
                      {commission && (
                        <p className="text-xs text-green-600 font-medium">{commission}</p>
                      )}
                    </div>
                    
                    {/* Chevron */}
                    <ChevronRight className="w-5 h-5 text-gray-300 ml-4 flex-shrink-0" />
                  </div>
                );
              })
            )}
          </div>
          
          {/* Bottom CTA */}
          {leads.length > 0 && (
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900">Want to see more leads?</p>
                <p className="text-sm text-gray-500 mt-0.5">Browse all leads sorted by AI score, suburb, or value</p>
              </div>
              <Link
                href="/leads"
                className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <span>View Full Lead Database</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
