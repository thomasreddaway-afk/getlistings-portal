'use client';

import { DemoLayout } from '@/components/layout';
import { useState, useEffect } from 'react';
import { TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';

interface LeaderboardEntry {
  _id: string;
  position: number;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  totalPoints: number;
  agencyName?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(1);
  const [period, setPeriod] = useState('this-month');
  const perPage = 20;

  const loadLeaderboard = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token')
        : null;
      
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/user/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ page: pageNum, perPage }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch leaderboard: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.results) {
        setEntries(data.results);
        setTotal(data.total || data.results.length);
        setNumberOfPages(data.numberOfPages || 1);
        setPage(pageNum);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const getName = (entry: LeaderboardEntry) => {
    return `${entry.firstName} ${entry.lastName}`.trim();
  };

  const getPhoto = (entry: LeaderboardEntry) => {
    if (!entry.profilePicture || entry.profilePicture.trim() === '') return null;
    return entry.profilePicture;
  };

  const getInitial = (entry: LeaderboardEntry) => {
    return entry.firstName?.charAt(0) || '?';
  };

  // Top 3 for podium
  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);

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
              <span className="text-xs text-green-500 animate-pulse">● LIVE</span>
              <select 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              >
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-quarter">This Quarter</option>
                <option value="this-year">This Year</option>
                <option value="all-time">All Time</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
              <button onClick={() => loadLeaderboard(1)} className="mt-2 text-sm text-red-600 underline">Retry</button>
            </div>
          ) : loading && entries.length === 0 ? (
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 pt-16 mb-6 shadow-xl flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
            </div>
          ) : podium.length > 0 ? (
            <>
              {/* Top 3 Podium - Dark gradient design matching demo.html */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-10 pt-16 mb-6 shadow-xl">
                <div className="flex items-end justify-center gap-8 md:gap-12">
                  {/* 2nd Place */}
                  {podium[1] && (
                    <div className="text-center w-48">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full border-4 border-gray-400 overflow-hidden mx-auto shadow-lg bg-gray-700">
                          {getPhoto(podium[1]) ? (
                            <img src={getPhoto(podium[1])!} alt={getName(podium[1])} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl font-bold">
                              {getInitial(podium[1])}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-slate-900 text-sm font-bold shadow-lg border-2 border-white">2</div>
                      </div>
                      <div className="bg-gray-400/20 backdrop-blur rounded-xl p-4">
                        <p className="font-semibold text-white whitespace-nowrap">{getName(podium[1])}</p>
                        <p className="text-xs text-gray-400 mt-1">{podium[1].agencyName || 'Real Estate Agent'}</p>
                        <p className="text-3xl font-bold text-white mt-3">{podium[1].totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 1st Place */}
                  {podium[0] && (
                    <div className="text-center w-52">
                      <div className="relative mb-4">
                        {/* Crown */}
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                          <svg className="w-10 h-10 text-amber-400 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                          </svg>
                        </div>
                        <div className="w-28 h-28 rounded-full border-4 border-amber-400 overflow-hidden mx-auto shadow-xl ring-4 ring-amber-400/30 bg-gray-700">
                          {getPhoto(podium[0]) ? (
                            <img src={getPhoto(podium[0])!} alt={getName(podium[0])} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-400 text-3xl font-bold">
                              {getInitial(podium[0])}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-900 text-base font-bold shadow-lg border-2 border-white">1</div>
                      </div>
                      <div className="bg-amber-400/20 backdrop-blur rounded-xl p-5 border border-amber-400/30">
                        <p className="font-bold text-white text-xl">{getName(podium[0])}</p>
                        <p className="text-sm text-amber-200 mt-1">{podium[0].agencyName || 'Real Estate Agent'}</p>
                        <p className="text-5xl font-black text-white mt-3">{podium[0].totalPoints.toLocaleString()}</p>
                        <p className="text-sm text-amber-200">points</p>
                      </div>
                    </div>
                  )}
                  
                  {/* 3rd Place */}
                  {podium[2] && (
                    <div className="text-center w-48">
                      <div className="relative mb-4">
                        <div className="w-20 h-20 rounded-full border-4 border-amber-700 overflow-hidden mx-auto shadow-lg bg-gray-700">
                          {getPhoto(podium[2]) ? (
                            <img src={getPhoto(podium[2])!} alt={getName(podium[2])} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-amber-600 text-2xl font-bold">
                              {getInitial(podium[2])}
                            </div>
                          )}
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-7 h-7 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg border-2 border-white">3</div>
                      </div>
                      <div className="bg-amber-700/20 backdrop-blur rounded-xl p-4">
                        <p className="font-semibold text-white whitespace-nowrap">{getName(podium[2])}</p>
                        <p className="text-xs text-gray-400 mt-1">{podium[2].agencyName || 'Real Estate Agent'}</p>
                        <p className="text-3xl font-bold text-white mt-3">{podium[2].totalPoints.toLocaleString()}</p>
                        <p className="text-xs text-gray-400">points</p>
                      </div>
                    </div>
                  )}
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
                
                {/* Leaderboard rows */}
                <div>
                  {rest.map((entry) => (
                    <div key={entry._id} className="px-6 py-4 grid grid-cols-12 gap-4 items-center border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="col-span-1">
                        <span className="text-sm font-medium text-gray-500">{entry.position}</span>
                      </div>
                      <div className="col-span-9">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                            {getPhoto(entry) ? (
                              <img src={getPhoto(entry)!} alt={getName(entry)} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                                {getInitial(entry)}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{getName(entry)}</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-sm font-bold text-gray-900">{entry.totalPoints.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 ml-1">pts</span>
                      </div>
                    </div>
                  ))}
                  
                  {rest.length === 0 && !loading && (
                    <div className="px-6 py-8 text-center text-gray-500 text-sm">
                      No more agents to display
                    </div>
                  )}
                </div>
                
                {/* Pagination */}
                {numberOfPages > 1 && (
                  <div className="border-t border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        Showing <span className="font-medium">{(page - 1) * perPage + 1}-{Math.min(page * perPage, total)}</span> of <span className="font-medium">{total.toLocaleString()}</span> agents
                      </p>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => loadLeaderboard(page - 1)}
                          disabled={page <= 1 || loading}
                          className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Previous
                        </button>
                        <span className="text-sm text-gray-600 font-medium">Page {page} of {numberOfPages}</span>
                        <button
                          onClick={() => loadLeaderboard(page + 1)}
                          disabled={page >= numberOfPages || loading}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          Next
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* How Points Work */}
              <div className="mt-6 bg-gradient-to-r from-slate-50 to-gray-50 border border-gray-200 rounded-xl p-5">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">How Points Are Calculated</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Points are awarded for lead unlocks, successful contacts, listings won, and engagement with the platform.
                      The leaderboard resets monthly.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              No leaderboard data available.
            </div>
          )}
        </div>
      </div>
    </DemoLayout>
  );
}
