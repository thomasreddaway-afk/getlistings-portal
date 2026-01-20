'use client';

import { DemoLayout } from '@/components/layout';
import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Save,
  Camera
} from 'lucide-react';

type SettingsTab = 'profile' | 'notifications' | 'billing' | 'security';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@realestate.com',
    phone: '0412 345 678',
    agency: 'Smith & Associates',
    suburb: 'Mosman',
    bio: 'Experienced real estate agent specializing in luxury properties in the Lower North Shore area.',
  });

  const [notifications, setNotifications] = useState({
    newLeads: true,
    leadUpdates: true,
    appraisalRequests: true,
    dailyDigest: false,
    weeklyReport: true,
    marketUpdates: true,
    smsAlerts: true,
    pushNotifications: true,
  });

  const tabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: User },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: Bell },
    { id: 'billing' as SettingsTab, label: 'Billing', icon: CreditCard },
    { id: 'security' as SettingsTab, label: 'Security', icon: Shield },
  ];

  return (
    <DemoLayout currentPage="settings">
      <div className="flex-1 overflow-auto bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your account preferences</p>
        </div>

        <div className="p-4">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-56 flex-shrink-0">
              <nav className="bg-white rounded-xl border border-gray-200 p-2 space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-50 text-red-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  {/* Avatar */}
                  <div className="flex items-center space-x-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-2xl font-bold">
                        JS
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                        <Camera className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Profile Photo</p>
                      <p className="text-sm text-gray-500">JPG, PNG or GIF. Max 2MB</p>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Agency</label>
                      <input
                        type="text"
                        value={formData.agency}
                        onChange={(e) => setFormData({...formData, agency: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Suburb</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.suburb}
                          onChange={(e) => setFormData({...formData, suburb: e.target.value})}
                          className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Lead Notifications</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'newLeads', label: 'New Leads', desc: 'Get notified when new leads are assigned' },
                          { key: 'leadUpdates', label: 'Lead Updates', desc: 'Updates on lead activity and status changes' },
                          { key: 'appraisalRequests', label: 'Appraisal Requests', desc: 'Immediate alerts for valuation requests' },
                        ].map(item => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                              className={`relative w-11 h-6 rounded-full transition-colors ${
                                notifications[item.key as keyof typeof notifications] ? 'bg-red-500' : 'bg-gray-200'
                              }`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                notifications[item.key as keyof typeof notifications] ? 'left-6' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-4">Reports & Digests</h3>
                      <div className="space-y-4">
                        {[
                          { key: 'dailyDigest', label: 'Daily Digest', desc: 'Daily summary of your leads and activities' },
                          { key: 'weeklyReport', label: 'Weekly Report', desc: 'Weekly performance report' },
                          { key: 'marketUpdates', label: 'Market Updates', desc: 'Weekly market insights for your area' },
                        ].map(item => (
                          <div key={item.key} className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-700">{item.label}</p>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                            <button
                              onClick={() => setNotifications({...notifications, [item.key]: !notifications[item.key as keyof typeof notifications]})}
                              className={`relative w-11 h-6 rounded-full transition-colors ${
                                notifications[item.key as keyof typeof notifications] ? 'bg-red-500' : 'bg-gray-200'
                              }`}
                            >
                              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                                notifications[item.key as keyof typeof notifications] ? 'left-6' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Billing & Subscription</h2>
                  
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white mb-6">
                    <p className="text-sm opacity-90 mb-1">Current Plan</p>
                    <p className="text-2xl font-bold mb-2">Professional</p>
                    <p className="text-sm opacity-90">$99/month • Renews Jan 28, 2024</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <button className="text-sm text-red-600 font-medium hover:text-red-700">Update</button>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      View Invoices
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Change Plan
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Change Password</p>
                        <p className="text-sm text-gray-500">Update your password regularly</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        Update
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600">
                        Enable
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Active Sessions</p>
                        <p className="text-sm text-gray-500">Manage your logged-in devices</p>
                      </div>
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                        View All
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DemoLayout>
  );
}
