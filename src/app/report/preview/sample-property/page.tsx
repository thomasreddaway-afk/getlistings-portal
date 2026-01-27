'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone, Mail, Bed, Bath, Car, Ruler, ArrowLeft, Globe, Star, Quote, ExternalLink } from 'lucide-react';

interface Testimonial {
  id: string;
  reviewerName: string;
  date: string;
  rating: number;
  text: string;
  propertyAddress?: string;
  source?: string;
  isTopFive?: boolean;
  order?: number;
}

interface AgentBranding {
  name: string;
  email: string;
  phone: string;
  photo: string;
  logo: string;
  agency: string;
  tagline: string;
  license: string;
  primaryColor: string;
  secondaryColor: string;
  bio: string;
  reaUrl: string;
  domainUrl: string;
  websiteUrl: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Sample testimonials for preview (when user hasn't added real ones yet)
const sampleTestimonials: Testimonial[] = [
  {
    id: 'sample-1',
    reviewerName: 'Sarah M.',
    date: 'December 2025',
    rating: 5,
    text: 'Outstanding service from start to finish! They went above and beyond to ensure we got the best price for our home. Highly recommend to anyone looking for a dedicated and professional agent.',
    propertyAddress: 'Brisbane, QLD',
    source: 'realestate.com.au',
    isTopFive: true,
    order: 0
  },
  {
    id: 'sample-2',
    reviewerName: 'Michael & Jennifer T.',
    date: 'November 2025',
    rating: 5,
    text: 'We were so impressed with the level of communication and market knowledge. The entire selling process was seamless and stress-free. We achieved a price well above our expectations.',
    propertyAddress: 'Gold Coast, QLD',
    source: 'domain.com.au',
    isTopFive: true,
    order: 1
  },
  {
    id: 'sample-3',
    reviewerName: 'David L.',
    date: 'October 2025',
    rating: 5,
    text: 'Fantastic experience selling our family home. Professional, knowledgeable, and genuinely cared about getting the best outcome for us. Would use again in a heartbeat!',
    propertyAddress: 'Sunshine Coast, QLD',
    source: 'realestate.com.au',
    isTopFive: true,
    order: 2
  }
];

export default function BrandingPreviewPage() {
  const [agentBranding, setAgentBranding] = useState<AgentBranding | null>(null);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    // Load agent data from localStorage
    const savedUser = localStorage.getItem('propdeals_user');
    const savedBranding = localStorage.getItem('agentBranding');
    const savedTestimonials = localStorage.getItem('agentTestimonials');
    
    const user = savedUser ? JSON.parse(savedUser) : {};
    const branding = savedBranding ? JSON.parse(savedBranding) : {};
    
    // Load testimonials - use saved ones or sample ones for preview
    if (savedTestimonials) {
      const allTestimonials: Testimonial[] = JSON.parse(savedTestimonials);
      // Get only top 5 testimonials, sorted by order
      const topFive = allTestimonials
        .filter(t => t.isTopFive)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .slice(0, 5);
      setTestimonials(topFive.length > 0 ? topFive : sampleTestimonials);
    } else {
      setTestimonials(sampleTestimonials);
    }
    
    // Also try to get phone/email from API profile if available
    const fetchAgentDetails = async () => {
      try {
        const token = localStorage.getItem('propdeals_token');
        if (token) {
          const response = await fetch('https://prop.deals/v1/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const profile = await response.json();
            setAgentBranding({
              name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || profile.name || 'Your Name',
              email: profile.email || user.email || 'agent@example.com',
              phone: profile.phone || profile.mobile || user.phone || '0400 000 000',
              photo: branding.headshot || branding.agentPhoto || user.avatar || profile.profilePicture || '',
              logo: branding.logo || branding.agencyLogo || '',
              agency: user.agency || user.agencyName || profile.agency || 'Your Agency',
              tagline: branding.tagline || branding.agentTagline || "Let's Sell!",
              license: branding.licenseNumber || '',
              primaryColor: branding.primaryColor || '#1e3a5f',
              secondaryColor: branding.secondaryColor || '#c9a962',
              bio: branding.bio || '',
              reaUrl: branding.reaUrl || '',
              domainUrl: branding.domainUrl || '',
              websiteUrl: branding.websiteUrl || '',
            });
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch agent profile:', err);
      }
      
      // Fallback if API call fails
      setAgentBranding({
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Your Name',
        email: user.email || 'agent@example.com',
        phone: user.phone || '0400 000 000',
        photo: branding.headshot || branding.agentPhoto || user.avatar || '',
        logo: branding.logo || branding.agencyLogo || '',
        agency: user.agency || user.agencyName || 'Your Agency',
        tagline: branding.tagline || branding.agentTagline || "Let's Sell!",
        license: branding.licenseNumber || '',
        primaryColor: branding.primaryColor || '#1e3a5f',
        secondaryColor: branding.secondaryColor || '#c9a962',
        bio: branding.bio || '',
        reaUrl: branding.reaUrl || '',
        domainUrl: branding.domainUrl || '',
        websiteUrl: branding.websiteUrl || '',
      });
    };
    
    fetchAgentDetails();
  }, []);

  // Sample property data for preview
  const sampleProperty = {
    address: '42 Sample Street',
    suburb: 'Brisbane',
    state: 'QLD',
    postcode: '4000',
    minPrice: 850000,
    maxPrice: 950000,
    propertyType: 'House',
    bedrooms: 4,
    bathrooms: 2,
    carSpaces: 2,
    landSize: 650,
    description: 'This stunning family home showcases modern living at its finest. Featuring spacious open-plan living areas flooded with natural light, a gourmet kitchen with premium appliances, and seamless indoor-outdoor flow to the entertainer\'s deck. Set on a generous block in a sought-after location, this property offers the perfect blend of style, comfort, and convenience.',
  };

  if (!agentBranding) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#1e3a5f' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading preview...</p>
        </div>
      </div>
    );
  }

  const primaryColor = agentBranding.primaryColor || '#1e3a5f';
  const fullAddress = `${sampleProperty.address}, ${sampleProperty.suburb} ${sampleProperty.state} ${sampleProperty.postcode}`;

  return (
    <>
      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          .a4-page { box-shadow: none !important; }
        }
        @page { size: A4; margin: 0; }
      `}</style>

      {/* Background */}
      <div className="min-h-screen bg-gray-200 py-8 px-4">
        {/* Preview Notice Banner */}
        <div className="no-print max-w-[210mm] mx-auto mb-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-yellow-600 font-medium">👀 Preview Mode</div>
              <div className="text-yellow-700 text-sm">
                This is how your branding will appear on property appraisal reports. The property details shown are sample data.
              </div>
            </div>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 text-sm font-medium text-yellow-700 hover:text-yellow-900 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Close Preview
            </button>
          </div>
        </div>

        {/* A4 Page */}
        <div 
          className="a4-page max-w-[210mm] mx-auto bg-white shadow-2xl overflow-hidden"
          style={{ minHeight: 'auto' }}
        >
          {/* Cover Section */}
          <div 
            className="flex flex-col text-white"
            style={{ 
              background: `radial-gradient(ellipse at top right, ${primaryColor}ee 0%, #1a1a2e 50%, #0d0d1a 100%)`,
              minHeight: '420px'
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-8">
              {/* Logo */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                {agentBranding.logo && agentBranding.logo.trim() !== '' ? (
                  <Image 
                    src={agentBranding.logo} 
                    alt="Agency" 
                    width={56} 
                    height={56} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full bg-white/20" />
                )}
              </div>
              
              {/* Date */}
              <div className="text-right text-white/60 text-sm">
                <div>Prepared on</div>
                <div className="font-semibold text-white">
                  {new Date().toLocaleDateString('en-AU', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center flex-1 flex flex-col justify-center items-center px-8">
              <div className="text-white/50 uppercase tracking-[0.3em] text-xs mb-4">
                Property Appraisal
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-3">
                {toTitleCase(sampleProperty.address)}
              </h1>
              
              <p className="text-lg text-white/70 mb-8">
                {sampleProperty.suburb}, {sampleProperty.state} {sampleProperty.postcode}
              </p>
              
              <div className="text-white/50 uppercase tracking-widest text-xs mb-4">
                Estimated Value Range
              </div>
              
              <div 
                className="px-12 py-4 rounded-lg mb-8"
                style={{ backgroundColor: '#ef4444' }}
              >
                <span className="text-2xl font-bold text-white">
                  {formatPrice(sampleProperty.minPrice)} - {formatPrice(sampleProperty.maxPrice)}
                </span>
              </div>
            </div>

            {/* Agent Footer in Cover */}
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30">
                    {agentBranding.photo ? (
                      <Image 
                        src={agentBranding.photo} 
                        alt={agentBranding.name || 'Agent'} 
                        width={56} 
                        height={56} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                        {agentBranding.name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">{agentBranding.name || 'Your Agent'}</div>
                    <div className="text-white/60 text-sm">{agentBranding.agency || 'Your Agency'}</div>
                    {agentBranding.tagline && (
                      <div className="text-white/50 text-sm italic">&quot;{agentBranding.tagline}&quot;</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {agentBranding.phone && (
                    <div className="flex items-center justify-end gap-2 text-white/90 mb-1">
                      <Phone className="w-4 h-4" />
                      <span>{agentBranding.phone}</span>
                    </div>
                  )}
                  {agentBranding.email && (
                    <div className="flex items-center justify-end gap-2 text-white/90">
                      <Mail className="w-4 h-4" />
                      <span>{agentBranding.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Section */}
          <div className="p-8">
            {/* Beds/Baths/Cars/Land */}
            <div className="grid grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Bed className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div className="text-2xl font-bold" style={{ color: primaryColor }}>{sampleProperty.bedrooms}</div>
                <div className="text-sm text-gray-500">Bedrooms</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Bath className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div className="text-2xl font-bold" style={{ color: primaryColor }}>{sampleProperty.bathrooms}</div>
                <div className="text-sm text-gray-500">Bathrooms</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Car className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div className="text-2xl font-bold" style={{ color: primaryColor }}>{sampleProperty.carSpaces}</div>
                <div className="text-sm text-gray-500">Car Spaces</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Ruler className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div className="text-2xl font-bold" style={{ color: primaryColor }}>{sampleProperty.landSize}</div>
                <div className="text-sm text-gray-500">m² Land</div>
              </div>
            </div>

            {/* Property Description */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Property Overview</h3>
              <p className="text-gray-600 leading-relaxed">
                {sampleProperty.description}
              </p>
            </div>

            {/* Map Placeholder */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Location</h3>
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 border flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <div className="text-3xl mb-2">📍</div>
                  <p className="text-sm">Map will display here</p>
                  <p className="text-xs text-gray-400 mt-1">{fullAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* About the Agent Section */}
          <div className="px-8 pb-8">
            <div 
              className="rounded-xl p-6"
              style={{ backgroundColor: `${primaryColor}08`, borderLeft: `4px solid ${primaryColor}` }}
            >
              <div className="flex items-start gap-6">
                {/* Agent Photo */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-24 h-24 rounded-xl overflow-hidden shadow-lg"
                    style={{ border: `3px solid ${primaryColor}30` }}
                  >
                    {agentBranding.photo ? (
                      <Image 
                        src={agentBranding.photo} 
                        alt={agentBranding.name || 'Agent'} 
                        width={96} 
                        height={96} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl font-bold">
                        {agentBranding.name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                </div>

                {/* Agent Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{agentBranding.name || 'Your Name'}</h3>
                  <p className="text-gray-600 mb-1">{agentBranding.agency || 'Your Agency'}</p>
                  {agentBranding.license && (
                    <p className="text-sm text-gray-500 mb-3">License: {agentBranding.license}</p>
                  )}
                  
                  {/* Bio */}
                  {agentBranding.bio ? (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {agentBranding.bio.length > 300 ? agentBranding.bio.substring(0, 300) + '...' : agentBranding.bio}
                    </p>
                  ) : (
                    <p className="text-gray-400 text-sm italic mb-4">
                      Add your bio in Settings to personalize your reports.
                    </p>
                  )}

                  {/* Contact & Links */}
                  <div className="flex flex-wrap items-center gap-4">
                    {agentBranding.phone && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Phone className="w-4 h-4" style={{ color: primaryColor }} />
                        <span>{agentBranding.phone}</span>
                      </div>
                    )}
                    {agentBranding.email && (
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Mail className="w-4 h-4" style={{ color: primaryColor }} />
                        <span>{agentBranding.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Online Profiles */}
              {(agentBranding.reaUrl || agentBranding.domainUrl || agentBranding.websiteUrl) && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Find Me Online</h4>
                  <div className="flex flex-wrap gap-3">
                    {agentBranding.reaUrl && (
                      <a 
                        href={agentBranding.reaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: '#e4002b15',
                          color: '#e4002b'
                        }}
                      >
                        <Globe className="w-4 h-4" />
                        realestate.com.au
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                    {agentBranding.domainUrl && (
                      <a 
                        href={agentBranding.domainUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: '#00a69415',
                          color: '#00a694'
                        }}
                      >
                        <Globe className="w-4 h-4" />
                        domain.com.au
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                    {agentBranding.websiteUrl && (
                      <a 
                        href={agentBranding.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all hover:shadow-md"
                        style={{ 
                          backgroundColor: `${primaryColor}15`,
                          color: primaryColor
                        }}
                      >
                        <Globe className="w-4 h-4" />
                        My Website
                        <ExternalLink className="w-3 h-3 opacity-60" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Testimonials Section */}
          {testimonials.length > 0 && (
            <div className="px-8 pb-8">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Client Testimonials</h3>
                <p className="text-xs text-gray-400">What our clients say about working with us</p>
              </div>
              
              <div className="space-y-4">
                {testimonials.slice(0, 3).map((testimonial) => (
                  <div 
                    key={testimonial.id}
                    className="relative rounded-xl p-5 bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm"
                  >
                    {/* Quote Icon */}
                    <div 
                      className="absolute -top-2 -left-2 w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Quote className="w-4 h-4 text-white" />
                    </div>
                    
                    <div className="pl-4">
                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className="w-4 h-4" 
                            fill={i < testimonial.rating ? '#fbbf24' : 'none'}
                            stroke={i < testimonial.rating ? '#fbbf24' : '#d1d5db'}
                          />
                        ))}
                      </div>
                      
                      {/* Text */}
                      <p className="text-gray-700 text-sm leading-relaxed mb-3 italic">
                        &quot;{testimonial.text.length > 200 ? testimonial.text.substring(0, 200) + '...' : testimonial.text}&quot;
                      </p>
                      
                      {/* Attribution */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{testimonial.reviewerName}</p>
                          <p className="text-xs text-gray-500">
                            {testimonial.propertyAddress && `${testimonial.propertyAddress} • `}
                            {testimonial.date}
                          </p>
                        </div>
                        {testimonial.source && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                            via {testimonial.source}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {testimonials.length > 3 && (
                <p className="text-center text-sm text-gray-400 mt-4">
                  + {testimonials.length - 3} more testimonials
                </p>
              )}
            </div>
          )}

          {/* Footer */}
          <div 
            className="px-8 py-4 text-center text-xs text-white/70"
            style={{ backgroundColor: primaryColor }}
          >
            This appraisal is an estimate only and should not be relied upon for financial decisions. 
            Please contact the agent for a comprehensive market analysis.
          </div>
        </div>
      </div>
    </>
  );
}
