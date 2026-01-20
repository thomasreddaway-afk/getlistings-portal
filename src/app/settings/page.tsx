'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DemoLayout } from '@/components/layout';
import { apiRequest } from '@/lib/api';
import type { PipelineStage, CallScript, SMSTemplate, EmailTemplate } from '@/types/config';

type SettingsTab = 'pipeline' | 'scripts' | 'sms' | 'email';

async function fetchConfig<T>(type: string): Promise<T> {
  // Use MongoDB API directly for config
  try {
    return await apiRequest<T>(`/config/${type}`, 'GET');
  } catch {
    // Return empty array if endpoint doesn't exist yet
    return [] as unknown as T;
  }
}

async function updateConfig<T>(type: string, data: T): Promise<T> {
  return apiRequest<T>(`/config/${type}`, 'PUT', data);
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('pipeline');
  const queryClient = useQueryClient();

  const tabs: { id: SettingsTab; label: string; icon: JSX.Element }[] = [
    {
      id: 'pipeline',
      label: 'Pipeline Stages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
      ),
    },
    {
      id: 'scripts',
      label: 'Call Scripts',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      id: 'sms',
      label: 'SMS Templates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      id: 'email',
      label: 'Email Templates',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <DemoLayout currentPage="settings">
      <div className="flex h-full">
        {/* Settings Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 p-4">
          <h2 className="text-lg font-semibold text-gray-900 px-3 mb-4">Settings</h2>
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'pipeline' && <PipelineSettings />}
          {activeTab === 'scripts' && <CallScriptsSettings />}
          {activeTab === 'sms' && <SMSTemplatesSettings />}
          {activeTab === 'email' && <EmailTemplatesSettings />}
        </div>
      </div>
    </DemoLayout>
  );
}

// Pipeline Stages Settings
function PipelineSettings() {
  const queryClient = useQueryClient();
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['config', 'pipeline-stages'],
    queryFn: () => fetchConfig<{ stages: PipelineStage[] }>('pipeline-stages'),
  });

  const mutation = useMutation({
    mutationFn: (stages: PipelineStage[]) => updateConfig('pipeline-stages', { stages }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config', 'pipeline-stages'] });
      setIsDirty(false);
    },
  });

  useEffect(() => {
    if (data?.stages) {
      setStages(data.stages);
    }
  }, [data]);

  const handleAddStage = () => {
    const newStage: PipelineStage = {
      id: `stage_${Date.now()}`,
      name: 'New Stage',
      order: stages.length,
      color: '#6B7280',
      is_active: true,
    };
    setStages([...stages, newStage]);
    setIsDirty(true);
  };

  const handleUpdateStage = (index: number, updates: Partial<PipelineStage>) => {
    const updated = [...stages];
    updated[index] = { ...updated[index], ...updates };
    setStages(updated);
    setIsDirty(true);
  };

  const handleDeleteStage = (index: number) => {
    setStages(stages.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  const handleSave = () => {
    mutation.mutate(stages);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline Stages</h1>
          <p className="text-sm text-gray-500 mt-1">Configure the stages opportunities move through</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddStage}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Add Stage
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || mutation.isPending}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="divide-y divide-gray-200">
          {stages.map((stage, index) => (
            <div key={stage.id} className="p-4 flex items-center space-x-4">
              <div className="w-8 text-center text-gray-400 font-medium">{index + 1}</div>
              <input
                type="color"
                value={stage.color}
                onChange={(e) => handleUpdateStage(index, { color: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={stage.name}
                onChange={(e) => handleUpdateStage(index, { name: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={stage.is_active}
                  onChange={(e) => handleUpdateStage(index, { is_active: e.target.checked })}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600">Active</span>
              </label>
              <button
                onClick={() => handleDeleteStage(index)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Call Scripts Settings
function CallScriptsSettings() {
  const queryClient = useQueryClient();
  const [scripts, setScripts] = useState<CallScript[]>([]);
  const [selectedScript, setSelectedScript] = useState<CallScript | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['config', 'call-scripts'],
    queryFn: () => fetchConfig<{ scripts: CallScript[] }>('call-scripts'),
  });

  const mutation = useMutation({
    mutationFn: (scripts: CallScript[]) => updateConfig('call-scripts', { scripts }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config', 'call-scripts'] });
      setIsDirty(false);
    },
  });

  useEffect(() => {
    if (data?.scripts) {
      setScripts(data.scripts);
      if (!selectedScript && data.scripts.length > 0) {
        setSelectedScript(data.scripts[0]);
      }
    }
  }, [data]);

  const handleAddScript = () => {
    const newScript: CallScript = {
      id: `script_${Date.now()}`,
      name: 'New Script',
      stage: 'new',
      content: 'Enter your script here...',
      is_active: true,
    };
    setScripts([...scripts, newScript]);
    setSelectedScript(newScript);
    setIsDirty(true);
  };

  const handleUpdateScript = (updates: Partial<CallScript>) => {
    if (!selectedScript) return;
    const updated = scripts.map(s => s.id === selectedScript.id ? { ...s, ...updates } : s);
    setScripts(updated);
    setSelectedScript({ ...selectedScript, ...updates });
    setIsDirty(true);
  };

  const handleSave = () => {
    mutation.mutate(scripts);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="flex h-full">
      {/* Scripts List */}
      <div className="w-64 border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Scripts</h3>
          <button onClick={handleAddScript} className="p-1 text-primary hover:bg-primary/10 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="space-y-1">
          {scripts.map((script) => (
            <button
              key={script.id}
              onClick={() => setSelectedScript(script)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedScript?.id === script.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {script.name}
            </button>
          ))}
        </div>
      </div>

      {/* Script Editor */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Call Scripts</h1>
          <button
            onClick={handleSave}
            disabled={!isDirty || mutation.isPending}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {selectedScript ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Script Name</label>
              <input
                type="text"
                value={selectedScript.name}
                onChange={(e) => handleUpdateScript({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pipeline Stage</label>
              <select
                value={selectedScript.stage}
                onChange={(e) => handleUpdateScript({ stage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="appointment_set">Appointment Set</option>
                <option value="appraisal_done">Appraisal Done</option>
                <option value="proposal_sent">Proposal Sent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Script Content</label>
              <p className="text-xs text-gray-500 mb-2">
                Use placeholders: {"{{first_name}}"}, {"{{property_address}}"}, {"{{agent_name}}"}
              </p>
              <textarea
                value={selectedScript.content}
                onChange={(e) => handleUpdateScript({ content: e.target.value })}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary font-mono text-sm"
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a script or create a new one</p>
        )}
      </div>
    </div>
  );
}

// SMS Templates Settings
function SMSTemplatesSettings() {
  const queryClient = useQueryClient();
  const [templates, setTemplates] = useState<SMSTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['config', 'sms-templates'],
    queryFn: () => fetchConfig<{ templates: SMSTemplate[] }>('sms-templates'),
  });

  const mutation = useMutation({
    mutationFn: (templates: SMSTemplate[]) => updateConfig('sms-templates', { templates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config', 'sms-templates'] });
      setIsDirty(false);
    },
  });

  useEffect(() => {
    if (data?.templates) {
      setTemplates(data.templates);
      if (!selectedTemplate && data.templates.length > 0) {
        setSelectedTemplate(data.templates[0]);
      }
    }
  }, [data]);

  const handleAddTemplate = () => {
    const newTemplate: SMSTemplate = {
      id: `sms_${Date.now()}`,
      name: 'New Template',
      trigger: 'manual',
      content: 'Enter your message...',
      is_active: true,
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsDirty(true);
  };

  const handleUpdateTemplate = (updates: Partial<SMSTemplate>) => {
    if (!selectedTemplate) return;
    const updated = templates.map(t => t.id === selectedTemplate.id ? { ...t, ...updates } : t);
    setTemplates(updated);
    setSelectedTemplate({ ...selectedTemplate, ...updates });
    setIsDirty(true);
  };

  const handleSave = () => {
    mutation.mutate(templates);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="flex h-full">
      {/* Templates List */}
      <div className="w-64 border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Templates</h3>
          <button onClick={handleAddTemplate} className="p-1 text-primary hover:bg-primary/10 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="space-y-1">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Template Editor */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">SMS Templates</h1>
          <button
            onClick={handleSave}
            disabled={!isDirty || mutation.isPending}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {selectedTemplate ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
              <input
                type="text"
                value={selectedTemplate.name}
                onChange={(e) => handleUpdateTemplate({ name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
              <select
                value={selectedTemplate.trigger}
                onChange={(e) => handleUpdateTemplate({ trigger: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                <option value="manual">Manual (send on demand)</option>
                <option value="new_lead">New Lead</option>
                <option value="stage_change">Stage Change</option>
                <option value="no_response_24h">No Response (24h)</option>
                <option value="no_response_48h">No Response (48h)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
              <p className="text-xs text-gray-500 mb-2">
                Use placeholders: {"{{first_name}}"}, {"{{property_address}}"}, {"{{agent_name}}"}
              </p>
              <textarea
                value={selectedTemplate.content}
                onChange={(e) => handleUpdateTemplate({ content: e.target.value })}
                rows={6}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
              <p className="text-xs text-gray-400 mt-1">
                {selectedTemplate.content.length}/160 characters
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a template or create a new one</p>
        )}
      </div>
    </div>
  );
}

// Email Templates Settings
function EmailTemplatesSettings() {
  const queryClient = useQueryClient();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['config', 'email-templates'],
    queryFn: () => fetchConfig<{ templates: EmailTemplate[] }>('email-templates'),
  });

  const mutation = useMutation({
    mutationFn: (templates: EmailTemplate[]) => updateConfig('email-templates', { templates }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config', 'email-templates'] });
      setIsDirty(false);
    },
  });

  useEffect(() => {
    if (data?.templates) {
      setTemplates(data.templates);
      if (!selectedTemplate && data.templates.length > 0) {
        setSelectedTemplate(data.templates[0]);
      }
    }
  }, [data]);

  const handleAddTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `email_${Date.now()}`,
      name: 'New Template',
      subject: 'Email Subject',
      body: '<p>Enter your email content here...</p>',
      trigger: 'manual',
      is_active: true,
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplate(newTemplate);
    setIsDirty(true);
  };

  const handleUpdateTemplate = (updates: Partial<EmailTemplate>) => {
    if (!selectedTemplate) return;
    const updated = templates.map(t => t.id === selectedTemplate.id ? { ...t, ...updates } : t);
    setTemplates(updated);
    setSelectedTemplate({ ...selectedTemplate, ...updates });
    setIsDirty(true);
  };

  const handleSave = () => {
    mutation.mutate(templates);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  }

  return (
    <div className="flex h-full">
      {/* Templates List */}
      <div className="w-64 border-r border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Templates</h3>
          <button onClick={handleAddTemplate} className="p-1 text-primary hover:bg-primary/10 rounded">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        <div className="space-y-1">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTemplate?.id === template.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* Template Editor */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Email Templates</h1>
          <button
            onClick={handleSave}
            disabled={!isDirty || mutation.isPending}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {selectedTemplate ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                <input
                  type="text"
                  value={selectedTemplate.name}
                  onChange={(e) => handleUpdateTemplate({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                <select
                  value={selectedTemplate.trigger}
                  onChange={(e) => handleUpdateTemplate({ trigger: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option value="manual">Manual (send on demand)</option>
                  <option value="new_lead">New Lead</option>
                  <option value="stage_change">Stage Change</option>
                  <option value="appraisal_complete">Appraisal Complete</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
              <input
                type="text"
                value={selectedTemplate.subject}
                onChange={(e) => handleUpdateTemplate({ subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Body (HTML)</label>
              <p className="text-xs text-gray-500 mb-2">
                Use placeholders: {"{{first_name}}"}, {"{{property_address}}"}, {"{{agent_name}}"}, {"{{agent_signature}}"}
              </p>
              <textarea
                value={selectedTemplate.body}
                onChange={(e) => handleUpdateTemplate({ body: e.target.value })}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary font-mono text-sm"
              />
            </div>
          </div>
        ) : (
          <p className="text-gray-500">Select a template or create a new one</p>
        )}
      </div>
    </div>
  );
}
