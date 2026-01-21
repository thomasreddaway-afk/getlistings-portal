'use client';

import { DemoLayout } from '@/components/layout';
import { CheckCircle, User, Users, Award, Settings, PieChart, Globe, HelpCircle, Lock } from 'lucide-react';

const roleTypes = [
  { icon: User, title: 'Sales Agents', desc: 'Listing & selling specialists', color: 'violet' },
  { icon: Users, title: "Buyer's Agents", desc: 'Acquisition specialists', color: 'blue' },
  { icon: Award, title: 'Team Leaders', desc: 'Sales team management', color: 'amber' },
  { icon: Settings, title: 'Operations', desc: 'Business operations', color: 'green' },
  { icon: PieChart, title: 'Marketing', desc: 'Growth & brand roles', color: 'rose' }
];

const visibilityOptions = [
  { type: 'Public', desc: 'Visible to all Get Listings users. Your brand and opportunity are front and centre.', features: ['Full agency branding', 'Maximum reach', 'Instant applications'], color: 'green', popular: false },
  { type: 'Anonymous', desc: 'Role details visible, but your identity is hidden until mutual interest is confirmed.', features: ['Identity protected', 'Reveal on your terms', 'Avoid market speculation'], color: 'violet', popular: true },
  { type: 'Private', desc: 'Visible only to candidates you shortlist or those we vet on your behalf.', features: ['Invite-only access', 'Executive-level discretion', 'Pre-qualified candidates'], color: 'slate', popular: false }
];

const steps = [
  { num: 1, title: 'Post opportunity', desc: 'Share role details, compensation structure, and what you\'re looking for.' },
  { num: 2, title: 'Candidates apply', desc: 'Interested professionals express interest with a brief note.' },
  { num: 3, title: 'We facilitate', desc: 'Get Listings reviews fit and facilitates warm introductions.' },
  { num: 4, title: 'Connect directly', desc: 'Once approved, you connect directly to explore further.' }
];

export default function TalentPage() {
  return (
    <DemoLayout currentPage="talent">
      <div className="flex-1 overflow-auto bg-white">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-900 text-white">
          <div className="max-w-5xl mx-auto px-8 py-20">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-2 h-2 bg-violet-400 rounded-full"></div>
              <span className="text-violet-300 text-sm font-medium tracking-wide uppercase">Private Talent Marketplace</span>
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              The quiet market for<br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">exceptional talent.</span>
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
              Hire or be hired — discreetly, professionally, and based on real performance. No recruiters. No cold calls. No public profiles.
            </p>
            <div className="flex items-center space-x-4">
              <button className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg">Post an Opportunity</button>
              <button className="px-8 py-4 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10 transition-colors">Explore Opportunities</button>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-slate-400 text-sm mb-4">Trusted by principals and top performers across Australia</p>
              <div className="flex items-center space-x-8 text-slate-500">
                <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-violet-400" /><span className="text-slate-300 text-sm">47 placements this quarter</span></div>
                <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-violet-400" /><span className="text-slate-300 text-sm">$2.4M avg. first-year GCI</span></div>
                <div className="flex items-center space-x-2"><CheckCircle className="w-5 h-5 text-violet-400" /><span className="text-slate-300 text-sm">100% discretion guaranteed</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Types Section */}
        <div className="bg-slate-50 py-20">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Roles worth moving for</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">This isn't a job board. It's a private exchange for high-calibre opportunities.</p>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {roleTypes.map((role) => (
                <div key={role.title} className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-violet-300 hover:shadow-lg transition-all text-center group">
                  <div className={`w-14 h-14 bg-${role.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-${role.color}-200 transition-colors`}>
                    <role.icon className={`w-7 h-7 text-${role.color}-600`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{role.title}</h3>
                  <p className="text-sm text-gray-500">{role.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">Entry-level and casual roles are not accepted. This marketplace is for revenue-producing positions only.</p>
            </div>
          </div>
        </div>

        {/* Visibility Options Section */}
        <div className="bg-white py-20">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You control the visibility</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">Every opportunity can be tailored to your comfort level. Discretion is built into every layer.</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {visibilityOptions.map((opt) => (
                <div key={opt.type} className={`rounded-2xl p-8 ${opt.popular ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white relative' : 'bg-white border-2 border-gray-200 hover:border-violet-300'} transition-colors`}>
                  {opt.popular && <div className="absolute top-4 right-4 px-2 py-1 bg-violet-500 text-white text-xs font-bold rounded">POPULAR</div>}
                  <div className={`w-12 h-12 ${opt.popular ? 'bg-white/10' : `bg-${opt.color}-100`} rounded-xl flex items-center justify-center mb-6`}>
                    {opt.type === 'Public' && <Globe className={`w-6 h-6 ${opt.popular ? 'text-white' : `text-${opt.color}-600`}`} />}
                    {opt.type === 'Anonymous' && <HelpCircle className={`w-6 h-6 ${opt.popular ? 'text-white' : `text-${opt.color}-600`}`} />}
                    {opt.type === 'Private' && <Lock className={`w-6 h-6 ${opt.popular ? 'text-white' : `text-${opt.color}-600`}`} />}
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${opt.popular ? 'text-white' : 'text-gray-900'}`}>{opt.type}</h3>
                  <p className={`mb-4 ${opt.popular ? 'text-slate-300' : 'text-gray-600'}`}>{opt.desc}</p>
                  <ul className={`space-y-2 text-sm ${opt.popular ? 'text-slate-300' : 'text-gray-600'}`}>
                    {opt.features.map((f) => (
                      <li key={f} className="flex items-center">
                        <CheckCircle className={`w-4 h-4 mr-2 ${opt.popular ? 'text-violet-400' : 'text-green-500'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-slate-50 py-20">
          <div className="max-w-5xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How introductions work</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">No cold outreach. No spam. Just qualified connections when both parties are ready.</p>
            </div>
            <div className="grid grid-cols-4 gap-6">
              {steps.map((step) => (
                <div key={step.num} className="text-center">
                  <div className="w-16 h-16 bg-white border-2 border-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <span className="text-2xl font-bold text-violet-600">{step.num}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 py-24">
          <div className="max-w-4xl mx-auto px-8 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to make your next move?</h2>
            <p className="text-xl text-violet-100 max-w-2xl mx-auto mb-10 leading-relaxed">
              Whether you're hiring or exploring, start the conversation discreetly.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
              <button className="px-10 py-5 bg-white text-violet-700 font-semibold rounded-xl hover:bg-violet-50 transition-colors shadow-xl text-lg">Post an Opportunity</button>
              <button className="px-10 py-5 border-2 border-white/30 text-white font-semibold rounded-xl hover:border-white/50 hover:bg-white/10 transition-colors text-lg">Browse Opportunities</button>
            </div>
            <div className="flex items-center justify-center space-x-8 text-sm text-violet-200">
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4" /><span>100% confidential</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4" /><span>No recruiter fees</span></div>
              <div className="flex items-center space-x-2"><CheckCircle className="w-4 h-4" /><span>Performance-verified candidates</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50">
          <div className="max-w-5xl mx-auto px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Get Listings Talent Exchange</span>
              </div>
              <p className="text-sm text-gray-500">Questions? Email <a href="mailto:talent@getlistings.com.au" className="text-gray-700 hover:text-gray-900 underline">talent@getlistings.com.au</a></p>
            </div>
          </div>
        </div>

      </div>
    </DemoLayout>
  );
}
