import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, ProgressBar, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { styles } from '../styles';

interface DocumentUploaderProps {
  onUpload: (file: any) => Promise<void>;
  documentType: string;
}

export default function DocumentUploader({ onUpload, documentType }: DocumentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setUploading(true);
        setProgress(0);

        try {
          await onUpload(result);
        } catch (error) {
          console.error('Upload error:', error);
        } finally {
          setUploading(false);
          setProgress(0);
        }
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  };

  return (
    <View>
      <Button
        mode="contained"
        onPress={handleDocumentPick}
        disabled={uploading}
        style={styles.uploadButton}
      >
        {uploading ? 'Uploading...' : 'Select Document'}
      </Button>
      {uploading && (
        <View>
          <ProgressBar progress={progress} style={styles.progressBar} />
          <Text style={{ textAlign: 'center', marginTop: 8 }}>
            Uploading {documentType}...
          </Text>
        </View>
      )}
    </View>
  );
}