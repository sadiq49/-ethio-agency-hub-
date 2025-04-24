import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, HelperText, Divider, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';

const documentTypes = [
  { id: 'passport', label: 'Passport' },
  { id: 'work_permit', label: 'Work Permit' },
  { id: 'medical_certificate', label: 'Medical Certificate' },
  { id: 'employment_contract', label: 'Employment Contract' },
  { id: 'visa', label: 'Visa' },
  { id: 'other', label: 'Other Document' },
];

export default function UploadDocumentScreen({ navigation }) {
  const [documentType, setDocumentType] = useState('');
  const [documentTypeExpanded, setDocumentTypeExpanded] = useState(false);
  const [description, setDescription] = useState('');
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFileUri(asset.uri);
        setFileName(asset.uri.split('/').pop() || 'image.jpg');
        setFileType('image/jpeg');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        setFileUri(result.uri);
        setFileName(result.name);
        setFileType(result.mimeType || 'application/octet-stream');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const uploadDocument = async () => {
    if (!documentType) {
      Alert.alert('Error', 'Please select a document type');
      return;
    }

    if (!fileUri) {
      Alert.alert('Error', 'Please select a file to upload');
      return;
    }

    try {
      setIsLoading(true);

      // Get file extension
      const fileExt = fileUri.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `documents/${fileName}`;

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, {
          uri: fileUri,
          type: fileType || 'application/octet-stream',
          name: fileName,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = await supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      // Save document record to database
      const { error: insertError } = await supabase
        .from('documents')
        .insert({
          document_type: documentType,
          description: description,
          file_path: filePath,
          file_url: urlData?.publicUrl,
          status: 'pending_review',
          submitted_at: new Date().toISOString(),
        });

      if (insertError) throw insertError;

      Alert.alert(
        'Success',
        'Document uploaded successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Upload Document</Text>

        <List.Accordion
          title={documentType ? documentTypes.find(t => t.id === documentType)?.label : "Select Document Type"}
          expanded={documentTypeExpanded}
          onPress={() => setDocumentTypeExpanded(!documentTypeExpanded)}
          style={styles.dropdown}
        >
          {documentTypes.map((type) => (
            <List.Item
              key={type.id}
              title={type.label}
              onPress={() => {
                setDocumentType(type.id);
                setDocumentTypeExpanded(false);
              }}
            />
          ))}
        </List.Accordion>

        <TextInput
          label="Description (Optional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          style={styles.input}
        />

        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Document File</Text>

        {fileUri ? (
          <View style={styles.filePreviewContainer}>
            {fileType?.startsWith('image/') ? (
              <Image source={{ uri: fileUri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.documentPreview}>
                <MaterialCommunityIcons name="file-document" size={48} color={theme.colors.primary} />
                <Text style={styles.fileName}>{fileName}</Text>
              </View>
            )}
            <TouchableOpacity 
              style={styles.removeButton}
              onPress={() => {
                setFileUri(null);
                setFileName(null);
                setFileType(null);
              }}
            >
              <MaterialCommunityIcons name="close-circle" size={24} color="#F44336" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.uploadOptions}>
            <TouchableOpacity style={styles.uploadOption} onPress={pickImage}>
              <MaterialCommunityIcons name="image" size={36} color={theme.colors.primary} />
              <Text style={styles.uploadOptionText}>Upload Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.uploadOption} onPress={pickDocument}>
              <MaterialCommunityIcons name="file-pdf-box" size={36} color={theme.colors.primary} />
              <Text style={styles.uploadOptionText}>Upload PDF</Text>
            </TouchableOpacity>
          </View>
        )}

        <HelperText type="info">
          Supported formats: JPEG, PNG, PDF. Maximum file size: 10MB
        </HelperText>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Cancel
          </Button>
          
          <Button
            mode="contained"
            onPress={uploadDocument}
            loading={isLoading}
            disabled={isLoading || !documentType || !fileUri}
            style={styles.button}
          >
            Upload Document
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  dropdown: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f5f5f5',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  uploadOption: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    width: '45%',
  },
  uploadOptionText: {
    marginTop: 8,
    color: theme.colors.primary,
  },
  filePreviewContainer: {
    position: 'relative',
    marginVertical: 16,
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  documentPreview: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
  },
  removeButton: {
    position: 'absolute',
    top: -12,
    right: -12,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});