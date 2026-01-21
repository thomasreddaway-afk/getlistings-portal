'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { Check, Clock, FileText, Phone, MessageSquare, Mail, Image, BarChart3, Users } from 'lucide-react';

interface Property {
  id: number;
  address: string;
  suburb: string;
  postcode: string;
  score: number;
  beds: number;
  baths: number;
}

const properties: Property[] = [
  { id: 1, address: '42 Ocean View Drive', suburb: 'Bondi', postcode: '2026', score: 80, beds: 4, baths: 3 },
  { id: 2, address: '15 Arinya Road', suburb: 'Ashgrove', postcode: '4060', score: 71, beds: 5, baths: 3 },
  { id: 3, address: '8 Hillside Crescent', suburb: 'Mosman', postcode: '2088', score: 60, beds: 3, baths: 2 }
];

const signals = [
  { text: 'Neighbour selling property', time: '1 year ago', type: 'green' },
  { text: 'Requested valuation', time: '1 year ago', type: 'green' },
  { text: 'Last sold', time: '4 years ago', type: 'blue' }
];

const tools = [
  { icon: FileText, title: 'AI Proposal', desc: 'Generate listing presentation', color: 'primary' },
  { icon: Phone, title: 'Script Call', desc: 'AI-generated call script', color: 'blue' },
  { icon: MessageSquare, title: 'SMS Templates', desc: 'Quick message templates', color: 'green' },
  { icon: Mail, title: 'Email Campaign', desc: 'Personalized email drips', color: 'purple' },
  { icon: Image, title: 'Content Creation', desc: 'Create social assets', color: 'amber' },
  { icon: BarChart3, title: 'Market Report', desc: 'Generate suburb insights', color: 'red' }
];

function getScoreColor(score: number) {
  if (score >= 75) return { bg: 'bg-green-100', text: 'text-green-700' };
  if (score >= 65) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
  return { bg: 'bg-orange-100', text: 'text-orange-700' };
}

export default function PropertiesPage() {
  const [selectedId, setSelectedId] = useState(1);
  const selected = properties.find(p => p.id === selectedId) || properties[0];
  const scoreColor = getScoreColor(selected.score);

  return (
    <DemoLayout currentPage="properties">
      <div className="flex-1 overflow-hidden flex">
        {/* Property List Sidebar */}
        <div className="w-96 border-r border-gray-200 flex flex-col bg-white">
          <div className="p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Properties</h2>
            <p className="text-sm text-gray-500">847 properties tracked</p>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {properties.map((prop) => {
              const colors = getScoreColor(prop.score);
              return (
                <div
                  key={prop.id}
                  onClick={() => setSelectedId(prop.id)}
                  className={`bg-white rounded-xl p-4 cursor-pointer transition-all ${
                    selectedId === prop.id ? 'border-2 border-primary' : 'border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 ${colors.bg} ${colors.text} text-xs font-medium rounded-full`}>{prop.score}% Score</span>
                  </div>
                  <h3 className="font-medium text-gray-900">{prop.address}</h3>
                  <p className="text-sm text-gray-500">{prop.suburb} NSW {prop.postcode}</p>
                  <div className="flex items-center space-x-3 text-sm text-gray-500 mt-2">
                    <span>🛏 {prop.beds}</span>
                    <span>🚿 {prop.baths}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Property Detail View */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-6">
            {/* Header with Instant Appraisal */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{selected.address}, {selected.suburb}</h1>
              <div className="bg-gradient-to-br from-primary to-red-700 rounded-xl p-4 text-white w-80">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Instant Appraisal</h3>
                    <p className="text-white/80 text-xs">Impress homeowners instantly</p>
                  </div>
                </div>
                <p className="text-white/90 text-xs mb-3">Generate a beautiful, professional property appraisal report in seconds.</p>
                <button className="w-full py-2 bg-white text-primary font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                  <span>Generate Appraisal Report</span>
                </button>
              </div>
            </div>

            {/* Seller Score Gauge */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Seller Score</h2>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="url(#scoreGradient)" strokeWidth="10" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset={251.2 * (1 - selected.score / 100)} />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="100%" stopColor="#c8102e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">{selected.score}%</span>
                    <span className="text-sm text-gray-500">Likely to Sell</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center space-x-8 mt-4 text-sm">
                <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-green-500 rounded-full"></div><span className="text-gray-600">Low</span></div>
                <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-yellow-500 rounded-full"></div><span className="text-gray-600">Medium</span></div>
                <div className="flex items-center space-x-2"><div className="w-3 h-3 bg-red-500 rounded-full"></div><span className="text-gray-600">High</span></div>
              </div>
            </div>

            {/* Selling Signals */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Selling Signals</h2>
              <div className="space-y-3">
                {signals.map((sig, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 ${sig.type === 'green' ? 'bg-green-50' : 'bg-blue-50'} rounded-lg`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 ${sig.type === 'green' ? 'bg-green-100' : 'bg-blue-100'} rounded-full flex items-center justify-center`}>
                        {sig.type === 'green' ? <Check className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-blue-600" />}
                      </div>
                      <span className="text-gray-900">{sig.text}</span>
                    </div>
                    <span className="text-sm text-gray-500">{sig.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Win The Listing Tools */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Win The Listing</h2>
              <p className="text-sm text-gray-500 mb-4">AI-powered tools to help you convert this lead</p>
              <div className="grid grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <button key={tool.title} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
                    <div className={`w-12 h-12 bg-${tool.color === 'primary' ? 'primary/10' : `${tool.color}-100`} rounded-xl flex items-center justify-center`}>
                      <tool.icon className={`w-6 h-6 text-${tool.color === 'primary' ? 'primary' : `${tool.color}-600`}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{tool.title}</p>
                      <p className="text-xs text-gray-500">{tool.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Competitor Watch */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-purple-600" />
                Competitor Watch
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Agents subscribed</span>
                  <span className="font-semibold text-gray-900">8 agents</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-gray-600">Last agent contact</span>
                  <span className="font-semibold text-yellow-700">3 days ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Your advantage</span>
                  <span className="font-semibold text-green-700">First to call today</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
