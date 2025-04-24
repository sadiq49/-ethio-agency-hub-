import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, TouchableOpacity, Platform } from 'react-native';
import { Text, Button, Card, Title, TextInput, HelperText, ActivityIndicator, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';

export const SubmitDocumentScreen = ({ route }) => {
  const { documentType: initialDocType, isResubmission, originalDocumentId } = route.params || {};
  const [documentType, setDocumentType] = useState(initialDocType || '');
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [image, setImage] = useState(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [documentTypes, setDocumentTypes] = useState([]);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
      
      // Fetch available document types
      fetchDocumentTypes();
    })();
  }, []);

  const fetchDocumentTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('document_types')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setDocumentTypes(data);
      
      // Set default document type if not already set
      if (!documentType && data.length > 0) {
        setDocumentType(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching document types:', error);
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        
        // Compress and resize the image
        const processedImage = await manipulateAsync(
          photo.uri,
          [{ resize: { width: 1200 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );
        
        setImage(processedImage);
        setShowCamera(false);
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
        aspect: [4, 3],
        quality: 0.7,
      });
      
      if (!result.canceled) {
        // Compress and resize the image
        const processedImage = await manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 1200 } }],
          { compress: 0.7, format: SaveFormat.JPEG }
        );
        
        setImage(processedImage);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSubmit = async () => {
    if (!documentType) {
      Alert.alert('Error', 'Please select a document type');
      return;
    }
    
    if (!image) {
      Alert.alert('Error', 'Please take or select an image of your document');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique filename
      const fileExt = 'jpg';
      const fileName = `${user.id}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload the image to storage
      const formData = new FormData();
      formData.append('file', {
        uri: image.uri,
        name: fileName,
        type: 'image/jpeg',
      });
      
      const { error: uploadError } = await supabase.storage
        .from('document-files')
        .upload(filePath, formData);
      
      if (uploadError) throw uploadError;
      
      // Create document record in database
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          worker_id: user.id,
          document_type: documentType,
          status: 'pending_review',
          submitted_at: new Date().toISOString(),
          file_path: filePath,
          notes: notes.trim() || null,
          original_document_id: isResubmission ? originalDocumentId : null,
        });
      
      if (insertError) throw insertError;
      
      Alert.alert(
        'Success',
        'Your document has been submitted successfully',
        [{ text: 'OK', onPress: () => navigation.navigate('DocumentList') }]
      );
    } catch (error) {
      console.error('Error submitting document:', error);
      Alert.alert('Error', 'Failed to submit document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocumentTypeName = (id) => {
    const docType = documentTypes.find(type => type.id === id);
    return docType ? docType.name.replace(/_/g, ' ') : '';
  };

  if (hasCameraPermission === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (hasCameraPermission === false) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="camera-off" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>Camera permission not granted</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.camera}
          type={Camera.Constants.Type.back}
          ratio="4:3"
        >
          <View style={styles.cameraControls}>
            <Button
              mode="contained"
              icon="close"
              onPress={() => setShowCamera(false)}
              style={styles.cameraButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              icon="camera"
              onPress={takePicture}
              style={styles.cameraButton}
            >
              Capture
            </Button>
          </View>
        </Camera>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {isResubmission ? 'Resubmit Document' : 'Submit New Document'}
          </Title>
          
          {isResubmission && (
            <Chip 
              style={styles.resubmissionChip}
              icon="refresh"
            >
              Resubmission
            </Chip>
          )}
          
          <View style={styles.formSection}>
            <Text style={styles.label}>Document Type</Text>
            <View style={styles.documentTypeContainer}>
              {documentTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.documentTypeButton,
                    documentType === type.id && styles.documentTypeButtonSelected
                  ]}
                  onPress={() => setDocumentType(type.id)}
                >
                  <MaterialCommunityIcons
                    name={type.icon || 'file-document-outline'}
                    size={24}
                    color={documentType === type.id ? theme.colors.primary : theme.colors.backdrop}
                  />
                  <Text
                    style={[
                      styles.documentTypeText,
                      documentType === type.id && styles.documentTypeTextSelected
                    ]}
                  >
                    {type.name.replace(/_/g, ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.label}>Document Image</Text>
            {image ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <View style={styles.imageActions}>
                  <Button
                    mode="outlined"
                    icon="camera"
                    onPress={() => setShowCamera(true)}
                    style={styles.imageButton}
                  >
                    Retake
                  </Button>
                  <Button
                    mode="outlined"
                    icon="image"
                    onPress={pickImage}
                    style={styles.imageButton}
                  >
                    Choose New
                  </Button>
                </View>
              </View>
            ) : (
              <View style={styles.imageActions}>
                <Button
                  mode="contained"
                  icon="camera"
                  onPress={() => setShowCamera(true)}
                  style={styles.imageButton}
                >
                  Take Photo
                </Button>
                <Button
                  mode="outlined"
                  icon="image"
                  onPress={pickImage}
                  style={styles.imageButton}
                >
                  Choose from Gallery
                </Button>
              </View>
            )}
          </View>
          
          <View style={styles.formSection}>
            <Text style={styles.label}>Additional Notes (Optional)</Text>
            <TextInput
              mode="outlined"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              style={styles.notesInput}
              placeholder="Add any relevant information about this document"
            />
            <HelperText type="info">
              Include any details that might help with processing your document
            </HelperText>
          </View>
          
          <View style={styles.submitContainer}>
            <Button
              mode="contained"
              icon="send"
              onPress={handleSubmit}
              disabled={isSubmitting || !documentType || !image}
              loading={isSubmitting}
              style={styles.submitButton}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Document'}
            </Button>
            <Button
              mode="outlined"
              icon="close"
              onPress={() => navigation.goBack()}
              disabled={isSubmitting}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    marginVertical: 16,
  },
  card: {
    margin: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  resubmissionChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  documentTypeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  documentTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.backdrop,
    backgroundColor: theme.colors.surface,
  },
  documentTypeButtonSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryContainer,
  },
  documentTypeText: {
    marginLeft: 8,
    color: theme.colors.text,
  },
  documentTypeTextSelected: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  imagePreviewContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  imageButton: {
    marginHorizontal: 8,
    flex: 1,
  },
  notesInput: {
    backgroundColor: theme.colors.surface,
  },
  submitContainer: {
    marginTop: 16,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 8,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  cameraButton: {
    margin: 8,
  },
});