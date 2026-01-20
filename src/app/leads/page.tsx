'use client';

import { DemoLayout } from '@/components/layout';
import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  TrendingUp,
  Users,
  ChevronDown,
  Home,
  Calendar,
  Flame
} from 'lucide-react';

interface Lead {
  id: number;
  name: string;
  address: string;
  suburb: string;
  phone: string;
  email: string;
  score: number;
  signal: 'hot' | 'warm' | 'cold';
  propertyType: string;
  lastActivity: string;
  daysOnMarket: number;
  estimatedValue: string;
}

const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'John & Sarah Mitchell',
    address: '42 Ocean View Parade',
    suburb: 'Mosman',
    phone: '0412 345 678',
    email: 'j.mitchell@email.com',
    score: 92,
    signal: 'hot',
    propertyType: 'House',
    lastActivity: '2 hours ago',
    daysOnMarket: 145,
    estimatedValue: '$3.2M',
  },
  {
    id: 2,
    name: 'Emma Thompson',
    address: '15/88 Raglan Street',
    suburb: 'Mosman',
    phone: '0423 456 789',
    email: 'emma.t@email.com',
    score: 87,
    signal: 'hot',
    propertyType: 'Apartment',
    lastActivity: '5 hours ago',
    daysOnMarket: 98,
    estimatedValue: '$1.8M',
  },
  {
    id: 3,
    name: 'Michael Chen',
    address: '7 Burrawong Avenue',
    suburb: 'Cremorne',
    phone: '0434 567 890',
    email: 'mchen@email.com',
    score: 78,
    signal: 'warm',
    propertyType: 'House',
    lastActivity: '1 day ago',
    daysOnMarket: 65,
    estimatedValue: '$2.5M',
  },
  {
    id: 4,
    name: 'Jessica Williams',
    address: '23/12 The Corso',
    suburb: 'Manly',
    phone: '0445 678 901',
    email: 'jwilliams@email.com',
    score: 71,
    signal: 'warm',
    propertyType: 'Apartment',
    lastActivity: '2 days ago',
    daysOnMarket: 52,
    estimatedValue: '$1.4M',
  },
  {
    id: 5,
    name: 'David Park',
    address: '88 Military Road',
    suburb: 'Neutral Bay',
    phone: '0456 789 012',
    email: 'dpark@email.com',
    score: 65,
    signal: 'warm',
    propertyType: 'Townhouse',
    lastActivity: '3 days ago',
    daysOnMarket: 42,
    estimatedValue: '$2.1M',
  },
  {
    id: 6,
    name: 'Sophie Anderson',
    address: '5/22 Wycombe Road',
    suburb: 'Neutral Bay',
    phone: '0467 890 123',
    email: 'sophie.a@email.com',
    score: 58,
    signal: 'cold',
    propertyType: 'Apartment',
    lastActivity: '5 days ago',
    daysOnMarket: 28,
    estimatedValue: '$950K',
  },
  {
    id: 7,
    name: 'Robert Hughes',
    address: '124 Spit Road',
    suburb: 'Mosman',
    phone: '0478 901 234',
    email: 'r.hughes@email.com',
    score: 52,
    signal: 'cold',
    propertyType: 'House',
    lastActivity: '1 week ago',
    daysOnMarket: 21,
    estimatedValue: '$4.5M',
  },
  {
    id: 8,
    name: 'Lisa Martinez',
    address: '9 Bay View Street',
    suburb: 'McMahons Point',
    phone: '0489 012 345',
    email: 'lisa.m@email.com',
    score: 45,
    signal: 'cold',
    propertyType: 'Apartment',
    lastActivity: '2 weeks ago',
    daysOnMarket: 15,
    estimatedValue: '$1.2M',
  },
];

export default function LeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [signalFilter, setSignalFilter] = useState<string>('all');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [suburbFilter, setSuburbFilter] = useState<string>('all');

  const suburbs = useMemo(() => {
    return ['all', ...Array.from(new Set(mockLeads.map(l => l.suburb)))];
  }, []);

  const filteredLeads = useMemo(() => {
    return mockLeads.filter(lead => {
      const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           lead.suburb.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSignal = signalFilter === 'all' || lead.signal === signalFilter;
      const matchesSuburb = suburbFilter === 'all' || lead.suburb === suburbFilter;
      let matchesScore = true;
      if (scoreFilter === '80+') matchesScore = lead.score >= 80;
      else if (scoreFilter === '60-79') matchesScore = lead.score >= 60 && lead.score < 80;
      else if (scoreFilter === '<60') matchesScore = lead.score < 60;
      
      return matchesSearch && matchesSignal && matchesScore && matchesSuburb;
    });
  }, [searchQuery, signalFilter, scoreFilter, suburbFilter]);

  const getSignalStyles = (signal: string) => {
    switch (signal) {
      case 'hot': return 'bg-red-100 text-red-700';
      case 'warm': return 'bg-amber-100 text-amber-700';
      case 'cold': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-gray-600';
  };

  return (
    <DemoLayout currentPage="leads">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Seller Scores</h1>
              <p className="text-sm text-gray-500 mt-0.5">AI-powered lead scoring based on seller intent signals</p>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-64"
                />
              </div>
              <select
                value={signalFilter}
                onChange={(e) => setSignalFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Signals</option>
                <option value="hot">🔥 Hot</option>
                <option value="warm">🌡️ Warm</option>
                <option value="cold">❄️ Cold</option>
              </select>
              <select
                value={scoreFilter}
                onChange={(e) => setScoreFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Scores</option>
                <option value="80+">Score 80+</option>
                <option value="60-79">Score 60-79</option>
                <option value="<60">Score &lt;60</option>
              </select>
              <select
                value={suburbFilter}
                onChange={(e) => setSuburbFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                {suburbs.map(suburb => (
                  <option key={suburb} value={suburb}>
                    {suburb === 'all' ? 'All Suburbs' : suburb}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-900">{filteredLeads.length}</span>
                <span className="text-gray-500">leads</span>
              </span>
              <span className="flex items-center space-x-1">
                <Flame className="w-4 h-4 text-red-500" />
                <span className="font-medium text-gray-900">{filteredLeads.filter(l => l.signal === 'hot').length}</span>
                <span className="text-gray-500">hot</span>
              </span>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DOM</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Value</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {lead.address}, {lead.suburb}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-lg font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSignalStyles(lead.signal)}`}>
                        {lead.signal === 'hot' && '🔥 '}
                        {lead.signal === 'warm' && '🌡️ '}
                        {lead.signal === 'cold' && '❄️ '}
                        {lead.signal.charAt(0).toUpperCase() + lead.signal.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-600">{lead.propertyType}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-sm font-medium ${lead.daysOnMarket > 90 ? 'text-red-600' : 'text-gray-600'}`}>
                        {lead.daysOnMarket} days
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">{lead.estimatedValue}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-500">{lead.lastActivity}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLeads.length === 0 && (
              <div className="p-12 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No leads match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
