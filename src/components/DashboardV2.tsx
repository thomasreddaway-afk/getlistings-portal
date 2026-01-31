'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Phone, 
  Mail, 
  TrendingUp, 
  MapPin, 
  Lock,
  ChevronRight,
  Zap,
  Target,
  Trophy,
  Flame,
  ArrowRight,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  Circle,
  AlertTriangle
} from 'lucide-react';

interface Lead {
  _id: string;
  streetAddress: string;
  suburb: string;
  sellingScore: number;
  salePrice?: string;
  garageSale?: boolean;
  listedForSale?: boolean;
  listedForRent?: boolean;
  requested?: boolean;
  neighbourSold?: boolean;
  recentlySold?: boolean;
  socialTag?: boolean;
  fsboListing?: boolean;
  updatedAt: string;
  owner1Name?: string;
  bed?: number;
  bath?: number;
  car?: number;
}

interface DashboardMetrics {
  unLockedLeadsCount?: number;
  subscribedSuburbs?: number;
  leaderboardPosition?: number;
}

interface DashboardV2Props {
  user: any;
  metrics: DashboardMetrics | null;
  hotLeads: Lead[];
  allLeads: Lead[];
  loading: boolean;
  greeting: string;
}

// Social proof wins ticker data
const WINS_TICKER = [
  { agent: 'Sarah M.', action: 'just listed', address: '12 Brown St', suburb: 'Paddington', time: '2h ago' },
  { agent: 'Michael T.', action: 'booked appraisal at', address: '45 Ocean Pde', suburb: 'Manly', time: '3h ago' },
  { agent: 'Jessica L.', action: 'won listing at', address: '8 Park Ave', suburb: 'Mosman', time: '5h ago' },
  { agent: 'David K.', action: 'unlocked 15 leads in', address: '', suburb: 'Bondi', time: '6h ago' },
  { agent: 'Emma R.', action: 'sent 20 letters to', address: '', suburb: 'Newtown', time: '8h ago' },
];

function calculateTotalCommission(leads: Lead[]): number {
  return leads.reduce((total, lead) => {
    if (!lead.salePrice) return total;
    const price = parseFloat(lead.salePrice.replace(/[$,]/g, ''));
    if (isNaN(price)) return total;
    return total + (price * 0.02); // 2% commission
  }, 0);
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  return `$${Math.round(amount).toLocaleString()}`;
}

function getActionForLead(lead: Lead): { action: string; type: 'call' | 'mail' | 'visit'; priority: 'high' | 'medium' | 'low' } {
  if (lead.requested) {
    return { action: 'Call Now - They requested a valuation!', type: 'call', priority: 'high' };
  }
  if (lead.sellingScore >= 80) {
    return { action: 'Call - High selling intent detected', type: 'call', priority: 'high' };
  }
  if (lead.neighbourSold) {
    return { action: 'Send Letter - Neighbour just sold', type: 'mail', priority: 'medium' };
  }
  if (lead.garageSale) {
    return { action: 'Door Knock - Garage sale = decluttering', type: 'visit', priority: 'medium' };
  }
  return { action: 'Add to mail campaign', type: 'mail', priority: 'low' };
}

export function DashboardV2({ user, metrics, hotLeads, allLeads, loading, greeting }: DashboardV2Props) {
  const [tickerIndex, setTickerIndex] = useState(0);
  const [animateCommission, setAnimateCommission] = useState(false);
  
  const totalCommission = calculateTotalCommission(allLeads);
  const firstName = (user as any)?.firstName || user?.first_name || 'there';
  
  // Ticker animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % WINS_TICKER.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Commission animation on mount
  useEffect(() => {
    setAnimateCommission(true);
    const timeout = setTimeout(() => setAnimateCommission(false), 1000);
    return () => clearTimeout(timeout);
  }, [totalCommission]);

  // Calculate pipeline stats
  const pipelineStats = {
    identified: allLeads.length,
    contacted: Math.floor(allLeads.length * 0.15), // Placeholder - would come from API
    appraisals: Math.floor(allLeads.length * 0.05),
    listed: Math.floor(allLeads.length * 0.02),
  };

  // Get top missions (actionable leads)
  const missions = hotLeads.slice(0, 4).map(lead => ({
    ...lead,
    ...getActionForLead(lead),
  }));

  if (loading) {
    return (
      <div className="flex-1 bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* ===== MONEY PULSE HEADER ===== */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            {/* Left: Greeting */}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {greeting}, {firstName}
              </h1>
              <p className="text-gray-400 text-sm mt-0.5 flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>AI actively monitoring {metrics?.subscribedSuburbs || 0} suburbs</span>
              </p>
            </div>
            
            {/* Right: Commission Counter */}
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Potential Commission Unlocked</p>
              <p className={`text-3xl font-black text-green-400 transition-transform ${animateCommission ? 'scale-110' : 'scale-100'}`}>
                {formatCurrency(totalCommission)}
              </p>
            </div>
          </div>
        </div>
        
        {/* Wins Ticker */}
        <div className="bg-green-500/10 border-t border-green-500/20 px-6 py-2 overflow-hidden">
          <div className="flex items-center space-x-2 text-sm">
            <Trophy className="w-4 h-4 text-green-400 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-green-300 whitespace-nowrap animate-pulse">
                <span className="font-semibold">{WINS_TICKER[tickerIndex].agent}</span>
                {' '}{WINS_TICKER[tickerIndex].action}{' '}
                <span className="text-white font-medium">
                  {WINS_TICKER[tickerIndex].address} {WINS_TICKER[tickerIndex].suburb}
                </span>
                {' '}
                <span className="text-gray-500">• {WINS_TICKER[tickerIndex].time}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT: 3 COLUMN GRID ===== */}
      <div className="p-6">
        <div className="grid grid-cols-3 gap-6">
          
          {/* ===== COLUMN 1: THE GRIND (Daily Missions) ===== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-green-400" />
                <span>Daily Missions</span>
              </h2>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                {missions.length} TO-DO
              </span>
            </div>
            
            {/* Mission Cards - Glassmorphism Style */}
            <div className="space-y-3">
              {missions.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center">
                  <p className="text-gray-400">No missions yet. Subscribe to suburbs to get started.</p>
                  <Link href="/settings" className="inline-block mt-3 px-4 py-2 bg-green-500 text-black font-bold rounded-lg text-sm">
                    Add Suburbs
                  </Link>
                </div>
              ) : (
                missions.map((mission, idx) => (
                  <div 
                    key={mission._id}
                    className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-4 transition-all hover:bg-white/10 hover:scale-[1.02] cursor-pointer ${
                      mission.priority === 'high' 
                        ? 'border-green-500/50 shadow-lg shadow-green-500/10' 
                        : 'border-white/10'
                    }`}
                  >
                    {/* Priority Badge */}
                    {mission.priority === 'high' && (
                      <div className="flex items-center space-x-1 mb-2">
                        <Flame className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">Hot Lead</span>
                      </div>
                    )}
                    
                    {/* Address & Score */}
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-white font-semibold">{mission.streetAddress}</p>
                        <p className="text-gray-400 text-sm">{mission.suburb}</p>
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-sm font-bold ${
                        mission.sellingScore >= 80 
                          ? 'bg-green-500/20 text-green-400' 
                          : mission.sellingScore >= 50 
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {Math.round(mission.sellingScore)}
                      </div>
                    </div>
                    
                    {/* Action */}
                    <p className="text-gray-300 text-sm mb-3">{mission.action}</p>
                    
                    {/* Action Button */}
                    <div className="flex items-center space-x-2">
                      {mission.type === 'call' && (
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-green-500 hover:bg-green-400 text-black font-bold rounded-xl transition-colors">
                          <Phone className="w-4 h-4" />
                          <span>Call Now</span>
                        </button>
                      )}
                      {mission.type === 'mail' && (
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-bold rounded-xl transition-colors">
                          <Mail className="w-4 h-4" />
                          <span>Send Letter</span>
                          <span className="text-blue-200 text-xs">$4</span>
                        </button>
                      )}
                      {mission.type === 'visit' && (
                        <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-400 text-white font-bold rounded-xl transition-colors">
                          <MapPin className="w-4 h-4" />
                          <span>Door Knock</span>
                        </button>
                      )}
                      <Link 
                        href={`/properties/${mission._id}`}
                        className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* See All Link */}
            {missions.length > 0 && (
              <Link 
                href="/leads"
                className="flex items-center justify-center space-x-2 text-gray-400 hover:text-white text-sm transition-colors"
              >
                <span>View all {allLeads.length} leads</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* ===== COLUMN 2: THE DATA (Pipeline Velocity) ===== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span>Pipeline Velocity</span>
              </h2>
            </div>
            
            {/* Funnel Visualization */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="space-y-4">
                {/* Funnel Stages */}
                <FunnelStage 
                  label="Leads Identified" 
                  count={pipelineStats.identified} 
                  percentage={100}
                  color="blue"
                />
                <FunnelStage 
                  label="Contacted" 
                  count={pipelineStats.contacted} 
                  percentage={(pipelineStats.contacted / pipelineStats.identified) * 100 || 0}
                  color="purple"
                  warning={pipelineStats.contacted < pipelineStats.identified * 0.2}
                />
                <FunnelStage 
                  label="Appraisals Booked" 
                  count={pipelineStats.appraisals} 
                  percentage={(pipelineStats.appraisals / pipelineStats.identified) * 100 || 0}
                  color="amber"
                />
                <FunnelStage 
                  label="Listed" 
                  count={pipelineStats.listed} 
                  percentage={(pipelineStats.listed / pipelineStats.identified) * 100 || 0}
                  color="green"
                />
              </div>
              
              {/* Warning Message */}
              {pipelineStats.contacted < pipelineStats.identified * 0.2 && pipelineStats.identified > 0 && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-400 text-sm font-medium">Low Contact Rate</p>
                      <p className="text-red-300/70 text-xs mt-0.5">
                        You have {pipelineStats.identified} leads but only contacted {pipelineStats.contacted}. 
                        Time to pick up the phone!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">{metrics?.unLockedLeadsCount || 0}</p>
                    <p className="text-xs text-gray-500">Unlocked</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">#{metrics?.leaderboardPosition || '—'}</p>
                    <p className="text-xs text-gray-500">Ranking</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Territory Heatmap Placeholder */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white">Your Territory</h3>
                <span className="text-xs text-gray-500">{metrics?.subscribedSuburbs || 0} suburbs</span>
              </div>
              <div className="aspect-video bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl flex items-center justify-center border border-white/5">
                <div className="text-center">
                  <MapPin className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Territory map coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* ===== COLUMN 3: THE UPSELL ===== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>Grow Your Territory</span>
              </h2>
            </div>
            
            {/* Upsell Card */}
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-5">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Unlock 5 More Suburbs</h3>
                  <p className="text-amber-200/70 text-sm">Expand your territory</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                You're currently monitoring {metrics?.subscribedSuburbs || 0} suburbs. 
                Top performers track 10+ suburbs for maximum coverage.
              </p>
              <Link 
                href="/settings"
                className="block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold rounded-xl text-center transition-all"
              >
                Add More Suburbs
              </Link>
            </div>
            
            {/* Pro Features Teaser */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Pro Features</span>
              </h3>
              <div className="space-y-3">
                <ProFeatureRow 
                  icon={<Mail className="w-4 h-4" />}
                  label="AI-Powered Letters"
                  description="Send personalized letters in 1 click"
                  available={false}
                />
                <ProFeatureRow 
                  icon={<Phone className="w-4 h-4" />}
                  label="Click-to-Call"
                  description="Call leads directly from dashboard"
                  available={true}
                />
                <ProFeatureRow 
                  icon={<Target className="w-4 h-4" />}
                  label="Smart Routing"
                  description="Optimal door-knock route planning"
                  available={false}
                />
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-4">Your Recent Activity</h3>
              <div className="space-y-3">
                <ActivityRow 
                  action="Unlocked lead"
                  detail="15 Arinya Road, Ashgrove"
                  time="2h ago"
                  icon={<Lock className="w-3.5 h-3.5" />}
                />
                <ActivityRow 
                  action="Viewed property"
                  detail="47 Arinya Road, Ashgrove"
                  time="3h ago"
                  icon={<Target className="w-3.5 h-3.5" />}
                />
                <ActivityRow 
                  action="Added suburb"
                  detail="Bardon, QLD"
                  time="1d ago"
                  icon={<MapPin className="w-3.5 h-3.5" />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== HELPER COMPONENTS =====

function FunnelStage({ 
  label, 
  count, 
  percentage, 
  color,
  warning = false
}: { 
  label: string; 
  count: number; 
  percentage: number;
  color: 'blue' | 'purple' | 'amber' | 'green';
  warning?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center space-x-2">
          <span className="text-gray-300 text-sm">{label}</span>
          {warning && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
        </div>
        <span className="text-white font-bold">{count}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} rounded-full transition-all duration-500`}
          style={{ width: `${Math.max(percentage, 2)}%` }}
        />
      </div>
    </div>
  );
}

function ProFeatureRow({ 
  icon, 
  label, 
  description, 
  available 
}: { 
  icon: React.ReactNode;
  label: string;
  description: string;
  available: boolean;
}) {
  return (
    <div className={`flex items-start space-x-3 ${!available ? 'opacity-50' : ''}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
        available ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-500'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-white text-sm font-medium">{label}</span>
          {available ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
          ) : (
            <Lock className="w-3 h-3 text-gray-500" />
          )}
        </div>
        <p className="text-gray-500 text-xs">{description}</p>
      </div>
    </div>
  );
}

function ActivityRow({ 
  action, 
  detail, 
  time, 
  icon 
}: { 
  action: string;
  detail: string;
  time: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-300 text-sm truncate">{action}</p>
        <p className="text-gray-500 text-xs truncate">{detail}</p>
      </div>
      <span className="text-gray-600 text-xs flex-shrink-0">{time}</span>
    </div>
  );
}
