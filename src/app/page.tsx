'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import SuburbAutocomplete from '@/components/SuburbAutocomplete';

// Agency logos for the slider
const agencyLogos = [
  'https://images.squarespace-cdn.com/content/v1/5f1c59f7f6e5f04bece768d0/1596762095178-EXAMPLE1',
  // Using placeholder logos as the original uses local files
];

// Testimonial data
const testimonials = [
  {
    initials: 'KS',
    name: 'Kalley Singh',
    company: 'One Group Realty - Epping',
    color: 'from-blue-400 to-blue-600',
    quote: '"Leader of Facebook Lead Generation. Highly recommended."',
  },
  {
    initials: 'WT',
    name: 'William Teys',
    company: 'Crowne Real Estate - Ipswich',
    color: 'from-teal-400 to-teal-600',
    quote: '"Their performance and communication has been outstanding. I would recommend to others looking for a point of difference as I have with other agents in my office."',
  },
  {
    initials: 'SG',
    name: 'Steve Gott',
    company: 'Gott Realty',
    color: 'from-orange-400 to-orange-600',
    quote: '"I have been using Tom and the team for over 15 months. With their leads they have over delivered. I have received a number of leads that have turned into listings and sales."',
  },
  {
    initials: 'AP',
    name: 'Andrew Prescott',
    company: 'Clarke & Co Real Estate',
    color: 'from-purple-400 to-purple-600',
    quote: '"The staff were capable, friendly, and the service provided great flexibility. All up it was a positive and worthwhile experience."',
  },
  {
    initials: 'BR',
    name: 'Barbara Roberts',
    company: 'Acton | Belle Property Fremantle',
    color: 'from-pink-400 to-pink-600',
    quote: '"The team at Get Listings are absolutely fantastic! They work hard to tailor their marketing strategies to suit you. Would highly recommend!"',
  },
];

export default function LandingPage() {
  const [agentCount, setAgentCount] = useState(0);
  const [testimonialPosition, setTestimonialPosition] = useState(0);
  const [agentType, setAgentType] = useState<'junior' | 'established' | 'top'>('junior');

  // Graph data for different agent types
  const graphData = {
    junior: {
      withAI: 'M 0 180 C 70 170, 120 140, 175 100 S 240 30, 290 25',
      withoutAI: 'M 0 180 C 70 175, 140 170, 210 165 S 260 165, 290 168',
      withAIResult: '$420K/yr',
      withoutAIResult: '$85K/yr',
      withAIPosition: '15%',
      withoutAIPosition: '65%',
      insight: <><span className="text-white font-bold">Junior agents with AI</span> out-earn <span className="text-white font-bold">10-year veterans</span> without it within 3 years.</>
    },
    established: {
      withAI: 'M 0 120 C 70 100, 120 70, 175 45 S 240 15, 290 12',
      withoutAI: 'M 0 120 C 70 125, 140 135, 210 145 S 260 155, 290 160',
      withAIResult: '$750K/yr',
      withoutAIResult: '$180K/yr',
      withAIPosition: '10%',
      withoutAIPosition: '60%',
      insight: <><span className="text-white font-bold">Established agents with AI</span> double their income while working <span className="text-white font-bold">fewer hours</span>.</>
    },
    top: {
      withAI: 'M 0 80 C 70 55, 120 35, 175 20 S 240 8, 290 8',
      withoutAI: 'M 0 80 C 70 90, 140 100, 210 120 S 260 138, 290 145',
      withAIResult: '$1.2M/yr',
      withoutAIResult: '$350K/yr',
      withAIPosition: '5%',
      withoutAIPosition: '55%',
      insight: <><span className="text-white font-bold">Top producers with AI</span> break through plateaus and reach <span className="text-white font-bold">$1M+ annually</span>.</>
    }
  };

  // Animate agent counter on load
  useEffect(() => {
    const target = 1200;
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setAgentCount(target);
        clearInterval(timer);
      } else {
        setAgentCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  const scrollTestimonials = (direction: 'next' | 'prev') => {
    const cardWidth = 420;
    if (direction === 'next') {
      setTestimonialPosition(prev => Math.min(prev + cardWidth, cardWidth * (testimonials.length - 2)));
    } else {
      setTestimonialPosition(prev => Math.max(prev - cardWidth, 0));
    }
  };

  return (
    <div className="font-sans antialiased bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#c8102e] flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
              </div>
              <span className="text-2xl font-bold text-gray-900">Get Listings</span>
            </div>
            <div className="hidden lg:flex items-center gap-10">
              <div className="relative group">
                <button className="text-gray-600 hover:text-gray-900 transition font-medium flex items-center gap-1">
                  Products
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
              </div>
              <a href="#for-agents" className="text-gray-600 hover:text-gray-900 transition font-medium">For Agents</a>
              <a href="#get-started" className="text-gray-600 hover:text-gray-900 transition font-medium">Get Started</a>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block text-gray-600 hover:text-gray-900 transition font-medium px-4 py-2">
                Login
              </Link>
              <Link href="/login" className="bg-gradient-to-r from-[#c8102e] to-[#a00d25] text-white font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all">
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center pt-20 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-60"></div>
          
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>

          {/* Floating signal cards */}
          <div className="hidden lg:block">
            <div className="absolute top-1/4 left-[8%] bg-white border border-gray-100 border-l-4 border-l-[#c8102e] rounded-2xl p-4 shadow-xl animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">📊</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#c8102e] font-bold">New Signal</div>
                  <div className="text-gray-900 font-medium text-sm">Valuation Requested</div>
                  <div className="text-gray-400 text-[10px]">Bondi • 2 mins ago</div>
                </div>
              </div>
            </div>

            <div className="absolute top-[45%] left-[5%] bg-white border border-gray-100 border-l-4 border-l-orange-500 rounded-2xl p-4 shadow-xl animate-pulse" style={{ animationDelay: '0.5s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">🏷️</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-orange-600 font-bold">AI Match</div>
                  <div className="text-gray-900 font-medium text-sm">Garage Sale Detected</div>
                  <div className="text-gray-400 text-[10px]">Toorak • Just now</div>
                </div>
              </div>
            </div>
            
            <div className="absolute top-1/4 right-[8%] bg-white border border-gray-100 border-l-4 border-l-green-500 rounded-2xl p-4 shadow-xl animate-pulse" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">🏠</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-green-600 font-bold">Listing Alert</div>
                  <div className="text-gray-900 font-medium text-sm">FSBO Listing Found</div>
                  <div className="text-gray-400 text-[10px]">Broadbeach • 5 mins ago</div>
                </div>
              </div>
            </div>

            <div className="absolute top-[55%] right-[5%] bg-white border border-gray-100 border-l-4 border-l-blue-500 rounded-2xl p-4 shadow-xl animate-pulse" style={{ animationDelay: '2s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🏗️</div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-blue-600 font-bold">Predictive</div>
                  <div className="text-gray-900 font-medium text-sm">Renovation Permit</div>
                  <div className="text-gray-400 text-[10px]">Double Bay • 12 mins ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-white shadow-lg border border-gray-200 rounded-full px-5 py-2.5 mb-6">
              <div className="flex -space-x-2">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" alt="" />
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" alt="" />
                <img src="https://randomuser.me/api/portraits/women/68.jpg" className="w-7 h-7 rounded-full border-2 border-white shadow-sm" alt="" />
              </div>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-gray-700 text-sm font-medium">Trusted by <strong className="text-gray-900">1,200+</strong> Australian agents</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-4 tracking-tight">
              Let AI Find Your<br />
              <span className="bg-gradient-to-r from-[#c8102e] via-red-500 to-orange-500 bg-clip-text text-transparent">Next Listing</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed">
              Unlock AI seller scores & listing predictions on <strong className="text-gray-900">15M+ properties</strong>.
            </p>

            {/* Pointing Arrows */}
            <div className="flex justify-center gap-8 mb-4 animate-bounce">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
            </div>

            {/* CTA Box */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl ring-1 ring-black/5">
                <p className="text-gray-600 font-medium mb-6 text-center">🔍 Find high-probability sellers in your suburb</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 bg-gray-100 rounded-full px-5 py-4 border-0">
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    <SuburbAutocomplete 
                      className="flex-1"
                      inputClassName="w-full bg-transparent outline-none border-none text-gray-900 placeholder-gray-400 text-lg focus:ring-0"
                      onPlaceSelect={(place) => {
                        console.log('Selected suburb:', place.name, place.formatted_address);
                        window.location.href = '/login';
                      }}
                    />
                  </div>
                  <button 
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-[#ff0000] to-[#dc2626] text-white font-bold px-6 py-4 rounded-2xl text-lg flex items-center gap-2 whitespace-nowrap hover:scale-105 hover:shadow-lg transition-all"
                    style={{ animation: 'pulse-red 2s infinite' }}
                  >
                    <span>SEE LEADS</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                    </svg>
                  </button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> 7-day free trial</span>
                  <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> No credit card</span>
                  <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section with Logo Slider */}
      <section className="py-12 bg-white border-b border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-2">Trusted by leading agencies across Australia</p>
            <h3 className="text-2xl font-bold text-gray-900">Join {agentCount.toLocaleString()}+ agents already winning more listings</h3>
          </div>
        </div>
        
        {/* Logo Slider */}
        <div className="relative py-5">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          {/* Row 1 - logos 1-65 */}
          <div className="mb-3 overflow-hidden">
            <div className="flex gap-3 animate-scroll-left">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-3 flex-shrink-0">
                  {Array.from({length: 65}, (_, i) => i + 1).map((num) => (
                    <div key={num} className="w-[120px] h-[50px] rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 bg-white">
                      <img src={`/logos/${num}.png`} alt="Agency" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 2 - logos 66-130, Reverse direction */}
          <div className="mb-3 overflow-hidden">
            <div className="flex gap-3 animate-scroll-right">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-3 flex-shrink-0">
                  {Array.from({length: 65}, (_, i) => i + 66).map((num) => (
                    <div key={num} className="w-[120px] h-[50px] rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 bg-white">
                      <img src={`/logos/${num}.png`} alt="Agency" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          {/* Row 3 - logos 131-195 */}
          <div className="overflow-hidden">
            <div className="flex gap-3 animate-scroll-left-slow">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-3 flex-shrink-0">
                  {Array.from({length: 65}, (_, i) => i + 131).map((num) => (
                    <div key={num} className="w-[120px] h-[50px] rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0 bg-white">
                      <img src={`/logos/${num}.png`} alt="Agency" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Two Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-100 border border-red-200 rounded-full px-4 py-2 mb-6">
              <span className="text-[#c8102e] text-sm font-semibold">🚀 Two Ways to Win More Listings</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Self-Serve <span className="text-[#c8102e]">+</span> Done-For-You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Use our powerful AI platform yourself, or let our team deliver exclusive seller leads straight to you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 relative">
            {/* Product 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group flex flex-col">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-[#c8102e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Listings App</h3>
              <p className="text-gray-600 mb-6">
                AI-powered platform to find sellers in your area with predictive scores and prospecting tools.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                  AI seller scores on 15M+ properties
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                  12+ seller signals tracked daily
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                  Full control over your prospecting
                </li>
              </ul>
              <Link href="/login" className="inline-flex items-center gap-2 bg-gray-900 text-white font-bold px-6 py-4 rounded-xl hover:bg-gray-800 transition-all group/btn mt-auto">
                <span>Explore the App</span>
                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-[#c8102e]/20 hover:shadow-2xl transition-all duration-300 group relative overflow-hidden flex flex-col">
              <div className="absolute top-4 right-4">
                <span className="bg-[#c8102e] text-white text-xs font-bold px-3 py-1 rounded-full">MOST POPULAR</span>
              </div>
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Exclusive Seller Leads</h3>
              <p className="text-gray-600 mb-6">
                Done-for-you service delivering pre-qualified seller leads exclusive to your territory.
              </p>
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                  Pre-qualified, valuation-ready leads
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                  100% exclusive to your territory
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">✓</span>
                  Done-for-you — zero effort required
                </li>
              </ul>
              <Link href="/login" className="inline-flex items-center gap-2 bg-[#c8102e] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#a00d25] transition-all group/btn mt-auto">
                <span>Get Exclusive Leads</span>
                <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Combine Both Banner */}
          <div className="hidden md:flex justify-center items-center gap-4 my-8">
            <div className="flex-1 flex justify-end">
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent to-red-400"></div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-400 rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m0 0l-4-4m4 4l4-4"/>
                </svg>
              </div>
              <svg className="w-5 h-5 text-red-400 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </div>
            <div className="flex-1 flex justify-start">
              <div className="w-24 h-0.5 bg-gradient-to-l from-transparent to-red-400"></div>
            </div>
          </div>

          {/* Combined CTA */}
          <div className="bg-gradient-to-r from-[#c8102e] via-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
            
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-5 py-2 mb-6">
                <span className="text-white text-sm font-bold">⚡ COMBINE BOTH FOR MAXIMUM RESULTS</span>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-8">
                <div className="flex items-center gap-3 bg-white/15 rounded-2xl px-6 py-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <span className="text-white font-bold">App</span>
                </div>
                
                <div className="text-4xl font-black text-white">+</div>
                
                <div className="flex items-center gap-3 bg-white/15 rounded-2xl px-6 py-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                    </svg>
                  </div>
                  <span className="text-white font-bold">Leads</span>
                </div>
                
                <div className="text-4xl font-black text-white">=</div>
                
                <div className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-lg">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#c8102e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                    </svg>
                  </div>
                  <span className="text-gray-900 font-black">Maximum Results</span>
                </div>
              </div>
              
              <p className="text-white/90 max-w-2xl mx-auto mb-8 text-lg">
                Top-performing agents use the app for daily prospecting <strong className="text-white">AND</strong> receive exclusive leads for guaranteed opportunities.
              </p>
              
              <Link href="/login" className="inline-flex items-center gap-2 bg-white text-[#c8102e] font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                <span>Get Started for Free</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Portal Preview Section - What You Get Inside */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <span className="text-blue-700 text-sm font-semibold">👀 Inside the Portal</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Everything You Need to <span className="text-[#c8102e]">Win Listings</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A complete toolkit designed for modern agents. Here&apos;s what you&apos;ll have access to:
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            
            {/* Feature 1: Lead Cards with Seller Scores */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#c8102e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">AI Seller Scores</h3>
                  <p className="text-sm text-gray-500">See who&apos;s likely to sell</p>
                </div>
              </div>
              
              {/* Mini Lead Card Preview */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 group-hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-gray-900">42 Smith Street</div>
                    <div className="text-sm text-gray-500">Bondi Beach, NSW</div>
                  </div>
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-sm font-bold">
                    <span>🔥</span> 87
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Valuation Request</span>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">Downsizing</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">10+ Years Owned</span>
                </div>
              </div>
            </div>

            {/* Feature 2: Lead Pipeline */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Lead Pipeline</h3>
                  <p className="text-sm text-gray-500">Track every lead to listing</p>
                </div>
              </div>
              
              {/* Mini Pipeline Preview */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 group-hover:shadow-md transition-all">
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500 mb-2">New</div>
                    <div className="bg-blue-100 rounded-lg p-2">
                      <div className="w-full h-2 bg-blue-300 rounded mb-1"></div>
                      <div className="w-3/4 h-2 bg-blue-200 rounded"></div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 mt-1">12</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500 mb-2">Contacted</div>
                    <div className="bg-yellow-100 rounded-lg p-2">
                      <div className="w-full h-2 bg-yellow-300 rounded mb-1"></div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 mt-1">8</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500 mb-2">Appraisal</div>
                    <div className="bg-orange-100 rounded-lg p-2">
                      <div className="w-full h-2 bg-orange-300 rounded"></div>
                    </div>
                    <div className="text-xs font-bold text-gray-900 mt-1">5</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-medium text-gray-500 mb-2">Won 🎉</div>
                    <div className="bg-green-100 rounded-lg p-2">
                      <div className="w-full h-2 bg-green-400 rounded"></div>
                    </div>
                    <div className="text-xs font-bold text-green-600 mt-1">3</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Content Creation / Marketing */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Content Creation</h3>
                  <p className="text-sm text-gray-500">Brand-matched social graphics</p>
                </div>
              </div>
              
              {/* Mini Content Preview */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 group-hover:shadow-md transition-all">
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#c8102e] to-red-700 rounded-xl flex items-center justify-center text-white text-xs font-bold text-center p-2">
                    ⭐ Just Sold!
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center text-white text-xs font-bold text-center p-2">
                    📊 Market Update
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center text-white text-xs font-bold text-center p-2">
                    🏠 New Listing
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">Upload your logo → Get matching templates</p>
              </div>
            </div>

            {/* Feature 4: Leaderboard */}
            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 hover:shadow-xl transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Agent Leaderboard</h3>
                  <p className="text-sm text-gray-500">See how you stack up</p>
                </div>
              </div>
              
              {/* Mini Leaderboard Preview */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 group-hover:shadow-md transition-all">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🥇</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">Sarah M.</div>
                      <div className="text-xs text-gray-500">Ray White</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">47 pts</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🥈</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600"></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">James T.</div>
                      <div className="text-xs text-gray-500">LJ Hooker</div>
                    </div>
                    <div className="text-sm font-bold text-gray-900">43 pts</div>
                  </div>
                  <div className="flex items-center gap-3 bg-yellow-50 -mx-2 px-2 py-1 rounded-lg">
                    <span className="text-lg">🎯</span>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600"></div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-gray-900">You</div>
                      <div className="text-xs text-gray-500">Your Agency</div>
                    </div>
                    <div className="text-sm font-bold text-[#c8102e]">38 pts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/login" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c8102e] to-red-600 text-white font-bold px-8 py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all">
              <span>Try It Free for 7 Days</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
            <p className="text-sm text-gray-500 mt-3">No credit card required</p>
          </div>
        </div>
      </section>

      {/* AI Revolution Section */}
      <section className="py-24 bg-gradient-to-b from-gray-900 via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-red-400 text-sm font-semibold">⚡ The AI Revolution Is Here</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              AI Is Reshaping Real Estate.<br /><span className="text-[#c8102e]">Are You Ready?</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The agents who embrace AI now will dominate. The ones who wait will be left behind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* The Reality */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
              <div className="text-red-400 text-sm font-bold uppercase tracking-widest mb-4">The Reality</div>
              <h3 className="text-2xl font-bold text-white mb-6">What&apos;s Happening Right Now</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📊</div>
                  <div>
                    <p className="text-white font-semibold">Top agencies are using AI to predict sellers</p>
                    <p className="text-gray-400 text-sm">They know who&apos;s likely to sell months before the &quot;For Sale&quot; sign goes up.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🎯</div>
                  <div>
                    <p className="text-white font-semibold">AI spots patterns humans can&apos;t see</p>
                    <p className="text-gray-400 text-sm">Subtle signals across millions of data points reveal selling intent.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">⏱️</div>
                  <div>
                    <p className="text-white font-semibold">Speed wins in prospecting</p>
                    <p className="text-gray-400 text-sm">The first agent to reach a motivated seller has a 70% higher chance of winning the listing.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Opportunity */}
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/20 rounded-3xl p-8">
              <div className="text-green-400 text-sm font-bold uppercase tracking-widest mb-4">The Opportunity</div>
              <h3 className="text-2xl font-bold text-white mb-6">Your Competitive Edge</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✅</div>
                  <div>
                    <p className="text-white font-semibold">You don&apos;t need to be a tech expert</p>
                    <p className="text-gray-400 text-sm">Get Listings does the heavy lifting. You just respond to warm leads.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✅</div>
                  <div>
                    <p className="text-white font-semibold">Level the playing field</p>
                    <p className="text-gray-400 text-sm">Access the same AI insights that major agencies pay six figures for.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✅</div>
                  <div>
                    <p className="text-white font-semibold">Work smarter, not harder</p>
                    <p className="text-gray-400 text-sm">Stop door-knocking cold. Start conversations with people who actually want to sell.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-white mb-2">73%</div>
              <p className="text-gray-400 text-sm">of top agents now use AI tools</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-white mb-2">5x</div>
              <p className="text-gray-400 text-sm">more listings with predictive data</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-white mb-2">2hrs</div>
              <p className="text-gray-400 text-sm">saved daily on prospecting</p>
            </div>
            <div className="text-center">
              <div className="text-4xl sm:text-5xl font-black text-white mb-2">89%</div>
              <p className="text-gray-400 text-sm">of leads are pre-qualified</p>
            </div>
          </div>

          {/* Interactive Career Graph */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-10 mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Agent Career Trajectory</h3>
              <p className="text-gray-400">See how AI transforms an agent&apos;s success over time</p>
            </div>
            
            {/* Agent Type Toggle */}
            <div className="flex justify-center gap-2 mb-8">
              <button 
                onClick={() => setAgentType('junior')} 
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${agentType === 'junior' ? 'bg-[#c8102e] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
              >
                Junior Agent
              </button>
              <button 
                onClick={() => setAgentType('established')} 
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${agentType === 'established' ? 'bg-[#c8102e] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
              >
                Established Agent
              </button>
              <button 
                onClick={() => setAgentType('top')} 
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${agentType === 'top' ? 'bg-[#c8102e] text-white' : 'bg-white/10 text-gray-400 hover:bg-white/20'}`}
              >
                Top Producer
              </button>
            </div>
            
            {/* Graph Container */}
            <div className="relative bg-gray-800/50 rounded-2xl p-4 sm:p-6" style={{ height: '320px' }}>
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-4 bottom-12 w-16 flex flex-col justify-between text-right pr-2">
                <span className="text-xs text-gray-500">$1M+</span>
                <span className="text-xs text-gray-500">$500K</span>
                <span className="text-xs text-gray-500">$200K</span>
                <span className="text-xs text-gray-500">$50K</span>
              </div>
              
              {/* Graph Area */}
              <div className="ml-16 mr-4 h-full relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pb-8">
                  <div className="border-t border-gray-700/50"></div>
                  <div className="border-t border-gray-700/50"></div>
                  <div className="border-t border-gray-700/50"></div>
                  <div className="border-t border-gray-700/50"></div>
                </div>
                
                {/* SVG Graph */}
                <svg className="absolute inset-0 w-full h-full" style={{ paddingBottom: '32px' }} viewBox="0 0 350 220" preserveAspectRatio="none">
                  {/* Without AI Line (gray, declining) */}
                  <path 
                    d={graphData[agentType].withoutAI} 
                    fill="none" 
                    stroke="#6b7280" 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeDasharray="8,4"
                    className="transition-all duration-700"
                  />
                  
                  {/* With AI Line (gradient, growing) */}
                  <defs>
                    <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#dc2626' }}/>
                      <stop offset="100%" style={{ stopColor: '#f97316' }}/>
                    </linearGradient>
                  </defs>
                  <path 
                    d={graphData[agentType].withAI} 
                    fill="none" 
                    stroke="url(#ai-gradient)" 
                    strokeWidth="4" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="transition-all duration-700"
                  />
                </svg>
                
                {/* Legend */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 text-sm py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 bg-gradient-to-r from-red-600 to-orange-500 rounded"></div>
                    <span className="text-white font-medium">AI Adoption</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-1 rounded" style={{ background: 'repeating-linear-gradient(90deg, #6b7280 0px, #6b7280 8px, transparent 8px, transparent 12px)' }}></div>
                    <span className="text-gray-400">No AI</span>
                  </div>
                </div>
              </div>
              
              {/* X-Axis Labels */}
              <div className="absolute bottom-2 left-16 right-4 flex justify-between text-xs text-gray-500">
                <span>Year 1</span>
                <span>Year 2</span>
                <span>Year 3</span>
                <span>Year 4</span>
                <span>Year 5</span>
              </div>
              
              {/* Outcome Labels */}
              <div className="absolute right-4 text-right transition-all duration-700" style={{ top: graphData[agentType].withAIPosition }}>
                <div className="text-green-400 font-bold text-lg">{graphData[agentType].withAIResult}</div>
                <div className="text-gray-400 text-xs">With AI</div>
              </div>
              <div className="absolute right-4 text-right transition-all duration-700" style={{ top: graphData[agentType].withoutAIPosition }}>
                <div className="text-gray-400 font-bold text-lg">{graphData[agentType].withoutAIResult}</div>
                <div className="text-gray-500 text-xs">Without AI</div>
              </div>
            </div>
            
            {/* Key Insight */}
            <div className="mt-6 text-center">
              <p className="text-gray-300">{graphData[agentType].insight}</p>
            </div>
          </div>

          {/* Quote */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 text-center">
            <p className="text-2xl sm:text-3xl text-white font-medium italic mb-6 leading-relaxed">
              &quot;In the next 5 years, there will be two types of agents: those who use AI, and those who are out of business.&quot;
            </p>
            <p className="text-gray-400">— Industry analysts agree: <span className="text-white font-semibold">AI adoption is no longer optional</span></p>
          </div>
        </div>
      </section>

      {/* Traditional Lead Gen Is Broken Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2 mb-6">
              <span className="text-gray-700 text-sm font-semibold">🤔 The Challenge</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Traditional Lead Gen Is <span className="text-[#c8102e]">Broken</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The old playbook doesn&apos;t work anymore. Here&apos;s what agents are up against.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="text-4xl mb-4">🚪</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Door Knocking Is Dead</h3>
              <p className="text-gray-600">Homeowners don&apos;t answer doors anymore. You&apos;re wasting hours for maybe one conversation — and that person probably isn&apos;t even thinking of selling.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Cold Calling Kills Motivation</h3>
              <p className="text-gray-600">Rejection after rejection. Even top performers burn out. And with call screening, you&apos;re lucky if 10% even pick up.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lead Sharing Woes</h3>
              <p className="text-gray-600">Paying for leads that go to 5 other agents? By the time you call, they&apos;ve already spoken to your competition. It&apos;s a race to the bottom.</p>
            </div>
          </div>

          {/* The Result */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">The Result?</h3>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Agents are working harder than ever but getting fewer listings. The winners are the ones who&apos;ve figured out how to <strong className="text-white">find sellers before they list</strong> — not after.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-red-400 mb-2">67%</div>
                <div className="text-sm text-gray-400">of agents struggle<br/>with lead gen</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-red-400 mb-2">2.3hrs</div>
                <div className="text-sm text-gray-400">wasted daily on<br/>cold prospecting</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-red-400 mb-2">12%</div>
                <div className="text-sm text-gray-400">conversion rate on<br/>shared leads</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-black text-green-400 mb-2">3.2x</div>
                <div className="text-sm text-gray-400">more listings with<br/>AI-powered leads</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 border border-red-200 rounded-full px-4 py-2 mb-6">
                <span className="text-red-600 text-sm font-semibold">📖 Our Story</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
                We Built What We Wished Existed
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                Get Listings was born from a simple frustration: <strong className="text-gray-900">why is finding sellers so hard?</strong>
              </p>
              <p className="text-gray-600 mb-6">
                We spent years in the real estate industry watching talented agents burn out on cold calling and door knocking. We saw the same pattern everywhere — the agents who won weren&apos;t necessarily the best negotiators. They were just the first ones to reach motivated sellers.
              </p>
              <p className="text-gray-600 mb-6">
                So we asked: what if we could use AI and data to predict who&apos;s about to sell — before they even list? What if we could give every agent access to the same intelligence that only big franchises could afford?
              </p>
              <p className="text-gray-600 mb-8">
                That&apos;s Get Listings. <strong className="text-gray-900">AI-powered seller predictions for the everyday agent.</strong>
              </p>
              <div className="flex items-center gap-4">
                <img src="https://randomuser.me/api/portraits/men/75.jpg" className="w-14 h-14 rounded-full border-2 border-white shadow-lg" alt="Founder" />
                <div>
                  <div className="font-bold text-gray-900">Founded in Australia</div>
                  <div className="text-gray-500 text-sm">Built by agents, for agents</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gray-50 rounded-3xl p-6 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black text-red-600 mb-2">15M+</div>
                    <div className="text-gray-600 text-sm">Properties analysed</div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black text-green-600 mb-2">1,200+</div>
                    <div className="text-gray-600 text-sm">Agents trust us</div>
                  </div>
                  <div className="bg-blue-50 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black text-blue-600 mb-2">12+</div>
                    <div className="text-gray-600 text-sm">Seller signals tracked</div>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-6 text-center">
                    <div className="text-4xl font-black text-purple-600 mb-2">89%</div>
                    <div className="text-gray-600 text-sm">Lead quality rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies / Results Section */}
      <section id="for-agents" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-6">
              <span className="text-green-700 text-sm font-semibold">📊 Real Results</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-6 leading-tight">
              Agents Are Winning More Listings
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don&apos;t take our word for it. Here&apos;s what the numbers say.
            </p>
          </div>

          {/* Big Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-center text-white">
              <div className="text-5xl font-black mb-2">3.2x</div>
              <div className="text-red-100">More listings won<br/>on average</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-center text-white">
              <div className="text-5xl font-black mb-2">47%</div>
              <div className="text-green-100">Higher conversion<br/>rate on leads</div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-center text-white">
              <div className="text-5xl font-black mb-2">2 wks</div>
              <div className="text-blue-100">Earlier access to<br/>motivated sellers</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-center text-white">
              <div className="text-5xl font-black mb-2">$0</div>
              <div className="text-purple-100">Wasted on<br/>shared leads</div>
            </div>
          </div>

          {/* Case Study Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://randomuser.me/api/portraits/women/65.jpg" className="w-16 h-16 rounded-full border-2 border-white shadow-lg" alt="" />
                <div>
                  <div className="font-bold text-gray-900 text-lg">Sarah M.</div>
                  <div className="text-gray-500">Independent Agent, Sydney</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Before</div>
                    <div className="text-2xl font-bold text-gray-400">4</div>
                    <div className="text-xs text-gray-400">listings/year</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">After</div>
                    <div className="text-2xl font-bold text-green-600">11</div>
                    <div className="text-xs text-gray-500">listings/year</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;I was skeptical at first, but the AI actually works. I got my first listing within 2 weeks of signing up — a seller I never would have found otherwise.&quot;</p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <img src="https://randomuser.me/api/portraits/men/42.jpg" className="w-16 h-16 rounded-full border-2 border-white shadow-lg" alt="" />
                <div>
                  <div className="font-bold text-gray-900 text-lg">James T.</div>
                  <div className="text-gray-500">Ray White, Melbourne</div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Before</div>
                    <div className="text-2xl font-bold text-gray-400">15hrs</div>
                    <div className="text-xs text-gray-400">prospecting/wk</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">After</div>
                    <div className="text-2xl font-bold text-green-600">4hrs</div>
                    <div className="text-xs text-gray-500">prospecting/wk</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">&quot;I used to spend entire days door knocking. Now I spend 30 minutes in the morning checking my hot leads and make targeted calls. Same results, 10% of the effort.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section with Facebook/Google */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Facebook & Google badges */}
          <div className="flex flex-col lg:flex-row items-center justify-between mb-12 gap-8">
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <div>
                <div className="font-bold text-gray-900 text-lg">facebook.</div>
                <div className="flex gap-0.5 text-yellow-400 text-sm">★★★★★</div>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900">Verified <span className="text-[#c8102e]">5-Star</span> Service</h2>
              <p className="text-xl text-gray-500 mt-2">Real agents, real results</p>
            </div>
            
            <div className="flex items-center gap-3">
              <svg className="w-8 h-8" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              <div className="text-right">
                <div className="font-bold text-gray-900">Google</div>
                <div className="flex items-center gap-1 justify-end">
                  <span className="font-bold">5.0</span>
                  <span className="text-yellow-400 text-sm">★★★★★</span>
                </div>
                <div className="text-xs text-gray-500">Based on 31 reviews</div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-end gap-3 mb-6">
            <button 
              onClick={() => scrollTestimonials('prev')}
              className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button 
              onClick={() => scrollTestimonials('next')}
              className="w-12 h-12 rounded-full bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* Testimonial Slider */}
        <div className="relative overflow-hidden">
          <div 
            className="flex gap-6 transition-transform duration-500 ease-out pl-8"
            style={{ transform: `translateX(-${testimonialPosition}px)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-8 w-[400px] flex-shrink-0">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white text-2xl font-bold`}>
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-gray-500 text-xs uppercase tracking-wide">{testimonial.company}</div>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-yellow-400">★★★★★</div>
                </div>
                <p className="text-gray-600">{testimonial.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="get-started" className="py-24 bg-gradient-to-br from-gray-900 via-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="text-white text-sm font-semibold">🚀 Start Winning More Listings Today</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Ready to Transform<br/>Your Prospecting?
          </h2>

          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Access our AI-powered portal to discover seller leads, get predictions on 15M+ properties, and start winning more listings.
          </p>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 mb-8 max-w-xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-3xl font-black text-white">7</div>
                <div className="text-sm text-gray-400">Day Free Trial</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">$0</div>
                <div className="text-sm text-gray-400">Credit Card Required</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">2 min</div>
                <div className="text-sm text-gray-400">Setup Time</div>
              </div>
            </div>

            <Link 
              href="/login" 
              className="w-full bg-gradient-to-r from-red-600 to-[#c8102e] text-white font-black px-8 py-5 rounded-2xl text-xl flex items-center justify-center gap-3 group hover:shadow-lg hover:shadow-red-500/30 transition-all"
            >
              <span>ACCESS THE PORTAL</span>
              <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#c8102e] flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-white">Get Listings</span>
          </div>
          <p className="mb-6">AI-powered lead intelligence for Australian real estate agents.</p>
          <p className="text-sm">© 2026 Get Listings. All rights reserved. Made with ❤️ in Australia.</p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse-red {
          0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(255, 0, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
        }
      `}</style>
    </div>
  );
}
