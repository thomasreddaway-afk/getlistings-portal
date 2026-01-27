'use client';

import { DemoLayout } from '@/components/layout';
import { 
  Palette, Globe, Filter, Image, TrendingUp, Users,
  Check, X, ArrowRight, Lock, CheckCircle, Calendar
} from 'lucide-react';

const buildItems = [
  { icon: Palette, title: 'Brand Identity', description: 'Your agency name, positioning, logo system, colour palette, and brand guidelines. Professionally designed to stand out in your market.' },
  { icon: Globe, title: 'High-Converting Website', description: 'A fast, mobile-optimised website built to convert visitors into appraisal requests. SEO-ready and designed to build credibility.' },
  { icon: Filter, title: 'Listing & Appraisal Funnels', description: 'Dedicated landing pages for property valuations, seller guides, and market reports. Engineered to capture high-intent leads.' },
  { icon: Image, title: 'Marketing Creative', description: 'Social media templates, ad creative, email sequences, and property marketing collateral. All on-brand and ready to deploy.' },
  { icon: TrendingUp, title: 'Paid Ads & Lead Generation', description: "We run and optimise Facebook, Instagram, and Google campaigns in your target suburbs. You don't touch the ads manager." },
  { icon: Users, title: 'Qualified Lead Delivery', description: 'Leads are qualified, enriched with property data, and delivered directly to your phone. Exclusive to you—never shared.' }
];

const setupIncludes = [
  'Complete brand identity & positioning',
  'Custom website & lead funnels',
  'Full marketing creative suite',
  '12 months managed ad campaigns',
  'Minimum 50 qualified leads delivered',
  'Ongoing optimisation & support'
];

const notForYou = [
  { title: 'Not for hobby agents', desc: 'This is for people building a career, not a side hustle.' },
  { title: "Not for people who don't answer their phone", desc: "Speed to lead matters. If you're not responsive, this won't work." },
  { title: 'Not for those unwilling to invest', desc: "If you're not ready to bet on yourself, we're not the right partner." }
];

const forYou = [
  'You want to own your lead flow, not rent it',
  "You're ready to be known in your market",
  "You'd rather sell than build funnels",
  'You want a system that compounds over time',
  "You're ready to invest in your future self"
];

const independenceFeatures = [
  'Full ownership of your domain and website',
  'All brand assets, files, and guidelines transferred',
  'Complete ad account and pixel ownership',
  'CRM, funnels, and lead data fully exported',
  'Fully separated from Get Listings infrastructure'
];

export default function LaunchpadPage() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <DemoLayout currentPage="launchpad">
      <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-50 to-white">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-transparent to-transparent opacity-60"></div>
          
          <div className="relative max-w-5xl mx-auto px-8 pt-20 pb-16">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-px bg-primary"></div>
              <span className="text-xs font-semibold text-primary uppercase tracking-widest">Private Program</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight max-w-3xl">
              Your agency.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500">Built and run for you.</span>
            </h1>
            
            <p className="mt-6 text-xl text-gray-600 max-w-2xl leading-relaxed">
              We design your brand, build your website, create your marketing, run your ads, and deliver qualified leads. You focus on one thing: listing and selling property.
            </p>
            
            <div className="mt-10 flex items-center space-x-6">
              <button onClick={() => scrollToSection('launchpad-how-it-works')} className="px-8 py-4 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/20">
                See How It Works
              </button>
              <button onClick={() => scrollToSection('launchpad-apply')} className="px-8 py-4 text-gray-700 font-semibold hover:text-gray-900 transition-colors flex items-center space-x-2">
                <span>Apply Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-16 flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>12 agencies launched</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>$47M in listings generated</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Avg. 6.2 listings in first 90 days</span>
              </div>
            </div>
          </div>
        </div>

        {/* What We Build Section */}
        <div id="launchpad-how-it-works" className="max-w-5xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We handle the infrastructure so you can focus on relationships and revenue.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {buildItems.map((item) => (
              <div key={item.title} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-200 transition-colors">
                  <item.icon className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Model Section */}
        <div className="bg-slate-50 py-24">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The investment model</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">A one-time setup investment. Designed to pay for itself through listings.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-semibold text-gray-900">Setup Investment</h3>
                  <span className="text-3xl font-bold text-gray-900">$50,000</span>
                </div>
                
                <div className="space-y-4">
                  {setupIncludes.map((item) => (
                    <div key={item} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Ad spend is separate and managed by us. Typical monthly spend: $2,000–$5,000 depending on market.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">The simple economics</h3>
                  
                  <div className="space-y-5">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Avg. sale price in your area</span>
                      <span className="font-semibold text-gray-900">$1,200,000</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Your commission (2%)</span>
                      <span className="font-semibold text-gray-900">$24,000</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Listings to break even</span>
                      <span className="font-semibold text-primary">2–3 sales</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-600">Typical time to break even</span>
                      <span className="font-semibold text-gray-900">60–90 days</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
                  <p className="text-slate-300 text-sm mb-2">After break-even</p>
                  <p className="text-2xl font-bold mb-4">Every additional listing is pure profit.</p>
                  <p className="text-slate-400 text-sm leading-relaxed">Most Launchpad agents generate 6–12 listings in their first year. At an average commission of $24,000, that's $144,000–$288,000 in gross commission income.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Not For Everyone Section */}
        <div className="max-w-5xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">This is not for everyone.</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We're selective about who we work with. The Launchpad program works best for agents who are serious about building something real—not those looking for a quick fix.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 border border-red-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">This is NOT for you if...</h3>
              <div className="space-y-4">
                {notForYou.map((item) => (
                  <div key={item.title} className="flex items-start space-x-4">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">This is for you if...</h3>
              <div className="space-y-4">
                {forYou.map((item) => (
                  <div key={item} className="flex items-start space-x-4">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Go Independent Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24">
          <div className="max-w-5xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-px bg-amber-400"></div>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Premium Upgrade</span>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-6">Ready to go fully independent?</h2>
                <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                  Some agents want to graduate beyond the Launchpad and own everything outright. We offer a premium pathway to full independence.
                </p>
                
                <div className="space-y-4 mb-8">
                  {independenceFeatures.map((item) => (
                    <div key={item} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="text-center">
                  <p className="text-slate-400 text-sm mb-2">Independence Package</p>
                  <p className="text-4xl font-bold text-white mb-2">$25,000</p>
                  <p className="text-slate-400 text-sm mb-6">One-time. Everything is yours.</p>
                  
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Think of this as building equity. Most agents spend this much on marketing that disappears. Here, you're building a long-term asset.
                    </p>
                  </div>
                  
                  <p className="text-xs text-slate-500">Available to Launchpad members after 6 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div id="launchpad-apply" className="max-w-5xl mx-auto px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to build your agency?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              We accept a limited number of agents each quarter. Applications are reviewed manually to ensure fit.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button className="px-10 py-5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors shadow-xl shadow-gray-900/20 text-lg">
                Apply for Launchpad
              </button>
              <button className="px-10 py-5 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors text-lg">
                Request a Private Walkthrough
              </button>
            </div>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-gray-400" />
                <span>Limited spots per quarter</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-gray-400" />
                <span>Manual approval required</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Next cohort: February 2026</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Get Listings Launchpad</span>
              </div>
              <p className="text-sm text-gray-500">Questions? Email <a href="mailto:launchpad@getlistings.com.au" className="text-gray-700 hover:text-gray-900 underline">launchpad@getlistings.com.au</a></p>
            </div>
          </div>
        </div>
        
      </div>
    </DemoLayout>
  );
}
