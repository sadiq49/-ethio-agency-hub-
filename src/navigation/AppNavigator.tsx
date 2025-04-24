import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { theme } from '../theme';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/Auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChangePasswordScreen from '../screens/Auth/ChangePasswordScreen';

// Document Screens
import { DocumentListScreen } from '../screens/DocumentProcessing/DocumentListScreen';
import { DocumentDetailScreen } from '../screens/DocumentProcessing/DocumentDetailScreen';
import { SubmitDocumentScreen } from '../screens/DocumentProcessing/SubmitDocumentScreen';

// Training Screens
import TrainingListScreen from '../screens/Training/TrainingListScreen';
import TrainingDetailScreen from '../screens/Training/TrainingDetailScreen';

// Notification Screens
import NotificationScreen from '../screens/NotificationScreen';

// Initialize stacks and tabs
const AuthStack = createStackNavigator();
const MainStack = createStackNavigator();
const DocumentStack = createStackNavigator();
const TrainingStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: '#fff',
    }}
  >
    <AuthStack.Screen 
      name="Login" 
      component={LoginScreen} 
      options={{ headerShown: false }}
    />
    <AuthStack.Screen 
      name="Register" 
      component={RegisterScreen} 
      options={{ title: 'Create Account' }}
    />
    <AuthStack.Screen 
      name="ForgotPassword" 
      component={ForgotPasswordScreen} 
      options={{ title: 'Reset Password' }}
    />
  </AuthStack.Navigator>
);

// Document Navigator
const DocumentNavigator = () => (
  <DocumentStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: '#fff',
    }}
  >
    <DocumentStack.Screen 
      name="DocumentList" 
      component={DocumentListScreen} 
      options={{ title: 'Documents' }}
    />
    <DocumentStack.Screen 
      name="DocumentDetail" 
      component={DocumentDetailScreen} 
      options={{ title: 'Document Details' }}
    />
    <DocumentStack.Screen 
      name="SubmitDocument" 
      component={SubmitDocumentScreen} 
      options={{ title: 'Submit Document' }}
    />
  </DocumentStack.Navigator>
);

// Training Navigator
const TrainingNavigator = () => (
  <TrainingStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: '#fff',
    }}
  >
    <TrainingStack.Screen 
      name="TrainingList" 
      component={TrainingListScreen} 
      options={{ title: 'Training Modules' }}
    />
    <TrainingStack.Screen 
      name="TrainingDetail" 
      component={TrainingDetailScreen} 
      options={({ route }) => ({ title: route.params.title || 'Training' })}
    />
  </TrainingStack.Navigator>
);

// Profile Navigator
const ProfileNavigator = () => (
  <ProfileStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTintColor: '#fff',
    }}
  >
    <ProfileStack.Screen 
      name="Profile" 
      component={ProfileScreen} 
      options={{ title: 'My Profile' }}
    />
    <ProfileStack.Screen 
      name="ChangePassword" 
      component={ChangePasswordScreen} 
      options={{ title: 'Change Password' }}
    />
  </ProfileStack.Navigator>
);

// Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.backdrop,
      tabBarStyle: {
        paddingBottom: 5,
        paddingTop: 5,
      },
    }}
  >
    <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="home" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen 
      name="Documents" 
      component={DocumentNavigator} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="file-document" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen 
      name="Training" 
      component={TrainingNavigator} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="school" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
    <Tab.Screen 
      name="Notifications" 
      component={NotificationScreen} 
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="bell" color={color} size={size} />
        ),
      }}
    />
    <Tab.Screen 
      name="ProfileTab" 
      component={ProfileNavigator} 
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);

// Main Navigator
const MainNavigator = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name="Tabs" component={TabNavigator} />
  </MainStack.Navigator>
);

// App Navigator
export default function AppNavigator() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}