import { useState, useCallback } from 'react';
import { ErrorReporting } from '../lib/services/analytics';

// Define specific error types for better handling
export class OcrError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'OcrError';
  }
}

export class ApiKeyError extends OcrError {
  constructor() {
    super('API key is missing or invalid', 'API_KEY_ERROR');
  }
}

export class ImageProcessingError extends OcrError {
  constructor(message: string) {
    super(message, 'IMAGE_PROCESSING_ERROR');
  }
}

export class NetworkError extends OcrError {
  constructor() {
    super('Network error occurred while processing the image', 'NETWORK_ERROR');
  }
}

export class QuotaExceededError extends OcrError {
  constructor() {
    super('API quota has been exceeded', 'QUOTA_EXCEEDED');
  }
}

interface OcrResult {
  text: string;
  confidence?: number;
  usedFallback?: boolean;
}

interface UseOcrOptions {
  onSuccess?: (result: OcrResult) => void;
  onError?: (error: Error) => void;
  retryCount?: number;
  language?: string;
  documentType?: string;
}

export function useOcr(options?: UseOcrOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<OcrResult | null>(null);
  
  const retryCount = options?.retryCount || 2;

  const extractText = useCallback(async (imageFile: File, currentRetry = 0): Promise<OcrResult> => {
    setIsLoading(true);
    setError(null);
    
    const startTime = performance.now();
    
    try {
      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        throw new ImageProcessingError('File is not an image');
      }
      
      // Validate file size (10MB max)
      if (imageFile.size > 10 * 1024 * 1024) {
        throw new ImageProcessingError('Image is too large (max 10MB)');
      }
      
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });
      
      // Extract the base64 data part (remove the data:image/jpeg;base64, prefix)
      const base64Data = base64Image.split(',')[1];
      
      // Prepare request to Google Cloud Vision API
      const apiEndpoint = '/api/ocr';
      
      const requestData = {
        image: base64Data,
        language: options?.language || 'auto',
        documentType: options?.documentType || 'general'
      };
      
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          // Handle specific error types
          if (response.status === 401 || response.status === 403) {
            throw new ApiKeyError();
          } else if (response.status === 429) {
            throw new QuotaExceededError();
          } else {
            throw new OcrError(
              errorData.message || `API error: ${response.status}`,
              errorData.code || 'API_ERROR'
            );
          }
        }
        
        const data = await response.json();
        
        const result: OcrResult = {
          text: data.text || '',
          confidence: data.confidence,
        };
        
        setResult(result);
        options?.onSuccess?.(result);
        
        const processingTime = performance.now() - startTime;
        console.log(`OCR processing completed in ${processingTime.toFixed(2)}ms`);
        
        return result;
      } catch (error) {
        // Handle network errors and retry
        if (error instanceof NetworkError && currentRetry < retryCount) {
          console.log(`Network error, retrying (${currentRetry + 1}/${retryCount})...`);
          return extractText(imageFile, currentRetry + 1);
        }
        
        // Report error to analytics
        ErrorReporting.captureException(error instanceof Error ? error : new Error(String(error)), {
          component: 'useOcr',
          imageType: imageFile.type,
          imageSize: imageFile.size
        });
        
        throw error;
      }
    } catch (error) {
      const finalError = error instanceof Error ? error : new Error(String(error));
      setError(finalError);
      options?.onError?.(finalError);
      throw finalError;
    } finally {
      setIsLoading(false);
    }
  }, [options, retryCount]);
  
  return {
    extractText,
    isLoading,
    error,
    result
  };
}