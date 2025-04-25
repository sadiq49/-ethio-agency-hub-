import { syncOfflineData, cacheDataForOffline, getCachedData } from '../../src/services/OfflineManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../../src/lib/supabase';

// Mock dependencies
jest.mock('@react-native-async-storage/async-storage');
jest.mock('@react-native-community/netinfo');
jest.mock('../../src/lib/supabase');

describe('OfflineManager', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('syncOfflineData', () => {
    it('should return early if device is offline', async () => {
      // Mock NetInfo to return offline
      NetInfo.fetch = jest.fn().mockResolvedValue({ isConnected: false });
      
      const result = await syncOfflineData();
      
      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
      expect(result).toEqual({ success: false, syncedItems: 0, errors: 0 });
    });

    it('should return early if queue is empty', async () => {
      // Mock NetInfo to return online
      NetInfo.fetch = jest.fn().mockResolvedValue({ isConnected: true });
      
      // Mock empty queue
      AsyncStorage.getItem = jest.fn().mockResolvedValue('[]');
      
      const result = await syncOfflineData();
      
      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offline_operation_queue');
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true, syncedItems: 0, errors: 0 });
    });

    it('should process queue items and update storage', async () => {
      // Mock NetInfo to return online
      NetInfo.fetch = jest.fn().mockResolvedValue({ isConnected: true });
      
      // Mock queue with items
      const mockQueue = [
        { id: '1', type: 'create', table: 'documents', data: { title: 'Test' } },
        { id: '2', type: 'update', table: 'documents', data: { updates: { title: 'Updated' }, match: { id: '123' } } },
      ];
      AsyncStorage.getItem = jest.fn().mockResolvedValue(JSON.stringify(mockQueue));
      
      // Mock supabase responses
      const mockInsert = jest.fn().mockResolvedValue({});
      const mockUpdate = jest.fn().mockResolvedValue({});
      const mockMatch = jest.fn().mockReturnValue({ update: mockUpdate });
      
      supabase.from = jest.fn().mockReturnValue({
        insert: mockInsert,
        update: mockUpdate,
        match: mockMatch,
      });
      
      const result = await syncOfflineData();
      
      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offline_operation_queue');
      expect(supabase.from).toHaveBeenCalledTimes(2);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('offline_operation_queue', '[]');
      expect(result).toEqual({ success: true, syncedItems: 2, errors: 0 });
    });

    it('should handle errors during sync', async () => {
      // Mock NetInfo to return online
      NetInfo.fetch = jest.fn().mockResolvedValue({ isConnected: true });
      
      // Mock queue with items
      const mockQueue = [
        { id: '1', type: 'create', table: 'documents', data: { title: 'Test' } },
      ];
      AsyncStorage.getItem = jest.fn().mockResolvedValue(JSON.stringify(mockQueue));
      
      // Mock supabase to throw error
      supabase.from = jest.fn().mockReturnValue({
        insert: jest.fn().mockRejectedValue(new Error('Database error')),
      });
      
      const result = await syncOfflineData();
      
      expect(NetInfo.fetch).toHaveBeenCalled();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('offline_operation_queue');
      expect(supabase.from).toHaveBeenCalledTimes(1);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'offline_operation_queue',
        JSON.stringify(mockQueue)
      );
      expect(result).toEqual({ success: true, syncedItems: 0, errors: 1 });
    });
  });

  describe('cacheDataForOffline and getCachedData', () => {
    it('should store and retrieve cached data', async () => {
      const testKey = 'test-key';
      const testData = { id: 1, name: 'Test' };
      
      // Mock current time
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now);
      
      await cacheDataForOffline(testKey, testData, 60);
      
      // Verify data was stored correctly
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        `cache_${testKey}`,
        JSON.stringify({
          data: testData,
          timestamp: now,
          expiry: now + 60 * 60 * 1000
        })
      );
      
      // Mock retrieval
      AsyncStorage.getItem = jest.fn().mockResolvedValue(JSON.stringify({
        data: testData,
        timestamp: now,
        expiry: now + 60 * 60 * 1000
      }));
      
      const retrievedData = await getCachedData(testKey);
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(`cache_${testKey}`);
      expect(retrievedData).toEqual(testData);
    });

    it('should return null for expired cache', async () => {
      const testKey = 'test-key';
      
      // Mock current time
      const now = Date.now();
      Date.now = jest.fn().mockReturnValue(now);
      
      // Mock retrieval of expired cache
      AsyncStorage.getItem = jest.fn().mockResolvedValue(JSON.stringify({
        data: { id: 1, name: 'Test' },
        timestamp: now - 120 * 60 * 1000, // 2 hours ago
        expiry: now - 60 * 60 * 1000 // Expired 1 hour ago
      }));
      
      const retrievedData = await getCachedData(testKey);
      
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(`cache_${testKey}`);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(`cache_${testKey}`);
      expect(retrievedData).toBeNull();
    });
  });
});