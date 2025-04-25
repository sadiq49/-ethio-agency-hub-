"use client";

import React, { Component, ErrorInfo, ReactNode, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { errorReporting } from '@/lib/error-reporting';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Report the error to our error reporting service
    errorReporting.captureError(error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-red-200 bg-red-50 text-red-900 my-4">
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="mb-4 text-sm text-red-700">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          {process.env.NODE_ENV !== 'production' && this.state.error && (
            <details className="mb-4 p-2 bg-white rounded border border-red-200 w-full">
              <summary className="cursor-pointer font-medium">Error Details</summary>
              <pre className="mt-2 text-xs overflow-auto p-2 bg-gray-100 rounded">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
          <Button 
            onClick={this.resetErrorBoundary}
            variant="destructive"
            className="mt-2"
          >
            Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Default export for app/error.tsx
export default function ErrorBoundaryPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report the error to our error reporting service
    errorReporting.captureError(error);
  }, [error]);
}