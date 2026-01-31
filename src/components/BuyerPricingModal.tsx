'use client';

import { useState, useEffect } from 'react';
import { X, Check, Users, Building, Crown, ArrowRight, ArrowLeft, Loader2, Home } from 'lucide-react';

interface BuyerPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPackage?: Tier | null;
}

interface Tier {
  id: string;
  name: string;
  price: string;
  priceNote?: string;
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
    id: 'starter',
    name: 'Starter',
    price: '$500',
    description: 'Qualified buyers for a specific listing',
    highlight: '5–8 Qualified Buyers',
    icon: Home,
    features: [
      '5–8 qualified buyers',
      'Verified work history',
      'Budget confirmed',
      '7–14 day delivery',
      'Email support',
    ],
    popular: false,
    gradient: 'from-slate-600 to-slate-700',
    buttonClass: 'bg-white text-slate-900 hover:bg-gray-100',
  },
  {
    id: 'growth',
    name: 'Growth',
    price: '$2,000',
    priceNote: '– $3,000',
    description: 'Higher-intent buyers with deeper qualification',
    highlight: '15–25 Qualified Buyers',
    icon: Building,
    features: [
      'Everything in Starter',
      '15–25 qualified buyers',
      'Budget + timeframe confirmed',
      '5–10 day delivery',
      'Priority matching',
    ],
    popular: true,
    gradient: 'from-blue-500 via-blue-600 to-blue-500',
    buttonClass: 'bg-slate-900 text-white hover:bg-slate-800',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$5,000',
    priceNote: '+',
    description: 'Hand-selected buyer demand with manual screening',
    highlight: '30–50+ Qualified Buyers',
    icon: Crown,
    features: [
      'Everything in Growth',
      '30–50+ qualified buyers',
      'Dedicated campaign manager',
      'Manual screening process',
      'Unlimited candidate pool',
      'Priority support',
    ],
    popular: false,
    gradient: 'from-slate-800 to-slate-900',
    buttonClass: 'bg-white text-slate-900 hover:bg-gray-100',
  },
];

type Step = 'pricing' | 'form' | 'success';

export function BuyerPricingModal({ isOpen, onClose, initialPackage }: BuyerPricingModalProps) {
  const [step, setStep] = useState<Step>('pricing');
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form fields
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [buyerCount, setBuyerCount] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Handle initial package selection
  useEffect(() => {
    if (isOpen && initialPackage) {
      setSelectedTier(initialPackage);
      setStep('form');
    }
  }, [isOpen, initialPackage]);

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
        setPropertyAddress('');
        setPropertyType('');
        setPriceRange('');
        setBuyerCount('');
        setNotes('');
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

    if (!propertyAddress.trim() || !propertyType.trim() || !priceRange.trim() || !buyerCount.trim() || !email.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/buyers/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          package: selectedTier?.name,
          price: selectedTier?.price,
          propertyAddress,
          propertyType,
          priceRange,
          buyerCount,
          email,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setStep('success');
    } catch {
      setError('Failed to submit enquiry. Please try again.');
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
                <span className="text-blue-400 text-sm font-medium tracking-wide uppercase">
                  Buyer Packages
                </span>
                <h2 className="text-3xl font-bold text-white mt-2 mb-3">
                  Get qualified buyers for your listings
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                  Choose the package that fits your needs. All buyers are pre-qualified with budgets and timelines confirmed.
                </p>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tiers.map((tier) => (
                  <div
                    key={tier.id}
                    className={`relative rounded-2xl p-6 transition-all duration-300 ${
                      tier.popular
                        ? 'bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-blue-400/5 border-2 border-blue-400/50 shadow-lg shadow-blue-500/20 md:scale-105'
                        : 'bg-slate-800/50 border border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-bold rounded-full shadow-lg">
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
                        {tier.price}
                      </span>
                      {tier.priceNote && (
                        <span className="text-slate-400 ml-1">{tier.priceNote}</span>
                      )}
                    </div>

                    <div
                      className={`p-3 rounded-xl mb-6 ${
                        tier.popular
                          ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/30'
                          : 'bg-slate-700/50 border border-slate-600'
                      }`}
                    >
                      <p
                        className={`text-center font-semibold ${
                          tier.popular ? 'text-blue-300' : 'text-white'
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
                              tier.popular ? 'text-blue-400' : 'text-blue-400'
                            }`}
                          />
                          <span className="text-slate-300 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectTier(tier)}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${tier.buttonClass} ${
                        tier.popular ? 'shadow-lg shadow-blue-500/25' : ''
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
                    <span>Exclusive buyers—never shared</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Budget confirmed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Timeframe known</span>
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
                  {selectedTier.name} Package — {selectedTier.price}
                </h2>
                <p className="text-slate-400">Tell us about your property and buyer needs</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Property Address *
                  </label>
                  <input
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => setPropertyAddress(e.target.value)}
                    placeholder="e.g. 123 Main Street, Brisbane QLD"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select property type</option>
                    <option value="house">House</option>
                    <option value="apartment">Apartment/Unit</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="land">Land</option>
                    <option value="off-the-plan">Off-the-Plan</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Price Range *
                  </label>
                  <input
                    type="text"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    placeholder="e.g. $800,000 - $1,000,000"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    How many buyers do you need? *
                  </label>
                  <select
                    value={buyerCount}
                    onChange={(e) => setBuyerCount(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select number of buyers</option>
                    <option value="5-10">5–10 buyers</option>
                    <option value="10-20">10–20 buyers</option>
                    <option value="20-30">20–30 buyers</option>
                    <option value="30-50">30–50 buyers</option>
                    <option value="50+">50+ buyers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@agency.com"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Additional Notes (optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any specific buyer requirements, timeline, etc."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
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
                  className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  We&apos;ll reach out within 24 hours to discuss your buyer needs.
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
                      backgroundColor: ['#3B82F6', '#06B6D4', '#10B981', '#8B5CF6', '#F59E0B'][
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
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-500/30">
                  <Check className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-white mb-3">Enquiry Submitted!</h2>
                <p className="text-slate-300 mb-2">We&apos;ve received your buyer request.</p>
                <p className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-8">
                  Our team will be in touch within 24 hours.
                </p>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-8">
                  <p className="text-white font-semibold">
                    {selectedTier.name} Package — {selectedTier.price}
                  </p>
                  <p className="text-slate-400 mt-1">
                    {propertyAddress}
                  </p>
                  <p className="text-slate-400">
                    {buyerCount} buyers requested
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

export { tiers as buyerTiers };
export type { Tier as BuyerTier };
