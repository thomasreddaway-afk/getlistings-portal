'use client';

import { DemoLayout } from '@/components/layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

const defaultPipelineStages: PipelineStage[] = [
  { id: 'new', name: 'New Lead', color: '#3B82F6', order: 0 },
  { id: 'contacted', name: 'Contacted', color: '#8B5CF6', order: 1 },
  { id: 'meeting', name: 'Meeting Scheduled', color: '#F59E0B', order: 2 },
  { id: 'proposal', name: 'Proposal Sent', color: '#EC4899', order: 3 },
  { id: 'negotiation', name: 'Negotiation', color: '#10B981', order: 4 },
  { id: 'won', name: 'Won', color: '#22C55E', order: 5 },
  { id: 'lost', name: 'Lost', color: '#EF4444', order: 6 },
];

// Format phone number for display (e.g., 61431584031 -> +61 431 584 031)
const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  // Remove any existing formatting
  const digits = phone.replace(/\D/g, '');
  // Australian number format
  if (digits.startsWith('61') && digits.length === 11) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  // If starts with 0, assume Australian local format
  if (digits.startsWith('0') && digits.length === 10) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  // Default: just add spaces every 3-4 digits
  return phone;
};

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
  | 'testimonials'
  | 'territory'
  | 'api';

interface Testimonial {
  id: string;
  reviewerName: string;
  date: string;
  rating: number;
  text: string;
  propertyAddress?: string;
  source?: string;
  isTopFive: boolean;
  order?: number;
}

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
          description: 'View your login method and account security.',
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
          id: 'territory', 
          label: 'Territory expansion', 
          description: 'Unlock leads in nearby suburbs to grow your coverage area.',
          iconBg: 'bg-gradient-to-br from-amber-100 to-orange-100',
          iconColor: 'text-amber-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
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
          id: 'testimonials', 
          label: 'Testimonial database', 
          description: 'Import and manage client reviews for your reports.',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ),
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
    {
      title: 'Admin',
      items: [
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
  
  // Personal details state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agency, setAgency] = useState('');
  const [position, setPosition] = useState('');
  const [savingPersonal, setSavingPersonal] = useState(false);
  
  // Branding state for Instant Appraisal Reports
  const [agentPhoto, setAgentPhoto] = useState<string>('');
  const [agencyLogo, setAgencyLogo] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState('#c8102e');
  const [secondaryColor, setSecondaryColor] = useState('#1a1a1a');
  const [agentTagline, setAgentTagline] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  
  // Pipeline stages state
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(defaultPipelineStages);
  const [loadingStages, setLoadingStages] = useState(false);
  const [savingStages, setSavingStages] = useState(false);
  const [draggedStageIndex, setDraggedStageIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Suburbs state
  const [subscribedSuburbs, setSubscribedSuburbs] = useState<string[]>([]);
  const [maxSuburbs, setMaxSuburbs] = useState(4);
  const [suburbPlanName, setSuburbPlanName] = useState('4 Suburb Plan');
  
  // Testimonials state
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [bulkPasteText, setBulkPasteText] = useState('');
  const [parsingTestimonials, setParsingTestimonials] = useState(false);
  const [aiSorting, setAiSorting] = useState(false);
  const [testimonialDragIndex, setTestimonialDragIndex] = useState<number | null>(null);
  const [testimonialDragOverIndex, setTestimonialDragOverIndex] = useState<number | null>(null);
  const [extractingColors, setExtractingColors] = useState(false);
  
  // Load saved branding on mount
  useEffect(() => {
    const savedBranding = localStorage.getItem('agentBranding');
    if (savedBranding) {
      const branding = JSON.parse(savedBranding);
      setAgentPhoto(branding.agentPhoto || '');
      setAgencyLogo(branding.agencyLogo || '');
      setPrimaryColor(branding.primaryColor || '#c8102e');
      setSecondaryColor(branding.secondaryColor || '#1a1a1a');
      setAgentTagline(branding.agentTagline || '');
      setLicenseNumber(branding.licenseNumber || '');
    }
    const savedPersona = localStorage.getItem('agentPersona');
    if (savedPersona) {
      const persona = JSON.parse(savedPersona);
      setPersonaStyle(persona.personaStyle || 'professional');
      setReaUrl(persona.reaUrl || '');
      setDomainUrl(persona.domainUrl || '');
      setWebsiteUrl(persona.websiteUrl || '');
      setBio(persona.bio || '');
    }
    // Load testimonials
    const savedTestimonials = localStorage.getItem('agentTestimonials');
    if (savedTestimonials) {
      setTestimonials(JSON.parse(savedTestimonials));
    }
  }, []);

  // Auto-save testimonials when they change (but not when clearing)
  useEffect(() => {
    // Only save if there are testimonials - clearing is handled separately
    if (testimonials.length > 0) {
      localStorage.setItem('agentTestimonials', JSON.stringify(testimonials));
    }
    // Note: localStorage.removeItem is called explicitly when clearing
  }, [testimonials]);

  // Load suburbs from API
  useEffect(() => {
    if (panel !== 'suburbs') return;
    
    const fetchSuburbs = async () => {
      try {
        const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
        if (token) {
          const response = await fetch(`${API_URL}/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const profile = await response.json();
            // Get suburbs from subscription object
            if (profile.subscription) {
              const sub = profile.subscription;
              const suburbs: string[] = [];
              if (sub.suburb1) suburbs.push(sub.suburb1);
              if (sub.suburb2) suburbs.push(sub.suburb2);
              if (sub.suburb3) suburbs.push(sub.suburb3);
              if (sub.suburb4) suburbs.push(sub.suburb4);
              if (sub.suburb5) suburbs.push(sub.suburb5);
              if (sub.suburb6) suburbs.push(sub.suburb6);
              setSubscribedSuburbs(suburbs);
              
              // Set plan name based on subscription type
              const planNames: Record<string, string> = {
                'one': '1 Suburb Plan',
                'two': '2 Suburb Plan',
                'four': '4 Suburb Plan',
                'six': '6 Suburb Plan',
              };
              setSuburbPlanName(planNames[sub.subscriptionType] || `${suburbs.length} Suburb Plan`);
              setMaxSuburbs(suburbs.length);
            } else if (profile.interestedSuburbs && profile.interestedSuburbs.length > 0) {
              setSubscribedSuburbs(profile.interestedSuburbs);
              setMaxSuburbs(profile.interestedSuburbs.length);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load suburbs:', err);
      }
    };
    
    fetchSuburbs();
  }, [panel]);

  // Load personal details from localStorage and API
  useEffect(() => {
    console.log('Personal details useEffect running, panel:', panel);
    // For security panel, we need phone number; for personal panel, we need all details
    if (panel !== 'personal' && panel !== 'security') return;
    
    // Load from localStorage immediately
    const savedUser = localStorage.getItem('propdeals_user');
    console.log('Raw localStorage propdeals_user:', savedUser);
    
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        console.log('Parsed user:', user);
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
        setPhone(user.phone || user.phoneNumber || '');
        setAgency(user.agency || user.agencyName || '');
        setPosition(user.position || user.role || '');
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
    
    // Then try to get fresh data from API
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
        console.log('Token exists:', !!token);
        if (token) {
          const response = await fetch(`${API_URL}/user/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const profile = await response.json();
            console.log('Loaded profile from API:', profile);
            if (profile.firstName) setFirstName(profile.firstName);
            if (profile.first_name) setFirstName(profile.first_name);
            if (profile.lastName) setLastName(profile.lastName);
            if (profile.last_name) setLastName(profile.last_name);
            if (profile.email) setEmail(profile.email);
            if (profile.phone || profile.mobile || profile.phoneNumber) {
              setPhone(profile.phone || profile.mobile || profile.phoneNumber);
            }
            if (profile.agency || profile.agencyName || profile.businessName) {
              setAgency(profile.agency || profile.agencyName || profile.businessName);
            }
            if (profile.position || profile.title || profile.role) {
              setPosition(profile.position || profile.title || profile.role);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load profile from API:', err);
      }
    };
    
    fetchProfile();
  }, [panel]);

  // Load pipeline stages when panel is pipeline
  useEffect(() => {
    if (panel === 'pipeline') {
      loadPipelineStages();
    }
  }, [panel]);

  const loadPipelineStages = async () => {
    setLoadingStages(true);
    try {
      const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
      if (!token) return;
      
      const response = await fetch(`${API_URL}/user/pipeline-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.stages && data.stages.length > 0) {
          setPipelineStages(data.stages.sort((a: PipelineStage, b: PipelineStage) => a.order - b.order));
        }
      }
    } catch (err) {
      console.log('Using default pipeline stages');
    } finally {
      setLoadingStages(false);
    }
  };

  const savePipelineStages = async (updatedStages: PipelineStage[]) => {
    setSavingStages(true);
    try {
      const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
      if (!token) return;
      
      await fetch(`${API_URL}/user/pipeline-settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stages: updatedStages }),
      });
    } catch (err) {
      console.error('Failed to save pipeline stages:', err);
    } finally {
      setSavingStages(false);
    }
  };

  const savePersonalDetails = async () => {
    setSavingPersonal(true);
    try {
      // Save to localStorage first
      const savedUser = localStorage.getItem('propdeals_user');
      const user = savedUser ? JSON.parse(savedUser) : {};
      const updatedUser = {
        ...user,
        firstName,
        lastName,
        name: `${firstName} ${lastName}`.trim(),
        email,
        phone,
        agency,
        agencyName: agency, // Also save as agencyName for compatibility
        position,
      };
      localStorage.setItem('propdeals_user', JSON.stringify(updatedUser));
      console.log('Saved user to localStorage:', updatedUser);
      
      // Try to save to API as well
      const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
      if (token) {
        await fetch(`${API_URL}/profile`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            agency,
            position,
          }),
        });
      }
      
      alert('Personal details saved successfully!');
    } catch (err) {
      console.error('Failed to save personal details:', err);
      alert('Saved locally. API sync may have failed.');
    } finally {
      setSavingPersonal(false);
    }
  };

  const updateStageName = (stageId: string, newName: string) => {
    const updated = pipelineStages.map(s => 
      s.id === stageId ? { ...s, name: newName } : s
    );
    setPipelineStages(updated);
  };

  const saveStageNameChange = () => {
    savePipelineStages(pipelineStages);
  };

  const addNewStage = () => {
    const newStage: PipelineStage = {
      id: `stage-${Date.now()}`,
      name: 'New Stage',
      color: '#6B7280',
      order: pipelineStages.length,
    };
    const updated = [...pipelineStages, newStage];
    setPipelineStages(updated);
    savePipelineStages(updated);
  };

  const deleteStage = (stageId: string) => {
    const updated = pipelineStages.filter(s => s.id !== stageId);
    setPipelineStages(updated);
    savePipelineStages(updated);
  };

  // Drag and drop handlers for reordering stages
  const handleStageDragStart = (e: React.DragEvent, index: number) => {
    setDraggedStageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleStageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleStageDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleStageDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedStageIndex === null || draggedStageIndex === dropIndex) {
      setDraggedStageIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder the stages
    const newStages = [...pipelineStages];
    const [draggedItem] = newStages.splice(draggedStageIndex, 1);
    newStages.splice(dropIndex, 0, draggedItem);

    // Update order property for all stages
    const reorderedStages = newStages.map((stage, idx) => ({
      ...stage,
      order: idx,
    }));

    setPipelineStages(reorderedStages);
    savePipelineStages(reorderedStages);
    setDraggedStageIndex(null);
    setDragOverIndex(null);
  };

  const handleStageDragEnd = () => {
    setDraggedStageIndex(null);
    setDragOverIndex(null);
  };
  
  const panelTitles: Record<string, string> = {
    persona: 'Agent Persona',
    personal: 'Personal Details',
    notifications: 'Notification Preferences',
    security: 'Security',
    timezone: 'Time Zone',
    suburbs: 'Suburb Subscription',
    subscription: 'Billing & Subscription',
    pipeline: 'Pipeline Stages',
    testimonials: 'Testimonial Database',
    territory: 'Territory Expansion',
    api: 'API Connection',
  };

  const handleSave = () => {
    // Save to localStorage for now
    if (panel === 'persona') {
      localStorage.setItem('agentPersona', JSON.stringify({ personaStyle, reaUrl, domainUrl, websiteUrl, bio }));
      localStorage.setItem('agentBranding', JSON.stringify({ 
        agentPhoto, agencyLogo, primaryColor, secondaryColor, agentTagline, licenseNumber 
      }));
      alert('Settings saved!');
      onClose();
    } else if (panel === 'timezone') {
      localStorage.setItem('userTimezone', timezone);
      alert('Settings saved!');
      onClose();
    } else if (panel === 'personal') {
      savePersonalDetails();
      onClose();
    } else if (panel === 'testimonials') {
      localStorage.setItem('agentTestimonials', JSON.stringify(testimonials));
      alert('Testimonials saved!');
      onClose();
    } else {
      alert('Settings saved!');
      onClose();
    }
  };
  
  // Handle image upload (convert to base64)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (value: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Extract dominant colors from an image
  const extractColorsFromImage = (imageDataUrl: string) => {
    setExtractingColors(true);
    
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setExtractingColors(false);
        return;
      }
      
      // Scale down for faster processing
      const scale = Math.min(1, 100 / Math.max(img.width, img.height));
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Group colors into buckets
      const colorMap: Record<string, { count: number; r: number; g: number; b: number }> = {};
      
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];
        
        // Skip transparent/near-transparent pixels
        if (a < 128) continue;
        
        // Skip near-white and near-black pixels
        const brightness = (r + g + b) / 3;
        if (brightness > 240 || brightness < 15) continue;
        
        // Quantize to reduce noise (group similar colors)
        const qR = Math.round(r / 32) * 32;
        const qG = Math.round(g / 32) * 32;
        const qB = Math.round(b / 32) * 32;
        const key = `${qR},${qG},${qB}`;
        
        if (!colorMap[key]) {
          colorMap[key] = { count: 0, r: 0, g: 0, b: 0 };
        }
        colorMap[key].count++;
        colorMap[key].r += r;
        colorMap[key].g += g;
        colorMap[key].b += b;
      }
      
      // Sort by count and get top colors
      const sortedColors = Object.values(colorMap)
        .filter(c => c.count > 5)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      if (sortedColors.length >= 2) {
        // Average out the colors in each bucket
        const primary = sortedColors[0];
        const secondary = sortedColors[1];
        
        const pR = Math.round(primary.r / primary.count);
        const pG = Math.round(primary.g / primary.count);
        const pB = Math.round(primary.b / primary.count);
        
        const sR = Math.round(secondary.r / secondary.count);
        const sG = Math.round(secondary.g / secondary.count);
        const sB = Math.round(secondary.b / secondary.count);
        
        // Convert to hex
        const toHex = (r: number, g: number, b: number) => 
          '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        
        setPrimaryColor(toHex(pR, pG, pB));
        setSecondaryColor(toHex(sR, sG, sB));
      } else if (sortedColors.length === 1) {
        const primary = sortedColors[0];
        const pR = Math.round(primary.r / primary.count);
        const pG = Math.round(primary.g / primary.count);
        const pB = Math.round(primary.b / primary.count);
        const toHex = (r: number, g: number, b: number) => 
          '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
        setPrimaryColor(toHex(pR, pG, pB));
      }
      
      setExtractingColors(false);
    };
    
    img.onerror = () => {
      setExtractingColors(false);
      alert('Could not process the image. Please try a different format.');
    };
    
    img.src = imageDataUrl;
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

            {/* Branding for Appraisal Reports */}
            <div className="bg-gradient-to-br from-primary/5 to-red-50 rounded-xl border border-primary/20 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Appraisal Report Branding</h3>
                  <p className="text-sm text-gray-500">Your branding will appear on generated appraisal reports</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Photo & Logo Uploads */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Agent Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Headshot</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {agentPhoto ? (
                          <img src={agentPhoto} alt="Agent" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <label className="cursor-pointer bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                          Upload Photo
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, setAgentPhoto)}
                          />
                        </label>
                        {agentPhoto && (
                          <button 
                            onClick={() => setAgentPhoto('')}
                            className="ml-2 text-sm text-red-600 hover:text-red-700"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Agency Logo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agency Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                        {agencyLogo ? (
                          <img src={agencyLogo} alt="Agency Logo" className="w-full h-full object-contain p-1" />
                        ) : (
                          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <label className="cursor-pointer bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Upload Logo
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, setAgencyLogo)}
                            />
                          </label>
                          {agencyLogo && (
                            <button 
                              onClick={() => setAgencyLogo('')}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        {agencyLogo && (
                          <button
                            onClick={() => extractColorsFromImage(agencyLogo)}
                            disabled={extractingColors}
                            className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-medium rounded-lg hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 transition-all"
                          >
                            {extractingColors ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Extracting...</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                                <span>Extract Colors</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Brand Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Colors</label>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Primary</p>
                        <p className="text-xs text-gray-500">{primaryColor}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Secondary</p>
                        <p className="text-xs text-gray-500">{secondaryColor}</p>
                      </div>
                    </div>
                    {/* Preview Button */}
                    <div className="flex-1 flex justify-end">
                      <button 
                        onClick={() => {
                          // Save current branding to localStorage before preview
                          const branding = {
                            headshot: agentPhoto,
                            logo: agencyLogo,
                            primaryColor,
                            secondaryColor,
                            tagline: agentTagline,
                            licenseNumber,
                            reaUrl,
                            domainUrl,
                            websiteUrl,
                            bio
                          };
                          localStorage.setItem('agentBranding', JSON.stringify(branding));
                          // Open preview report in new tab with sample property
                          window.open('/report/preview/sample-property', '_blank');
                        }}
                        className="px-4 py-2 rounded-lg text-white text-sm font-medium cursor-pointer hover:opacity-90 transition-opacity"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Tagline & License */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Personal Tagline (optional)</label>
                    <input
                      type="text"
                      value={agentTagline}
                      onChange={(e) => setAgentTagline(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Your local property expert"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">License Number (optional)</label>
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="e.g. 12345678"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="font-medium text-gray-900 mb-4">Online Profiles</h4>
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
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">About You</h4>
                  <p className="text-sm text-gray-500 mb-3">A short bio that can be used in communications and reports</p>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="I'm a local real estate agent with 10 years of experience..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'personal':
        return (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {firstName && lastName ? `${firstName[0]}${lastName[0]}`.toUpperCase() : 'TR'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">
                    {firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Your Name'}
                  </h2>
                  <p className="text-gray-500">{position || 'Agent'}</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">Pro Member</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Details Form */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">First Name</label>
                    <input 
                      type="text" 
                      placeholder="First name" 
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Last name" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    placeholder="Phone number" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Agency</label>
                    <input 
                      type="text" 
                      placeholder="Agency name" 
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-1">Position / Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Sales Agent" 
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary" 
                    />
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
              <h3 className="font-semibold text-gray-900 mb-4">Your Login Method</h3>
              <p className="text-sm text-gray-500 mb-4">
                You log in to Get Listings using your mobile phone number. Each time you sign in, 
                we send a one-time verification code via SMS to confirm it's you.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <label className="block text-sm text-gray-500 mb-1">Registered Phone Number</label>
                <p className="text-lg font-semibold text-gray-900">{phone ? formatPhoneNumber(phone) : 'Loading...'}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Need to Change Your Phone Number?</h3>
              <p className="text-sm text-gray-500 mb-4">
                If you've changed your phone number and need to update your login details, 
                please contact our support team and we'll help you get sorted.
              </p>
              <a 
                href="https://m.me/GetListings" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.438 5.503 3.686 7.2V22l3.382-1.853c.903.25 1.861.386 2.932.386 5.523 0 10-4.145 10-9.243S17.523 2 12 2z"/>
                </svg>
                Contact Support
              </a>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">Why phone-based login?</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Phone verification is more secure than passwords - there's nothing to remember or steal. 
                    Your phone number is your identity, and the SMS code proves you have access to it.
                  </p>
                </div>
              </div>
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
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">{suburbPlanName}</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {subscribedSuburbs.length > 0 ? subscribedSuburbs.map((suburb) => (
                  <span key={suburb} className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm">
                    {suburb}
                  </span>
                )) : (
                  <span className="text-gray-500">Loading...</span>
                )}
              </div>
              <p className="text-sm text-gray-500">Your current plan allows up to <strong>{maxSuburbs}</strong> suburbs.</p>
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
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Customise your pipeline stages. Edit names and they'll sync across the Portal.</p>
              {savingStages && <span className="text-xs text-gray-400">Saving...</span>}
            </div>
            {loadingStages ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {pipelineStages.map((stage, idx) => (
                    <div 
                      key={stage.id} 
                      draggable
                      onDragStart={(e) => handleStageDragStart(e, idx)}
                      onDragOver={(e) => handleStageDragOver(e, idx)}
                      onDragLeave={handleStageDragLeave}
                      onDrop={(e) => handleStageDrop(e, idx)}
                      onDragEnd={handleStageDragEnd}
                      className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 transition-all ${
                        draggedStageIndex === idx ? 'opacity-50 bg-gray-50' : ''
                      } ${
                        dragOverIndex === idx && draggedStageIndex !== idx ? 'border-t-2 border-t-primary' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 select-none">⋮⋮</div>
                        <div 
                          className="w-4 h-4 rounded" 
                          style={{ backgroundColor: stage.color }}
                        ></div>
                        <input 
                          type="text" 
                          value={stage.name} 
                          onChange={(e) => updateStageName(stage.id, e.target.value)}
                          onBlur={() => saveStageNameChange()}
                          onKeyDown={(e) => e.key === 'Enter' && saveStageNameChange()}
                          className="font-medium text-gray-900 border-none focus:ring-2 focus:ring-primary/20 rounded px-2 py-1 -ml-2" 
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => deleteStage(stage.id)}
                          className="text-gray-400 hover:text-red-500 text-xl"
                          title="Delete stage"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={addNewStage}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-primary hover:text-primary transition-colors"
                >
                  + Add Stage
                </button>
              </>
            )}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700"><strong>💡 Tip:</strong> You can also edit stages directly in the Pipeline view by clicking on stage names.</p>
            </div>
          </div>
        );

      case 'testimonials':
        // Parse bulk pasted testimonials from realestate.com.au format
        const parseTestimonials = () => {
          if (!bulkPasteText.trim()) {
            alert('Please paste some testimonials first');
            return;
          }
          
          setParsingTestimonials(true);
          
          const parsedTestimonials: Testimonial[] = [];
          
          // RealEstate.com.au format detection:
          // Pattern: "5.0" or "5" followed by "Verified review", then "Seller/Buyer of...", then "X months/years ago", then review text
          
          // Split by rating pattern (5.0 or 5 at start of line)
          const ratingPattern = /^(\d\.?\d?)\s*$/gm;
          const text = bulkPasteText;
          
          // Find all rating positions
          const matches: { rating: number; startIndex: number }[] = [];
          let match;
          const ratingRegex = /^(\d\.?\d?)\s*$/gm;
          while ((match = ratingRegex.exec(text)) !== null) {
            const rating = parseFloat(match[1]);
            if (rating >= 1 && rating <= 5) {
              matches.push({ rating, startIndex: match.index });
            }
          }
          
          // Process each review block
          for (let i = 0; i < matches.length; i++) {
            const startIdx = matches[i].startIndex;
            const endIdx = i < matches.length - 1 ? matches[i + 1].startIndex : text.length;
            const block = text.substring(startIdx, endIdx).trim();
            
            const lines = block.split('\n').map(l => l.trim()).filter(l => l);
            
            if (lines.length < 3) continue; // Need at least rating, some metadata, and review text
            
            let rating = matches[i].rating;
            let reviewerType = '';
            let location = '';
            let relativeDate = '';
            let reviewText = '';
            
            for (let j = 1; j < lines.length; j++) {
              const line = lines[j];
              
              // Skip "Verified review" line
              if (/^verified\s*review$/i.test(line)) continue;
              
              // Check for "Seller of house in Location, STATE" or "Buyer of apartment in Location, STATE"
              const sellerBuyerMatch = line.match(/^(Seller|Buyer)\s+of\s+(\w+(?:\s+\w+)?)\s+in\s+(.+)$/i);
              if (sellerBuyerMatch) {
                reviewerType = sellerBuyerMatch[1]; // Seller or Buyer
                const propertyType = sellerBuyerMatch[2]; // house, apartment, villa, etc.
                location = sellerBuyerMatch[3]; // Sanctuary Cove, QLD
                continue;
              }
              
              // Check for relative date pattern: "1 month ago", "2 years ago", "1 year 4 months ago"
              const dateMatch = line.match(/^(\d+\s+(?:year|month|week|day)s?(?:\s+\d+\s+(?:year|month|week|day)s?)?)\s+ago$/i);
              if (dateMatch) {
                relativeDate = line;
                // Convert relative date to approximate actual date
                const now = new Date();
                const parts = dateMatch[1].toLowerCase();
                
                // Parse years
                const yearMatch = parts.match(/(\d+)\s*year/);
                if (yearMatch) {
                  now.setFullYear(now.getFullYear() - parseInt(yearMatch[1]));
                }
                
                // Parse months
                const monthMatch = parts.match(/(\d+)\s*month/);
                if (monthMatch) {
                  now.setMonth(now.getMonth() - parseInt(monthMatch[1]));
                }
                
                relativeDate = now.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
                continue;
              }
              
              // Skip star emoji lines
              if (/^[⭐★]+$/.test(line)) continue;
              
              // Everything else is review text
              if (line.length > 0) {
                reviewText += (reviewText ? ' ' : '') + line;
              }
            }
            
            // Only add if we have actual review text
            if (reviewText.length > 10) {
              parsedTestimonials.push({
                id: `imported-${Date.now()}-${parsedTestimonials.length}`,
                reviewerName: reviewerType && location ? `${reviewerType} in ${location}` : 'Verified review',
                date: relativeDate || 'Unknown date',
                rating: Math.round(rating),
                text: reviewText.trim(),
                propertyAddress: location || undefined,
                source: 'realestate.com.au',
                isTopFive: false,
              });
            }
          }
          
          // Fallback: If the REA format didn't work, try generic parsing
          if (parsedTestimonials.length === 0 && bulkPasteText.length > 50) {
            // Just split by double newlines or long gaps
            const chunks = bulkPasteText.split(/\n\s*\n/).filter(c => c.trim().length > 30);
            chunks.forEach((chunk, idx) => {
              parsedTestimonials.push({
                id: `imported-${Date.now()}-${idx}`,
                reviewerName: 'Client Review',
                date: new Date().toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }),
                rating: 5,
                text: chunk.trim().substring(0, 500),
                source: 'Imported',
                isTopFive: false,
              });
            });
          }
          
          if (parsedTestimonials.length > 0) {
            setTestimonials(prev => [...prev, ...parsedTestimonials]);
            setBulkPasteText('');
            alert(`Successfully imported ${parsedTestimonials.length} testimonial(s)!`);
          } else {
            alert('Could not parse any testimonials. Try pasting them in a clearer format.');
          }
          
          setParsingTestimonials(false);
        };
        
        // AI sort testimonials - selects the best ones for top 5
        const aiSortTestimonials = () => {
          if (testimonials.length === 0) {
            alert('No testimonials to sort. Import some first!');
            return;
          }
          
          setAiSorting(true);
          
          // Simulate AI processing (in reality, this would call an AI API)
          setTimeout(() => {
            // Score testimonials based on various factors
            const scored = testimonials.map(t => {
              let score = 0;
              
              // Longer reviews are often more impactful
              score += Math.min(t.text.length / 50, 5);
              
              // 5-star ratings
              score += t.rating;
              
              // Reviews with specific property addresses seem more legitimate
              if (t.propertyAddress) score += 2;
              
              // Reviews with certain positive keywords
              const positiveWords = ['excellent', 'outstanding', 'professional', 'recommend', 'fantastic', 'amazing', 'best', 'exceptional', 'wonderful', 'great', 'superb', 'dedicated'];
              positiveWords.forEach(word => {
                if (t.text.toLowerCase().includes(word)) score += 1;
              });
              
              // Reviews mentioning results/outcomes
              if (t.text.toLowerCase().includes('sold') || t.text.toLowerCase().includes('price') || t.text.toLowerCase().includes('expectations')) {
                score += 2;
              }
              
              return { testimonial: t, score };
            });
            
            // Sort by score descending
            scored.sort((a, b) => b.score - a.score);
            
            // Mark top 5 as featured
            const updated = testimonials.map(t => {
              const rank = scored.findIndex(s => s.testimonial.id === t.id);
              return {
                ...t,
                isTopFive: rank < 5,
                order: rank < 5 ? rank : undefined,
              };
            });
            
            setTestimonials(updated);
            setAiSorting(false);
            alert('AI has selected your top 5 testimonials! You can adjust the order by dragging.');
          }, 1500);
        };
        
        // Toggle top 5 status
        const toggleTopFive = (id: string) => {
          const currentTopFive = testimonials.filter(t => t.isTopFive);
          const targetTestimonial = testimonials.find(t => t.id === id);
          
          if (!targetTestimonial) return;
          
          if (targetTestimonial.isTopFive) {
            // Remove from top 5
            setTestimonials(prev => prev.map(t => 
              t.id === id ? { ...t, isTopFive: false, order: undefined } : t
            ));
          } else {
            // Add to top 5 (if less than 5)
            if (currentTopFive.length >= 5) {
              alert('You can only have 5 featured testimonials. Remove one first.');
              return;
            }
            setTestimonials(prev => prev.map(t => 
              t.id === id ? { ...t, isTopFive: true, order: currentTopFive.length } : t
            ));
          }
        };
        
        // Delete testimonial
        const deleteTestimonial = (id: string) => {
          if (confirm('Delete this testimonial?')) {
            setTestimonials(prev => prev.filter(t => t.id !== id));
          }
        };
        
        // Handle drag reorder for top 5
        const handleTestimonialDragStart = (e: React.DragEvent, index: number) => {
          setTestimonialDragIndex(index);
          e.dataTransfer.effectAllowed = 'move';
        };
        
        const handleTestimonialDragOver = (e: React.DragEvent, index: number) => {
          e.preventDefault();
          setTestimonialDragOverIndex(index);
        };
        
        const handleTestimonialDrop = (e: React.DragEvent, dropIndex: number) => {
          e.preventDefault();
          if (testimonialDragIndex === null) return;
          
          const topFive = testimonials.filter(t => t.isTopFive).sort((a, b) => (a.order || 0) - (b.order || 0));
          const draggedItem = topFive[testimonialDragIndex];
          
          // Reorder
          const newTopFive = [...topFive];
          newTopFive.splice(testimonialDragIndex, 1);
          newTopFive.splice(dropIndex, 0, draggedItem);
          
          // Update orders
          const newTopFiveWithOrders = newTopFive.map((t, i) => ({ ...t, order: i }));
          
          setTestimonials(prev => prev.map(t => {
            const updated = newTopFiveWithOrders.find(u => u.id === t.id);
            return updated || t;
          }));
          
          setTestimonialDragIndex(null);
          setTestimonialDragOverIndex(null);
        };
        
        const topFiveTestimonials = testimonials.filter(t => t.isTopFive).sort((a, b) => (a.order || 0) - (b.order || 0));
        const otherTestimonials = testimonials.filter(t => !t.isTopFive);
        
        return (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <div>
                  <h3 className="font-semibold text-yellow-800">Showcase Your Best Reviews</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Import testimonials from realestate.com.au or Domain, then select your top 5 to feature in your property reports.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Bulk Import Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Bulk Import Testimonials
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Copy and paste testimonials from realestate.com.au or Domain. Include reviewer names, dates, and the review text.
              </p>
              <textarea
                value={bulkPasteText}
                onChange={(e) => setBulkPasteText(e.target.value)}
                placeholder="Paste your testimonials here...

Example format:
★★★★★
John Smith
December 2025
Outstanding service! They helped us sell our home for above asking price...

★★★★★
Sarah M.
November 2025
Professional and dedicated agent..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
              />
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={parseTestimonials}
                  disabled={parsingTestimonials || !bulkPasteText.trim()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                >
                  {parsingTestimonials ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Import Testimonials
                    </>
                  )}
                </button>
                <span className="text-sm text-gray-500">
                  {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''} in database
                </span>
                {testimonials.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Delete ALL ' + testimonials.length + ' testimonials including Top 5? This cannot be undone.')) {
                        setTestimonials([]);
                        localStorage.removeItem('agentTestimonials');
                      }
                    }}
                    className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-2"
                  >
                    (clear all)
                  </button>
                )}
              </div>
            </div>
            
            {/* Top 5 Featured Section */}
            <div className="bg-gradient-to-br from-primary/5 to-red-50 rounded-xl border border-primary/20 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    Top 5 Featured Testimonials
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    These will appear on your property reports. Drag to reorder.
                  </p>
                </div>
                <button
                  onClick={aiSortTestimonials}
                  disabled={aiSorting || testimonials.length === 0}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2 shadow-lg shadow-purple-200"
                >
                  {aiSorting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      AI Sorting...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      AI Sort for Me
                    </>
                  )}
                </button>
              </div>
              
              {topFiveTestimonials.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📝</div>
                  <p>No featured testimonials yet.</p>
                  <p className="text-sm">Import testimonials and click the star icon to feature them, or use "AI Sort for Me".</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topFiveTestimonials.map((testimonial, index) => (
                    <div
                      key={testimonial.id}
                      draggable
                      onDragStart={(e) => handleTestimonialDragStart(e, index)}
                      onDragOver={(e) => handleTestimonialDragOver(e, index)}
                      onDrop={(e) => handleTestimonialDrop(e, index)}
                      className={`bg-white rounded-lg p-4 border-2 cursor-move transition-all ${
                        testimonialDragOverIndex === index ? 'border-primary border-dashed' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{testimonial.reviewerName}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{testimonial.date}</span>
                            <div className="flex items-center ml-auto">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-3 h-3 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{testimonial.text}</p>
                          {testimonial.propertyAddress && (
                            <p className="text-xs text-gray-400 mt-1">📍 {testimonial.propertyAddress}</p>
                          )}
                        </div>
                        <button
                          onClick={() => toggleTopFive(testimonial.id)}
                          className="text-yellow-500 hover:text-yellow-600"
                          title="Remove from featured"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* All Testimonials List */}
            {otherTestimonials.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    All Testimonials ({otherTestimonials.length})
                  </h3>
                  <button
                    onClick={() => {
                      if (confirm('Delete ALL testimonials? This cannot be undone.')) {
                        setTestimonials([]);
                        localStorage.removeItem('agentTestimonials');
                      }
                    }}
                    className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                  >
                    clear all
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {otherTestimonials.map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-100"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900">{testimonial.reviewerName}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{testimonial.date}</span>
                            <div className="flex items-center ml-2">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-3 h-3 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{testimonial.text}</p>
                          {testimonial.source && (
                            <p className="text-xs text-gray-400 mt-1">via {testimonial.source}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleTopFive(testimonial.id)}
                            className="text-gray-400 hover:text-yellow-500"
                            title="Add to featured"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTestimonial(testimonial.id)}
                            className="text-gray-400 hover:text-red-500"
                            title="Delete"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tips */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-sm text-blue-700">
                <strong>💡 Tip:</strong> The more testimonials you import, the better AI can select the most impactful ones for your reports. 
                Reviews mentioning specific results, prices achieved, or professional service tend to perform best.
              </p>
            </div>
          </div>
        );

      case 'territory':
        return (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900">Expand Your Territory</h4>
                  <p className="text-sm text-amber-700 mt-1">Get access to high-potential leads in suburbs adjacent to your current coverage area.</p>
                </div>
              </div>
            </div>

            {/* Current Coverage */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Your Current Coverage</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>{subscribedSuburbs.length} Active</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {subscribedSuburbs.length > 0 ? subscribedSuburbs.map((suburb) => (
                  <span key={suburb} className="inline-flex items-center px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm border border-green-200">
                    <svg className="w-4 h-4 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {suburb}
                  </span>
                )) : (
                  <span className="text-gray-500">Loading your suburbs...</span>
                )}
              </div>
            </div>

            {/* Nearby Suburbs - Locked */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Nearby Suburbs Available</h3>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Locked</span>
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-4">These suburbs are adjacent to your current coverage and have seller leads waiting.</p>
              
              {/* Blurred/locked nearby suburbs */}
              <div className="grid grid-cols-2 gap-3">
                {['Paddington', 'Red Hill', 'Kelvin Grove', 'Newmarket', 'Bardon', 'Milton'].map((suburb) => (
                  <div key={suburb} className="relative p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] rounded-xl flex items-center justify-center z-10">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{suburb}</p>
                        <p className="text-xs text-gray-500">Near your area</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">? leads</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upgrade CTA */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Expand Your Territory</h3>
                  <p className="text-amber-100 mt-1">Get access to high-potential leads in suburbs near your current coverage</p>
                  <div className="flex items-center space-x-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">Instant access</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">Full contact details</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm">AI insights included</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-amber-200 text-sm">Starting from</p>
                  <p className="text-3xl font-bold">$49<span className="text-lg font-normal">/suburb/mo</span></p>
                  <button className="mt-2 px-6 py-2 bg-white text-amber-600 rounded-lg text-sm font-semibold hover:bg-amber-50 transition-colors">
                    View Packages
                  </button>
                </div>
              </div>
            </div>

            {/* Bundle Packages */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Single Suburb */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-gray-900">Single Suburb</h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">Basic</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$49</span>
                  <span className="text-gray-500">/mo</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>1 additional suburb</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Full lead access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI insights</span>
                  </li>
                </ul>
                <button className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  Select Suburb
                </button>
              </div>

              {/* 3 Suburb Bundle */}
              <div className="bg-white rounded-xl border-2 border-blue-200 p-5 hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">Popular</span>
                </div>
                <div className="flex items-center justify-between mb-3 mt-2">
                  <h4 className="font-bold text-gray-900">3 Suburb Bundle</h4>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$79</span>
                  <span className="text-gray-500">/mo</span>
                  <span className="ml-2 text-sm text-green-600 font-medium">Save $68</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>3 additional suburbs</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Full lead access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI insights + priority support</span>
                  </li>
                </ul>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Choose 3 Suburbs
                </button>
              </div>

              {/* 6 Suburb Bundle */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 p-5 hover:shadow-lg transition-shadow relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full">BEST VALUE</span>
                </div>
                <div className="flex items-center justify-between mb-3 mt-2">
                  <h4 className="font-bold text-gray-900">6 Suburb Bundle</h4>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded">Pro</span>
                </div>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-500">/mo</span>
                  <span className="ml-2 text-sm text-green-600 font-medium">Save $195</span>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-4">
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>All 6 nearby suburbs</strong></span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Unlimited lead access</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>AI insights + priority support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Exclusive territory protection</span>
                  </li>
                </ul>
                <button className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg text-sm font-bold hover:from-amber-600 hover:to-orange-600 transition-colors shadow-lg shadow-amber-500/25">
                  Get All 6 Suburbs
                </button>
              </div>
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
        {panel !== 'security' && (
          <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 font-medium">
            Save Changes
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 max-w-4xl mx-auto">
        {renderPanelContent()}
      </div>
    </div>
  );
}
