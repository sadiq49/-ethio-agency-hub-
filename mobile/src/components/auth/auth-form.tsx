import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import { useForm, Controller } from 'react-hook-form';

// Initialize Supabase client
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

type FormData = {
  email: string;
  password: string;
};

type AuthFormProps = {
  mode: 'login' | 'register';
  onSuccess?: () => void;
};

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);
    
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        
        if (error) throw error;
      }
      
      onSuccess?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'login' ? 'Sign In' : 'Register'}</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}
      
      <Controller
        control={control}
        rules={{ required: 'Email is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="email"
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
          </View>
        )}
        name="email"
      />
      
      <Controller
        control={control}
        rules={{ required: 'Password is required' }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter your password"
              secureTextEntry
              accessibilityLabel="password"
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>
        )}
        name="password"
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit(onSubmit)}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading 
            ? 'Loading...' 
            : mode === 'login' ? 'Sign In' : 'Register'
          }
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity>
        <Text style={styles.switchMode}>
          {mode === 'login' 
            ? "Don't have an account? Register" 
            : "Already have an account? Sign In"
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: 5,
  },
  switchMode: {
    marginTop: 20,
    textAlign: 'center',
    color: '#007BFF',
  },
});