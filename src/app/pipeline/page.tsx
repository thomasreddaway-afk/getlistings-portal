'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { Plus, MoreVertical, Phone, Mail, Calendar, DollarSign, ArrowRight, GripVertical } from 'lucide-react';

interface PipelineLead {
  id: string;
  name: string;
  address: string;
  value: string;
  daysInStage: number;
  nextAction?: string;
  phone?: string;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  leads: PipelineLead[];
}

const initialStages: PipelineStage[] = [
  {
    id: 'new',
    name: 'New Leads',
    color: 'bg-blue-500',
    leads: [
      { id: '1', name: 'Sarah Mitchell', address: '42 Ocean View Dr', value: '$2.4M', daysInStage: 2, nextAction: 'Call to introduce' },
      { id: '2', name: 'James Wilson', address: '78 Park Ave', value: '$1.8M', daysInStage: 1 },
      { id: '3', name: 'Emma Thompson', address: '23 Harbour View', value: '$2.1M', daysInStage: 3 },
    ],
  },
  {
    id: 'contacted',
    name: 'Contacted',
    color: 'bg-purple-500',
    leads: [
      { id: '4', name: 'Michael Chen', address: '156 Beach Rd', value: '$1.65M', daysInStage: 5, nextAction: 'Follow up call' },
      { id: '5', name: 'Lisa Anderson', address: '89 Victoria St', value: '$1.2M', daysInStage: 4 },
    ],
  },
  {
    id: 'appraisal',
    name: 'Appraisal Booked',
    color: 'bg-amber-500',
    leads: [
      { id: '6', name: 'David Brown', address: '34 Crown St', value: '$1.9M', daysInStage: 2, nextAction: 'Prepare CMA' },
    ],
  },
  {
    id: 'proposal',
    name: 'Proposal Sent',
    color: 'bg-orange-500',
    leads: [
      { id: '7', name: 'Jennifer Lee', address: '67 Pacific Hwy', value: '$2.2M', daysInStage: 3, nextAction: 'Follow up on proposal' },
      { id: '8', name: 'Robert Taylor', address: '12 Sunset Blvd', value: '$1.4M', daysInStage: 7 },
    ],
  },
  {
    id: 'listed',
    name: 'Listed',
    color: 'bg-green-500',
    leads: [
      { id: '9', name: 'Amanda White', address: '99 Harbour St', value: '$3.1M', daysInStage: 14 },
    ],
  },
  {
    id: 'sold',
    name: 'Sold',
    color: 'bg-emerald-600',
    leads: [],
  },
];

export default function PipelinePage() {
  const [stages] = useState(initialStages);

  const totalValue = stages.reduce((sum, stage) => {
    return sum + stage.leads.reduce((stageSum, lead) => {
      const value = parseFloat(lead.value.replace('$', '').replace('M', '')) * 1000000;
      return stageSum + value;
    }, 0);
  }, 0);

  const totalLeads = stages.reduce((sum, stage) => sum + stage.leads.length, 0);

  return (
    <DemoLayout currentPage="pipeline">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sales Pipeline</h1>
              <p className="text-sm text-gray-500 mt-0.5">Track your leads through the sales process</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-xs text-gray-500">Pipeline Value</p>
                <p className="text-lg font-bold text-gray-900">${(totalValue / 1000000).toFixed(1)}M</p>
              </div>
              <div className="w-px h-10 bg-gray-200"></div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Leads</p>
                <p className="text-lg font-bold text-gray-900">{totalLeads}</p>
              </div>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Lead</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pipeline Board */}
        <div className="flex-1 overflow-x-auto p-4 bg-gray-100">
          <div className="flex space-x-4 h-full min-w-max">
            {stages.map(stage => (
              <div
                key={stage.id}
                className="w-80 flex-shrink-0 flex flex-col bg-gray-50 rounded-xl"
              >
                {/* Stage Header */}
                <div className="p-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 ${stage.color} rounded-full`}></div>
                      <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                      <span className="px-2 py-0.5 bg-gray-200 text-gray-600 text-xs font-medium rounded-full">
                        {stage.leads.length}
                      </span>
                    </div>
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    ${stage.leads.reduce((sum, l) => sum + parseFloat(l.value.replace('$', '').replace('M', '')), 0).toFixed(1)}M value
                  </p>
                </div>

                {/* Stage Cards */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {stage.leads.map(lead => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                          <p className="text-xs text-gray-500">{lead.address}</p>
                        </div>
                        <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-green-600">{lead.value}</span>
                        <span className="text-xs text-gray-400">{lead.daysInStage}d in stage</span>
                      </div>

                      {lead.nextAction && (
                        <div className="flex items-center space-x-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          <Calendar className="w-3 h-3" />
                          <span>{lead.nextAction}</span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-gray-100">
                        <button className="flex-1 px-2 py-1.5 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 flex items-center justify-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </button>
                        <button className="flex-1 px-2 py-1.5 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200 flex items-center justify-center space-x-1">
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </button>
                        <button className="px-2 py-1.5 bg-red-100 text-red-600 rounded text-xs font-medium hover:bg-red-200 flex items-center justify-center">
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {stage.leads.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No leads in this stage
                    </div>
                  )}
                </div>

                {/* Add Lead Button */}
                <div className="p-2 border-t border-gray-200">
                  <button className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center space-x-1">
                    <Plus className="w-4 h-4" />
                    <span>Add lead</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
