import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DocumentListScreen from '../screens/DocumentProcessing/DocumentListScreen';
import DocumentDetailScreen from '../screens/DocumentProcessing/DocumentDetailScreen';
import DocumentFiltersScreen from '../screens/DocumentProcessing/DocumentFiltersScreen';
import UploadDocumentScreen from '../screens/DocumentProcessing/UploadDocumentScreen';
import WorkerProfileScreen from '../screens/Workers/WorkerProfileScreen';

const Stack = createStackNavigator();

export default function DocumentProcessingNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DocumentList"
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen 
        name="DocumentList" 
        component={DocumentListScreen} 
        options={{ title: 'Documents' }}
      />
      <Stack.Screen 
        name="DocumentDetail" 
        component={DocumentDetailScreen} 
        options={{ title: 'Document Details' }}
      />
      <Stack.Screen 
        name="DocumentFilters" 
        component={DocumentFiltersScreen} 
        options={{ title: 'Filters' }}
      />
      <Stack.Screen 
        name="UploadDocument" 
        component={UploadDocumentScreen} 
        options={{ title: 'Upload Document' }}
      />
      <Stack.Screen 
        name="WorkerProfile" 
        component={WorkerProfileScreen} 
        options={{ title: 'Worker Profile' }}
      />
    </Stack.Navigator>
  );
}