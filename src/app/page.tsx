'use client';

import { AppLayout, Header } from '@/components/layout';
import { useAuth } from '@/lib/auth/client';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  Phone, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  Zap,
  Target,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

/**
 * Dashboard - Default landing page
 * Mirrors the mobile app experience with seller insights and AI opportunities
 */
export default function DashboardPage() {
  const { user, loading, hasExclusiveAccess } = useAuth();

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  const greeting = getGreeting();

  return (
    <AppLayout>
      <Header 
        title={`${greeting}, ${user?.first_name || 'there'}`}
        subtitle="Here's what's happening with your listings today"
      />

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Hot Sellers"
              value="12"
              subtitle="85%+ score"
              change="+3 this week"
              changeType="positive"
              icon={Flame}
              iconColor="text-red-500"
              iconBg="bg-red-50"
            />
            <StatCard
              title="AI Insights"
              value="8"
              subtitle="new matches"
              change="Updated today"
              icon={Zap}
              iconColor="text-amber-500"
              iconBg="bg-amber-50"
            />
            <StatCard
              title="Your Leads"
              value="47"
              subtitle="active"
              change="+12 this month"
              changeType="positive"
              icon={Users}
              iconColor="text-blue-500"
              iconBg="bg-blue-50"
            />
            <StatCard
              title="Conversions"
              value="23%"
              subtitle="lead to listing"
              change="+5% vs last month"
              changeType="positive"
              icon={Target}
              iconColor="text-green-500"
              iconBg="bg-green-50"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Hot Properties */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">High-Score Properties</h2>
                <Link 
                  href="/properties"
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
                >
                  View all
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {mockHotProperties.map((property, index) => (
                  <PropertyCard key={index} property={property} />
                ))}
              </div>
            </div>

            {/* AI Insights */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">AI Insights</h2>
                <span className="text-xs text-slate-500">Updated 2h ago</span>
              </div>

              <div className="space-y-4">
                {mockInsights.map((insight, index) => (
                  <InsightCard key={index} insight={insight} />
                ))}
              </div>
            </div>
          </div>

          {/* Exclusive Leads Upsell Banner */}
          {!hasExclusiveAccess && (
            <div className="premium-section rounded-xl p-6 text-white">
              <div className="premium-glow" />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Want exclusive appraisal-ready sellers?
                  </h3>
                  <p className="text-sky-100 text-sm">
                    Get done-for-you leads instead of shared insights. Our team generates and qualifies leads for you.
                  </p>
                </div>
                <Link
                  href="/upgrade"
                  className="shrink-0 bg-white text-brand-700 px-5 py-2.5 rounded-lg font-medium hover:bg-sky-50 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Recent Activity</h2>
              <Link 
                href="/leads"
                className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1"
              >
                View all leads
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-1">
              {mockActivities.map((activity, index) => (
                <ActivityRow key={index} activity={activity} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

// Helper Components

function StatCard({ 
  title, 
  value, 
  subtitle, 
  change, 
  changeType,
  icon: Icon,
  iconColor,
  iconBg,
}: {
  title: string;
  value: string;
  subtitle: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: typeof TrendingUp;
  iconColor: string;
  iconBg: string;
}) {
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="stat-value mt-1">{value}</p>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
        <div className={cn('p-2 rounded-lg', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
      </div>
      {change && (
        <p className={cn(
          'stat-change flex items-center gap-1',
          changeType === 'positive' && 'positive',
          changeType === 'negative' && 'negative'
        )}>
          {changeType === 'positive' && <ArrowUpRight className="w-3 h-3" />}
          {changeType === 'negative' && <ArrowDownRight className="w-3 h-3" />}
          {change}
        </p>
      )}
    </div>
  );
}

function PropertyCard({ property }: { property: typeof mockHotProperties[0] }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
        <Building2 className="w-6 h-6 text-slate-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-slate-900 truncate">{property.address}</p>
        <p className="text-sm text-slate-500">{property.suburb}</p>
      </div>
      <div className="text-right">
        <div className={cn(
          'score-badge',
          property.score >= 80 ? 'score-hot' : 
          property.score >= 60 ? 'score-warm' : 
          property.score >= 40 ? 'score-cool' : 'score-cold'
        )}>
          {property.score}%
        </div>
        <p className="text-xs text-slate-500 mt-1">{property.beds}b {property.baths}ba</p>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: typeof mockInsights[0] }) {
  const iconMap = {
    opportunity: { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    action: { icon: Phone, color: 'text-green-500', bg: 'bg-green-50' },
    alert: { icon: Flame, color: 'text-red-500', bg: 'bg-red-50' },
  };

  const config = iconMap[insight.type as keyof typeof iconMap];

  return (
    <div className="flex gap-3">
      <div className={cn('p-2 rounded-lg shrink-0', config.bg)}>
        <config.icon className={cn('w-4 h-4', config.color)} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-900">{insight.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{insight.description}</p>
      </div>
    </div>
  );
}

function ActivityRow({ activity }: { activity: typeof mockActivities[0] }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium',
        activity.type === 'call' ? 'bg-green-100 text-green-700' :
        activity.type === 'email' ? 'bg-blue-100 text-blue-700' :
        activity.type === 'note' ? 'bg-slate-100 text-slate-700' :
        'bg-amber-100 text-amber-700'
      )}>
        {activity.initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 truncate">{activity.description}</p>
        <p className="text-xs text-slate-500">{activity.lead}</p>
      </div>
      <span className="text-xs text-slate-400 shrink-0">{activity.time}</span>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// Mock Data
const mockHotProperties = [
  { address: '42 Smith Street', suburb: 'Richmond VIC 3121', score: 92, beds: 3, baths: 2 },
  { address: '15 Oak Avenue', suburb: 'Toorak VIC 3142', score: 89, beds: 4, baths: 3 },
  { address: '8/100 Chapel Street', suburb: 'Windsor VIC 3181', score: 87, beds: 2, baths: 1 },
  { address: '23 Collins Road', suburb: 'Hawthorn VIC 3122', score: 85, beds: 5, baths: 3 },
];

const mockInsights = [
  { type: 'opportunity', title: 'Price drop detected', description: '15 Oak Ave reduced by 5% - seller may be motivated' },
  { type: 'action', title: 'Follow-up due', description: '3 leads haven\'t been contacted in 7+ days' },
  { type: 'alert', title: 'Market shift', description: 'Richmond median up 3.2% this quarter' },
];

const mockActivities = [
  { type: 'call', initials: 'JS', description: 'Called - Left voicemail', lead: 'John Smith • 42 Smith St', time: '2h ago' },
  { type: 'email', initials: 'MJ', description: 'Sent appraisal report', lead: 'Mary Johnson • 15 Oak Ave', time: '4h ago' },
  { type: 'note', initials: 'DW', description: 'Added note about renovation plans', lead: 'David Wilson • 8/100 Chapel', time: 'Yesterday' },
];
