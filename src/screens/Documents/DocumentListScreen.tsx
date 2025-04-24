import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { subscribeToDocumentUpdates } from '../../services/RealtimeService';
import { StatusUpdateNotification } from '../../components/StatusUpdateNotification';

export default function DocumentListScreen({ navigation }) {
  const [documents, setDocuments] = useState([]);
  const [notification, setNotification] = useState({
    visible: false,
    status: '',
    documentTitle: '',
    documentId: null
  });
  const { user } = useAuth();
  const prevDocumentsRef = useRef([]);
  
  useEffect(() => {
    fetchDocuments();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToDocumentUpdates(user.id, (updatedDoc) => {
      // Update the document in the list
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === updatedDoc.id ? updatedDoc : doc
        )
      );
      
      // Show notification if status changed
      const prevDoc = prevDocumentsRef.current.find(d => d.id === updatedDoc.id);
      if (prevDoc && prevDoc.status !== updatedDoc.status) {
        setNotification({
          visible: true,
          status: updatedDoc.status,
          documentTitle: updatedDoc.document_type.replace(/_/g, ' '),
          documentId: updatedDoc.id
        });
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    prevDocumentsRef.current = documents;
  }, [documents]);
  
  const fetchDocuments = async () => {
    // ... existing code to fetch documents ...
  };
  
  const handleNotificationPress = () => {
    if (notification.documentId) {
      navigation.navigate('DocumentDetail', {
        documentId: notification.documentId
      });
    }
    setNotification(prev => ({ ...prev, visible: false }));
  };
  
  const handleNotificationDismiss = () => {
    setNotification(prev => ({ ...prev, visible: false }));
  };
  
  return (
    <View style={styles.container}>
      <StatusUpdateNotification
        visible={notification.visible}
        status={notification.status}
        documentTitle={notification.documentTitle}
        onPress={handleNotificationPress}
        onDismiss={handleNotificationDismiss}
      />
      
      {/* ... existing document list UI ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // ... existing styles ...
});