'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, Share2, Phone, Mail, MapPin, Bed, Bath, Car, TrendingUp, ArrowLeft, Edit3, Check, X, Ruler } from 'lucide-react';

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
}

interface PropertyData {
  id: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  landSize: number;
  description: string;
  features: string[];
  images: string[];
  createdAt: string;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const formatNumberWithCommas = (value: number) => {
  return new Intl.NumberFormat('en-AU').format(value);
};

const parseFormattedNumber = (value: string) => {
  return parseInt(value.replace(/,/g, ''), 10) || 0;
};

const toTitleCase = (str: string) => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export default function AppraisalCardPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<PropertyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentBranding, setAgentBranding] = useState<AgentBranding | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Editable fields
  const [editableDescription, setEditableDescription] = useState('');
  const [editableMinPrice, setEditableMinPrice] = useState(0);
  const [editableMaxPrice, setEditableMaxPrice] = useState(0);
  const [editableBeds, setEditableBeds] = useState(0);
  const [editableBaths, setEditableBaths] = useState(0);
  const [editableCars, setEditableCars] = useState(0);
  const [editableLandSize, setEditableLandSize] = useState(0);

  useEffect(() => {
    // Load agent data from localStorage
    // propdeals_user has: firstName, lastName, name, agencyName, avatar
    // agentBranding has: agentPhoto, agencyLogo, primaryColor, secondaryColor, agentTagline, licenseNumber
    const savedUser = localStorage.getItem('propdeals_user');
    const savedBranding = localStorage.getItem('agentBranding');
    
    const user = savedUser ? JSON.parse(savedUser) : {};
    const branding = savedBranding ? JSON.parse(savedBranding) : {};
    
    console.log('Loaded user:', user);
    console.log('Loaded branding:', branding);
    
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
            console.log('Loaded profile from API:', profile);
            setAgentBranding({
              name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || profile.name || profile.firstName || 'Your Agent',
              email: profile.email || user.email || '',
              phone: profile.phone || profile.mobile || profile.phoneNumber || profile.contactNumber || user.phone || '',
              photo: branding.agentPhoto || user.avatar || profile.profilePicture || profile.avatar || '',
              logo: branding.agencyLogo || '',
              agency: user.agency || profile.agency || profile.agencyName || '',
              tagline: branding.agentTagline || "Let's Sell!",
              license: branding.licenseNumber || '',
              primaryColor: branding.primaryColor || '#1e3a5f',
              secondaryColor: branding.secondaryColor || '#c9a962',
            });
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch agent profile:', err);
      }
      
      // Fallback if API call fails - use localStorage values
      setAgentBranding({
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Your Name',
        email: user.email || '',
        phone: user.phone || '',
        photo: branding.agentPhoto || user.avatar || '',
        logo: branding.agencyLogo || '',
        agency: user.agency || '',
        tagline: branding.agentTagline || "Let's Sell!",
        license: branding.licenseNumber || '',
        primaryColor: branding.primaryColor || '#1e3a5f',
        secondaryColor: branding.secondaryColor || '#c9a962',
      });
    };
    
    fetchAgentDetails();
  }, []);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertySlug = params.propertySlug as string;
        const address = propertySlug.replace(/-/g, ' ');
        
        const response = await fetch(`https://prop.deals/v1/properties/search?address=${encodeURIComponent(address)}`);
        
        if (!response.ok) {
          throw new Error('Property not found');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const prop = data[0];
          const propertyData: PropertyData = {
            id: prop.id,
            address: prop.address || address,
            suburb: prop.suburb || '',
            state: prop.state || 'VIC',
            postcode: prop.postcode || '',
            price: prop.price || prop.estimatedValue || 850000,
            propertyType: prop.propertyType || 'House',
            bedrooms: prop.bedrooms || 3,
            bathrooms: prop.bathrooms || 2,
            carSpaces: prop.carSpaces || 2,
            landSize: prop.landSize || 450,
            description: prop.description || `This exceptional ${prop.propertyType || 'property'} presents a fantastic opportunity in a highly sought-after location. The property features generous living spaces with abundant natural light and modern updates throughout. Set on a quality allotment, this home offers comfortable living with excellent potential for future growth. Conveniently located close to local amenities, schools, transport links, and recreational facilities, this property is perfect for families or astute investors looking for strong returns.`,
            features: prop.features || [],
            images: prop.images || [],
            createdAt: prop.createdAt || new Date().toISOString(),
          };
          setProperty(propertyData);
          setEditableDescription(propertyData.description);
          setEditableMinPrice(Math.round(propertyData.price * 0.9));
          setEditableMaxPrice(Math.round(propertyData.price * 1.1));
          setEditableBeds(propertyData.bedrooms);
          setEditableBaths(propertyData.bathrooms);
          setEditableCars(propertyData.carSpaces);
          setEditableLandSize(propertyData.landSize);
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Property not found');
        
        // Use sample data for demo
        const propertySlug = params.propertySlug as string;
        const address = propertySlug.replace(/-/g, ' ');
        const sampleData: PropertyData = {
          id: '1',
          address: address,
          suburb: 'St Albans',
          state: 'VIC',
          postcode: '3021',
          price: 650000,
          propertyType: 'House',
          bedrooms: 3,
          bathrooms: 1,
          carSpaces: 2,
          landSize: 520,
          description: 'This charming family home presents an exceptional opportunity in a highly sought-after location. The property features generous living spaces with abundant natural light, a modern updated kitchen with quality appliances, and seamless indoor-outdoor flow to the private backyard perfect for entertaining. Set on a generous allotment with established gardens, this home offers comfortable family living with scope to add further value. Close proximity to local schools, shopping centres, public transport, and parklands makes this an ideal choice for families or investors seeking strong capital growth potential.',
          features: ['Updated Kitchen', 'Air Conditioning', 'Private Backyard'],
          images: [],
          createdAt: new Date().toISOString(),
        };
        setProperty(sampleData);
        setEditableDescription(sampleData.description);
        setEditableMinPrice(Math.round(sampleData.price * 0.9));
        setEditableMaxPrice(Math.round(sampleData.price * 1.1));
        setEditableBeds(sampleData.bedrooms);
        setEditableBaths(sampleData.bathrooms);
        setEditableCars(sampleData.carSpaces);
        setEditableLandSize(sampleData.landSize);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [params]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    const shareTitle = property ? `Property Appraisal - ${property.address}` : 'Property Appraisal';
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const handleSaveEdits = () => {
    if (property) {
      setProperty({
        ...property,
        description: editableDescription,
        price: editableMinPrice,
        bedrooms: editableBeds,
        bathrooms: editableBaths,
        carSpaces: editableCars,
        landSize: editableLandSize,
      });
    }
    setIsEditMode(false);
  };

  const handleCancelEdits = () => {
    if (property) {
      setEditableDescription(property.description);
      setEditableMinPrice(Math.round(property.price * 0.9));
      setEditableMaxPrice(Math.round(property.price * 1.1));
      setEditableBeds(property.bedrooms);
      setEditableBaths(property.bathrooms);
      setEditableCars(property.carSpaces);
      setEditableLandSize(property.landSize);
    }
    setIsEditMode(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: agentBranding?.primaryColor || '#1e3a5f' }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading appraisal...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600 text-lg">Property not found</p>
        </div>
      </div>
    );
  }

  const primaryColor = agentBranding?.primaryColor || '#1e3a5f';
  const secondaryColor = agentBranding?.secondaryColor || '#c9a962';
  const fullAddress = `${property.address}${property.suburb ? `, ${property.suburb}` : ''}${property.state ? ` ${property.state}` : ''}${property.postcode ? ` ${property.postcode}` : ''}`;

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
        {/* Action Bar */}
        <div className="no-print max-w-[210mm] mx-auto mb-4 flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <div className="flex gap-2">
            {isEditMode ? (
              <>
                <button 
                  onClick={handleSaveEdits}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={handleCancelEdits}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-white rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
                <button 
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Save PDF
                </button>
              </>
            )}
          </div>
        </div>

        {/* A4 Page */}
        <div 
          className="a4-page max-w-[210mm] mx-auto bg-white shadow-2xl overflow-hidden"
          style={{ minHeight: '297mm' }}
        >
          {/* Cover Section */}
          <div 
            className="flex flex-col text-white"
            style={{ 
              background: `radial-gradient(ellipse at top right, ${primaryColor}ee 0%, #1a1a2e 50%, #0d0d1a 100%)`,
              minHeight: '45%'
            }}
          >
            {/* Header - p-8 */}
            <div className="flex items-start justify-between p-8">
              {/* Logo */}
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                {agentBranding?.logo && agentBranding.logo.trim() !== '' ? (
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
                {toTitleCase(property.address)}
              </h1>
              
              <p className="text-lg text-white/70 mb-10">
                {property.suburb}{property.state ? `, ${property.state}` : ''} {property.postcode}
              </p>
              
              <div className="text-white/50 uppercase tracking-widest text-xs mb-4">
                Estimated Value Range
              </div>
              
              {isEditMode ? (
                <div className="bg-white/10 backdrop-blur rounded-lg px-6 py-3 mb-16 flex items-center gap-3">
                  <span className="text-white/70">$</span>
                  <input
                    type="text"
                    value={formatNumberWithCommas(editableMinPrice)}
                    onChange={(e) => setEditableMinPrice(parseFormattedNumber(e.target.value))}
                    className="text-xl font-bold w-36 text-center bg-transparent text-white border-b-2 border-white/30 focus:outline-none focus:border-white"
                    placeholder="Min"
                  />
                  <span className="text-white text-xl">-</span>
                  <span className="text-white/70">$</span>
                  <input
                    type="text"
                    value={formatNumberWithCommas(editableMaxPrice)}
                    onChange={(e) => setEditableMaxPrice(parseFormattedNumber(e.target.value))}
                    className="text-xl font-bold w-36 text-center bg-transparent text-white border-b-2 border-white/30 focus:outline-none focus:border-white"
                    placeholder="Max"
                  />
                </div>
              ) : (
                <div 
                  className="px-12 py-4 rounded-lg mb-16"
                  style={{ backgroundColor: '#ef4444' }}
                >
                  <span className="text-2xl font-bold text-white">
                    {formatPrice(editableMinPrice)} - {formatPrice(editableMaxPrice)}
                  </span>
                </div>
              )}
            </div>

            {/* Agent Footer in Cover - Same spacing as header */}
            <div className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30">
                    {agentBranding?.photo ? (
                      <Image 
                        src={agentBranding.photo} 
                        alt={agentBranding.name || 'Agent'} 
                        width={56} 
                        height={56} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-lg font-bold">
                        {agentBranding?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-white text-lg">{agentBranding?.name || 'Your Agent'}</div>
                    <div className="text-white/60 text-sm">{agentBranding?.agency || 'Your Agency'}</div>
                    {agentBranding?.tagline && (
                      <div className="text-white/50 text-sm italic">"{agentBranding.tagline}"</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {agentBranding?.phone && (
                    <a href={`tel:${agentBranding.phone}`} className="flex items-center justify-end gap-2 text-white/90 hover:text-white mb-1">
                      <Phone className="w-4 h-4" />
                      <span>{agentBranding.phone}</span>
                    </a>
                  )}
                  {agentBranding?.email && (
                    <a href={`mailto:${agentBranding.email}`} className="flex items-center justify-end gap-2 text-white/90 hover:text-white">
                      <Mail className="w-4 h-4" />
                      <span>{agentBranding.email}</span>
                    </a>
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
                {isEditMode ? (
                  <input
                    type="number"
                    value={editableBeds}
                    onChange={(e) => setEditableBeds(Number(e.target.value))}
                    className="w-16 mx-auto text-center text-2xl font-bold border rounded px-2 py-1"
                    style={{ color: primaryColor }}
                  />
                ) : (
                  <div className="text-2xl font-bold" style={{ color: primaryColor }}>{editableBeds}</div>
                )}
                <div className="text-sm text-gray-500">Bedrooms</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Bath className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                {isEditMode ? (
                  <input
                    type="number"
                    value={editableBaths}
                    onChange={(e) => setEditableBaths(Number(e.target.value))}
                    className="w-16 mx-auto text-center text-2xl font-bold border rounded px-2 py-1"
                    style={{ color: primaryColor }}
                  />
                ) : (
                  <div className="text-2xl font-bold" style={{ color: primaryColor }}>{editableBaths}</div>
                )}
                <div className="text-sm text-gray-500">Bathrooms</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Car className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                {isEditMode ? (
                  <input
                    type="number"
                    value={editableCars}
                    onChange={(e) => setEditableCars(Number(e.target.value))}
                    className="w-16 mx-auto text-center text-2xl font-bold border rounded px-2 py-1"
                    style={{ color: primaryColor }}
                  />
                ) : (
                  <div className="text-2xl font-bold" style={{ color: primaryColor }}>{editableCars}</div>
                )}
                <div className="text-sm text-gray-500">Car Spaces</div>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: `${primaryColor}15` }}>
                  <Ruler className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                {isEditMode ? (
                  <input
                    type="number"
                    value={editableLandSize}
                    onChange={(e) => setEditableLandSize(Number(e.target.value))}
                    className="w-16 mx-auto text-center text-2xl font-bold border rounded px-2 py-1"
                    style={{ color: primaryColor }}
                  />
                ) : (
                  <div className="text-2xl font-bold" style={{ color: primaryColor }}>{editableLandSize}</div>
                )}
                <div className="text-sm text-gray-500">m² Land</div>
              </div>
            </div>

            {/* Property Description */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Property Overview</h3>
              {isEditMode ? (
                <textarea
                  value={editableDescription}
                  onChange={(e) => setEditableDescription(e.target.value)}
                  rows={4}
                  className="w-full border rounded-lg px-4 py-3 text-gray-700 resize-none focus:outline-none focus:ring-2"
                  style={{ borderColor: `${primaryColor}40` }}
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  {editableDescription}
                </p>
              )}
            </div>

            {/* Map */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Location</h3>
              <div className="w-full h-48 rounded-lg overflow-hidden bg-gray-100 border">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=GOOGLE_MAPS_KEY_REMOVED&q=${encodeURIComponent(fullAddress)}`}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="px-8 py-4 text-center text-xs text-white/70 mt-auto"
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
