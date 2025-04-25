import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { theme } from '../theme';

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(false);
  const slideAnim = React.useRef(new Animated.Value(-50)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !state.isConnected;
      setIsOffline(offline);
      
      Animated.timing(slideAnim, {
        toValue: offline ? 0 : -50,
        duration: 300,
        useNativeDriver: true
      }).start();
    });

    // Check initial state
    NetInfo.fetch().then(state => {
      const offline = !state.isConnected;
      setIsOffline(offline);
      
      if (offline) {
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }).start();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        { transform: [{ translateY: slideAnim }] }
      ]}
    >
      <Text style={styles.text}>You are offline. Some features may be limited.</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f59e0b',
    padding: 10,
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default OfflineIndicator;