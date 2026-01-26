'use client';

import { useState } from 'react';
import { DemoLayout } from '@/components/layout';
import { 
  TrendingUp, Target, Calendar, Lightbulb, Zap, 
  ChevronUp, ChevronDown, Minus, ClipboardCheck, Video, FileText,
  MessageSquare, RefreshCw, Loader2, Sparkles
} from 'lucide-react';

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

interface FastMover {
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

interface DayPlan {
  day: string;
  task: string;
  done: boolean;
}

interface ContentIdea {
  type: string;
  title: string;
  description: string;
  engagement: string;
}

interface CompetitorData {
  suburb: string;
  authorityScore: number;
  rank: number;
  totalAgents: number;
  rankChange: number;
  leaderboard: Agent[];
  pillars: Pillar[];
  fastestMovers: FastMover[];
  actionItems: ActionItem[];
  dailyPlan: DayPlan[];
  contentIdeas: ContentIdea[];
}

const mockSuburbs = ['Ashgrove', 'Paddington', 'Bardon', 'The Gap', 'Red Hill', 'Kelvin Grove', 'Auchenflower', 'Toowong'];

function generateMockData(suburb: string): CompetitorData {
  const agents: Agent[] = [
    { name: 'Sarah Chen', agency: 'Ray White', photo: 'https://randomuser.me/api/portraits/women/44.jpg', score: 89, change: 2 },
    { name: 'Michael Torres', agency: 'McGrath', photo: 'https://randomuser.me/api/portraits/men/32.jpg', score: 85, change: -1 },
    { name: 'Tom Reddaway', agency: 'McGrath', photo: null, score: 72, change: 3, isYou: true },
    { name: 'Emma Wilson', agency: 'LJ Hooker', photo: 'https://randomuser.me/api/portraits/women/68.jpg', score: 68, change: 0 },
    { name: "James O'Brien", agency: 'Place', photo: 'https://randomuser.me/api/portraits/men/52.jpg', score: 65, change: -2 },
    { name: 'Lisa Park', agency: 'Harcourts', photo: 'https://randomuser.me/api/portraits/women/33.jpg', score: 61, change: 1 },
    { name: 'David Kim', agency: 'Belle Property', photo: 'https://randomuser.me/api/portraits/men/45.jpg', score: 58, change: 0 },
  ];

  const pillars: Pillar[] = [
    { name: 'Sales Volume', score: 78, maxScore: 100, icon: '💰', tip: 'Close 2 more deals to reach top tier', color: 'emerald' },
    { name: 'Days on Market', score: 82, maxScore: 100, icon: '⏱️', tip: 'Your average of 28 days beats suburb average of 35', color: 'blue' },
    { name: 'List to Sale Ratio', score: 65, maxScore: 100, icon: '📊', tip: 'Improve by 5% to match leader', color: 'amber' },
    { name: 'Online Presence', score: 45, maxScore: 100, icon: '🌐', tip: 'Post 3x more suburb content on socials', color: 'red' },
    { name: 'Reviews & Ratings', score: 88, maxScore: 100, icon: '⭐', tip: 'Excellent! Keep asking for reviews', color: 'purple' },
    { name: 'Market Activity', score: 70, maxScore: 100, icon: '📈', tip: 'Increase appraisal bookings by 20%', color: 'cyan' },
  ];

  const fastestMovers: FastMover[] = [
    { name: 'Lisa Park', change: '+12', reason: '3 new listings this week', photo: 'https://randomuser.me/api/portraits/women/33.jpg' },
    { name: 'David Kim', change: '+8', reason: 'Strong social media push', photo: 'https://randomuser.me/api/portraits/men/45.jpg' },
    { name: 'Tom Reddaway', change: '+3', reason: 'Consistent local content', photo: null, isYou: true },
  ];

  const actionItems: ActionItem[] = [
    { priority: 'high', text: `Book 2 appraisals in ${suburb} this week`, impact: '+5 score points' },
    { priority: 'high', text: 'Post 3 suburb-specific social posts', impact: '+8 score points' },
    { priority: 'medium', text: 'Ask last 3 buyers for Google reviews', impact: '+3 score points' },
    { priority: 'medium', text: `Update your REA bio with ${suburb} stats`, impact: '+2 score points' },
    { priority: 'low', text: 'Sponsor local school newsletter', impact: 'Brand awareness' },
  ];

  const dailyPlan: DayPlan[] = [
    { day: 'Mon', task: 'Door knock 10 homes near recent sale', done: false },
    { day: 'Tue', task: 'Post market update video', done: false },
    { day: 'Wed', task: 'Call 5 past appraisals for follow-up', done: false },
    { day: 'Thu', task: 'Host open home + collect leads', done: false },
    { day: 'Fri', task: 'Send suburb newsletter to database', done: false },
    { day: 'Sat', task: 'Open homes - 2 inspections minimum', done: false },
    { day: 'Sun', task: 'Review analytics & plan next week', done: false },
  ];

  const contentIdeas: ContentIdea[] = [
    { type: 'video', title: `${suburb} Market Update - January 2026`, description: 'Cover recent sales, price trends, and what to expect', engagement: 'High' },
    { type: 'post', title: `5 Hidden Gems in ${suburb}`, description: 'Best cafes, parks, and schools locals love', engagement: 'Very High' },
    { type: 'story', title: 'Just Listed: [Address] Virtual Tour', description: 'Quick walkthrough with key features', engagement: 'Medium' },
    { type: 'article', title: `Is Now the Right Time to Sell in ${suburb}?`, description: 'Data-driven analysis for sellers', engagement: 'High' },
    { type: 'reel', title: `${suburb} in 60 Seconds`, description: 'Fast-paced tour of the suburb highlights', engagement: 'Very High' },
    { type: 'post', title: 'Sold Above Asking! [Case Study]', description: 'How we achieved $X above reserve', engagement: 'High' },
  ];

  return {
    suburb,
    authorityScore: 72,
    rank: 3,
    totalAgents: agents.length,
    rankChange: 2,
    leaderboard: agents,
    pillars,
    fastestMovers,
    actionItems,
    dailyPlan,
    contentIdeas,
  };
}

export default function CompetitorAnalysisPage() {
  const [selectedSuburb, setSelectedSuburb] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<CompetitorData | null>(null);
  const [dailyPlanState, setDailyPlanState] = useState<boolean[]>([]);

  const generateAnalysis = async () => {
    const suburb = selectedSuburb || mockSuburbs[0];
    if (!selectedSuburb) setSelectedSuburb(suburb);
    
    setIsLoading(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockData = generateMockData(suburb);
    setData(mockData);
    setDailyPlanState(mockData.dailyPlan.map(() => false));
    setIsLoading(false);
  };

  const toggleDayDone = (index: number) => {
    setDailyPlanState(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; bar: string }> = {
      emerald: { bg: 'bg-emerald-100', bar: 'bg-emerald-500' },
      blue: { bg: 'bg-blue-100', bar: 'bg-blue-500' },
      amber: { bg: 'bg-amber-100', bar: 'bg-amber-500' },
      red: { bg: 'bg-red-100', bar: 'bg-red-500' },
      purple: { bg: 'bg-purple-100', bar: 'bg-purple-500' },
      cyan: { bg: 'bg-cyan-100', bar: 'bg-cyan-500' },
    };
    return colors[color] || colors.blue;
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
      case 'reel':
        return <Video className="w-4 h-4" />;
      case 'article':
        return <FileText className="w-4 h-4" />;
      case 'story':
      case 'post':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <DemoLayout currentPage="competitor-analysis">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Competitor Analysis</h1>
              <p className="text-sm text-gray-500 mt-0.5">See where you rank and how to beat your competitors in each suburb</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedSuburb}
                onChange={(e) => {
                  setSelectedSuburb(e.target.value);
                  if (e.target.value && data) {
                    generateAnalysis();
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select a suburb...</option>
                {mockSuburbs.map(suburb => (
                  <option key={suburb} value={suburb}>{suburb}</option>
                ))}
              </select>
              <button
                onClick={generateAnalysis}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>Generate Analysis</span>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {!isLoading && !data && (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analyze Your Competition</h3>
              <p className="text-gray-500 mb-6">Select a suburb from your subscriptions to see how you rank against other agents. Get actionable insights to improve your position.</p>
              <button
                onClick={generateAnalysis}
                className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <Zap className="w-5 h-5 mr-2" />
                Generate First Analysis
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Analyzing Competition...</h3>
              <p className="text-gray-500">Our AI is analyzing agent performance data for your selected suburbs. This usually takes 10-15 seconds.</p>
            </div>
          </div>
        )}

        {/* Results */}
        {!isLoading && data && (
          <div className="p-4">
            {/* Local Authority Score Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-6 text-white mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Your Local Authority Score</p>
                  <div className="flex items-baseline mt-1">
                    <span className="text-5xl font-bold">{data.authorityScore}</span>
                    <span className="text-2xl text-emerald-200 ml-1">/100</span>
                  </div>
                  <p className="text-emerald-100 mt-2">{data.suburb}, QLD</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-emerald-100 text-sm">Suburb Rank:</span>
                    <span className="text-2xl font-bold">#{data.rank}</span>
                  </div>
                  <p className="text-emerald-200 text-sm">
                    {data.rankChange >= 0 ? '↑' : '↓'} {data.rankChange >= 0 ? 'Up' : 'Down'} {Math.abs(data.rankChange)} spots this month
                  </p>
                </div>
              </div>
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500" 
                  style={{ width: `${data.authorityScore}%` }}
                />
              </div>
            </div>

            {/* Suburb Leaderboard */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Suburb Leaderboard</h3>
                  <span className="text-sm text-gray-500">Top agents in {data.suburb}</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {data.leaderboard.map((agent, index) => {
                  const photo = agent.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&background=random`;
                  const rankBg = index === 0 ? 'bg-amber-400 text-white' : index === 1 ? 'bg-gray-300 text-white' : index === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-600';
                  
                  return (
                    <div 
                      key={agent.name}
                      className={`px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${agent.isYou ? 'bg-amber-50 border-l-4 border-amber-400' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-8 h-8 ${rankBg} rounded-full flex items-center justify-center text-sm font-bold`}>
                          {index + 1}
                        </span>
                        <img src={photo} alt={agent.name} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {agent.name}
                            {agent.isYou && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2">You</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">{agent.agency}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-medium ${agent.change > 0 ? 'text-green-600' : agent.change < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {agent.change > 0 ? <ChevronUp className="w-4 h-4 inline" /> : agent.change < 0 ? <ChevronDown className="w-4 h-4 inline" /> : <Minus className="w-4 h-4 inline" />}
                          {Math.abs(agent.change)}
                        </span>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">{agent.score}</p>
                          <p className="text-xs text-gray-500">score</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pillar Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Score Breakdown by Pillar</h3>
                <p className="text-sm text-gray-500 mt-1">See where you&apos;re strong and where to improve</p>
              </div>
              <div className="p-4 grid grid-cols-2 gap-4">
                {data.pillars.map((pillar) => {
                  const colors = getColorClasses(pillar.color);
                  return (
                    <div key={pillar.name} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{pillar.icon}</span>
                          <span className="font-medium text-gray-900">{pillar.name}</span>
                        </div>
                        <span className="text-lg font-bold text-gray-900">{pillar.score}</span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2 mb-2">
                        <div className={`${colors.bar} rounded-full h-2 transition-all`} style={{ width: `${pillar.score}%` }} />
                      </div>
                      <p className="text-xs text-gray-500">{pillar.tip}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* Fastest Movers */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Fastest Movers</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Agents gaining ground quickly</p>
                </div>
                <div className="p-4 space-y-3">
                  {data.fastestMovers.map((mover) => {
                    const photo = mover.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(mover.name)}&background=random`;
                    return (
                      <div key={mover.name} className={`flex items-center gap-3 p-3 rounded-lg ${mover.isYou ? 'bg-amber-50' : 'bg-gray-50'}`}>
                        <img src={photo} alt={mover.name} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {mover.name}
                            {mover.isYou && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full ml-2">You</span>}
                          </p>
                          <p className="text-xs text-gray-500">{mover.reason}</p>
                        </div>
                        <span className="text-green-600 font-bold">{mover.change}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Items */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <ClipboardCheck className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Priority Actions</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Top things to do this week</p>
                </div>
                <div className="p-4 space-y-2">
                  {data.actionItems.map((item, index) => {
                    const priorityColors = {
                      high: 'bg-red-100 text-red-700',
                      medium: 'bg-amber-100 text-amber-700',
                      low: 'bg-gray-100 text-gray-600',
                    };
                    return (
                      <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityColors[item.priority]}`}>
                          {item.priority.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{item.text}</p>
                          <p className="text-xs text-gray-500">{item.impact}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 7-Day Domination Plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Your 7-Day Domination Plan</h3>
                </div>
                <p className="text-sm text-gray-500 mt-1">Daily tasks to climb the leaderboard</p>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 gap-2">
                  {data.dailyPlan.map((day, index) => (
                    <div
                      key={day.day}
                      onClick={() => toggleDayDone(index)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        dailyPlanState[index] 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-gray-900">{day.day}</span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          dailyPlanState[index] ? 'border-green-500 bg-green-500' : 'border-gray-300'
                        }`}>
                          {dailyPlanState[index] && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                      <p className={`text-xs ${dailyPlanState[index] ? 'text-green-700 line-through' : 'text-gray-600'}`}>
                        {day.task}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Ideas */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Content Ideas for This Suburb</h3>
                  </div>
                  <button className="text-sm text-red-600 hover:underline flex items-center">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Regenerate Ideas
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">AI-generated content to boost your local authority</p>
              </div>
              <div className="p-4 grid grid-cols-3 gap-4">
                {data.contentIdeas.map((idea, index) => {
                  const engagementColors: Record<string, string> = {
                    'Very High': 'bg-green-100 text-green-700',
                    'High': 'bg-blue-100 text-blue-700',
                    'Medium': 'bg-gray-100 text-gray-600',
                  };
                  return (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                          {getContentIcon(idea.type)}
                          {idea.type}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${engagementColors[idea.engagement] || engagementColors['Medium']}`}>
                          {idea.engagement}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{idea.title}</h4>
                      <p className="text-xs text-gray-500">{idea.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
}
