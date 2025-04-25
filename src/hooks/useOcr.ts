import { useState, useCallback } from 'react';
import { ocrService } from '../services/OcrService';
import { ErrorReporting } from '../../lib/services/analytics';
import { useAnalytics } from '../../hooks/use-analytics';

interface OcrResult {
  text: string;
  confidence?: number;
  language?: string;
}

interface UseOcrOptions {
  onSuccess?: (result: OcrResult) => void;
  onError?: (error: Error) => void;
}

export function useOcr(options: UseOcrOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<OcrResult | null>(null);
  const analytics = useAnalytics();

  const processImage = useCallback(async (imageUri: string): Promise<OcrResult> => {
    setIsLoading(true);
    setError(null);
    
    const startTime = Date.now();
    
    try {
      analytics.trackEvent('ocr_scan_started', { imageType: imageUri.split('.').pop() });
      
      const result = await ocrService.processImage(imageUri);
      
      setResult(result);
      
      const processingTime = Date.now() - startTime;
      analytics.trackEvent('ocr_scan_completed', { 
        processingTime,
        textLength: result.text.length,
        confidence: result.confidence,
        language: result.language
      });
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      
      analytics.trackEvent('ocr_scan_failed', { 
        error: error.message,
        processingTime: Date.now() - startTime
      });
      
      ErrorReporting.captureException(error, { 
        context: 'useOcr.processImage',
        imageUri
      });
      
      if (options.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [options, analytics]);

  return {
    processImage,
    isLoading,
    error,
    result,
    reset: useCallback(() => {
      setResult(null);
      setError(null);
    }, [])
  };
}