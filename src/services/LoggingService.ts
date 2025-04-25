import { Logger } from '../../services/LoggingService';

const saveDocument = async () => {
  if (!documentTitle.trim()) {
    Alert.alert('Error', 'Please enter a document title');
    return;
  }

  setIsProcessing(true);
  try {
    Logger.info('Saving document', { documentType, userId: user.id }, ['document', 'save']);
    
    // Upload image to storage
    const imagePath = `documents/${user.id}/${Date.now()}.jpg`;
    const imageFile = capturedImage.uri;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(imagePath, {
        uri: imageFile,
        type: 'image/jpeg',
        name: 'document.jpg',
      });
    
    if (uploadError) {
      Logger.error('Document upload failed', { error: uploadError }, ['document', 'upload']);
      throw uploadError;
    }
    
    // Rest of the function...
    
    Logger.info('Document saved successfully', { documentId: urlData.publicUrl }, ['document', 'save-success']);
  } catch (error) {
    Logger.error('Error saving document', { error }, ['document', 'save-error']);
    console.error('Error saving document:', error);
    Alert.alert('Error', 'Failed to save document: ' + (error.message || 'Unknown error'));
  } finally {
    setIsProcessing(false);
  }
};import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { supabase } from '../lib/supabase';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import { v4 as uuidv4 } from 'uuid';

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

// Log entry interface
interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: any;
  tags?: string[];
  userId?: string;
  deviceInfo: {
    platform: string;
    osVersion: string;
    appVersion: string;
    deviceModel: string;
  };
  synced: boolean;
}

class LoggingService {
  private static instance: LoggingService;
  private readonly STORAGE_KEY = 'app_logs';
  private readonly MAX_LOGS = 1000; // Maximum number of logs to store locally
  private readonly SYNC_INTERVAL = 60000; // 1 minute
  private syncTimer: NodeJS.Timeout | null = null;
  private appVersion = '1.0.0'; // Replace with your app version

  private constructor() {
    // Start sync timer
    this.startSyncTimer();
    
    // Listen for app coming online
    NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        this.syncLogs();
      }
    });
  }

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  private async getDeviceInfo() {
    return {
      platform: Platform.OS,
      osVersion: Platform.Version.toString(),
      appVersion: this.appVersion,
      deviceModel: await Device.getModelNameAsync() || 'Unknown',
    };
  }

  private startSyncTimer() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    
    this.syncTimer = setInterval(() => {
      this.syncLogs();
    }, this.SYNC_INTERVAL);
  }

  public async log(
    level: LogLevel,
    message: string,
    details?: any,
    tags?: string[],
    userId?: string
  ): Promise<void> {
    try {
      const deviceInfo = await this.getDeviceInfo();
      
      const logEntry: LogEntry = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        level,
        message,
        details: details ? JSON.stringify(details) : undefined,
        tags,
        userId,
        deviceInfo,
        synced: false,
      };
      
      // Store log locally
      await this.storeLog(logEntry);
      
      // Try to sync immediately if it's an error or fatal log
      if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
        this.syncLogs();
      }
    } catch (error) {
      console.error('Failed to log:', error);
    }
  }

  private async storeLog(logEntry: LogEntry): Promise<void> {
    try {
      // Get existing logs
      const existingLogsJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      const existingLogs: LogEntry[] = existingLogsJson ? JSON.parse(existingLogsJson) : [];
      
      // Add new log
      existingLogs.push(logEntry);
      
      // Trim logs if exceeding maximum
      const trimmedLogs = existingLogs.length > this.MAX_LOGS
        ? existingLogs.slice(existingLogs.length - this.MAX_LOGS)
        : existingLogs;
      
      // Save logs
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error('Failed to store log:', error);
    }
  }

  public async syncLogs(): Promise<void> {
    try {
      // Check if online
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected || !netInfo.isInternetReachable) {
        return;
      }
      
      // Get unsynchronized logs
      const logsJson = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (!logsJson) return;
      
      const logs: LogEntry[] = JSON.parse(logsJson);
      const unsyncedLogs = logs.filter(log => !log.synced);
      
      if (unsyncedLogs.length === 0) return;
      
      // Send logs to server
      const { error } = await supabase
        .from('application_logs')
        .insert(unsyncedLogs.map(log => ({
          log_id: log.id,
          timestamp: log.timestamp,
          level: log.level,
          message: log.message,
          details: log.details,
          tags: log.tags,
          user_id: log.userId,
          device_info: log.deviceInfo,
        })));
      
      if (error) {
        console.error('Failed to sync logs:', error);
        return;
      }
      
      // Mark logs as synced
      const updatedLogs = logs.map(log => {
        if (unsyncedLogs.some(unsyncedLog => unsyncedLog.id === log.id)) {
          return { ...log, synced: true };
        }
        return log;
      });
      
      // Save updated logs
      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to sync logs:', error);
    }
  }

  public async clearLogs(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  // Convenience methods for different log levels
  public debug(message: string, details?: any, tags?: string[], userId?: string): void {
    this.log(LogLevel.DEBUG, message, details, tags, userId);
  }

  public info(message: string, details?: any, tags?: string[], userId?: string): void {
    this.log(LogLevel.INFO, message, details, tags, userId);
  }

  public warn(message: string, details?: any, tags?: string[], userId?: string): void {
    this.log(LogLevel.WARN, message, details, tags, userId);
  }

  public error(message: string, details?: any, tags?: string[], userId?: string): void {
    this.log(LogLevel.ERROR, message, details, tags, userId);
  }

  public fatal(message: string, details?: any, tags?: string[], userId?: string): void {
    this.log(LogLevel.FATAL, message, details, tags, userId);
  }
}

// Export singleton instance
export const Logger = LoggingService.getInstance();