'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';
import { Lock, MapPin, Zap, Check, RefreshCw } from 'lucide-react';

interface NearbySuburb {
  name: string;
  state: string;
  distance: string;
  leads: number | null;
  price: number;
  needsBackend: boolean;
}

// Suburb adjacency data by state - suburbs that are typically near each other
// This matches demo.html logic - ideally BE would provide this via geo-queries
const SUBURB_ADJACENCY: Record<string, Record<string, string[]>> = {
  'QLD': {
    'Ashgrove': ['The Gap', 'Bardon', 'Enoggera', 'Alderley', 'Newmarket', 'Kelvin Grove', 'Red Hill'],
    'Bardon': ['Ashgrove', 'Paddington', 'The Gap', 'Mount Coot-tha', 'Auchenflower', 'Toowong'],
    'Paddington': ['Bardon', 'Red Hill', 'Milton', 'Petrie Terrace', 'Rosalie', 'Auchenflower'],
    'Red Hill': ['Paddington', 'Ashgrove', 'Kelvin Grove', 'Herston', 'Petrie Terrace', 'Spring Hill'],
    'The Gap': ['Ashgrove', 'Bardon', 'Enoggera', 'Keperra', 'Upper Kedron', 'Ferny Grove'],
    'Kelvin Grove': ['Red Hill', 'Ashgrove', 'Newmarket', 'Herston', 'Spring Hill', 'Bowen Hills'],
    'Toowong': ['Bardon', 'Auchenflower', 'Taringa', 'St Lucia', 'Indooroopilly', 'Milton'],
    'Newmarket': ['Ashgrove', 'Alderley', 'Kelvin Grove', 'Wilston', 'Windsor', 'Grange'],
    'default': ['Paddington', 'Red Hill', 'Milton', 'Toowong', 'Auchenflower', 'Kelvin Grove', 'Newmarket', 'Enoggera']
  },
  'NSW': {
    'Bondi': ['Bondi Junction', 'Waverley', 'Bronte', 'Tamarama', 'North Bondi', 'Dover Heights'],
    'Coogee': ['Randwick', 'Bronte', 'Maroubra', 'South Coogee', 'Clovelly', 'Kensington'],
    'Randwick': ['Coogee', 'Kensington', 'Kingsford', 'Maroubra', 'Centennial Park', 'Moore Park'],
    'Paddington': ['Woollahra', 'Surry Hills', 'Darlinghurst', 'Centennial Park', 'Moore Park', 'Bondi Junction'],
    'Mosman': ['Cremorne', 'Neutral Bay', 'Balmoral', 'The Spit', 'Clifton Gardens', 'Taronga'],
    'default': ['Randwick', 'Woollahra', 'Waverley', 'Paddington', 'Kensington', 'Maroubra', 'Clovelly', 'Bronte']
  },
  'VIC': {
    'default': ['Richmond', 'South Yarra', 'Toorak', 'Prahran', 'Hawthorn', 'Kew', 'Camberwell', 'Malvern']
  },
  'default': {
    'default': ['Suburb A', 'Suburb B', 'Suburb C', 'Suburb D', 'Suburb E', 'Suburb F']
  }
};

export default function NearbyLeadsPage() {
  const [subscribedSuburbs, setSubscribedSuburbs] = useState<{ suburb: string; state: string }[]>([]);
  const [nearbySuburbs, setNearbySuburbs] = useState<NearbySuburb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedData, setHasLoadedData] = useState(false);

  const loadNearbySuburbs = async () => {
    if (hasLoadedData) return; // Prevent duplicate API calls
    setHasLoadedData(true);
    setLoading(true);
    setError(null);

    try {
      // Get user's subscribed suburbs from API
      const response = await apiRequest<{ result?: { suburb: string; state: string }[] }>('/lead/my-suburbs-list', 'GET');
      const userSuburbs = response.result || [];
      setSubscribedSuburbs(userSuburbs);

      if (userSuburbs.length === 0) {
        setNearbySuburbs([]);
        return;
      }

      // Get state from first subscribed suburb
      const primaryState = userSuburbs[0]?.state || 'QLD';
      const subscribedNames = new Set(userSuburbs.map(s => s.suburb.toLowerCase()));

      // Find adjacent suburbs based on state
      const stateAdjacency = SUBURB_ADJACENCY[primaryState] || SUBURB_ADJACENCY['default'];
      const potentialNearby = new Set<string>();

      // For each subscribed suburb, get its adjacent suburbs
      userSuburbs.forEach(sub => {
        const adjacent = stateAdjacency[sub.suburb] || stateAdjacency['default'] || [];
        adjacent.forEach(adj => {
          // Don't include suburbs user is already subscribed to
          if (!subscribedNames.has(adj.toLowerCase())) {
            potentialNearby.add(adj);
          }
        });
      });

      // Convert to array and limit to 6 suburbs
      const nearbySuburbNames = Array.from(potentialNearby).slice(0, 6);

      // Create nearby suburb objects
      const nearby: NearbySuburb[] = nearbySuburbNames.map(suburbName => ({
        name: suburbName,
        state: primaryState,
        distance: `Near ${userSuburbs[0]?.suburb || 'your area'}`,
        leads: null, // null = unknown, would need BE endpoint for counts
        price: 49,
        needsBackend: true
      }));

      setNearbySuburbs(nearby);
    } catch (err) {
      console.error('Failed to load nearby suburbs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load nearby suburbs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearbySuburbs();
  }, []);

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
                <p className="text-xs text-gray-600">
                  {loading ? 'Loading...' : subscribedSuburbs.map(s => s.suburb).join(', ') || 'None'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Subscription</p>
              <p className="text-sm font-semibold text-sky-600">
                {subscribedSuburbs.length} Suburb{subscribedSuburbs.length !== 1 ? 's' : ''} Plan
              </p>
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
            <div className="ml-auto">
              <button
                onClick={loadNearbySuburbs}
                disabled={loading}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center space-x-1"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={loadNearbySuburbs} className="mt-2 text-sm text-red-600 underline">Retry</button>
          </div>
        )}

        {/* Suburbs Grid */}
        <div className="p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-500 border-t-transparent mb-4"></div>
              <p className="text-gray-500">Finding nearby opportunities...</p>
            </div>
          ) : nearbySuburbs.length === 0 ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
              <p className="text-amber-700 font-medium">No nearby suburbs found</p>
              <p className="text-amber-600 text-sm mt-1">
                {subscribedSuburbs.length === 0 
                  ? 'Subscribe to suburbs first to see expansion opportunities.'
                  : 'No additional suburbs found near your subscribed areas.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {nearbySuburbs.map((suburb, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden relative group"
                >
                  {/* Locked Overlay */}
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Lock className="w-6 h-6 text-amber-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Unlock {suburb.name}</p>
                      <p className="text-xs text-gray-500 mb-1">Expand your coverage to {suburb.name}, {suburb.state}</p>
                      <p className="text-xs text-amber-600 mb-3">
                        {suburb.needsBackend ? '* Needs BE endpoint for lead counts' : `${suburb.leads} leads available`}
                      </p>
                      <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600">
                        Unlock {suburb.name} - ${suburb.price}/mo
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{suburb.name}</h3>
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">Nearby</span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center mt-0.5">
                          <MapPin className="w-3 h-3 mr-1" />
                          {suburb.distance}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">{suburb.state}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500">Status</p>
                        <p className="text-sm font-semibold text-gray-400">Hidden lead</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-500">Subscribe to view</p>
                        <p className="text-sm font-semibold text-gray-400">Hidden lead</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

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
                    <span className="text-sm">AI insights included</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-amber-200 text-sm">Starting from</p>
                <p className="text-3xl font-bold">$49<span className="text-lg font-normal">/suburb/mo</span></p>
                <button className="mt-2 px-6 py-2 bg-white text-amber-600 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors">
                  View Packages
                </button>
              </div>
            </div>
          </div>

          {/* Bundle Packages */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Single Suburb */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-gray-900">Single Suburb</h4>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Basic</span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">$49</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>1 additional suburb</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Full lead access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>AI insights</span>
                </li>
              </ul>
              <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Select Suburb
              </button>
            </div>

            {/* 3 Suburb Bundle */}
            <div className="bg-white rounded-xl border-2 border-blue-200 p-5 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">Popular</span>
              </div>
              <div className="flex items-center justify-between mb-3 mt-2">
                <h4 className="font-bold text-gray-900">3 Suburb Bundle</h4>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">$79</span>
                <span className="text-gray-500">/mo</span>
                <span className="ml-2 text-sm text-green-600 font-medium">Save $68</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>3 additional suburbs</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Full lead access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>AI insights + priority support</span>
                </li>
              </ul>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Choose 3 Suburbs
              </button>
            </div>

            {/* 6 Suburb Bundle */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 p-5 hover:shadow-lg transition-shadow relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">BEST VALUE</span>
              </div>
              <div className="flex items-center justify-between mb-3 mt-2">
                <h4 className="font-bold text-gray-900">6 Suburb Bundle</h4>
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">Pro</span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">$99</span>
                <span className="text-gray-500">/mo</span>
                <span className="ml-2 text-sm text-green-600 font-medium">Save $195</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span><strong>All 6 nearby suburbs</strong></span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Unlimited lead access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>AI insights + priority support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Exclusive territory protection</span>
                </li>
              </ul>
              <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-bold hover:from-amber-600 hover:to-orange-600 transition-colors shadow-lg shadow-amber-500/25">
                Get All 6 Suburbs
              </button>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
