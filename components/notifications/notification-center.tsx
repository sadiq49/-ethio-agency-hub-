import React, { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notification } from '@/components/ui/notification';
import { useNotifications } from '@/contexts/notification-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export function NotificationCenter() {
  const { 
    notifications, 
    unreadCount, 
    removeNotification, 
    markAsRead, 
    markAllAsRead, 
    clearAll 
  } = useNotifications();
  const [open, setOpen] = useState(false);

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
  };

  const handleRemove = (id: string) => {
    removeNotification(id);
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-medium">Notifications</h4>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => markAllAsRead()}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Mark all as read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-xs"
                onClick={() => clearAll()}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </div>
        <Tabs defaultValue="unread">
          <TabsList className="w-full grid grid-cols-2 rounded-none border-b">
            <TabsTrigger value="unread" className="rounded-none">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="rounded-none">
              All ({notifications.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="unread" className="p-0">
            <ScrollArea className="h-[300px]">
              {unreadNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p>No unread notifications</p>
                </div>
              ) : (
                <div className="grid gap-2 p-4">
                  {unreadNotifications.map((notification) => (
                    <Notification
                      key={notification.id}
                      notification={notification}
                      onClose={() => handleRemove(notification.id)}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleMarkAsRead(notification.id)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="all" className="p-0">
            <ScrollArea className="h-[300px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <div className="grid gap-2 p-4">
                  {notifications.map((notification) => (
                    <Notification
                      key={notification.id}
                      notification={notification}
                      onClose={() => handleRemove(notification.id)}
                      className={notification.read ? "opacity-70" : ""}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}