import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, Button, Card, Title, TextInput, Avatar, ActivityIndicator, Divider, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';
import { useAuth } from '../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    emergency_contact: '',
    notifications_enabled: true,
  });
  const [avatarUrl, setAvatarUrl] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch user profile
      const { data, error } = await supabase
        .from('worker_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      setProfile(data);
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        address: data.address || '',
        emergency_contact: data.emergency_contact || '',
        notifications_enabled: data.notifications_enabled !== false, // default to true
      });
      
      // Get avatar URL if exists
      if (data.avatar_url) {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('avatars')
          .createSignedUrl(data.avatar_url, 3600); // 1 hour expiry
        
        if (!fileError) {
          setAvatarUrl(fileData.signedUrl);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('worker_profiles')
        .update({
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          emergency_contact: formData.emergency_contact.trim(),
          notifications_enabled: formData.notifications_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setIsSaving(true);
        
        // Compress and resize the image
        const processedImage = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 300, height: 300 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );
        
        // Generate a unique filename
        const fileExt = 'jpg';
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        // Upload the image to storage
        const formData = new FormData();
        formData.append('file', {
          uri: processedImage.uri,
          name: fileName,
          type: 'image/jpeg',
        });
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, formData);
        
        if (uploadError) throw uploadError;
        
        // Update profile with new avatar URL
        const { error: updateError } = await supabase
          .from('worker_profiles')
          .update({
            avatar_url: filePath,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id);
        
        if (updateError) throw updateError;
        
        // Refresh profile
        fetchProfile();
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      Alert.alert('Error', 'Failed to update profile picture');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              console.error('Error signing out:', error);
              Alert.alert('Error', 'Failed to sign out');
            }
          }
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={pickImage} disabled={isSaving}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              ) : (
                <Avatar.Text 
                  size={100} 
                  label={formData.name.split(' ').map(n => n[0]).join('').toUpperCase()} 
                  style={styles.avatar}
                />
              )}
              <View style={styles.editAvatarButton}>
                <MaterialCommunityIcons name="camera" size={20} color="white" />
              </View>
            </TouchableOpacity>
            <Title style={styles.userName}>{formData.name}</Title>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          {isEditing ? (
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  mode="outlined"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                  style={styles.input}
                  disabled={isSaving}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  mode="outlined"
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                  keyboardType="phone-pad"
                  style={styles.input}
                  disabled={isSaving}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <TextInput
                  mode="outlined"
                  value={formData.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                  disabled={isSaving}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Emergency Contact</Text>
                <TextInput
                  mode="outlined"
                  value={formData.emergency_contact}
                  onChangeText={(text) => handleInputChange('emergency_contact', text)}
                  style={styles.input}
                  disabled={isSaving}
                />
              </View>
              
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Enable Notifications</Text>
                <Switch
                  value={formData.notifications_enabled}
                  onValueChange={(value) => handleInputChange('notifications_enabled', value)}
                  disabled={isSaving}
                />
              </View>
              
              <View style={styles.buttonGroup}>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setIsEditing(false);
                    // Reset form data to original values
                    if (profile) {
                      setFormData({
                        name: profile.name || '',
                        phone: profile.phone || '',
                        address: profile.address || '',
                        emergency_contact: profile.emergency_contact || '',
                        notifications_enabled: profile.notifications_enabled !== false,
                      });
                    }
                  }}
                  style={styles.button}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSaveProfile}
                  style={styles.button}
                  loading={isSaving}
                  disabled={isSaving}
                >
                  Save Changes
                </Button>
              </View>
            </View>
          ) : (
            <View>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>
                  <MaterialCommunityIcons name="phone" size={18} color={theme.colors.primary} />
                  {' '}Phone
                </Text>
                <Text style={styles.infoValue}>
                  {profile?.phone || 'Not provided'}
                </Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>
                  <MaterialCommunityIcons name="map-marker" size={18} color={theme.colors.primary} />
                  {' '}Address
                </Text>
                <Text style={styles.infoValue}>
                  {profile?.address || 'Not provided'}
                </Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>
                  <MaterialCommunityIcons name="account-alert" size={18} color={theme.colors.primary} />
                  {' '}Emergency Contact
                </Text>
                <Text style={styles.infoValue}>
                  {profile?.emergency_contact || 'Not provided'}
                </Text>
              </View>
              
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>
                  <MaterialCommunityIcons name="bell" size={18} color={theme.colors.primary} />
                  {' '}Notifications
                </Text>
                <Text style={styles.infoValue}>
                  {profile?.notifications_enabled !== false ? 'Enabled' : 'Disabled'}
                </Text>
              </View>
              
              <Button
                mode="contained"
                icon="account-edit"
                onPress={() => setIsEditing(true)}
                style={styles.editButton}
              >
                Edit Profile
              </Button>
            </View>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.actionsContainer}>
            <Button
              mode="outlined"
              icon="shield-account"
              onPress={() => navigation.navigate('ChangePassword')}
              style={styles.actionButton}
            >
              Change Password
            </Button>
            
            <Button
              mode="outlined"
              icon="logout"
              onPress={handleSignOut}
              style={[styles.actionButton, styles.signOutButton]}
            >
              Sign Out
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editAvatarButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    marginTop: 12,
    fontSize: 22,
  },
  userEmail: {
    color: theme.colors.backdrop,
  },
  divider: {
    marginVertical: 16,
  },
  formContainer: {
    marginVertical: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    color: theme.colors.backdrop,
  },
  input: {
    backgroundColor: 'white',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 16,
    color: theme.colors.backdrop,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    paddingLeft: 24,
  },
  editButton: {
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 8,
  },
  actionButton: {
    marginVertical: 8,
  },
  signOutButton: {
    borderColor: theme.colors.error,
    color: theme.colors.error,
  },
});