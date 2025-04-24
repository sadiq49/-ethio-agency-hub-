import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Avatar, Divider, Button, ActivityIndicator, Chip, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { theme } from '../../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

type Worker = {
  id: string;
  name: string;
  passport_number: string;
  nationality: string;
  date_of_birth: string | null;
  gender: string | null;
  contact_number: string | null;
  email: string | null;
  address: string | null;
  status: string;
  destination: string | null;
  created_at: string;
};

export default function WorkerProfileScreen({ route, navigation }) {
  const { workerId } = route.params;
  const [worker, setWorker] = useState<Worker | null>(null);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkerDetails();
  }, [workerId]);

  const fetchWorkerDetails = async () => {
    try {
      setIsLoading(true);
      
      // Fetch worker details
      const { data: workerData, error: workerError } = await supabase
        .from('workers')
        .select('*')
        .eq('id', workerId)
        .single();
      
      if (workerError) throw workerError;
      
      setWorker(workerData);
      
      // Fetch worker documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select('*')
        .eq('worker_id', workerId)
        .order('submitted_at', { ascending: false });
      
      if (documentsError) throw documentsError;
      
      setDocuments(documentsData || []);
    } catch (error) {
      console.error('Error fetching worker details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return '#10b981'; // green
      case 'pending':
        return '#f59e0b'; // amber
      case 'deployed':
        return '#3b82f6'; // blue
      case 'inactive':
        return '#6b7280'; // gray
      default:
        return '#6b7280'; // gray
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading worker profile...</Text>
      </View>
    );
  }

  if (!worker) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>Worker not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={styles.profileCard}>
          <Card.Content>
            <View style={styles.profileHeader}>
              <Avatar.Text 
                size={80} 
                label={worker.name.split(' ').map(n => n[0]).join('')} 
              />
              <View style={styles.profileInfo}>
                <Title>{worker.name}</Title>
                <Chip 
                  style={{ backgroundColor: getStatusColor(worker.status) }}
                  textStyle={{ color: '#fff' }}
                >
                  {worker.status}
                </Chip>
                {worker.destination && (
                  <Paragraph>Destination: {worker.destination}</Paragraph>
                )}
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <List.Section>
              <List.Subheader>Personal Information</List.Subheader>
              
              <List.Item 
                title="Passport Number"
                description={worker.passport_number}
                left={props => <List.Icon {...props} icon="passport" />}
              />
              
              <List.Item 
                title="Nationality"
                description={worker.nationality || 'N/A'}
                left={props => <List.Icon {...props} icon="flag" />}
              />
              
              <List.Item 
                title="Date of Birth"
                description={formatDate(worker.date_of_birth)}
                left={props => <List.Icon {...props} icon="calendar" />}
              />
              
              <List.Item 
                title="Gender"
                description={worker.gender || 'N/A'}
                left={props => <List.Icon {...props} icon="account" />}
              />
            </List.Section>
            
            <Divider style={styles.divider} />
            
            <List.Section>
              <List.Subheader>Contact Information</List.Subheader>
              
              <List.Item 
                title="Phone Number"
                description={worker.contact_number || 'N/A'}
                left={props => <List.Icon {...props} icon="phone" />}
              />
              
              <List.Item 
                title="Email"
                description={worker.email || 'N/A'}
                left={props => <List.Icon {...props} icon="email" />}
              />
              
              <List.Item 
                title="Address"
                description={worker.address || 'N/A'}
                left={props => <List.Icon {...props} icon="home" />}
              />
            </List.Section>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Documents</Title>
            
            {documents.length > 0 ? (
              documents.map((doc) => (
                <List.Item
                  key={doc.id}
                  title={doc.document_type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  description={`Status: ${doc.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
                  left={props => <List.Icon {...props} icon="file-document" />}
                  right={props => <List.Icon {...props} icon="chevron-right" />}
                  onPress={() => navigation.navigate('DocumentDetail', { documentId: doc.id })}
                />
              ))
            ) : (
              <Paragraph style={styles.noDocuments}>No documents found</Paragraph>
            )}
          </Card.Content>
          
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => navigation.navigate('UploadDocument', { workerId: worker.id })}
            >
              Upload Document
            </Button>
          </Card.Actions>
        </Card>
        
        <View style={styles.actionButtons}>
          <Button 
            mode="outlined" 
            icon="arrow-left" 
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
          >
            Back
          </Button>
          
          <Button 
            mode="contained" 
            icon="pencil" 
            onPress={() => navigation.navigate('EditWorker', { workerId: worker.id })}
            style={styles.actionButton}
          >
            Edit Profile
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginVertical: 10,
  },
  profileCard: {
    margin: 16,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  divider: {
    marginVertical: 16,
  },
  card: {
    margin: 16,
    marginTop: 0,
    elevation: 2,
  },
  noDocuments: {
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});