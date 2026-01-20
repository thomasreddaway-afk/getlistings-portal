'use client';

import { useState } from 'react';
import { usePushNotifications } from '@/lib/push-notifications';

export default function NotificationSettings() {
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    showNotification,
  } = usePushNotifications();

  const [testSent, setTestSent] = useState(false);

  async function handleToggle() {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  }

  async function handleTestNotification() {
    await showNotification({
      title: 'Test Notification',
      body: 'Push notifications are working! You\'ll receive alerts about new leads and updates.',
      url: '/settings',
    });
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-yellow-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="font-medium text-yellow-800">Push Notifications Not Supported</h4>
            <p className="text-sm text-yellow-700 mt-1">
              Your browser doesn't support push notifications. Try using Chrome, Firefox, or Safari on desktop.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (permission === 'denied') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          <div>
            <h4 className="font-medium text-red-800">Notifications Blocked</h4>
            <p className="text-sm text-red-700 mt-1">
              You've blocked notifications for this site. To enable them, click the lock icon in your browser's address bar and allow notifications.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Push Notifications</h3>
              <p className="text-sm text-gray-500">
                Get instant alerts for new leads, messages, and important updates
              </p>
            </div>
          </div>
          
          <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              isSubscribed ? 'bg-purple-600' : 'bg-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                isSubscribed ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {isSubscribed && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Notification Preferences</h4>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏠</span>
                  <span className="text-sm text-gray-700">New Lead Alerts</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💬</span>
                  <span className="text-sm text-gray-700">New Messages</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg">📊</span>
                  <span className="text-sm text-gray-700">Weekly Summary</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              </label>
              
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🎉</span>
                  <span className="text-sm text-gray-700">Tips & Updates</span>
                </div>
                <input type="checkbox" className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" />
              </label>
            </div>
            
            <div className="mt-6">
              <button
                onClick={handleTestNotification}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {testSent ? 'Notification Sent!' : 'Send Test Notification'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {!isSubscribed && permission === 'default' && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Enable notifications to stay updated on new leads in your area. You can customize your preferences after enabling.
          </p>
        </div>
      )}
    </div>
  );
}
