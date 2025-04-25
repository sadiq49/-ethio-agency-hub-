import { env } from '../env';
import { initializeGoogleAnalytics } from './providers/google-analytics';

export type EventName = 
  | 'page_view'
  | 'button_click'
  | 'form_submit'
  | 'error'
  | 'login'
  | 'logout'
  | 'signup'
  | 'document_upload'
  | 'document_process'
  | 'performance_metric';

export interface AnalyticsEvent {
  name: EventName;
  properties?: Record<string, any>;
  timestamp?: number;
}

class Analytics {
  private analyticsInstance: any;
  private isInitialized = false;
  private enabled: boolean;

  constructor() {
    this.enabled = env.NEXT_PUBLIC_ENABLE_ANALYTICS;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    if (!this.enabled) {
      console.info('Analytics disabled');
      return;
    }

    try {
      this.analyticsInstance = initializeGoogleAnalytics();
      this.isInitialized = true;
      console.info('Analytics initialized');
    } catch (error) {
      console.error('Failed to initialize analytics', error);
    }
  }

  trackEvent(name: EventName, properties?: Record<string, any>): void {
    if (!this.enabled || !this.isInitialized) return;
    
    this.analyticsInstance.track(name, {
      ...properties,
      timestamp: Date.now(),
    });
  }

  setUserProperties(userId: string, properties: Record<string, any>): void {
    if (!this.enabled || !this.isInitialized) return;
    
    this.analyticsInstance.identify(userId, properties);
  }

  pageView(path: string, properties?: Record<string, any>): void {
    if (!this.enabled || !this.isInitialized) return;
    
    this.analyticsInstance.page({
      url: path,
      ...properties
    });
  }
}

export const analytics = new Analytics();