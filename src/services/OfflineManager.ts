import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../lib/supabase';

// Queue for storing operations to be performed when back online
interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  table: string;
  data: any;
  timestamp: number;
}

// Check if a resource is downloaded for offline use
export const isDownloadedForOffline = async (resourceId: string): Promise<boolean> => {
  try {
    const offlineDir = `${FileSystem.documentDirectory}offline/`;
    const fileInfo = await FileSystem.getInfoAsync(`${offlineDir}${resourceId}`);
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking offline status:', error);
    return false;
  }
};

// Download a resource for offline use
export const downloadForOffline = async (
  resourceId: string,
  url: string,
  title: string
): Promise<void> => {
  try {
    // Create offline directory if it doesn't exist
    const offlineDir = `${FileSystem.documentDirectory}offline/`;
    const dirInfo = await FileSystem.getInfoAsync(offlineDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(offlineDir, { intermediates: true });
    }
    
    // Download the file
    const fileUri = `${offlineDir}${resourceId}`;
    await FileSystem.downloadAsync(url, fileUri);
    
    // Store metadata
    await AsyncStorage.setItem(`offline_meta_${resourceId}`, JSON.stringify({
      title,
      url,
      timestamp: Date.now()
    }));
    
  } catch (error) {
    console.error('Error downloading for offline use:', error);
    throw error;
  }
};

// Remove a resource from offline storage
export const removeFromOffline = async (resourceId: string): Promise<void> => {
  try {
    const offlineDir = `${FileSystem.documentDirectory}offline/`;
    const fileUri = `${offlineDir}${resourceId}`;
    
    // Delete the file
    await FileSystem.deleteAsync(fileUri, { idempotent: true });
    
    // Remove metadata
    await AsyncStorage.removeItem(`offline_meta_${resourceId}`);
  } catch (error) {
    console.error('Error removing offline resource:', error);
    throw error;
  }
};

// Queue an operation to be performed when back online
export const queueOperation = async (
  type: 'create' | 'update' | 'delete',
  table: string,
  data: any
): Promise<string> => {
  try {
    // Get existing queue
    const queueString = await AsyncStorage.getItem('offline_operation_queue') || '[]';
    const queue: QueuedOperation[] = JSON.parse(queueString);
    
    // Create new operation
    const operationId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newOperation: QueuedOperation = {
      id: operationId,
      type,
      table,
      data,
      timestamp: Date.now()
    };
    
    // Add to queue and save
    queue.push(newOperation);
    await AsyncStorage.setItem('offline_operation_queue', JSON.stringify(queue));
    
    return operationId;
  } catch (error) {
    console.error('Error queuing offline operation:', error);
    throw error;
  }
};

// Process queued operations when back online
export const processQueue = async (): Promise<void> => {
  try {
    // Check if online
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return; // Still offline
    }
    
    // Get queue
    const queueString = await AsyncStorage.getItem('offline_operation_queue') || '[]';
    const queue: QueuedOperation[] = JSON.parse(queueString);
    
    if (queue.length === 0) {
      return; // Nothing to process
    }
    
    // Process each operation
    const failedOperations: QueuedOperation[] = [];
    
    for (const operation of queue) {
      try {
        switch (operation.type) {
          case 'create':
            await supabase.from(operation.table).insert(operation.data);
            break;
          case 'update':
            await supabase.from(operation.table).update(operation.data.updates)
              .match(operation.data.match);
            break;
          case 'delete':
            await supabase.from(operation.table).delete()
              .match(operation.data);
            break;
        }
      } catch (error) {
        console.error(`Error processing operation ${operation.id}:`, error);
        failedOperations.push(operation);
      }
    }
    
    // Save failed operations back to queue
    await AsyncStorage.setItem('offline_operation_queue', JSON.stringify(failedOperations));
    
  } catch (error) {
    console.error('Error processing offline queue:', error);
    throw error;
  }
};

// Set up network change listener to process queue when back online
export const setupOfflineSync = () => {
  NetInfo.addEventListener(state => {
    if (state.isConnected) {
      processQueue();
    }
  });
};

// Get all offline resources
export const getOfflineResources = async (): Promise<any[]> => {
  try {
    const offlineDir = `${FileSystem.documentDirectory}offline/`;
    const dirInfo = await FileSystem.getInfoAsync(offlineDir);
    
    if (!dirInfo.exists) {
      return [];
    }
    
    const files = await FileSystem.readDirectoryAsync(offlineDir);
    const resources = [];
    
    for (const file of files) {
      const metaString = await AsyncStorage.getItem(`offline_meta_${file}`);
      if (metaString) {
        const metadata = JSON.parse(metaString);
        resources.push({
          id: file,
          ...metadata,
          uri: `${offlineDir}${file}`
        });
      }
    }
    
    return resources;
  } catch (error) {
    console.error('Error getting offline resources:', error);
    return [];
  }
};

// Database schema for offline storage
const SCHEMA = {
  documents: 'id, title, description, status, created_at, updated_at, user_id, file_url, local_file_path, is_synced',
  training_materials: 'id, title, description, file_url, file_type, created_at, local_file_path',
  messages: 'id, conversation_id, sender_id, content, created_at, is_synced, local_id',
};

// Initialize offline database
export const initializeOfflineStorage = async () => {
  try {
    // Create directories for offline files
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'offline/', { intermediates: true });
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'offline/documents/', { intermediates: true });
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'offline/training/', { intermediates: true });
    
    // Initialize schema version
    const schemaVersion = await AsyncStorage.getItem('offline_schema_version');
    if (!schemaVersion || parseInt(schemaVersion) < 1) {
      // First-time setup or schema upgrade
      await AsyncStorage.setItem('offline_schema_version', '1');
      
      // Initialize empty tables
      for (const table of Object.keys(SCHEMA)) {
        await AsyncStorage.setItem(`offline_${table}`, JSON.stringify([]));
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing offline storage:', error);
    return false;
  }
};

// Check if device is online
export const isOnline = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected && netInfo.isInternetReachable;
};

// Download file for offline use
export const downloadForOffline = async (key, fileUrl, title) => {
  try {
    const fileExt = fileUrl.split('.').pop();
    const localFilePath = FileSystem.documentDirectory + `offline/${key}.${fileExt}`;
    
    const downloadResult = await FileSystem.downloadAsync(
      fileUrl,
      localFilePath
    );
    
    if (downloadResult.status === 200) {
      // Store metadata about downloaded file
      await AsyncStorage.setItem(`offline_file_${key}`, JSON.stringify({
        url: fileUrl,
        localPath: localFilePath,
        title: title,
        downloadedAt: new Date().toISOString()
      }));
      
      return { success: true, localPath: localFilePath };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error downloading file:', error);
    return { success: false, error };
  }
};

// Check if file is downloaded for offline use
export const isDownloadedForOffline = async (key) => {
  try {
    const fileMetadata = await AsyncStorage.getItem(`offline_file_${key}`);
    
    if (!fileMetadata) {
      return false;
    }
    
    const { localPath } = JSON.parse(fileMetadata);
    const fileInfo = await FileSystem.getInfoAsync(localPath);
    
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking offline file:', error);
    return false;
  }
};

// Get offline file path
export const getOfflineFilePath = async (key) => {
  try {
    const fileMetadata = await AsyncStorage.getItem(`offline_file_${key}`);
    
    if (!fileMetadata) {
      return null;
    }
    
    const { localPath } = JSON.parse(fileMetadata);
    const fileInfo = await FileSystem.getInfoAsync(localPath);
    
    if (fileInfo.exists) {
      return localPath;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting offline file path:', error);
    return null;
  }
};

// Save data for offline use
export const saveOfflineData = async (table, data) => {
  try {
    // Mark data as synced
    const preparedData = Array.isArray(data) 
      ? data.map(item => ({ ...item, is_synced: true }))
      : { ...data, is_synced: true };
    
    // Get existing data
    const existingDataStr = await AsyncStorage.getItem(`offline_${table}`);
    let existingData = existingDataStr ? JSON.parse(existingDataStr) : [];
    
    // Update or insert data
    if (Array.isArray(preparedData)) {
      // Batch update
      const updatedData = [...existingData];
      
      preparedData.forEach(item => {
        const index = updatedData.findIndex(existing => existing.id === item.id);
        
        if (index >= 0) {
          updatedData[index] = item;
        } else {
          updatedData.push(item);
        }
      });
      
      existingData = updatedData;
    } else {
      // Single item update
      const index = existingData.findIndex(item => item.id === preparedData.id);
      
      if (index >= 0) {
        existingData[index] = preparedData;
      } else {
        existingData.push(preparedData);
      }
    }
    
    // Save updated data
    await AsyncStorage.setItem(`offline_${table}`, JSON.stringify(existingData));
    
    return { success: true };
  } catch (error) {
    console.error(`Error saving offline data for ${table}:`, error);
    return { success: false, error };
  }
};

// Get offline data
export const getOfflineData = async (table, query = {}) => {
  try {
    const dataStr = await AsyncStorage.getItem(`offline_${table}`);
    if (!dataStr) return [];
    
    let data = JSON.parse(dataStr);
    
    // Apply simple filtering
    if (query) {
      Object.keys(query).forEach(key => {
        data = data.filter(item => item[key] === query[key]);
      });
    }
    
    return data;
  } catch (error) {
    console.error(`Error getting offline data for ${table}:`, error);
    return [];
  }
};

// Create offline data (for when offline)
export const createOfflineData = async (table, data) => {
  try {
    // Generate temporary ID
    const tempId = 'temp_' + new Date().getTime() + '_' + Math.random().toString(36).substring(2, 9);
    
    const newItem = {
      ...data,
      id: tempId,
      is_synced: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Get existing data
    const existingDataStr = await AsyncStorage.getItem(`offline_${table}`);
    const existingData = existingDataStr ? JSON.parse(existingDataStr) : [];
    
    // Add new item
    existingData.push(newItem);
    
    // Save updated data
    await AsyncStorage.setItem(`offline_${table}`, JSON.stringify(existingData));
    
    // Add to sync queue
    await addToSyncQueue(table, 'create', newItem);
    
    return { success: true, data: newItem };
  } catch (error) {
    console.error(`Error creating offline data for ${table}:`, error);
    return { success: false, error };
  }
};

// Update offline data
export const updateOfflineData = async (table, id, updates) => {
  try {
    // Get existing data
    const existingDataStr = await AsyncStorage.getItem(`offline_${table}`);
    if (!existingDataStr) return { success: false, error: 'No data found' };
    
    const existingData = JSON.parse(existingDataStr);
    const index = existingData.findIndex(item => item.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Item not found' };
    }
    
    // Update item
    const updatedItem = {
      ...existingData[index],
      ...updates,
      is_synced: false,
      updated_at: new Date().toISOString()
    };
    
    existingData[index] = updatedItem;
    
    // Save updated data
    await AsyncStorage.setItem(`offline_${table}`, JSON.stringify(existingData));
    
    // Add to sync queue
    await addToSyncQueue(table, 'update', updatedItem);
    
    return { success: true, data: updatedItem };
  } catch (error) {
    console.error(`Error updating offline data for ${table}:`, error);
    return { success: false, error };
  }
};

// Delete offline data
export const deleteOfflineData = async (table, id) => {
  try {
    // Get existing data
    const existingDataStr = await AsyncStorage.getItem(`offline_${table}`);
    if (!existingDataStr) return { success: false, error: 'No data found' };
    
    const existingData = JSON.parse(existingDataStr);
    const index = existingData.findIndex(item => item.id === id);
    
    if (index === -1) {
      return { success: false, error: 'Item not found' };
    }
    
    // Store item for sync queue
    const deletedItem = existingData[index];
    
    // Remove item
    existingData.splice(index, 1);
    
    // Save updated data
    await AsyncStorage.setItem(`offline_${table}`, JSON.stringify(existingData));
    
    // Add to sync queue if it's not a temporary item
    if (!id.startsWith('temp_')) {
      await addToSyncQueue(table, 'delete', deletedItem);
    }
    
    return { success: true };
  } catch (error) {
    console.error(`Error deleting offline data for ${table}:`, error);
    return { success: false, error };
  }
};

// Sync queue management
const addToSyncQueue = async (table, operation, data) => {
  try {
    const queueStr = await AsyncStorage.getItem('offline_sync_queue');
    const queue = queueStr ? JSON.parse(queueStr) : [];
    
    queue.push({
      table,
      operation,
      data,
      timestamp: new Date().getTime()
    });
    
    await AsyncStorage.setItem('offline_sync_queue', JSON.stringify(queue));
    
    return true;
  } catch (error) {
    console.error('Error adding to sync queue:', error);
    return false;
  }
};

// Sync data with server
export const syncWithServer = async () => {
  const isConnected = await isOnline();
  
  if (!isConnected) {
    return { success: false, error: 'No internet connection' };
  }
  
  try {
    const queueStr = await AsyncStorage.getItem('offline_sync_queue');
    if (!queueStr) return { success: true, message: 'No items to sync' };
    
    const queue = JSON.parse(queueStr);
    const results = [];
    const newQueue = [];
    
    for (const item of queue) {
      try {
        let result;
        
        switch (item.operation) {
          case 'create':
            // Handle temp IDs
            const createData = { ...item.data };
            delete createData.id;
            
            if (item.data.id.startsWith('temp_')) {
              result = await supabase.from(item.table).insert(createData).select().single();
            }
            break;
            
          case 'update':
            // Only sync non-temp items
            if (!item.data.id.startsWith('temp_')) {
              const updateData = { ...item.data };
              delete updateData.is_synced;
              
              result = await supabase.from(item.table).update(updateData).eq('id', item.data.id);
            }
            break;
            
          case 'delete':
            result = await supabase.from(item.table).delete().eq('id', item.data.id);
            break;
        }
        
        if (result?.error) {
          console.error(`Sync error for ${item.table}:`, result.error);
          newQueue.push(item);
        } else {
          results.push({ success: true, operation: item.operation, table: item.table });
          
          // If this was a create operation with a temp ID, update the local storage with the real ID
          if (item.operation === 'create' && item.data.id.startsWith('temp_') && result?.data) {
            await updateTempIdToRealId(item.table, item.data.id, result.data.id);
          }
        }
      } catch (error) {
        console.error(`Error syncing item for ${item.table}:`, error);
        newQueue.push(item);
      }
    }
    
    // Update sync queue with failed items
    await AsyncStorage.setItem('offline_sync_queue', JSON.stringify(newQueue));
    
    return { 
      success: true, 
      results,
      pendingItems: newQueue.length
    };
  } catch (error) {
    console.error('Error syncing with server:', error);
    return { success: false, error };
  }
};

// Update temporary ID to real ID after sync
const updateTempIdToRealId = async (table, tempId, realId) => {
  try {
    const dataStr = await AsyncStorage.getItem(`offline_${table}`);
    if (!dataStr) return;
    
    const data = JSON.parse(dataStr);
    const index = data.findIndex(item => item.id === tempId);
    
    if (index !== -1) {
      data[index].id = realId;
      data[index].is_synced = true;
      
      await AsyncStorage.setItem(`offline_${table}`, JSON.stringify(data));
    }
  } catch (error) {
    console.error('Error updating temp ID:', error);
  }
};

// Advanced Offline Capabilities

You can enhance your app with better offline capabilities by implementing a robust caching system:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../lib/supabase';

// Types for offline data
type OfflineAction = {
  id: string;
  table: string;
  type: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: number;
};

class OfflineManager {
  private isOnline: boolean = true;
  private syncInProgress: boolean = false;
  private listeners: Array<(online: boolean) => void> = [];

  constructor() {
    this.setupNetworkListener();
  }

  private setupNetworkListener() {
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected && state.isInternetReachable;
      
      if (!wasOnline && this.isOnline) {
        this.syncOfflineActions();
      }
      
      // Notify listeners of network state change
      this.listeners.forEach(listener => listener(this.isOnline));
    });
  }

  public addNetworkListener(listener: (online: boolean) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public async cacheData(key: string, data: any, expiryMinutes: number = 60) {
    try {
      const item = {
        data,
        expiry: Date.now() + expiryMinutes * 60 * 1000,
      };
      await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  public async getCachedData(key: string) {
    try {
      const value = await AsyncStorage.getItem(`cache_${key}`);
      if (!value) return null;
      
      const item = JSON.parse(value);
      if (Date.now() > item.expiry) {
        await AsyncStorage.removeItem(`cache_${key}`);
        return null;
      }
      
      return item.data;
    } catch (error) {
      console.error('Error getting cached data:', error);
      return null;
    }
  }

  public async queueOfflineAction(table: string, type: 'insert' | 'update' | 'delete', data: any) {
    if (this.isOnline) {
      // If online, perform the action directly
      return this.performDatabaseAction(table, type, data);
    }
    
    try {
      // Store action for later sync
      const actions = await this.getOfflineActions();
      const newAction: OfflineAction = {
        id: Date.now().toString(),
        table,
        type,
        data,
        timestamp: Date.now(),
      };
      
      actions.push(newAction);
      await AsyncStorage.setItem('offline_actions', JSON.stringify(actions));
      return { success: true, offline: true };
    } catch (error) {
      console.error('Error queuing offline action:', error);
      return { success: false, error };
    }
  }

  private async getOfflineActions(): Promise<OfflineAction[]> {
    try {
      const value = await AsyncStorage.getItem('offline_actions');
      return value ? JSON.parse(value) : [];
    } catch (error) {
      console.error('Error getting offline actions:', error);
      return [];
    }
  }

  public async syncOfflineActions() {
    if (this.syncInProgress || !this.isOnline) return;
    
    this.syncInProgress = true;
    
    try {
      const actions = await this.getOfflineActions();
      if (actions.length === 0) {
        this.syncInProgress = false;
        return;
      }
      
      // Sort actions by timestamp to maintain order
      actions.sort((a, b) => a.timestamp - b.timestamp);
      
      const results = [];
      const successfulIds = [];
      
      for (const action of actions) {
        try {
          const result = await this.performDatabaseAction(action.table, action.type, action.data);
          results.push({ id: action.id, success: true, result });
          successfulIds.push(action.id);
        } catch (error) {
          results.push({ id: action.id, success: false, error });
        }
      }
      
      // Remove successful actions
      if (successfulIds.length > 0) {
        const remainingActions = actions.filter(action => !successfulIds.includes(action.id));
        await AsyncStorage.setItem('offline_actions', JSON.stringify(remainingActions));
      }
      
      return results;
    } catch (error) {
      console.error('Error syncing offline actions:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async performDatabaseAction(table: string, type: 'insert' | 'update' | 'delete', data: any) {
    switch (type) {
      case 'insert':
        return await supabase.from(table).insert(data);
      case 'update':
        return await supabase.from(table).update(data.values).match(data.match);
      case 'delete':
        return await supabase.from(table).delete().match(data);
      default:
        throw new Error(`Unknown action type: ${type}`);
    }
  }
}

export const offlineManager = new OfflineManager();

// Enhanced offline data synchronization
export const syncOfflineData = async (): Promise<{
  success: boolean;
  syncedItems: number;
  errors: number;
}> => {
  try {
    // Check if online
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return { success: false, syncedItems: 0, errors: 0 };
    }
    
    // Get queue
    const queueString = await AsyncStorage.getItem('offline_operation_queue') || '[]';
    const queue: QueuedOperation[] = JSON.parse(queueString);
    
    if (queue.length === 0) {
      return { success: true, syncedItems: 0, errors: 0 };
    }
    
    // Process each operation
    let syncedItems = 0;
    let errors = 0;
    const failedOperations: QueuedOperation[] = [];
    
    for (const operation of queue) {
      try {
        switch (operation.type) {
          case 'create':
            await supabase.from(operation.table).insert(operation.data);
            syncedItems++;
            break;
          case 'update':
            await supabase.from(operation.table).update(operation.data.updates)
              .match(operation.data.match);
            syncedItems++;
            break;
          case 'delete':
            await supabase.from(operation.table).delete()
              .match(operation.data);
            syncedItems++;
            break;
        }
      } catch (error) {
        console.error(`Error processing operation ${operation.id}:`, error);
        failedOperations.push(operation);
        errors++;
      }
    }
    
    // Save failed operations back to queue
    await AsyncStorage.setItem('offline_operation_queue', JSON.stringify(failedOperations));
    
    return { success: true, syncedItems, errors };
  } catch (error) {
    console.error('Error syncing offline data:', error);
    return { success: false, syncedItems: 0, errors: 1 };
  }
};

// Cache data for offline use
export const cacheDataForOffline = async (
  key: string,
  data: any,
  expiryMinutes: number = 60
): Promise<void> => {
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + (expiryMinutes * 60 * 1000)
    };
    
    await AsyncStorage.setItem(`cache_${key}`, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Error caching data:', error);
    throw error;
  }
};

// Get cached data
export const getCachedData = async <T>(key: string): Promise<T | null> => {
  try {
    const cacheString = await AsyncStorage.getItem(`cache_${key}`);
    if (!cacheString) return null;
    
    const cacheItem = JSON.parse(cacheString);
    
    // Check if cache has expired
    if (Date.now() > cacheItem.expiry) {
      await AsyncStorage.removeItem(`cache_${key}`);
      return null;
    }
    
    return cacheItem.data as T;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
};

// Clear expired cache items
export const clearExpiredCache = async (): Promise<number> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith('cache_'));
    let clearedCount = 0;
    
    for (const key of cacheKeys) {
      const cacheString = await AsyncStorage.getItem(key);
      if (cacheString) {
        const cacheItem = JSON.parse(cacheString);
        if (Date.now() > cacheItem.expiry) {
          await AsyncStorage.removeItem(key);
          clearedCount++;
        }
      }
    }
    
    return clearedCount;
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    return 0;
  }
};