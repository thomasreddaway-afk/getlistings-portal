'use client';

/**
 * Browser Push Notification Service
 * 
 * Handles:
 * - Service worker registration
 * - Push subscription management
 * - Permission requests
 * - Notification display
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  url?: string;
  tag?: string;
  actions?: Array<{ action: string; title: string }>;
}

class PushNotificationService {
  private static instance: PushNotificationService;
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(): PushNotificationService {
    if (!PushNotificationService.instance) {
      PushNotificationService.instance = new PushNotificationService();
    }
    return PushNotificationService.instance;
  }

  /**
   * Initialize the push notification service
   */
  async init(): Promise<boolean> {
    if (this.initialized) return true;
    if (typeof window === 'undefined') return false;
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('[Push] Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('[Push] Service worker registered:', this.registration.scope);

      // Wait for the service worker to be ready
      await navigator.serviceWorker.ready;
      console.log('[Push] Service worker ready');

      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();
      if (this.subscription) {
        console.log('[Push] Existing subscription found');
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('[Push] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission | 'unsupported' {
    if (!this.isSupported()) return 'unsupported';
    return Notification.permission;
  }

  /**
   * Check if user is subscribed to push notifications
   */
  isSubscribed(): boolean {
    return this.subscription !== null;
  }

  /**
   * Request permission and subscribe to push notifications
   */
  async subscribe(): Promise<PushSubscription | null> {
    if (!this.isSupported()) {
      throw new Error('Push notifications not supported');
    }

    if (!this.registration) {
      await this.init();
    }

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('[Push] Permission denied');
        return null;
      }

      // Subscribe to push
      if (!this.registration) {
        throw new Error('Service worker not registered');
      }

      this.subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      console.log('[Push] Subscription created:', this.subscription.endpoint);

      // Send subscription to server
      await this.sendSubscriptionToServer(this.subscription);

      return this.subscription;
    } catch (error) {
      console.error('[Push] Subscription failed:', error);
      throw error;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) return true;

    try {
      const result = await this.subscription.unsubscribe();
      if (result) {
        // Remove subscription from server
        await this.removeSubscriptionFromServer(this.subscription);
        this.subscription = null;
        console.log('[Push] Unsubscribed successfully');
      }
      return result;
    } catch (error) {
      console.error('[Push] Unsubscribe failed:', error);
      return false;
    }
  }

  /**
   * Show a local notification (not from push)
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (Notification.permission !== 'granted') {
      console.log('[Push] No permission to show notification');
      return;
    }

    if (this.registration) {
      await this.registration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
        image: payload.image,
        tag: payload.tag,
        data: { url: payload.url },
        actions: payload.actions,
      });
    } else {
      // Fallback to basic notification
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icons/icon-192x192.png',
      });
    }
  }

  /**
   * Send subscription to backend server
   */
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
        }),
      });
      console.log('[Push] Subscription sent to server');
    } catch (error) {
      console.error('[Push] Failed to send subscription to server:', error);
    }
  }

  /**
   * Remove subscription from backend server
   */
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
        }),
      });
      console.log('[Push] Subscription removed from server');
    } catch (error) {
      console.error('[Push] Failed to remove subscription from server:', error);
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Export singleton instance
export const pushNotifications = PushNotificationService.getInstance();

// React hook for push notifications
import { useState, useEffect, useCallback } from 'react';

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const supported = pushNotifications.isSupported();
      setIsSupported(supported);
      
      if (supported) {
        await pushNotifications.init();
        setPermission(pushNotifications.getPermissionStatus());
        setIsSubscribed(pushNotifications.isSubscribed());
      }
      
      setIsLoading(false);
    }
    init();
  }, []);

  const subscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const subscription = await pushNotifications.subscribe();
      setIsSubscribed(subscription !== null);
      setPermission(pushNotifications.getPermissionStatus());
      return subscription;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await pushNotifications.unsubscribe();
      if (result) setIsSubscribed(false);
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const showNotification = useCallback((payload: NotificationPayload) => {
    return pushNotifications.showNotification(payload);
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    showNotification,
  };
}
