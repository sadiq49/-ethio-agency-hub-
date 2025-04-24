import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../lib/supabase';

// Keys for AsyncStorage
const PENDING_DOCUMENTS_KEY = 'pending_documents';
const OFFLINE_DATA_KEY = 'offline_data';

// Initialize offline manager
export async function initializeOfflineManager() {
  // Set up network status listener
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      syncPendingData();
    }
  });
}

// Save document for offline submission
export async function saveDocumentForOfflineSubmission(documentData, imageUri) {
  try {
    // Get existing pending documents
    const pendingDocumentsJson = await AsyncStorage.getItem(PENDING_DOCUMENTS_KEY);
    const pendingDocuments = pendingDocumentsJson ? JSON.parse(pendingDocumentsJson) : [];
    
    // Add new document to pending list
    pendingDocuments.push({
      id: Date.now().toString(), // Temporary ID
      data: documentData,
      imageUri,
      timestamp: new Date().toISOString()
    });
    
    // Save updated list
    await AsyncStorage.setItem(PENDING_DOCUMENTS_KEY, JSON.stringify(pendingDocuments));
    
    return true;
  } catch (error) {
    console.error('Error saving document for offline submission:', error);
    return false;
  }
}

// Get all pending documents
export async function getPendingDocuments() {
  try {
    const pendingDocumentsJson = await AsyncStorage.getItem(PENDING_DOCUMENTS_KEY);
    return pendingDocumentsJson ? JSON.parse(pendingDocumentsJson) : [];
  } catch (error) {
    console.error('Error getting pending documents:', error);
    return [];
  }
}

// Sync pending documents when online
export async function syncPendingData() {
  try {
    const isConnected = (await NetInfo.fetch()).isConnected;
    if (!isConnected) return false;
    
    const pendingDocuments = await getPendingDocuments();
    if (pendingDocuments.length === 0) return true;
    
    let successCount = 0;
    
    // Process each pending document
    for (const pendingDoc of pendingDocuments) {
      try {
        // Upload image to storage
        const fileExt = 'jpg';
        const fileName = `${pendingDoc.data.worker_id}_${Date.now()}.${fileExt}`;
        const filePath = `${pendingDoc.data.worker_id}/${fileName}`;
        
        // Create form data for image upload
        const formData = new FormData();
        formData.append('file', {
          uri: pendingDoc.imageUri,
          name: fileName,
          type: 'image/jpeg',
        });
        
        // Upload the image
        const { error: uploadError } = await supabase.storage
          .from('document-files')
          .upload(filePath, formData);
        
        if (uploadError) throw uploadError;
        
        // Create document record
        const { error: insertError } = await supabase
          .from('documents')
          .insert({
            ...pendingDoc.data,
            file_path: filePath,
            submitted_at: new Date().toISOString(),
          });
        
        if (insertError) throw insertError;
        
        successCount++;
      } catch (error) {
        console.error(`Error syncing document ${pendingDoc.id}:`, error);
      }
    }
    
    // Remove successfully synced documents
    if (successCount > 0) {
      const remainingDocs = pendingDocuments.slice(successCount);
      await AsyncStorage.setItem(PENDING_DOCUMENTS_KEY, JSON.stringify(remainingDocs));
    }
    
    return successCount > 0;
  } catch (error) {
    console.error('Error syncing pending data:', error);
    return false;
  }
}

// Cache data for offline use
export async function cacheDataForOffline(key, data) {
  try {
    const offlineDataJson = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
    const offlineData = offlineDataJson ? JSON.parse(offlineDataJson) : {};
    
    offlineData[key] = {
      data,
      timestamp: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(OFFLINE_DATA_KEY, JSON.stringify(offlineData));
    return true;
  } catch (error) {
    console.error('Error caching data for offline use:', error);
    return false;
  }
}

// Get cached data
export async function getCachedData(key) {
  try {
    const offlineDataJson = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
    const offlineData = offlineDataJson ? JSON.parse(offlineDataJson) : {};
    
    return offlineData[key]?.data || null;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
}

// Check if cached data is expired (older than maxAge in milliseconds)
export async function isCacheExpired(key, maxAge) {
  try {
    const offlineDataJson = await AsyncStorage.getItem(OFFLINE_DATA_KEY);
    const offlineData = offlineDataJson ? JSON.parse(offlineDataJson) : {};
    
    if (!offlineData[key]) return true;
    
    const cachedTime = new Date(offlineData[key].timestamp).getTime();
    const currentTime = new Date().getTime();
    
    return (currentTime - cachedTime) > maxAge;
  } catch (error) {
    console.error('Error checking cache expiration:', error);
    return true;
  }
}

// Clear all cached data
export async function clearCache() {
  try {
    await AsyncStorage.removeItem(OFFLINE_DATA_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing cache:', error);
    return false;
  }
}