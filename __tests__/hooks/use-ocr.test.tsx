import { renderHook, act } from '@testing-library/react-hooks';
import { useOcr, ApiKeyError, NetworkError } from '../../hooks/use-ocr';
import fetchMock from 'jest-fetch-mock';

// Enable fetch mocks
fetchMock.enableMocks();

describe('useOcr Hook', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should extract text from an image successfully', async () => {
    // Mock successful API response
    fetchMock.mockResponseOnce(JSON.stringify({
      text: 'Sample extracted text',
      confidence: 0.95
    }));

    const onSuccess = jest.fn();
    const { result } = renderHook(() => useOcr({ onSuccess }));

    // Create a test image file
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    await act(async () => {
      await result.current.extractText(file);
    });

    // Verify API was called with correct parameters
    expect(fetchMock).toHaveBeenCalledWith('/api/ocr', expect.objectContaining({
      method: 'POST',
      headers: expect.objectContaining({
        'Content-Type': 'application/json'
      })
    }));
    
    // Verify results
    expect(result.current.result).toEqual({
      text: 'Sample extracted text',
      confidence: 0.95
    });
    
    expect(onSuccess).toHaveBeenCalledWith({
      text: 'Sample extracted text',
      confidence: 0.95
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle API errors correctly', async () => {
    // Mock API error response
    fetchMock.mockResponseOnce(JSON.stringify({
      message: 'API key is invalid',
      code: 'AUTH_ERROR'
    }), { status: 403 });

    const onError = jest.fn();
    const { result } = renderHook(() => useOcr({ onError }));

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    let error;
    await act(async () => {
      try {
        await result.current.extractText(file);
      } catch (e) {
        error = e;
      }
    });

    // Verify error handling
    expect(error).toBeInstanceOf(ApiKeyError);
    expect(result.current.error).toBeInstanceOf(ApiKeyError);
    expect(onError).toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('should retry on network errors', async () => {
    // First request fails with network error, second succeeds
    fetchMock.mockRejectOnce(new Error('Network error'));
    fetchMock.mockResponseOnce(JSON.stringify({
      text: 'Retry succeeded',
      confidence: 0.85
    }));

    const { result } = renderHook(() => useOcr({ retryCount: 1 }));

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    await act(async () => {
      await result.current.extractText(file);
    });

    // Verify retry behavior
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current.result).toEqual({
      text: 'Retry succeeded',
      confidence: 0.85
    });
  });

  it('should validate file type', async () => {
    const { result } = renderHook(() => useOcr());

    const file = new File(['dummy content'], 'test.txt', { type: 'text/plain' });
    
    let error;
    await act(async () => {
      try {
        await result.current.extractText(file);
      } catch (e) {
        error = e;
      }
    });

    expect(error).toBeDefined();
    expect(error.message).toContain('File is not an image');
  });

  it('should validate file size', async () => {
    const { result } = renderHook(() => useOcr());

    // Create a mock large file (11MB)
    const largeArray = new Uint8Array(11 * 1024 * 1024);
    const file = new File([largeArray], 'large.jpg', { type: 'image/jpeg' });
    
    let error;
    await act(async () => {
      try {
        await result.current.extractText(file);
      } catch (e) {
        error = e;
      }
    });

    expect(error).toBeDefined();
    expect(error.message).toContain('Image is too large');
  });
});