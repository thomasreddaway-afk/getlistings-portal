'use client';

import { DemoLayout } from '@/components/layout';
import Link from 'next/link';

// Mock sold properties data for carousel
const soldProperties = [
  { image: '/Sold Images/5.png', commission: '$77,000+', location: 'Hawthorne, QLD', featured: true },
  { image: '/Sold Images/6.png', commission: '$86,000+', location: 'Hope Island, QLD', featured: true },
  { image: '/Sold Images/1.png', commission: '$25,000+', location: 'North Narrabeen, NSW', featured: false },
  { image: '/Sold Images/2.png', commission: '$43,000+', location: 'Lane Cove, NSW', featured: false },
  { image: '/Sold Images/7.png', commission: '$24,000+', location: 'Corlette, NSW', featured: false },
  { image: '/Sold Images/8.png', commission: '$30,000+', location: 'Little Mountain, QLD', featured: false },
  { image: '/Sold Images/3.png', commission: '$20,000+', location: 'St Leonards, NSW', featured: false },
  { image: '/Sold Images/4.png', commission: '$16,000+', location: 'Gregory Hills, NSW', featured: false },
];

const soldPropertiesRow2 = [
  { image: '/Sold Images/9.png', commission: '$18,000+', location: 'Lenah Valley, TAS' },
  { image: '/Sold Images/10.png', commission: '$21,000+', location: 'Mentone, VIC' },
  { image: '/Sold Images/11.png', commission: '$22,000+', location: 'Englorie Park, NSW' },
  { image: '/Sold Images/12.png', commission: '$39,000+', location: 'Sanctuary Cove, QLD' },
  { image: '/Sold Images/13.png', commission: '$30,000+', location: 'Shoal Bay, NSW' },
  { image: '/Sold Images/14.png', commission: '$32,000+', location: 'Botany, NSW' },
  { image: '/Sold Images/15.png', commission: '$32,000+', location: 'Sanctuary Cove, QLD' },
  { image: '/Sold Images/16.png', commission: '$42,000+', location: 'Eastwood, NSW' },
];

const soldPropertiesRow3 = [
  { image: '/Sold Images/17.png', commission: '$18,000+', location: 'Darley, VIC' },
  { image: '/Sold Images/18.png', commission: '$42,000+', location: 'Cremorne, NSW' },
  { image: '/Sold Images/19.png', commission: '$41,000+', location: 'Corlette, NSW' },
  { image: '/Sold Images/20.png', commission: '$35,000+', location: 'Ashgrove, QLD' },
  { image: '/Sold Images/21.png', commission: '$52,000+', location: 'Mosman, NSW' },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Verified Seller Intent',
    description: 'Every lead has actively requested a property valuation or shown clear selling signals.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Territory Exclusive',
    description: 'Leads are delivered exclusively to you in your chosen suburbs. No sharing with competitors.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Real-Time Delivery',
    description: 'Get notified instantly when a new lead comes in. Strike while the iron is hot.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Performance Tracking',
    description: 'Full transparency on lead quality with our advanced analytics dashboard.',
  },
];

const SoldCard = ({ property, featured = false }: { property: { image: string; commission: string; location: string; featured?: boolean }; featured?: boolean }) => (
  <div className={`sold-card flex-shrink-0 w-[200px] h-[150px] relative rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-xl hover:z-10 group`}>
    <img 
      src={property.image} 
      alt={property.location} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent group-hover:from-red-600/95 group-hover:via-red-600/70 transition-all duration-300"></div>
    <div className="absolute bottom-0 left-0 right-0 p-3">
      <span className="inline-block bg-red-600 text-white font-bold text-xs px-2 py-1 rounded mb-1">{property.commission}</span>
      <p className="text-white/90 text-sm">{property.location}</p>
    </div>
  </div>
);

export default function ExclusivePage() {
  return (
    <DemoLayout currentPage="exclusive">
      <div className="flex-1 overflow-auto">
        {/* PAYWALL LANDING PAGE */}
        <div className="flex-1 overflow-auto">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-primary via-red-600 to-rose-700 text-white">
            <div className="max-w-6xl mx-auto px-6 py-12">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-medium">
                  Partnership Program
                </span>
                <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-bold">
                  PRO
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">
                Exclusive Seller Leads In Your Core Suburbs
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mb-8">
                High-quality, verified seller leads delivered directly to you. Our intelligent
                advertising finds homeowners ready to sell in your target suburbs.
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 mb-8">
                <div>
                  <p className="text-3xl font-black">700+</p>
                  <p className="text-white/70 text-sm">Partner Agents</p>
                </div>
                <div>
                  <p className="text-3xl font-black">150k+</p>
                  <p className="text-white/70 text-sm">Leads Delivered</p>
                </div>
                <div>
                  <p className="text-3xl font-black">$1.5B+</p>
                  <p className="text-white/70 text-sm">Properties Listed</p>
                </div>
                <div>
                  <p className="text-3xl font-black">5.0 ⭐</p>
                  <p className="text-white/70 text-sm">Google Reviews</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <a
                  href="https://calendly.com/getlistingsnow/onboarding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Book Onboarding Call
                </a>
                <a
                  href="mailto:tom@getlistings.com.au"
                  className="px-6 py-3 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/30"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>

          {/* Wall of Success */}
          <div className="bg-gray-50 py-16 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-10">
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                  <span className="text-primary">$1,500,000,000+</span> listed
                </h2>
                <p className="text-xl text-gray-500">Our #1 goal is to make you money. Here's proof.</p>
              </div>
            </div>

            {/* Carousel Rows */}
            <div className="relative">
              {/* Gradient fades */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

              {/* Row 1 */}
              <div className="flex gap-4 mb-4 overflow-hidden">
                <div className="flex gap-4 animate-scroll-left">
                  {[...soldProperties, ...soldProperties].map((property, idx) => (
                    <SoldCard key={`row1-${idx}`} property={property} featured={property.featured} />
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex gap-4 mb-4 overflow-hidden">
                <div className="flex gap-4 animate-scroll-right">
                  {[...soldPropertiesRow2, ...soldPropertiesRow2].map((property, idx) => (
                    <SoldCard key={`row2-${idx}`} property={property} />
                  ))}
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex gap-4 overflow-hidden">
                <div className="flex gap-4 animate-scroll-left-slow">
                  {[...soldPropertiesRow3, ...soldPropertiesRow3, ...soldPropertiesRow3].map((property, idx) => (
                    <SoldCard key={`row3-${idx}`} property={property} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">How It Works</h2>
              <p className="text-gray-500 text-center mb-12 max-w-2xl mx-auto">
                We run targeted digital advertising campaigns to find homeowners in your suburbs
                who are actively thinking about selling.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Choose Your Suburbs</h3>
                  <p className="text-sm text-gray-500">
                    Select the suburbs where you want exclusive leads. Territory is protected.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">We Run Ads</h3>
                  <p className="text-sm text-gray-500">
                    Our team runs Facebook, Instagram & Google ads targeting homeowners.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Leads Come To You</h3>
                  <p className="text-sm text-gray-500">
                    Verified leads are delivered to your phone and email in real-time.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-600">4</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">List & Earn</h3>
                  <p className="text-sm text-gray-500">
                    Convert leads into listings and grow your business.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gray-50 py-16">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Why Partner Agents Love Us
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing CTA */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join 700+ agents who are growing their business with exclusive seller leads.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="https://calendly.com/getlistingsnow/onboarding"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-primary/25"
                >
                  Book Your Onboarding Call
                </a>
                <a
                  href="mailto:tom@getlistings.com.au"
                  className="px-8 py-4 bg-white/10 backdrop-blur text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/30"
                >
                  Contact Sales Team
                </a>
              </div>
              <p className="text-gray-400 text-sm mt-6">
                No lock-in contracts • Cancel anytime • 30-day money-back guarantee
              </p>
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-white py-16">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                What Our Partners Say
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "I've listed 6 properties from Get Listings leads in the last 3 months. The ROI
                    is incredible. Best marketing investment I've made."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                      JB
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">James B.</p>
                      <p className="text-sm text-gray-500">Ray White, Sydney</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "The quality of leads is exceptional. These are real homeowners who want to
                    sell, not tire kickers. Worth every cent."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                      SM
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Sarah M.</p>
                      <p className="text-sm text-gray-500">McGrath, Brisbane</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4">
                    "I was skeptical at first, but the results speak for themselves. $2M listing
                    from my first lead. Now I'm hooked."
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold mr-3">
                      MK
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Michael K.</p>
                      <p className="text-sm text-gray-500">LJ Hooker, Melbourne</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
