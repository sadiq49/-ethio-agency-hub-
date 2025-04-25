import Analytics from 'analytics';
import googleAnalyticsPlugin from '@analytics/google-analytics';
import { env } from '../../env';

export const initializeGoogleAnalytics = () => {
  return Analytics({
    app: 'project-bolt',
    plugins: [
      googleAnalyticsPlugin({
        measurementId: env.NEXT_PUBLIC_GA_MEASUREMENT_ID
      })
    ]
  });
};