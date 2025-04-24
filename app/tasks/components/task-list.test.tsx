import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TaskList } from './task-list';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Mock Supabase client
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn()
}));

// Mock hooks
jest.mock('@/hooks/use-notification', () => ({
  useNotification: () => ({
    addNotification: jest.fn()
  })
}));

jest.mock('@/hooks/use-task-notifications', () => ({
  useTaskNotifications: () => ({
    checkDeadlines: jest.fn()
  })
}));

jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn()
  })
}));

describe('TaskList Component', () => {
  const mockSupabase = {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: 'test-user-id' } }
      })
    },
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      then: jest.fn().mockImplementation(callback => {
        callback({ data: mockTasks, error: null });
        return { catch: jest.fn() };
      })
    })
  };

  const mockTasks = [
    {
      id: 'task-1',
      title: 'Complete documentation',
      description: 'Finish project documentation',
      deadline: '2024-04-30',
      priority: 'high',
      status: 'pending',
      assigned_to: 'test-user-id',
      assigned_user: { name: 'Test User' }
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  test('renders task list correctly', async () => {
    render(<TaskList />);
    
    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Complete documentation')).toBeInTheDocument();
    });
    
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('2024-04-30')).toBeInTheDocument();
  });

  test('opens new task form when add button is clicked', async () => {
    render(<TaskList />);
    
    // Click the add task button
    fireEvent.click(screen.getByText('Add Task'));
    
    // Check if form elements are displayed
    await waitFor(() => {
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Deadline')).toBeInTheDocument();
    });
  });

  // Add more tests for task creation, completion, etc.
});