'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Home, 
  Phone,
  Calendar,
  Target,
  BarChart2,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

// Mock analytics data
const kpiData = {
  totalRevenue: { value: '$892,450', change: 12.5, isUp: true },
  leadsGenerated: { value: '1,247', change: 8.3, isUp: true },
  listingsWon: { value: '23', change: -2.1, isUp: false },
  avgDaysToSell: { value: '34', change: -5.2, isUp: true },
  conversionRate: { value: '18.4%', change: 3.2, isUp: true },
  avgCommission: { value: '$38,800', change: 6.7, isUp: true },
};

const monthlyData = [
  { month: 'Jul', leads: 98, listings: 8, sales: 5 },
  { month: 'Aug', leads: 112, listings: 10, sales: 7 },
  { month: 'Sep', leads: 125, listings: 9, sales: 6 },
  { month: 'Oct', leads: 143, listings: 12, sales: 9 },
  { month: 'Nov', leads: 156, listings: 14, sales: 11 },
  { month: 'Dec', leads: 168, listings: 11, sales: 8 },
  { month: 'Jan', leads: 189, listings: 15, sales: 12 },
];

const leadSources = [
  { source: 'Facebook Ads', leads: 456, percentage: 36.5, color: 'bg-blue-500' },
  { source: 'Google Ads', leads: 312, percentage: 25.0, color: 'bg-red-500' },
  { source: 'Referrals', leads: 234, percentage: 18.8, color: 'bg-green-500' },
  { source: 'Website', leads: 156, percentage: 12.5, color: 'bg-purple-500' },
  { source: 'Other', leads: 89, percentage: 7.2, color: 'bg-gray-400' },
];

const topSuburbs = [
  { suburb: 'Mosman', leads: 89, listings: 12, revenue: '$156,000' },
  { suburb: 'Manly', leads: 76, listings: 9, revenue: '$134,000' },
  { suburb: 'Bondi', leads: 68, listings: 8, revenue: '$112,000' },
  { suburb: 'Coogee', leads: 54, listings: 6, revenue: '$98,000' },
  { suburb: 'Neutral Bay', leads: 47, listings: 5, revenue: '$87,000' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('This Month');

  return (
    <DemoLayout currentPage="analytics">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-sm text-gray-500 mt-0.5">Performance metrics and insights</p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
            >
              <option>This Week</option>
              <option>This Month</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
              <option>All Time</option>
            </select>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* KPI Cards */}
          <div className="grid grid-cols-6 gap-4">
            {[
              { label: 'Total Revenue', ...kpiData.totalRevenue, icon: DollarSign, color: 'text-green-600 bg-green-100' },
              { label: 'Leads Generated', ...kpiData.leadsGenerated, icon: Users, color: 'text-blue-600 bg-blue-100' },
              { label: 'Listings Won', ...kpiData.listingsWon, icon: Home, color: 'text-purple-600 bg-purple-100' },
              { label: 'Avg Days to Sell', ...kpiData.avgDaysToSell, icon: Calendar, color: 'text-amber-600 bg-amber-100' },
              { label: 'Conversion Rate', ...kpiData.conversionRate, icon: Target, color: 'text-red-600 bg-red-100' },
              { label: 'Avg Commission', ...kpiData.avgCommission, icon: DollarSign, color: 'text-emerald-600 bg-emerald-100' },
            ].map((kpi, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${kpi.color}`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${kpi.isUp ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.isUp ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                    {Math.abs(kpi.change)}%
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-1">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Performance Chart */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Performance Overview</h3>
                <div className="flex items-center space-x-4 text-xs">
                  <span className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-1.5"></span>Leads</span>
                  <span className="flex items-center"><span className="w-2 h-2 bg-purple-500 rounded-full mr-1.5"></span>Listings</span>
                  <span className="flex items-center"><span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>Sales</span>
                </div>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-48 pt-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex flex-col items-center space-y-1 flex-1">
                    <div className="flex items-end space-x-1 h-40">
                      <div 
                        className="w-4 bg-blue-500 rounded-t" 
                        style={{ height: `${(data.leads / 200) * 100}%` }}
                      ></div>
                      <div 
                        className="w-4 bg-purple-500 rounded-t" 
                        style={{ height: `${(data.listings / 20) * 100}%` }}
                      ></div>
                      <div 
                        className="w-4 bg-green-500 rounded-t" 
                        style={{ height: `${(data.sales / 15) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lead Sources */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Lead Sources</h3>
              <div className="space-y-3">
                {leadSources.map((source, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{source.source}</span>
                      <span className="text-sm font-medium text-gray-900">{source.leads}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${source.color} rounded-full`}
                        style={{ width: `${source.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Top Suburbs */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Top Performing Suburbs</h3>
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100">
                    <th className="text-left pb-2 font-medium">Suburb</th>
                    <th className="text-right pb-2 font-medium">Leads</th>
                    <th className="text-right pb-2 font-medium">Listings</th>
                    <th className="text-right pb-2 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSuburbs.map((suburb, index) => (
                    <tr key={index} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 text-sm font-medium text-gray-900">{suburb.suburb}</td>
                      <td className="py-2.5 text-sm text-right text-gray-600">{suburb.leads}</td>
                      <td className="py-2.5 text-sm text-right text-gray-600">{suburb.listings}</td>
                      <td className="py-2.5 text-sm text-right font-medium text-green-600">{suburb.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Activity Summary */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">347</p>
                      <p className="text-xs text-gray-500">Calls Made</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">56</p>
                      <p className="text-xs text-gray-500">Appraisals</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Home className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">23</p>
                      <p className="text-xs text-gray-500">Listings Won</p>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-50 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                      <p className="text-xs text-gray-500">Properties Sold</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
