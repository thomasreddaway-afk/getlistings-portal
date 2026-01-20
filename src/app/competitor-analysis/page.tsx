'use client';

import { useState } from 'react';
import { DemoLayout } from '@/components/layout/DemoLayout';
import { useAuth } from '@/lib/auth/client';
import { cn } from '@/lib/utils/cn';

/**
 * Competitor Analysis Page - Converted from demo.html
 * Matches the exact UI from the screenshot
 */

interface Agent {
  name: string;
  agency: string;
  photo: string | null;
  score: number;
  change: number;
  isYou?: boolean;
}

interface Pillar {
  name: string;
  score: number;
  maxScore: number;
  icon: string;
  tip: string;
  color: string;
}

interface FastestMover {
  name: string;
  change: string;
  reason: string;
  photo: string | null;
  isYou?: boolean;
}

interface ActionItem {
  priority: 'high' | 'medium' | 'low';
  text: string;
  impact: string;
}

interface DailyTask {
  day: string;
  task: string;
  done: boolean;
}

interface ContentIdea {
  title: string;
  type: string;
  description: string;
  icon: string;
}

interface CompetitorData {
  suburb: string;
  score: number;
  rank: number;
  rankChange: number;
  agents: Agent[];
  pillars: Pillar[];
  fastestMovers: FastestMover[];
  actionItems: ActionItem[];
  dailyPlan: DailyTask[];
  contentIdeas: ContentIdea[];
}

// Available suburbs for demo
const SUBURBS = ['Paddington', 'Ashgrove', 'Bardon', 'Red Hill', 'Kelvin Grove', 'Auchenflower'];

export default function CompetitorAnalysisPage() {
  const { user } = useAuth();
  const [selectedSuburb, setSelectedSuburb] = useState('Paddington');
  const [status, setStatus] = useState<'empty' | 'loading' | 'ready'>('empty');
  const [data, setData] = useState<CompetitorData | null>(null);

  // Generate mock data for selected suburb
  const generateData = (suburb: string): CompetitorData => {
    const userName = user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Tom Reddaway';
    const userAgency = user?.agency_name || 'McGrath';

    return {
      suburb: `${suburb}, QLD`,
      score: 72,
      rank: 3,
      rankChange: 2,
      agents: [
        { name: 'Sarah Chen', agency: 'Ray White', photo: 'https://randomuser.me/api/portraits/women/44.jpg', score: 89, change: 2 },
        { name: 'Michael Torres', agency: 'McGrath', photo: 'https://randomuser.me/api/portraits/men/32.jpg', score: 85, change: -1 },
        { name: userName, agency: userAgency, photo: null, score: 72, change: 3, isYou: true },
        { name: 'Emma Wilson', agency: 'LJ Hooker', photo: 'https://randomuser.me/api/portraits/women/68.jpg', score: 68, change: 0 },
        { name: 'James O\'Brien', agency: 'Place', photo: 'https://randomuser.me/api/portraits/men/52.jpg', score: 65, change: -2 },
        { name: 'Lisa Park', agency: 'Harcourts', photo: 'https://randomuser.me/api/portraits/women/33.jpg', score: 61, change: 1 },
        { name: 'David Kim', agency: 'Belle Property', photo: 'https://randomuser.me/api/portraits/men/45.jpg', score: 58, change: 0 },
      ],
      pillars: [
        { name: 'Sales Volume', score: 78, maxScore: 100, icon: '💰', tip: 'Close 2 more deals to reach top tier', color: 'emerald' },
        { name: 'Days on Market', score: 82, maxScore: 100, icon: '⏱️', tip: 'Your average of 28 days beats suburb average of 35', color: 'blue' },
        { name: 'List to Sale Ratio', score: 65, maxScore: 100, icon: '📊', tip: 'Improve by 5% to match leader', color: 'amber' },
        { name: 'Online Presence', score: 45, maxScore: 100, icon: '🌐', tip: 'Post 3x more suburb content on socials', color: 'red' },
        { name: 'Reviews & Ratings', score: 88, maxScore: 100, icon: '⭐', tip: 'Excellent! Keep asking for reviews', color: 'purple' },
        { name: 'Market Activity', score: 70, maxScore: 100, icon: '📈', tip: 'Increase appraisal bookings by 20%', color: 'cyan' },
      ],
      fastestMovers: [
        { name: 'Lisa Park', change: '+12', reason: '3 new listings this week', photo: 'https://randomuser.me/api/portraits/women/33.jpg' },
        { name: 'David Kim', change: '+8', reason: 'Strong social media push', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
        { name: userName, change: '+3', reason: 'Consistent local content', photo: null, isYou: true },
      ],
      actionItems: [
        { priority: 'high', text: `Book 2 appraisals in ${suburb} this week`, impact: '+5 score points' },
        { priority: 'high', text: 'Post 3 suburb-specific social posts', impact: '+8 score points' },
        { priority: 'medium', text: 'Ask last 3 buyers for Google reviews', impact: '+3 score points' },
        { priority: 'medium', text: `Update your REA bio with ${suburb} stats`, impact: '+2 score points' },
        { priority: 'low', text: 'Sponsor local school newsletter', impact: 'Brand awareness' },
      ],
      dailyPlan: [
        { day: 'Mon', task: 'Door knock 10 homes near recent sale', done: false },
        { day: 'Tue', task: 'Post market update video', done: false },
        { day: 'Wed', task: 'Call 5 past appraisals for follow-up', done: false },
        { day: 'Thu', task: 'Host open home + collect leads', done: false },
        { day: 'Fri', task: 'Send suburb newsletter to database', done: false },
        { day: 'Sat', task: 'Open homes - 2 inspections minimum', done: false },
        { day: 'Sun', task: 'Review analytics & plan next week', done: false },
      ],
      contentIdeas: [
        { title: `${suburb} Market Update`, type: 'Video', description: 'Quick 60-second video on recent sales and what it means for sellers', icon: '🎥' },
        { title: 'Just Sold Success Story', type: 'Carousel', description: 'Before/after of recent sale with key stats', icon: '📸' },
        { title: `Living in ${suburb}`, type: 'Blog', description: 'Local guide: best cafes, schools, parks in the area', icon: '📝' },
      ],
    };
  };

  const handleGenerate = async () => {
    setStatus('loading');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setData(generateData(selectedSuburb));
    setStatus('ready');
  };

  const handleSuburbChange = (suburb: string) => {
    setSelectedSuburb(suburb);
    if (status === 'ready') {
      setData(generateData(suburb));
    }
  };

  return (
    <DemoLayout>
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Competitor Analysis</h1>
              <p className="text-sm text-gray-500 mt-0.5">See where you rank and how to beat your competitors in each suburb</p>
            </div>
            <div className="flex items-center space-x-3">
              <select 
                value={selectedSuburb}
                onChange={(e) => handleSuburbChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {SUBURBS.map(suburb => (
                  <option key={suburb} value={suburb}>{suburb}</option>
                ))}
              </select>
              <button 
                onClick={handleGenerate}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                <span>Generate Analysis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {status === 'empty' && (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analyze Your Competition</h3>
              <p className="text-gray-500 mb-6">Select a suburb to see how you rank against other agents. Get actionable insights to improve your position.</p>
              <button 
                onClick={handleGenerate}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Generate First Analysis
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {status === 'loading' && (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg className="w-10 h-10 text-emerald-600 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Competition...</h3>
              <p className="text-gray-500">Our AI is analyzing agent performance data. This usually takes 10-15 seconds.</p>
            </div>
          </div>
        )}

        {/* Results */}
        {status === 'ready' && data && (
          <div className="p-4">
            {/* Local Authority Score Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Your Local Authority Score</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-5xl font-bold">{data.score}</span>
                    <span className="text-2xl text-emerald-200 ml-1">/100</span>
                  </div>
                  <p className="text-emerald-100 mt-2">{data.suburb}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-emerald-100 text-sm">Suburb Rank:</span>
                    <span className="text-2xl font-bold">#{data.rank}</span>
                  </div>
                  <p className="text-emerald-200 text-sm">↑ Up {data.rankChange} spots this month</p>
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all duration-500" style={{ width: `${data.score}%` }}/>
              </div>
            </div>

            {/* Suburb Leaderboard */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Suburb Leaderboard</h3>
                  <span className="text-sm text-gray-500">Top agents in {selectedSuburb}</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {data.agents.map((agent, index) => (
                  <div key={agent.name} className={cn("flex items-center px-4 py-3", agent.isYou && "bg-primary/5")}>
                    <div className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mr-3",
                      index === 0 ? "bg-yellow-400 text-yellow-900" :
                      index === 1 ? "bg-gray-300 text-gray-700" :
                      index === 2 ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600"
                    )}>{index + 1}</div>
                    {agent.photo ? (
                      <img src={agent.photo} alt={agent.name} className="w-10 h-10 rounded-full mr-3" />
                    ) : (
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium mr-3">
                        {agent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{agent.name}</span>
                        {agent.isYou && <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded-full">You</span>}
                      </div>
                      <p className="text-sm text-gray-500">{agent.agency}</p>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-xs font-medium mb-1", agent.change > 0 ? "text-green-600" : agent.change < 0 ? "text-red-600" : "text-gray-400")}>
                        {agent.change > 0 ? `↑${agent.change}` : agent.change < 0 ? `↓${Math.abs(agent.change)}` : '–'}
                      </div>
                      <div className="text-lg font-bold text-gray-900">{agent.score}<span className="text-xs text-gray-400 ml-0.5">score</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pillar Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Score Breakdown by Pillar</h3>
                <p className="text-sm text-gray-500 mt-1">See where you're strong and where to improve</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                {data.pillars.map((pillar) => (
                  <div key={pillar.name} className="border border-gray-100 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{pillar.icon}</span>
                        <span className="font-medium text-gray-900">{pillar.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{pillar.score}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full mb-2">
                      <div className={cn("h-2 rounded-full", `bg-${pillar.color}-500`)} style={{ width: `${pillar.score}%` }}/>
                    </div>
                    <p className="text-xs text-gray-500">{pillar.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Two Column: Fastest Movers + Priority Actions */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Fastest Movers</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Agents gaining ground quickly</p>
                </div>
                <div className="p-4 space-y-3">
                  {data.fastestMovers.map((mover) => (
                    <div key={mover.name} className="flex items-center">
                      {mover.photo ? (
                        <img src={mover.photo} alt={mover.name} className="w-8 h-8 rounded-full mr-3" />
                      ) : (
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium mr-3">
                          {mover.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">{mover.name}</span>
                          {mover.isYou && <span className="ml-2 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded">You</span>}
                        </div>
                        <p className="text-xs text-gray-500">{mover.reason}</p>
                      </div>
                      <span className="text-green-600 font-bold">{mover.change}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Priority Actions</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Top things to do this week</p>
                </div>
                <div className="p-4 space-y-2">
                  {data.actionItems.map((item, i) => (
                    <div key={i} className="flex items-start space-x-2 text-sm">
                      <span className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                        item.priority === 'high' && "bg-red-500",
                        item.priority === 'medium' && "bg-yellow-500",
                        item.priority === 'low' && "bg-gray-400"
                      )}/>
                      <div className="flex-1">
                        <p className="text-gray-900">{item.text}</p>
                        <p className="text-xs text-gray-500">{item.impact}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7-Day Plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Your 7-Day Domination Plan</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">Daily tasks to climb the leaderboard</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {data.dailyPlan.map((d) => (
                    <div key={d.day} className="bg-gray-50 rounded-lg p-3 text-center">
                      <div className="text-sm font-bold text-gray-900 mb-2">{d.day}</div>
                      <p className="text-xs text-gray-600 leading-tight">{d.task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Ideas */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900">Content Ideas for This Suburb</h3>
                  </div>
                  <button className="text-sm text-primary hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    Regenerate Ideas
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">AI-generated content to boost your local authority</p>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                {data.contentIdeas.map((idea, i) => (
                  <div key={i} className="border border-gray-100 rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{idea.icon}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{idea.type}</span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1">{idea.title}</h4>
                    <p className="text-xs text-gray-500">{idea.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
}
