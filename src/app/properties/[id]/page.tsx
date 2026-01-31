'use client';

import { DemoLayout } from '@/components/layout';
import { AIToolModal } from '@/components/AIToolModal';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, Phone, MessageSquare, Mail, FileText, 
  User, Home, Clock, Zap, ChevronRight, Sparkles,
  Phone as PhoneIcon, MessageCircle, Notebook
} from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://prop.deals/v1';

interface LeadDetail {
  _id: string;
  streetAddress: string;
  fullAddress?: string;
  suburb: string;
  state?: string;
  postCode?: string;
  sellingScore: number;
  salePrice?: string;
  propertyType?: string;
  bed?: number;
  bath?: number;
  car?: number;
  landSize?: number;
  ownerType?: string;
  owner1Name?: string;
  updatedAt: string;
  garageSale?: boolean;
  listedForSale?: boolean;
  listedForRent?: boolean;
  requested?: boolean;
  neighbourSold?: boolean;
  recentlySold?: boolean;
  socialTag?: boolean;
  fsboListing?: boolean;
  pipelineStageId?: string;
}

const signalInfo: Record<string, { text: string; icon: string; color: string }> = {
  garageSale: { text: 'Garage sale detected', icon: '🏷️', color: 'from-amber-500 to-orange-500' },
  listedForSale: { text: 'Listed for sale', icon: '🏠', color: 'from-green-500 to-emerald-500' },
  listedForRent: { text: 'Listed for rent', icon: '📋', color: 'from-cyan-500 to-blue-500' },
  requested: { text: 'Requested valuation', icon: '📊', color: 'from-pink-500 to-rose-500' },
  neighbourSold: { text: 'Neighbour selling property', icon: '🏘️', color: 'from-purple-500 to-violet-500' },
  recentlySold: { text: 'Recently sold', icon: '✅', color: 'from-gray-500 to-slate-500' },
  socialTag: { text: 'Tagged on social media', icon: '📱', color: 'from-blue-500 to-indigo-500' },
  fsboListing: { text: 'For sale by owner', icon: '👤', color: 'from-red-500 to-pink-500' },
};

function getActiveSignals(lead: LeadDetail) {
  const signals: { key: string; text: string; icon: string; color: string }[] = [];
  if (lead.listedForSale) signals.push({ key: 'listedForSale', ...signalInfo.listedForSale });
  if (lead.garageSale) signals.push({ key: 'garageSale', ...signalInfo.garageSale });
  if (lead.requested) signals.push({ key: 'requested', ...signalInfo.requested });
  if (lead.neighbourSold) signals.push({ key: 'neighbourSold', ...signalInfo.neighbourSold });
  if (lead.recentlySold) signals.push({ key: 'recentlySold', ...signalInfo.recentlySold });
  if (lead.socialTag) signals.push({ key: 'socialTag', ...signalInfo.socialTag });
  if (lead.fsboListing) signals.push({ key: 'fsboListing', ...signalInfo.fsboListing });
  if (lead.listedForRent) signals.push({ key: 'listedForRent', ...signalInfo.listedForRent });
  return signals;
}

function getScoreColor(score: number) {
  if (score >= 85) return { stroke: '#22c55e', label: 'High Intent Seller', labelColor: 'text-green-400' };
  if (score >= 70) return { stroke: '#84cc16', label: 'Strong Interest', labelColor: 'text-lime-400' };
  if (score >= 55) return { stroke: '#eab308', label: 'Moderate Interest', labelColor: 'text-yellow-400' };
  return { stroke: '#f97316', label: 'Low Interest', labelColor: 'text-orange-400' };
}

function formatValue(salePrice?: string): string {
  if (!salePrice) return '—';
  const price = parseFloat(salePrice.replace(/[$,]/g, ''));
  if (price >= 1000000) return `$${(price / 1000000).toFixed(1)}M`;
  if (price >= 1000) return `$${Math.round(price / 1000)}K`;
  return salePrice;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

const defaultPipelineStages: PipelineStage[] = [
  { id: 'new', name: 'New Lead', color: '#3B82F6', order: 0 },
  { id: 'contacted', name: 'Contacted', color: '#8B5CF6', order: 1 },
  { id: 'meeting', name: 'Meeting Scheduled', color: '#F59E0B', order: 2 },
  { id: 'proposal', name: 'Proposal Sent', color: '#EC4899', order: 3 },
  { id: 'negotiation', name: 'Negotiation', color: '#10B981', order: 4 },
  { id: 'won', name: 'Won', color: '#22C55E', order: 5 },
  { id: 'lost', name: 'Lost', color: '#EF4444', order: 6 },
];

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pipelineStages, setPipelineStages] = useState<PipelineStage[]>(defaultPipelineStages);
  const [currentStageIndex, setCurrentStageIndex] = useState<number | null>(null); // null = not in pipeline
  const [savingStage, setSavingStage] = useState(false);
  
  // AI Tool Modal state
  const [aiToolModalOpen, setAiToolModalOpen] = useState(false);
  const [selectedAiTool, setSelectedAiTool] = useState<string>('');

  const handleAiToolClick = (toolName: string) => {
    setSelectedAiTool(toolName);
    setAiToolModalOpen(true);
  };

  // Load pipeline stages from user settings
  const loadPipelineStages = async (token: string): Promise<PipelineStage[]> => {
    try {
      const response = await fetch(`${API_URL}/user/pipeline-settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.stages && data.stages.length > 0) {
          const sortedStages = data.stages.sort((a: PipelineStage, b: PipelineStage) => a.order - b.order);
          setPipelineStages(sortedStages);
          return sortedStages;
        }
      }
    } catch (err) {
      console.log('Using default pipeline stages');
    }
    return defaultPipelineStages;
  };

  // Load pipeline summary to find lead's current stage
  const loadLeadPipelineStage = async (token: string, leadId: string, stages: PipelineStage[]) => {
    try {
      const response = await fetch(`${API_URL}/lead/pipeline/summary`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.summary && Array.isArray(data.summary)) {
          // Find the lead in any of the pipeline stages
          for (const stageData of data.summary) {
            const foundLead = stageData.leads?.find((l: { lead: { _id: string } }) => l.lead._id === leadId);
            if (foundLead) {
              // Find the index of this stage in our stages array
              const stageIndex = stages.findIndex(s => s.id === stageData.stageId);
              if (stageIndex !== -1) {
                setCurrentStageIndex(stageIndex);
                return;
              }
            }
          }
        }
      }
    } catch (err) {
      console.log('Could not load pipeline status for lead');
    }
  };

  // Update lead's pipeline stage
  const updateLeadStage = async (stageId: string, stageIndex: number) => {
    if (!lead || savingStage) return;
    
    const previousIndex = currentStageIndex;
    setCurrentStageIndex(stageIndex);
    setSavingStage(true);
    
    try {
      const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
      if (!token) return;
      
      const response = await fetch(`${API_URL}/lead/${lead._id}/pipeline`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pipelineStageId: stageId }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update stage');
      }
    } catch (err) {
      console.error('Failed to update lead stage:', err);
      setCurrentStageIndex(previousIndex); // Revert on error
    } finally {
      setSavingStage(false);
    }
  };

  useEffect(() => {
    const loadLead = async () => {
      try {
        const token = localStorage.getItem('propdeals_jwt') || localStorage.getItem('propdeals_token');
        if (!token) {
          setError('Not authenticated');
          setLoading(false);
          return;
        }

        // Load pipeline stages first and get the stages array
        const stages = await loadPipelineStages(token);

        // Load the lead's current pipeline stage from the summary
        await loadLeadPipelineStage(token, params.id as string, stages);

        const response = await fetch(`${API_URL}/lead/detail/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch lead: ${response.status}`);
        }

        const data = await response.json();
        // API returns { lead: {...} }
        const leadData = data.lead || data;
        setLead(leadData);
      } catch (err) {
        console.error('Failed to load lead:', err);
        setError(err instanceof Error ? err.message : 'Failed to load lead');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadLead();
    }
  }, [params.id]);

  if (loading) {
    return (
      <DemoLayout currentPage="leads">
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DemoLayout>
    );
  }

  if (error || !lead) {
    return (
      <DemoLayout currentPage="leads">
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
          <p className="text-red-600 mb-4">{error || 'Lead not found'}</p>
          <button 
            onClick={() => router.push('/leads')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Back to Leads
          </button>
        </div>
      </DemoLayout>
    );
  }

  const scoreInfo = getScoreColor(lead.sellingScore);
  const signals = getActiveSignals(lead);
  const scoreOffset = 301.59 - (301.59 * lead.sellingScore / 100);

  // Helper to get icon based on stage name/id
  const getStageIcon = (stage: PipelineStage) => {
    const nameLower = stage.name.toLowerCase();
    if (nameLower.includes('new')) return User;
    if (nameLower.includes('contact')) return Phone;
    if (nameLower.includes('meet') || nameLower.includes('appt') || nameLower.includes('appraisal')) return Clock;
    if (nameLower.includes('list') || nameLower.includes('proposal')) return Home;
    if (nameLower.includes('won') || nameLower.includes('sold')) return Zap;
    if (nameLower.includes('negot')) return MessageSquare;
    return User;
  };

  return (
    <DemoLayout currentPage="leads">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Hero Header with Gradient */}
        <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-gray-900 text-white">
          {/* Top Bar */}
          <div className="px-6 py-4 flex items-center justify-between border-b border-white/10">
            <button 
              onClick={() => router.push('/leads')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back to Leads</span>
            </button>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors shadow-lg shadow-green-500/25">
                <Phone className="w-4 h-4" />
                <span>Call</span>
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors backdrop-blur">
                <MessageSquare className="w-4 h-4" />
                <span>SMS</span>
              </button>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors backdrop-blur">
                <Mail className="w-4 h-4" />
                <span>Email</span>
              </button>
            </div>
          </div>
          
          {/* Main Hero Content */}
          <div className="px-6 py-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-start justify-between">
                {/* Left: Address & Location */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur rounded-full text-xs font-medium text-white/90">
                      {lead.propertyType || 'House'}
                    </span>
                    {lead.sellingScore >= 80 && (
                      <span className="px-3 py-1 bg-primary/80 rounded-full text-xs font-medium">Hot Lead</span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{lead.streetAddress}</h1>
                  <p className="text-white/60 text-lg flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    </svg>
                    <span>{lead.suburb}, {lead.state} {lead.postCode}</span>
                  </p>
                </div>
                
                {/* Right: Score Circle */}
                <div className="flex flex-col items-center">
                  <div className="relative w-28 h-28">
                    <svg className="w-28 h-28 transform -rotate-90">
                      <circle cx="56" cy="56" r="48" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none"/>
                      <circle 
                        cx="56" cy="56" r="48" 
                        stroke={scoreInfo.stroke} 
                        strokeWidth="8" 
                        fill="none" 
                        strokeDasharray="301.59" 
                        strokeDashoffset={scoreOffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black">{lead.sellingScore}</span>
                      <span className="text-xs text-white/60">Score</span>
                    </div>
                  </div>
                  <p className={`text-sm font-medium ${scoreInfo.labelColor} mt-2`}>{scoreInfo.label}</p>
                </div>
              </div>
              
              {/* Property Stats Bar */}
              <div className="grid grid-cols-5 gap-4 mt-8 pt-6 border-t border-white/10">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-blue-400 text-lg">🛏️</span>
                  </div>
                  <p className="text-2xl font-bold">{lead.bed || '-'}</p>
                  <p className="text-xs text-white/50">Beds</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-cyan-400 text-lg">🚿</span>
                  </div>
                  <p className="text-2xl font-bold">{lead.bath || '-'}</p>
                  <p className="text-xs text-white/50">Baths</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-purple-400 text-lg">🚗</span>
                  </div>
                  <p className="text-2xl font-bold">{lead.car || '-'}</p>
                  <p className="text-xs text-white/50">Cars</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                    <span className="text-green-400 text-lg">📐</span>
                  </div>
                  <p className="text-2xl font-bold">{lead.landSize ? `${lead.landSize}` : '-'}</p>
                  <p className="text-xs text-white/50">Land</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                    <span className="text-white text-lg">💰</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">{formatValue(lead.salePrice)}</p>
                  <p className="text-xs text-white/50">Est. Value</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* SELLING SIGNALS - FULL WIDTH HERO SECTION */}
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 rounded-2xl p-1">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">Active Selling Signals</h3>
                      <p className="text-sm text-gray-500">Why this lead scored high</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-bold rounded-full shadow">
                    {signals.length} signals
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {signals.length > 0 ? signals.map((signal) => (
                    <div key={signal.key} className={`flex items-center space-x-3 p-3 bg-gradient-to-r ${signal.color} rounded-xl text-white`}>
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-xl">
                        {signal.icon}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{signal.text}</p>
                        <p className="text-xs text-white/70">Detected selling signal</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-sm col-span-2">No active signals detected</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Main Grid: Left Column + Right Sidebar */}
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="col-span-2 space-y-6">
                {/* Owner & Property Insights - Two Cards Side by Side */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Owner Card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">Owner Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Owner Type</span>
                        <span className="text-sm font-semibold text-gray-900">{lead.ownerType || 'Unknown'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Name</span>
                        <span className="text-sm font-semibold text-gray-900">{lead.owner1Name || 'Not available'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-500">Last Sale</span>
                        <span className="text-sm font-semibold text-gray-900">{lead.salePrice ? formatValue(lead.salePrice) : 'Not available'}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Property Card */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <Home className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900">Property Info</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Type</span>
                        <span className="text-sm font-semibold text-gray-900">{lead.propertyType || 'House'}</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Available</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-500">Updated</span>
                        <span className="text-sm font-semibold text-gray-900">{formatDate(lead.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Activity & Engagement */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-5">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Activity Timeline</h3>
                      <p className="text-xs text-gray-500">Recent updates and signals for this property</p>
                    </div>
                  </div>
                  <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">Lead available in your area</p>
                      <p className="text-xs text-gray-500">Updated 1mo ago</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-8 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                      <p className="text-sm font-medium text-gray-900">High seller score detected</p>
                      <p className="text-xs text-gray-500">AI analysis complete</p>
                    </div>
                  </div>
                </div>
                
                {/* AI LISTING TOOLS - Full Width in Left Column */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">AI Listing Tools</h3>
                        <p className="text-white/60 text-xs">One-click scripts & strategies tailored to your profile</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-white/10 backdrop-blur text-white/80 text-xs font-medium rounded-full">✨ Powered by AI</span>
                  </div>
                  
                  {/* AI Tools - Full Width Sections */}
                  <div className="space-y-3">
                    {/* Research & Insights */}
                    <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg">🔍</span>
                        <h4 className="font-semibold text-sm text-white">Research & Insights</h4>
                        <span className="text-white/40 text-xs">— Property data, scores & market analysis</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {['Score Explained', 'Property Highlights', 'Similar Properties', 'Price Prediction'].map((tool) => (
                          <button key={tool} onClick={() => handleAiToolClick(tool)} className="group px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/90">{tool}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Outreach Scripts */}
                    <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg">💬</span>
                        <h4 className="font-semibold text-sm text-white">Outreach Scripts</h4>
                        <span className="text-white/40 text-xs">— Personalised scripts for every channel</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {['SMS Script', 'Email Introduction', 'Phone Call Script', 'Door Knock Opener'].map((tool) => (
                          <button key={tool} onClick={() => handleAiToolClick(tool)} className="group px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/90">{tool}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Win the Listing */}
                    <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg">🏆</span>
                        <h4 className="font-semibold text-sm text-white">Win the Listing</h4>
                        <span className="text-white/40 text-xs">— Strategies & objection handling</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {['Personalised Pitch', 'Objection Handling', 'Commission Script', 'Pricing Strategy'].map((tool) => (
                          <button key={tool} onClick={() => handleAiToolClick(tool)} className="group px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/90">{tool}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Marketing Generator */}
                    <div className="bg-white/5 backdrop-blur rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg">📣</span>
                        <h4 className="font-semibold text-sm text-white">Marketing Generator</h4>
                        <span className="text-white/40 text-xs">— Ads, content & promotional materials</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {['Facebook/Insta Ad', 'Social Media Post', 'Property Description', 'Staging Ideas'].map((tool) => (
                          <button key={tool} onClick={() => handleAiToolClick(tool)} className="group px-3 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-white/90">{tool}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-white/40 group-hover:text-white/80 transition-colors" />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Sidebar Tools */}
              <div className="space-y-6">
                {/* Pipeline Progress */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Pipeline Progress
                      {savingStage && <span className="ml-2 text-xs text-gray-400">(saving...)</span>}
                    </h3>
                    <button 
                      onClick={() => router.push('/pipeline')}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      View Pipeline
                    </button>
                  </div>
                  <div className="flex items-center overflow-x-auto pb-2 pt-3">
                    {pipelineStages.slice(0, 6).map((stage, idx) => {
                      const StageIcon = getStageIcon(stage);
                      const isInPipeline = currentStageIndex !== null;
                      const isActive = isInPipeline && idx <= currentStageIndex;
                      const isCurrent = isInPipeline && idx === currentStageIndex;
                      
                      return (
                        <div key={stage.id} className="flex-1 relative min-w-[60px]">
                          <div 
                            onClick={() => updateLeadStage(stage.id, idx)}
                            className={`flex flex-col items-center cursor-pointer relative z-10 ${savingStage ? 'pointer-events-none opacity-50' : ''}`}
                          >
                            <div 
                              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                isCurrent 
                                  ? 'bg-primary text-white shadow-lg ring-4 ring-primary/20' 
                                  : isActive 
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 text-gray-400 hover:bg-blue-100 hover:text-blue-600'
                              }`}
                              style={isCurrent ? { backgroundColor: stage.color } : undefined}
                            >
                              <StageIcon className="w-5 h-5" />
                            </div>
                            <span className={`text-xs mt-1 text-center truncate max-w-[60px] ${isCurrent ? 'font-semibold text-primary' : 'text-gray-400'}`}>
                              {stage.name}
                            </span>
                          </div>
                          {idx < pipelineStages.slice(0, 6).length - 1 && (
                            <div className={`absolute top-5 left-1/2 w-full h-0.5 ${isActive ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    {currentStageIndex === null ? 'Click a stage to add this lead to your pipeline' : 'Click a stage to update this lead\'s progress'}
                  </p>
                </div>
                
                {/* Instant Appraisal CTA */}
                <div className="bg-gradient-to-br from-primary to-red-700 rounded-xl p-5 text-white shadow-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm">Instant Appraisal Report</h3>
                      <p className="text-white/70 text-xs">Generate in seconds</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      // Generate agent slug and property slug for URL
                      const agentSlug = 'agent'; // In production, use actual agent name
                      const propertySlug = encodeURIComponent(
                        (lead?.streetAddress || 'property').toLowerCase().replace(/\s+/g, '-')
                      );
                      router.push(`/report/${agentSlug}/${propertySlug}`);
                    }}
                    className="w-full py-2.5 bg-white text-primary font-bold text-sm rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Report</span>
                  </button>
                </div>
                
                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <button className="flex flex-col items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                      <Phone className="w-5 h-5 text-green-600 mb-1" />
                      <span className="text-xs text-green-700">Call</span>
                    </button>
                    <button className="flex flex-col items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                      <MessageCircle className="w-5 h-5 text-blue-600 mb-1" />
                      <span className="text-xs text-blue-700">SMS</span>
                    </button>
                    <button className="flex flex-col items-center p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                      <Mail className="w-5 h-5 text-purple-600 mb-1" />
                      <span className="text-xs text-purple-700">Email</span>
                    </button>
                    <button className="flex flex-col items-center p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                      <Notebook className="w-5 h-5 text-amber-600 mb-1" />
                      <span className="text-xs text-amber-700">Note</span>
                    </button>
                  </div>
                </div>
                
                {/* Competitor Intel */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center">
                      <span className="mr-2">👀</span>
                      Competitor Intel
                    </h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Live</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Agents watching</span>
                      <span className="text-sm font-semibold text-gray-900">11</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Last contact attempt</span>
                      <span className="text-sm font-semibold text-blue-600">2 days ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-500">Your position</span>
                      <span className="text-sm font-semibold text-green-600">🔥 First today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Tool Modal */}
      <AIToolModal
        isOpen={aiToolModalOpen}
        onClose={() => setAiToolModalOpen(false)}
        toolName={selectedAiTool}
        leadId={lead?._id || ''}
        propertyAddress={lead?.fullAddress || lead?.streetAddress || ''}
      />
    </DemoLayout>
  );
}
