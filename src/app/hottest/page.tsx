'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Phone, Mail, ArrowRight } from 'lucide-react';

interface Lead {
  _id: string;
  streetAddress: string;
  suburb: string;
  sellingScore: number;
  salePrice?: string;
  owner1Name?: string;
  phone?: string;
  email?: string;
  garageSale?: boolean;
  listedForSale?: boolean;
  requested?: boolean;
  neighbourSold?: boolean;
  fsboListing?: boolean;
  updatedAt: string;
  bed?: number;
  bath?: number;
  car?: number;
  propertyType?: string;
}

const signalStyleMap: Record<string, { text: string; bg: string; color: string }> = {
  garageSale: { text: 'Garage sale', bg: 'bg-amber-100', color: 'text-amber-700' },
  listedForSale: { text: 'Listed for sale', bg: 'bg-green-100', color: 'text-green-700' },
  requested: { text: 'Valuation requested', bg: 'bg-pink-100', color: 'text-pink-700' },
  neighbourSold: { text: 'Neighbour sold', bg: 'bg-purple-100', color: 'text-purple-700' },
  fsboListing: { text: 'FSBO', bg: 'bg-red-100', color: 'text-red-700' },
};

function getLeadSignals(lead: Lead) {
  const signals: { text: string; bg: string; color: string }[] = [];
  if (lead.garageSale) signals.push(signalStyleMap.garageSale);
  if (lead.listedForSale) signals.push(signalStyleMap.listedForSale);
  if (lead.requested) signals.push(signalStyleMap.requested);
  if (lead.neighbourSold) signals.push(signalStyleMap.neighbourSold);
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
  return `${Math.floor(diffMins / 1440)}d ago`;
}

function calculateCommission(salePrice?: string): string {
  if (!salePrice) return '$0';
  const price = parseFloat(salePrice.replace(/[$,]/g, ''));
  const commission = price * 0.02;
  return `$${Math.round(commission).toLocaleString()}`;
}

function getScoreColor(score: number): string {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-orange-500';
}

export default function HottestLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHottestLeads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get subscribed suburbs
      const suburbs = await apiRequest<{ suburb: string }[]>('/lead/my-suburbs-list', 'GET');
      
      // Get leads sorted by score
      const response = await apiRequest<{ leads: Lead[] }>('/lead/all', 'POST', {
        page: 1,
        perPage: 100,
        suburbs: suburbs?.map(s => s.suburb) || [],
      });
      
      if (response.leads) {
        // Sort by score and take top leads
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
              <button
                onClick={loadHottestLeads}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
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
          {/* Lead Cards */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
                <p className="text-gray-500">Loading hottest leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No leads found. Subscribe to suburbs to start receiving leads.</p>
                <Link href="/settings" className="inline-block mt-3 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">
                  Manage Suburbs
                </Link>
              </div>
            ) : (
              leads.map((lead, index) => (
                <div key={lead._id} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      {/* Score Badge */}
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl ${getScoreColor(lead.sellingScore)} flex items-center justify-center`}>
                          <span className="text-white font-bold text-lg">{lead.sellingScore}</span>
                        </div>
                        {index < 3 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Lead Info */}
                      <div>
                        <h3 className="font-semibold text-gray-900">{lead.streetAddress}</h3>
                        <p className="text-sm text-gray-500">{lead.suburb}</p>
                        
                        {/* Owner Name */}
                        {lead.owner1Name && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">{lead.owner1Name}</span>
                          </p>
                        )}
                        
                        {/* Signals */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getLeadSignals(lead).map((signal, idx) => (
                            <span key={idx} className={`px-2 py-0.5 text-xs rounded ${signal.bg} ${signal.color}`}>
                              {signal.text}
                            </span>
                          ))}
                        </div>
                        
                        {/* Property Details */}
                        <p className="text-xs text-gray-400 mt-2">
                          {lead.bed && `${lead.bed} bed`}
                          {lead.bath && ` • ${lead.bath} bath`}
                          {lead.propertyType && ` • ${lead.propertyType}`}
                          {` • Updated ${formatTimeAgo(lead.updatedAt)}`}
                        </p>
                      </div>
                    </div>
                    
                    {/* Right Side - Value + Actions */}
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Est. Commission</p>
                      <p className="text-xl font-bold text-green-600">{calculateCommission(lead.salePrice)}</p>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Phone className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                          <Mail className="w-5 h-5" />
                        </button>
                        <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
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
