import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, Linking } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip, ActivityIndicator, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

export default function DocumentDetailScreen({ route, navigation }) {
  const { documentId } = route.params;
  const [document, setDocument] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDocumentDetails();
  }, [documentId]);

  const fetchDocumentDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch document details
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          document_type:document_types(name, icon),
          worker:worker_profiles(name),
          reviewer:reviewers(name)
        `)
        .eq('id', documentId)
        .single();
      
      if (error) throw error;
      
      setDocument(data);
      
      // Get image URL if document has a file path
      if (data.file_path) {
        const { data: urlData, error: urlError } = await supabase.storage
          .from('document-files')
          .createSignedUrl(data.file_path, 3600);
        
        if (urlError) throw urlError;
        
        setImageUrl(urlData.signedUrl);
      }
    } catch (error) {
      console.error('Error fetching document details:', error);
      Alert.alert('Error', 'Failed to load document details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubmit = () => {
    navigation.navigate('SubmitDocument', {
      documentType: document.document_type.id,
      isResubmission: true,
      originalDocumentId: document.id
    });
  };

  const getStatusChip = (status) => {
    let color, icon, label;
    
    switch (status) {
      case 'approved':
        color = theme.colors.success;
        icon = 'check-circle';
        label = 'Approved';
        break;
      case 'rejected':
        color = theme.colors.error;
        icon = 'close-circle';
        label = 'Rejected';
        break;
      case 'pending_review':
        color = theme.colors.warning;
        icon = 'clock-outline';
        label = 'Pending Review';
        break;
      case 'needs_correction':
        color = theme.colors.notification;
        icon = 'alert-circle';
        label = 'Needs Correction';
        break;
      default:
        color = theme.colors.primary;
        icon = 'file-document-outline';
        label = status.replace('_', ' ');
    }
    
    return (
      <Chip 
        icon={icon} 
        style={[styles.statusChip, { backgroundColor: color + '20' }]}
        textStyle={{ color }}
      >
        {label}
      </Chip>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <MaterialCommunityIcons 
              name={document.document_type.icon || 'file-document-outline'} 
              size={32} 
              color={theme.colors.primary} 
              style={styles.headerIcon}
            />
            <View style={styles.headerText}>
              <Title style={styles.title}>
                {document.document_type.name.replace(/_/g, ' ')}
              </Title>
              {getStatusChip(document.status)}
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Submitted By:</Text>
              <Text style={styles.infoValue}>{document.worker.name}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Submitted On:</Text>
              <Text style={styles.infoValue}>{formatDate(document.submitted_at)}</Text>
            </View>
            
            {document.reviewed_at && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Reviewed On:</Text>
                <Text style={styles.infoValue}>{formatDate(document.reviewed_at)}</Text>
              </View>
            )}
            
            {document.reviewer && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Reviewed By:</Text>
                <Text style={styles.infoValue}>{document.reviewer.name}</Text>
              </View>
            )}
          </View>
          
          {document.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.sectionTitle}>Notes:</Text>
              <Card style={styles.notesCard}>
                <Card.Content>
                  <Paragraph>{document.notes}</Paragraph>
                </Card.Content>
              </Card>
            </View>
          )}
          
          {document.feedback && (
            <View style={styles.feedbackSection}>
              <Text style={styles.sectionTitle}>Reviewer Feedback:</Text>
              <Card style={styles.feedbackCard}>
                <Card.Content>
                  <Paragraph>{document.feedback}</Paragraph>
                </Card.Content>
              </Card>
            </View>
          )}
          
          {imageUrl && (
            <View style={styles.imageSection}>
              <Text style={styles.sectionTitle}>Document Image:</Text>
              <Card style={styles.imageCard}>
                <Card.Content>
                  <Image 
                    source={{ uri: imageUrl }} 
                    style={styles.documentImage} 
                    resizeMode="contain"
                  />
                  <Button 
                    mode="outlined" 
                    icon="open-in-new" 
                    onPress={() => Linking.openURL(imageUrl)}
                    style={styles.viewButton}
                  >
                    View Full Image
                  </Button>
                </Card.Content>
              </Card>
            </View>
          )}
          
          {document.status === 'needs_correction' && (
            <Button 
              mode="contained" 
              icon="refresh" 
              onPress={handleResubmit}
              style={styles.actionButton}
            >
              Resubmit Document
            </Button>
          )}
          
          <Button 
            mode="outlined" 
            icon="arrow-left" 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Back to Documents
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: 16,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    width: 120,
    fontWeight: 'bold',
    color: theme.colors.backdrop,
  },
  infoValue: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  notesSection: {
    marginBottom: 16,
  },
  notesCard: {
    backgroundColor: '#f9f9f9',
  },
  feedbackSection: {
    marginBottom: 16,
  },
  feedbackCard: {
    backgroundColor: theme.colors.status === 'approved' 
      ? theme.colors.success + '10'
      : theme.colors.error + '10',
  },
  imageSection: {
    marginBottom: 16,
  },
  imageCard: {
    alignItems: 'center',
  },
  documentImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
  },
  viewButton: {
    marginTop: 8,
  },
  actionButton: {
    marginBottom: 8,
  },
  backButton: {
    marginTop: 8,
  },
});


import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, Button, Chip, ActivityIndicator, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { formatDistanceToNow } from 'date-fns';

export const DocumentDetailScreen = ({ route, navigation }) => {
  const { documentId } = route.params;
  const [document, setDocument] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusHistory, setStatusHistory] = useState([]);

  useEffect(() => {
    fetchDocumentDetails();
    
    // Set up real-time subscription for document updates
    const subscription = supabase
      .channel('document-updates')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'documents',
        filter: `id=eq.${documentId}`
      }, (payload) => {
        setDocument(payload.new);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, [documentId]);

  const fetchDocumentDetails = async () => {
    setIsLoading(true);
    try {
      // Fetch document details
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          worker:worker_id(name),
          reviewer:reviewer_id(name)
        `)
        .eq('id', documentId)
        .single();
      
      if (error) throw error;
      setDocument(data);
      
      // Fetch document image
      if (data.file_path) {
        const { data: signedUrl, error: urlError } = await supabase
          .storage
          .from('document-files')
          .createSignedUrl(data.file_path, 3600);
        
        if (!urlError) {
          setImageUrl(signedUrl);
        }
      }
      
      // Fetch status history
      const { data: historyData, error: historyError } = await supabase
        .from('document_status_history')
        .select('*')
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });
      
      if (!historyError) {
        setStatusHistory(historyData || []);
      }
    } catch (error) {
      console.error('Error fetching document details:', error);
      Alert.alert('Error', 'Failed to load document details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResubmit = () => {
    navigation.navigate('SubmitDocument', {
      isResubmission: true,
      originalDocumentId: documentId,
      documentType: document.document_type
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return theme.colors.success;
      case 'rejected': return theme.colors.error;
      case 'pending_review': return theme.colors.warning;
      case 'needs_correction': return theme.colors.notification;
      default: return theme.colors.primary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return 'check-circle';
      case 'rejected': return 'close-circle';
      case 'pending_review': return 'clock-outline';
      case 'needs_correction': return 'alert-circle';
      default: return 'file-document-outline';
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!document) {
    return (
      <View style={styles.errorContainer}>
        <Text>Document not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {document.document_type.replace(/_/g, ' ')}
          </Title>
          
          <Chip 
            icon={() => (
              <MaterialCommunityIcons 
                name={getStatusIcon(document.status)} 
                size={16} 
                color={getStatusColor(document.status)} 
              />
            )}
            style={[styles.statusChip, { backgroundColor: getStatusColor(document.status) + '20' }]}
          >
            {document.status.replace(/_/g, ' ')}
          </Chip>
          
          <View style={styles.infoSection}>
            <Text style={styles.label}>Submitted by:</Text>
            <Text style={styles.value}>{document.worker?.name || 'Unknown'}</Text>
            
            <Text style={styles.label}>Submitted on:</Text>
            <Text style={styles.value}>
              {new Date(document.submitted_at).toLocaleDateString()} 
              ({formatDistanceToNow(new Date(document.submitted_at), { addSuffix: true })})
            </Text>
            
            {document.reviewer && (
              <>
                <Text style={styles.label}>Reviewed by:</Text>
                <Text style={styles.value}>{document.reviewer.name}</Text>
              </>
            )}
            
            {document.reviewed_at && (
              <>
                <Text style={styles.label}>Reviewed on:</Text>
                <Text style={styles.value}>
                  {new Date(document.reviewed_at).toLocaleDateString()}
                </Text>
              </>
            )}
          </View>
          
          {document.notes && (
            <View style={styles.notesSection}>
              <Text style={styles.label}>Notes:</Text>
              <Paragraph style={styles.notes}>{document.notes}</Paragraph>
            </View>
          )}
          
          {document.rejection_reason && (
            <View style={styles.rejectionSection}>
              <Text style={styles.label}>Rejection Reason:</Text>
              <Paragraph style={styles.rejectionReason}>
                {document.rejection_reason}
              </Paragraph>
            </View>
          )}
          
          {imageUrl && (
            <View style={styles.imageSection}>
              <Text style={styles.label}>Document Image:</Text>
              <Image 
                source={{ uri: imageUrl }} 
                style={styles.documentImage} 
                resizeMode="contain" 
              />
            </View>
          )}
          
          {(document.status === 'rejected' || document.status === 'needs_correction') && (
            <Button 
              mode="contained" 
              icon="refresh" 
              onPress={handleResubmit}
              style={styles.resubmitButton}
            >
              Resubmit Document
            </Button>
          )}
          
          <Divider style={styles.divider} />
          
          <Title style={styles.historyTitle}>Status History</Title>
          {statusHistory.length > 0 ? (
            statusHistory.map((item, index) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={styles.historyIconContainer}>
                  <MaterialCommunityIcons 
                    name={getStatusIcon(item.status)} 
                    size={24} 
                    color={getStatusColor(item.status)} 
                  />
                  {index < statusHistory.length - 1 && (
                    <View style={styles.historyLine} />
                  )}
                </View>
                <View style={styles.historyContent}>
                  <Text style={styles.historyStatus}>
                    {item.status.replace(/_/g, ' ')}
                  </Text>
                  <Text style={styles.historyDate}>
                    {new Date(item.created_at).toLocaleString()}
                  </Text>
                  {item.notes && (
                    <Paragraph style={styles.historyNotes}>{item.notes}</Paragraph>
                  )}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noHistoryText}>No status history available</Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
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
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  infoSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: theme.colors.backdrop,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 8,
  },
  notesSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  notes: {
    fontStyle: 'italic',
  },
  rejectionSection: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: theme.colors.error + '10',
    borderRadius: 8,
  },
  rejectionReason: {
    color: theme.colors.error,
  },
  imageSection: {
    marginBottom: 16,
  },
  documentImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 8,
  },
  resubmitButton: {
    marginTop: 8,
  },
  divider: {
    marginVertical: 16,
  },
  historyTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  historyIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  historyLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 4,
  },
  historyContent: {
    flex: 1,
  },
  historyStatus: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  historyDate: {
    fontSize: 14,
    color: theme.colors.backdrop,
    marginBottom: 4,
  },
  historyNotes: {
    fontSize: 14,
  },
  noHistoryText: {
    fontStyle: 'italic',
    color: theme.colors.backdrop,
    textAlign: 'center',
  },
});