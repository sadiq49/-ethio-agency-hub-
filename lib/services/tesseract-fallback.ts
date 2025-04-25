import { logger } from '../logger';

// We'll use dynamic import for Tesseract.js to avoid loading it unnecessarily
let tesseractPromise: Promise<any> | null = null;

export class TesseractService {
  private worker: any = null;
  private isInitialized = false;
  
  /**
   * Initialize Tesseract worker
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      if (!tesseractPromise) {
        tesseractPromise = import('tesseract.js');
      }
      
      const Tesseract = await tesseractPromise;
      this.worker = Tesseract.createWorker();
      
      await this.worker.load();
      await this.worker.loadLanguage('eng');
      await this.worker.initialize('eng');
      
      this.isInitialized = true;
      logger.info('Tesseract fallback initialized');
    } catch (error) {
      logger.error('Failed to initialize Tesseract fallback', error as Error);
      throw new Error('Failed to initialize OCR fallback');
    }
  }
  
  /**
   * Recognize text in an image using Tesseract
   */
  async recognizeText(imageData: string): Promise<{ text: string; confidence: number }> {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    try {
      const result = await this.worker.recognize(imageData);
      
      return {
        text: result.data.text,
        confidence: result.data.confidence / 100 // Convert to 0-1 range
      };
    } catch (error) {
      logger.error('Tesseract recognition error', error as Error);
      throw new Error('Failed to process image with fallback OCR');
    }
  }
  
  /**
   * Terminate the worker to free resources
   */
  async terminate(): Promise<void> {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
    }
  }
}

export const tesseractService = new TesseractService();