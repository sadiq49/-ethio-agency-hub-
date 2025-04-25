import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useOcr } from '../src/hooks/useOcr';
import { useAnalytics } from '../hooks/use-analytics';
import { theme } from '../src/theme';
import { API_CONFIG } from '../src/config';

interface OcrScannerProps {
  onScanComplete?: (text: string) => void;
}

export const OcrScanner: React.FC<OcrScannerProps> = ({ onScanComplete }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const analytics = useAnalytics();
  
  const { processImage, isLoading, error, result, reset } = useOcr({
    onSuccess: (result) => {
      if (onScanComplete) {
        onScanComplete(result.text);
      }
    }
  });
  
  const handleCameraCapture = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        analytics.trackEvent('camera_permission_denied');
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }
      
      analytics.trackEvent('camera_opened');
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImageUri(selectedImage.uri);
        
        // Process the image with OCR
        await processImage(selectedImage.uri);
      }
    } catch (err) {
      analytics.reportError(err as Error, { context: 'OcrScanner.handleCameraCapture' });
      alert('Failed to open camera. Please try again.');
    }
  };
  
  const handleImagePicker = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        analytics.trackEvent('gallery_permission_denied');
        alert('Sorry, we need media library permissions to make this work!');
        return;
      }
      
      analytics.trackEvent('gallery_opened');
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImageUri(selectedImage.uri);
        
        // Process the image with OCR
        await processImage(selectedImage.uri);
      }
    } catch (err) {
      analytics.reportError(err as Error, { context: 'OcrScanner.handleImagePicker' });
      alert('Failed to open image picker. Please try again.');
    }
  };
  
  const handleReset = () => {
    setImageUri(null);
    reset();
    analytics.trackEvent('ocr_scanner_reset');
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleCameraCapture}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Take Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleImagePicker}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Choose Image</Text>
        </TouchableOpacity>
      </View>
      
      {imageUri && (
        <View style={styles.imagePreviewContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.imagePreview} 
            resizeMode="contain"
          />
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Processing image...</Text>
            </View>
          )}
        </View>
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error</Text>
          <Text style={styles.errorMessage}>{error.message}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleReset}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {result && !isLoading && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Extracted Text:</Text>
          <View style={styles.textContainer}>
            <Text style={styles.resultText}>{result.text || 'No text detected'}</Text>
          </View>
          {result.confidence !== undefined && (
            <Text style={styles.confidenceText}>
              Confidence: {Math.round(result.confidence * 100)}%
            </Text>
          )}
          {result.language && (
            <Text style={styles.languageText}>
              Detected Language: {result.language}
            </Text>
          )}
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Scan Another</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: theme.colors.disabled,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  imagePreviewContainer: {
    aspectRatio: 4/3,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 8,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorTitle: {
    color: theme.colors.error,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  errorMessage: {
    color: '#d32f2f',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start