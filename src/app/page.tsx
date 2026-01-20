'use client';

import { DemoLayout } from '@/components/layout';
import { useAuth } from '@/lib/auth/client';
import Link from 'next/link';
import { 
  Phone, 
  Check, 
  Clock, 
  MapPin, 
  Award,
  Megaphone,
  Lock 
} from 'lucide-react';

// Mock data for dashboard
const mockHotLeads = [
  {
    id: 1,
    address: '78 Park Avenue, Mosman',
    score: 88,
    subtitle: 'Valuation requested • Est. $1.8M',
    tags: [
      { label: 'Mortgage free', color: 'green' },
      { label: '15yr owner', color: 'blue' },
    ],
  },
  {
    id: 2,
    address: '23 Harbour View, Manly',
    score: 85,
    subtitle: 'Neighbour sold $2.1M last week',
    tags: [
      { label: 'Downsizing', color: 'amber' },
      { label: 'Empty nester', color: 'purple' },
    ],
  },
  {
    id: 3,
    address: '156 Beach Road, Coogee',
    score: 82,
    subtitle: 'DA approved, renovation complete',
    tags: [
      { label: 'Just renovated', color: 'green' },
    ],
  },
];

const mockExpiringListings = [
  {
    id: 1,
    address: '15 Arinya Road, Ashgrove',
    daysLeft: 3,
    urgency: 'red',
    agent: 'Ray White',
    daysOnMarket: 90,
    priceRange: '$1.2M - $1.35M',
  },
  {
    id: 2,
    address: '8 Hillside Crescent, Mosman',
    daysLeft: 7,
    urgency: 'orange',
    agent: 'McGrath',
    daysOnMarket: 120,
    priceRange: '$2.8M - $3.1M',
  },
  {
    id: 3,
    address: '27 Victoria Street, Potts Point',
    daysLeft: 14,
    urgency: 'amber',
    agent: 'LJ Hooker',
    daysOnMarket: 0,
    priceRange: '$950K - $1.05M',
    note: 'Price reduced twice',
  },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatDate(): string {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
}

function getTagColorClasses(color: string): string {
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
  };
  return colorMap[color] || 'bg-gray-100 text-gray-700';
}

function getUrgencyColorClasses(urgency: string): string {
  const colorMap: Record<string, string> = {
    red: 'bg-red-100 text-red-700',
    orange: 'bg-orange-100 text-orange-700',
    amber: 'bg-amber-100 text-amber-700',
  };
  return colorMap[urgency] || 'bg-gray-100 text-gray-700';
}

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <DemoLayout currentPage="dashboard">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DemoLayout>
    );
  }

  const greeting = getGreeting();
  const todayDate = formatDate();

  return (
    <DemoLayout currentPage="dashboard">
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {greeting}, {user?.first_name || 'John'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Here's what needs your attention today
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Today's Date</p>
                <p className="text-sm font-semibold text-gray-900">{todayDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* TOP PRIORITY: Call This Person Now */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-white/80">🎯 Your #1 Priority Today</span>
              </div>
              <span className="px-2.5 py-1 bg-white/20 text-white text-xs font-bold rounded-full animate-pulse">
                HOT LEAD
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">Sarah Mitchell • 42 Ocean View Dr</h2>
                <p className="text-green-100 text-sm mb-3">Requested valuation 2 days ago • Score: 92/100</p>
                <div className="flex items-center space-x-3 text-xs text-green-100">
                  <span className="flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Valuation requested</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Mortgage free</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>12yr owner</span>
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-green-100 text-xs mb-1">Est. Commission</p>
                <p className="text-2xl font-bold mb-3">$48,000</p>
                <button className="px-5 py-2.5 bg-white text-green-600 rounded-xl text-sm font-bold hover:bg-green-50 shadow-lg flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Call Now</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            <Link
              href="/leads"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-sky-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                  <Lock className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-sky-600">24</p>
                  <p className="text-xs text-gray-500">Leads Unlocked</p>
                </div>
              </div>
            </Link>

            <Link
              href="/settings"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-green-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">4</p>
                  <p className="text-xs text-gray-500">Suburbs Subscribed</p>
                </div>
              </div>
            </Link>

            <Link
              href="/leaderboard"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-amber-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-600">#12</p>
                  <p className="text-xs text-gray-500">Leaderboard Position</p>
                </div>
              </div>
            </Link>

            <Link
              href="/branding"
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Megaphone className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">156</p>
                  <p className="text-xs text-gray-500">Marketing Opportunities</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Two Column Layout: Hot Leads + Expiring Listings */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column: Hot Leads */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔥</span>
                  <h3 className="font-semibold text-gray-900">Hot Leads</h3>
                </div>
                <Link
                  href="/leads"
                  className="text-xs text-red-500 font-medium hover:underline"
                >
                  See all
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {mockHotLeads.map((lead) => (
                  <Link
                    key={lead.id}
                    href={`/leads/${lead.id}`}
                    className="block px-4 py-3 hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{lead.address}</span>
                      <span
                        className={`w-6 h-6 ${
                          lead.score >= 85 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        } rounded-full text-xs font-bold flex items-center justify-center`}
                      >
                        {lead.score}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{lead.subtitle}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {lead.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`px-1.5 py-0.5 ${getTagColorClasses(tag.color)} text-xs rounded`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Column: Expiring Listings */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">Expiring Listings</h3>
                </div>
                <Link
                  href="/expired"
                  className="text-xs text-red-500 font-medium hover:underline"
                >
                  See all
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {mockExpiringListings.map((listing) => (
                  <div key={listing.id} className="px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{listing.address}</span>
                      <span
                        className={`px-2 py-0.5 ${getUrgencyColorClasses(listing.urgency)} text-xs font-medium rounded-full`}
                      >
                        {listing.daysLeft} days
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Listed with {listing.agent}
                      {listing.daysOnMarket > 0 && ` • ${listing.daysOnMarket} days on market`}
                      {listing.note && ` • ${listing.note}`}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{listing.priceRange}</span>
                      <button className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg font-medium hover:bg-red-600">
                        Contact
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
