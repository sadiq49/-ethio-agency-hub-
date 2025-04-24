import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNotifications } from '@/contexts/notification-context';
import { Notification } from '@/components/ui/notification';

export function ToastNotifications() {
  const { notifications, removeNotification } = useNotifications();
  
  // Only show the 3 most recent notifications that have been added in the last 5 seconds
  const recentNotifications = notifications
    .filter(notification => {
      const fiveSecondsAgo = new Date(Date.now() - 5000);
      return new Date(notification.timestamp) > fiveSecondsAgo;
    })
    .slice(0, 3);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[380px]">
      <AnimatePresence>
        {recentNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Notification
              notification={notification}
              onClose={() => removeNotification(notification.id)}
              className="shadow-lg"
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}