/**
 * Production Configuration
 * 
 * This file contains settings optimized for production deployment.
 */

module.exports = {
  // Environment settings
  env: {
    NODE_ENV: 'production',
    NEXT_PUBLIC_ENABLE_CRASH_REPORTING: true,
    NEXT_PUBLIC_API_URL: 'https://api.project-bolt.com',
  },
  
  // Build optimization
  build: {
    // Enable production source maps for better error tracking
    productionSourceMap: true,
    
    // Optimize bundle size
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 0,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              // Get the name of the npm package
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              
              // Return a readable name for the package
              return `npm.${packageName.replace('@', '')}`;
            },
          },
        },
      },
    },
  },
  
  // Performance optimizations
  performance: {
    // Enable gzip compression
    compression: true,
    
    // Cache control headers
    cacheControl: {
      // Cache static assets for 1 year
      staticAssets: 'public, max-age=31536000, immutable',
      
      // Cache API responses for 5 minutes
      apiResponses: 'public, max-age=300, stale-while-revalidate=60',
    },
  },
  
  // Security settings
  security: {
    // Enable Content Security Policy
    contentSecurityPolicy: {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net'],
      'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      'img-src': ["'self'", 'data:', 'https://res.cloudinary.com'],
      'font-src': ["'self'", 'https://fonts.gstatic.com'],
      'connect-src': ["'self'", 'https://api.project-bolt.com'],
    },
    
    // Enable HTTP Strict Transport Security
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    },
    
    // Prevent XSS attacks
    xssProtection: true,
    
    // Prevent clickjacking
    frameOptions: 'DENY',
  },
  
  // Monitoring and analytics
  monitoring: {
    // Enable error tracking
    errorTracking: true,
    
    // Enable performance monitoring
    performanceMonitoring: true,
    
    // Sample rate for performance monitoring (0-1)
    performanceSampleRate: 0.1,
  },
};