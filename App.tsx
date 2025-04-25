import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/hooks/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { initializeOfflineManager } from './src/services/OfflineManager';
import { registerForPushNotifications } from './src/services/NotificationService';
import SplashScreen from 'react-native-splash-screen';
import { OfflineIndicator } from './src/components/OfflineIndicator';
import { setupOfflineSync } from './src/services/OfflineManager';
import { Analytics, ErrorReporting } from './lib/services/analytics';
import { useAuth } from './contexts/auth-context';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  const { user } = useAuth();

  useEffect(() => {
    // Hide splash screen after app is ready
    SplashScreen.hide();
    
    // Initialize analytics with user info if available
    if (user) {
      Analytics.setUserId(user.id);
      ErrorReporting.setUser({
        id: user.id,
        email: user.email || undefined,
        username: user.user_metadata?.name || undefined,
      });
    }
    
    // Track app open event
    Analytics.trackEvent('app_open');
    
    // Initialize offline sync
    setupOfflineSync();
    
    // Register for push notifications
    registerForPushNotifications();
  }, [user]);

  // Set up error boundary handler
  const handleError = (error: Error, info: { componentStack: string }) => {
    ErrorReporting.captureException(error, { componentStack: info.componentStack });
  };

  return (
    <ErrorBoundary onError={handleError}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <AuthProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </AuthProvider>
        </PaperProvider>
      </SafeAreaProvider>
      <OfflineIndicator />
    </ErrorBoundary>
  );
}