'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Go to homepage
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-6 p-4 bg-muted rounded-md text-left overflow-auto max-w-full">
          <p className="font-mono text-sm">{error.message}</p>
          {error.stack && (
            <pre className="mt-2 text-xs overflow-x-auto">
              {error.stack}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}