import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthForm } from '@/components/auth/auth-form';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock Supabase auth methods
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn(),
        signUp: jest.fn(),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  it('displays validation errors for empty form submission', async () => {
    render(<AuthForm mode="login" />);
    
    // Submit form without filling fields
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('calls signInWithPassword with correct credentials', async () => {
    const mockSupabase = {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: null }),
      },
    };
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    
    render(<AuthForm mode="login" />);
    
    // Fill form fields
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check if Supabase auth method was called with correct args
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});