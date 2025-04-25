import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { ErrorReporting } from '../../lib/services/analytics';
import { API_CONFIG } from '../config';

interface OcrResult {
  text: string;
  confidence?: number;
  language?: string;
}

class OcrService {
  private apiKey: string;
  private endpoint: string;
  private isInitialized: boolean = false;

  constructor() {
    this.apiKey = API_CONFIG.GOOGLE_CLOUD_API_KEY;
    this.endpoint = 'https://vision.googleapis.com/v1/images:annotate';
    this.isInitialized = !!this.apiKey;
    
    if (!this.isInitialized) {
      console.warn('OCR Service not initialized: Missing API key');
    }
  }

  /**
   * Process an image file with OCR
   * @param imageUri URI of the image to process
   * @returns Extracted text and metadata
   */
  async processImage(imageUri: string): Promise<OcrResult> {
    try {
      if (!this.isInitialized) {
        throw new Error('OCR Service not initialized');
      }

      // Convert image to base64
      const base64Image = await this.getBase64FromUri(imageUri);
      
      // Prepare request to Google Cloud Vision API
      const requestBody = {
        requests: [
          {
            image: {
              content: base64Image
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ],
            imageContext: {
              languageHints: ['en', 'es', 'fr', 'de'] // Add languages you want to support
            }
          }
        ]
      };

      // Call the API
      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OCR API error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      // Extract text from response
      const textAnnotations = data.responses[0]?.textAnnotations;
      
      if (!textAnnotations || textAnnotations.length === 0) {
        return { text: '', confidence: 0 };
      }
      
      // The first annotation contains the entire text
      const fullTextAnnotation = textAnnotations[0];
      
      return {
        text: fullTextAnnotation.description || '',
        confidence: this.calculateConfidence(data.responses[0]),
        language: fullTextAnnotation.locale
      };
    } catch (error) {
      ErrorReporting.captureException(error as Error, { 
        context: 'OcrService.processImage',
        imageUri
      });
      throw error;
    }
  }

  /**
   * Calculate confidence score from API response
   */
  private calculateConfidence(response: any): number {
    if (!response || !response.fullTextAnnotation) {
      return 0;
    }
    
    // Calculate average confidence from pages
    const pages = response.fullTextAnnotation.pages || [];
    if (pages.length === 0) return 0;
    
    let totalConfidence = 0;
    let totalBlocks = 0;
    
    pages.forEach((page: any) => {
      const blocks = page.blocks || [];
      blocks.forEach((block: any) => {
        totalConfidence += block.confidence || 0;
        totalBlocks++;
      });
    });
    
    return totalBlocks > 0 ? totalConfidence / totalBlocks : 0;
  }

  /**
   * Convert image URI to base64
   */
  private async getBase64FromUri(uri: string): Promise<string> {
    try {
      // For local files
      if (uri.startsWith('file://') || Platform.OS === 'android') {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        return base64;
      }
      
      // For remote files
      const response = await fetch(uri);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          // Remove data URL prefix
          const base64 = base64String.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      ErrorReporting.captureException(error as Error, { 
        context: 'OcrService.getBase64FromUri',
        uri
      });
      throw new Error(`Failed to convert image to base64: ${(error as Error).message}`);
    }
  }
}

export const ocrService = new OcrService();