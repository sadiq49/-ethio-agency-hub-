import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, Title, Button, ProgressBar, Text } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { useDocumentManagement } from '../lib/hooks/useDocumentManagement';
import type { Document } from '../lib/types';
import { styles } from '../styles';

interface DocumentUploadCardProps {
  workerId: string;
  documentType: Document['type'];
  onUploadComplete: () => void;
}

export default function DocumentUploadCard({
  workerId,
  documentType,
  onUploadComplete
}: DocumentUploadCardProps) {
  const [progress, setProgress] = useState(0);
  const { uploadDocument, uploading, error } = useDocumentManagement();

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setProgress(0);
        const simulateProgress = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(simulateProgress);
              return 90;
            }
            return prev + 10;
          });
        }, 500);

        await uploadDocument(workerId, result, documentType);
        clearInterval(simulateProgress);
        setProgress(100);
        onUploadComplete();
      }
    } catch (err) {
      console.error('Document upload error:', err);
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{documentType.charAt(0).toUpperCase() + documentType.slice(1)}</Title>
        
        <View style={styles.uploadContainer}>
          <Button
            mode="contained"
            onPress={handleDocumentPick}
            disabled={uploading}
            style={styles.uploadButton}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>

          {uploading && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress / 100} style={styles.progressBar} />
              <Text style={styles.progressText}>{progress}%</Text>
            </View>
          )}

          {error && (
            <Text style={styles.errorText}>
              Upload failed: {error.message}
            </Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );
}