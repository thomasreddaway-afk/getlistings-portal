'use client';

import { useState, useEffect, useRef } from 'react';
import { DemoLayout } from '@/components/layout/DemoLayout';
import { 
  Sparkles, Download, Lock, Crown, Check, ChevronRight, 
  Image as ImageIcon, Wand2, Palette, Share2, 
  X, Home, DollarSign, Key, Calendar, MessageSquareQuote, Star, Quote
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

// Testimonial interface - matches Settings page storage format
interface Testimonial {
  id: string;
  reviewerName: string;  // "Seller in Sanctuary Cove, QLD" or actual name
  date: string;
  rating: number;
  text: string;
  propertyAddress?: string;
  source?: string;
  isTopFive?: boolean;
  order?: number;
}

// Testimonial template styles
interface TestimonialTemplateStyle {
  id: string;
  name: string;
  isPremium: boolean;
  isNew?: boolean;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  accentColor: string;
  style: 'modern' | 'elegant' | 'bold' | 'minimal' | 'gradient' | 'photo';
}

// Pre-designed testimonial template styles
const testimonialTemplates: TestimonialTemplateStyle[] = [
  { id: 'test-modern', name: 'Modern Clean', isPremium: false, primaryColor: '#ffffff', secondaryColor: '#f8fafc', textColor: '#1e293b', accentColor: '#E53935', style: 'modern' },
  { id: 'test-minimal', name: 'Simple Minimal', isPremium: false, isNew: true, primaryColor: '#ffffff', secondaryColor: '#ffffff', textColor: '#374151', accentColor: '#6366f1', style: 'minimal' },
  { id: 'test-bold', name: 'Bold Statement', isPremium: false, primaryColor: '#1a1a1a', secondaryColor: '#262626', textColor: '#ffffff', accentColor: '#fbbf24', style: 'bold' },
  { id: 'test-elegant', name: 'Elegant Gold', isPremium: true, primaryColor: '#1c1917', secondaryColor: '#292524', textColor: '#fafaf9', accentColor: '#D4AF37', style: 'elegant' },
  { id: 'test-gradient', name: 'Gradient Glow', isPremium: true, primaryColor: '#6366f1', secondaryColor: '#8b5cf6', textColor: '#ffffff', accentColor: '#fbbf24', style: 'gradient' },
  { id: 'test-photo', name: 'Photo Background', isPremium: true, isNew: true, primaryColor: 'rgba(0,0,0,0.7)', secondaryColor: 'rgba(0,0,0,0.5)', textColor: '#ffffff', accentColor: '#E53935', style: 'photo' },
];

// Template categories with icons
type TemplateCategory = 'just-listed' | 'sold' | 'for-lease' | 'leased' | 'open-home' | 'price-reduced';

interface TemplateStyle {
  id: string;
  name: string;
  category: TemplateCategory;
  isPremium: boolean;
  isNew?: boolean;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  badgeStyle: 'banner' | 'corner' | 'overlay' | 'minimal' | 'bold' | 'elegant';
  layout: 'full' | 'split' | 'framed' | 'polaroid' | 'magazine';
}

interface PropertyData {
  _id: string;
  streetAddress: string;
  suburb: string;
  state?: string;
  postCode?: string;
  salePrice?: string;
  bed?: number;
  bath?: number;
  car?: number;
  propertyType?: string;
  imageUrl?: string;
}

// Pre-designed template styles
const templateStyles: TemplateStyle[] = [
  // Just Listed - 2 free, 4 premium
  { id: 'jl-modern', name: 'Modern Bold', category: 'just-listed', isPremium: false, primaryColor: '#E53935', secondaryColor: '#1a1a1a', textColor: '#ffffff', badgeStyle: 'banner', layout: 'full' },
  { id: 'jl-minimal', name: 'Clean Minimal', category: 'just-listed', isPremium: false, isNew: true, primaryColor: '#ffffff', secondaryColor: '#000000', textColor: '#000000', badgeStyle: 'minimal', layout: 'framed' },
  { id: 'jl-luxury', name: 'Luxury Gold', category: 'just-listed', isPremium: true, primaryColor: '#D4AF37', secondaryColor: '#1a1a1a', textColor: '#ffffff', badgeStyle: 'elegant', layout: 'magazine' },
  { id: 'jl-coastal', name: 'Coastal Blue', category: 'just-listed', isPremium: true, primaryColor: '#0077B6', secondaryColor: '#CAF0F8', textColor: '#ffffff', badgeStyle: 'corner', layout: 'split' },
  { id: 'jl-urban', name: 'Urban Edge', category: 'just-listed', isPremium: true, primaryColor: '#6C63FF', secondaryColor: '#2D2D2D', textColor: '#ffffff', badgeStyle: 'bold', layout: 'full' },
  { id: 'jl-nature', name: 'Natural Living', category: 'just-listed', isPremium: true, primaryColor: '#2D6A4F', secondaryColor: '#D8F3DC', textColor: '#ffffff', badgeStyle: 'overlay', layout: 'polaroid' },
  
  // Sold - 2 free, 4 premium  
  { id: 'sold-celebrate', name: 'Celebration', category: 'sold', isPremium: false, primaryColor: '#4CAF50', secondaryColor: '#1a1a1a', textColor: '#ffffff', badgeStyle: 'banner', layout: 'full' },
  { id: 'sold-success', name: 'Success Story', category: 'sold', isPremium: false, primaryColor: '#E53935', secondaryColor: '#ffffff', textColor: '#E53935', badgeStyle: 'bold', layout: 'framed' },
  { id: 'sold-record', name: 'Record Breaker', category: 'sold', isPremium: true, isNew: true, primaryColor: '#FFD700', secondaryColor: '#1a1a1a', textColor: '#FFD700', badgeStyle: 'elegant', layout: 'magazine' },
  { id: 'sold-premium', name: 'Premium Result', category: 'sold', isPremium: true, primaryColor: '#9C27B0', secondaryColor: '#F3E5F5', textColor: '#ffffff', badgeStyle: 'corner', layout: 'split' },
  { id: 'sold-modern', name: 'Modern Sold', category: 'sold', isPremium: true, primaryColor: '#00BCD4', secondaryColor: '#1a1a1a', textColor: '#ffffff', badgeStyle: 'overlay', layout: 'full' },
  { id: 'sold-classic', name: 'Classic Elegance', category: 'sold', isPremium: true, primaryColor: '#795548', secondaryColor: '#EFEBE9', textColor: '#ffffff', badgeStyle: 'minimal', layout: 'polaroid' },
  
  // For Lease - 2 free, 2 premium
  { id: 'lease-available', name: 'Available Now', category: 'for-lease', isPremium: false, primaryColor: '#2196F3', secondaryColor: '#E3F2FD', textColor: '#ffffff', badgeStyle: 'banner', layout: 'full' },
  { id: 'lease-modern', name: 'Modern Rental', category: 'for-lease', isPremium: false, primaryColor: '#607D8B', secondaryColor: '#ffffff', textColor: '#ffffff', badgeStyle: 'minimal', layout: 'framed' },
  { id: 'lease-premium', name: 'Executive Living', category: 'for-lease', isPremium: true, primaryColor: '#1a1a1a', secondaryColor: '#D4AF37', textColor: '#D4AF37', badgeStyle: 'elegant', layout: 'magazine' },
  { id: 'lease-invest', name: 'Investment Ready', category: 'for-lease', isPremium: true, primaryColor: '#388E3C', secondaryColor: '#C8E6C9', textColor: '#ffffff', badgeStyle: 'bold', layout: 'split' },
  
  // Leased - 2 free, 2 premium
  { id: 'leased-fast', name: 'Leased Fast', category: 'leased', isPremium: false, primaryColor: '#8BC34A', secondaryColor: '#1a1a1a', textColor: '#ffffff', badgeStyle: 'banner', layout: 'full' },
  { id: 'leased-done', name: 'Successfully Leased', category: 'leased', isPremium: false, primaryColor: '#009688', secondaryColor: '#E0F2F1', textColor: '#ffffff', badgeStyle: 'corner', layout: 'framed' },
  { id: 'leased-premium', name: 'Premium Tenant', category: 'leased', isPremium: true, primaryColor: '#3F51B5', secondaryColor: '#C5CAE9', textColor: '#ffffff', badgeStyle: 'elegant', layout: 'magazine' },
  { id: 'leased-quick', name: 'Quick Result', category: 'leased', isPremium: true, primaryColor: '#FF5722', secondaryColor: '#FBE9E7', textColor: '#ffffff', badgeStyle: 'bold', layout: 'split' },
  
  // Open Home - 2 free, 2 premium
  { id: 'open-weekend', name: 'Open This Weekend', category: 'open-home', isPremium: false, primaryColor: '#FF9800', secondaryColor: '#1a1a1a', textColor: '#ffffff', badgeStyle: 'banner', layout: 'full' },
  { id: 'open-inspect', name: 'Inspection Invite', category: 'open-home', isPremium: false, isNew: true, primaryColor: '#E91E63', secondaryColor: '#FCE4EC', textColor: '#ffffff', badgeStyle: 'overlay', layout: 'framed' },
  { id: 'open-exclusive', name: 'Exclusive Viewing', category: 'open-home', isPremium: true, primaryColor: '#1a1a1a', secondaryColor: '#D4AF37', textColor: '#D4AF37', badgeStyle: 'elegant', layout: 'magazine' },
  { id: 'open-urgent', name: 'Don\'t Miss Out', category: 'open-home', isPremium: true, primaryColor: '#F44336', secondaryColor: '#FFEBEE', textColor: '#ffffff', badgeStyle: 'bold', layout: 'split' },
  
  // Price Reduced - 2 free, 2 premium
  { id: 'reduced-alert', name: 'Price Drop Alert', category: 'price-reduced', isPremium: false, primaryColor: '#F44336', secondaryColor: '#FFEB3B', textColor: '#ffffff', badgeStyle: 'banner', layout: 'full' },
  { id: 'reduced-value', name: 'New Value', category: 'price-reduced', isPremium: false, primaryColor: '#4CAF50', secondaryColor: '#ffffff', textColor: '#4CAF50', badgeStyle: 'corner', layout: 'framed' },
  { id: 'reduced-urgent', name: 'Must Sell', category: 'price-reduced', isPremium: true, primaryColor: '#FF5722', secondaryColor: '#1a1a1a', textColor: '#ffffff', badgeStyle: 'bold', layout: 'magazine' },
  { id: 'reduced-deal', name: 'Great Deal', category: 'price-reduced', isPremium: true, primaryColor: '#9C27B0', secondaryColor: '#F3E5F5', textColor: '#ffffff', badgeStyle: 'elegant', layout: 'split' },
];

const categoryInfo: Record<TemplateCategory, { label: string; icon: typeof Home; color: string; gradient: string }> = {
  'just-listed': { label: 'Just Listed', icon: Home, color: '#E53935', gradient: 'from-red-500 to-red-600' },
  'sold': { label: 'Sold', icon: DollarSign, color: '#4CAF50', gradient: 'from-green-500 to-green-600' },
  'for-lease': { label: 'For Lease', icon: Key, color: '#2196F3', gradient: 'from-blue-500 to-blue-600' },
  'leased': { label: 'Leased', icon: Check, color: '#8BC34A', gradient: 'from-lime-500 to-lime-600' },
  'open-home': { label: 'Open Home', icon: Calendar, color: '#FF9800', gradient: 'from-orange-500 to-orange-600' },
  'price-reduced': { label: 'Price Reduced', icon: DollarSign, color: '#F44336', gradient: 'from-red-500 to-pink-500' },
};

// Format price
const formatPrice = (price?: string): string => {
  if (!price) return '';
  const num = parseFloat(price.replace(/[$,]/g, ''));
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

export default function MarketingPage() {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle | null>(null);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Testimonial Graphics state
  const [activeSection, setActiveSection] = useState<'property' | 'testimonial'>('property');
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [selectedTestimonialTemplate, setSelectedTestimonialTemplate] = useState<TestimonialTemplateStyle | null>(null);
  const [showTestimonialEditor, setShowTestimonialEditor] = useState(false);
  const [agentBranding, setAgentBranding] = useState<{name?: string; agency?: string; phone?: string; headshot?: string; agencyLogo?: string; primaryColor?: string} | null>(null);
  const testimonialCanvasRef = useRef<HTMLCanvasElement>(null);

  // Load user's properties from pipeline and testimonials
  useEffect(() => {
    loadProperties();
    loadTestimonials();
  }, []);

  const loadTestimonials = () => {
    try {
      const stored = localStorage.getItem('agentTestimonials');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Load ALL testimonials for the graphics creator
        setTestimonials(parsed);
      }
      
      const branding = localStorage.getItem('agentBranding');
      if (branding) {
        setAgentBranding(JSON.parse(branding));
      }
    } catch (err) {
      console.log('Could not load testimonials');
    }
  };

  const loadProperties = async () => {
    setLoadingProperties(true);
    try {
      const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
      if (!token) return;

      const response = await fetch(`${API_URL}/lead/pipeline/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.summary && Array.isArray(data.summary)) {
          const allLeads: PropertyData[] = [];
          data.summary.forEach((stage: { leads: Array<{ lead: PropertyData }> }) => {
            stage.leads?.forEach(l => {
              if (l.lead) {
                allLeads.push(l.lead);
              }
            });
          });
          setProperties(allLeads);
          if (allLeads.length > 0) {
            setSelectedProperty(allLeads[0]);
          }
        }
      }
    } catch (err) {
      console.log('Could not load properties');
    } finally {
      setLoadingProperties(false);
    }
  };

  const handleTemplateClick = (template: TemplateStyle) => {
    if (template.isPremium) {
      setShowUpgradeModal(true);
    } else {
      setSelectedTemplate(template);
      setShowEditor(true);
    }
  };

  const generateImage = async () => {
    if (!selectedTemplate || !selectedProperty || !canvasRef.current) return;
    
    setGenerating(true);
    
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size (Instagram square)
    canvas.width = 1080;
    canvas.height = 1080;

    const template = selectedTemplate;
    const property = selectedProperty;
    const catInfo = categoryInfo[template.category];

    // Draw background
    ctx.fillStyle = template.secondaryColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw property image placeholder (gradient background for now)
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    
    if (template.layout === 'full') {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Overlay
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (template.layout === 'framed') {
      ctx.fillStyle = template.primaryColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient;
      ctx.fillRect(60, 60, canvas.width - 120, canvas.height - 200);
    } else if (template.layout === 'split') {
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);
      ctx.fillStyle = template.primaryColor;
      ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);
    } else if (template.layout === 'polaroid') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(80, 80, canvas.width - 160, canvas.height - 250);
      ctx.shadowBlur = 0;
      ctx.fillStyle = gradient;
      ctx.fillRect(100, 100, canvas.width - 200, canvas.height - 350);
    } else if (template.layout === 'magazine') {
      ctx.fillStyle = template.secondaryColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width * 0.6, canvas.height);
    }

    // Draw banner/badge based on style
    ctx.fillStyle = template.primaryColor;
    if (template.badgeStyle === 'banner') {
      ctx.fillRect(0, canvas.height - 280, canvas.width, 200);
    } else if (template.badgeStyle === 'corner') {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(350, 0);
      ctx.lineTo(0, 350);
      ctx.closePath();
      ctx.fill();
    } else if (template.badgeStyle === 'bold') {
      ctx.fillRect(60, canvas.height / 2 - 100, canvas.width - 120, 200);
    } else if (template.badgeStyle === 'elegant') {
      ctx.fillRect(canvas.width - 400, 80, 320, 60);
    }

    // Draw category label
    ctx.fillStyle = template.textColor;
    ctx.font = 'bold 72px Arial';
    ctx.textAlign = 'center';
    
    if (template.badgeStyle === 'banner') {
      ctx.fillText(catInfo.label.toUpperCase(), canvas.width / 2, canvas.height - 180);
    } else if (template.badgeStyle === 'corner') {
      ctx.save();
      ctx.translate(100, 180);
      ctx.rotate(-Math.PI / 4);
      ctx.font = 'bold 48px Arial';
      ctx.fillText(catInfo.label.toUpperCase(), 0, 0);
      ctx.restore();
    } else if (template.badgeStyle === 'bold') {
      ctx.fillText(catInfo.label.toUpperCase(), canvas.width / 2, canvas.height / 2 + 25);
    } else if (template.badgeStyle === 'elegant') {
      ctx.font = 'bold 36px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(catInfo.label.toUpperCase(), canvas.width - 100, 120);
    } else if (template.badgeStyle === 'overlay') {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, canvas.height / 2 - 60, canvas.width, 120);
      ctx.fillStyle = template.primaryColor;
      ctx.fillText(catInfo.label.toUpperCase(), canvas.width / 2, canvas.height / 2 + 25);
    } else if (template.badgeStyle === 'minimal') {
      ctx.fillStyle = template.primaryColor;
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(catInfo.label.toUpperCase(), 100, canvas.height - 180);
    }

    // Draw address
    ctx.fillStyle = template.textColor;
    ctx.font = 'bold 42px Arial';
    ctx.textAlign = 'center';
    
    if (template.badgeStyle === 'banner') {
      ctx.fillText(property.streetAddress, canvas.width / 2, canvas.height - 110);
      ctx.font = '32px Arial';
      ctx.fillText(`${property.suburb}${property.state ? ', ' + property.state : ''}`, canvas.width / 2, canvas.height - 60);
    } else if (template.layout === 'framed') {
      ctx.fillStyle = template.secondaryColor === '#ffffff' ? '#000000' : '#ffffff';
      ctx.fillText(property.streetAddress, canvas.width / 2, canvas.height - 100);
      ctx.font = '28px Arial';
      ctx.fillText(`${property.suburb}${property.state ? ', ' + property.state : ''}`, canvas.width / 2, canvas.height - 55);
    } else if (template.layout === 'split') {
      ctx.fillStyle = '#ffffff';
      ctx.fillText(property.streetAddress, canvas.width / 2, canvas.height * 0.75);
      ctx.font = '28px Arial';
      ctx.fillText(`${property.suburb}${property.state ? ', ' + property.state : ''}`, canvas.width / 2, canvas.height * 0.82);
    } else if (template.layout === 'polaroid') {
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 36px Arial';
      ctx.fillText(property.streetAddress, canvas.width / 2, canvas.height - 130);
      ctx.font = '24px Arial';
      ctx.fillText(`${property.suburb}${property.state ? ', ' + property.state : ''}`, canvas.width / 2, canvas.height - 85);
    } else if (template.layout === 'magazine') {
      ctx.textAlign = 'left';
      ctx.fillStyle = template.textColor;
      ctx.font = 'bold 48px Arial';
      ctx.fillText(property.streetAddress, canvas.width * 0.65, canvas.height / 2);
      ctx.font = '32px Arial';
      ctx.fillText(`${property.suburb}${property.state ? ', ' + property.state : ''}`, canvas.width * 0.65, canvas.height / 2 + 50);
    }

    // Draw property details if available
    if (property.bed || property.bath || property.car) {
      const details = [];
      if (property.bed) details.push(`${property.bed} Bed`);
      if (property.bath) details.push(`${property.bath} Bath`);
      if (property.car) details.push(`${property.car} Car`);
      
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      if (template.layout === 'magazine') {
        ctx.textAlign = 'left';
        ctx.fillText(details.join('  •  '), canvas.width * 0.65, canvas.height / 2 + 100);
      } else if (template.layout === 'split') {
        ctx.fillText(details.join('  •  '), canvas.width / 2, canvas.height * 0.88);
      }
    }

    // Draw price if available
    if (property.salePrice) {
      ctx.font = 'bold 56px Arial';
      ctx.textAlign = 'center';
      if (template.layout === 'magazine') {
        ctx.textAlign = 'left';
        ctx.fillStyle = template.primaryColor;
        ctx.fillText(formatPrice(property.salePrice), canvas.width * 0.65, canvas.height / 2 + 170);
      } else if (template.layout === 'split') {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(formatPrice(property.salePrice), canvas.width / 2, canvas.height * 0.95);
      }
    }

    // Convert to image
    const imageUrl = canvas.toDataURL('image/png');
    setGeneratedImage(imageUrl);
    setGenerating(false);
  };

  const downloadImage = (format: 'instagram' | 'facebook' | 'linkedin') => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `${selectedTemplate?.category}-${selectedProperty?.streetAddress?.replace(/\s+/g, '-') || 'property'}-${format}.png`;
    link.href = generatedImage;
    link.click();
  };

  // Testimonial template handlers
  const handleTestimonialTemplateClick = (template: TestimonialTemplateStyle) => {
    if (template.isPremium) {
      setShowUpgradeModal(true);
    } else {
      setSelectedTestimonialTemplate(template);
      if (testimonials.length > 0 && !selectedTestimonial) {
        setSelectedTestimonial(testimonials[0]);
      }
      setShowTestimonialEditor(true);
    }
  };

  const generateTestimonialImage = async () => {
    if (!selectedTestimonialTemplate || !selectedTestimonial || !testimonialCanvasRef.current) return;
    
    setGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const canvas = testimonialCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Instagram square size
    canvas.width = 1080;
    canvas.height = 1080;

    const template = selectedTestimonialTemplate;
    const testimonial = selectedTestimonial;

    // Draw background based on style
    if (template.style === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, template.primaryColor);
      gradient.addColorStop(1, template.secondaryColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (template.style === 'photo') {
      // Draw a placeholder gradient for photo style
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Dark overlay
      ctx.fillStyle = template.primaryColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = template.primaryColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Add decorative elements based on style
    if (template.style === 'modern' || template.style === 'minimal') {
      // Subtle accent bar at top
      ctx.fillStyle = template.accentColor;
      ctx.fillRect(0, 0, canvas.width, 8);
    }

    if (template.style === 'bold') {
      // Bold accent shape
      ctx.fillStyle = template.accentColor;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(200, 0);
      ctx.lineTo(0, 200);
      ctx.closePath();
      ctx.fill();
    }

    if (template.style === 'elegant') {
      // Elegant gold border
      ctx.strokeStyle = template.accentColor;
      ctx.lineWidth = 4;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    }

    // Draw quote icon
    ctx.fillStyle = template.accentColor;
    ctx.font = 'bold 120px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.globalAlpha = template.style === 'minimal' ? 0.2 : 0.3;
    ctx.fillText('"', canvas.width / 2, 200);
    ctx.globalAlpha = 1;

    // Draw stars
    const starY = 280;
    const starSize = 36;
    const starSpacing = 50;
    const starsStartX = canvas.width / 2 - ((testimonial.rating - 1) * starSpacing) / 2;
    
    ctx.fillStyle = template.accentColor;
    ctx.font = `${starSize}px Arial`;
    ctx.textAlign = 'center';
    for (let i = 0; i < testimonial.rating; i++) {
      ctx.fillText('★', starsStartX + (i * starSpacing), starY);
    }

    // Draw testimonial text with word wrapping
    ctx.fillStyle = template.textColor;
    ctx.font = '36px Georgia, serif';
    ctx.textAlign = 'center';
    
    const maxWidth = canvas.width - 160;
    const lineHeight = 52;
    let text = testimonial.text;
    if (text.length > 300) {
      text = text.substring(0, 297) + '...';
    }
    
    const words = text.split(' ');
    let lines: string[] = [];
    let currentLine = '';
    
    words.forEach(word => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine) lines.push(currentLine);

    // Limit to 6 lines
    if (lines.length > 6) {
      lines = lines.slice(0, 6);
      lines[5] = lines[5].substring(0, lines[5].length - 3) + '...';
    }

    const textStartY = 380;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, textStartY + (index * lineHeight));
    });

    // Check if reviewer name is a real name or just a descriptor like "Seller in/of..."
    const displayName = testimonial.reviewerName?.trim() || '';
    const isDescriptor = displayName.toLowerCase().startsWith('seller') || 
      displayName.toLowerCase().startsWith('buyer') ||
      displayName.toLowerCase().startsWith('vendor') ||
      displayName.toLowerCase().startsWith('landlord') ||
      displayName.toLowerCase().startsWith('tenant') ||
      displayName.toLowerCase().includes(' of ') ||
      displayName.toLowerCase().includes(' in ') ||
      displayName === 'Anonymous' ||
      displayName === '' ||
      displayName === 'Verified review' ||
      displayName === 'Client Review';
    
    const isRealName = displayName.length > 0 && !isDescriptor;

    let nextY = textStartY + (lines.length * lineHeight) + 60;

    // Draw reviewer name only if it's a real name
    if (isRealName) {
      ctx.fillStyle = template.textColor;
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`— ${displayName}`, canvas.width / 2, nextY);
      nextY += 40;
      
      // Draw property location below real name if available
      if (testimonial.propertyAddress) {
        ctx.font = '24px Arial';
        ctx.globalAlpha = 0.7;
        ctx.fillText(testimonial.propertyAddress, canvas.width / 2, nextY);
        ctx.globalAlpha = 1;
      }
    } else {
      // For descriptors like "Seller in Sanctuary Cove, QLD", show it as the attribution
      const attribution = displayName || testimonial.propertyAddress || '';
      if (attribution) {
        ctx.fillStyle = template.textColor;
        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`— ${attribution}`, canvas.width / 2, nextY);
        
        // Optionally show date if available
        if (testimonial.date && testimonial.date !== attribution) {
          ctx.font = '20px Arial';
          ctx.globalAlpha = 0.6;
          ctx.fillText(testimonial.date, canvas.width / 2, nextY + 35);
          ctx.globalAlpha = 1;
        }
      }
    }

    // Draw agent info at bottom
    if (agentBranding?.name) {
      const agentY = canvas.height - 100;
      
      // Agent name
      ctx.fillStyle = template.textColor;
      ctx.font = 'bold 28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(agentBranding.name, canvas.width / 2, agentY);
      
      // Agency
      if (agentBranding.agency) {
        ctx.font = '22px Arial';
        ctx.globalAlpha = 0.8;
        ctx.fillText(agentBranding.agency, canvas.width / 2, agentY + 35);
        ctx.globalAlpha = 1;
      }
    }

    // Convert to image
    const imageUrl = canvas.toDataURL('image/png');
    setGeneratedImage(imageUrl);
    setGenerating(false);
  };

  const downloadTestimonialImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `testimonial-${selectedTestimonial?.reviewerName?.replace(/\s+/g, '-') || 'review'}.png`;
    link.href = generatedImage;
    link.click();
  };

  const filteredTemplates = selectedCategory === 'all' 
    ? templateStyles 
    : templateStyles.filter(t => t.category === selectedCategory);

  const freeCount = filteredTemplates.filter(t => !t.isPremium).length;
  const premiumCount = filteredTemplates.filter(t => t.isPremium).length;

  return (
    <DemoLayout>
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-primary via-red-600 to-rose-700 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Wand2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">Marketing Studio</h1>
                    <p className="text-white/80">Create stunning social media content in seconds</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 mt-6">
                  <div className="flex items-center space-x-2 bg-white/10 backdrop-blur px-4 py-2 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">{freeCount} Free Templates</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-lg">
                    <Crown className="w-4 h-4" />
                    <span className="text-sm font-medium">{premiumCount} Premium Templates</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-white/10 rounded-2xl blur-xl"></div>
                  <div className="relative grid grid-cols-3 gap-2">
                    {['#E53935', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#00BCD4'].map((color, i) => (
                      <div 
                        key={i} 
                        className="w-16 h-16 rounded-lg shadow-lg transform hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6">
            {/* Section Tabs - Property vs Testimonial */}
            <div className="flex space-x-1 py-3 border-b border-gray-100">
              <button
                onClick={() => { setActiveSection('property'); setShowTestimonialEditor(false); setGeneratedImage(null); }}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                  activeSection === 'property'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Property Graphics</span>
              </button>
              <button
                onClick={() => { setActiveSection('testimonial'); setShowEditor(false); setGeneratedImage(null); }}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center space-x-2 ${
                  activeSection === 'testimonial'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Testimonial Graphics</span>
                {testimonials.length > 0 && (
                  <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">{testimonials.length}</span>
                )}
              </button>
            </div>

            {/* Property Category Tabs */}
            {activeSection === 'property' && (
            <div className="flex space-x-1 py-4 overflow-x-auto">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'bg-gray-900 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Templates
              </button>
              {Object.entries(categoryInfo).map(([key, info]) => {
                const Icon = info.icon;
                const count = templateStyles.filter(t => t.category === key).length;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key as TemplateCategory)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${
                      selectedCategory === key
                        ? `bg-gradient-to-r ${info.gradient} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{info.label}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      selectedCategory === key ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
            )}
          </div>
        </div>

        {/* Property Templates Grid */}
        {activeSection === 'property' && (
        <>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => {
              const catInfo = categoryInfo[template.category];
              return (
                <div
                  key={template.id}
                  onClick={() => handleTemplateClick(template)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* Template Preview */}
                    <div 
                      className="absolute inset-0"
                      style={{ 
                        background: template.layout === 'full' 
                          ? `linear-gradient(135deg, ${template.primaryColor}40, ${template.secondaryColor})`
                          : template.layout === 'split'
                          ? `linear-gradient(to bottom, #667eea 65%, ${template.primaryColor} 65%)`
                          : template.layout === 'framed'
                          ? template.primaryColor
                          : template.layout === 'polaroid'
                          ? '#ffffff'
                          : template.layout === 'magazine'
                          ? `linear-gradient(to right, #667eea 60%, ${template.secondaryColor} 60%)`
                          : template.secondaryColor
                      }}
                    >
                      {/* Mock property image area */}
                      {template.layout === 'framed' && (
                        <div 
                          className="absolute inset-4 bottom-16 rounded-lg"
                          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                        />
                      )}
                      {template.layout === 'polaroid' && (
                        <div 
                          className="absolute top-4 left-4 right-4 bottom-20 rounded-sm shadow-inner"
                          style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}
                        />
                      )}
                      
                      {/* Badge/Banner */}
                      <div 
                        className="absolute flex items-center justify-center"
                        style={{
                          ...(template.badgeStyle === 'banner' && { bottom: 0, left: 0, right: 0, height: '35%', backgroundColor: template.primaryColor }),
                          ...(template.badgeStyle === 'corner' && { top: 0, left: 0, width: '50%', height: '50%', clipPath: 'polygon(0 0, 100% 0, 0 100%)', backgroundColor: template.primaryColor }),
                          ...(template.badgeStyle === 'bold' && { top: '35%', left: '8%', right: '8%', height: '30%', backgroundColor: template.primaryColor, borderRadius: '8px' }),
                          ...(template.badgeStyle === 'elegant' && { top: '8%', right: '8%', padding: '8px 16px', backgroundColor: template.primaryColor, borderRadius: '4px' }),
                          ...(template.badgeStyle === 'overlay' && { top: '35%', left: 0, right: 0, height: '30%', backgroundColor: 'rgba(0,0,0,0.7)' }),
                          ...(template.badgeStyle === 'minimal' && { bottom: '15%', left: '8%', padding: '4px 0' }),
                        }}
                      >
                        <span 
                          className="font-bold text-xs uppercase tracking-wide"
                          style={{ 
                            color: template.badgeStyle === 'minimal' ? template.primaryColor : template.textColor,
                            transform: template.badgeStyle === 'corner' ? 'rotate(-45deg) translateY(-50%)' : 'none'
                          }}
                        >
                          {catInfo.label}
                        </span>
                      </div>
                    </div>

                    {/* Premium/New Badges */}
                    <div className="absolute top-3 left-3 flex space-x-2">
                      {template.isNew && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md shadow">
                          NEW
                        </span>
                      )}
                      {template.isPremium && (
                        <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-md shadow flex items-center space-x-1">
                          <Crown className="w-3 h-3" />
                          <span>PRO</span>
                        </span>
                      )}
                    </div>

                    {/* Lock Overlay for Premium */}
                    {template.isPremium && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white rounded-xl p-4 shadow-xl text-center transform scale-90 group-hover:scale-100 transition-transform">
                          <Lock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                          <p className="text-sm font-semibold text-gray-900">Upgrade to Unlock</p>
                        </div>
                      </div>
                    )}

                    {/* Use Button for Free */}
                    {!template.isPremium && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold shadow-xl transform scale-90 group-hover:scale-100 transition-transform flex items-center space-x-2">
                          <Sparkles className="w-4 h-4" />
                          <span>Use Template</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Template Name */}
                  <div className="mt-3">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{template.category.replace('-', ' ')}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hidden Canvas for Image Generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Editor Modal */}
        {showEditor && selectedTemplate && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex">
              {/* Left: Preview */}
              <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center">
                {generatedImage ? (
                  <img src={generatedImage} alt="Generated" className="max-w-full max-h-full rounded-xl shadow-2xl" />
                ) : (
                  <div className="w-full aspect-square max-w-md rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Click Generate to create your image</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Controls */}
              <div className="w-96 border-l border-gray-200 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{selectedTemplate.name}</h2>
                      <p className="text-sm text-gray-500 capitalize">{selectedTemplate.category.replace('-', ' ')}</p>
                    </div>
                    <button 
                      onClick={() => { setShowEditor(false); setGeneratedImage(null); }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Property Selection */}
                <div className="p-6 border-b border-gray-200 flex-1 overflow-auto">
                  <h3 className="font-semibold text-gray-900 mb-3">Select Property</h3>
                  {loadingProperties ? (
                    <div className="text-center py-4 text-gray-500">Loading properties...</div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500 text-sm">No properties in your pipeline</p>
                      <button className="mt-2 text-primary text-sm font-medium">Add properties →</button>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {properties.map((prop) => (
                        <button
                          key={prop._id}
                          onClick={() => setSelectedProperty(prop)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                            selectedProperty?._id === prop._id
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-medium text-gray-900 text-sm">{prop.streetAddress}</p>
                          <p className="text-xs text-gray-500">{prop.suburb}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <div className="p-6 border-b border-gray-200">
                  <button
                    onClick={generateImage}
                    disabled={!selectedProperty || generating}
                    className="w-full py-3 bg-gradient-to-r from-primary to-red-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:shadow-lg transition-shadow"
                  >
                    {generating ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5" />
                        <span>Generate Image</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Download Options */}
                {generatedImage && (
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Download</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => downloadImage('instagram')}
                        className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg flex items-center space-x-3 hover:shadow-lg transition-shadow"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        <span>Instagram (1080×1080)</span>
                      </button>
                      <button
                        onClick={() => downloadImage('facebook')}
                        className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-lg flex items-center space-x-3 hover:shadow-lg transition-shadow"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span>Facebook Post</span>
                      </button>
                      <button
                        onClick={() => downloadImage('linkedin')}
                        className="w-full py-2.5 px-4 bg-blue-700 text-white font-medium rounded-lg flex items-center space-x-3 hover:shadow-lg transition-shadow"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        <span>LinkedIn</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </>
        )}

        {/* Testimonial Graphics Section */}
        {activeSection === 'testimonial' && (
        <>
          <div className="max-w-7xl mx-auto px-6 py-8">
            {testimonials.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <MessageSquareQuote className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Testimonials Yet</h2>
                <p className="text-gray-500 mb-6">Add testimonials in Settings to create stunning social graphics</p>
                <a href="/settings" className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition">
                  <span>Go to Settings</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            ) : !showTestimonialEditor ? (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Template Style</h2>
                  <p className="text-gray-500">Select a template, then pick a testimonial to create your social graphic</p>
                </div>

                {/* Testimonial Template Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                  {testimonialTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => handleTestimonialTemplateClick(template)}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        {/* Template Preview */}
                        <div 
                          className="absolute inset-0 flex flex-col items-center justify-center p-6"
                          style={{ 
                            background: template.style === 'gradient' 
                              ? `linear-gradient(135deg, ${template.primaryColor}, ${template.secondaryColor})`
                              : template.style === 'photo'
                              ? `linear-gradient(135deg, #667eea, #764ba2)`
                              : template.primaryColor
                          }}
                        >
                          {/* Photo overlay */}
                          {template.style === 'photo' && (
                            <div className="absolute inset-0" style={{ backgroundColor: template.primaryColor }}></div>
                          )}

                          {/* Elegant border */}
                          {template.style === 'elegant' && (
                            <div className="absolute inset-3 border-2 rounded-lg" style={{ borderColor: template.accentColor }}></div>
                          )}

                          {/* Bold accent corner */}
                          {template.style === 'bold' && (
                            <div 
                              className="absolute top-0 left-0 w-12 h-12"
                              style={{ 
                                backgroundColor: template.accentColor,
                                clipPath: 'polygon(0 0, 100% 0, 0 100%)'
                              }}
                            ></div>
                          )}

                          {/* Modern/Minimal accent bar */}
                          {(template.style === 'modern' || template.style === 'minimal') && (
                            <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: template.accentColor }}></div>
                          )}

                          {/* Quote icon */}
                          <Quote className="w-8 h-8 mb-2" style={{ color: template.accentColor, opacity: 0.5 }} />

                          {/* Stars preview */}
                          <div className="flex space-x-0.5 mb-2">
                            {[1,2,3,4,5].map(i => (
                              <Star key={i} className="w-3 h-3" style={{ color: template.accentColor, fill: template.accentColor }} />
                            ))}
                          </div>

                          {/* Preview text */}
                          <div className="text-center">
                            <p className="text-xs leading-tight" style={{ color: template.textColor, opacity: 0.7 }}>
                              "Amazing experience..."
                            </p>
                            <p className="text-[10px] mt-2 font-medium" style={{ color: template.textColor }}>— John Smith</p>
                          </div>
                        </div>

                        {/* Premium/New Badges */}
                        <div className="absolute top-3 left-3 flex space-x-2 z-20">
                          {template.isNew && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-md shadow">NEW</span>
                          )}
                          {template.isPremium && (
                            <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-md shadow flex items-center space-x-1">
                              <Crown className="w-3 h-3" />
                              <span>PRO</span>
                            </span>
                          )}
                        </div>

                        {/* Lock/Use overlay */}
                        {template.isPremium ? (
                          <div className="absolute inset-0 z-30 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-white rounded-xl p-4 shadow-xl text-center transform scale-90 group-hover:scale-100 transition-transform">
                              <Lock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                              <p className="text-sm font-semibold text-gray-900">Upgrade to Unlock</p>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 z-30 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button className="bg-white text-gray-900 px-6 py-2.5 rounded-lg font-semibold shadow-xl transform scale-90 group-hover:scale-100 transition-transform flex items-center space-x-2">
                              <Sparkles className="w-4 h-4" />
                              <span>Use Template</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Template Name */}
                      <div className="mt-3">
                        <h3 className="font-semibold text-gray-900">{template.name}</h3>
                        <p className="text-sm text-gray-500">Testimonial Template</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Testimonial Editor */
              <div className="max-w-5xl mx-auto">
                <button
                  onClick={() => { setShowTestimonialEditor(false); setGeneratedImage(null); }}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  <span>Back to Templates</span>
                </button>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {/* Preview */}
                    <div className="flex-1 bg-gray-100 p-8 flex items-center justify-center min-h-[400px]">
                      {generatedImage ? (
                        <img src={generatedImage} alt="Generated" className="max-w-full max-h-[500px] rounded-xl shadow-2xl" />
                      ) : (
                        <div className="w-full max-w-md aspect-square rounded-xl flex items-center justify-center" style={{
                          background: selectedTestimonialTemplate?.style === 'gradient'
                            ? `linear-gradient(135deg, ${selectedTestimonialTemplate.primaryColor}, ${selectedTestimonialTemplate.secondaryColor})`
                            : selectedTestimonialTemplate?.primaryColor || '#f3f4f6'
                        }}>
                          <div className="text-center p-8">
                            <Quote className="w-12 h-12 mx-auto mb-4" style={{ color: selectedTestimonialTemplate?.accentColor, opacity: 0.5 }} />
                            <p className="text-sm mb-4" style={{ color: selectedTestimonialTemplate?.textColor }}>
                              {selectedTestimonial?.text?.slice(0, 150) || 'Select a testimonial...'}
                              {(selectedTestimonial?.text?.length || 0) > 150 && '...'}
                            </p>
                            {selectedTestimonial && (
                              <>
                                <div className="flex justify-center space-x-1 mb-2">
                                  {[1,2,3,4,5].map(i => (
                                    <Star key={i} className="w-4 h-4" style={{ 
                                      color: selectedTestimonialTemplate?.accentColor,
                                      fill: i <= (selectedTestimonial?.rating || 5) ? selectedTestimonialTemplate?.accentColor : 'transparent'
                                    }} />
                                  ))}
                                </div>
                                {(selectedTestimonial.reviewerName || selectedTestimonial.date) && (
                                  <p className="text-xs font-medium" style={{ color: selectedTestimonialTemplate?.textColor }}>
                                    — {selectedTestimonial.reviewerName || selectedTestimonial.date}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-gray-200 p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Select Testimonial</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto mb-6">
                        {testimonials.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => { setSelectedTestimonial(t); setGeneratedImage(null); }}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedTestimonial?.id === t.id
                                ? 'border-primary bg-primary/5'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="flex items-center space-x-1 mb-1">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className={`w-3 h-3 ${i <= t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                              ))}
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">{t.text}</p>
                            {(t.reviewerName || t.date) && (
                              <p className="text-xs text-gray-500 mt-1">— {t.reviewerName || t.date}</p>
                            )}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={generateTestimonialImage}
                        disabled={!selectedTestimonial || generating}
                        className="w-full py-3 bg-gradient-to-r from-primary to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                      >
                        {generating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Generating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Generate Image</span>
                          </>
                        )}
                      </button>

                      {generatedImage && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-gray-700">Download for:</p>
                          <button
                            onClick={downloadTestimonialImage}
                            className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg flex items-center space-x-3 hover:shadow-lg transition-shadow"
                          >
                            <Download className="w-5 h-5" />
                            <span>Download Image</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Hidden Canvas for Testimonial Image Generation */}
          <canvas ref={testimonialCanvasRef} style={{ display: 'none' }} />
        </>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Unlock Premium Templates</h2>
              <p className="text-gray-500 mb-6">
                Get access to all {templateStyles.filter(t => t.isPremium).length}+ premium templates, priority support, and unlimited downloads.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                <div className="space-y-3">
                  {[
                    'All premium template designs',
                    'Unlimited image generation',
                    'Custom branding & colors',
                    'Priority support',
                    'New templates monthly',
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-shadow mb-3">
                Upgrade to Pro — $29/month
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-500 text-sm hover:text-gray-700"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
}
