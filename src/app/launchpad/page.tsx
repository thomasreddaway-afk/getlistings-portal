'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  Rocket, 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  Play,
  Book,
  Video,
  MessageSquare,
  Target,
  Award,
  Zap,
  Star
} from 'lucide-react';

interface LaunchpadTask {
  id: string;
  title: string;
  description: string;
  category: 'setup' | 'profile' | 'marketing' | 'leads';
  duration: string;
  isCompleted: boolean;
  link?: string;
  videoUrl?: string;
}

const launchpadTasks: LaunchpadTask[] = [
  // Setup
  { id: '1', title: 'Complete your profile', description: 'Add your photo, bio, and contact details', category: 'setup', duration: '5 min', isCompleted: true },
  { id: '2', title: 'Subscribe to your first suburb', description: 'Choose your core selling area', category: 'setup', duration: '2 min', isCompleted: true },
  { id: '3', title: 'Connect your email', description: 'Link your email for automated follow-ups', category: 'setup', duration: '3 min', isCompleted: true },
  { id: '4', title: 'Set up SMS notifications', description: 'Get instant alerts for hot leads', category: 'setup', duration: '2 min', isCompleted: false },
  
  // Profile
  { id: '5', title: 'Upload professional headshot', description: 'First impressions matter - add a quality photo', category: 'profile', duration: '2 min', isCompleted: true },
  { id: '6', title: 'Write your agent bio', description: 'Tell potential sellers about your experience', category: 'profile', duration: '10 min', isCompleted: false },
  { id: '7', title: 'Add your sales history', description: 'Showcase your track record', category: 'profile', duration: '5 min', isCompleted: false },
  
  // Marketing
  { id: '8', title: 'Create your first SMS template', description: 'Set up templates for quick responses', category: 'marketing', duration: '5 min', isCompleted: false },
  { id: '9', title: 'Set up automated welcome flow', description: 'Auto-respond to new leads', category: 'marketing', duration: '10 min', isCompleted: false },
  { id: '10', title: 'Connect Facebook Ads', description: 'Import leads from your ad campaigns', category: 'marketing', duration: '5 min', isCompleted: false },
  
  // Leads
  { id: '11', title: 'Contact your first hot lead', description: 'Reach out to a high-score lead', category: 'leads', duration: '5 min', isCompleted: false },
  { id: '12', title: 'Book your first appraisal', description: 'Convert a lead to an appraisal', category: 'leads', duration: '15 min', isCompleted: false },
  { id: '13', title: 'Add notes to 3 leads', description: 'Track your conversations', category: 'leads', duration: '5 min', isCompleted: false },
];

const categoryInfo = {
  setup: { icon: Zap, color: 'bg-blue-500', label: 'Account Setup' },
  profile: { icon: Star, color: 'bg-purple-500', label: 'Profile' },
  marketing: { icon: Target, color: 'bg-amber-500', label: 'Marketing' },
  leads: { icon: MessageSquare, color: 'bg-green-500', label: 'Lead Management' },
};

export default function LaunchpadPage() {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(
    new Set(launchpadTasks.filter(t => t.isCompleted).map(t => t.id))
  );

  const totalTasks = launchpadTasks.length;
  const completedCount = completedTasks.size;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  const toggleTask = (id: string) => {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const categories = ['setup', 'profile', 'marketing', 'leads'] as const;

  return (
    <DemoLayout currentPage="launchpad">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Launchpad</h1>
              <p className="text-indigo-100">Get started with Get Listings in 30 minutes</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/20 rounded-full p-1 max-w-xl">
            <div className="flex items-center">
              <div 
                className="h-3 bg-white rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <p className="text-sm text-indigo-100 mt-2">
            {completedCount} of {totalTasks} tasks completed ({progressPercent}%)
          </p>
        </div>

        {/* Tasks by Category */}
        <div className="p-6 space-y-6">
          {categories.map(category => {
            const info = categoryInfo[category];
            const tasks = launchpadTasks.filter(t => t.category === category);
            const categoryCompleted = tasks.filter(t => completedTasks.has(t.id)).length;

            return (
              <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                {/* Category Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${info.color} rounded-lg flex items-center justify-center text-white`}>
                      <info.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{info.label}</h3>
                      <p className="text-xs text-gray-500">{categoryCompleted} of {tasks.length} complete</p>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${info.color} rounded-full transition-all`}
                      style={{ width: `${(categoryCompleted / tasks.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Tasks */}
                <div className="divide-y divide-gray-50">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className={`px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                        completedTasks.has(task.id) ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className="flex-shrink-0"
                        >
                          {completedTasks.has(task.id) ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <Circle className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                          )}
                        </button>
                        <div>
                          <p className={`font-medium ${completedTasks.has(task.id) ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                            {task.title}
                          </p>
                          <p className="text-sm text-gray-500">{task.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-gray-400">{task.duration}</span>
                        {!completedTasks.has(task.id) && (
                          <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center space-x-1">
                            <span>Start</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Help Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Need help getting started?</h3>
                <p className="text-sm text-gray-500 mt-1">Watch our tutorial videos or chat with support</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-4 py-2 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 border border-gray-200 flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Watch Tutorials</span>
                </button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat with Support</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
