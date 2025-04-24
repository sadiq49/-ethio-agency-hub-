import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/auth-context';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

type Notification = {
  id: string;
  title: string;
  message: string;
  type: 'document' | 'training' | 'status';
  read: boolean;
  created_at: string;
};

const NotificationsScreen = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setNotifications(data || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // For demo purposes, let's add some mock notifications if none exist
    if (notifications.length === 0) {
      setNotifications([
        {
          id: '1',
          title: 'Document Request',
          message: 'Please upload your updated passport copy',
          type: 'document',
          read: false,
          created_at: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Training Reminder',
          message: 'Your language training session is scheduled for tomorrow',
          type: 'training',
          read: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          title: 'Status Update',
          message: 'Your work permit application has been approved',
          type: 'status',
          read: true,
          created_at: new Date(Date.now() - 172800000).toISOString(),
        },
      ]);
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      // Update local state
      setNotifications(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );

      // Update in database
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotificationItem = ({ item }: { item: Notification }) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString();
    
    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unreadItem]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationMessage}>{item.message}</Text>
          <Text style={styles.notificationDate}>{formattedDate}</Text>
        </View>
        {!item.read && <View style={styles.unreadIndicator} />}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAllRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  markAllRead: {
    color: '#007BFF',
    fontSize: 14,
  },
  listContainer: {
    padding: 10,
  },
  notificationItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unreadItem: {
    backgroundColor: '#f0f8ff',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  notificationDate: {
    fontSize: 12,
    color: '#666',
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
    marginLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default NotificationsScreen;