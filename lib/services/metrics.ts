import { logger } from '../logger';

interface MetricEvent {
  name: string;
  value?: number;
  tags?: Record<string, string>;
  timestamp: number;
}

class MetricsService {
  private events: MetricEvent[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private flushIntervalMs = 60000; // 1 minute
  private maxQueueSize = 100;
  private endpoint = '/api/metrics';
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.startFlushInterval();
      
      // Flush metrics before page unload
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
  }
  
  /**
   * Track a metric event
   */
  track(name: string, value?: number, tags?: Record<string, string>): void {
    this.events.push({
      name,
      value,
      tags,
      timestamp: Date.now()
    });
    
    // Flush if queue is full
    if (this.events.length >= this.maxQueueSize) {
      this.flush();
    }
  }
  
  /**
   * Start the automatic flush interval
   */
  private startFlushInterval(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    
    this.flushInterval = setInterval(() => {
      this.flush();
    }, this.flushIntervalMs);
  }
  
  /**
   * Flush metrics to the server
   */
  async flush(): Promise<void> {
    if (this.events.length === 0) return;
    
    const eventsToSend = [...this.events];
    this.events = [];
    
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ events: eventsToSend }),
        // Use keepalive to ensure the request completes even if the page is unloading
        keepalive: true
      });
    } catch (error) {
      logger.error('Failed to send metrics', error as Error);
      // Put events back in the queue
      this.events = [...eventsToSend, ...this.events].slice(0, this.maxQueueSize);
    }
  }
  
  /**
   * Stop the flush interval
   */
  stop(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }
}

export const metrics = new MetricsService();

// OCR-specific metrics
export const ocrMetrics = {
  trackApiCall: (success: boolean, processingTimeMs: number, imageType: string) => {
    metrics.track('ocr.api_call', 1, {
      success: String(success),
      imageType
    });
    
    metrics.track('ocr.processing_time', processingTimeMs, {
      success: String(success),
      imageType
    });
  },
  
  trackCacheHit: () => {
    metrics.track('ocr.cache_hit', 1);
  },
  
  trackCacheMiss: () => {
    metrics.track('ocr.cache_miss', 1);
  },
  
  trackError: (errorCode: string) => {
    metrics.track('ocr.error', 1, {
      errorCode
    });
  }
};

// Add performance tracking for animations and loading states
export const uiMetrics = {
  trackPageLoad: (pageName: string, loadTimeMs: number) => {
    metrics.track('ui.page_load', loadTimeMs, {
      pageName
    });
  },
  
  trackInteraction: (componentName: string, interactionType: string, durationMs?: number) => {
    metrics.track('ui.interaction', durationMs, {
      componentName,
      interactionType
    });
  },
  
  trackFormSubmission: (formName: string, success: boolean, durationMs: number) => {
    metrics.track('ui.form_submission', durationMs, {
      formName,
      success: String(success)
    });
  },
  
  trackAnimationPerformance: (animationName: string, framesPerSecond: number) => {
    metrics.track('ui.animation_performance', framesPerSecond, {
      animationName
    });
  }
};