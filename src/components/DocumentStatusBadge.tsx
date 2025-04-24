import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

const getStatusColor = (status) => {
  switch (status) {
    case 'approved': return theme.colors.success;
    case 'rejected': return theme.colors.error;
    case 'pending_review': return theme.colors.warning;
    case 'needs_correction': return theme.colors.notification;
    default: return theme.colors.primary;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'approved': return 'check-circle';
    case 'rejected': return 'close-circle';
    case 'pending_review': return 'clock-outline';
    case 'needs_correction': return 'alert-circle';
    default: return 'file-document-outline';
  }
};

export const DocumentStatusBadge = ({ status, previousStatus }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    if (previousStatus && previousStatus !== status) {
      // Animate when status changes
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [status, previousStatus]);

  const statusColor = getStatusColor(status);
  const statusIcon = getStatusIcon(status);
  const statusText = status.replace(/_/g, ' ');

  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: statusColor + '20' },
        { transform: [{ scale: pulseAnim }] }
      ]}
    >
      <MaterialCommunityIcons 
        name={statusIcon} 
        size={16} 
        color={statusColor} 
        style={styles.icon}
      />
      <Text style={[styles.text, { color: statusColor }]}>
        {statusText}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});