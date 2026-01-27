'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { Eye, Check, MessageSquare, ArrowRight, Play, Award } from 'lucide-react';

const smsTemplates = [
  { id: 1, name: 'Welcome Message', preview: 'Hi {{first_name}}, thanks for your interest in {{property_address}}...', category: 'intro' },
  { id: 2, name: 'Follow Up', preview: 'Hi {{first_name}}, just checking in about your property search...', category: 'nurture' },
  { id: 3, name: 'Valuation Offer', preview: 'Hi {{first_name}}, would you like a free valuation of your property?', category: 'cta' },
  { id: 4, name: 'Booking Reminder', preview: 'Hi {{first_name}}, just a reminder about your valuation tomorrow...', category: 'reminder' }
];

const mergeFields = ['{{first_name}}', '{{property_address}}', '{{suburb}}', '{{agent_name}}', '{{booking_link}}'];

export default function SMSFlowsPage() {
  const [flowName, setFlowName] = useState('New Lead Valuation Flow');
  const [flowItems, setFlowItems] = useState<typeof smsTemplates>([]);

  const addTemplate = (template: typeof smsTemplates[0]) => {
    setFlowItems([...flowItems, template]);
  };

  return (
    <DemoLayout currentPage="sms-flows">
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-100">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Flow Builder</h1>
              <p className="text-sm text-gray-500 mt-0.5">Create automated SMS sequences to convert leads to valuation requests</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Save Flow</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* SMS Templates Library */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">SMS Templates</h2>
              <p className="text-xs text-gray-500 mt-1">Click templates to add to flow</p>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-3">
              {smsTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => addTemplate(template)}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-sm text-gray-900">{template.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{template.preview}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flow Builder Canvas */}
          <div className="flex-1 p-6 overflow-auto">
            <div className="max-w-xl mx-auto">
              {/* Flow Start */}
              <div className="flex items-center justify-center mb-4">
                <div className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Lead Enters Info</span>
                </div>
              </div>
              <div className="flex justify-center"><div className="w-0.5 h-8 bg-gray-300"></div></div>

              {/* Flow Items or Placeholder */}
              <div className="min-h-[100px] p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50">
                {flowItems.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium">Click SMS templates to add</p>
                    <p className="text-sm mt-1">Build your conversion flow step by step</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flowItems.map((item, i) => (
                      <div key={i}>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{item.name}</span>
                            <span className="text-xs text-gray-400">Step {i + 1}</span>
                          </div>
                          <p className="text-sm text-gray-500">{item.preview}</p>
                        </div>
                        {i < flowItems.length - 1 && <div className="flex justify-center"><div className="w-0.5 h-6 bg-gray-300"></div></div>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-4"><div className="w-0.5 h-8 bg-gray-300"></div></div>
              {/* Flow End */}
              <div className="flex items-center justify-center">
                <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium flex items-center space-x-2">
                  <Award className="w-4 h-4" />
                  <span>Valuation Booked! 🎉</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flow Settings */}
          <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Flow Settings</h2>
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Flow Name</label>
                <input
                  type="text"
                  value={flowName}
                  onChange={(e) => setFlowName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trigger</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option>Lead submits info</option>
                  <option>Lead requests valuation</option>
                  <option>Lead views property</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Delay</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary">
                  <option>Immediate</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>1 day</option>
                </select>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Merge Fields</h3>
                <div className="flex flex-wrap gap-2">
                  {mergeFields.map((field) => (
                    <span key={field} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded cursor-pointer hover:bg-blue-100">{field}</span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Click to copy</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Flow Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Messages in flow</span>
                    <span className="font-semibold text-gray-900">{flowItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Est. conversion</span>
                    <span className="font-semibold text-green-600">~24%</span>
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
