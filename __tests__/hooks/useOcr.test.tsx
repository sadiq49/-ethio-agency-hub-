import { renderHook, act } from '@testing-library/react-hooks';
import { useOcr } from '../../src/hooks/useOcr';
import { ocrService } from '../../src/services/OcrService';
import { ErrorReporting } from '../../lib/services/analytics';

// Mock dependencies
jest.mock('../../src/services/OcrService', () => ({
  ocrService: {
    processImage: jest.fn()
  }
}));

jest.mock('../../lib/services/analytics', () => ({
  ErrorReporting: {
    captureException: jest.fn()
  }
}));

jest.mock('../../hooks/use-analytics', () => ({
  useAnalytics: () => ({
    trackEvent: jest.fn()
  })
}));

describe('useOcr Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process an image successfully', async () => {
    // Mock successful response
    const mockResult = {
      text: 'Sample extracted text',
      confidence: 0.95,
      language: 'en'
    };
    
    (ocrService.processImage as jest.Mock).mockResolvedValue(mockResult);

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useOcr({ onSuccess }));

    await act(async () => {
      const response = await result.current.processImage('file://test-image.jpg');
      expect(response).toEqual(mockResult);
    });

    expect(ocrService.processImage).toHaveBeenCalledWith('file://test-image.jpg');
    expect(result.current.result).toEqual(mockResult);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(onSuccess).toHaveBeenCalledWith(mockResult);
  });

  it('should handle errors during image processing', async () => {
    // Mock error response
    const testError = new Error('OCR processing failed');
    (ocrService.processImage as jest.Mock).mockRejectedValue(testError);

    const onError = jest.fn();
    const { result } = renderHook(() => useOcr({ onError }));

    await act(async () => {
      try {
        await result.current.processImage('file://test-image.jpg');
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toEqual(testError);
      }
    });

    expect(result.current.error).toEqual(testError);
    expect(result.current.isLoading).toBe(false);
    expect(onError).toHaveBeenCalledWith(testError);
    expect(ErrorReporting.captureException).toHaveBeenCalledWith(
      testError,
      expect.objectContaining({
        context: 'useOcr.processImage',
        imageUri: 'file://test-image.jpg'
      })
    );
  });

  it('should reset the state', async () => {
    // First process an image
    const mockResult = { text: 'Sample text', confidence: 0.9 };
    (ocrService.processImage as jest.Mock).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useOcr());

    await act(async () => {
      await result.current.processImage('file://test-image.jpg');
    });

    expect(result.current.result).toEqual(mockResult);

    // Then reset the state
    act(() => {
      result.current.reset();
    });

    expect(result.current.result).toBeNull();
    expect(result.current.error).toBeNull();
  });
});