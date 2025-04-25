import { Platform } from 'react-native';
import { developmentConfig } from './development';
import { productionConfig } from './production';
import { stagingConfig } from './staging';

// Determine the current environment
const getEnvironment = (): 'development' | 'staging' | 'production' => {
  // You can use environment variables or other methods to determine the environment
  if (__DEV__) {
    return 'development';
  }
  
  // This could be set during the build process
  const forcedEnvironment = process.env.APP_ENV;
  
  if (forcedEnvironment === 'staging') {
    return 'staging';
  }
  
  return 'production';
};

// Get the configuration for the current environment
const getConfig = () => {
  const environment = getEnvironment();
  
  switch (environment) {
    case 'development':
      return developmentConfig;
    case 'staging':
      return stagingConfig;
    case 'production':
      return productionConfig;
    default:
      return productionConfig;
  }
};

// Platform-specific configuration overrides
const getPlatformOverrides = () => {
  if (Platform.OS === 'ios') {
    return {
      // iOS-specific overrides
      FEATURES: {
        USE_APPLE_PAY: true,
      },
    };
  }
  
  if (Platform.OS === 'android') {
    return {
      // Android-specific overrides
      FEATURES: {
        USE_GOOGLE_PAY: true,
      },
    };
  }
  
  return {};
};

// Merge configurations
const mergeConfigs = (baseConfig: any, overrides: any): any => {
  const result = { ...baseConfig };
  
  Object.keys(overrides).forEach(key => {
    if (typeof overrides[key] === 'object' && !Array.isArray(overrides[key])) {
      result[key] = mergeConfigs(result[key] || {}, overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  });
  
  return result;
};

// Export the final configuration
export const API_CONFIG = mergeConfigs(getConfig(), getPlatformOverrides());

// Export environment helpers
export const IS_DEV = getEnvironment() === 'development';
export const IS_STAGING = getEnvironment() === 'staging';
export const IS_PROD = getEnvironment() === 'production';