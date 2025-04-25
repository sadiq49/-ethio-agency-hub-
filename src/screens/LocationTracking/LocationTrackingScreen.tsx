import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  ScrollView,
  Switch,
  TextInput
} from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStatus } from '../../../hooks/use-network-status';
import { logger } from '../../../lib/logger';

// Define types for geofence locations
interface GeofenceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  notifyOnEntry: boolean;
  notifyOnExit: boolean;
}

// Define types for user location
interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

const GEOFENCE_STORAGE_KEY = 'user_geofence_locations';
const USER_LOCATION_HISTORY_KEY = 'user_location_history';

const LocationTrackingScreen = () => {
  // State variables
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [geofenceLocations, setGeofenceLocations] = useState<GeofenceLocation[]>([]);
  const [selectedGeofence, setSelectedGeofence] = useState<GeofenceLocation | null>(null);
  const [locationHistory, setLocationHistory] = useState<UserLocation[]>([]);
  const [isAddingGeofence, setIsAddingGeofence] = useState(false);
  const [newGeofenceName, setNewGeofenceName] = useState('');
  const [newGeofenceRadius, setNewGeofenceRadius] = useState(100);
  
  // References
  const mapRef = useRef<MapView | null>(null);
  const locationSubscription = useRef<any>(null);
  const { isOnline } = useNetworkStatus();
  
  // Load saved geofence locations and location history on component mount
  useEffect(() => {
    (async () => {
      try {
        // Request location permissions
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setIsLoading(false);
          return;
        }
        
        // Request background location permissions for geofencing
        let backgroundStatus = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus.status !== 'granted') {
          Alert.alert(
            'Background Location Access Required',
            'This app needs background location access for geofencing features. Please enable it in your settings.',
            [{ text: 'OK' }]
          );
        }
        
        // Load saved geofence locations
        await loadGeofenceLocations();
        
        // Load location history
        await loadLocationHistory();
        
        // Get current location
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced
        });
        
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          timestamp: currentLocation.timestamp
        });
        
        setIsLoading(false);
      } catch (error) {
        logger.error('Error initializing location tracking', error as Error);
        setErrorMsg('Failed to initialize location tracking');
        setIsLoading(false);
      }
    })();
    
    // Cleanup function
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);
  
  // Load saved geofence locations from AsyncStorage
  const loadGeofenceLocations = async () => {
    try {
      const savedLocations = await AsyncStorage.getItem(GEOFENCE_STORAGE_KEY);
      if (savedLocations) {
        setGeofenceLocations(JSON.parse(savedLocations));
      }
    } catch (error) {
      logger.error('Error loading geofence locations', error as Error);
      Alert.alert('Error', 'Failed to load saved geofence locations');
    }
  };
  
  // Load location history from AsyncStorage
  const loadLocationHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(USER_LOCATION_HISTORY_KEY);
      if (savedHistory) {
        setLocationHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      logger.error('Error loading location history', error as Error);
    }
  };
  
  // Save geofence locations to AsyncStorage
  const saveGeofenceLocations = async (locations: GeofenceLocation[]) => {
    try {
      await AsyncStorage.setItem(GEOFENCE_STORAGE_KEY, JSON.stringify(locations));
    } catch (error) {
      logger.error('Error saving geofence locations', error as Error);
      Alert.alert('Error', 'Failed to save geofence locations');
    }
  };
  
  // Save location history to AsyncStorage
  const saveLocationHistory = async (history: UserLocation[]) => {
    try {
      // Keep only the last 100 locations to prevent excessive storage usage
      const limitedHistory = history.slice(-100);
      await AsyncStorage.setItem(USER_LOCATION_HISTORY_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      logger.error('Error saving location history', error as Error);
    }
  };
  
  // Start location tracking
  const startLocationTracking = async () => {
    try {
      // Check if location services are enabled
      const isLocationEnabled = await Location.hasServicesEnabledAsync();
      if (!isLocationEnabled) {
        Alert.alert(
          'Location Services Disabled',
          'Please enable location services to use this feature.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Start watching position
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          distanceInterval: 10, // minimum change (in meters) to trigger update
          timeInterval: 5000 // minimum time (in ms) between updates
        },
        (newLocation) => {
          const userLocation: UserLocation = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            accuracy: newLocation.coords.accuracy,
            timestamp: newLocation.timestamp
          };
          
          setLocation(userLocation);
          
          // Add to location history
          setLocationHistory(prevHistory => {
            const updatedHistory = [...prevHistory, userLocation];
            saveLocationHistory(updatedHistory);
            return updatedHistory;
          });
          
          // Check geofences
          checkGeofences(userLocation);
        }
      );
      
      setIsTracking(true);
      logger.info('Location tracking started');
    } catch (error) {
      logger.error('Error starting location tracking', error as Error);
      Alert.alert('Error', 'Failed to start location tracking');
    }
  };
  
  // Stop location tracking
  const stopLocationTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    setIsTracking(false);
    logger.info('Location tracking stopped');
  };
  
  // Check if user is within any geofence
  const checkGeofences = (userLocation: UserLocation) => {
    geofenceLocations.forEach(geofence => {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        geofence.latitude,
        geofence.longitude
      );
      
      const isInside = distance <= geofence.radius;
      const wasInside = geofence.id in (lastGeofenceState || {});
      
      // Entry event
      if (isInside && !wasInside && geofence.notifyOnEntry) {
        Alert.alert(`Entered ${geofence.name}`, `You've entered the ${geofence.name} area.`);
        logger.info(`User entered geofence: ${geofence.name}`);
        
        // Update last geofence state
        setLastGeofenceState(prev => ({
          ...prev,
          [geofence.id]: true
        }));
      }
      
      // Exit event
      if (!isInside && wasInside && geofence.notifyOnExit) {
        Alert.alert(`Left ${geofence.name}`, `You've left the ${geofence.name} area.`);
        logger.info(`User exited geofence: ${geofence.name}`);
        
        // Update last geofence state
        setLastGeofenceState(prev => {
          const newState = { ...prev };
          delete newState[geofence.id];
          return newState;
        });
      }
    });
  };
  
  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // Distance in meters
  };
  
  // Add a new geofence location
  const addGeofenceLocation = () => {
    if (!location) {
      Alert.alert('Error', 'Cannot add geofence: Current location unknown');
      return;
    }
    
    if (!newGeofenceName.trim()) {
      Alert.alert('Error', 'Please enter a name for this location');
      return;
    }
    
    const newGeofence: GeofenceLocation = {
      id: Date.now().toString(),
      name: newGeofenceName.trim(),
      latitude: location.latitude,
      longitude: location.longitude,
      radius: newGeofenceRadius,
      notifyOnEntry: true,
      notifyOnExit: true
    };
    
    const updatedGeofences = [...geofenceLocations, newGeofence];
    setGeofenceLocations(updatedGeofences);
    saveGeofenceLocations(updatedGeofences);
    
    setNewGeofenceName('');
    setIsAddingGeofence(false);
    setSelectedGeofence(newGeofence);
    
    logger.info(`New geofence added: ${newGeofence.name}`);
  };
  
  // Remove a geofence location
  const removeGeofenceLocation = (id: string) => {
    Alert.alert(
      'Remove Geofence',
      'Are you sure you want to remove this geofence?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updatedGeofences = geofenceLocations.filter(location => location.id !== id);
            setGeofenceLocations(updatedGeofences);
            saveGeofenceLocations(updatedGeofences);
            
            if (selectedGeofence && selectedGeofence.id === id) {
              setSelectedGeofence(null);
            }
            
            logger.info(`Geofence removed: ${id}`);
          }
        }
      ]
    );
  };
  
  // Toggle geofence notification settings
  const toggleGeofenceNotification = (id: string, type: 'entry' | 'exit') => {
    const updatedGeofences = geofenceLocations.map(location => {
      if (location.id === id) {
        if (type === 'entry') {
          return { ...location, notifyOnEntry: !location.notifyOnEntry };
        } else {
          return { ...location, notifyOnExit: !location.notifyOnExit };
        }
      }
      return location;
    });
    
    setGeofenceLocations(updatedGeofences);
    saveGeofenceLocations(updatedGeofences);
    
    // Update selected geofence if it's the one being modified
    if (selectedGeofence && selectedGeofence.id === id) {
      const updated = updatedGeofences.find(g => g.id === id);
      if (updated) {
        setSelectedGeofence(updated);
      }
    }
  };
  
  // State to track which geofences the user is currently inside
  const [lastGeofenceState, setLastGeofenceState] = useState<Record<string, boolean>>({});
  
  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading location services...</Text>
      </View>
    );
  }
  
  // Render error state
  if (errorMsg) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="warning" size={48} color="red" />
        <Text style={styles.errorText}>{errorMsg}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            setIsLoading(true);
            setErrorMsg(null);
            // Retry initialization
            Location.requestForegroundPermissionsAsync()
              .then(({ status }) => {
                if (status === 'granted') {
                  Location.getCurrentPositionAsync({})
                    .then(currentLocation => {
                      setLocation({
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                        accuracy: currentLocation.coords.accuracy,
                        timestamp: currentLocation.timestamp
                      });
                      setIsLoading(false);
                    })
                    .catch(error => {
                      logger.error('Error getting current position', error as Error);
                      setErrorMsg('Failed to get current location');
                      setIsLoading(false);
                    });
                } else {
                  setErrorMsg('Location permission is required');
                  setIsLoading(false);
                }
              })
              .catch(error => {
                logger.error('Error requesting permissions', error as Error);
                setErrorMsg('Failed to request location permissions');
                setIsLoading(false);
              });
          }}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Render main UI
  return (
    <View style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        {location && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            showsUserLocation
            showsMyLocationButton
          >
            {/* User location marker */}
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              description={`Accuracy: ${location.accuracy?.toFixed(2)}m`}
            >
              <View style={styles.userMarker}>
                <View style={styles.userMarkerDot} />
              </View>
            </Marker>
            
            {/* Geofence circles */}
            {geofenceLocations.map(geofence => (
              <React.Fragment key={geofence.id}>
                <Circle
                  center={{
                    latitude: geofence.latitude,
                    longitude: geofence.longitude,
                  }}
                  radius={geofence.radius}
                  fillColor="rgba(0, 150, 255, 0.2)"
                  strokeColor="rgba(0, 150, 255, 0.5)"
                  strokeWidth={2}
                  onPress={() => setSelectedGeofence(geofence)}
                />
                <Marker
                  coordinate={{
                    latitude: geofence.latitude,
                    longitude: geofence.longitude,
                  }}
                  title={geofence.name}
                  description={`Radius: ${geofence.radius}m`}
                  onPress={() => setSelectedGeofence(geofence)}
                >
                  <View style={styles.geofenceMarker}>
                    <Ionicons name="location" size={24} color="#0096ff" />
                  </View>
                </Marker>
              </React.Fragment>
            ))}
          </MapView>
        )}
        
        {/* Network status indicator */}
        <View style={styles.networkIndicator}>
          <Ionicons 
            name={isOnline ? "wifi" : "wifi-off"} 
            size={16} 
            color={isOnline ? "green" : "red"} 
          />
          <Text style={[styles.networkText, { color: isOnline ? "green" : "red" }]}>
            {isOnline ? "Online" : "Offline"}
          </Text>
        </View>
        
        {/* Map controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => {
              if (location && mapRef.current) {
                mapRef.current.animateToRegion({
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                });
              }
            }}
          >
            <Ionicons name="locate" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Controls and info panel */}
      <View style={styles.controlPanel}>
        <ScrollView>
          {/* Tracking controls */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location Tracking</Text>
            <View style={styles.trackingControls}>
              {!isTracking ? (
                <TouchableOpacity 
                  style={[styles.button, styles.startButton]}
                  onPress={startLocationTracking}
                >
                  <Ionicons name="play" size={18} color="white" />
                  <Text style={styles.buttonText}>Start Tracking</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={[styles.button, styles.stopButton]}
                  onPress={stopLocationTracking}
                >
                  <Ionicons name="stop" size={18} color="white" />
                  <Text style={styles.buttonText}>Stop Tracking</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {/* Current location info */}
            {location && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationText}>
                  Lat: {location.latitude.toFixed(6)}
                </Text>
                <Text style={styles.locationText}>
                  Lng: {location.longitude.toFixed(6)}
                </Text>
                {location.accuracy && (
                  <Text style={styles.locationText}>
                    Accuracy: {location.accuracy.toFixed(2)}m
                  </Text>
                )}
                <Text style={styles.locationText}>
                  Updated: {new Date(location.timestamp).toLocaleTimeString()}
                </Text>
              </View>
            )}
          </View>
          
          {/* Geofence controls */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Geofences</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => setIsAddingGeofence(!isAddingGeofence)}
              >
                <Ionicons name={isAddingGeofence ? "close" : "add"} size={24} color="#0096ff" />
              </TouchableOpacity>
            </View>
            
            {/* Add geofence form */}
            {isAddingGeofence && (
              <View style={styles.addGeofenceForm}>
                <Text style={styles.formLabel}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={newGeofenceName}
                  onChangeText={setNewGeofenceName}
                  placeholder="Enter location name"
                />
                
                <Text style={styles.formLabel}>Radius (meters):</Text>
                <View style={styles.radiusSelector}>
                  <TouchableOpacity
                    style={styles.radiusButton}
                    onPress={() => setNewGeofenceRadius(Math.max(50, newGeofenceRadius - 50))}
                  >
                    <Text style={styles.radiusButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.radiusValue}>{newGeofenceRadius}m</Text>
                  <TouchableOpacity
                    style={styles.radiusButton}
                    onPress={() => setNewGeofenceRadius(Math.min(1000, newGeofenceRadius + 50))}
                  >
                    <Text style={styles.radiusButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                
                <TouchableOpacity
                  style={[styles.button, styles.addGeofenceButton]}
                  onPress={addGeofenceLocation}
                >
                  <Text style={styles.buttonText}>Add Geofence</Text>
                </TouchableOpacity>
              </View>
            )}
            
            {/* Geofence list */}
            {geofenceLocations.length === 0 ? (
              <Text style={styles.emptyText}>No geofences added yet</Text>
            ) : (
              <View style={styles.geofenceList}>
                {geofenceLocations.map(geofence => (
                  <TouchableOpacity
                    key={geofence.id}
                    style={[
                      styles.geofenceItem,
                      selectedGeofence?.id === geofence.id && styles.selectedGeofence
                    ]}
                    onPress={() => setSelectedGeofence(geofence)}
                  >
                    <View style={styles.geofenceItemHeader}>
                      <Text style={styles.geofenceName}>{geofence.name}</Text>
                      <TouchableOpacity
                        onPress={() => removeGeofenceLocation(geofence.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#ff3b30" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.geofenceDetails}>
                      Radius: {geofence.radius}m
                    </Text>
                    
                    {/* Notification toggles */}
                    <View style={styles.notificationToggles}>
                      <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Notify on entry</Text>
                        <Switch
                          value={geofence.notifyOnEntry}
                          onValueChange={() => toggleGeofenceNotification(geofence.id, 'entry')}
                          trackColor={{ false: '#767577', true: '#81b0ff' }}
                          thumbColor={geofence.notifyOnEntry ? '#0096ff' : '#f4f3f4'}
                        />
                      </View>
                      <View style={styles.toggleRow}>
                        <Text style={styles.toggleLabel}>Notify on exit</Text>
                        <Switch
                          value={geofence.notifyOnExit}
                          onValueChange={() => toggleGeofenceNotification(geofence.id, 'exit')}
                          trackColor={{ false: '#767577', true: '#81b0ff' }}
                          thumbColor={geofence.notifyOnExit ? '#0096ff' : '#f4f3f4'}
                        />
                      </View>
                    </View>
                    
                    {/* Status indicator */}
                    {geofence.id in lastGeofenceState && (
                      <View style={styles.statusIndicator}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Currently inside</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          {/* Location history */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location History</Text>
            {locationHistory.length === 0 ? (
              <Text style={styles.emptyText}>No location history available</Text>
            ) : (
              <View style={styles.historyList}>
                {locationHistory.slice(-5).reverse().map((historyItem, index) => (
                  <View key={index} style={styles.historyItem}>
                    <Text style={styles.historyTime}>
                      {new Date(historyItem.timestamp).toLocaleTimeString()}
                    </Text>
                    <Text style={styles.historyCoords}>
                      {historyItem.latitude.toFixed(6)}, {historyItem.longitude.toFixed(6)}
                    </Text>
                    {historyItem.accuracy && (
                      <Text style={styles.historyAccuracy}>
                        Accuracy: {historyItem.accuracy.toFixed(2)}m
                      </Text>
                    )}
                  </View>
                ))}
                {locationHistory.length > 5 && (
                  <Text style={styles.moreHistoryText}>
                    + {locationHistory.length - 5} more locations
                  </Text>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  controlPanel: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  trackingControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#0096ff',
  },
  startButton: {
    backgroundColor: '#34c759',
  },
  stopButton: {
    backgroundColor: '#ff3b30',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  addButton: {
    padding: 5,
  },
  locationInfo: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
  },
  locationText: {
    fontSize: 14,
    marginBottom: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    marginTop: 10,
  },
  userMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 150, 255, 0.3)',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarkerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0096ff',
  },
  geofenceMarker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  networkIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  networkText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  mapControls: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  mapButton: {
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  addGeofenceForm: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  radiusSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  radiusButton: {
    backgroundColor: '#0096ff',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  radiusValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addGeofenceButton: {
    backgroundColor: '#34c759',
  },
  geofenceList: {
    marginTop: 10,
  },
  geofenceItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  selectedGeofence: {
    borderWidth: 2,
    borderColor: '#0096ff',
  },
  geofenceItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  geofenceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  geofenceDetails: {
    fontSize: 14,
    marginBottom: 10,
  },
  notificationToggles: {
    marginTop: 5,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  toggleLabel: {
    fontSize: 14,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: 'rgba(52, 199, 89, 0.2)',
    padding: 5,
    borderRadius: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34c759',
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    color: '#34c759',
    fontWeight: 'bold',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#999',
    textAlign: 'center',
    marginVertical: 10,
  },
  historyList: {
    marginTop: 5,
  },
  historyItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  historyTime: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  historyCoords: {
    fontSize: 13,
  },
  historyAccuracy: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  moreHistoryText: {
    textAlign: 'center',
    color: '#0096ff',
    marginTop: 5,
  },
});

export default LocationTrackingScreen;