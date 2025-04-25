const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' https://analytics.google.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https://storage.googleapis.com;
              font-src 'self';
              connect-src 'self' https://*.supabase.co https://www.google-analytics.com;
              frame-ancestors 'none';
              form-action 'self';
              base-uri 'self';
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ];
  }
};

const sentryWebpackPluginOptions = {
  // Additional options for Sentry
  silent: true, // Suppresses all logs
};

module.exports = withSentryConfig(
  nextConfig,
  sentryWebpackPluginOptions
);
