import React, { createContext, useState, useEffect, useContext } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

type BiometricContextType = {
  isBiometricsAvailable: boolean;
  isBiometricsEnabled: boolean;
  enableBiometrics: () => Promise<void>;
  disableBiometrics: () => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
};

const BiometricContext = createContext<BiometricContextType | undefined>(undefined);

export const BiometricProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isBiometricsAvailable, setIsBiometricsAvailable] = useState(false);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
    loadBiometricSettings();
  }, []);

  const checkBiometricAvailability = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricsAvailable(compatible && enrolled);
  };

  const loadBiometricSettings = async () => {
    try {
      const enabled = await AsyncStorage.getItem('biometrics-enabled');
      setIsBiometricsEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error loading biometric settings:', error);
    }
  };

  const enableBiometrics = async () => {
    if (!isBiometricsAvailable) {
      Alert.alert(
        'Biometrics Unavailable',
        'Your device does not support biometric authentication or you have not set up biometrics in your device settings.'
      );
      return;
    }

    try {
      await AsyncStorage.setItem('biometrics-enabled', 'true');
      setIsBiometricsEnabled(true);
    } catch (error) {
      console.error('Error enabling biometrics:', error);
    }
  };

  const disableBiometrics = async () => {
    try {
      await AsyncStorage.setItem('biometrics-enabled', 'false');
      setIsBiometricsEnabled(false);
    } catch (error) {
      console.error('Error disabling biometrics:', error);
    }
  };

  const authenticateWithBiometrics = async (): Promise<boolean> => {
    if (!isBiometricsAvailable || !isBiometricsEnabled) {
      return false;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use passcode',
      });

      return result.success;
    } catch (error) {
      console.error('Error authenticating with biometrics:', error);
      return false;
    }
  };

  return (
    <BiometricContext.Provider
      value={{
        isBiometricsAvailable,
        isBiometricsEnabled,
        enableBiometrics,
        disableBiometrics,
        authenticateWithBiometrics,
      }}
    >
      {children}
    </BiometricContext.Provider>
  );
};

export const useBiometrics = () => {
  const context = useContext(BiometricContext);
  if (context === undefined) {
    throw new Error('useBiometrics must be used within a BiometricProvider');
  }
  return context;
};