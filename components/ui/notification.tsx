import React from 'react';
import { Bell, CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Notification as NotificationType } from '@/contexts/notification-context';

const notificationVariants = cva(
  "relative w-full rounded-lg border p-4 shadow-md",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
        error: "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
        warning: "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
        info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface NotificationProps extends VariantProps<typeof notificationVariants> {
  notification: NotificationType;
  onClose?: () => void;
  className?: string;
}

export function Notification({
  notification,
  variant,
  onClose,
  className,
}: NotificationProps) {
  const { type, title, message } = notification;
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const mappedVariant = type as typeof variant;

  return (
    <div className={cn(notificationVariants({ variant: mappedVariant }), className)}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">{getIcon()}</div>
        <div className="flex-1">
          {title && <h4 className="font-medium">{title}</h4>}
          <p className={cn("text-sm", title && "mt-1")}>{message}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            {new Date(notification.timestamp).toLocaleString()}
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </div>
  );
}