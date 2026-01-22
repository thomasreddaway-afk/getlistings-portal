'use client';

import { DemoLayout } from '@/components/layout';
import { useRef } from 'react';

// Icons as SVG components to match demo exactly
const QuestionIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ className = "w-5 h-5 text-green-600" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const InfoIcon = ({ className = "w-5 h-5 text-amber-600" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

// Dashboard Icon
const DashboardIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

// Seller Scores Icon
const UsersIcon = () => (
  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

// Hottest Leads Icon
const FireIcon = () => (
  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
  </svg>
);

// Clock Icon
const ClockIcon = () => (
  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// Star Icon
const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

// Pipeline Icon
const PipelineIcon = () => (
  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
  </svg>
);

// Settings Icon
const SettingsIcon = () => (
  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  </svg>
);

export default function HelpPage() {
  const sectionRefs = {
    'help-welcome': useRef<HTMLElement>(null),
    'help-how-it-works': useRef<HTMLElement>(null),
    'help-getting-started': useRef<HTMLElement>(null),
    'help-sections': useRef<HTMLElement>(null),
    'help-success': useRef<HTMLElement>(null),
    'help-faq': useRef<HTMLElement>(null),
    'help-non-tech': useRef<HTMLElement>(null),
    'help-contact': useRef<HTMLElement>(null),
  };

  const scrollToSection = (sectionId: string) => {
    const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <DemoLayout currentPage="help">
      <div className="flex-1 overflow-auto bg-white">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <QuestionIcon />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Help & Support Guide</h1>
                <p className="text-green-100">Everything you need to get the most from Get Listings</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Quick Navigation */}
        <div className="border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-8">
            <div className="flex space-x-1 overflow-x-auto py-3 scrollbar-hide">
              <button onClick={() => scrollToSection('help-welcome')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg whitespace-nowrap transition-colors">Welcome</button>
              <button onClick={() => scrollToSection('help-how-it-works')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg whitespace-nowrap transition-colors">How It Works</button>
              <button onClick={() => scrollToSection('help-getting-started')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg whitespace-nowrap transition-colors">Getting Started</button>
              <button onClick={() => scrollToSection('help-sections')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg whitespace-nowrap transition-colors">App Sections</button>
              <button onClick={() => scrollToSection('help-success')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg whitespace-nowrap transition-colors">Using It Well</button>
              <button onClick={() => scrollToSection('help-faq')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg whitespace-nowrap transition-colors">Common Questions</button>
              <button onClick={() => scrollToSection('help-non-tech')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg whitespace-nowrap transition-colors">For Non-Tech Users</button>
              <button onClick={() => scrollToSection('help-contact')} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg whitespace-nowrap transition-colors">Contact Support</button>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="max-w-4xl mx-auto px-8 py-12">
          
          {/* Section 1: Welcome */}
          <section ref={sectionRefs['help-welcome']} id="help-welcome" className="mb-16">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">1</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome to Get Listings</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
                  What is Get Listings?
                </h3>
                <p className="text-gray-700 leading-relaxed mb-0">
                  Get Listings helps you identify homeowners who may be thinking about selling — before they&apos;ve listed with anyone. It&apos;s like having an early warning system for your suburbs, so you can reach out at the right time and be the first agent they speak to.
                </p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What problem does this solve?</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Most agents find out about sellers too late — after they&apos;ve already chosen an agent, or when the property is already on the market. Get Listings watches for signals that suggest someone might be ready to sell, and brings those opportunities to you earlier.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Why does Get Listings exist?</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                We built this because great agents shouldn&apos;t have to rely on luck or door-knocking alone. You deserve better tools — ones that work in the background while you focus on relationships and selling.
              </p>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <InfoIcon className="w-5 h-5 text-amber-600 mr-2" />
                  A few things to keep in mind
                </h3>
                <ul className="space-y-2 text-gray-700 mb-0">
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>You can&apos;t break anything.</strong> Feel free to click around and explore. Nothing you do here is permanent or irreversible.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>You don&apos;t need to use every feature.</strong> Start with one or two things that make sense for you. You can explore more later.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckIcon className="w-5 h-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Small, consistent use works.</strong> Even checking in for 5 minutes a few times a week can make a real difference.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Section 2: How It Works */}
          <section ref={sectionRefs['help-how-it-works']} id="help-how-it-works" className="mb-16">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">2</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How Get Listings Works</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                Here&apos;s the simple version of what happens behind the scenes:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">We watch your suburbs</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">You tell us which suburbs you work in. We monitor those areas for activity that might indicate a seller.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">We spot the signals</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">Things like property searches, valuation requests, listing changes, and other behaviours that suggest someone might sell.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">Opportunities come to you</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">We show you the properties and people worth paying attention to — ranked by how likely they are to sell soon.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">4</span>
                    </div>
                    <h4 className="font-semibold text-gray-900">You decide what to do</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">You choose which leads to reach out to, how to contact them, and when. Get Listings gives you the information — you make the call.</p>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Think of it like this:</h4>
                <p className="text-gray-600 mb-0">
                  Imagine having a really good assistant who spends all day watching your suburbs, reading the signs, and handing you a list of &quot;these people are worth a call.&quot; That&apos;s what Get Listings does — quietly, in the background, every day.
                </p>
              </div>
            </div>
          </section>
          
          {/* Section 3: Getting Started */}
          <section ref={sectionRefs['help-getting-started']} id="help-getting-started" className="mb-16">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">3</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Getting Started</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                Here&apos;s what to do in your first few minutes with Get Listings.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Log in</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                <ol className="space-y-3 text-gray-600 mb-0">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3 mt-0.5 flex-shrink-0">1</span>
                    <span>Open Get Listings in your web browser (on your computer or phone)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3 mt-0.5 flex-shrink-0">2</span>
                    <span>Enter your mobile number when prompted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3 mt-0.5 flex-shrink-0">3</span>
                    <span>You&apos;ll receive a code via SMS — enter it to log in</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600 mr-3 mt-0.5 flex-shrink-0">4</span>
                    <span>That&apos;s it — you&apos;re in. No password to remember.</span>
                  </li>
                </ol>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Look at your Dashboard</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you log in, you&apos;ll land on your <strong>Dashboard</strong>. This is your home base. It shows you:
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your key numbers (leads unlocked, opportunities created, etc.)</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Your hottest leads — the ones most likely to sell soon</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Recent activity and listings about to expire</span>
                </li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Check your Seller Scores</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Click on <strong>&quot;Seller Scores&quot;</strong> in the left menu. This is where you&apos;ll find a list of properties in your suburbs, ranked by how likely the owner is to sell.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                The higher the score, the more signals we&apos;ve seen that suggest they might be ready to move.
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <InfoIcon className="w-5 h-5 text-blue-600 mr-2" />
                  Your first 5–10 minutes
                </h4>
                <p className="text-gray-700 mb-3">
                  Don&apos;t try to learn everything at once. In your first session, just:
                </p>
                <ol className="space-y-1 text-gray-700 mb-0">
                  <li>1. Look at your Dashboard</li>
                  <li>2. Browse the Seller Scores list</li>
                  <li>3. Click on one or two leads to see what information is available</li>
                </ol>
              </div>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2">What NOT to worry about right now:</h4>
                <ul className="space-y-1 text-gray-700 mb-0">
                  <li>• You don&apos;t need to set up anything complicated</li>
                  <li>• You don&apos;t need to connect other systems</li>
                  <li>• You don&apos;t need to change any settings</li>
                  <li>• Nothing is &quot;locked in&quot; — you can always adjust later</li>
                </ul>
              </div>
            </div>
          </section>
          
          {/* Section 4: Main Sections */}
          <section ref={sectionRefs['help-sections']} id="help-sections" className="mb-16">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">4</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Understanding Each Section</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-8">
                Here&apos;s a plain-English explanation of each part of the app and what you can do with it.
              </p>
              
              {/* Dashboard */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DashboardIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Dashboard</h3>
                    <p className="text-gray-600 mb-3"><strong>What it is:</strong> Your home screen. A quick overview of what&apos;s happening in your suburbs.</p>
                    <p className="text-gray-600 mb-3"><strong>Why it matters:</strong> It helps you see at a glance whether there&apos;s anything urgent to look at today.</p>
                    <p className="text-gray-600 mb-0"><strong>What to do:</strong> Check it when you log in. Look at your hottest leads and any expiring listings.</p>
                  </div>
                </div>
              </div>
              
              {/* Seller Scores */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UsersIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Seller Scores</h3>
                    <p className="text-gray-600 mb-3"><strong>What it is:</strong> A ranked list of properties in your suburbs, scored by how likely the owner is to sell.</p>
                    <p className="text-gray-600 mb-3"><strong>Why it matters:</strong> This is your prospecting list. Instead of guessing who to call, you can focus on the people showing real signs of intent.</p>
                    <p className="text-gray-600 mb-0"><strong>What to do:</strong> Review the top leads regularly. Click on any lead to see more details before reaching out.</p>
                  </div>
                </div>
              </div>
              
              {/* Hottest Leads */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FireIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Hottest Leads</h3>
                    <p className="text-gray-600 mb-3"><strong>What it is:</strong> The leads showing the strongest signals right now — the ones worth prioritising.</p>
                    <p className="text-gray-600 mb-3"><strong>Why it matters:</strong> If you only have time to reach out to a few people, these are the ones to focus on.</p>
                    <p className="text-gray-600 mb-0"><strong>What to do:</strong> Check this list regularly. These are your highest-priority opportunities.</p>
                  </div>
                </div>
              </div>
              
              {/* Expiring Listings */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <ClockIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Expiring Listings</h3>
                    <p className="text-gray-600 mb-3"><strong>What it is:</strong> Properties currently on the market with another agent, where the listing period is about to end.</p>
                    <p className="text-gray-600 mb-3"><strong>Why it matters:</strong> These sellers have already committed to selling — they just haven&apos;t sold yet. They may be open to a fresh approach.</p>
                    <p className="text-gray-600 mb-0"><strong>What to do:</strong> Review these leads and consider a respectful, professional outreach.</p>
                  </div>
                </div>
              </div>
              
              {/* Valuation Requests */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <StarIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Valuation Requests (PRO)</h3>
                    <p className="text-gray-600 mb-3"><strong>What it is:</strong> Homeowners who have actively requested a property valuation or appraisal.</p>
                    <p className="text-gray-600 mb-3"><strong>Why it matters:</strong> These people have raised their hand. They&apos;re not just thinking about selling — they&apos;re actively seeking information.</p>
                    <p className="text-gray-600 mb-0"><strong>What to do:</strong> Follow up quickly. These are warm leads who expect to hear from an agent.</p>
                  </div>
                </div>
              </div>
              
              {/* Lead Pipeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <PipelineIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Lead Pipeline</h3>
                    <p className="text-gray-600 mb-3"><strong>What it is:</strong> A visual way to track where each of your leads is in the process — from first contact to listing.</p>
                    <p className="text-gray-600 mb-3"><strong>Why it matters:</strong> It helps you stay organised and make sure no opportunity falls through the cracks.</p>
                    <p className="text-gray-600 mb-0"><strong>What to do:</strong> As you work with leads, move them through the stages to keep track of progress.</p>
                  </div>
                </div>
              </div>
              
              {/* Settings */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SettingsIcon />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings</h3>
                    <p className="text-gray-600 mb-3"><strong>What it is:</strong> Where you manage your profile, suburbs, and account preferences.</p>
                    <p className="text-gray-600 mb-3"><strong>Why it matters:</strong> This is where you can update your contact details, change which suburbs you&apos;re subscribed to, and adjust your preferences.</p>
                    <p className="text-gray-600 mb-0"><strong>What to do:</strong> Check this if you need to update anything. Otherwise, you can leave it alone.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Section 5: Using It Successfully */}
          <section ref={sectionRefs['help-success']} id="help-success" className="mb-16">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">5</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">How to Use This Successfully</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                You don&apos;t need to be a power user to get results. Here&apos;s a simple routine that works.
              </p>
              
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">A simple weekly routine</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-green-600 font-bold">M</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Monday — Review your dashboard</h4>
                      <p className="text-sm text-gray-600 mb-0">Check what&apos;s new. Look at your hottest leads and any expiring listings.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-green-600 font-bold">W</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Wednesday — Take action on 2–3 leads</h4>
                      <p className="text-sm text-gray-600 mb-0">Pick a few high-scoring leads and reach out. A call, a letter, or a door knock.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-green-600 font-bold">F</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Friday — Update your pipeline</h4>
                      <p className="text-sm text-gray-600 mb-0">Move any leads you&apos;ve contacted through the stages. Note any progress or next steps.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What successful agents do</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium text-gray-900">They check in regularly</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">Even 5 minutes, 3 times a week is enough to stay on top of new opportunities.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium text-gray-900">They take action</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">The information is only valuable if you use it. Even one call per week adds up.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium text-gray-900">They focus, not scatter</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">They don&apos;t try to contact 50 people. They focus on the best 5–10 leads each week.</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <h4 className="font-medium text-gray-900">They stay consistent</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-0">Results come from doing the right things repeatedly, not from one big effort.</p>
                </div>
              </div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2">Remember:</h4>
                <p className="text-gray-700 mb-0">
                  <strong>Consistency beats complexity.</strong> You don&apos;t need to use every feature. You don&apos;t need to be perfect. Just check in, take action, and repeat.
                </p>
              </div>
            </div>
          </section>
          
          {/* Section 6: FAQ */}
          <section ref={sectionRefs['help-faq']} id="help-faq" className="mb-16">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">6</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Common Questions</h2>
            </div>
            
            <div className="space-y-4">
              {/* FAQ 1 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">Can I change my suburbs?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">Yes. You can update your suburb preferences in the Settings area. Depending on your plan, you may have a limit on how many suburbs you can monitor at once, but you can swap them whenever you need to.</p>
                  </div>
                </details>
              </div>
              
              {/* FAQ 2 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">How often can I change my suburbs?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">You can change them as often as you like. There&apos;s no lock-in or waiting period. Just go to Settings and update your list.</p>
                  </div>
                </details>
              </div>
              
              {/* FAQ 3 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">How do I update my contact details?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">Go to Settings (in the left menu), then click on &quot;Edit Profile.&quot; You can update your name, email, phone number, and profile photo there.</p>
                  </div>
                </details>
              </div>
              
              {/* FAQ 4 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">What if I make a mistake?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">Don&apos;t worry — there&apos;s very little you can do that can&apos;t be undone. If you move a lead to the wrong stage, just move it back. If you unlock the wrong lead, it&apos;s not a problem. And if you&apos;re ever unsure, just contact support.</p>
                  </div>
                </details>
              </div>
              
              {/* FAQ 5 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">What if I forget my password?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">You don&apos;t have a password to remember. Get Listings uses your mobile phone number to log you in. Just enter your number, and we&apos;ll send you a code via SMS. Easy.</p>
                  </div>
                </details>
              </div>
              
              {/* FAQ 6 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">Do I need to check this every day?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">No. Checking 2–3 times per week is plenty for most agents. Some people prefer a quick daily check (5 minutes in the morning), but it&apos;s not required. Find a rhythm that works for you.</p>
                  </div>
                </details>
              </div>
              
              {/* FAQ 7 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">Will this replace my CRM?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">Not necessarily. Get Listings is designed to find new opportunities — people who might be ready to sell. If you already use a CRM (a system for managing your contacts and deals), you can use both. Get Listings feeds you leads; your CRM helps you manage them.</p>
                  </div>
                </details>
              </div>
              
              {/* FAQ 8 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">Can other agents see my leads?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">No. Your account is private. Other agents cannot see which leads you&apos;ve unlocked, which suburbs you&apos;re watching, or any of your activity. Everything you do in Get Listings is confidential to you.</p>
                  </div>
                </details>
              </div>
              
              {/* FAQ 9 */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <details className="group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50">
                    <span className="font-medium text-gray-900">How long before I see results?</span>
                    <ChevronDownIcon />
                  </summary>
                  <div className="px-5 pb-5 text-gray-600">
                    <p className="mb-0">It depends on your market and how often you take action. Some agents get appraisals within the first few weeks. For others, it takes a month or two. The key is consistency — checking in regularly and reaching out to leads. The more you use it, the more opportunities you&apos;ll find.</p>
                  </div>
                </details>
              </div>
            </div>
          </section>
          
          {/* Section 7: For Non-Tech Users */}
          <section ref={sectionRefs['help-non-tech']} id="help-non-tech" className="mb-16">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">7</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">For Agents Who &quot;Don&apos;t Like Technology&quot;</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
                <p className="text-lg text-gray-700 mb-0">
                  If you&apos;ve made it this far and you&apos;re thinking <em>&quot;This sounds good, but I&apos;m not great with technology&quot;</em> — this section is for you.
                </p>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">First, let&apos;s be clear:</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                You don&apos;t need to be tech-savvy to use Get Listings. If you can check email and browse the internet, you already have the skills you need.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This is not a complicated system.</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                There are no integrations to set up. No data to import. No complicated settings to configure. You log in, you look at the leads, you decide who to call. That&apos;s it.
              </p>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">If technology stresses you out, try this:</h3>
                <ol className="space-y-4 text-gray-700 mb-0">
                  <li className="flex items-start">
                    <span className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600 mr-3 mt-0.5 flex-shrink-0">1</span>
                    <div>
                      <strong>Pick ONE feature to start with.</strong>
                      <p className="text-sm text-gray-600 mb-0">We suggest Seller Scores. Just look at that list once or twice a week.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600 mr-3 mt-0.5 flex-shrink-0">2</span>
                    <div>
                      <strong>Ignore everything else for now.</strong>
                      <p className="text-sm text-gray-600 mb-0">The other features will still be there when you&apos;re ready. No rush.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600 mr-3 mt-0.5 flex-shrink-0">3</span>
                    <div>
                      <strong>Set a reminder.</strong>
                      <p className="text-sm text-gray-600 mb-0">Put a recurring reminder in your calendar: &quot;Check Get Listings&quot; — Monday, Wednesday, Friday. 5 minutes each.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-sm font-bold text-green-600 mr-3 mt-0.5 flex-shrink-0">4</span>
                    <div>
                      <strong>Ask for help if you need it.</strong>
                      <p className="text-sm text-gray-600 mb-0">Our support team is patient and friendly. You won&apos;t be judged. We&apos;re here to help.</p>
                    </div>
                  </li>
                </ol>
              </div>
              
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 mb-8">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <InfoIcon className="w-5 h-5 text-amber-600 mr-2" />
                  What Get Listings replaces:
                </h4>
                <p className="text-gray-700 mb-0">
                  Think of this as replacing guesswork with clarity. Instead of wondering &quot;who should I call today?&quot; — you now have a list of people worth calling, based on real signals. That&apos;s not technology. That&apos;s just better information.
                </p>
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                You&apos;ve spent years building experience and relationships. This tool is here to support that — not replace it. Your instincts still matter. We just help you point them in the right direction.
              </p>
            </div>
          </section>
          
          {/* Section 8: Contact Support */}
          <section ref={sectionRefs['help-contact']} id="help-contact" className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">8</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Getting Help & Support</h2>
            </div>
            
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed mb-6">
                If you ever get stuck, confused, or just want to ask a question — we&apos;re here for you.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <EmailIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-gray-600 text-sm mb-3">For general questions, feedback, or help with your account.</p>
                  <a href="mailto:support@getlistings.com.au" className="text-green-600 font-medium hover:text-green-700">support@getlistings.com.au</a>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <PhoneIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                  <p className="text-gray-600 text-sm mb-3">For urgent issues or if you&apos;d prefer to talk to a real person.</p>
                  <a href="tel:1300123456" className="text-blue-600 font-medium hover:text-blue-700">1300 123 456</a>
                  <p className="text-xs text-gray-500 mt-1">Mon–Fri, 9am–5pm AEST</p>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-4">When should you reach out?</h3>
              <ul className="space-y-2 text-gray-600 mb-8">
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>If something isn&apos;t working the way you expect</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>If you&apos;re confused about a feature or how to use it</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>If you have a suggestion or feedback</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>If you need help with your account or billing</span>
                </li>
                <li className="flex items-start">
                  <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>If you just want to ask a question — any question</span>
                </li>
              </ul>
              
              <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <CheckIcon className="w-5 h-5 text-green-600 mr-2" />
                  One last thing:
                </h4>
                <p className="text-gray-700 mb-0">
                  <strong>You&apos;re not expected to figure everything out on your own.</strong> We want you to succeed, and we&apos;re genuinely happy to help. Don&apos;t hesitate to reach out — even for small things.
                </p>
              </div>
            </div>
          </section>
          
        </div>
        
        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-4xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Get Listings Help Centre</span>
              </div>
              <p className="text-sm text-gray-500">Last updated: January 2026</p>
            </div>
          </div>
        </div>
        
      </div>
    </DemoLayout>
  );
}
