import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, Divider, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      // Update local state
      setNotifications(notifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      // Update local state
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    switch (notification.type) {
      case 'document_status_change':
        navigation.navigate('Documents', {
          screen: 'DocumentDetail',
          params: { documentId: notification.data.document_id }
        });
        break;
      case 'training_assigned':
        navigation.navigate('Training', {
          screen: 'TrainingDetail',
          params: { 
            trainingId: notification.data.training_id,
            title: notification.data.training_title
          }
        });
        break;
      case 'profile_update':
        navigation.navigate('ProfileTab', { screen: 'Profile' });
        break;
      default:
        // Just mark as read if no specific action
        break;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'document_status_change':
        return 'file-document';
      case 'training_assigned':
        return 'school';
      case 'profile_update':
        return 'account';
      default:
        return 'bell';
    }
  };

  const renderNotificationItem = ({ item }) => (
    <Card 
      style={[styles.notificationCard, !item.read && styles.unreadCard]} 
      onPress={() => handleNotificationPress(item)}
    >
      <Card.Content style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons 
            name={getNotificationIcon(item.type)} 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
        <View style={styles.textContainer}>
          <Title style={styles.notificationTitle}>{item.title}</Title>
          <Paragraph style={styles.notificationBody}>{item.body}</Paragraph>
          <Text style={styles.notificationTime}>
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </Text>
        </View>
        {!item.read && (
          <View style={styles.unreadIndicator} />
        )}
      </Card.Content>
    </Card>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Notifications</Title>
        {notifications.some(n => !n.read) && (
          <Button 
            mode="text" 
            onPress={markAllAsRead}
            style={styles.markAllButton}
          >
            Mark All as Read
          </Button>
        )}
      </View>
      
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <MaterialCommunityIcons 
                name="bell-off-outline" 
                size={48} 
                color={theme.colors.backdrop} 
                style={styles.emptyIcon}
              />
              <Title style={styles.emptyTitle}>No Notifications</Title>
              <Paragraph style={styles.emptyText}>
                You don't have any notifications yet. They will appear here when you receive them.
              </Paragraph>
            </Card.Content>
          </Card>
        }
      />
    </View>
  );
}

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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 20,
  },
  markAllButton: {
    marginLeft: 'auto',
  },
  listContainer: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 8,
  },
  unreadCard: {
    backgroundColor: theme.colors.primary + '10',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 12,
    padding: 8,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 14,
    color: theme.colors.backdrop,
  },
  notificationTime: {
    fontSize: 12,
    color: theme.colors.backdrop,
    marginTop: 4,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.backdrop,
  },
});