import { logger } from '../logger';

interface CacheEntry {
  text: string;
  confidence?: number;
  timestamp: number;
}

class OcrCache {
  private cache: Map<string, CacheEntry> = new Map();
  private maxEntries: number;
  private ttl: number; // Time to live in milliseconds
  
  constructor(maxEntries = 100, ttlMinutes = 60) {
    this.maxEntries = maxEntries;
    this.ttl = ttlMinutes * 60 * 1000;
    
    // Load cache from localStorage if available
    this.loadFromStorage();
  }
  
  /**
   * Get a cached OCR result by image hash
   */
  get(imageHash: string): { text: string; confidence?: number } | null {
    const entry = this.cache.get(imageHash);
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(imageHash);
      this.saveToStorage();
      return null;
    }
    
    // Update timestamp to keep frequently used items
    entry.timestamp = Date.now();
    this.saveToStorage();
    
    return {
      text: entry.text,
      confidence: entry.confidence
    };
  }
  
  /**
   * Store OCR result in cache
   */
  set(imageHash: string, text: string, confidence?: number): void {
    // If cache is full, remove oldest entry
    if (this.cache.size >= this.maxEntries) {
      const oldestKey = this.getOldestEntry();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }
    
    this.cache.set(imageHash, {
      text,
      confidence,
      timestamp: Date.now()
    });
    
    this.saveToStorage();
  }
  
  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }
  
  /**
   * Get cache statistics
   */
  getStats(): { size: number; oldestEntry: number; newestEntry: number } {
    let oldestTimestamp = Date.now();
    let newestTimestamp = 0;
    
    this.cache.forEach(entry => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
      if (entry.timestamp > newestTimestamp) {
        newestTimestamp = entry.timestamp;
      }
    });
    
    return {
      size: this.cache.size,
      oldestEntry: oldestTimestamp,
      newestEntry: newestTimestamp
    };
  }
  
  /**
   * Find the oldest entry in the cache
   */
  private getOldestEntry(): string | null {
    let oldestKey: string | null = null;
    let oldestTimestamp = Date.now();
    
    this.cache.forEach((entry, key) => {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    });
    
    return oldestKey;
  }
  
  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const serialized = JSON.stringify(Array.from(this.cache.entries()));
      localStorage.setItem('ocr_cache', serialized);
    } catch (error) {
      logger.error('Failed to save OCR cache to localStorage', error as Error);
    }
  }
  
  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const serialized = localStorage.getItem('ocr_cache');
      if (serialized) {
        const entries = JSON.parse(serialized) as [string, CacheEntry][];
        this.cache = new Map(entries);
        
        // Clean expired entries
        const now = Date.now();
        for (const [key, entry] of this.cache.entries()) {
          if (now - entry.timestamp > this.ttl) {
            this.cache.delete(key);
          }
        }
      }
    } catch (error) {
      logger.error('Failed to load OCR cache from localStorage', error as Error);
      this.cache.clear();
    }
  }
  
  /**
   * Generate a hash for an image
   */
  static async generateImageHash(imageData: string): Promise<string> {
    // Simple hash function for demo purposes
    // In production, use a proper hashing algorithm
    if (typeof window === 'undefined') {
      return String(imageData.length);
    }
    
    // Use SubtleCrypto if available
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(imageData);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      // Fallback to simple hash
      let hash = 0;
      for (let i = 0; i < imageData.length; i++) {
        const char = imageData.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return String(Math.abs(hash));
    }
  }
}

export const ocrCache = new OcrCache();