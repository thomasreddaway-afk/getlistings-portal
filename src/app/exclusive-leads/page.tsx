'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Search,
  TrendingUp,
  Home,
  Calendar
} from 'lucide-react';

interface ExclusiveLead {
  id: number;
  name: string;
  address: string;
  suburb: string;
  phone: string;
  email: string;
  requestDate: string;
  propertyType: string;
  estimatedValue: string;
  urgency: 'high' | 'medium' | 'low';
  notes: string;
}

const leads: ExclusiveLead[] = [
  {
    id: 1,
    name: 'Michael Thompson',
    address: '42 Ocean View Parade',
    suburb: 'Mosman',
    phone: '0412 345 678',
    email: 'michael.t@email.com',
    requestDate: '2024-01-15',
    propertyType: 'House',
    estimatedValue: '$3.2M',
    urgency: 'high',
    notes: 'Looking to sell within 3 months, relocating interstate',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    address: '18/50 Raglan Street',
    suburb: 'Mosman',
    phone: '0423 456 789',
    email: 'sarah.chen@email.com',
    requestDate: '2024-01-14',
    propertyType: 'Apartment',
    estimatedValue: '$1.8M',
    urgency: 'high',
    notes: 'Upgrading to house, motivated seller',
  },
  {
    id: 3,
    name: 'James Wilson',
    address: '7 Burrawong Avenue',
    suburb: 'Cremorne',
    phone: '0434 567 890',
    email: 'jwilson@email.com',
    requestDate: '2024-01-13',
    propertyType: 'House',
    estimatedValue: '$2.5M',
    urgency: 'medium',
    notes: 'Testing the market, flexible timeline',
  },
  {
    id: 4,
    name: 'Emma Roberts',
    address: '23/12 The Corso',
    suburb: 'Manly',
    phone: '0445 678 901',
    email: 'emma.r@email.com',
    requestDate: '2024-01-12',
    propertyType: 'Apartment',
    estimatedValue: '$1.4M',
    urgency: 'medium',
    notes: 'Investment property, looking for market update',
  },
  {
    id: 5,
    name: 'David Park',
    address: '88 Military Road',
    suburb: 'Neutral Bay',
    phone: '0456 789 012',
    email: 'dpark@email.com',
    requestDate: '2024-01-11',
    propertyType: 'Townhouse',
    estimatedValue: '$2.1M',
    urgency: 'low',
    notes: 'Long-term planning, 6+ months timeline',
  },
];

export default function ExclusiveLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.suburb.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = urgencyFilter === 'all' || lead.urgency === urgencyFilter;
    return matchesSearch && matchesUrgency;
  });

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-amber-100 text-amber-700';
      case 'low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DemoLayout currentPage="exclusive">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">Valuation Requests</h1>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  PRO
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">High-intent sellers requesting property appraisals</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
                />
              </div>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Urgency</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{leads.length}</span> Total Requests</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-red-500" />
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{leads.filter(l => l.urgency === 'high').length}</span> High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Avg Value: <span className="font-semibold text-gray-900">$2.2M</span></span>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="p-4 space-y-3">
          {filteredLeads.map(lead => (
            <div
              key={lead.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{lead.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getUrgencyStyles(lead.urgency)}`}>
                      {lead.urgency.charAt(0).toUpperCase() + lead.urgency.slice(1)} Priority
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {lead.address}, {lead.suburb}
                    </span>
                    <span className="flex items-center">
                      <Home className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {lead.propertyType}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {new Date(lead.requestDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-lg font-bold text-gray-900">{lead.estimatedValue}</span>
                    <span className="text-sm text-gray-500">Estimated Value</span>
                  </div>

                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    <span className="font-medium">Notes:</span> {lead.notes}
                  </p>
                </div>

                <div className="flex flex-col space-y-2 ml-6">
                  <button className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                    <Phone className="w-4 h-4 mr-1.5" />
                    Call
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">
                    <Mail className="w-4 h-4 mr-1.5" />
                    Email
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredLeads.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No valuation requests match your filters</p>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
