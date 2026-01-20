'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  TrendingUp, 
  Award,
  Phone,
  Mail,
  ExternalLink,
  Filter,
  Users,
  Home,
  DollarSign
} from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  agency: string;
  suburb: string;
  photo: string;
  rating: number;
  reviews: number;
  salesLast12Months: number;
  avgDaysOnMarket: number;
  medianPrice: string;
  specialty: string;
  isTopAgent: boolean;
}

const agents: Agent[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    agency: 'McGrath Estate Agents',
    suburb: 'Mosman',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    rating: 4.9,
    reviews: 156,
    salesLast12Months: 42,
    avgDaysOnMarket: 28,
    medianPrice: '$2.4M',
    specialty: 'Prestige Homes',
    isTopAgent: true,
  },
  {
    id: 2,
    name: 'James Wilson',
    agency: 'Ray White Double Bay',
    suburb: 'Mosman',
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 4.8,
    reviews: 123,
    salesLast12Months: 38,
    avgDaysOnMarket: 32,
    medianPrice: '$1.9M',
    specialty: 'Family Homes',
    isTopAgent: true,
  },
  {
    id: 3,
    name: 'Emma Thompson',
    agency: 'Belle Property',
    suburb: 'Manly',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    rating: 4.7,
    reviews: 98,
    salesLast12Months: 31,
    avgDaysOnMarket: 35,
    medianPrice: '$1.6M',
    specialty: 'Apartments',
    isTopAgent: false,
  },
  {
    id: 4,
    name: 'Michael Chen',
    agency: 'LJ Hooker',
    suburb: 'Bondi',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 4.6,
    reviews: 87,
    salesLast12Months: 28,
    avgDaysOnMarket: 38,
    medianPrice: '$1.45M',
    specialty: 'Investment Properties',
    isTopAgent: false,
  },
  {
    id: 5,
    name: 'Rebecca Jones',
    agency: 'Raine & Horne',
    suburb: 'Coogee',
    photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 4.5,
    reviews: 76,
    salesLast12Months: 25,
    avgDaysOnMarket: 42,
    medianPrice: '$1.3M',
    specialty: 'First Home Buyers',
    isTopAgent: false,
  },
];

export default function TalentPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [suburbFilter, setSuburbFilter] = useState('All Suburbs');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         agent.agency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSuburb = suburbFilter === 'All Suburbs' || agent.suburb === suburbFilter;
    return matchesSearch && matchesSuburb;
  });

  const suburbs = ['All Suburbs', ...Array.from(new Set(agents.map(a => a.suburb)))];

  return (
    <DemoLayout currentPage="talent">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Talent Directory</h1>
              <p className="text-sm text-gray-500 mt-0.5">Find and connect with top-performing agents</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
                />
              </div>
              <select
                value={suburbFilter}
                onChange={(e) => setSuburbFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                {suburbs.map(suburb => (
                  <option key={suburb} value={suburb}>{suburb}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{agents.length}</span> Agents</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{agents.filter(a => a.isTopAgent).length}</span> Top Performers</span>
            </div>
            <div className="flex items-center space-x-2">
              <Home className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{agents.reduce((sum, a) => sum + a.salesLast12Months, 0)}</span> Sales (12mo)</span>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredAgents.map(agent => (
              <div
                key={agent.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-5">
                  {/* Agent Header */}
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={agent.photo}
                        alt={agent.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {agent.isTopAgent && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
                          <Award className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                        {agent.isTopAgent && (
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">Top Agent</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{agent.agency}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{agent.suburb}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(agent.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{agent.rating}</span>
                    <span className="text-sm text-gray-500">({agent.reviews} reviews)</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-lg font-bold text-gray-900">{agent.salesLast12Months}</p>
                      <p className="text-xs text-gray-500">Sales</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-lg font-bold text-gray-900">{agent.avgDaysOnMarket}</p>
                      <p className="text-xs text-gray-500">Avg DOM</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2.5 text-center">
                      <p className="text-lg font-bold text-gray-900">{agent.medianPrice}</p>
                      <p className="text-xs text-gray-500">Median</p>
                    </div>
                  </div>

                  {/* Specialty */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xs text-gray-500">Specialty:</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {agent.specialty}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center justify-center space-x-1">
                      <Phone className="w-4 h-4" />
                      <span>Contact</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center justify-center space-x-1">
                      <ExternalLink className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAgents.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No agents match your search</p>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
