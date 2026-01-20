'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { Clock, Phone, Mail, ExternalLink, Calendar, TrendingDown } from 'lucide-react';

interface ExpiringListing {
  id: number;
  address: string;
  suburb: string;
  daysLeft: number;
  daysOnMarket: number;
  currentAgent: string;
  agency: string;
  priceRange: string;
  priceReductions: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  listingUrl?: string;
}

const expiringListings: ExpiringListing[] = [
  {
    id: 1,
    address: '15 Arinya Road',
    suburb: 'Ashgrove',
    daysLeft: 3,
    daysOnMarket: 90,
    currentAgent: 'John Smith',
    agency: 'Ray White',
    priceRange: '$1.2M - $1.35M',
    priceReductions: 2,
    propertyType: 'House',
    bedrooms: 4,
    bathrooms: 2,
  },
  {
    id: 2,
    address: '8 Hillside Crescent',
    suburb: 'Mosman',
    daysLeft: 7,
    daysOnMarket: 120,
    currentAgent: 'Sarah Johnson',
    agency: 'McGrath',
    priceRange: '$2.8M - $3.1M',
    priceReductions: 1,
    propertyType: 'House',
    bedrooms: 5,
    bathrooms: 3,
  },
  {
    id: 3,
    address: '27 Victoria Street',
    suburb: 'Potts Point',
    daysLeft: 14,
    daysOnMarket: 85,
    currentAgent: 'Michael Lee',
    agency: 'LJ Hooker',
    priceRange: '$950K - $1.05M',
    priceReductions: 2,
    propertyType: 'Apartment',
    bedrooms: 2,
    bathrooms: 1,
  },
  {
    id: 4,
    address: '45 Beach Road',
    suburb: 'Bondi',
    daysLeft: 21,
    daysOnMarket: 75,
    currentAgent: 'Emma Wilson',
    agency: 'Belle Property',
    priceRange: '$1.8M - $2.0M',
    priceReductions: 0,
    propertyType: 'Apartment',
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: 5,
    address: '102 Pacific Highway',
    suburb: 'Crows Nest',
    daysLeft: 28,
    daysOnMarket: 65,
    currentAgent: 'David Chen',
    agency: 'Raine & Horne',
    priceRange: '$1.4M - $1.55M',
    priceReductions: 1,
    propertyType: 'Townhouse',
    bedrooms: 3,
    bathrooms: 2,
  },
];

function getUrgencyColor(daysLeft: number) {
  if (daysLeft <= 7) return 'bg-red-100 text-red-700 border-red-200';
  if (daysLeft <= 14) return 'bg-orange-100 text-orange-700 border-orange-200';
  if (daysLeft <= 21) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-yellow-100 text-yellow-700 border-yellow-200';
}

function getUrgencyBadge(daysLeft: number) {
  if (daysLeft <= 7) return { color: 'bg-red-500', text: 'Urgent' };
  if (daysLeft <= 14) return { color: 'bg-orange-500', text: 'Soon' };
  return { color: 'bg-amber-500', text: 'Upcoming' };
}

export default function ExpiredListingsPage() {
  const [filter, setFilter] = useState<'all' | 'urgent' | 'soon' | 'upcoming'>('all');

  const filteredListings = expiringListings.filter(listing => {
    if (filter === 'urgent') return listing.daysLeft <= 7;
    if (filter === 'soon') return listing.daysLeft > 7 && listing.daysLeft <= 14;
    if (filter === 'upcoming') return listing.daysLeft > 14;
    return true;
  });

  const urgentCount = expiringListings.filter(l => l.daysLeft <= 7).length;
  const soonCount = expiringListings.filter(l => l.daysLeft > 7 && l.daysLeft <= 14).length;
  const upcomingCount = expiringListings.filter(l => l.daysLeft > 14).length;

  return (
    <DemoLayout currentPage="expired">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Expiring Listings</h1>
              <p className="text-sm text-gray-500 mt-0.5">Listings about to come off market - opportunity to win the listing</p>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600"><span className="font-semibold">{urgentCount}</span> Urgent</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-gray-600"><span className="font-semibold">{soonCount}</span> Soon</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600"><span className="font-semibold">{upcomingCount}</span> Upcoming</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500 font-medium mr-2">Filter:</span>
            {[
              { id: 'all' as const, label: 'All', count: expiringListings.length },
              { id: 'urgent' as const, label: '🔴 Urgent (≤7 days)', count: urgentCount },
              { id: 'soon' as const, label: '🟠 Soon (8-14 days)', count: soonCount },
              { id: 'upcoming' as const, label: '🟡 Upcoming (15+ days)', count: upcomingCount },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                  filter === f.id
                    ? 'bg-red-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {/* Listings */}
        <div className="p-4 space-y-4">
          {filteredListings.map(listing => {
            const urgency = getUrgencyBadge(listing.daysLeft);
            return (
              <div
                key={listing.id}
                className={`bg-white rounded-xl border overflow-hidden ${getUrgencyColor(listing.daysLeft)}`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    {/* Left Side */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`px-2.5 py-1 ${urgency.color} text-white text-xs font-bold rounded-full`}>
                          {listing.daysLeft} days left
                        </div>
                        <span className="text-xs text-gray-500">{listing.daysOnMarket} days on market</span>
                        {listing.priceReductions > 0 && (
                          <span className="flex items-center text-xs text-red-600">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {listing.priceReductions} price {listing.priceReductions === 1 ? 'reduction' : 'reductions'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {listing.address}, {listing.suburb}
                      </h3>
                      
                      <p className="text-sm text-gray-500 mb-3">
                        {listing.propertyType} • {listing.bedrooms} bed • {listing.bathrooms} bath
                      </p>

                      <div className="flex items-center space-x-4 text-sm">
                        <div>
                          <span className="text-gray-500">Current Agent:</span>
                          <span className="ml-1 font-medium text-gray-900">{listing.currentAgent}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <div>
                          <span className="text-gray-500">Agency:</span>
                          <span className="ml-1 font-medium text-gray-900">{listing.agency}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side */}
                    <div className="text-right ml-6">
                      <p className="text-xs text-gray-500 mb-1">Listed Price</p>
                      <p className="text-xl font-bold text-gray-900 mb-4">{listing.priceRange}</p>

                      <div className="flex flex-col space-y-2">
                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center justify-center space-x-2">
                          <Phone className="w-4 h-4" />
                          <span>Contact Owner</span>
                        </button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center space-x-2">
                          <ExternalLink className="w-4 h-4" />
                          <span>View Listing</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredListings.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No listings match this filter</p>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
