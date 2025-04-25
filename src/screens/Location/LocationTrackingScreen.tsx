import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Alert, Platform, AppState } from 'react-native';
import { Text, Button, FAB, Switch, Card, Title, Paragraph, IconButton } from 'react-native-paper';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

const LOCATION_TRACKING = 'location-tracking';
const LOCATION_TRACKING_INTERVAL = 10000; // 10 seconds

// Define the task for background location tracking
TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.error('Error in background location task:', error);
    return;
  }
  
  if (data) {
    const { locations } = data;
    const location = locations[0];
    
    if (location) {
      try {
        // Store location in AsyncStorage for offline support
        const { latitude, longitude, timestamp } = location.coords;
        const locationData = {
          latitude,
          longitude,
          timestamp,
          accuracy: location.coords.accuracy,
          altitude: location.coords.altitude,
          speed: location.coords.speed,
        };
        
        // Get existing locations
        const storedLocations = await AsyncStorage.getItem('tracked-locations');
        const locations = storedLocations ? JSON.parse(storedLocations) : [];
        
        // Add new location
        locations.push(locationData);
        
        // Store updated locations
        await AsyncStorage.setItem('tracked-locations', JSON.stringify(locations));
        
        // Try to sync with server if online
        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected && netInfo.isInternetReachable) {
          await syncLocationsWithServer();
        }
      } catch (error) {
        console.error('Error storing location:', error);
      }
    }
  }
});

export default function LocationTrackingScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(true);
  const [mapType, setMapType] = useState('standard');
  const [geofences, setGeofences] = useState([]);
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [isAddingGeofence, setIsAddingGeofence] = useState(false);
  const [newGeofenceName, setNewGeofenceName] = useState('');
  const [newGeofenceRadius, setNewGeofenceRadius] = useState(100);
  const mapRef = useRef(null);
  const { user } = useAuth();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    (async () => {
      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      
      // Request background permissions on iOS
      if (Platform.OS === 'ios') {
        const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
        if (backgroundPermission.status !== 'granted') {
          Alert.alert(
            'Background Location Access',
            'Background location access is required for continuous tracking. Please enable it in settings.'
          );
        }
      }
      
      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Load tracking history
      loadTrackingHistory();
      
      // Load geofences
      loadGeofences();
    })();
    
    // Listen for app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App has come to the foreground
        refreshLocation();
      }
      
      appState.current = nextAppState;
    });
    
    return () => {
      subscription.remove();
      stopLocationTracking();
    };
  }, []);

  const refreshLocation = async () => {
    try {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      
      // Check if inside any geofence
      checkGeofences(currentLocation);
    } catch (error) {
      console.error('Error refreshing location:', error);
    }
  };

  const startLocationTracking = async () => {
    try {
      await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: LOCATION_TRACKING_INTERVAL,
        distanceInterval: 10, // minimum distance (meters) before update
        foregroundService: {
          notificationTitle: 'Location Tracking',
          notificationBody: 'Tracking your location for field operations',
          notificationColor: theme.colors.primary,
        },
        activityType: Location.ActivityType.Other,
        showsBackgroundLocationIndicator: true,
      });
      
      setIsTracking(true);
      
      // Start foreground updates as well
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: LOCATION_TRACKING_INTERVAL,
          distanceInterval: 10,
        },
        (newLocation) => {
          setLocation(newLocation);
          
          // Add to tracking history
          setTrackingHistory(prev => [...prev, {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
            timestamp: newLocation.timestamp,
          }]);
          
          // Check if inside any geofence
          checkGeofences(newLocation);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      Alert.alert('Error', 'Failed to start location tracking');
    }
  };

  const stopLocationTracking = async () => {
    try {
      const isTracking = await Location.hasStartedLocationUpdatesAsync(LOCATION_TRACKING);
      
      if (isTracking) {
        await Location.stopLocationUpdatesAsync(LOCATION_TRACKING);
      }
      
      setIsTracking(false);
      
      // Save tracking history
      saveTrackingHistory();
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  };

  const loadTrackingHistory = async () => {
    try {
      // Load from local storage first
      const storedHistory = await AsyncStorage.getItem('tracking-history');
      if (storedHistory) {
        setTrackingHistory(JSON.parse(storedHistory));
      }
      
      // Then try to load from server
      const { data, error } = await supabase
        .from('location_history')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: true });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const formattedHistory = data.map(item => ({
          latitude: item.latitude,
          longitude: item.longitude,
          timestamp: new Date(item.timestamp).getTime(),
        }));
        
        setTrackingHistory(formattedHistory);
      }
    } catch (error) {
      console.error('Error loading tracking history:', error);
    }
  };

  const saveTrackingHistory = async () => {
    try {
      // Save to local storage
      await AsyncStorage.setItem('tracking-history', JSON.stringify(trackingHistory));
      
      // Try to sync with server
      await syncLocationsWithServer();
    } catch (error) {
      console.error('Error saving tracking history:', error);
    }
  };

  const syncLocationsWithServer = async () => {
    try {
      const storedLocations = await AsyncStorage.getItem('tracked-locations');
      if (!storedLocations) return;
      
      const locations = JSON.parse(storedLocations);
      if (locations.length === 0) return;
      
      // Format for database
      const locationsForDb = locations.map(loc => ({
        user_id: user.id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: new Date(loc.timestamp).toISOString(),
        accuracy: loc.accuracy,
        altitude: loc.altitude,
        speed: loc.speed,
      }));
      
      // Insert into database
      const { error } = await supabase
        .from('location_history')
        .insert(locationsForDb);
      
      if (error) throw error;
      
      // Clear synced locations
      await AsyncStorage.removeItem('tracked-locations');
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  // Load geofences from database
  const loadGeofences = async () => {
    try {
      const { data, error } = await supabase
        .from('geofences')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      if (data) {
        setGeofences(data);
      }
    } catch (error) {
      console.error('Error loading geofences:', error);
    }
  };

  // Check if current location is inside any geofence
  const checkGeofences = (currentLocation) => {
    if (!currentLocation || geofences.length === 0) return;
    
    const { latitude, longitude } = currentLocation.coords;
    
    geofences.forEach(geofence => {
      const distance = calculateDistance(
        latitude,
        longitude,
        geofence.latitude,
        geofence.longitude
      );
      
      // If inside geofence radius
      if (distance <= geofence.radius) {
        // Check if we need to send an alert (only if not already inside)
        if (!geofence.isInside) {
          Alert.alert(
            'Geofence Alert',
            `You have entered: ${geofence.name}`
          );
          
          // Log entry event
          logGeofenceEvent(geofence.id, 'enter');
        }
        
        // Update geofence status
        setGeofences(prev => 
          prev.map(g => 
            g.id === geofence.id ? { ...g, isInside: true } : g
          )
        );
      } else if (geofence.isInside) {
        // If was inside but now outside
        Alert.alert(
          'Geofence Alert',
          `You have left: ${geofence.name}`
        );
        
        // Log exit event
        logGeofenceEvent(geofence.id, 'exit');
        
        // Update geofence status
        setGeofences(prev => 
          prev.map(g => 
            g.id === geofence.id ? { ...g, isInside: false } : g
          )
        );
      }
    });
  };

  // Calculate distance between two coordinates in meters
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

  // Log geofence entry/exit events
  const logGeofenceEvent = async (geofenceId, eventType) => {
    try {
      const { error } = await supabase
        .from('geofence_events')
        .insert({
          user_id: user.id,
          geofence_id: geofenceId,
          event_type: eventType,
          timestamp: new Date().toISOString(),
        });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error logging geofence event:', error);
    }
  };

  // Add a new geofence
  const addGeofence = async () => {
    if (!location || !newGeofenceName.trim()) {
      Alert.alert('Error', 'Please provide a name for the geofence');
      return;
    }

    try {
      const { latitude, longitude } = location.coords;
      
      const { data, error } = await supabase
        .from('geofences')
        .insert({
          user_id: user.id,
          name: newGeofenceName,
          latitude,
          longitude,
          radius: newGeofenceRadius,
          created_at: new Date().toISOString(),
        })
        .select();
      
      if (error) throw error;
      
      if (data) {
        setGeofences(prev => [...prev, { ...data[0], isInside: false }]);
        setIsAddingGeofence(false);
        setNewGeofenceName('');
        setNewGeofenceRadius(100);
        
        Alert.alert('Success', 'Geofence added successfully');
      }
    } catch (error) {
      console.error('Error adding geofence:', error);
      Alert.alert('Error', 'Failed to add geofence');
    }
  };

  // Delete a geofence
  const deleteGeofence = async (id) => {
    try {
      const { error } = await supabase
        .from('geofences')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setGeofences(prev => prev.filter(g => g.id !== id));
      setSelectedGeofence(null);
      
      Alert.alert('Success', 'Geofence deleted successfully');
    } catch (error) {
      console.error('Error deleting geofence:', error);
      Alert.alert('Error', 'Failed to delete geofence');
    }
  };

  // Toggle map type
  const toggleMapType = () => {
    setMapType(prev => prev === 'standard' ? 'satellite' : 'standard');
  };

  // Center map on current location
  const centerOnLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      {errorMsg ? (
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={48} color={theme.colors.error} />
          <Text style={styles.errorText}>{errorMsg}</Text>
          <Button 
            mode="contained" 
            onPress={() => navigation.goBack()}
            style={styles.errorButton}
          >
            Go Back
          </Button>
        </View>
      ) : (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            mapType={mapType}
            showsUserLocation
            showsMyLocationButton={false}
            showsCompass
            showsScale
            initialRegion={
              location
                ? {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }
                : {
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }
            }
          >
            {/* Current location marker */}
            {location && (
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Current Location"
                description="You are here"
              >
                <MaterialCommunityIcons name="crosshairs-gps" size={24} color={theme.colors.primary} />
              </Marker>
            )}
            
            {/* Tracking history polyline */}
            {showHistory && trackingHistory.length > 1 && (
              <Polyline
                coordinates={trackingHistory.map(point => ({
                  latitude: point.latitude,
                  longitude: point.longitude,
                }))}
                strokeColor={theme.colors.primary}
                strokeWidth={3}
              />
            )}
            
            {/* Geofence circles */}
            {geofences.map(geofence => (
              <Circle
                key={geofence.id}
                center={{
                  latitude: geofence.latitude,
                  longitude: geofence.longitude,
                }}
                radius={geofence.radius}
                strokeColor={geofence.isInside ? theme.colors.accent : theme.colors.primary}
                fillColor={geofence.isInside 
                  ? `${theme.colors.accent}40` // 25% opacity
                  : `${theme.colors.primary}20` // 12% opacity
                }
                onPress={() => setSelectedGeofence(geofence)}
              />
            ))}
          </MapView>
          
          {/* Map controls */}
          <View style={styles.mapControls}>
            <IconButton
              icon="crosshairs-gps"
              size={24}
              color={theme.colors.primary}
              style={styles.mapButton}
              onPress={centerOnLocation}
            />
            <IconButton
              icon={mapType === 'standard' ? 'satellite-variant' : 'map'}
              size={24}
              color={theme.colors.primary}
              style={styles.mapButton}
              onPress={toggleMapType}
            />
            <IconButton
              icon="history"
              size={24}
              color={showHistory ? theme.colors.primary : theme.colors.disabled}
              style={styles.mapButton}
              onPress={() => setShowHistory(!showHistory)}
            />
          </View>
          
          {/* Tracking controls */}
          <Card style={styles.controlCard}>
            <Card.Content>
              <View style={styles.trackingControls}>
                <View style={styles.trackingStatus}>
                  <Title>Location Tracking</Title>
                  <Switch
                    value={isTracking}
                    onValueChange={val => {
                      if (val) {
                        startLocationTracking();
                      } else {
                        stopLocationTracking();
                      }
                    }}
                    color={theme.colors.primary}
                  />
                </View>
                <Paragraph>
                  {isTracking 
                    ? 'Tracking is active. Your location is being recorded.'
                    : 'Tracking is inactive. Toggle the switch to start tracking.'}
                </Paragraph>
                
                {trackingHistory.length > 0 && (
                  <View style={styles.statsContainer}>
                    <Text style={styles.statsText}>
                      Points: {trackingHistory.length}
                    </Text>
                    {trackingHistory.length > 0 && (
                      <Text style={styles.statsText}>
                        Since: {new Date(trackingHistory[0].timestamp).toLocaleTimeString()}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            </Card.Content>
          </Card>
          
          {/* Selected geofence details */}
          {selectedGeofence && (
            <Card style={styles.geofenceCard}>
              <Card.Title 
                title={selectedGeofence.name}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="close"
                    onPress={() => setSelectedGeofence(null)}
                  />
                )}
              />
              <Card.Content>
                <Paragraph>Radius: {selectedGeofence.radius}m</Paragraph>
                <Paragraph>
                  Status: {selectedGeofence.isInside ? 'Inside' : 'Outside'}
                </Paragraph>
                <Button
                  mode="outlined"
                  icon="delete"
                  onPress={() => deleteGeofence(selectedGeofence.id)}
                  style={styles.deleteButton}
                >
                  Delete Geofence
                </Button>
              </Card.Content>
            </Card>
          )}
          
          {/* Add geofence FAB */}
          <FAB
            style={styles.fab}
            icon="map-marker-plus"
            onPress={() => setIsAddingGeofence(true)}
          />
          
          {/* Add geofence dialog */}
          {isAddingGeofence && (
            <Card style={styles.addGeofenceCard}>
              <Card.Title 
                title="Add Geofence"
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="close"
                    onPress={() => setIsAddingGeofence(false)}
                  />
                )}
              />
              <Card.Content>
                <TextInput
                  label="Geofence Name"
                  value={newGeofenceName}
                  onChangeText={setNewGeofenceName}
                  style={styles.input}
                />
                <TextInput
                  label="Radius (meters)"
                  value={newGeofenceRadius.toString()}
                  onChangeText={(text) => {
                    const value = parseInt(text);
                    if (!isNaN(value) && value > 0) {
                      setNewGeofenceRadius(value);
                    }
                  }}
                  keyboardType="numeric"
                  style={styles.input}
                />
                <Button
                  mode="contained"
                  onPress={addGeofence}
                  style={styles.addButton}
                >
                  Add Geofence at Current Location
                </Button>
              </Card.Content>
            </Card>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
  },
  errorButton: {
    marginTop: 20,
  },
  mapControls: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  mapButton: {
    margin: 0,
  },
  controlCard: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  trackingControls: {
    width: '100%',
  },
  trackingStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
  geofenceCard: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 70,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  deleteButton: {
    marginTop: 10,
  },
  addGeofenceCard: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  input: {
    marginBottom: 10,
  },
  addButton: {
    marginTop: 10,
  },
});