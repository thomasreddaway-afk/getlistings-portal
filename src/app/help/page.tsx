'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  Search, 
  MessageSquare, 
  Book, 
  Video, 
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  FileText,
  Zap,
  Shield,
  CreditCard,
  Settings,
  Users
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    question: 'How do I subscribe to a new suburb?',
    answer: 'Go to Settings > Suburbs, then search for the suburb you want to add. Click "Subscribe" and confirm your selection. The suburb will be added to your coverage area immediately.',
    category: 'Subscriptions',
  },
  {
    id: '2',
    question: 'How are seller scores calculated?',
    answer: 'Seller scores are calculated using AI that analyzes 50+ data points including property ownership duration, mortgage status, life events, market conditions, and online activity signals. Scores range from 0-100.',
    category: 'Leads',
  },
  {
    id: '3',
    question: 'Can I export my leads to CSV?',
    answer: 'Yes! Go to Leads, click the export button in the top right, select your date range and filters, then download as CSV. You can also set up automated exports.',
    category: 'Leads',
  },
  {
    id: '4',
    question: 'How do I set up SMS automation?',
    answer: 'Navigate to SMS Flows, click "Create Flow", choose a trigger (new lead, appraisal booked, etc.), then add your message templates. You can preview and test before activating.',
    category: 'Marketing',
  },
  {
    id: '5',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, Amex), direct debit, and PayPal. Annual subscriptions receive a 15% discount.',
    category: 'Billing',
  },
  {
    id: '6',
    question: 'How do I cancel my subscription?',
    answer: 'You can cancel anytime from Settings > Billing > Cancel Subscription. You\'ll retain access until the end of your billing period. No cancellation fees apply.',
    category: 'Billing',
  },
];

const helpCategories = [
  { icon: Zap, label: 'Getting Started', articles: 12, color: 'bg-blue-100 text-blue-600' },
  { icon: Users, label: 'Lead Management', articles: 18, color: 'bg-green-100 text-green-600' },
  { icon: MessageSquare, label: 'SMS & Email', articles: 9, color: 'bg-purple-100 text-purple-600' },
  { icon: CreditCard, label: 'Billing & Plans', articles: 7, color: 'bg-amber-100 text-amber-600' },
  { icon: Shield, label: 'Privacy & Security', articles: 5, color: 'bg-red-100 text-red-600' },
  { icon: Settings, label: 'Account Settings', articles: 11, color: 'bg-gray-100 text-gray-600' },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const filteredFaqs = searchQuery
    ? faqItems.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  return (
    <DemoLayout currentPage="help">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-12 text-center">
          <h1 className="text-3xl font-bold mb-2">How can we help you?</h1>
          <p className="text-red-100 mb-6">Search our help center or browse categories below</p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-5xl mx-auto">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            <a 
              href="#" 
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center space-x-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Live Chat</p>
                <p className="text-sm text-gray-500">Chat with support team</p>
              </div>
            </a>
            <a 
              href="#" 
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center space-x-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Video Tutorials</p>
                <p className="text-sm text-gray-500">Watch how-to guides</p>
              </div>
            </a>
            <a 
              href="#" 
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center space-x-4 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email Support</p>
                <p className="text-sm text-gray-500">support@getlistings.com</p>
              </div>
            </a>
          </div>

          {/* Help Categories */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-3 gap-4">
              {helpCategories.map((category, index) => (
                <a
                  key={index}
                  href="#"
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${category.color}`}>
                        <category.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{category.label}</p>
                        <p className="text-xs text-gray-500">{category.articles} articles</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
              {filteredFaqs.map(faq => (
                <div key={faq.id}>
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <HelpCircle className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-gray-900">{faq.question}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{faq.category}</span>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedFaq === faq.id ? 'rotate-90' : ''}`} />
                    </div>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-5 pb-4 pl-13">
                      <p className="text-sm text-gray-600 ml-8">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No results found for "{searchQuery}"</p>
                <p className="text-sm text-gray-400 mt-1">Try a different search term or browse categories</p>
              </div>
            )}
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Still need help?</h3>
                <p className="text-gray-300 mt-1">Our support team is available Mon-Fri, 9am-6pm AEST</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>1800 GET LIST</span>
                </button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Start Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
