'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
      <p className="mb-6 text-gray-600">
        We apologize for the inconvenience. Our team has been notified of this issue.
      </p>
      <div className="flex space-x-4">
        <Button onClick={reset} variant="default">
          Try again
        </Button>
        <Button onClick={() => window.location.href = '/'} variant="outline">
          Return to Home
        </Button>
      </div>
    </div>
  );
}