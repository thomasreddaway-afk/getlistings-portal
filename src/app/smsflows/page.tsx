'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  Plus, 
  Play, 
  Pause, 
  Edit2, 
  Trash2, 
  Copy,
  MessageSquare,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  MoreVertical,
  Zap
} from 'lucide-react';

interface SMSFlow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  triggerType: string;
  messagesCount: number;
  recipientsCount: number;
  sentCount: number;
  responseRate: number;
  createdAt: string;
}

const smsFlows: SMSFlow[] = [
  {
    id: '1',
    name: 'New Lead Welcome',
    description: 'Automated welcome message for new leads from Facebook ads',
    status: 'active',
    triggerType: 'New Lead',
    messagesCount: 3,
    recipientsCount: 1247,
    sentCount: 3741,
    responseRate: 34.2,
    createdAt: '2024-01-05',
  },
  {
    id: '2',
    name: 'Appraisal Follow-up',
    description: 'Follow up sequence after appraisal booking',
    status: 'active',
    triggerType: 'Appraisal Booked',
    messagesCount: 4,
    recipientsCount: 234,
    sentCount: 936,
    responseRate: 45.8,
    createdAt: '2024-01-08',
  },
  {
    id: '3',
    name: 'Price Update Notification',
    description: 'Notify interested buyers when listing price changes',
    status: 'paused',
    triggerType: 'Price Change',
    messagesCount: 1,
    recipientsCount: 567,
    sentCount: 567,
    responseRate: 12.4,
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    name: 'Open Home Reminder',
    description: 'Remind registered attendees before open home',
    status: 'active',
    triggerType: 'Open Home Scheduled',
    messagesCount: 2,
    recipientsCount: 189,
    sentCount: 378,
    responseRate: 67.3,
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    name: 'Re-engagement Campaign',
    description: 'Win back cold leads who haven\'t responded in 30 days',
    status: 'draft',
    triggerType: 'Inactivity (30 days)',
    messagesCount: 5,
    recipientsCount: 0,
    sentCount: 0,
    responseRate: 0,
    createdAt: '2024-01-15',
  },
];

function getStatusColor(status: string) {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'paused': return 'bg-amber-100 text-amber-700';
    case 'draft': return 'bg-gray-100 text-gray-600';
    default: return 'bg-gray-100 text-gray-600';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'active': return <Play className="w-3 h-3" />;
    case 'paused': return <Pause className="w-3 h-3" />;
    case 'draft': return <Edit2 className="w-3 h-3" />;
    default: return null;
  }
}

export default function SMSFlowsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'draft'>('all');

  const filteredFlows = smsFlows.filter(flow => {
    if (filter === 'all') return true;
    return flow.status === filter;
  });

  const activeCount = smsFlows.filter(f => f.status === 'active').length;
  const totalSent = smsFlows.reduce((sum, f) => sum + f.sentCount, 0);
  const avgResponseRate = smsFlows.filter(f => f.sentCount > 0).reduce((sum, f) => sum + f.responseRate, 0) / smsFlows.filter(f => f.sentCount > 0).length;

  return (
    <DemoLayout currentPage="smsflows">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Flows</h1>
              <p className="text-sm text-gray-500 mt-0.5">Automated SMS sequences for lead nurturing</p>
            </div>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Flow</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{activeCount}</p>
                <p className="text-xs text-gray-500">Active Flows</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{totalSent.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Messages Sent</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{avgResponseRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500">Avg Response Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center space-x-2">
            {[
              { id: 'all' as const, label: 'All Flows', count: smsFlows.length },
              { id: 'active' as const, label: 'Active', count: smsFlows.filter(f => f.status === 'active').length },
              { id: 'paused' as const, label: 'Paused', count: smsFlows.filter(f => f.status === 'paused').length },
              { id: 'draft' as const, label: 'Drafts', count: smsFlows.filter(f => f.status === 'draft').length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filter === tab.id
                    ? 'bg-red-100 text-red-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Flows List */}
        <div className="p-4 space-y-4">
          {filteredFlows.map(flow => (
            <div
              key={flow.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{flow.name}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full flex items-center space-x-1 ${getStatusColor(flow.status)}`}>
                        {getStatusIcon(flow.status)}
                        <span className="capitalize">{flow.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{flow.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Trigger: {flow.triggerType}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{flow.messagesCount} messages</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-500">
                        <Users className="w-4 h-4" />
                        <span>{flow.recipientsCount.toLocaleString()} recipients</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 ml-6">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-xl font-bold text-gray-900">{flow.sentCount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Sent</p>
                      </div>
                      <div>
                        <p className="text-xl font-bold text-green-600">{flow.responseRate}%</p>
                        <p className="text-xs text-gray-500">Response</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {flow.status === 'active' ? (
                        <button className="p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200" title="Pause">
                          <Pause className="w-4 h-4" />
                        </button>
                      ) : (
                        <button className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Start">
                          <Play className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="More">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredFlows.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No flows match this filter</p>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
