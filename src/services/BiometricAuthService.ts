import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const isBiometricAvailable = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
};

export const authenticateWithBiometrics = async (): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access Project Bolt',
      fallbackLabel: 'Use passcode',
      disableDeviceFallback: false,
    });
    
    return result.success;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
};

export const enableBiometricAuth = async (userId: string): Promise<void> => {
  try {
    // Check if biometrics are available
    const available = await isBiometricAvailable();
    if (!available) {
      throw new Error('Biometric authentication is not available on this device');
    }
    
    // Store user preference for biometric auth
    await AsyncStorage.setItem(`@biometric_enabled_${userId}`, 'true');
  } catch (error) {
    console.error('Error enabling biometric auth:', error);
    throw error;
  }
};

export const disableBiometricAuth = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`@biometric_enabled_${userId}`);
  } catch (error) {
    console.error('Error disabling biometric auth:', error);
    throw error;
  }
};

export const isBiometricEnabled = async (userId: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(`@biometric_enabled_${userId}`);
    return value === 'true';
  } catch (error) {
    console.error('Error checking biometric auth status:', error);
    return false;
  }
};

export const checkBiometricAvailability = async (): Promise<{
  available: boolean;
  biometricTypes: string[];
}> => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (hasHardware && isEnrolled) {
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const biometricTypes = [];
      
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricTypes.push('Fingerprint');
      }
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricTypes.push('Face ID');
      }
      
      return { available: true, biometricTypes };
    }
    
    return { available: false, biometricTypes: [] };
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return { available: false, biometricTypes: [] };
  }
};

export const enableBiometricLogin = async (userId: string): Promise<boolean> => {
  try {
    const { available } = await checkBiometricAvailability();
    
    if (!available) {
      return false;
    }
    
    // Store user preference for biometric login
    await AsyncStorage.setItem('biometric_enabled', 'true');
    await AsyncStorage.setItem('biometric_user_id', userId);
    
    return true;
  } catch (error) {
    console.error('Error enabling biometric login:', error);
    return false;
  }
};

export const authenticateWithBiometrics = async (): Promise<{
  success: boolean;
  userId?: string;
}> => {
  try {
    const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
    
    if (biometricEnabled !== 'true') {
      return { success: false };
    }
    
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to continue',
      fallbackLabel: 'Use password instead',
      disableDeviceFallback: false,
    });
    
    if (result.success) {
      const userId = await AsyncStorage.getItem('biometric_user_id');
      return { success: true, userId };
    }
    
    return { success: false };
  } catch (error) {
    console.error('Error authenticating with biometrics:', error);
    return { success: false };
  }
};

export const disableBiometricLogin = async (): Promise<boolean> => {
  try {
    await AsyncStorage.removeItem('biometric_enabled');
    await AsyncStorage.removeItem('biometric_user_id');
    return true;
  } catch (error) {
    console.error('Error disabling biometric login:', error);
    return false;
  }
};