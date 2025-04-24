import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/auth-context';

// Import screens (to be created)
import LoginScreen from '../screens/auth/login-screen';
import RegisterScreen from '../screens/auth/register-screen';
import ForgotPasswordScreen from '../screens/auth/forgot-password-screen';

// Worker Portal Screens
import WorkerProfileScreen from '../screens/worker/profile-screen';
import WorkerDocumentsScreen from '../screens/worker/documents-screen';
import WorkerTrainingScreen from '../screens/worker/training-screen';
import WorkerNotificationsScreen from '../screens/worker/notifications-screen';

// Agency Staff Portal Screens
import AgencyWorkerManagementScreen from '../screens/agency/worker-management-screen';
import AgencyDocumentProcessingScreen from '../screens/agency/document-processing-screen';
import AgencyTrainingManagementScreen from '../screens/agency/training-management-screen';
import AgencyReportsScreen from '../screens/agency/reports-screen';

// Shared Features Screens
import MessagingScreen from '../screens/shared/messaging-screen';
import CalendarScreen from '../screens/shared/calendar-screen';
import SupportScreen from '../screens/shared/support-screen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Worker Bottom Tab Navigator
const WorkerTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Profile" component={WorkerProfileScreen} />
      <Tab.Screen name="Documents" component={WorkerDocumentsScreen} />
      <Tab.Screen name="Training" component={WorkerTrainingScreen} />
      <Tab.Screen name="Notifications" component={WorkerNotificationsScreen} />
    </Tab.Navigator>
  );
};

// Agency Staff Bottom Tab Navigator
const AgencyTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Workers" component={AgencyWorkerManagementScreen} />
      <Tab.Screen name="Documents" component={AgencyDocumentProcessingScreen} />
      <Tab.Screen name="Training" component={AgencyTrainingManagementScreen} />
      <Tab.Screen name="Reports" component={AgencyReportsScreen} />
    </Tab.Navigator>
  );
};

// Shared Features Stack Navigator
const SharedFeaturesNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Messaging" component={MessagingScreen} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Support" component={SupportScreen} />
    </Stack.Navigator>
  );
};

// Auth Navigator
const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Main App Navigator
export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Return a loading screen
    return null;
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator>
          {/* Determine user type and show appropriate navigator */}
          <Stack.Screen name="WorkerPortal" component={WorkerTabNavigator} />
          <Stack.Screen name="AgencyPortal" component={AgencyTabNavigator} />
          <Stack.Screen name="SharedFeatures" component={SharedFeaturesNavigator} />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};