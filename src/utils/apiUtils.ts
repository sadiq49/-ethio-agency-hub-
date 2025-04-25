import { fetchWithRetry } from '../../utils/apiUtils';

const processImageWithOCR = async (imageData) => {
  setIsProcessing(true);
  try {
    // First enhance the image if enabled
    const enhancedUri = await enhanceImageQuality(imageData.uri);
    
    // Convert image to base64
    const fileContent = await FileSystem.readAsStringAsync(enhancedUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Call OCR API with retry mechanism
    const apiKey = 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    
    const response = await fetchWithRetry(
      apiUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: { content: fileContent },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          }],
        }),
      },
      {
        maxRetries: 3,
        onRetry: (error, retryCount) => {
          console.log(`Retrying OCR API call (${retryCount}/3)...`);
        },
      }
    );
    
    const data = await response.json();
    // Process OCR results...
    
  } catch (error) {
    console.error('Error processing image:', error);
    Alert.alert('Error', 'Failed to process image: ' + (error.message || 'Unknown error'));
  } finally {
    setIsProcessing(false);
  }
};import NetInfo from '@react-native-community/netinfo';

interface RetryConfig {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  factor?: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (error: any, retryCount: number) => void;
}

/**
 * Executes an async function with exponential backoff retry logic
 * @param fn The async function to execute
 * @param config Retry configuration
 * @returns Promise with the result of the function
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 30000,
    factor = 2,
    retryCondition = (error) => true,
    onRetry = (error, retryCount) => console.log(`Retry attempt ${retryCount}`, error),
  } = config;

  let retries = 0;
  let delay = initialDelay;

  while (true) {
    try {
      // Check network connectivity before making the request
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        throw new Error('No internet connection');
      }

      return await fn();
    } catch (error) {
      retries++;
      
      // If we've reached max retries or the error doesn't meet retry condition, throw
      if (retries > maxRetries || !retryCondition(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff
      delay = Math.min(delay * factor, maxDelay);
      
      // Add some jitter to prevent all clients retrying simultaneously
      const jitter = delay * 0.1 * Math.random();
      const actualDelay = delay + jitter;
      
      // Call the onRetry callback
      onRetry(error, retries);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, actualDelay));
    }
  }
}

/**
 * Makes an API request with retry functionality
 * @param url The URL to fetch
 * @param options Fetch options
 * @param retryConfig Retry configuration
 * @returns Promise with the response
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryConfig: RetryConfig = {}
): Promise<Response> {
  return withRetry(
    () => fetch(url, options),
    {
      ...retryConfig,
      retryCondition: (error) => {
        // Retry on network errors or 5xx server errors
        if (error instanceof TypeError) return true; // Network error
        if (error.status && error.status >= 500) return true; // Server error
        return false;
      },
    }
  );
}