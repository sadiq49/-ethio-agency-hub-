import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { Text, Button, ActivityIndicator, TextInput, Card } from 'react-native-paper';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme';

export default function DocumentScannerScreen({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentType, setDocumentType] = useState(route.params?.documentType || 'general');
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedImage(photo);
        processImage(photo);
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to capture image');
      }
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled) {
        setCapturedImage(result.assets[0]);
        processImage(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image from gallery');
    }
  };

  // Add these new functions to your existing DocumentScannerScreen component
  
  const [documentFormat, setDocumentFormat] = useState('auto');
  const [enhanceImage, setEnhanceImage] = useState(true);
  const [extractedFields, setExtractedFields] = useState({});
  
  // Enhanced image processing function
  const enhanceImageQuality = async (imageUri) => {
    if (!enhanceImage) return imageUri;
    
    // In a real app, you would use image processing libraries
    // This is a placeholder for demonstration
    console.log('Enhancing image quality...');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return imageUri;
  };
  
  // Enhanced OCR processing with field extraction
  const processImageWithFieldExtraction = async (imageData) => {
    setIsProcessing(true);
    try {
      // First enhance the image if enabled
      const enhancedUri = await enhanceImageQuality(imageData.uri);
      
      // Call OCR API (example using Google Cloud Vision API)
      // In a real app, you would use a proper API key and secure it
      const apiKey = 'YOUR_GOOGLE_CLOUD_VISION_API_KEY';
      const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
      
      // For demo purposes, simulate OCR processing
      return new Promise((resolve) => {
        setTimeout(() => {
          // Simulate detected text based on document type
          let simulatedText = '';
          let fields = {};
          
          if (documentType === 'invoice') {
            simulatedText = 'INVOICE #12345\nDate: 2023-05-15\nAmount: $1,250.00\nFrom: ABC Company\nTo: XYZ Corporation\n\nServices: Consulting\nTax: $100.00\nTotal: $1,350.00';
            
            // Extract structured data
            fields = {
              invoiceNumber: '12345',
              date: '2023-05-15',
              amount: '$1,250.00',
              from: 'ABC Company',
              to: 'XYZ Corporation',
              tax: '$100.00',
              total: '$1,350.00'
            };
          } else if (documentType === 'receipt') {
            simulatedText = 'RECEIPT\nStore: Retail Shop\nDate: 2023-05-15\nItems:\n- Product A $25.99\n- Product B $14.50\nSubtotal: $40.49\nTax: $3.24\nTotal: $43.73\nPayment Method: Credit Card';
            
            // Extract structured data
            fields = {
              store: 'Retail Shop',
              date: '2023-05-15',
              items: [
                { name: 'Product A', price: '$25.99' },
                { name: 'Product B', price: '$14.50' }
              ],
              subtotal: '$40.49',
              tax: '$3.24',
              total: '$43.73',
              paymentMethod: 'Credit Card'
            };
          } else {
            simulatedText = 'Sample Document\nThis is a sample text that would be extracted from your document using OCR technology.\n\nThe quality of extraction depends on the image clarity and the OCR service being used.\n\nIn a real implementation, this text would come from the OCR API response.';
          }
          
          setRecognizedText(simulatedText);
          setExtractedFields(fields);
          setIsProcessing(false);
          
          // Suggest a title based on content
          if (!documentTitle) {
            if (documentType === 'invoice') {
              setDocumentTitle(`Invoice #${fields.invoiceNumber || '12345'}`);
            } else if (documentType === 'receipt') {
              setDocumentTitle(`Receipt - ${fields.store || 'Retail'} (${fields.date || 'Today'})`);
            }
          }
          
          resolve({ text: simulatedText, fields });
        }, 2000);
      });
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert('Error', 'Failed to process image');
      setIsProcessing(false);
      throw error;
    }
  };
  ## Additional Recommendations
  1. Error Boundary Components : Implement React Error Boundaries to catch and handle errors gracefully in the UI.
  2. Offline Status Indicator : Add a visual indicator to show when the app is working in offline mode.
  3. Retry Mechanism : Implement a retry mechanism for failed API calls with exponential backoff.
  4. Comprehensive Logging : Add a logging service that can store logs locally when offline and send them to the server when back online.
  5. Unit Tests : Add unit tests for the error handling and offline functionality to ensure they work as expected.
  Would you like me to provide more specific implementations for any of these additional recommendations?      } catch (error) {
      console.error('Error processing OCR results:', error);
      Alert.alert('OCR Error', 'Failed to process text from image');
    } finally {
      setIsProcessing(false);
    }
  }, 2000);
  
  } catch (error) {
    console.error('Error processing image:', error);
    Alert.alert('Error', 'Failed to process image: ' + (error.message || 'Unknown error'));
    setIsProcessing(false);
  }
};

const saveDocument = async () => {
  if (!documentTitle.trim()) {
    Alert.alert('Error', 'Please enter a document title');
    return;
  }

  setIsProcessing(true);
  try {
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
    
    if (uploadError) throw uploadError;
    
    // Get public URL
    const { data: urlData, error: urlError } = supabase.storage
      .from('documents')
      .getPublicUrl(imagePath);
      
    if (urlError) throw urlError;
    
    // Save document metadata to database
    const { error: dbError } = await supabase
      .from('documents')
      .insert({
        user_id: user.id,
        title: documentTitle,
        type: documentType,
        content: recognizedText,
        file_url: urlData.publicUrl,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
      
    if (dbError) throw dbError;
    
    Alert.alert('Success', 'Document saved successfully');
    navigation.goBack();
  } catch (error) {
    console.error('Error saving document:', error);
    Alert.alert('Error', 'Failed to save document: ' + (error.message || 'Unknown error'));
  } finally {
    setIsProcessing(false);
  }
};

  const resetScan = () => {
    setCapturedImage(null);
    setRecognizedText('');
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.camera}
            type={Camera.Constants.Type.back}
            ref={(ref) => setCameraRef(ref)}
            ratio="4:3"
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.documentFrame} />
            </View>
          </Camera>
          
          <View style={styles.cameraControls}>
            <Button
              mode="contained"
              icon="image"
              onPress={pickImage}
              style={styles.controlButton}
            >
              Gallery
            </Button>
            
            <Button
              mode="contained"
              icon="camera"
              onPress={takePicture}
              style={styles.captureButton}
            >
              Capture
            </Button>
          </View>
        </View>
      ) : (
        <ScrollView style={styles.resultContainer}>
          <Card style={styles.imageCard}>
            <Card.Cover source={{ uri: capturedImage.uri }} style={styles.capturedImage} />
            <Card.Actions>
              <Button onPress={resetScan}>Rescan</Button>
            </Card.Actions>
          </Card>
          
          {isProcessing ? (
            <View style={styles.processingContainer}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.processingText}>Processing document...</Text>
            </View>
          ) : (
            <>
              <Card style={styles.textCard}>
                <Card.Title title="Extracted Text" />
                <Card.Content>
                  <ScrollView style={styles.textScrollView}>
                    <Text style={styles.recognizedText}>{recognizedText}</Text>
                  </ScrollView>
                </Card.Content>
              </Card>
              
              <Card style={styles.formCard}>
                <Card.Title title="Document Details" />
                <Card.Content>
                  <TextInput
                    label="Document Title"
                    value={documentTitle}
                    onChangeText={setDocumentTitle}
                    style={styles.input}
                  />
                  
                  <Button
                    mode="contained"
                    onPress={saveDocument}
                    style={styles.saveButton}
                    disabled={isProcessing || !documentTitle.trim()}
                  >
                    Save Document
                  </Button>
                </Card.Content>
              </Card>
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentFrame: {
    width: '80%',
    height: '60%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 8,
  },
  cameraControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  controlButton: {
    width: 120,
  },
  captureButton: {
    width: 120,
    backgroundColor: theme.colors.primary,
  },
  resultContainer: {
    flex: 1,
    padding: 16,
  },
  imageCard: {
    marginBottom: 16,
  },
  capturedImage: {
    height: 200,
    resizeMode: 'contain',
  },
  processingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  processingText: {
    marginTop: 10,
    fontSize: 16,
  },
  titleInput: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  recognizedText: {
    fontSize: 16,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

{/* Add these options to your form card */}
<Card style={styles.optionsCard}>
  <Card.Title title="Scanning Options" />
  <Card.Content>
    <View style={styles.optionRow}>
      <Text>Enhance Image Quality</Text>
      <Switch
        value={enhanceImage}
        onValueChange={setEnhanceImage}
        color={theme.colors.primary}
      />
    </View>
    
    <Text style={styles.optionLabel}>Document Format:</Text>
    <View style={styles.formatOptions}>
      <Button
        mode={documentFormat === 'auto' ? 'contained' : 'outlined'}
        onPress={() => setDocumentFormat('auto')}
        style={styles.formatButton}
      >
        Auto
      </Button>
      <Button
        mode={documentFormat === 'document' ? 'contained' : 'outlined'}
        onPress={() => setDocumentFormat('document')}
        style={styles.formatButton}
      >
        Document
      </Button>
      <Button
        mode={documentFormat === 'receipt' ? 'contained' : 'outlined'}
        onPress={() => setDocumentFormat('receipt')}
        style={styles.formatButton}
      >
        Receipt
      </Button>
    </View>
  </Card.Content>
</Card>

{/* Display extracted fields if available */}
{Object.keys(extractedFields).length > 0 && (
  <Card style={styles.fieldsCard}>
    <Card.Title title="Extracted Fields" />
    <Card.Content>
      {Object.entries(extractedFields).map(([key, value]) => {
        if (key === 'items' && Array.isArray(value)) {
          return (
            <View key={key} style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>Items:</Text>
              {value.map((item, index) => (
                <Text key={index} style={styles.fieldValue}>
                  - {item.name}: {item.price}
                </Text>
              ))}
            </View>
          );
        }
        return (
          <View key={key} style={styles.fieldItem}>
            <Text style={styles.fieldLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}:</Text>
            <Text style={styles.fieldValue}>{value}</Text>
          </View>
        );
      })}
    </Card.Content>
  </Card>
)}