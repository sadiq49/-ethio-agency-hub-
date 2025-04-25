import { env } from '../env';
import { logger } from '../logger';

// Define types for OCR responses
export interface TextDetectionResponse {
  text: string;
  confidence: number;
  boundingBox?: {
    vertices: Array<{
      x: number;
      y: number;
    }>;
  };
}

export interface VisionApiError {
  code: number;
  message: string;
  status: string;
}

class VisionApiService {
  private readonly apiKey: string;
  private readonly apiEndpoint = 'https://vision.googleapis.com/v1/images:annotate';

  constructor() {
    this.apiKey = env.GOOGLE_CLOUD_VISION_API_KEY;
  }

  /**
   * Detects text in an image using Google Cloud Vision API
   * @param imageBase64 Base64 encoded image data (without the data:image prefix)
   * @returns Promise with detected text information
   */
  async detectText(imageBase64: string): Promise<TextDetectionResponse[]> {
    try {
      if (!this.apiKey) {
        throw new Error('Google Cloud Vision API key is not configured');
      }

      const requestBody = {
        requests: [
          {
            image: {
              content: imageBase64
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 50
              }
            ]
          }
        ]
      };

      const response = await fetch(`${this.apiEndpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        const error = data.error || { message: 'Unknown error occurred' };
        logger.error('Vision API error', new Error(error.message), {
          context: {
            statusCode: response.status,
            errorDetails: error
          }
        });
        throw new Error(`Vision API error: ${error.message}`);
      }

      // Process and transform the response
      if (data.responses && data.responses[0] && data.responses[0].textAnnotations) {
        return data.responses[0].textAnnotations.map((annotation: any) => ({
          text: annotation.description,
          confidence: annotation.confidence || 0.0,
          boundingBox: annotation.boundingPoly
        }));
      }

      return [];
    } catch (error) {
      logger.error('Error detecting text with Vision API', error as Error);
      throw error;
    }
  }

  /**
   * Extracts text from an image file
   * @param file Image file to process
   * @returns Promise with the extracted text
   */
  async extractTextFromFile(file: File): Promise<string> {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (event) => {
          try {
            if (!event.target || typeof event.target.result !== 'string') {
              throw new Error('Failed to read file');
            }
            
            // Extract base64 data (remove the data:image/jpeg;base64, prefix)
            const base64Data = event.target.result.split(',')[1];
            
            const textAnnotations = await this.detectText(base64Data);
            
            // The first annotation typically contains the entire text
            const fullText = textAnnotations.length > 0 ? textAnnotations[0].text : '';
            resolve(fullText);
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Error reading file'));
        };
        
        reader.readAsDataURL(file);
      });
    } catch (error) {
      logger.error('Error extracting text from file', error as Error);
      throw error;
    }
  }
}

export const visionApi = new VisionApiService();