import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Title, List, Button, ProgressBar, Portal, Dialog, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
import { styles } from '../styles';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  uploadDate?: string;
  expiryDate?: string;
}

const requiredDocuments: Document[] = [
  {
    id: 'doc1',
    name: 'Passport',
    type: 'passport',
    status: 'uploaded',
    uploadDate: '2024-01-15',
    expiryDate: '2029-01-15'
  },
  {
    id: 'doc2',
    name: 'Medical Certificate',
    type: 'medical',
    status: 'pending'
  },
  {
    id: 'doc3',
    name: 'Police Clearance',
    type: 'police',
    status: 'verified',
    uploadDate: '2024-02-01',
    expiryDate: '2024-08-01'
  },
  {
    id: 'doc4',
    name: 'Educational Certificates',
    type: 'education',
    status: 'pending'
  },
  {
    id: 'doc5',
    name: 'Training Certificates',
    type: 'training',
    status: 'pending'
  }
];

export default function DocumentsScreen() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleDocumentPick = async (document: Document) => {
    try {
      setSelectedDocument(document);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true
      });

      if (result.type === 'success') {
        setUploading(true);
        setUploadProgress(0);
        setDialogVisible(true);

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 10;
          });
        }, 500);

        // Simulate upload completion
        setTimeout(() => {
          setUploading(false);
          setDialogVisible(false);
          setUploadProgress(0);
        }, 5000);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'check-circle';
      case 'verified':
        return 'shield-check';
      case 'rejected':
        return 'close-circle';
      default:
        return 'clock';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploaded':
        return 'blue';
      case 'verified':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'orange';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Required Documents</Title>
            <List.Section>
              {requiredDocuments.map((doc) => (
                <List.Item
                  key={doc.id}
                  title={doc.name}
                  description={doc.uploadDate ? `Uploaded on ${doc.uploadDate}` : 'Pending upload'}
                  left={props => <List.Icon {...props} icon="file-document" />}
                  right={() => (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <List.Icon
                        icon={getStatusIcon(doc.status)}
                        color={getStatusColor(doc.status)}
                      />
                      {doc.status === 'pending' && (
                        <Button
                          mode="contained"
                          onPress={() => handleDocumentPick(doc)}
                          compact
                        >
                          Upload
                        </Button>
                      )}
                    </View>
                  )}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Document Status</Title>
            <List.Section>
              <List.Item
                title="Uploaded Documents"
                description={`${requiredDocuments.filter(d => d.status === 'uploaded' || d.status === 'verified').length} of ${requiredDocuments.length}`}
                left={props => <List.Icon {...props} icon="folder-check" />}
              />
              <List.Item
                title="Pending Verification"
                description={`${requiredDocuments.filter(d => d.status === 'uploaded').length} documents`}
                left={props => <List.Icon {...props} icon="clock-check" />}
              />
              <List.Item
                title="Expiring Soon"
                description="2 documents in next 30 days"
                left={props => <List.Icon {...props} icon="clock-alert" />}
              />
            </List.Section>
          </Card.Content>
        </Card>
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} dismissable={false}>
          <Dialog.Title>Uploading Document</Dialog.Title>
          <Dialog.Content>
            <Text>Uploading {selectedDocument?.name}</Text>
            <ProgressBar progress={uploadProgress / 100} style={styles.progressBar} />
          </Dialog.Content>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}