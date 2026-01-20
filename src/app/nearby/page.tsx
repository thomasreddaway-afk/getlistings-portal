'use client';

import { DemoLayout } from '@/components/layout';
import { Lock, MapPin, Users, TrendingUp, Zap, Check, Star } from 'lucide-react';

interface NearbySuburb {
  id: number;
  name: string;
  state: string;
  postcode: string;
  leadsCount: number;
  avgValue: string;
  topSignal: string;
  distance: string;
  isLocked: boolean;
}

const nearbySuburbs: NearbySuburb[] = [
  { id: 1, name: 'Cremorne', state: 'NSW', postcode: '2090', leadsCount: 156, avgValue: '$1.8M', topSignal: '23 downsizers', distance: '2.1km', isLocked: true },
  { id: 2, name: 'Neutral Bay', state: 'NSW', postcode: '2089', leadsCount: 142, avgValue: '$1.6M', topSignal: '18 empty nesters', distance: '2.4km', isLocked: true },
  { id: 3, name: 'Kirribilli', state: 'NSW', postcode: '2061', leadsCount: 98, avgValue: '$2.1M', topSignal: '12 investors', distance: '3.2km', isLocked: true },
  { id: 4, name: 'Waverton', state: 'NSW', postcode: '2060', leadsCount: 87, avgValue: '$1.5M', topSignal: '15 upsizers', distance: '3.8km', isLocked: true },
  { id: 5, name: 'Wollstonecraft', state: 'NSW', postcode: '2065', leadsCount: 76, avgValue: '$1.4M', topSignal: '9 renovators', distance: '4.1km', isLocked: true },
  { id: 6, name: 'Crows Nest', state: 'NSW', postcode: '2065', leadsCount: 134, avgValue: '$1.3M', topSignal: '21 first home', distance: '4.5km', isLocked: true },
];

const subscribedSuburbs = ['Mosman', 'Manly', 'Bondi', 'Coogee'];

export default function NearbyLeadsPage() {
  return (
    <DemoLayout currentPage="nearby">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">Nearby Leads</h1>
                <span className="px-2 py-0.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 text-xs font-medium rounded flex items-center space-x-1">
                  <Lock className="w-3 h-3" />
                  <span>Hidden</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">High-potential leads in suburbs near your coverage area</p>
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-600 flex items-center space-x-2 shadow-lg shadow-amber-500/25">
              <Zap className="w-4 h-4" />
              <span>Upgrade to Unlock</span>
            </button>
          </div>
        </div>

        {/* Subscribed Suburbs Info */}
        <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                <Check className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Your subscribed suburbs:</p>
                <p className="text-xs text-gray-600">{subscribedSuburbs.join(', ')}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Subscription</p>
              <p className="text-sm font-semibold text-sky-600">Professional Plan</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{nearbySuburbs.length}</span> Nearby Suburbs Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
              <span className="text-gray-600">Subscribe to unlock leads</span>
            </div>
            <div className="ml-auto text-xs text-gray-400">Based on your subscribed areas</div>
          </div>
        </div>

        {/* Suburbs Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {nearbySuburbs.map(suburb => (
              <div
                key={suburb.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden relative group"
              >
                {/* Locked Overlay */}
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Lock className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">Unlock {suburb.name}</p>
                    <p className="text-xs text-gray-500 mb-3">{suburb.leadsCount} leads available</p>
                    <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
                      Subscribe
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{suburb.name}</h3>
                        <span className="text-xs text-gray-400">{suburb.postcode}</span>
                      </div>
                      <p className="text-xs text-gray-500 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1" />
                        {suburb.distance} from your area
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{suburb.leadsCount}</p>
                      <p className="text-xs text-gray-500">leads</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500">Avg Value</p>
                      <p className="text-sm font-semibold text-gray-900">{suburb.avgValue}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5">
                      <p className="text-xs text-gray-500">Top Signal</p>
                      <p className="text-sm font-semibold text-gray-900">{suburb.topSignal}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upgrade CTA */}
          <div className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Expand Your Territory</h3>
                <p className="text-amber-100 mt-1">Get access to high-potential leads in suburbs near your current coverage</p>
                <div className="flex items-center space-x-4 mt-3">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-amber-200" />
                    <span className="text-sm">Instant access</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-amber-200" />
                    <span className="text-sm">Full contact details</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-amber-200" />
                    <span className="text-sm">AI-powered insights</span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-3 bg-white text-amber-600 font-bold rounded-xl hover:bg-amber-50 shadow-lg">
                View Pricing
              </button>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
