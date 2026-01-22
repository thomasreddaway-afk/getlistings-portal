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
          iconBg: 'bg-gradient-to-br from-primary to-red-600',
          iconColor: 'text-white',
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
          iconBg: 'bg-primary/10',
          iconColor: 'text-primary',
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
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
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
          emailAction: 'support@getlistings.com.au',
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
          isTour: true,
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
      // Redirect to landing page after sign out
      window.location.href = '/';
    } else if (item.emailAction) {
      window.location.href = `mailto:${item.emailAction}`;
    } else if (item.isTour) {
      // Clear onboarding flag and redirect to trigger tour
      localStorage.removeItem('onboardingComplete');
      alert('Tour will replay on next page load. Redirecting to dashboard...');
      router.push('/');
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
                        <p className={`font-medium group-hover:underline ${'isSignOut' in item && item.isSignOut ? 'text-red-600' : 'text-primary'}`}>
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
  const [personaStyle, setPersonaStyle] = useState('professional');
  const [reaUrl, setReaUrl] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [bio, setBio] = useState('');
  const [timezone, setTimezone] = useState('Australia/Sydney');
  
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

  const handleSave = () => {
    // Save to localStorage for now
    if (panel === 'persona') {
      localStorage.setItem('agentPersona', JSON.stringify({ personaStyle, reaUrl, domainUrl, websiteUrl, bio }));
    } else if (panel === 'timezone') {
      localStorage.setItem('userTimezone', timezone);
    }
    alert('Settings saved!');
    onClose();
  };

  const renderPanelContent = () => {
    switch (panel) {
      case 'persona':
        return (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-amber-800">Your name, phone, email, and agency details are pulled from your account.</p>
                  <p className="text-sm text-amber-700">To update them, go to <button onClick={() => { onClose(); }} className="underline font-medium">Personal Details</button>.</p>
                </div>
              </div>
            </div>

            {/* Communication Personality */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Communication Personality</h3>
              <p className="text-sm text-gray-500 mb-4">Choose how you want your scripts and responses to sound</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'professional', emoji: '👔', label: 'Professional', desc: 'Formal, polished, and business-focused language' },
                  { id: 'friendly', emoji: '😊', label: 'Friendly', desc: 'Warm, approachable, and conversational tone' },
                  { id: 'casual', emoji: '🤙', label: 'Casual', desc: 'Relaxed, down-to-earth, and easygoing' },
                  { id: 'energetic', emoji: '⚡', label: 'Energetic', desc: 'Enthusiastic, upbeat, and high-energy' },
                ].map((style) => (
                  <label key={style.id} className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="persona-style"
                      value={style.id}
                      checked={personaStyle === style.id}
                      onChange={(e) => setPersonaStyle(e.target.value)}
                      className="peer sr-only"
                    />
                    <div className={`p-4 border-2 rounded-xl transition-colors ${personaStyle === style.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl">{style.emoji}</span>
                        <span className="font-semibold text-gray-900">{style.label}</span>
                      </div>
                      <p className="text-sm text-gray-500">{style.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Online Profiles */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Online Profiles</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">RealEstate.com.au Profile URL</label>
                  <input
                    type="url"
                    value={reaUrl}
                    onChange={(e) => setReaUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="https://www.realestate.com.au/agent/john-smith-123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain.com.au Profile URL</label>
                  <input
                    type="url"
                    value={domainUrl}
                    onChange={(e) => setDomainUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="https://www.domain.com.au/real-estate-agent/john-smith-123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website (optional)</label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="https://www.johnsmithrealestate.com.au"
                  />
                </div>
              </div>
            </div>

            {/* About You */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">About You</h3>
              <p className="text-sm text-gray-500 mb-4">A short bio that can be used in communications</p>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="I'm a local real estate agent with 10 years of experience..."
              />
            </div>
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">TR</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">Tom Reddaway</h2>
                  <p className="text-gray-500">Agent</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Pro Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-3xl font-bold text-primary">-</p>
                <p className="text-sm text-gray-500 mt-1">Leads Unlocked</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-3xl font-bold text-primary">-</p>
                <p className="text-sm text-gray-500 mt-1">Listings Won</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <p className="text-3xl font-bold text-primary">-</p>
                <p className="text-sm text-gray-500 mt-1">Your Ranking</p>
              </div>
            </div>

            {/* Account Details Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">First Name</label>
                    <input type="text" placeholder="First name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Last Name</label>
                    <input type="text" placeholder="Last name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <input type="email" placeholder="Email address" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone</label>
                  <input type="tel" placeholder="Phone number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Agency</label>
                    <input type="text" placeholder="Agency name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Position / Title</label>
                    <input type="text" placeholder="e.g. Sales Agent" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'timezone':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Your Time Zone</h3>
              <p className="text-sm text-gray-500 mb-4">Select your local time zone for accurate scheduling and notifications</p>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="Australia/Sydney">Sydney (AEST/AEDT)</option>
                <option value="Australia/Melbourne">Melbourne (AEST/AEDT)</option>
                <option value="Australia/Brisbane">Brisbane (AEST)</option>
                <option value="Australia/Perth">Perth (AWST)</option>
                <option value="Australia/Adelaide">Adelaide (ACST/ACDT)</option>
                <option value="Australia/Darwin">Darwin (ACST)</option>
                <option value="Australia/Hobart">Hobart (AEST/AEDT)</option>
              </select>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {['New leads in your suburbs', 'Hot lead alerts (score 85+)', 'Weekly performance summary', 'Leaderboard updates'].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{item}</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded focus:ring-primary" />
                  </label>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Push Notifications</h3>
              <div className="space-y-4">
                {['New hot leads', 'Pipeline updates', 'Team mentions'].map((item, idx) => (
                  <label key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{item}</span>
                    <input type="checkbox" defaultChecked className="w-5 h-5 text-primary rounded focus:ring-primary" />
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Current Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">New Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
                  <input type="password" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mb-4">Add an extra layer of security to your account</p>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700">Enable 2FA</button>
            </div>
          </div>
        );

      case 'api':
        return (
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Connected</p>
                    <p className="text-sm text-gray-500">API is working correctly</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">Test Connection</button>
                </div>
              </div>
            </div>

            {/* Login with Phone */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Login with Phone</h3>
              <p className="text-sm text-gray-500 mb-4">Enter your phone number to receive a one-time password via SMS</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex space-x-2">
                    <input type="tel" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary" placeholder="+61 412 345 678" />
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 font-medium whitespace-nowrap">Send OTP</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Manual Token */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Manual Token (Advanced)</h3>
              <p className="text-sm text-gray-500 mb-4">For developers: paste a JWT token directly</p>
              <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-xs" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />
            </div>

            {/* Available Endpoints */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-700 mb-3">Available API Endpoints</h3>
              <div className="space-y-2 text-sm">
                {['Get All My Leads', 'Get Inbox / Chat Data', 'Get Expired Listings', 'Dashboard Metrics', 'User Analytics', 'My Suburbs List'].map((endpoint) => (
                  <div key={endpoint} className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-slate-600">{endpoint}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Test API Endpoints */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Test API Endpoints</h3>
              <p className="text-sm text-gray-500 mb-4">Click a button to fetch real data from the API</p>
              <div className="grid grid-cols-3 gap-3">
                <button className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100">📋 Get Leads</button>
                <button className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100">💬 Get Inbox</button>
                <button className="px-3 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-medium hover:bg-orange-100">⏰ Expired Listings</button>
                <button className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">📊 Dashboard</button>
                <button className="px-3 py-2 bg-pink-50 text-pink-700 rounded-lg text-sm font-medium hover:bg-pink-100">📈 Analytics</button>
                <button className="px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100">🏘️ My Suburbs</button>
              </div>
            </div>
          </div>
        );

      case 'suburbs':
        return (
          <div className="space-y-6">
            {/* Current Subscription Status */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Your Subscribed Suburbs</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">4 Suburb Plan</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {['Paddington NSW', 'Woollahra NSW', 'Double Bay NSW', 'Darling Point NSW'].map((suburb) => (
                  <span key={suburb} className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {suburb}
                    <button className="ml-2 text-gray-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500">Your current plan allows up to <strong>4</strong> suburbs.</p>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-br from-primary/5 to-amber-50 border border-primary/20 rounded-xl p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-lg">Want more suburbs, leads & listing opportunities?</h4>
                  <p className="text-gray-600 mt-1 mb-4">Expand your coverage area to unlock more seller leads and grow your listing pipeline.</p>
                  <button onClick={() => { onClose(); }} className="px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-red-700">
                    Compare Packages →
                  </button>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">What you get with more suburbs</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { icon: '👥', color: 'green', title: 'More Seller Leads', desc: 'Access thousands more potential sellers' },
                  { icon: '🗺️', color: 'blue', title: 'Wider Coverage', desc: 'Expand your farm area and dominate more suburbs' },
                  { icon: '⭐', color: 'amber', title: 'Exclusive Opportunities', desc: 'Get first access to marketing opportunities' },
                  { icon: '⚡', color: 'purple', title: 'AI-Powered Insights', desc: 'Get seller scores for all your suburbs' },
                ].map((benefit) => (
                  <div key={benefit.title} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 bg-${benefit.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <span>{benefit.icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{benefit.title}</p>
                      <p className="text-sm text-gray-500">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'subscription':
        return (
          <div className="space-y-6">
            {/* Current Plan Status */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-green-100">Your Current Plan</p>
                    <p className="text-2xl font-bold">Professional</p>
                    <p className="text-sm text-green-100 mt-1">Billed monthly • Next billing: Feb 9, 2026</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">$349</p>
                  <p className="text-sm text-green-100">/month</p>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
                {[
                  { label: 'Suburbs', used: 4, total: 5 },
                  { label: 'Lead Unlocks', used: 52, total: 75 },
                  { label: 'SMS Credits', used: 67, total: 100 },
                  { label: 'Email Credits', used: 312, total: 500 },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-sm text-green-100">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.used} <span className="text-sm font-normal text-green-200">/ {stat.total}</span></p>
                    <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
                      <div className="bg-white rounded-full h-1.5" style={{ width: `${(stat.used / stat.total) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Callout */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">You&apos;ve won 3 listings this quarter using Get Listings</p>
                  <p className="text-sm text-gray-600">That&apos;s approximately <strong>$67,500</strong> in commission vs <strong>$1,047</strong> subscription cost. <span className="text-green-600 font-medium">64x ROI</span></p>
                </div>
              </div>
            </div>

            {/* Plans Grid */}
            <h2 className="text-xl font-bold text-gray-900">Choose Your Plan</h2>
            <div className="grid grid-cols-3 gap-5">
              {[
                { name: 'Starter', price: 149, suburbs: 2, leads: 50, current: false },
                { name: 'Professional', price: 349, suburbs: 5, leads: 'Unlimited', current: true },
                { name: 'Growth', price: 599, suburbs: 12, leads: 'Unlimited', current: false, recommended: true },
              ].map((plan) => (
                <div key={plan.name} className={`bg-white rounded-2xl p-6 relative ${plan.current ? 'border-2 border-green-500 shadow-lg' : 'border border-gray-200'}`}>
                  {plan.current && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">CURRENT PLAN</div>}
                  {plan.recommended && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">RECOMMENDED</div>}
                  <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                  <div className="my-4">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-2 text-sm mb-6">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span><strong>{plan.suburbs}</strong> suburbs</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                      <span><strong>{plan.leads}</strong> Seller Scores</span>
                    </li>
                  </ul>
                  <button className={`w-full py-3 rounded-xl font-medium ${plan.current ? 'bg-green-100 text-green-700 cursor-default' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    {plan.current ? 'Current Plan' : 'Select'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'pipeline':
        return (
          <div className="space-y-6">
            <p className="text-sm text-gray-500">Customise your pipeline stages. Drag to reorder, edit names and colours. Changes will sync to your Pipeline view.</p>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {[
                { name: 'New', color: 'bg-gray-100', count: 12 },
                { name: 'Contacted', color: 'bg-blue-100', count: 8 },
                { name: 'Appraisal Set', color: 'bg-purple-100', count: 4 },
                { name: 'Listed', color: 'bg-green-100', count: 3 },
                { name: 'Sold', color: 'bg-amber-100', count: 7 },
              ].map((stage, idx) => (
                <div key={stage.name} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="cursor-move text-gray-400">⋮⋮</div>
                    <div className={`w-4 h-4 ${stage.color} rounded`}></div>
                    <input type="text" defaultValue={stage.name} className="font-medium text-gray-900 border-none focus:ring-0 p-0" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">{stage.count} leads</span>
                    <button className="text-gray-400 hover:text-red-500">×</button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary">+ Add Stage</button>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700"><strong>💡 Tip:</strong> You can also edit stages directly in the Pipeline view by clicking on stage names.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-6">
            <p className="text-gray-500">Settings panel for {panelTitles[panel!]}. This feature is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg mr-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">{panelTitles[panel!] || 'Settings'}</h1>
        </div>
        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 font-medium">
          Save Changes
        </button>
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {renderPanelContent()}
      </div>
    </div>
  );
}
