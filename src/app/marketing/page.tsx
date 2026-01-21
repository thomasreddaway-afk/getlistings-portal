'use client';

import { useState } from 'react';
import { DemoLayout } from '@/components/layout/DemoLayout';

// Template types for filtering
type TemplateType = 'all' | 'just-listed' | 'sold' | 'for-lease' | 'leased' | 'open-home' | 'price-reduced' | 'agent';

interface Template {
  id: string;
  name: string;
  type: TemplateType;
  image: string;
  downloads: number;
  isNew?: boolean;
  isPremium?: boolean;
}

// Mock templates data
const mockTemplates: Template[] = [
  { id: '1', name: 'Modern Minimalist', type: 'just-listed', image: '/templates/just-listed-1.jpg', downloads: 1234, isNew: true },
  { id: '2', name: 'Luxury Estate', type: 'just-listed', image: '/templates/just-listed-2.jpg', downloads: 987, isPremium: true },
  { id: '3', name: 'Urban Living', type: 'just-listed', image: '/templates/just-listed-3.jpg', downloads: 756 },
  { id: '4', name: 'Family Home', type: 'just-listed', image: '/templates/just-listed-4.jpg', downloads: 543 },
  { id: '5', name: 'Celebration', type: 'sold', image: '/templates/sold-1.jpg', downloads: 2341, isNew: true },
  { id: '6', name: 'Success Story', type: 'sold', image: '/templates/sold-2.jpg', downloads: 1876 },
  { id: '7', name: 'Record Breaker', type: 'sold', image: '/templates/sold-3.jpg', downloads: 1543, isPremium: true },
  { id: '8', name: 'Happy Clients', type: 'sold', image: '/templates/sold-4.jpg', downloads: 1232 },
  { id: '9', name: 'Available Now', type: 'for-lease', image: '/templates/lease-1.jpg', downloads: 654 },
  { id: '10', name: 'Investment Ready', type: 'for-lease', image: '/templates/lease-2.jpg', downloads: 543 },
  { id: '11', name: 'Leased Fast', type: 'leased', image: '/templates/leased-1.jpg', downloads: 432 },
  { id: '12', name: 'Tenant Found', type: 'leased', image: '/templates/leased-2.jpg', downloads: 321 },
  { id: '13', name: 'Open This Weekend', type: 'open-home', image: '/templates/open-1.jpg', downloads: 876, isNew: true },
  { id: '14', name: 'Inspection Times', type: 'open-home', image: '/templates/open-2.jpg', downloads: 765 },
  { id: '15', name: 'Open Home Countdown', type: 'open-home', image: '/templates/open-3.jpg', downloads: 654, isPremium: true },
  { id: '16', name: 'Price Drop Alert', type: 'price-reduced', image: '/templates/reduced-1.jpg', downloads: 543 },
  { id: '17', name: 'New Price', type: 'price-reduced', image: '/templates/reduced-2.jpg', downloads: 432, isNew: true },
  { id: '18', name: 'Value Update', type: 'price-reduced', image: '/templates/reduced-3.jpg', downloads: 321 },
  { id: '19', name: 'Agent Spotlight', type: 'agent', image: '/templates/agent-1.jpg', downloads: 2345, isPremium: true },
  { id: '20', name: 'Team Profile', type: 'agent', image: '/templates/agent-2.jpg', downloads: 1987 },
  { id: '21', name: 'Personal Brand', type: 'agent', image: '/templates/agent-3.jpg', downloads: 1654 },
  { id: '22', name: 'Expert Bio', type: 'agent', image: '/templates/agent-4.jpg', downloads: 1432 },
  { id: '23', name: 'Clean Lines', type: 'just-listed', image: '/templates/just-listed-5.jpg', downloads: 876 },
  { id: '24', name: 'Premium Property', type: 'just-listed', image: '/templates/just-listed-6.jpg', downloads: 765, isPremium: true },
  { id: '25', name: 'Dream Home', type: 'sold', image: '/templates/sold-5.jpg', downloads: 654 },
  { id: '26', name: 'Milestone', type: 'sold', image: '/templates/sold-6.jpg', downloads: 543, isNew: true },
  { id: '27', name: 'Commercial Ready', type: 'for-lease', image: '/templates/lease-3.jpg', downloads: 432 },
  { id: '28', name: 'Executive Suite', type: 'for-lease', image: '/templates/lease-4.jpg', downloads: 321, isPremium: true },
  { id: '29', name: 'Public Open', type: 'open-home', image: '/templates/open-4.jpg', downloads: 765 },
  { id: '30', name: 'Bargain Alert', type: 'price-reduced', image: '/templates/reduced-4.jpg', downloads: 543 },
];

const filterOptions: { id: TemplateType; label: string }[] = [
  { id: 'all', label: 'All Templates' },
  { id: 'just-listed', label: 'Just Listed' },
  { id: 'sold', label: 'Sold' },
  { id: 'for-lease', label: 'For Lease' },
  { id: 'leased', label: 'Leased' },
  { id: 'open-home', label: 'Open Home' },
  { id: 'price-reduced', label: 'Price Reduced' },
  { id: 'agent', label: 'Agent Profile' },
];

export default function MarketingPage() {
  const [activeFilter, setActiveFilter] = useState<TemplateType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = mockTemplates.filter((template) => {
    const matchesFilter = activeFilter === 'all' || template.type === activeFilter;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <DemoLayout>
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Creation</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Create beautiful marketing assets • <span>{filteredTemplates.length}</span> templates
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 min-h-screen">
          {/* Template Categories */}
          <div className="flex space-x-2 mb-6 flex-wrap gap-y-2">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
              >
                {/* Template Preview */}
                <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Placeholder for template image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-gray-400">Template Preview</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {template.isNew && (
                      <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded">
                        NEW
                      </span>
                    )}
                    {template.isPremium && (
                      <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-medium rounded flex items-center space-x-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>PRO</span>
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-6 py-2 bg-white text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                      Use Template
                    </button>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500 capitalize">
                      {template.type.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{template.downloads.toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
              <p className="text-sm text-gray-500 mt-1">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
