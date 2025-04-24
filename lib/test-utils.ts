import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Session } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client for testing
export const mockSupabaseClient = () => {
  const mockClient = {
    auth: {
      getSession: jest.fn().mockResolvedValue({ 
        data: { 
          session: { 
            user: { id: 'test-user-id', email: 'test@example.com' } 
          } 
        } 
      }),
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
      signUp: jest.fn().mockResolvedValue({ error: null }),
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation(callback => {
        callback({ data: [], error: null });
        return { catch: jest.fn() };
      }),
    }),
    storage: {
      from: jest.fn().mockReturnValue({
        upload: jest.fn().mockResolvedValue({ error: null }),
        getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: 'https://example.com/test.pdf' } }),
      }),
    },
  };

  return mockClient;
};

// Test helper for document-related components
export const renderWithDocumentContext = (ui: React.ReactElement, options = {}) => {
  const mockDocuments = [
    {
      id: '1',
      name: 'Passport.pdf',
      type: 'passport',
      status: 'verified',
      uploadDate: '2023-01-01',
      expiryDate: '2028-01-01',
    },
    {
      id: '2',
      name: 'Medical.pdf',
      type: 'medical',
      status: 'pending',
      uploadDate: '2023-01-02',
    }
  ];

  const mockDocumentContext = {
    documents: mockDocuments,
    loading: false,
    error: null,
    uploadDocument: jest.fn().mockResolvedValue(mockDocuments[0]),
    refreshDocuments: jest.fn(),
  };

  return {
    ...render(ui, options),
    mockDocumentContext,
  };
};

// Test helper for authentication
export const mockAuthSession = (authenticated = true): Session | null => {
  if (!authenticated) return null;
  
  return {
    user: {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: { full_name: 'Test User' },
    },
    access_token: 'test-access-token',
    refresh_token: 'test-refresh-token',
    expires_at: Date.now() + 3600,
  } as unknown as Session;
};