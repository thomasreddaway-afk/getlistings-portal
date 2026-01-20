'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  Target, 
  Phone, 
  Mail, 
  MapPin, 
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Star,
  Filter
} from 'lucide-react';

interface Opportunity {
  id: number;
  name: string;
  address: string;
  suburb: string;
  stage: 'prospecting' | 'contacted' | 'appraisal' | 'proposal' | 'negotiating';
  value: string;
  probability: number;
  lastContact: string;
  nextAction: string;
  dueDate: string;
}

const opportunities: Opportunity[] = [
  {
    id: 1,
    name: 'Thompson Family Home',
    address: '42 Ocean View Parade',
    suburb: 'Mosman',
    stage: 'negotiating',
    value: '$3.2M',
    probability: 85,
    lastContact: '2024-01-15',
    nextAction: 'Final contract review',
    dueDate: '2024-01-18',
  },
  {
    id: 2,
    name: 'Chen Apartment',
    address: '18/50 Raglan Street',
    suburb: 'Mosman',
    stage: 'proposal',
    value: '$1.8M',
    probability: 70,
    lastContact: '2024-01-14',
    nextAction: 'Send updated CMA',
    dueDate: '2024-01-17',
  },
  {
    id: 3,
    name: 'Wilson Property',
    address: '7 Burrawong Avenue',
    suburb: 'Cremorne',
    stage: 'appraisal',
    value: '$2.5M',
    probability: 50,
    lastContact: '2024-01-12',
    nextAction: 'Schedule appraisal visit',
    dueDate: '2024-01-19',
  },
  {
    id: 4,
    name: 'Roberts Unit',
    address: '23/12 The Corso',
    suburb: 'Manly',
    stage: 'contacted',
    value: '$1.4M',
    probability: 30,
    lastContact: '2024-01-10',
    nextAction: 'Follow-up call',
    dueDate: '2024-01-16',
  },
  {
    id: 5,
    name: 'Park Townhouse',
    address: '88 Military Road',
    suburb: 'Neutral Bay',
    stage: 'prospecting',
    value: '$2.1M',
    probability: 15,
    lastContact: '2024-01-08',
    nextAction: 'Send introductory letter',
    dueDate: '2024-01-20',
  },
];

export default function OpportunitiesPage() {
  const [stageFilter, setStageFilter] = useState<string>('all');

  const filteredOpps = opportunities.filter(opp => 
    stageFilter === 'all' || opp.stage === stageFilter
  );

  const getStageStyles = (stage: string) => {
    switch (stage) {
      case 'negotiating': return 'bg-green-100 text-green-700';
      case 'proposal': return 'bg-blue-100 text-blue-700';
      case 'appraisal': return 'bg-purple-100 text-purple-700';
      case 'contacted': return 'bg-amber-100 text-amber-700';
      case 'prospecting': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const totalValue = opportunities.reduce((sum, o) => {
    const val = parseFloat(o.value.replace('$', '').replace('M', '')) * 1000000;
    return sum + (val * o.probability / 100);
  }, 0);

  return (
    <DemoLayout currentPage="opportunities">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
              <p className="text-sm text-gray-500 mt-0.5">Track your opportunities through the sales cycle</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="all">All Stages</option>
                <option value="prospecting">Prospecting</option>
                <option value="contacted">Contacted</option>
                <option value="appraisal">Appraisal</option>
                <option value="proposal">Proposal</option>
                <option value="negotiating">Negotiating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{opportunities.length}</span> Opportunities</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              <span className="text-gray-600">Weighted Value: <span className="font-semibold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</span></span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{opportunities.filter(o => o.stage === 'negotiating').length}</span> Close to Signing</span>
            </div>
          </div>
        </div>

        {/* Opportunities List */}
        <div className="p-4 space-y-3">
          {filteredOpps.map(opp => (
            <div
              key={opp.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{opp.name}</h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStageStyles(opp.stage)}`}>
                      {opp.stage.charAt(0).toUpperCase() + opp.stage.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      {opp.address}, {opp.suburb}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" />
                      Last: {new Date(opp.lastContact).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-6 mb-3">
                    <div>
                      <span className="text-xl font-bold text-gray-900">{opp.value}</span>
                      <span className="text-sm text-gray-500 ml-2">Deal Value</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden mr-2">
                        <div 
                          className={`h-full rounded-full ${opp.probability >= 70 ? 'bg-green-500' : opp.probability >= 40 ? 'bg-amber-500' : 'bg-gray-400'}`}
                          style={{ width: `${opp.probability}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{opp.probability}%</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-red-500" />
                    <span className="text-gray-600">Next: <span className="font-medium text-gray-900">{opp.nextAction}</span></span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">Due {new Date(opp.dueDate).toLocaleDateString()}</span>
                  </div>
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

          {filteredOpps.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No opportunities in this stage</p>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
