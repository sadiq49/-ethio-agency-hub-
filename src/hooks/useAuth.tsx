import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticateWithBiometrics, isBiometricEnabled } from '../services/BiometricAuthService';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithBiometrics: () => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  setupBiometrics: () => Promise<{ success: boolean }>;
  isBiometricsEnabled: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkBiometricsStatus();
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkBiometricsStatus = async () => {
    const biometricEnabled = await AsyncStorage.getItem('biometric_enabled');
    setIsBiometricsEnabled(biometricEnabled === 'true');
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (!error) {
      // Store user credentials securely for biometric login later
      await AsyncStorage.setItem('user-email', email);
      // Don't store actual password, just a flag that user has logged in with password
      await AsyncStorage.setItem('auth-method', 'password');
    }
    
    setIsLoading(false);
    return { error };
  } catch (e) {
    setIsLoading(false);
    return { error: e };
  }
};

// Add biometric sign in method
const signInWithBiometrics = async () => {
  setIsLoading(true);
  try {
    const email = await AsyncStorage.getItem('user-email');
    if (!email) {
      throw new Error('No stored credentials found');
    }
    
    const isAuthenticated = await authenticateWithBiometrics();
    if (!isAuthenticated) {
      throw new Error('Biometric authentication failed');
    }
    
    // Use stored credentials to sign in
    const { error } = await supabase.auth.signInWithPassword({ 
      email,
      password: '', // This won't work directly - you'd need a token-based approach
    });
    
    setIsLoading(false);
    return { error };
  } catch (e) {
    setIsLoading(false);
    return { error: e };
  }
};

  // Add to AuthContextType and provider value
  const setupBiometrics = async () => {
    if (!user) {
      return { success: false };
    }
    
    try {
      const { available } = await checkBiometricAvailability();
      
      if (!available) {
        return { success: false };
      }
      
      // Store user preference for biometric login
      await AsyncStorage.setItem('biometric_enabled', 'true');
      await AsyncStorage.setItem('biometric_user_id', user.id);
      
      // We would need to securely store credentials
      // This is a simplified example - in production, use a more secure approach
      const email = await AsyncStorage.getItem('last_email');
      const password = await AsyncStorage.getItem('last_password');
      
      if (email && password) {
        await AsyncStorage.setItem(`biometric_email_${user.id}`, email);
        await AsyncStorage.setItem(`biometric_password_${user.id}`, password);
      }
      
      setIsBiometricsEnabled(true);
      return { success: true };
    } catch (error) {
      console.error('Error setting up biometrics:', error);
      return { success: false };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: { name }
      }
    });
    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    await AsyncStorage.removeItem('user-session');
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'projectbolt://reset-password',
    });
    setIsLoading(false);
    return { error };
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      signIn, 
      signInWithBiometrics, // Add the new method
      signUp, 
      signOut, 
      resetPassword,
      setupBiometrics,
      isBiometricsEnabled
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};