'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';
import { RefreshCw, TrendingUp, TrendingDown, Users, Home, DollarSign, Target } from 'lucide-react';

interface AnalyticsData {
  totalLeads?: number;
  unlockedLeads?: number;
  contactedLeads?: number;
  listingsWon?: number;
  totalRevenue?: number;
  avgScore?: number;
  conversionRate?: number;
  monthlyStats?: {
    month: string;
    leads: number;
    unlocked: number;
    listings: number;
  }[];
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<AnalyticsData>('/user/analytics', 'GET');
      setData(response);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError(err instanceof Error ? err.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color,
    trend,
    trendValue 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType;
    color: string;
    trend?: 'up' | 'down';
    trendValue?: string;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && trendValue && (
          <div className={`flex items-center space-x-1 text-xs font-medium ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );

  return (
    <DemoLayout currentPage="analytics">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-500 mt-0.5">Track your performance and growth</p>
            </div>
            <button
              onClick={loadAnalytics}
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
            <button onClick={loadAnalytics} className="mt-2 text-sm text-red-600 underline">Retry</button>
          </div>
        )}

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
              <p className="text-gray-500">Loading analytics...</p>
            </div>
          ) : data ? (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-4 gap-4">
                <StatCard
                  title="Total Leads"
                  value={data.totalLeads?.toLocaleString() || '—'}
                  icon={Users}
                  color="bg-blue-500"
                />
                <StatCard
                  title="Leads Unlocked"
                  value={data.unlockedLeads?.toLocaleString() || '—'}
                  icon={Target}
                  color="bg-green-500"
                />
                <StatCard
                  title="Listings Won"
                  value={data.listingsWon?.toLocaleString() || '—'}
                  icon={Home}
                  color="bg-purple-500"
                />
                <StatCard
                  title="Total Revenue"
                  value={data.totalRevenue ? `$${data.totalRevenue.toLocaleString()}` : '—'}
                  icon={DollarSign}
                  color="bg-amber-500"
                />
              </div>

              {/* Conversion Rate */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-blue-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{data.totalLeads || 0}</p>
                    <p className="text-sm text-blue-700">Total Leads</p>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div className="flex-1 bg-green-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">{data.unlockedLeads || 0}</p>
                    <p className="text-sm text-green-700">Unlocked</p>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div className="flex-1 bg-amber-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600">{data.contactedLeads || 0}</p>
                    <p className="text-sm text-amber-700">Contacted</p>
                  </div>
                  <div className="text-gray-300">→</div>
                  <div className="flex-1 bg-purple-100 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-600">{data.listingsWon || 0}</p>
                    <p className="text-sm text-purple-700">Listings Won</p>
                  </div>
                </div>
                {data.conversionRate !== undefined && (
                  <p className="text-center mt-4 text-sm text-gray-500">
                    Conversion Rate: <span className="font-semibold text-gray-900">{data.conversionRate}%</span>
                  </p>
                )}
              </div>

              {/* Monthly Stats */}
              {data.monthlyStats && data.monthlyStats.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Monthly Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="text-left py-2 text-sm font-medium text-gray-500">Month</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500">Leads</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500">Unlocked</th>
                          <th className="text-right py-2 text-sm font-medium text-gray-500">Listings</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {data.monthlyStats.map((month, index) => (
                          <tr key={index}>
                            <td className="py-3 text-sm text-gray-900">{month.month}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{month.leads}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{month.unlocked}</td>
                            <td className="py-3 text-sm text-gray-600 text-right">{month.listings}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No analytics data available.
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
