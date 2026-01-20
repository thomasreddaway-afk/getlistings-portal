import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UsageEvent {
  eventName: string;
  category: string;
  properties?: Record<string, any>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
}

export interface FeatureUsage {
  featureName: string;
  usageCount: number;
  lastUsed: Date;
  averageTimeSpent?: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsageTrackingService {
  private apiUrl = environment.apiUrl;
  private sessionId: string;
  private eventQueue: UsageEvent[] = [];
  private flushInterval = 30000; // Flush every 30 seconds
  private maxQueueSize = 50;

  constructor(private http: HttpClient) {
    this.sessionId = this.generateSessionId();
    this.startAutoFlush();
    this.setupBeforeUnload();
  }

  /**
   * Track a feature usage event
   */
  trackFeature(featureName: string, properties?: Record<string, any>): void {
    this.track(featureName, 'feature_usage', properties);
  }

  /**
   * Track a page view
   */
  trackPageView(pageName: string, properties?: Record<string, any>): void {
    this.track(`page_view_${pageName}`, 'page_view', properties);
  }

  /**
   * Track a button click
   */
  trackClick(buttonName: string, properties?: Record<string, any>): void {
    this.track(`click_${buttonName}`, 'interaction', properties);
  }

  /**
   * Track a search query
   */
  trackSearch(query: string, resultsCount: number): void {
    this.track('search', 'search', {
      query,
      resultsCount,
      queryLength: query.length
    });
  }

  /**
   * Track time spent on a feature/page
   */
  trackTimeSpent(featureName: string, durationMs: number): void {
    this.track(`time_spent_${featureName}`, 'engagement', {
      duration: durationMs,
      durationSeconds: Math.round(durationMs / 1000)
    });
  }

  /**
   * Track an error
   */
  trackError(errorMessage: string, context?: Record<string, any>): void {
    this.track('error', 'error', {
      message: errorMessage,
      ...context
    });
  }

  /**
   * Track conversion events (trial signup, upgrade, etc.)
   */
  trackConversion(conversionType: string, value?: number): void {
    this.track(`conversion_${conversionType}`, 'conversion', {
      type: conversionType,
      value
    });
  }

  /**
   * Track lead interaction
   */
  trackLeadInteraction(action: string, leadId: string): void {
    this.track(`lead_${action}`, 'lead_interaction', {
      leadId,
      action
    });
  }

  /**
   * Generic track method
   */
  private track(eventName: string, category: string, properties?: Record<string, any>): void {
    const event: UsageEvent = {
      eventName,
      category,
      properties: {
        ...properties,
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        language: navigator.language
      },
      timestamp: new Date(),
      sessionId: this.sessionId
    };

    this.eventQueue.push(event);

    // Flush if queue is full
    if (this.eventQueue.length >= this.maxQueueSize) {
      this.flush();
    }

    // Also log to console in development
    if (!environment.production) {
      console.log('[Usage Tracking]', event);
    }
  }

  /**
   * Flush events to server
   */
  private flush(): void {
    if (this.eventQueue.length === 0) {
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    this.http.post(`${this.apiUrl}/analytics/events`, { events }).subscribe({
      next: () => {
        // Events sent successfully
      },
      error: (error) => {
        console.error('Failed to send usage events:', error);
        // Re-add failed events to queue (with limit)
        this.eventQueue.unshift(...events.slice(0, 20));
      }
    });
  }

  /**
   * Start auto-flush interval
   */
  private startAutoFlush(): void {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Flush before page unload
   */
  private setupBeforeUnload(): void {
    window.addEventListener('beforeunload', () => {
      if (this.eventQueue.length > 0) {
        // Use sendBeacon for reliable delivery
        const blob = new Blob(
          [JSON.stringify({ events: this.eventQueue })],
          { type: 'application/json' }
        );
        navigator.sendBeacon(`${this.apiUrl}/analytics/events`, blob);
      }
    });
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get feature usage statistics
   */
  getFeatureUsage(): Observable<FeatureUsage[]> {
    return this.http.get<FeatureUsage[]>(`${this.apiUrl}/analytics/feature-usage`);
  }

  /**
   * Get user engagement metrics
   */
  getEngagementMetrics(dateRange?: { start: Date; end: Date }): Observable<any> {
    return this.http.post(`${this.apiUrl}/analytics/engagement`, { dateRange });
  }
}
