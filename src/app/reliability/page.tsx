'use client';

import { useState, useMemo } from 'react';
import { DemoLayout } from '@/components/layout/DemoLayout';

type InsightStatus = 'pending' | 'approved' | 'rejected';
type FilterValue = 'pending' | 'all' | 'approved' | 'rejected';

interface Insight {
  id: string;
  property: string;
  suburb: string;
  insightType: string;
  insightDescription: string;
  confidence: number;
  sources: number;
  evidence: string;
  detected: string;
  status: InsightStatus;
}

// Mock data for insights
const mockInsights: Insight[] = [
  {
    id: '1',
    property: '42 Ocean View Drive',
    suburb: 'Bondi Beach',
    insightType: 'Divorce Filing',
    insightDescription: 'Court records indicate divorce proceedings initiated',
    confidence: 94,
    sources: 5,
    evidence: 'Court records, property title change application',
    detected: '2 hours ago',
    status: 'pending',
  },
  {
    id: '2',
    property: '15 Harbour Street',
    suburb: 'Sydney CBD',
    insightType: 'Pre-Foreclosure',
    insightDescription: 'Mortgage default notice filed',
    confidence: 91,
    sources: 4,
    evidence: 'Bank filing, credit report flag',
    detected: '4 hours ago',
    status: 'pending',
  },
  {
    id: '3',
    property: '78 Garden Lane',
    suburb: 'Mosman',
    insightType: 'Estate Sale',
    insightDescription: 'Probate application detected',
    confidence: 88,
    sources: 3,
    evidence: 'Probate court filing, death notice',
    detected: '5 hours ago',
    status: 'pending',
  },
  {
    id: '4',
    property: '23 Mountain Road',
    suburb: 'Blue Mountains',
    insightType: 'Owner Relocation',
    insightDescription: 'Interstate job transfer identified',
    confidence: 85,
    sources: 4,
    evidence: 'LinkedIn update, moving company inquiry',
    detected: '6 hours ago',
    status: 'pending',
  },
  {
    id: '5',
    property: '156 Beach Avenue',
    suburb: 'Manly',
    insightType: 'Financial Distress',
    insightDescription: 'Multiple debt collection notices',
    confidence: 82,
    sources: 3,
    evidence: 'Court filings, ATO debt',
    detected: '8 hours ago',
    status: 'pending',
  },
  {
    id: '6',
    property: '89 Park Terrace',
    suburb: 'Neutral Bay',
    insightType: 'Empty Nest',
    insightDescription: 'Children moved out, downsizing likely',
    confidence: 78,
    sources: 2,
    evidence: 'Social media, school records',
    detected: '10 hours ago',
    status: 'pending',
  },
  {
    id: '7',
    property: '34 Valley View',
    suburb: 'Chatswood',
    insightType: 'Investor Exit',
    insightDescription: 'Investment property, owner aging',
    confidence: 75,
    sources: 3,
    evidence: 'Rental listing history, age records',
    detected: '12 hours ago',
    status: 'pending',
  },
  {
    id: '8',
    property: '67 Riverside Drive',
    suburb: 'Lane Cove',
    insightType: 'Health Change',
    insightDescription: 'Move to care facility indicated',
    confidence: 72,
    sources: 2,
    evidence: 'Medicare records, facility inquiry',
    detected: '14 hours ago',
    status: 'pending',
  },
  {
    id: '9',
    property: '112 Crown Street',
    suburb: 'Surry Hills',
    insightType: 'Job Loss',
    insightDescription: 'Recent redundancy detected',
    confidence: 68,
    sources: 2,
    evidence: 'LinkedIn update, unemployment filing',
    detected: '1 day ago',
    status: 'approved',
  },
  {
    id: '10',
    property: '45 King Road',
    suburb: 'Randwick',
    insightType: 'Renovation Intent',
    insightDescription: 'DA application for major works',
    confidence: 65,
    sources: 2,
    evidence: 'Council DA records',
    detected: '1 day ago',
    status: 'approved',
  },
  {
    id: '11',
    property: '201 Pacific Highway',
    suburb: 'North Sydney',
    insightType: 'Business Closure',
    insightDescription: 'Linked business winding down',
    confidence: 58,
    sources: 2,
    evidence: 'ASIC filing, business name cancellation',
    detected: '2 days ago',
    status: 'rejected',
  },
  {
    id: '12',
    property: '88 Darling Point Road',
    suburb: 'Darling Point',
    insightType: 'Lifestyle Change',
    insightDescription: 'Retirement indication',
    confidence: 52,
    sources: 1,
    evidence: 'Social media post only',
    detected: '2 days ago',
    status: 'rejected',
  },
];

export default function ReliabilityPage() {
  const [filter, setFilter] = useState<FilterValue>('pending');
  const [insights, setInsights] = useState<Insight[]>(mockInsights);
  const [sortDescending, setSortDescending] = useState(true);

  const filteredInsights = useMemo(() => {
    let filtered = insights;
    if (filter !== 'all') {
      filtered = insights.filter((i) => i.status === filter);
    }
    return filtered.sort((a, b) =>
      sortDescending ? b.confidence - a.confidence : a.confidence - b.confidence
    );
  }, [insights, filter, sortDescending]);

  const counts = useMemo(() => {
    return {
      pending: insights.filter((i) => i.status === 'pending').length,
      approved: insights.filter((i) => i.status === 'approved').length,
      rejected: insights.filter((i) => i.status === 'rejected').length,
    };
  }, [insights]);

  const handleApprove = (id: string) => {
    setInsights((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'approved' as InsightStatus } : i))
    );
  };

  const handleReject = (id: string) => {
    setInsights((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'rejected' as InsightStatus } : i))
    );
  };

  const handleAutoApprove = () => {
    setInsights((prev) =>
      prev.map((i) =>
        i.status === 'pending' && i.confidence >= 90
          ? { ...i, status: 'approved' as InsightStatus }
          : i
      )
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 75) return 'text-blue-600 bg-blue-100';
    if (confidence >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <DemoLayout>
      <div className="flex-1 overflow-auto bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold text-gray-900">Lead Reliability</h1>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded">
                  Admin Panel
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">
                AI-screened insights awaiting verification
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-gray-500">Filter:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as FilterValue)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="pending">Pending Review</option>
                  <option value="all">All Insights</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <button
                onClick={handleAutoApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Auto-Approve 90%+</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">{counts.pending}</span> Pending
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">{counts.approved}</span> Approved
                Today
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">{counts.rejected}</span> Rejected
                Today
              </span>
            </div>
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-gray-500">Auto-approved (90%+ / 4+ sources):</span>
              <span className="font-semibold text-green-600">
                {insights.filter((i) => i.confidence >= 90 && i.sources >= 4).length}
              </span>
            </div>
          </div>
        </div>

        {/* Insights Table */}
        <div className="p-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Property / Lead
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Insight Type
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase cursor-pointer hover:bg-gray-100 select-none"
                    onClick={() => setSortDescending(!sortDescending)}
                  >
                    <span className="flex items-center space-x-1">
                      <span>AI Confidence</span>
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          sortDescending ? '' : 'rotate-180'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Sources
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Evidence
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Detected
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredInsights.map((insight) => (
                  <tr key={insight.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{insight.property}</p>
                        <p className="text-xs text-gray-500">{insight.suburb}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {insight.insightType}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold ${getConfidenceColor(
                          insight.confidence
                        )}`}
                      >
                        {insight.confidence}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: insight.sources }).map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">{insight.sources}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs text-gray-600 max-w-xs truncate" title={insight.evidence}>
                        {insight.evidence}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{insight.detected}</span>
                    </td>
                    <td className="px-4 py-3">
                      {insight.status === 'pending' ? (
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleApprove(insight.id)}
                            className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Approve"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleReject(insight.id)}
                            className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Reject"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            insight.status === 'approved'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {insight.status === 'approved' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Showing 1-{filteredInsights.length} of {filteredInsights.length}{' '}
              {filter === 'all' ? '' : filter} insights
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                Previous
              </button>
              <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                2
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                3
              </button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
