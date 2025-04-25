import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetInfoState | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkStatus(state);
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    // Get initial state
    NetInfo.fetch().then(state => {
      setNetworkStatus(state);
      setIsConnected(state.isConnected);
      setIsInternetReachable(state.isInternetReachable);
    });

    return () => unsubscribe();
  }, []);

  return {
    networkStatus,
    isConnected,
    isInternetReachable,
    isOffline: isConnected === false,
    connectionType: networkStatus?.type,
    details: networkStatus?.details,
  };
}


import { useState, useEffect } from 'react';

type NetworkStatus = {
  isOnline: boolean;
  connectionType: string | null;
  isInternetReachable: boolean;
  lastChecked: Date | null;
};

export function useNetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: true, // Optimistically assume online
    connectionType: null,
    isInternetReachable: true,
    lastChecked: null,
  });

  useEffect(() => {
    let mounted = true;
    
    // Function to check network status
    const checkNetworkStatus = async () => {
      try {
        // For browser environments
        if (typeof window !== 'undefined' && 'navigator' in window) {
          const isOnline = navigator.onLine;
          
          if (mounted) {
            setNetworkStatus(prev => ({
              ...prev,
              isOnline,
              lastChecked: new Date(),
            }));
          }
        }
        
        // For React Native environments, you would use NetInfo
        // This is a placeholder for the React Native implementation
        // In a real app, you would import NetInfo from '@react-native-community/netinfo'
        // and use it to get more detailed network information
      } catch (error) {
        console.error('Error checking network status:', error);
      }
    };
    
    // Check network status immediately
    checkNetworkStatus();
    
    // Set up event listeners for online/offline events (browser)
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        if (mounted) {
          setNetworkStatus(prev => ({
            ...prev,
            isOnline: true,
            lastChecked: new Date(),
          }));
        }
      });
      
      window.addEventListener('offline', () => {
        if (mounted) {
          setNetworkStatus(prev => ({
            ...prev,
            isOnline: false,
            lastChecked: new Date(),
          }));
        }
      });
    }
    
    // Set up periodic checks
    const intervalId = setInterval(checkNetworkStatus, 30000); // Check every 30 seconds
    
    // Clean up
    return () => {
      mounted = false;
      clearInterval(intervalId);
      
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', checkNetworkStatus);
        window.removeEventListener('offline', checkNetworkStatus);
      }
    };
  }, []);
  
  // Function to manually check network status
  const checkConnection = async () => {
    try {
      // For browser environments
      if (typeof window !== 'undefined' && 'navigator' in window) {
        const isOnline = navigator.onLine;
        
        // Attempt to fetch a small resource to verify internet connectivity
        let isInternetReachable = false;
        
        if (isOnline) {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://www.google.com/favicon.ico', {
              method: 'HEAD',
              signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            isInternetReachable = response.ok;
          } catch (error) {
            isInternetReachable = false;
          }
        }
        
        setNetworkStatus({
          isOnline,
          connectionType: isOnline ? 'unknown' : null,
          isInternetReachable,
          lastChecked: new Date(),
        });
        
        return { isOnline, isInternetReachable };
      }
      
      // For React Native environments
      return { isOnline: networkStatus.isOnline, isInternetReachable: networkStatus.isInternetReachable };
    } catch (error) {
      console.error('Error manually checking network status:', error);
      return { isOnline: false, isInternetReachable: false };
    }
  };
  
  return {
    ...networkStatus,
    checkConnection,
  };
}