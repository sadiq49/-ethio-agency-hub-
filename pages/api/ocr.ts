import type { NextApiRequest, NextApiResponse } from 'next';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

// Initialize the Vision client
let visionClient: ImageAnnotatorClient;

try {
  // If running in Google Cloud, the client will automatically use the
  // service account credentials from the environment
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    visionClient = new ImageAnnotatorClient();
  } else {
    // For local development or other environments, use explicit credentials
    visionClient = new ImageAnnotatorClient({
      credentials: {
        client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
  }
} catch (error) {
  console.error('Failed to initialize Vision API client:', error);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify authentication
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Check if Vision client is initialized
    if (!visionClient) {
      throw new Error('Vision API client not initialized');
    }

    const { image, language, documentType } = req.body;

    if (!image) {
      return res.status(400).json({ message: 'Image data is required' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(image, 'base64');

    // Configure request based on document type
    const features = [{ type: 'TEXT_DETECTION' }];
    
    // Add language hints if specified
    const imageContext: any = {};
    if (language && language !== 'auto') {
      imageContext.languageHints = [language];
    }

    // Process specific document types
    if (documentType === 'receipt' || documentType === 'invoice') {
      // Add DOCUMENT_TEXT_DETECTION for better results with structured documents
      features.push({ type: 'DOCUMENT_TEXT_DETECTION' });
    }

    // Call the Vision API
    const [result] = await visionClient.annotateImage({
      image: { content: buffer },
      features,
      imageContext
    });

    // Extract the text and confidence
    const textAnnotations = result.textAnnotations || [];
    const fullTextAnnotation = result.fullTextAnnotation;
    
    let text = '';
    let confidence = 0;
    
    if (textAnnotations.length > 0) {
      // The first annotation contains the entire text
      text = textAnnotations[0].description || '';
      
      // Calculate average confidence from full text annotation
      if (fullTextAnnotation && fullTextAnnotation.pages) {
        let totalConfidence = 0;
        let blockCount = 0;
        
        fullTextAnnotation.pages.forEach(page => {
          page.blocks?.forEach(block => {
            if (block.confidence) {
              totalConfidence += block.confidence;
              blockCount++;
            }
          });
        });
        
        confidence = blockCount > 0 ? totalConfidence / blockCount : 0;
      }
    }

    // Return the extracted text and confidence
    return res.status(200).json({
      text,
      confidence,
      documentType,
      language
    });
  } catch (error) {
    console.error('OCR processing error:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        return res.status(429).json({ 
          message: 'API quota exceeded', 
          code: 'QUOTA_EXCEEDED' 
        });
      }
      
      if (error.message.includes('permission') || error.message.includes('credentials')) {
        return res.status(403).json({ 
          message: 'API authentication error', 
          code: 'AUTH_ERROR' 
        });
      }
    }
    
    return res.status(500).json({ 
      message: 'Failed to process image', 
      code: 'PROCESSING_ERROR',
      details: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
    });
  }
}