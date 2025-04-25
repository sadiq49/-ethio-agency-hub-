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

export const enableBiometricLogin = async (userId: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('biometric_enabled', 'true');
    await AsyncStorage.setItem('biometric_user_id', userId);
  } catch (error) {
    console.error('Error enabling biometric login:', error);
  }
};

export const disableBiometricLogin = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('biometric_enabled');
    await AsyncStorage.removeItem('biometric_user_id');
  } catch (error) {
    console.error('Error disabling biometric login:', error);
  }
};

export const isBiometricEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await AsyncStorage.getItem('biometric_enabled');
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking biometric status:', error);
    return false;
  }
};