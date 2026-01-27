'use client';

import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import { useState, useEffect, useRef, DragEvent } from 'react';
import { Plus, X, RefreshCw, Settings, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  order: number;
}

interface PipelineLead {
  _id: string;
  leadId: string;
  streetAddress?: string;
  suburb?: string;
  salePrice?: string;
  sellingScore?: number;
  pipelineStageId?: string;
  notes?: string;
}

interface StageWithLeads extends PipelineStage {
  leads: PipelineLead[];
  count: number;
  loading: boolean;
}

// Map hex colors to Tailwind classes
const getColorClasses = (hexColor: string) => {
  const colorMap: Record<string, { bg: string; text: string; badge: string; border: string }> = {
    '#3B82F6': { bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
    '#8B5CF6': { bg: 'bg-purple-50', text: 'text-purple-700', badge: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
    '#F59E0B': { bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700', border: 'border-amber-200' },
    '#EC4899': { bg: 'bg-pink-50', text: 'text-pink-700', badge: 'bg-pink-100 text-pink-700', border: 'border-pink-200' },
    '#10B981': { bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
    '#22C55E': { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700', border: 'border-green-200' },
    '#EF4444': { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700', border: 'border-red-200' },
  };
  return colorMap[hexColor] || { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'bg-gray-200 text-gray-700', border: 'border-gray-200' };
};

// Format price as $1,234,567
const formatPrice = (price?: string): string => {
  if (!price) return '';
  const num = parseFloat(price.replace(/[$,]/g, ''));
  if (isNaN(num)) return price;
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
};

const defaultStages: PipelineStage[] = [
  { id: 'new', name: 'New Lead', color: '#3B82F6', order: 0 },
  { id: 'contacted', name: 'Contacted', color: '#8B5CF6', order: 1 },
  { id: 'meeting', name: 'Meeting Scheduled', color: '#F59E0B', order: 2 },
  { id: 'proposal', name: 'Proposal Sent', color: '#EC4899', order: 3 },
  { id: 'negotiation', name: 'Negotiation', color: '#10B981', order: 4 },
  { id: 'won', name: 'Won', color: '#22C55E', order: 5 },
  { id: 'lost', name: 'Lost', color: '#EF4444', order: 6 },
];

export default function PipelinePage() {
  const [stages, setStages] = useState<StageWithLeads[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [draggedLead, setDraggedLead] = useState<{ lead: PipelineLead; fromStage: string } | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [editingStage, setEditingStage] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Load pipeline settings and summary
  const loadPipeline = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get user's pipeline settings (custom stage names)
      let pipelineStages: PipelineStage[] = defaultStages;
      try {
        const settingsResponse = await apiRequest<{ stages: PipelineStage[]; isCustomized: boolean }>('/user/pipeline-settings', 'GET');
        if (settingsResponse.stages) {
          pipelineStages = settingsResponse.stages;
        }
      } catch (err) {
        console.log('Using default pipeline stages');
      }
      
      // Get pipeline summary (counts and leads per stage)
      // API returns: { summary: [{ stageId, count, leads: [...] }] }
      interface SummaryItem {
        stageId: string;
        count: number;
        leads: Array<{
          myLeadId: string;
          lead: PipelineLead;
          pipelineUpdatedAt: string;
          notes: string;
        }>;
      }
      
      let summaryData: SummaryItem[] = [];
      try {
        const summaryResponse = await apiRequest<{ summary: SummaryItem[] }>('/lead/pipeline/summary', 'GET');
        if (summaryResponse.summary && Array.isArray(summaryResponse.summary)) {
          summaryData = summaryResponse.summary;
        }
      } catch (err) {
        console.log('Could not load pipeline summary');
      }
      
      // Build a map of stageId -> { count, leads }
      const summaryMap: Record<string, { count: number; leads: PipelineLead[] }> = {};
      for (const item of summaryData) {
        summaryMap[item.stageId] = {
          count: item.count,
          leads: item.leads.map(l => ({
            _id: l.lead._id,
            leadId: l.myLeadId,
            streetAddress: l.lead.streetAddress,
            suburb: l.lead.suburb,
            salePrice: l.lead.salePrice,
            sellingScore: l.lead.sellingScore,
            pipelineStageId: item.stageId,
            notes: l.notes,
          })),
        };
      }
      
      // Initialize stages with counts and leads from summary
      const stagesWithLeads: StageWithLeads[] = pipelineStages.map(stage => ({
        ...stage,
        leads: summaryMap[stage.id]?.leads || [],
        count: summaryMap[stage.id]?.count || 0,
        loading: false,
      }));
      
      setStages(stagesWithLeads);
    } catch (err) {
      console.error('Failed to load pipeline:', err);
      setError(err instanceof Error ? err.message : 'Failed to load pipeline');
    } finally {
      setLoading(false);
    }
  };

  // Load leads for a specific stage
  const loadStageLeads = async (stageId: string) => {
    setStages(prev => prev.map(s => s.id === stageId ? { ...s, loading: true } : s));
    
    try {
      const response = await apiRequest<{ leads: PipelineLead[]; total: number }>('/lead/pipeline/stage', 'POST', {
        stageId,
        page: 1,
        perPage: 50,
      });
      
      if (response.leads) {
        setStages(prev => prev.map(s => 
          s.id === stageId 
            ? { ...s, leads: response.leads, loading: false }
            : s
        ));
      }
    } catch (err) {
      console.error(`Failed to load leads for stage ${stageId}:`, err);
      setStages(prev => prev.map(s => s.id === stageId ? { ...s, loading: false } : s));
    }
  };

  useEffect(() => {
    loadPipeline();
  }, []);

  // Calculate totals
  const totalLeads = stages.reduce((sum, stage) => sum + stage.count, 0);

  // Drag handlers
  const handleDragStart = (e: DragEvent, lead: PipelineLead, stageId: string) => {
    setDraggedLead({ lead, fromStage: stageId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: DragEvent, toStageId: string) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (!draggedLead || draggedLead.fromStage === toStageId) {
      setDraggedLead(null);
      return;
    }

    const leadId = draggedLead.lead._id;
    const fromStageId = draggedLead.fromStage;
    
    // Optimistic update
    setStages(prev => prev.map(stage => {
      if (stage.id === fromStageId) {
        return { 
          ...stage, 
          leads: stage.leads.filter(l => l._id !== leadId),
          count: stage.count - 1,
        };
      }
      if (stage.id === toStageId) {
        return { 
          ...stage, 
          leads: [...stage.leads, { ...draggedLead.lead, pipelineStageId: toStageId }],
          count: stage.count + 1,
        };
      }
      return stage;
    }));
    
    setDraggedLead(null);
    
    // Save to API
    try {
      await apiRequest(`/lead/${leadId}/pipeline`, 'PATCH', {
        pipelineStageId: toStageId,
      });
    } catch (err) {
      console.error('Failed to update lead stage:', err);
      // Revert on error
      loadPipeline();
    }
  };

  const handleDragEnd = () => {
    setDraggedLead(null);
    setDragOverStage(null);
  };

  // Stage name editing
  const startEditingStage = (stageId: string) => {
    setEditingStage(stageId);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const saveStageEdit = async (stageId: string, newName: string) => {
    if (!newName.trim()) {
      setEditingStage(null);
      return;
    }
    
    // Update locally
    const updatedStages = stages.map(s => 
      s.id === stageId ? { ...s, name: newName.trim() } : s
    );
    setStages(updatedStages);
    setEditingStage(null);
    
    // Save to API
    setSaving(true);
    try {
      await apiRequest('/user/pipeline-settings', 'PUT', {
        stages: updatedStages.map(s => ({
          id: s.id,
          name: s.name,
          color: s.color,
          order: s.order,
        })),
      });
    } catch (err) {
      console.error('Failed to save pipeline settings:', err);
    } finally {
      setSaving(false);
    }
  };

  // Add new stage
  const addStage = async () => {
    const colors = ['#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#10B981', '#22C55E'];
    const newStage: StageWithLeads = {
      id: `stage-${Date.now()}`,
      name: 'New Stage',
      color: colors[stages.length % colors.length],
      order: stages.length,
      leads: [],
      count: 0,
      loading: false,
    };
    
    const updatedStages = [...stages, newStage];
    setStages(updatedStages);
    
    // Save to API
    setSaving(true);
    try {
      await apiRequest('/user/pipeline-settings', 'PUT', {
        stages: updatedStages.map(s => ({
          id: s.id,
          name: s.name,
          color: s.color,
          order: s.order,
        })),
      });
    } catch (err) {
      console.error('Failed to add stage:', err);
    } finally {
      setSaving(false);
    }
  };

  // Delete stage
  const deleteStage = async (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    if (stage && stage.count > 0) {
      alert('Cannot delete a stage with leads. Move the leads first.');
      return;
    }
    
    const updatedStages = stages.filter(s => s.id !== stageId);
    setStages(updatedStages);
    
    // Save to API
    setSaving(true);
    try {
      await apiRequest('/user/pipeline-settings', 'PUT', {
        stages: updatedStages.map(s => ({
          id: s.id,
          name: s.name,
          color: s.color,
          order: s.order,
        })),
      });
    } catch (err) {
      console.error('Failed to delete stage:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DemoLayout currentPage="pipeline">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-gray-500">Loading pipeline...</p>
          </div>
        </div>
      </DemoLayout>
    );
  }

  return (
    <DemoLayout currentPage="pipeline">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
              <p className="text-sm text-gray-500 mt-0.5">
                <span className="font-semibold text-gray-900">{totalLeads}</span> leads in your pipeline
                {saving && <span className="ml-2 text-blue-600"><Loader2 className="w-3 h-3 inline animate-spin" /> Saving...</span>}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <p className="text-xs text-gray-400">💡 Drag leads between stages • Click stage name to rename</p>
              <button
                onClick={loadPipeline}
                disabled={loading}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button
                onClick={addStage}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                <span>Add Stage</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={loadPipeline} className="mt-2 text-sm text-red-600 underline">Retry</button>
          </div>
        )}

        {/* Empty State */}
        {stages.length === 0 && !loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Set up your pipeline</h3>
              <p className="text-gray-500 mb-4">Create stages to track your leads through your sales process</p>
              <button
                onClick={addStage}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Create First Stage
              </button>
            </div>
          </div>
        )}

        {/* Pipeline Board */}
        {stages.length > 0 && (
          <div className="flex-1 overflow-x-auto p-4">
            <div className="flex space-x-4 h-full min-w-max">
              {stages.map(stage => {
                const colors = getColorClasses(stage.color);
                
                return (
                  <div
                    key={stage.id}
                    className={`w-64 ${colors.bg} rounded-lg p-3 flex flex-col group`}
                  >
                    {/* Stage Header */}
                    <div className="flex items-center justify-between mb-3">
                      {editingStage === stage.id ? (
                        <input
                          ref={editInputRef}
                          type="text"
                          defaultValue={stage.name}
                          className={`font-semibold ${colors.text} bg-white px-2 py-1 rounded border border-gray-300 text-sm w-full mr-2`}
                          onBlur={(e) => saveStageEdit(stage.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveStageEdit(stage.id, e.currentTarget.value);
                            if (e.key === 'Escape') setEditingStage(null);
                          }}
                        />
                      ) : (
                        <h3
                          className={`stage-name font-semibold ${colors.text} cursor-pointer hover:bg-white/50 px-2 py-1 -mx-2 -my-1 rounded`}
                          onClick={() => startEditingStage(stage.id)}
                          title="Click to rename"
                        >
                          {stage.name}
                        </h3>
                      )}
                      <div className="flex items-center space-x-1">
                        <span className={`text-xs ${colors.badge} px-2 py-0.5 rounded-full`}>
                          {stage.count}
                        </span>
                        <button
                          onClick={() => deleteStage(stage.id)}
                          className="p-1 hover:bg-white/50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete stage"
                        >
                          <X className="w-3.5 h-3.5 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Drop Zone */}
                    <div
                      className={`space-y-2 flex-1 overflow-auto min-h-[100px] rounded-lg transition-colors ${
                        dragOverStage === stage.id ? 'bg-blue-100 border-2 border-dashed border-blue-400' : ''
                      }`}
                      onDragOver={(e) => handleDragOver(e, stage.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, stage.id)}
                    >
                      {stage.loading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                        </div>
                      ) : (
                        <>
                          {stage.leads.map(lead => (
                            <Link
                              key={lead._id}
                              href={`/properties/${lead._id}`}
                              draggable
                              onDragStart={(e) => handleDragStart(e, lead, stage.id)}
                              onDragEnd={handleDragEnd}
                              className={`block bg-white rounded-lg p-3 border ${colors.border} cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                                draggedLead?.lead._id === lead._id ? 'opacity-50' : ''
                              }`}
                            >
                              <p className="font-medium text-sm text-gray-900">{lead.streetAddress || 'Unknown Address'}</p>
                              <p className="text-xs text-gray-500">{lead.suburb || ''}</p>
                              {lead.salePrice && (
                                <p className="text-xs text-green-600 mt-2 font-medium">{formatPrice(lead.salePrice)}</p>
                              )}
                              {lead.sellingScore && (
                                <div className="flex items-center mt-1">
                                  <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-green-500 rounded-full" 
                                      style={{ width: `${lead.sellingScore}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500 ml-1">{lead.sellingScore}%</span>
                                </div>
                              )}
                            </Link>
                          ))}

                          {stage.leads.length === 0 && !dragOverStage && (
                            <div className="text-center py-8 text-gray-400 text-xs">
                              {stage.count > 0 ? 'Loading...' : 'Drop leads here'}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </DemoLayout>
  );
}
