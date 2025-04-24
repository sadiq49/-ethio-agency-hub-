import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence 
} from 'react-native-reanimated';

export const StatusUpdateNotification = ({ 
  visible, 
  status, 
  documentTitle, 
  onPress, 
  onDismiss 
}) => {
  const translateY = useSharedValue(-100);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      translateY.value = withSequence(
        withTiming(-100, { duration: 0 }),
        withTiming(0, { duration: 300 })
      );
      
      // Auto dismiss after 5 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);
  
  const handleDismiss = () => {
    translateY.value = withTiming(-100, { duration: 300 }, () => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    });
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
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return theme.colors.success;
      case 'rejected': return theme.colors.error;
      case 'pending_review': return theme.colors.warning;
      case 'needs_correction': return theme.colors.notification;
      default: return theme.colors.primary;
    }
  };
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }]
    };
  });
  
  if (!isVisible) return null;
  
  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Surface style={styles.surface}>
        <TouchableOpacity 
          style={styles.content} 
          onPress={onPress}
          activeOpacity={0.7}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name={getStatusIcon(status)} 
              size={24} 
              color={getStatusColor(status)} 
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Document Status Update</Text>
            <Text style={styles.message}>
              {documentTitle} is now <Text style={{ color: getStatusColor(status) }}>
                {status.replace(/_/g, ' ')}
              </Text>
            </Text>
          </View>
        </TouchableOpacity>
        <IconButton 
          icon="close" 
          size={20} 
          onPress={handleDismiss} 
          style={styles.closeButton} 
        />
      </Surface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: 16,
  },
  surface: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    elevation: 4,
    padding: 12,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  message: {
    fontSize: 14,
  },
  closeButton: {
    margin: 0,
  },
});