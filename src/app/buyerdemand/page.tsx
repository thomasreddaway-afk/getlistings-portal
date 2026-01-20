'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Home, 
  DollarSign,
  MapPin,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock
} from 'lucide-react';

interface SuburbDemand {
  suburb: string;
  postcode: string;
  buyerDemand: number;
  demandChange: number;
  avgDaysOnMarket: number;
  activeListings: number;
  searchVolume: number;
  priceRange: string;
  topBuyerType: string;
}

const suburbDemandData: SuburbDemand[] = [
  {
    suburb: 'Mosman',
    postcode: '2088',
    buyerDemand: 94,
    demandChange: 12.3,
    avgDaysOnMarket: 28,
    activeListings: 45,
    searchVolume: 12500,
    priceRange: '$2.5M - $4.5M',
    topBuyerType: 'Families',
  },
  {
    suburb: 'Manly',
    postcode: '2095',
    buyerDemand: 89,
    demandChange: 8.7,
    avgDaysOnMarket: 32,
    activeListings: 38,
    searchVolume: 9800,
    priceRange: '$1.8M - $3.5M',
    topBuyerType: 'Young Professionals',
  },
  {
    suburb: 'Bondi',
    postcode: '2026',
    buyerDemand: 86,
    demandChange: -2.1,
    avgDaysOnMarket: 35,
    activeListings: 52,
    searchVolume: 15200,
    priceRange: '$1.5M - $3.0M',
    topBuyerType: 'Investors',
  },
  {
    suburb: 'Coogee',
    postcode: '2034',
    buyerDemand: 82,
    demandChange: 5.4,
    avgDaysOnMarket: 38,
    activeListings: 34,
    searchVolume: 7600,
    priceRange: '$1.2M - $2.5M',
    topBuyerType: 'Couples',
  },
  {
    suburb: 'Neutral Bay',
    postcode: '2089',
    buyerDemand: 78,
    demandChange: -4.2,
    avgDaysOnMarket: 42,
    activeListings: 29,
    searchVolume: 5400,
    priceRange: '$1.4M - $2.8M',
    topBuyerType: 'Downsizers',
  },
];

const buyerTypeData = [
  { type: 'Families', percentage: 32, color: 'bg-blue-500' },
  { type: 'Investors', percentage: 24, color: 'bg-green-500' },
  { type: 'First Home Buyers', percentage: 18, color: 'bg-purple-500' },
  { type: 'Downsizers', percentage: 15, color: 'bg-amber-500' },
  { type: 'Upsizers', percentage: 11, color: 'bg-red-500' },
];

function getDemandColor(demand: number) {
  if (demand >= 90) return 'text-green-600 bg-green-100';
  if (demand >= 80) return 'text-blue-600 bg-blue-100';
  if (demand >= 70) return 'text-amber-600 bg-amber-100';
  return 'text-gray-600 bg-gray-100';
}

export default function BuyerDemandPage() {
  const [selectedSuburb, setSelectedSuburb] = useState<string | null>(null);

  return (
    <DemoLayout currentPage="buyerdemand">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Buyer Demand</h1>
              <p className="text-sm text-gray-500 mt-0.5">Real-time buyer activity and market demand insights</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Last updated:</span>
              <span className="text-xs font-medium text-gray-700">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Overview Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <span className="flex items-center text-xs font-medium text-green-600">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  8.2%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">2,847</p>
              <p className="text-xs text-gray-500">Active Buyers</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-600" />
                </div>
                <span className="flex items-center text-xs font-medium text-green-600">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  12.4%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">45,200</p>
              <p className="text-xs text-gray-500">Property Views</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <span className="flex items-center text-xs font-medium text-green-600">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  -5.3%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">32</p>
              <p className="text-xs text-gray-500">Avg Days on Market</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Home className="w-5 h-5 text-amber-600" />
                </div>
                <span className="flex items-center text-xs font-medium text-red-600">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  -3.1%
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">198</p>
              <p className="text-xs text-gray-500">Active Listings</p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-4">
            {/* Suburb Demand Table */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Suburb Demand Index</h3>
              </div>
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-xs text-gray-500">
                    <th className="px-4 py-3 text-left font-medium">Suburb</th>
                    <th className="px-4 py-3 text-center font-medium">Demand Score</th>
                    <th className="px-4 py-3 text-center font-medium">Change</th>
                    <th className="px-4 py-3 text-center font-medium">Avg DOM</th>
                    <th className="px-4 py-3 text-center font-medium">Listings</th>
                    <th className="px-4 py-3 text-left font-medium">Top Buyer Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {suburbDemandData.map((suburb, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedSuburb(suburb.suburb)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{suburb.suburb}</p>
                            <p className="text-xs text-gray-500">{suburb.postcode}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-sm font-bold ${getDemandColor(suburb.buyerDemand)}`}>
                          {suburb.buyerDemand}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`flex items-center justify-center text-sm font-medium ${
                          suburb.demandChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {suburb.demandChange >= 0 ? (
                            <TrendingUp className="w-4 h-4 mr-1" />
                          ) : (
                            <TrendingDown className="w-4 h-4 mr-1" />
                          )}
                          {Math.abs(suburb.demandChange)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {suburb.avgDaysOnMarket} days
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600">
                        {suburb.activeListings}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {suburb.topBuyerType}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Buyer Types */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">Buyer Types</h3>
              </div>
              <div className="p-4 space-y-4">
                {buyerTypeData.map((type, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{type.type}</span>
                      <span className="text-sm font-medium text-gray-900">{type.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${type.color} rounded-full`}
                        style={{ width: `${type.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Range Info */}
              <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-500 mb-2">Most searched price range</p>
                <p className="text-lg font-bold text-gray-900">$1.5M - $2.5M</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +15% search volume this month
                </p>
              </div>
            </div>
          </div>

          {/* Market Insight Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">📈 Market Insight</h3>
                <p className="text-blue-100 mt-1">Buyer demand in your subscribed suburbs has increased 8.5% this month. Consider reaching out to leads with properties in high-demand areas.</p>
              </div>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50">
                View Hot Leads
              </button>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
