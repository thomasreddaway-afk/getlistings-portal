'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { Check, ExternalLink, Video, Smartphone, User, FileText, Megaphone, ChevronRight } from 'lucide-react';

type CategoryType = 'all' | 'video' | 'social' | 'profile' | 'content' | 'advertising' | 'completed';

interface MarketingTip {
  id: string;
  category: 'video' | 'social' | 'profile' | 'content' | 'advertising';
  title: string;
  description: string;
  effort: 'Easy' | 'Medium' | 'Hard';
  impact: 'Low' | 'Medium' | 'High';
  isCompleted: boolean;
  steps?: string[];
  resource?: { label: string; url: string };
}

const marketingTips: MarketingTip[] = [
  {
    id: '1',
    category: 'video',
    title: 'Create a 60-second property walkthrough video template',
    description: 'Having a consistent format for property videos increases engagement and builds brand recognition.',
    effort: 'Medium',
    impact: 'High',
    isCompleted: true,
    steps: [
      'Plan your intro shot (front of property)',
      'Map out a logical walkthrough path',
      'Add your branded intro/outro',
      'Include a call-to-action at the end',
    ],
  },
  {
    id: '2',
    category: 'social',
    title: 'Post market update every Friday',
    description: 'Weekly market updates position you as a local expert and keep your audience engaged.',
    effort: 'Easy',
    impact: 'High',
    isCompleted: true,
    steps: [
      'Gather local sales data',
      'Create a simple graphic with key stats',
      'Add personal commentary on trends',
      'Post between 11am-1pm for best engagement',
    ],
  },
  {
    id: '3',
    category: 'profile',
    title: 'Update your LinkedIn headline with value proposition',
    description: 'Your headline is the first thing people see. Make it count with a clear value statement.',
    effort: 'Easy',
    impact: 'Medium',
    isCompleted: true,
    steps: [
      'Focus on what you help clients achieve',
      'Include your specialty suburbs',
      'Avoid generic titles like "Real Estate Agent"',
    ],
    resource: { label: 'LinkedIn Profile Tips', url: 'https://linkedin.com' },
  },
  {
    id: '4',
    category: 'video',
    title: 'Record testimonial videos with recent sellers',
    description: 'Video testimonials are 10x more powerful than written reviews for building trust.',
    effort: 'Medium',
    impact: 'High',
    isCompleted: false,
    steps: [
      'Reach out to happy clients from last 6 months',
      'Offer to meet at a coffee shop or their new home',
      'Prepare 3-4 simple questions',
      'Keep each video under 90 seconds',
    ],
  },
  {
    id: '5',
    category: 'social',
    title: 'Run a "Just Sold" Instagram story series',
    description: 'Showcase your wins with before/after stories showing the journey from listing to sold.',
    effort: 'Easy',
    impact: 'Medium',
    isCompleted: false,
    steps: [
      'Create a branded story template',
      'Share the original listing photos',
      'Add sold price and days on market',
      'Include a brief caption about the sale',
    ],
  },
  {
    id: '6',
    category: 'content',
    title: 'Write a local suburb guide for your core area',
    description: 'Detailed suburb guides rank well in search and position you as the local authority.',
    effort: 'Hard',
    impact: 'High',
    isCompleted: false,
    steps: [
      'Research local schools, parks, cafes',
      'Interview local business owners',
      'Include recent sales data and trends',
      'Add high-quality photos of the area',
      'Publish on your website and LinkedIn',
    ],
  },
  {
    id: '7',
    category: 'advertising',
    title: 'Set up a Facebook retargeting pixel on your website',
    description: 'Retargeting visitors keeps you top-of-mind and converts cold traffic into leads.',
    effort: 'Medium',
    impact: 'High',
    isCompleted: false,
    resource: { label: 'Facebook Pixel Guide', url: 'https://business.facebook.com' },
  },
  {
    id: '8',
    category: 'profile',
    title: 'Get a professional headshot taken',
    description: 'A high-quality headshot increases trust and makes you look more professional.',
    effort: 'Medium',
    impact: 'Medium',
    isCompleted: false,
    steps: [
      'Find a local portrait photographer',
      'Wear solid colors (avoid patterns)',
      'Choose a clean, professional background',
      'Update across all platforms',
    ],
  },
  {
    id: '9',
    category: 'content',
    title: 'Create an email newsletter for your database',
    description: 'Monthly newsletters keep you connected with past clients and nurture leads.',
    effort: 'Medium',
    impact: 'High',
    isCompleted: false,
    steps: [
      'Choose an email platform (Mailchimp, etc.)',
      'Create a consistent template',
      'Mix value content with property updates',
      'Send on a consistent day/time',
    ],
  },
  {
    id: '10',
    category: 'advertising',
    title: 'Run a vendor-paid marketing campaign template',
    description: 'Create a reusable campaign structure for seller-funded advertising.',
    effort: 'Hard',
    impact: 'High',
    isCompleted: false,
  },
];

const categoryIcons: Record<string, React.ReactNode> = {
  video: <Video className="w-4 h-4" />,
  social: <Smartphone className="w-4 h-4" />,
  profile: <User className="w-4 h-4" />,
  content: <FileText className="w-4 h-4" />,
  advertising: <Megaphone className="w-4 h-4" />,
};

const categoryEmoji: Record<string, string> = {
  video: '🎬',
  social: '📱',
  profile: '👤',
  content: '📝',
  advertising: '📢',
};

export default function BrandingPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [completedTips, setCompletedTips] = useState<Set<string>>(
    new Set(marketingTips.filter(t => t.isCompleted).map(t => t.id))
  );
  const [expandedTip, setExpandedTip] = useState<string | null>(null);

  const completedCount = completedTips.size;
  const totalCount = marketingTips.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const filteredTips = marketingTips.filter(tip => {
    if (activeCategory === 'completed') {
      return completedTips.has(tip.id);
    }
    if (activeCategory === 'all') {
      return !completedTips.has(tip.id);
    }
    return tip.category === activeCategory && !completedTips.has(tip.id);
  });

  const toggleComplete = (id: string) => {
    setCompletedTips(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-amber-100 text-amber-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-blue-100 text-blue-700';
      case 'Medium': return 'bg-sky-100 text-sky-700';
      case 'Low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <DemoLayout currentPage="branding">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Marketing Tips</h1>
                <p className="text-sm text-gray-500 mt-0.5">AI-curated tips to improve your online presence</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">{completedCount} of {totalCount} completed</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-4 flex space-x-1 overflow-x-auto">
            {[
              { id: 'all' as CategoryType, label: 'All' },
              { id: 'video' as CategoryType, label: '🎬 Video' },
              { id: 'social' as CategoryType, label: '📱 Social' },
              { id: 'profile' as CategoryType, label: '👤 Profile' },
              { id: 'content' as CategoryType, label: '📝 Content' },
              { id: 'advertising' as CategoryType, label: '📢 Ads' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                  activeCategory === tab.id
                    ? 'border-red-500 text-red-500 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
            <div className="flex-1"></div>
            <button
              onClick={() => setActiveCategory('completed')}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
                activeCategory === 'completed'
                  ? 'border-green-500 text-green-600 bg-green-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              ✓ Completed ({completedCount})
            </button>
          </div>
        </div>

        {/* Tips List */}
        <div className="p-4 space-y-3">
          {filteredTips.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              {activeCategory === 'completed' ? (
                <>
                  <Check className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No completed tips yet. Start marking tips as done!</p>
                </>
              ) : (
                <>
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">All tips in this category are completed! 🎉</p>
                </>
              )}
            </div>
          ) : (
            filteredTips.map(tip => (
              <div
                key={tip.id}
                className={`bg-white rounded-xl border border-gray-200 overflow-hidden transition-all ${
                  completedTips.has(tip.id) ? 'opacity-75' : ''
                }`}
              >
                <div
                  className="px-4 py-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedTip(expandedTip === tip.id ? null : tip.id)}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleComplete(tip.id);
                      }}
                      className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        completedTips.has(tip.id)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-green-400'
                      }`}
                    >
                      {completedTips.has(tip.id) && <Check className="w-4 h-4" />}
                    </button>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm">{categoryEmoji[tip.category]}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getEffortColor(tip.effort)}`}>
                          {tip.effort}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${getImpactColor(tip.impact)}`}>
                          {tip.impact} Impact
                        </span>
                      </div>
                      <h3 className={`font-medium text-gray-900 ${completedTips.has(tip.id) ? 'line-through' : ''}`}>
                        {tip.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{tip.description}</p>
                    </div>

                    {/* Expand Icon */}
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedTip === tip.id ? 'rotate-90' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedTip === tip.id && (
                  <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                    <div className="ml-10 mt-4">
                      {tip.steps && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Steps:</p>
                          <ul className="space-y-2">
                            {tip.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                                <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-500 flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {tip.resource && (
                        <a
                          href={tip.resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-sm text-red-500 hover:text-red-600 font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>{tip.resource.label}</span>
                        </a>
                      )}

                      {!completedTips.has(tip.id) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComplete(tip.id);
                          }}
                          className="mt-4 px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600"
                        >
                          Mark as Complete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
