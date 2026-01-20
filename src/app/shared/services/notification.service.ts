/**
 * In-App Notification Service
 * 
 * Manages real-time in-app notifications, announcements, and messaging.
 * Increases engagement through targeted communication.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'announcement';
  title: string;
  message: string;
  link?: string;
  linkText?: string;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
  priority: 'low' | 'medium' | 'high';
  icon?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'feature' | 'maintenance' | 'update' | 'promotion';
  startDate: Date;
  endDate?: Date;
  targetAudience: 'all' | 'trial' | 'paid' | 'churned';
  dismissed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = environment.apiUrl;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);
  private announcementsSubject = new BehaviorSubject<Announcement[]>([]);

  notifications$ = this.notificationsSubject.asObservable();
  unreadCount$ = this.unreadCountSubject.asObservable();
  announcements$ = this.announcementsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeNotifications();
  }

  /**
   * Initialize and fetch notifications
   */
  private initializeNotifications(): void {
    this.fetchNotifications();
    this.fetchAnnouncements();
    
    // Poll for new notifications every 60 seconds
    setInterval(() => {
      this.fetchNotifications();
    }, 60000);
  }

  /**
   * Fetch notifications from server
   */
  fetchNotifications(): void {
    this.http.get<Notification[]>(`${this.apiUrl}/notifications`).subscribe({
      next: (notifications) => {
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      },
      error: (error) => console.error('Failed to fetch notifications:', error)
    });
  }

  /**
   * Fetch announcements
   */
  fetchAnnouncements(): void {
    this.http.get<Announcement[]>(`${this.apiUrl}/notifications/announcements`).subscribe({
      next: (announcements) => {
        this.announcementsSubject.next(announcements);
      },
      error: (error) => console.error('Failed to fetch announcements:', error)
    });
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/${notificationId}/read`, {});
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/read-all`, {});
  }

  /**
   * Dismiss announcement
   */
  dismissAnnouncement(announcementId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/notifications/announcements/${announcementId}/dismiss`, {});
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/notifications/${notificationId}`);
  }

  /**
   * Show local notification (won't persist)
   */
  showNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: `local_${Date.now()}`,
      createdAt: new Date(),
      read: false
    };

    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([newNotification, ...current]);
    this.updateUnreadCount();
  }

  /**
   * Update unread count
   */
  private updateUnreadCount(): void {
    const notifications = this.notificationsSubject.value;
    const unreadCount = notifications.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Get notifications count
   */
  getUnreadCount(): number {
    return this.unreadCountSubject.value;
  }

  /**
   * Request browser notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  /**
   * Show browser notification
   */
  showBrowserNotification(title: string, options?: NotificationOptions): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/assets/logo.png',
        badge: '/assets/badge.png',
        ...options
      });
    }
  }
}
