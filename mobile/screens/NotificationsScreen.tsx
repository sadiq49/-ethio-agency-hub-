import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Title, List, Text, IconButton, Badge, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'document' | 'training' | 'travel' | 'general';
  status: 'unread' | 'read';
  timestamp: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const notifications: Notification[] = [
  {
    id: 'NOT001',
    title: 'Document Expiring Soon',
    message: 'Your medical certificate will expire in 30 days. Please renew it before expiration.',
    type: 'document',
    status: 'unread',
    timestamp: '2024-03-15 09:30',
    action: {
      label: 'View Document',
      onPress: () => {},
    },
  },
  {
    id: 'NOT002',
    title: 'Training Session Reminder',
    message: 'Your Arabic language training session starts tomorrow at 10:00 AM.',
    type: 'training',
    status: 'unread',
    timestamp: '2024-03-15 10:15',
    action: {
      label: 'View Schedule',
      onPress: () => {},
    },
  },
  {
    id: 'NOT003',
    title: 'Travel Update',
    message: 'Your flight details have been updated. Please check the new schedule.',
    type: 'travel',
    status: 'read',
    timestamp: '2024-03-14 15:45',
    action: {
      label: 'View Details',
      onPress: () => {},
    },
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'document':
      return 'file-document';
    case 'training':
      return 'school';
    case 'travel':
      return 'airplane';
    default:
      return 'bell';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'document':
      return '#3b82f6';
    case 'training':
      return '#10b981';
    case 'travel':
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};

export default function NotificationsScreen() {
  const [notificationsList, setNotificationsList] = useState(notifications);

  const markAsRead = (id: string) => {
    setNotificationsList(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, status: 'read' }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationsList(prev =>
      prev.map(notification => ({ ...notification, status: 'read' }))
    );
  };

  const unreadCount = notificationsList.filter(n => n.status === 'unread').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.notificationHeader}>
              <View style={styles.notificationHeaderLeft}>
                <Title>Notifications</Title>
                {unreadCount > 0 && (
                  <Badge style={styles.unreadBadge}>
                    {unreadCount}
                  </Badge>
                )}
              </View>
              {unreadCount > 0 && (
                <IconButton
                  icon="check-all"
                  onPress={markAllAsRead}
                  mode="contained-tonal"
                />
              )}
            </View>
          </Card.Content>
        </Card>

        {notificationsList.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <Card
              style={[
                styles.notificationCard,
                notification.status === 'unread' && styles.unreadNotification,
              ]}
            >
              <Card.Content>
                <View style={styles.notificationItem}>
                  <View style={styles.notificationIcon}>
                    <IconButton
                      icon={getNotificationIcon(notification.type)}
                      size={24}
                      iconColor={getNotificationColor(notification.type)}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <Text style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={styles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <View style={styles.notificationFooter}>
                      <Text style={styles.notificationTimestamp}>
                        {notification.timestamp}
                      </Text>
                      {notification.action && (
                        <IconButton
                          icon="chevron-right"
                          size={20}
                          onPress={notification.action.onPress}
                        />
                      )}
                    </View>
                  </View>
                  {notification.status === 'unread' && (
                    <IconButton
                      icon="check"
                      size={20}
                      onPress={() => markAsRead(notification.id)}
                    />
                  )}
                </View>
              </Card.Content>
            </Card>
            {index < notificationsList.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}