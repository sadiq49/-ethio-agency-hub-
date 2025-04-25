/**
 * Production environment configuration
 */
export const productionConfig = {
  // API endpoints
  API_URL: 'https://api.projectbolt.com',
  
  // Feature flags
  FEATURES: {
    ENABLE_PUSH_NOTIFICATIONS: true,
    ENABLE_OFFLINE_MODE: true,
    ENABLE_ANALYTICS: true,
    ENABLE_CRASH_REPORTING: true,
  },
  
  // Timeouts (in milliseconds)
  TIMEOUTS: {
    API_REQUEST: 30000,
    SYNC_INTERVAL: 300000, // 5 minutes
  },
  
  // Cache settings
  CACHE: {
    MAX_AGE: 86400000, // 24 hours
    PURGE_INTERVAL: 604800000, // 7 days
  },
  
  // Analytics
  ANALYTICS: {
    SAMPLE_RATE: 1.0, // 100% of events
    SESSION_TIMEOUT: 1800000, // 30 minutes
  },
  
  // Error reporting
  ERROR_REPORTING: {
    SAMPLE_RATE: 1.0, // 100% of errors
    MAX_BREADCRUMBS: 100,
  },
  
  // OCR settings
  OCR: {
    MAX_IMAGE_SIZE: 10485760, // 10MB
    SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png', 'heic', 'heif'],
    CACHE_RESULTS: true,
  },
  
  // Security
  SECURITY: {
    TOKEN_REFRESH_THRESHOLD: 300, // 5 minutes before expiry
    BIOMETRIC_TIMEOUT: 300000, // 5 minutes
  },
};