import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '../lib/supabase';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log('Push notifications are not available in the simulator');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If permission not determined, ask user
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If permission not granted, exit
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token: permission not granted');
      return null;
    }

    // Get push token
    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PROJECT_ID,
    })).data;

    // Configure for Android
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Save token to database
    await saveTokenToDatabase(token);

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
}

// Save token to database
async function saveTokenToDatabase(token) {
  try {
    const { user } = await supabase.auth.getUser();
    if (!user) return;

    // Check if token already exists
    const { data: existingTokens } = await supabase
      .from('push_tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('token', token);

    if (existingTokens && existingTokens.length > 0) {
      // Token exists, update last_used
      await supabase
        .from('push_tokens')
        .update({ last_used: new Date().toISOString() })
        .eq('id', existingTokens[0].id);
    } else {
      // Create new token record
      await supabase
        .from('push_tokens')
        .insert({
          user_id: user.id,
          token,
          device_type: Platform.OS,
          created_at: new Date().toISOString(),
          last_used: new Date().toISOString(),
        });
    }
  } catch (error) {
    console.error('Error saving token to database:', error);
  }
}

// Send local notification
export async function sendLocalNotification(title, body, data = {}) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Immediate notification
    });
    return true;
  } catch (error) {
    console.error('Error sending local notification:', error);
    return false;
  }
}

// Add notification listener
export function addNotificationListener(callback) {
  return Notifications.addNotificationReceivedListener(callback);
}

// Add notification response listener
export function addNotificationResponseListener(callback) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}

// Remove notification listener
export function removeNotificationListener(listener) {
  if (listener) {
    Notifications.removeNotificationSubscription(listener);
  }
}