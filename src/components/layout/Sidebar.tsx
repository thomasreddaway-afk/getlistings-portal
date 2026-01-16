'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Star, 
  GitBranch, 
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/client';
import { cn } from '@/lib/utils/cn';

interface NavItem {
  name: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
  requiresExclusive?: boolean;
}

const mainNavItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Leads', href: '/leads', icon: Users },
  { name: 'Properties', href: '/properties', icon: Building2 },
];

const premiumNavItems: NavItem[] = [
  { name: 'Exclusive Leads', href: '/exclusive', icon: Star, requiresExclusive: true },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch, requiresExclusive: true },
];

const settingsNavItems: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut, hasExclusiveAccess, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || 
      (item.href !== '/' && pathname.startsWith(item.href));
    
    const isLocked = item.requiresExclusive && !hasExclusiveAccess;

    return (
      <Link
        href={isLocked ? '/upgrade' : item.href}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
          isActive 
            ? 'bg-brand-50 text-brand-700' 
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          isLocked && 'opacity-60'
        )}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <item.icon className="w-5 h-5" />
        <span className="flex-1">{item.name}</span>
        {item.badge && (
          <span className="px-2 py-0.5 text-xs bg-brand-100 text-brand-700 rounded-full">
            {item.badge}
          </span>
        )}
        {isLocked && (
          <span className="text-xs text-slate-400">🔒</span>
        )}
      </Link>
    );
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200">
        <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">G</span>
        </div>
        <span className="font-semibold text-slate-900">Get Listings</span>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Premium Section Divider */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-2 px-3">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Premium
            </span>
            {!hasExclusiveAccess && (
              <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                Upgrade
              </span>
            )}
          </div>
        </div>

        {premiumNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Settings Divider */}
        <div className="pt-4 pb-2">
          <div className="h-px bg-slate-200" />
        </div>

        {settingsNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </nav>

      {/* User Menu */}
      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-slate-600">
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {user?.role === 'admin' ? 'Administrator' : 
               user?.role === 'staff' ? 'Staff' : 'Agent'}
            </p>
          </div>
          <button
            onClick={signOut}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile sidebar overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
