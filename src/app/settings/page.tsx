'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/client';

type SettingsPanel = 
  | null 
  | 'persona' 
  | 'personal' 
  | 'notifications' 
  | 'security' 
  | 'timezone'
  | 'suburbs'
  | 'subscription'
  | 'pipeline'
  | 'scripts'
  | 'templates'
  | 'api';

export default function SettingsPage() {
  const [activePanel, setActivePanel] = useState<SettingsPanel>(null);
  const router = useRouter();
  const { signOut } = useAuth();

  // Settings grid items matching demo.html exactly
  const sections = [
    {
      title: 'Personal settings',
      items: [
        { 
          id: 'persona', 
          label: 'Agent persona', 
          description: 'Your profile, agency, REA/Domain links, and communication style.',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
        { 
          id: 'personal', 
          label: 'Personal details', 
          description: 'Contact information, profile photo, and your account settings.',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        },
        { 
          id: 'notifications', 
          label: 'Notification preferences', 
          description: 'Customise emails, SMS, and push notifications you receive.',
          iconBg: 'bg-pink-100',
          iconColor: 'text-pink-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          ),
        },
        { 
          id: 'security', 
          label: 'Security', 
          description: 'Password, two-factor authentication, and session management.',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        },
        { 
          id: 'timezone', 
          label: 'Time zone', 
          description: 'Set your local time zone for notifications and scheduling.',
          iconBg: 'bg-sky-100',
          iconColor: 'text-sky-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        },
      ],
    },
    {
      title: 'Account settings',
      items: [
        { 
          id: 'suburbs', 
          label: 'Suburb subscription', 
          description: "Manage suburbs you're tracking for new seller leads.",
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
        },
        { 
          id: 'subscription', 
          label: 'Billing & subscription', 
          description: 'Manage your plan, payment methods, and invoices.',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          ),
        },
        { 
          id: 'leaderboard', 
          label: 'Leaderboard', 
          description: 'View rankings and compete with other agents.',
          iconBg: 'bg-rose-100',
          iconColor: 'text-rose-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          ),
          href: '/leaderboard',
        },
      ],
    },
    {
      title: 'Product settings',
      items: [
        { 
          id: 'pipeline', 
          label: 'Pipeline stages', 
          description: 'Customise your sales pipeline stages and colours.',
          iconBg: 'bg-indigo-100',
          iconColor: 'text-indigo-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          ),
        },
        { 
          id: 'scripts', 
          label: 'Call scripts', 
          description: 'Manage your phone call scripts and templates.',
          iconBg: 'bg-cyan-100',
          iconColor: 'text-cyan-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          ),
        },
        { 
          id: 'templates', 
          label: 'SMS & email templates', 
          description: 'Create and manage your messaging templates.',
          iconBg: 'bg-teal-100',
          iconColor: 'text-teal-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          ),
        },
        { 
          id: 'api', 
          label: 'API connection', 
          description: 'Connect to prop.deals API for live data.',
          iconBg: 'bg-slate-800',
          iconColor: 'text-white',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          ),
          href: '/signin',
        },
      ],
    },
    {
      title: 'Admin',
      items: [
        { 
          id: 'reliability', 
          label: 'Lead reliability', 
          description: 'Review and improve lead data quality.',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          href: '/reliability',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        { 
          id: 'help', 
          label: 'Help center', 
          description: 'FAQs, guides, and tutorials to help you succeed.',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          href: '/help',
        },
        { 
          id: 'support', 
          label: 'Contact support', 
          description: 'Get help from our customer success team.',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ),
        },
        { 
          id: 'tour', 
          label: 'Replay tour', 
          description: 'Watch the onboarding walkthrough again.',
          iconBg: 'bg-sky-100',
          iconColor: 'text-sky-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ),
        },
        { 
          id: 'signout', 
          label: 'Sign out', 
          description: 'Log out of your Get Listings account.',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          isSignOut: true,
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          ),
        },
      ],
    },
  ];

  const handleItemClick = (item: any) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.isSignOut) {
      signOut();
    } else {
      setActivePanel(item.id);
    }
  };

  return (
    <DemoLayout currentPage="settings">
      <div className="flex-1 overflow-auto bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your account and preferences</p>
        </div>

        {/* Settings Grid */}
        <div className="px-6 py-6">
          {sections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'mt-10' : ''}>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">
                {section.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className="text-left group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 ${item.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <span className={item.iconColor}>{item.icon}</span>
                      </div>
                      <div>
                        <p className={`font-medium group-hover:underline ${item.isSignOut ? 'text-red-600' : 'text-red-600'}`}>
                          {item.label}
                        </p>
                        <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Settings Detail Panel Modal */}
        {activePanel && (
          <SettingsDetailModal 
            panel={activePanel} 
            onClose={() => setActivePanel(null)} 
          />
        )}
      </div>
    </DemoLayout>
  );
}

function SettingsDetailModal({ panel, onClose }: { panel: SettingsPanel; onClose: () => void }) {
  const panelTitles: Record<string, string> = {
    persona: 'Agent Persona',
    personal: 'Personal Details',
    notifications: 'Notification Preferences',
    security: 'Security',
    timezone: 'Time Zone',
    suburbs: 'Suburb Subscription',
    subscription: 'Billing & Subscription',
    pipeline: 'Pipeline Stages',
    scripts: 'Call Scripts',
    templates: 'SMS & Email Templates',
    api: 'API Connection',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{panelTitles[panel!] || 'Settings'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
          <p className="text-gray-500">Settings panel for {panelTitles[panel!]}. Connect to API to manage these settings.</p>
        </div>
      </div>
    </div>
  );
}
