import { useState, useCallback } from 'react';
import { errorReporting } from '../lib/error-reporting';
import { useNotifications } from '@/contexts/notification-context';

interface ErrorHandlerOptions {
  context: string;
  showNotification?: boolean;
}

export function useErrorHandler(options: ErrorHandlerOptions) {
  const [error, setError] = useState<Error | null>(null);
  const { addNotification } = useNotifications();

  const handleError = useCallback((err: unknown, actionDescription?: string) => {
    const error = err instanceof Error ? err : new Error(String(err));
    
    // Set local error state
    setError(error);
    
    // Log to console in development
    console.error(`Error in ${options.context}:`, error);
    
    // Report to error tracking service
    errorReporting.captureError(error, { 
      componentStack: options.context,
      actionDescription
    });
    
    // Show notification if enabled
    if (options.showNotification) {
      addNotification({
        title: 'Error',
        message: error.message || 'An unexpected error occurred',
        type: 'error',
      });
    }
    
    return error;
  }, [options.context, options.showNotification, addNotification]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError
  };
}