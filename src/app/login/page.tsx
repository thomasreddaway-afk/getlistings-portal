'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import SuburbAutocomplete from '@/components/SuburbAutocomplete';

// API Base URL for prop.deals - configurable via env var for local testing
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

type AuthStep = 'phone' | 'code' | 'loading';
type OnboardingStep = 'welcome' | 'email' | 'business' | 'suburbs' | 'referral' | 'usage' | 'success';

// Agency suggestions for autocomplete
const AGENCY_SUGGESTIONS = [
  'McGrath', 'Ray White', 'Harcourts', 'Raine & Horne', 'Elders', 'LJ Hooker',
  'First National', 'One Agency', 'Place', 'Century 21', 'One Group Realty', 'Space'
];

// Referral sources
const REFERRAL_SOURCES = [
  { id: 'friend', label: 'Referral by friend', icon: '👤' },
  { id: 'office', label: 'Referral by office', icon: '🏢' },
  { id: 'google', label: 'Google', icon: '🔍' },
  { id: 'facebook', label: 'Facebook', icon: '📘' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'other', label: 'Other', icon: '✨' },
];

// Usage options
const USAGE_OPTIONS = [
  {
    id: 'insights',
    title: "I'm looking for market insights & seller signals to find future listings",
    description: 'Get daily AI insights on homes likely to sell soon, using 15+ data signals like:',
    features: ['Valuation requests', 'Garage Sales', 'Homeowner & property tags online', 'New properties for sale & rent', 'Proximity selling triggers', 'Sales history', 'Competitor ad analysis'],
  },
  {
    id: 'leads',
    title: 'I only want ready-to-go seller leads',
    description: 'I only want homeowners who are actively looking to sell & ready to talk now.',
  },
];

export default function LoginPage() {
  const router = useRouter();
  
  // Auth state
  const [authStep, setAuthStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  
  // Onboarding state
  const [isNewUser, setIsNewUser] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('welcome');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [showAgencySuggestions, setShowAgencySuggestions] = useState(false);
  const [suburbs, setSuburbs] = useState<string[]>(['', '', '']);
  const [referralSource, setReferralSource] = useState('');
  const [usageType, setUsageType] = useState('');

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const formatPhoneDisplay = (value: string) => {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 10)}`;
  };

  const normalizePhoneForApi = (value: string): string | null => {
    const parsed = parsePhoneNumberFromString(value, 'AU');
    if (!parsed?.isValid()) return null;
    const e164 = parsed.format('E.164');
    return e164.replace(/^\+/, '');
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const normalized = normalizePhoneForApi(phone);
    if (!normalized) {
      setError('Please enter a valid Australian mobile number');
      return;
    }

    setFormattedPhone(normalized);
    setAuthStep('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/get-code-VBAjxKD7`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: normalized })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to send verification code');
      }

      setAuthStep('code');
      setResendTimer(60);
    } catch (err: any) {
      console.error('Error sending code:', err);
      setError(err.message || 'Failed to send verification code');
      setAuthStep('phone');
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6);
      const newCode = [...code];
      digits.split('').forEach((digit, i) => {
        if (index + i < 6) newCode[index + i] = digit;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      document.getElementById(`code-${nextIndex}`)?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value.replace(/\D/g, '');
      setCode(newCode);
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  const handleVerifyCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the 6-digit code');
      return;
    }

    setAuthStep('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login-9G8LNToV`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phoneNumber: formattedPhone, 
          code: fullCode 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Invalid verification code');
      }

      if (data.accessToken) {
        localStorage.setItem('propdeals_jwt', data.accessToken);
        if (data.refreshToken) {
          localStorage.setItem('propdeals_refresh', data.refreshToken);
        }

        // Store user data if provided
        if (data.user) {
          localStorage.setItem('propdeals_user', JSON.stringify(data.user));
        }

        // Check if this is a new registration (isNewUser flag from API) or existing user
        // The API should indicate if this is a first-time login
        const isFirstTimeUser = data.isNewUser === true || data.isNew === true || data.requiresOnboarding === true;
        
        if (isFirstTimeUser) {
          // New user - needs onboarding
          setIsNewUser(true);
          setOnboardingStep('welcome');
        } else {
          // Existing user - go straight to dashboard
          router.push('/dashboard');
        }
      } else {
        throw new Error('No access token received');
      }
    } catch (err: any) {
      console.error('Error verifying code:', err);
      setError(err.message || 'Invalid verification code');
      setAuthStep('code');
    }
  };

  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setError('');
    setAuthStep('loading');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/get-code-VBAjxKD7`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formattedPhone })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to resend code');
      }

      setAuthStep('code');
      setCode(['', '', '', '', '', '']);
      setResendTimer(60);
    } catch (err: any) {
      console.error('Error resending code:', err);
      setError(err.message || 'Failed to resend code');
      setAuthStep('code');
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleOnboardingNext = async () => {
    switch (onboardingStep) {
      case 'welcome':
        if (!firstName.trim() || !lastName.trim()) {
          setError('Please enter your first and last name');
          return;
        }
        setError('');
        setOnboardingStep('email');
        break;
      case 'email':
        if (!validateEmail(email)) {
          setEmailError('Please enter a valid email address');
          return;
        }
        setEmailError('');
        setOnboardingStep('business');
        break;
      case 'business':
        if (!agencyName.trim()) {
          setError('Please enter your agency name');
          return;
        }
        setError('');
        setOnboardingStep('suburbs');
        break;
      case 'suburbs':
        const filledSuburbs = suburbs.filter(s => s.trim());
        if (filledSuburbs.length === 0) {
          setError('Please add at least one suburb');
          return;
        }
        setError('');
        setOnboardingStep('referral');
        break;
      case 'referral':
        if (!referralSource) {
          setError('Please select how you found us');
          return;
        }
        setError('');
        setOnboardingStep('usage');
        break;
      case 'usage':
        if (!usageType) {
          setError('Please select how you will use Get Listings');
          return;
        }
        setError('');
        // Submit onboarding data
        await submitOnboarding();
        break;
      case 'success':
        router.push('/dashboard');
        break;
    }
  };

  const submitOnboarding = async () => {
    try {
      const token = localStorage.getItem('propdeals_jwt');
      const filledSuburbs = suburbs.filter(s => s.trim());
      
      const response = await fetch(`${API_BASE_URL}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          agencyName,
          suburbs: filledSuburbs,
          referralSource,
          usageType
        })
      });

      if (!response.ok) {
        console.error('Failed to save profile, continuing anyway');
      }

      setOnboardingStep('success');
    } catch (err) {
      console.error('Error saving profile:', err);
      // Continue to success anyway for demo purposes
      setOnboardingStep('success');
    }
  };

  const handleSuburbChange = (index: number, value: string) => {
    const newSuburbs = [...suburbs];
    newSuburbs[index] = value;
    setSuburbs(newSuburbs);
  };

  // Auto-submit when all code digits are entered
  useEffect(() => {
    if (code.every(d => d) && authStep === 'code') {
      handleVerifyCode();
    }
  }, [code]);

  // Onboarding progress
  const onboardingSteps: OnboardingStep[] = ['welcome', 'email', 'business', 'suburbs', 'referral', 'usage'];
  const currentStepIndex = onboardingSteps.indexOf(onboardingStep);

  // Blurred Dashboard Preview Component
  const DashboardPreview = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Fake Dashboard Content */}
      <div className="w-full h-full bg-gray-50 p-8" style={{ filter: 'blur(0.5px)', transform: 'scale(1.02)' }}>
        {/* Top Nav */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-primary rounded-lg"></div>
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-20 bg-gray-100 rounded-lg"></div>
            <div className="h-8 w-20 bg-gray-100 rounded-lg"></div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-3 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-16 bg-primary/20 rounded"></div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Leads Table */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="h-4 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-orange-400 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-3 w-32 bg-gray-200 rounded mb-2"></div>
                    <div className="h-2 w-24 bg-gray-100 rounded"></div>
                  </div>
                  <div className="h-6 w-12 bg-red-100 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-50 rounded-lg"></div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary to-red-600 rounded-xl shadow-sm p-6">
              <div className="h-4 w-20 bg-white/30 rounded mb-2"></div>
              <div className="h-8 w-16 bg-white/40 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40"></div>
    </div>
  );

  // Render Onboarding Flow
  if (isNewUser) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Header */}
        {onboardingStep !== 'success' && (
          <div className="p-4 flex items-center justify-between border-b border-gray-100">
            <button
              onClick={() => {
                if (currentStepIndex > 0) {
                  setOnboardingStep(onboardingSteps[currentStepIndex - 1]);
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={currentStepIndex === 0}
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Progress Dots */}
            <div className="flex gap-2">
              {onboardingSteps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i <= currentStepIndex ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            
            <div className="w-10"></div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 flex flex-col px-6 py-8 max-w-md mx-auto w-full">
          {/* Welcome Step */}
          {onboardingStep === 'welcome' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Welcome to Get Listings</h1>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
            </>
          )}

          {/* Email Step */}
          {onboardingStep === 'email' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Enter your email address</h1>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError('');
                    }}
                    placeholder="Email address"
                    className={`w-full pl-12 pr-12 py-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                      emailError ? 'border-red-300' : 'border-gray-200'
                    }`}
                  />
                  {email && validateEmail(email) && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-600">{emailError}</p>
                )}
              </div>
            </>
          )}

          {/* Business Details Step */}
          {onboardingStep === 'business' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">Enter your business details</h1>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    onFocus={() => setShowAgencySuggestions(true)}
                    onBlur={() => setTimeout(() => setShowAgencySuggestions(false), 200)}
                    placeholder="Company"
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Agency Suggestions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {AGENCY_SUGGESTIONS.map((agency) => (
                    <button
                      key={agency}
                      type="button"
                      onClick={() => setAgencyName(agency)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        agencyName === agency
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {agency} ×
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
            </>
          )}

          {/* Suburbs Step */}
          {onboardingStep === 'suburbs' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Which suburbs would you like seller insights from?</h1>
              <p className="text-sm text-gray-500 mb-8">Additional suburbs can be added after registration.</p>
              
              <div className="space-y-4">
                {suburbs.map((suburb, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Suburb #{index + 1}</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <SuburbAutocomplete
                        className="w-full"
                        inputClassName="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter a suburb"
                        onPlaceSelect={(place) => {
                          if (place.name) {
                            handleSuburbChange(index, place.name);
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
            </>
          )}

          {/* Referral Step */}
          {onboardingStep === 'referral' && (
            <>
              <h1 className="text-2xl font-bold text-gray-900 mb-8">How did you find us?</h1>
              
              <div className="space-y-3">
                {REFERRAL_SOURCES.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => setReferralSource(source.id)}
                    className={`w-full flex items-center justify-between px-4 py-4 rounded-xl border transition-all ${
                      referralSource === source.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{source.icon}</span>
                      <span className="font-medium text-gray-900">{source.label}</span>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      referralSource === source.id
                        ? 'border-primary bg-primary'
                        : 'border-gray-300'
                    }`}>
                      {referralSource === source.id && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
            </>
          )}

          {/* Usage Step */}
          {onboardingStep === 'usage' && (
            <>
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {firstName.charAt(0).toUpperCase()}
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">How will you use Get Listings?</h1>
              
              <div className="space-y-4">
                {USAGE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setUsageType(option.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      usageType === option.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        usageType === option.id
                          ? 'border-primary bg-primary'
                          : 'border-gray-300'
                      }`}>
                        {usageType === option.id && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{option.title}</p>
                        {option.description && (
                          <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                        )}
                        {option.features && usageType === option.id && (
                          <ul className="mt-2 space-y-1">
                            {option.features.map((feature, i) => (
                              <li key={i} className="text-xs text-gray-600 flex items-center gap-1">
                                <span className="text-primary">•</span> {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {usageType === 'leads' && (
                <div className="mt-6 p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                      <p className="font-semibold text-gray-900">Just a heads up!</p>
                      <p className="text-sm text-gray-600 mt-1">
                        The Get Listings app predicts which leads are likely to sell next using AI—not instant, ready-to-go leads.
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        If you're solely looking for leads who want to talk to you about listing, paid advertising is your best alternative (leads cost $100-$800+ each).
                      </p>
                      <button className="mt-3 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                        Book A Call For Paid Ads
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
            </>
          )}

          {/* Success Step */}
          {onboardingStep === 'success' && (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="relative mb-8">
                <img
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=300&fit=crop"
                  alt="Success"
                  className="w-48 h-48 object-cover rounded-2xl"
                />
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Congratulations!</h1>
              <p className="text-gray-600">Your account has been successfully registered!</p>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Next Button */}
          <button
            onClick={handleOnboardingNext}
            className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors mt-8"
          >
            {onboardingStep === 'success' ? 'Go to Dashboard' : 'Next'}
          </button>
        </div>
      </div>
    );
  }

  // Main Login UI
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Blurred Dashboard Background */}
      <DashboardPreview />

      {/* Login Card */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center py-12 px-4">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Get Listings
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Desktop Portal
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
            {/* Phone Step */}
            {authStep === 'phone' && (
              <form onSubmit={handleSendCode} className="space-y-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Mobile Number
                  </label>
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm font-medium">+61</span>
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(formatPhoneDisplay(e.target.value))}
                      placeholder="0412 345 678"
                      className="block w-full pl-14 pr-4 py-4 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Use the same number as your Get Listings mobile app
                  </p>
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Send Verification Code
                </button>
              </form>
            )}

            {/* Code Step */}
            {authStep === 'code' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900">Verification Code</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Please enter the verification code sent to mobile number{' '}
                    <span className="font-medium text-gray-900">+{formattedPhone}</span>
                  </p>
                </div>

                {/* Code Input Boxes */}
                <div className="flex justify-center gap-2">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  ))}
                </div>

                {error && (
                  <div className="rounded-xl bg-red-50 p-4">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  onClick={() => handleVerifyCode()}
                  disabled={code.join('').length !== 6}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify
                </button>

                <div className="text-center">
                  {resendTimer > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend code in <span className="text-primary font-medium">{Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}</span>
                    </p>
                  ) : (
                    <button
                      onClick={handleResendCode}
                      className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
                    >
                      Didn't receive code? <span className="underline">Tap to send again</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setAuthStep('phone');
                    setCode(['', '', '', '', '', '']);
                    setError('');
                  }}
                  className="w-full text-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  ← Change number
                </button>
              </div>
            )}

            {/* Loading Step */}
            {authStep === 'loading' && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-sm text-gray-600">Please wait...</p>
              </div>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:text-primary-dark underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary hover:text-primary-dark underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
