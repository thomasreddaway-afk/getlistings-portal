'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/client';
import { cn } from '@/lib/utils/cn';

/**
 * Sidebar navigation matching demo.html exactly
 */
export function DemoSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Try to get user from localStorage or fetch from leaderboard (same as demo.html)
  const [localUser, setLocalUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    async function loadUserProfile() {
      if (user) return; // Already have user from context
      
      // First try cached user from localStorage (same key as demo.html)
      const cachedUser = localStorage.getItem('propdeals_user');
      if (cachedUser) {
        try {
          const parsed = JSON.parse(cachedUser);
          if (parsed.firstName || parsed.name) {
            setLocalUser(parsed);
            return;
          }
        } catch (e) {
          console.error('Failed to parse cached user');
        }
      }
      
      // Get token - check both keys (demo uses propdeals_jwt, portal uses propdeals_token)
      const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
      if (!token) return;
      
      // Fetch user profile from /user/me endpoint
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';
      try {
        const response = await fetch(`${apiUrl}/user/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          console.log('User profile fetch failed:', response.status);
          return;
        }
        
        const userData = await response.json();
        
        if (userData && (userData.firstName || userData.lastName)) {
          console.log('Fetched user profile:', userData.firstName, userData.lastName);
          const userProfile = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            agencyName: userData.agencyName || userData.agency || userData.businessName || '',
            avatar: userData.profilePicture,
            role: 'Agent'
          };
          localStorage.setItem('propdeals_user', JSON.stringify(userProfile));
          setLocalUser(userProfile);
        }
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    }
    
    loadUserProfile();
  }, [user]);
  
  const displayUser = user || localUser;

  const isActive = (path: string) => pathname === path;

  // Get user initials
  const getInitials = () => {
    const firstName = displayUser?.first_name || displayUser?.firstName || '';
    const lastName = displayUser?.last_name || displayUser?.lastName || '';
    if (!firstName) return '??';
    const first = firstName[0] || '';
    const last = lastName[0] || '';
    return `${first}${last}`.toUpperCase();
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen">
      {/* Logo */}
      <div className="px-4 pt-[22px] pb-5 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-gray-900 tracking-wider">Get Listings</h1>
            <p className="text-sm text-gray-500 tracking-wider">Desktop Portal</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <NavItem href="/" icon={DashboardIcon} active={isActive('/')}>
          Dashboard
        </NavItem>
        
        {/* Lead Generation Section */}
        <NavSection title="Lead Generation">
          <NavItem href="/leads" icon={UsersIcon} active={isActive('/leads')}>
            Seller Scores
          </NavItem>
          <NavItem href="/hottest" icon={FireIcon} active={isActive('/hottest')}>
            Hottest Leads
          </NavItem>
          <NavItem href="/exclusive" icon={StarIcon} active={isActive('/exclusive')} badge="PRO">
            Valuation Requests
          </NavItem>
          <NavItem href="/expired" icon={ClockIcon} active={isActive('/expired')}>
            Expiring Listings
          </NavItem>
          <NavItem href="/nearby" icon={MapPinIcon} active={isActive('/nearby')}>
            Territory Expansion
          </NavItem>
          <NavItem href="/pipeline" icon={KanbanIcon} active={isActive('/pipeline')}>
            Lead Pipeline
          </NavItem>
        </NavSection>
        
        {/* Marketing Section */}
        <NavSection title="Marketing">
          <NavItem href="/marketing" icon={ImageIcon} active={isActive('/marketing')}>
            Content Creation
          </NavItem>
          <NavItem href="/branding" icon={LightbulbIcon} active={isActive('/branding')}>
            Marketing Tips
          </NavItem>
        </NavSection>
        
        {/* Insights Section */}
        <NavSection title="Insights">
          <NavItem href="/analytics" icon={ChartIcon} active={isActive('/analytics')}>
            Analytics
          </NavItem>
          <NavItem href="/leaderboard" icon={BadgeIcon} active={isActive('/leaderboard')}>
            Leaderboard
          </NavItem>
          <NavItem href="/competitor-analysis" icon={SparklesIcon} active={isActive('/competitor-analysis')} badge="NEW" badgeColor="emerald">
            Competitor Analysis
          </NavItem>
        </NavSection>
        
        {/* Growth Section */}
        <NavSection title="Growth">
          <NavItem href="/launchpad" icon={BuildingIcon} active={isActive('/launchpad')} badge="NEW" badgeColor="amber">
            Launch An Agency
          </NavItem>
          <NavItem href="/buyerdemand" icon={UsersIcon} active={isActive('/buyerdemand')} badge="NEW" badgeColor="blue">
            Find Buyers
          </NavItem>
          <NavItem href="/talent" icon={BriefcaseIcon} active={isActive('/talent')} badge="NEW" badgeColor="violet">
            Recruitment
          </NavItem>
        </NavSection>
        
        {/* Other Section */}
        <NavSection title="Other">
          <NavItem href="/settings" icon={SettingsIcon} active={isActive('/settings')}>
            Settings
          </NavItem>
          <NavItem href="/help" icon={HelpIcon} active={isActive('/help')}>
            Help & Support
          </NavItem>
        </NavSection>
      </nav>
      
      {/* User Profile */}
      <Link href="/settings" className="p-4 border-t border-gray-200 hover:bg-gray-50 transition-colors">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm">
            {getInitials()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {displayUser?.first_name || displayUser?.firstName 
                ? `${displayUser.first_name || displayUser.firstName} ${displayUser.last_name || displayUser.lastName || ''}`.trim()
                : 'Loading...'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {displayUser?.agency_name || displayUser?.agencyName || displayUser?.agency
                ? `Agent • ${displayUser.agency_name || displayUser.agencyName || displayUser.agency}`
                : 'Agent'}
            </p>
          </div>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </Link>
    </aside>
  );
}

// Navigation Section Component
function NavSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="pt-4">
      <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
        {title}
      </p>
      {children}
    </div>
  );
}

// Navigation Item Component
interface NavItemProps {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  badge?: string;
  badgeColor?: 'primary' | 'emerald' | 'amber' | 'blue' | 'violet';
  children: React.ReactNode;
}

function NavItem({ href, icon: Icon, active, badge, badgeColor = 'primary', children }: NavItemProps) {
  const badgeColors = {
    primary: 'bg-primary text-white',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
    blue: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white',
    violet: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white',
  };

  return (
    <Link
      href={href}
      className={cn(
        'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative tracking-wider',
        active
          ? 'bg-primary text-white'
          : 'text-gray-700 hover:bg-gray-100'
      )}
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
      {badge && (
        <span className={cn(
          'absolute right-3 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide',
          badgeColors[badgeColor]
        )}>
          {badge}
        </span>
      )}
    </Link>
  );
}

// Icons (matching demo.html SVGs)
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/>
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  );
}

function FireIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  );
}

function KanbanIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
    </svg>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  );
}

function BadgeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
    </svg>
  );
}

function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
    </svg>
  );
}

function HelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  );
}
