import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OcrScanner } from '../../components/OcrScanner';
import { useOcr } from '../../hooks/use-ocr';

// Mock the useOcr hook
jest.mock('../../hooks/use-ocr');
jest.mock('../../lib/services/metrics', () => ({
  uiMetrics: {
    trackInteraction: jest.fn()
  }
}));

describe('OcrScanner Component', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default mock implementation
    (useOcr as jest.Mock).mockReturnValue({
      extractText: jest.fn().mockResolvedValue({ text: 'Mocked OCR result', confidence: 0.9 }),
      isLoading: false,
      error: null,
      result: null
    });
  });

  it('renders correctly', () => {
    render(<OcrScanner />);
    
    expect(screen.getByText('Scan Document')).toBeInTheDocument();
    expect(screen.getByLabelText('Document Type')).toBeInTheDocument();
    expect(screen.getByLabelText('Language')).toBeInTheDocument();
  });

  it('handles file selection and processes OCR', async () => {
    const mockExtractText = jest.fn().mockResolvedValue({ 
      text: 'Test OCR Result', 
      confidence: 0.95 
    });
    
    (useOcr as jest.Mock).mockReturnValue({
      extractText: mockExtractText,
      isLoading: false,
      error: null,
      result: { text: 'Test OCR Result', confidence: 0.95 }
    });
    
    const onScanComplete = jest.fn();
    render(<OcrScanner onScanComplete={onScanComplete} />);
    
    // Create a file and trigger the file input change
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/file/i);
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(mockExtractText).toHaveBeenCalledWith(file);
    });
    
    // Check if result is displayed
    expect(screen.getByText('Test OCR Result')).toBeInTheDocument();
    expect(screen.getByText('Confidence: 95.00%')).toBeInTheDocument();
    expect(onScanComplete).toHaveBeenCalledWith('Test OCR Result');
  });

  it('shows loading state during OCR processing', async () => {
    let resolveExtract: (value: any) => void;
    const extractPromise = new Promise(resolve => {
      resolveExtract = resolve;
    });
    
    const mockExtractText = jest.fn().mockReturnValue(extractPromise);
    
    (useOcr as jest.Mock).mockReturnValue({
      extractText: mockExtractText,
      isLoading: true,
      error: null,
      result: null
    });
    
    render(<OcrScanner />);
    
    // Trigger scan
    fireEvent.click(screen.getByText('Scan Document'));
    
    // Check loading state
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    
    // Complete the OCR process
    resolveExtract({ text: 'Completed Result', confidence: 0.8 });
  });

  it('displays errors when OCR fails', async () => {
    const testError = new Error('OCR processing failed');
    
    (useOcr as jest.Mock).mockReturnValue({
      extractText: jest.fn().mockRejectedValue(testError),
      isLoading: false,
      error: testError,
      result: null
    });
    
    render(<OcrScanner />);
    
    // Create a file and trigger the file input change
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText(/file/i);
    
    Object.defineProperty(fileInput, 'files', {
      value: [file]
    });
    
    fireEvent.change(fileInput);
    
    await waitFor(() => {
      expect(screen.getByText('Error: OCR processing failed')).toBeInTheDocument();
    });
  });
});