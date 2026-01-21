'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect } from 'react';
import { RefreshCw, Trophy, TrendingUp, Medal } from 'lucide-react';

interface LeaderboardEntry {
  _id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  agencyName?: string;
  agency?: string;
  points?: number;
  score?: number;
  rank?: number;
  photo?: string;
  profileImage?: string;
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadLeaderboard = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest<{ results: LeaderboardEntry[]; total: number }>('/user/leaderboard', 'POST', {
        page: pageNum,
        perPage: 50
      });
      
      if (response.results) {
        setEntries(response.results);
        setTotal(response.total || response.results.length);
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
    if (entry.name) return entry.name;
    if (entry.firstName) return `${entry.firstName} ${entry.lastName || ''}`.trim();
    return 'Unknown';
  };

  const getAgency = (entry: LeaderboardEntry) => {
    return entry.agencyName || entry.agency || 'Independent';
  };

  const getPoints = (entry: LeaderboardEntry) => {
    return entry.points || entry.score || 0;
  };

  const getPhoto = (entry: LeaderboardEntry) => {
    return entry.photo || entry.profileImage;
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
              <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Top performing agents this month
              </p>
            </div>
            <button
              onClick={() => loadLeaderboard(1)}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={() => loadLeaderboard(1)} className="mt-2 text-sm text-red-600 underline">Retry</button>
          </div>
        )}

        <div className="p-4 space-y-4">
          {/* Podium - Top 3 */}
          {loading ? (
            <div className="bg-white rounded-xl p-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : podium.length > 0 ? (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Trophy className="w-6 h-6 text-amber-500" />
                <h2 className="text-lg font-bold text-gray-900">Top Performers</h2>
              </div>
              
              <div className="flex items-end justify-center space-x-4">
                {/* 2nd Place */}
                {podium[1] && (
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-gray-300 overflow-hidden mb-2">
                      {getPhoto(podium[1]) ? (
                        <img src={getPhoto(podium[1])} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl font-bold">
                          {getName(podium[1]).charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="bg-gray-300 text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mb-2">2</div>
                    <p className="text-sm font-medium text-gray-900 text-center">{getName(podium[1])}</p>
                    <p className="text-xs text-gray-500 text-center">{getAgency(podium[1])}</p>
                    <p className="text-lg font-bold text-gray-600 mt-1">{getPoints(podium[1]).toLocaleString()}</p>
                  </div>
                )}
                
                {/* 1st Place */}
                {podium[0] && (
                  <div className="flex flex-col items-center -mt-4">
                    <div className="w-20 h-20 rounded-full bg-amber-100 border-4 border-amber-400 overflow-hidden mb-2 shadow-lg">
                      {getPhoto(podium[0]) ? (
                        <img src={getPhoto(podium[0])} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-500 text-2xl font-bold">
                          {getName(podium[0]).charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="bg-amber-400 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold mb-2">1</div>
                    <p className="text-base font-bold text-gray-900 text-center">{getName(podium[0])}</p>
                    <p className="text-xs text-gray-500 text-center">{getAgency(podium[0])}</p>
                    <p className="text-xl font-bold text-amber-600 mt-1">{getPoints(podium[0]).toLocaleString()}</p>
                  </div>
                )}
                
                {/* 3rd Place */}
                {podium[2] && (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-amber-50 border-4 border-amber-200 overflow-hidden mb-2">
                      {getPhoto(podium[2]) ? (
                        <img src={getPhoto(podium[2])} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-amber-400 text-lg font-bold">
                          {getName(podium[2]).charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="bg-amber-200 text-amber-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mb-2">3</div>
                    <p className="text-sm font-medium text-gray-900 text-center">{getName(podium[2])}</p>
                    <p className="text-xs text-gray-500 text-center">{getAgency(podium[2])}</p>
                    <p className="text-lg font-bold text-amber-500 mt-1">{getPoints(podium[2]).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500">
              No leaderboard data available.
            </div>
          )}

          {/* Rankings Table */}
          {rest.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Agent</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Agency</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rest.map((entry, index) => (
                    <tr key={entry._id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 4}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                            {getPhoto(entry) ? (
                              <img src={getPhoto(entry)} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                                {getName(entry).charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{getName(entry)}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">{getAgency(entry)}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-gray-900">{getPoints(entry).toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* How Points Work */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start space-x-3">
              <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">How are points calculated?</p>
                <p className="text-xs text-blue-700 mt-1">
                  Points are awarded for lead unlocks, successful contacts, listings won, and engagement with the platform.
                  The leaderboard resets monthly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
