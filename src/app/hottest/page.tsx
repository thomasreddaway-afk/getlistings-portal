'use client';

import { DemoLayout } from '@/components/layout';
import Link from 'next/link';
import { Phone, Mail, MapPin, TrendingUp, Home, Clock, DollarSign, ArrowRight } from 'lucide-react';

// Mock hottest leads data
const hottestLeads = [
  {
    id: 1,
    address: '42 Ocean View Drive',
    suburb: 'Mosman',
    score: 92,
    ownerName: 'Sarah Mitchell',
    phone: '0412 345 678',
    email: 'sarah.m@email.com',
    estimatedValue: '$2.4M',
    estimatedCommission: '$48,000',
    signals: ['Valuation requested', 'Mortgage free', '12yr owner'],
    lastActivity: '2 days ago',
    propertyType: '4 bed house',
  },
  {
    id: 2,
    address: '78 Park Avenue',
    suburb: 'Mosman',
    score: 88,
    ownerName: 'James Wilson',
    phone: '0423 456 789',
    email: 'j.wilson@email.com',
    estimatedValue: '$1.8M',
    estimatedCommission: '$36,000',
    signals: ['Neighbour sold', '15yr owner', 'Empty nester'],
    lastActivity: '1 day ago',
    propertyType: '3 bed house',
  },
  {
    id: 3,
    address: '23 Harbour View',
    suburb: 'Manly',
    score: 85,
    ownerName: 'Emma Thompson',
    phone: '0434 567 890',
    email: 'emma.t@email.com',
    estimatedValue: '$2.1M',
    estimatedCommission: '$42,000',
    signals: ['Downsizing', 'Retirement', 'Mortgage free'],
    lastActivity: '3 days ago',
    propertyType: '4 bed house',
  },
  {
    id: 4,
    address: '156 Beach Road',
    suburb: 'Coogee',
    score: 82,
    ownerName: 'Michael Chen',
    phone: '0445 678 901',
    email: 'm.chen@email.com',
    estimatedValue: '$1.65M',
    estimatedCommission: '$33,000',
    signals: ['DA approved', 'Just renovated'],
    lastActivity: '4 days ago',
    propertyType: '3 bed apartment',
  },
  {
    id: 5,
    address: '89 Victoria Street',
    suburb: 'Potts Point',
    score: 79,
    ownerName: 'Lisa Anderson',
    phone: '0456 789 012',
    email: 'lisa.a@email.com',
    estimatedValue: '$1.2M',
    estimatedCommission: '$24,000',
    signals: ['Listed for sale', 'Price reduced'],
    lastActivity: '1 day ago',
    propertyType: '2 bed apartment',
  },
];

function getScoreColor(score: number) {
  if (score >= 85) return 'bg-green-500';
  if (score >= 70) return 'bg-yellow-500';
  return 'bg-orange-500';
}

function getScoreBgColor(score: number) {
  if (score >= 85) return 'bg-green-100 text-green-700';
  if (score >= 70) return 'bg-yellow-100 text-yellow-700';
  return 'bg-orange-100 text-orange-700';
}

export default function HottestLeadsPage() {
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
            <Link
              href="/leads"
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              <span>View All Leads</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="p-4">
          {/* Leads Grid */}
          <div className="space-y-4">
            {hottestLeads.map((lead, index) => (
              <div
                key={lead.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    {/* Left: Lead Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`w-12 h-12 ${getScoreColor(lead.score)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                          {lead.score}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{lead.address}</h3>
                          <p className="text-sm text-gray-500">{lead.suburb} • {lead.propertyType}</p>
                        </div>
                        {index === 0 && (
                          <span className="px-2.5 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                            🔥 TOP PRIORITY
                          </span>
                        )}
                      </div>

                      {/* Owner Info */}
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                            {lead.ownerName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{lead.ownerName}</span>
                        </div>
                        <span className="text-gray-300">|</span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {lead.lastActivity}
                        </span>
                      </div>

                      {/* Signals */}
                      <div className="flex flex-wrap gap-2">
                        {lead.signals.map((signal, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                          >
                            ✓ {signal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right: Value & Actions */}
                    <div className="text-right ml-6">
                      <div className="mb-4">
                        <p className="text-xs text-gray-500">Est. Value</p>
                        <p className="text-xl font-bold text-gray-900">{lead.estimatedValue}</p>
                        <p className="text-sm text-green-600 font-medium">{lead.estimatedCommission} commission</p>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <a
                          href={`tel:${lead.phone.replace(/\s/g, '')}`}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 flex items-center justify-center space-x-2"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Now</span>
                        </a>
                        <a
                          href={`mailto:${lead.email}`}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center space-x-2"
                        >
                          <Mail className="w-4 h-4" />
                          <span>Email</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
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
        </div>
      </div>
    </DemoLayout>
  );
}
