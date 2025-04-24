import { useNotifications } from '@/contexts/notification-context';
import type { NotificationType } from '@/contexts/notification-context';

export function useNotification() {
  const { addNotification } = useNotifications();

  const showNotification = (
    title: string,
    message: string,
    type: NotificationType = 'info',
    duration?: number
  ) => {
    addNotification({
      title,
      message,
      type,
      duration
    });
  };

  return {
    success: (title: string, message: string, duration?: number) => 
      showNotification(title, message, 'success', duration),
    error: (title: string, message: string, duration?: number) => 
      showNotification(title, message, 'error', duration),
    warning: (title: string, message: string, duration?: number) => 
      showNotification(title, message, 'warning', duration),
    info: (title: string, message: string, duration?: number) => 
      showNotification(title, message, 'info', duration),
  };
}