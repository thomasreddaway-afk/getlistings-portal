'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { TrendingUp, BarChart2, DollarSign, Info, ChevronUp } from 'lucide-react';

// Mock leaderboard data
const mockTopAgents = [
  {
    rank: 1,
    name: 'Darren Cooke',
    agency: 'McGrath Estate Agents',
    points: 766,
    photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  },
  {
    rank: 2,
    name: 'Sheridan Melrose',
    agency: 'Ray White Double Bay',
    points: 526,
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
  },
  {
    rank: 3,
    name: 'Billy Clarke',
    agency: 'LJ Hooker Bondi',
    points: 226,
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
];

const mockLeaderboardRanks = [
  { rank: 4, name: 'Sarah Mitchell', agency: 'Belle Property', points: 198 },
  { rank: 5, name: 'James Thompson', agency: 'Raine & Horne', points: 185 },
  { rank: 6, name: 'Emma Wilson', agency: 'PRD Nationwide', points: 172 },
  { rank: 7, name: 'Michael Chen', agency: 'First National', points: 168 },
  { rank: 8, name: 'Rebecca Jones', agency: 'Harcourts', points: 156 },
  { rank: 9, name: 'David Brown', agency: 'Coldwell Banker', points: 147 },
  { rank: 10, name: 'Jennifer Lee', agency: 'Century 21', points: 139 },
  { rank: 11, name: 'Andrew Smith', agency: 'Richardson & Wrench', points: 125 },
  { rank: 12, name: 'You', agency: 'Your Agency', points: 111, isCurrentUser: true },
  { rank: 13, name: 'Thomas Roberts', agency: 'Laing+Simmons', points: 102 },
];

export default function LeaderboardPage() {
  const [timeRange, setTimeRange] = useState('This Month');

  return (
    <DemoLayout currentPage="leaderboard">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Agent Leaderboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">Top performing agents this month</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
                <option>All Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Top 3 Podium */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 pt-16 mb-6 shadow-xl">
            <div className="flex items-end justify-center gap-8 md:gap-12">
              {/* 2nd Place */}
              <div className="text-center w-48">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-gray-400 overflow-hidden mx-auto shadow-lg bg-gray-700">
                    <img 
                      src={mockTopAgents[1].photo} 
                      alt={mockTopAgents[1].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-slate-900 text-sm font-bold shadow-lg border-2 border-white">
                    2
                  </div>
                </div>
                <div className="bg-gray-400/20 backdrop-blur rounded-xl p-4">
                  <p className="font-semibold text-white whitespace-nowrap">{mockTopAgents[1].name}</p>
                  <p className="text-xs text-gray-400 mt-1">{mockTopAgents[1].agency}</p>
                  <p className="text-3xl font-bold text-white mt-3">{mockTopAgents[1].points}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="text-center w-52">
                <div className="relative mb-4">
                  {/* Crown */}
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                    <svg className="w-10 h-10 text-amber-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                    </svg>
                  </div>
                  <div className="w-28 h-28 rounded-full border-4 border-amber-400 overflow-hidden mx-auto shadow-xl ring-4 ring-amber-400/30 bg-gray-700">
                    <img 
                      src={mockTopAgents[0].photo} 
                      alt={mockTopAgents[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 text-base font-bold shadow-lg border-2 border-white">
                    1
                  </div>
                </div>
                <div className="bg-amber-400/20 backdrop-blur rounded-xl p-5 border border-amber-400/30">
                  <p className="font-bold text-white text-xl">{mockTopAgents[0].name}</p>
                  <p className="text-sm text-amber-200 mt-1">{mockTopAgents[0].agency}</p>
                  <p className="text-5xl font-black text-white mt-3">{mockTopAgents[0].points}</p>
                  <p className="text-sm text-amber-200">points</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="text-center w-48">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-full border-4 border-amber-700 overflow-hidden mx-auto shadow-lg bg-gray-700">
                    <img 
                      src={mockTopAgents[2].photo} 
                      alt={mockTopAgents[2].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white">
                    3
                  </div>
                </div>
                <div className="bg-amber-700/20 backdrop-blur rounded-xl p-4">
                  <p className="font-semibold text-white whitespace-nowrap">{mockTopAgents[2].name}</p>
                  <p className="text-xs text-gray-400 mt-1">{mockTopAgents[2].agency}</p>
                  <p className="text-3xl font-bold text-white mt-3">{mockTopAgents[2].points}</p>
                  <p className="text-xs text-gray-400">points</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rankings Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-1">Rank</div>
              <div className="col-span-9">Agent</div>
              <div className="col-span-2 text-right">Points</div>
            </div>

            {/* Leaderboard Rows */}
            <div className="divide-y divide-gray-100">
              {mockLeaderboardRanks.map((agent) => (
                <div 
                  key={agent.rank}
                  className={`px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors ${
                    agent.isCurrentUser ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="col-span-1">
                    <span className={`text-lg font-bold ${
                      agent.rank <= 10 ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      #{agent.rank}
                    </span>
                  </div>
                  <div className="col-span-9 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-medium ${agent.isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                        {agent.name}
                        {agent.isCurrentUser && (
                          <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">You</span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500">{agent.agency}</p>
                    </div>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-lg font-bold text-gray-900">{agent.points}</span>
                    <span className="text-sm text-gray-500 ml-1">pts</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">1-10</span> of <span className="font-medium">247</span> agents
                </p>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    ← Previous
                  </button>
                  <span className="text-sm text-gray-600 font-medium">Page 1</span>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Your Rank</p>
                  <p className="text-2xl font-bold text-gray-900">#12</p>
                </div>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2 flex items-center">
                <ChevronUp className="w-3 h-3 mr-1" />
                Up 3 spots this week
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Points to #11</p>
                  <p className="text-2xl font-bold text-gray-900">14</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">1 more sale to overtake</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">+34</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">points earned</p>
            </div>
          </div>

          {/* Points Info */}
          <div className="mt-6 bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl p-5">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">How Points Are Calculated</p>
                <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-600">Appraisal booked: <strong>5 pts</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-gray-600">Property listed: <strong>15 pts</strong></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    <span className="text-gray-600">Property sold: <strong>25 pts</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
