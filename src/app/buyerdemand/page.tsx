'use client';

import { useState, useRef } from 'react';
import { DemoLayout } from '@/components/layout';
import { CheckCircle, Home, Building, Map, ArrowRight, ArrowDown, Crown } from 'lucide-react';
import { BuyerPricingModal, buyerTiers, type BuyerTier } from '@/components/BuyerPricingModal';

const qualificationPoints = [
  { title: 'Intent Verified', desc: 'Active buying intent confirmed' },
  { title: 'Budget Confirmed', desc: 'Price range validated' },
  { title: 'Timeframe Known', desc: 'Purchase timeline captured' },
  { title: 'Type Matched', desc: 'Property preferences aligned' },
  { title: 'Location Validated', desc: 'Suburb preferences confirmed' }
];

const useCases = [
  { title: 'Listing-Specific Buyers', desc: 'Buyers sourced specifically for a single property.', color: 'blue', features: ['Increase buyer competition', 'Support hard-to-sell properties', 'Reduce days on market'] },
  { title: 'Project & Off-the-Plan', desc: 'Buyers matched to apartments, townhouses, or house & land packages.', color: 'violet', features: ['Fill early release stages', 'Investor & owner-occupier mix', 'Prove demand to developers'] },
  { title: 'Land & Development', desc: 'Investors or owner-occupiers matched to land opportunities.', color: 'emerald', features: ['Long-form qualification', 'Build timeline captured', 'Finance pre-approval noted'] }
];

export default function BuyerDemandPage() {
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<BuyerTier | null>(null);
  const pricingSectionRef = useRef<HTMLDivElement>(null);

  const scrollToPricing = () => {
    pricingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePackageClick = (tierId: string) => {
    const tier = buyerTiers.find(t => t.id === tierId);
    if (tier) {
      setSelectedPackage(tier);
      setShowPricingModal(true);
    }
  };

  return (
    <DemoLayout currentPage="buyerdemand">
      <div className="flex-1 overflow-auto bg-gradient-to-b from-blue-50/30 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent"></div>
          <div className="relative max-w-5xl mx-auto px-8 pt-20 pb-16">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-px bg-blue-600"></div>
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">Qualified Buyer Flow</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight max-w-3xl">
              Buyers matched to your listings.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500">Before the first open home.</span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-2xl leading-relaxed">
              We generate qualified buyer demand for your listings, projects, and land packages—with budgets confirmed and timelines known.
            </p>
            <div className="mt-10">
              <button 
                onClick={scrollToPricing}
                className="px-10 py-5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center space-x-3 text-lg group"
              >
                <span>View Buyer Packages</span>
                <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
              </button>
            </div>
            <div className="mt-16 flex items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-blue-500" /><span>2,400+ buyers matched</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-blue-500" /><span>68% contact-to-inspection rate</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4 text-blue-500" /><span>Avg. 12 days to qualified buyer</span></div>
            </div>
          </div>
        </div>


        {/* Qualification Section */}
        <div className="max-w-5xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">This is not portal noise.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Every buyer is pre-qualified before you receive their details.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {qualificationPoints.map((point) => (
              <div key={point.title} className="bg-white rounded-2xl p-6 border border-gray-100 text-center hover:border-blue-200 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{point.title}</h3>
                <p className="text-sm text-gray-500">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Use Cases Section */}
        <div className="bg-slate-50 py-24">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Buyer demand for every deal type</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Whether it's a single listing, a staged release, or land packages—we match buyers to your inventory.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {useCases.map((uc) => (
                <div key={uc.title} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                  <div className={`w-14 h-14 bg-gradient-to-br from-${uc.color}-500 to-${uc.color}-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${uc.color}-500/20`}>
                    <Home className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{uc.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{uc.desc}</p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    {uc.features.map((f) => (
                      <li key={f} className="flex items-center space-x-2">
                        <CheckCircle className={`w-4 h-4 text-${uc.color}-500`} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div ref={pricingSectionRef} className="max-w-5xl mx-auto px-8 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Transparent pricing. Quality over volume.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Choose the package that matches your deal.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Starter Package */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-xl transition-all group cursor-pointer" onClick={() => handlePackageClick('starter')}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                      <Home className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Starter</h3>
                  </div>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Single Listing</span>
                </div>
                <div className="mb-6"><span className="text-4xl font-bold text-gray-900">$500</span><span className="text-gray-500 ml-1">one-time</span></div>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mb-6">
                  <p className="text-center font-semibold text-gray-700">5–8 Qualified Buyers</p>
                </div>
                <p className="text-gray-600 text-sm mb-6">Qualified buyers for a specific listing.</p>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" /><span className="text-gray-700">5–8 qualified buyers</span></li>
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" /><span className="text-gray-700">Budget confirmed</span></li>
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" /><span className="text-gray-700">7–14 day delivery</span></li>
                </ul>
                <button className="w-full py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl group-hover:border-blue-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Growth Package - Most Popular */}
            <div className="bg-white rounded-2xl border-2 border-blue-500 overflow-hidden shadow-xl relative cursor-pointer transform md:scale-105 hover:shadow-2xl transition-all" onClick={() => handlePackageClick('growth')}>
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold text-center py-1.5 uppercase tracking-wide">Most Popular</div>
              <div className="p-8 pt-12">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Growth</h3>
                  </div>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">Premium</span>
                </div>
                <div className="mb-6"><span className="text-4xl font-bold text-gray-900">$2,000</span><span className="text-gray-500 ml-1">– $3,000</span></div>
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-300 rounded-xl p-3 mb-6">
                  <p className="text-center font-semibold text-blue-700">15–25 Qualified Buyers</p>
                </div>
                <p className="text-gray-600 text-sm mb-6">Higher-intent buyers with deeper qualification.</p>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" /><span className="text-gray-700">15–25 qualified buyers</span></li>
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" /><span className="text-gray-700">Budget + timeframe confirmed</span></li>
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" /><span className="text-gray-700">5–10 day delivery</span></li>
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" /><span className="text-gray-700">Priority matching</span></li>
                </ul>
                <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Premium Package */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl text-white cursor-pointer hover:shadow-2xl transition-all" onClick={() => handlePackageClick('premium')}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Premium</h3>
                  </div>
                  <span className="text-xs font-medium text-amber-300 bg-amber-400/20 px-2 py-1 rounded">High-Value</span>
                </div>
                <div className="mb-6"><span className="text-4xl font-bold text-white">$5,000</span><span className="text-slate-400 ml-1">+</span></div>
                <div className="bg-amber-400/20 border border-amber-400/30 rounded-xl p-3 mb-6">
                  <p className="text-center font-semibold text-amber-300">30–50+ Qualified Buyers</p>
                </div>
                <p className="text-slate-300 text-sm mb-6">Hand-selected buyer demand with manual screening.</p>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-amber-400 mt-0.5" /><span className="text-slate-200">30–50+ qualified buyers</span></li>
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-amber-400 mt-0.5" /><span className="text-slate-200">Dedicated campaign manager</span></li>
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-amber-400 mt-0.5" /><span className="text-slate-200">Manual screening process</span></li>
                  <li className="flex items-start space-x-3"><CheckCircle className="w-5 h-5 text-amber-400 mt-0.5" /><span className="text-slate-200">Priority support</span></li>
                </ul>
                <button className="w-full py-3 bg-white text-gray-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">All packages include exclusive buyers—never shared with other agents.</p>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 py-24">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Get qualified buyers for your next listing</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
              Tell us about your property. We&apos;ll match it with buyers who are ready to inspect.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button 
                onClick={() => setShowPricingModal(true)}
                className="px-10 py-5 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-xl text-lg flex items-center space-x-2"
              >
                <span>Request Buyer Demand</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-10 py-5 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white/50 hover:bg-white/10 transition-colors text-lg">Talk to Our Team</button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-blue-200">
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4" /><span>Not instant—buyers are matched and verified</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4" /><span>Exclusive to you—never shared</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Get Listings Buyer Demand</span>
              </div>
              <p className="text-sm text-gray-500">Questions? Email <a href="mailto:buyers@getlistings.com.au" className="text-gray-700 hover:text-gray-900 underline">buyers@getlistings.com.au</a></p>
            </div>
          </div>
        </div>

      </div>
      
      {/* Buyer Pricing Modal */}
      <BuyerPricingModal 
        isOpen={showPricingModal}
        onClose={() => {
          setShowPricingModal(false);
          setSelectedPackage(null);
        }}
        initialPackage={selectedPackage}
      />
    </DemoLayout>
  );
}
