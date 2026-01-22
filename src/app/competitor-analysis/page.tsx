'use client';

import { DemoLayout } from '@/components/layout';
import { Users, Trophy, TrendingUp, Target, Calendar, Lightbulb } from 'lucide-react';

export default function CompetitorAnalysisPage() {
  return (
    <DemoLayout currentPage="competitor-analysis">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Competitor Analysis</h1>
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded uppercase">
                  Coming Soon
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">Understand your competition and dominate your suburbs</p>
            </div>
          </div>
        </div>

        {/* Coming Soon Content */}
        <div className="p-6">
          <div className="max-w-3xl mx-auto">
            {/* Main Coming Soon Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center mb-6">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-10 h-10 text-gray-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Competitor Analysis Coming Soon
              </h2>
              
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We're building AI-powered competitor intelligence to help you understand 
                your market position and find opportunities to win more listings.
              </p>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-600 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Expected Q2 2026</span>
              </div>
            </div>

            {/* Preview of Coming Features */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">What's Coming</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl opacity-60">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Agent Rankings</h4>
                    <p className="text-sm text-gray-500">See how you stack up against competitors in your suburbs</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl opacity-60">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Market Share Trends</h4>
                    <p className="text-sm text-gray-500">Track who's gaining or losing ground over time</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl opacity-60">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Personalized Action Plan</h4>
                    <p className="text-sm text-gray-500">AI-generated tips to improve your ranking</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl opacity-60">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Strength & Weakness Analysis</h4>
                    <p className="text-sm text-gray-500">Understand where you excel and where to improve</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Greyed out preview */}
            <div className="mt-6 opacity-30 pointer-events-none">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
                  <div className="h-10 w-24 bg-gray-100 rounded-lg"></div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-3 w-32 bg-gray-200 rounded mb-1"></div>
                        <div className="h-2 w-20 bg-gray-100 rounded"></div>
                      </div>
                      <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
