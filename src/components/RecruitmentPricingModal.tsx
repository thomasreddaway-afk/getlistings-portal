'use client';

import { useState, useEffect } from 'react';
import { X, Check, Users, Award, Crown, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

interface RecruitmentPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Tier {
  id: string;
  name: string;
  price: number;
  description: string;
  highlight: string;
  icon: typeof Users;
  features: string[];
  popular: boolean;
  gradient: string;
  buttonClass: string;
}

const tiers: Tier[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 499,
    description: 'Get started with qualified candidates',
    highlight: '5 Screened CVs',
    icon: Users,
    features: [
      '5 pre-screened CVs',
      'Verified work history',
      'Skills assessment included',
      '7-day delivery',
      'Email support',
    ],
    popular: false,
    gradient: 'from-slate-600 to-slate-700',
    buttonClass: 'bg-white text-slate-900 hover:bg-gray-100',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1499,
    description: 'For serious hiring needs',
    highlight: '3 Guaranteed Interviews',
    icon: Award,
    features: [
      'Everything in Standard',
      '3 guaranteed interviews',
      'Candidate matching algorithm',
      'Priority placement',
      'Dedicated account manager',
      '30-day replacement guarantee',
    ],
    popular: true,
    gradient: 'from-amber-500 via-yellow-500 to-amber-400',
    buttonClass: 'bg-slate-900 text-white hover:bg-slate-800',
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 4999,
    description: 'White-glove placement service',
    highlight: 'Placement Guarantee',
    icon: Crown,
    features: [
      'Everything in Pro',
      'Guaranteed successful placement',
      'Executive search methodology',
      'Confidential headhunting',
      'Unlimited candidate pool',
      '90-day performance guarantee',
      'Replacement at no cost',
    ],
    popular: false,
    gradient: 'from-violet-600 to-purple-700',
    buttonClass: 'bg-white text-violet-700 hover:bg-violet-50',
  },
];

type Step = 'pricing' | 'form' | 'success';

export function RecruitmentPricingModal({ isOpen, onClose }: RecruitmentPricingModalProps) {
  const [step, setStep] = useState<Step>('pricing');
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [salaryBudget, setSalaryBudget] = useState('');
  const [email, setEmail] = useState('');

  // Pre-fill email from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const savedUser = localStorage.getItem('propdeals_user');
        if (savedUser) {
          const user = JSON.parse(savedUser);
          if (user.email) setEmail(user.email);
        }
      } catch {
        // Ignore
      }
    }
  }, [isOpen]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep('pricing');
        setSelectedTier(null);
        setJobTitle('');
        setLocation('');
        setSalaryBudget('');
        setError('');
      }, 300);
    }
  }, [isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSelectTier = (tier: Tier) => {
    setSelectedTier(tier);
    setStep('form');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!jobTitle.trim() || !location.trim() || !salaryBudget.trim() || !email.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/recruitment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: selectedTier?.name,
          price: `$${selectedTier?.price.toLocaleString()}`,
          jobTitle,
          location,
          salaryBudget,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setStep('success');
    } catch {
      setError('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl shadow-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 transition-all ${
            step === 'pricing' ? 'max-w-5xl' : 'max-w-lg'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* PRICING STEP */}
          {step === 'pricing' && (
            <div className="p-8">
              <div className="text-center mb-8">
                <span className="text-violet-400 text-sm font-medium tracking-wide uppercase">
                  Recruitment Packages
                </span>
                <h2 className="text-3xl font-bold text-white mt-2 mb-3">
                  Find your next top performer
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  Choose the package that fits your hiring needs. All plans include access to our vetted talent pool.
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative rounded-2xl p-6 transition-all duration-300 ${
                      tier.popular
                        ? 'bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-400/5 border-2 border-amber-400/50 shadow-lg shadow-amber-500/20 md:scale-105'
                        : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-900 text-xs font-bold rounded-full shadow-lg">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tier.gradient} flex items-center justify-center shadow-lg`}
                      >
                        <tier.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                        <p className="text-sm text-slate-400">{tier.description}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="text-4xl font-bold text-white">
                        ${tier.price.toLocaleString()}
                      </span>
                      <span className="text-slate-400 ml-2">AUD</span>
                    </div>

                    <div
                      className={`p-3 rounded-xl mb-6 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/30'
                          : 'bg-slate-700/50 border border-slate-600'
                      }`}
                    >
                      <p
                        className={`text-center font-semibold ${
                          tier.popular ? 'text-amber-300' : 'text-white'
                        }`}
                      >
                        {tier.highlight}
                      </p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <Check
                            className={`w-5 h-5 mr-2 flex-shrink-0 ${
                              tier.popular ? 'text-amber-400' : 'text-violet-400'
                            }`}
                          />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectTier(tier)}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${tier.buttonClass} ${
                        tier.popular ? 'shadow-lg shadow-amber-500/25' : ''
                      }`}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-700">
                <div className="flex items-center justify-center space-x-6 text-sm text-slate-400">
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Money-back guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>No hidden fees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FORM STEP */}
          {step === 'form' && selectedTier && (
            <div className="p-8">
              <button
                onClick={() => setStep('pricing')}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to packages
              </button>

              <div className="text-center mb-6">
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${selectedTier.gradient} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                >
                  <selectedTier.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {selectedTier.name} Package — ${selectedTier.price.toLocaleString()}
                </h2>
                <p className="text-slate-400">Tell us about the role you&apos;re hiring for</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Sales Associate"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Brisbane, QLD"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Base Salary Budget
                  </label>
                  <input
                    type="text"
                    value={salaryBudget}
                    onChange={(e) => setSalaryBudget(e.target.value)}
                    placeholder="e.g. $60,000 - $80,000"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@agency.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Request Invoice
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Payment due on receipt. Zero risk to start.
                </p>
              </form>
            </div>
          )}

          {/* SUCCESS STEP */}
          {step === 'success' && selectedTier && (
            <div className="p-8 text-center relative overflow-hidden">
              {/* Confetti */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(50)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute animate-confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: '-10px',
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${2 + Math.random() * 2}s`,
                      backgroundColor: ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'][
                        Math.floor(Math.random() * 5)
                      ],
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      borderRadius: Math.random() > 0.5 ? '50%' : '0',
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/30">
                  <Check className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-3">Order Received!</h2>
                <p className="text-slate-300 mb-2">We are preparing your invoice.</p>
                <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-8">
                  The AI Hunter has been activated.
                </p>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-8">
                  <p className="text-white font-semibold">
                    {selectedTier.name} Package — ${selectedTier.price.toLocaleString()}
                  </p>
                  <p className="text-slate-400 mt-1">
                    Role: {jobTitle} in {location}
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confetti animation */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(500px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
