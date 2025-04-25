import { renderHook, act } from '@testing-library/react-hooks';
import { useErrorHandler } from '../../hooks/use-error-handler';
import { ErrorReporting } from '../../lib/services/analytics'; // Fixed import

// Mock dependencies
jest.mock('../../lib/services/analytics', () => ({
  ErrorReporting: {
    captureException: jest.fn() // Fixed method
  }
}));

// Mock notification context
jest.mock('@/contexts/notification-context', () => ({
  useNotifications: () => ({
    addNotification: jest.fn()
  })
}));

describe('useErrorHandler Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle errors correctly', () => {
    const { result } = renderHook(() => 
      useErrorHandler({ context: 'TestComponent', showNotification: true })
    );

    const testError = new Error('Test error message');
    
    act(() => {
      result.current.handleError(testError, 'test action');
    });

    // Check if error was set
    expect(result.current.error).toEqual(testError);
    
    // Check if error was reported
    expect(ErrorReporting.captureException).toHaveBeenCalledWith( // Fixed method
      testError,
      { 
        componentStack: 'TestComponent',
        actionDescription: 'test action'
      }
    );
  });

  it('should clear errors', () => {
    const { result } = renderHook(() => 
      useErrorHandler({ context: 'TestComponent' })
    );

    // Set an error first
    act(() => {
      result.current.handleError(new Error('Test error'));
    });
    
    // Then clear it
    act(() => {
      result.current.clearError();
    });

    // Check if error was cleared
    expect(result.current.error).toBeNull();
  });

  it('should handle non-Error objects', () => {
    const { result } = renderHook(() => 
      useErrorHandler({ context: 'TestComponent' })
    );

    act(() => {
      result.current.handleError('String error');
    });

    // Check if string was converted to Error
    expect(result.current.error instanceof Error).toBe(true);
    expect(result.current.error?.message).toBe('String error');
  });
});