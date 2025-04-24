import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, Badge, Divider, Button, List, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { theme } from '../theme';

type WorkerDetail = {
  id: string;
  name: string;
  jobRole: string;
  status: string;
  destination: string;
  passportNumber: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  address: string;
  education: string;
  experience: string[];
  languages: string[];
  trainings: {
    id: string;
    title: string;
    status: string;
    completionDate: string | null;
  }[];
  documents: {
    id: string;
    type: string;
    status: string;
    expiryDate: string | null;
  }[];
};

export default function WorkerDetailScreen({ route, navigation }) {
  const { workerId } = route.params;
  const [worker, setWorker] = useState<WorkerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchWorkerDetail();
  }, [workerId]);

  const fetchWorkerDetail = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with your actual Supabase query
      // For now, we'll simulate a delay and return mock data
      setTimeout(() => {
        const mockWorker = {
          id: workerId,
          name: 'Abebe Kebede',
          jobRole: 'Domestic Worker',
          status: 'Ready for Deployment',
          destination: 'Saudi Arabia',
          passportNumber: 'EP1234567',
          dateOfBirth: '1990-05-15',
          gender: 'Male',
          phoneNumber: '+251912345678',
          address: 'Addis Ababa, Ethiopia',
          education: 'High School',
          experience: [
            '2 years as domestic worker in Lebanon',
            '1 year as caregiver in local hospital'
          ],
          languages: ['Amharic', 'English', 'Basic Arabic'],
          trainings: [
            {
              id: 'TR-001',
              title: 'Arabic Language Training',
              status: 'completed',
              completionDate: '2024-03-10'
            },
            {
              id: 'TR-003',
              title: 'Cultural Orientation for Saudi Arabia',
              status: 'completed',
              completionDate: '2024-03-05'
            },
            {
              id: 'TR-002',
              title: 'Housekeeping Professional Skills',
              status: 'in_progress',
              completionDate: null
            }
          ],
          documents: [
            {
              id: 'DOC-001',
              type: 'Passport',
              status: 'verified',
              expiryDate: '2029-01-15'
            },
            {
              id: 'DOC-002',
              type: 'Medical Certificate',
              status: 'verified',
              expiryDate: '2024-09-20'
            },
            {
              id: 'DOC-003',
              type: 'Employment Contract',
              status: 'pending',
              expiryDate: null
            }
          ]
        };
        
        setWorker(mockWorker);
        setIsLoading(false);
      }, 1000);
      
      // In a real implementation, you would use:
      /*
      const { data, error } = await supabase
        .from('workers')
        .select(`
          *,
          trainings:worker_trainings(
            id,
            training:trainings(id, title),
            status,
            completion_date
          ),
          documents:worker_documents(
            id,
            type,
            status,
            expiry_date
          )
        `)
        .eq('id', workerId)
        .single();
      
      if (error) throw error;
      
      // Format the data
      const formattedWorker = {
        ...data,
        trainings: data.trainings.map(t => ({
          id: t.training.id,
          title: t.training.title,
          status: t.status,
          completionDate: t.completion_date
        })),
        documents: data.documents
      };
      
      setWorker(formattedWorker);
      */
      
    } catch (error) {
      console.error('Error fetching worker details:', error);
      Alert.alert('Error', 'Failed to load worker details');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ready for deployment':
      case 'completed':
      case 'verified':
        return '#10b981'; // green
      case 'in training':
      case 'in_progress':
        return '#3b82f6'; // blue
      case 'documentation pending':
      case 'pending':
        return '#f59e0b'; // amber
      case 'deployed':
        return '#6366f1'; // indigo
      default:
        return '#6b7280'; // gray
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const formatStatus = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading worker details...</Text>
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
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.profileHeader}>
            <Avatar.Text 
              size={60} 
              label={worker.name.split(' ').map(n => n[0]).join('')} 
              backgroundColor="#e5e7eb"
              color="#4b5563"
            />
            <View style={styles.profileInfo}>
              <Title style={styles.name}>{worker.name}</Title>
              <Paragraph style={styles.jobRole}>{worker.jobRole}</Paragraph>
              <Badge style={{ backgroundColor: getStatusColor(worker.status) }}>
                {worker.status}
              </Badge>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
            Personal Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'trainings' && styles.activeTab]}
          onPress={() => setActiveTab('trainings')}
        >
          <Text style={[styles.tabText, activeTab === 'trainings' && styles.activeTabText]}>
            Trainings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'documents' && styles.activeTab]}
          onPress={() => setActiveTab('documents')}
        >
          <Text style={[styles.tabText, activeTab === 'documents' && styles.activeTabText]}>
            Documents
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'details' && (
        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Item 
                title="Passport Number" 
                description={worker.passportNumber}
                left={props => <List.Icon {...props} icon="passport" />}
              />
              <Divider />
              <List.Item 
                title="Date of Birth" 
                description={formatDate(worker.dateOfBirth)}
                left={props => <List.Icon {...props} icon="calendar" />}
              />
              <Divider />
              <List.Item 
                title="Gender" 
                description={worker.gender}
                left={props => <List.Icon {...props} icon="account" />}
              />
              <Divider />
              <List.Item 
                title="Phone Number" 
                description={worker.phoneNumber}
                left={props => <List.Icon {...props} icon="phone" />}
              />
              <Divider />
              <List.Item 
                title="Address" 
                description={worker.address}
                left={props => <List.Icon {...props} icon="home" />}
              />
              <Divider />
              <List.Item 
                title="Destination" 
                description={worker.destination}
                left={props => <List.Icon {...props} icon="airplane" />}
              />
              <Divider />
              <List.Item 
                title="Education" 
                description={worker.education}
                left={props => <List.Icon {...props} icon="school" />}
              />
            </List.Section>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experience</Text>
              {worker.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <MaterialCommunityIcons name="circle-small" size={20} color="#6b7280" />
                  <Text style={styles.experienceText}>{exp}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Languages</Text>
              <View style={styles.languagesContainer}>
                {worker.languages.map((language, index) => (
                  <Chip key={index} style={styles.languageChip} icon="translate">
                    {language}
                  </Chip>
                ))}
              </View>
            </View>
          </Card.Content>
        </Card>
      )}
      
      {activeTab === 'trainings' && (
        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              {worker.trainings.map((training) => (
                <React.Fragment key={training.id}>
                  <List.Item 
                    title={training.title}
                    description={
                      training.completionDate 
                        ? `Completed on ${formatDate(training.completionDate)}` 
                        : 'In progress'
                    }
                    left={props => <List.Icon {...props} icon="school" />}
                    right={props => (
                      <Badge 
                        {...props}
                        style={{ 
                          backgroundColor: getStatusColor(training.status),
                          alignSelf: 'center'
                        }}
                      >
                        {formatStatus(training.status)}
                      </Badge>
                    )}
                    onPress={() => navigation.navigate('TrainingDetail', { trainingId: training.id })}
                  />
                  <Divider />
                </React.Fragment>
              ))}
            </List.Section>
            
            {worker.trainings.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="school" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>No trainings yet</Text>
              </View>
            )}
            
            <Button 
              mode="contained" 
              icon="plus"
              onPress={() => navigation.navigate('TrainingAssign', { workerId: worker.id })}
              style={styles.actionButton}
            >
              Assign Training
            </Button>
          </Card.Content>
        </Card>
      )}
      
      {activeTab === 'documents' && (
        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              {worker.documents.map((document) => (
                <React.Fragment key={document.id}>
                  <List.Item 
                    title={document.type}
                    description={
                      document.expiryDate 
                        ? `Expires on ${formatDate(document.expiryDate)}` 
                        : 'No expiry date'
                    }
                    left={props => <List.Icon {...props} icon="file-document" />}
                    right={props => (
                      <Badge 
                        {...props}
                        style={{ 
                          backgroundColor: getStatusColor(document.status),
                          alignSelf: 'center'
                        }}
                      >
                        {formatStatus(document.status)}
                      </Badge>
                    )}
                    onPress={() => navigation.navigate('DocumentDetail', { documentId: document.id })}
                  />
                  <Divider />
                </React.Fragment>
              ))}
            </List.Section>
            
            {worker.documents.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="file-document" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>No documents yet</Text>
              </View>
            )}
            
            <Button 
              mode="contained" 
              icon="plus"
              onPress={() => navigation.navigate('DocumentUpload', { workerId: worker.id })}
              style={styles.actionButton}
            >
              Upload Document
            </Button>
          </Card.Content>
        </Card>
      )}
      
      <View style={styles.actionContainer}>
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
          onPress={() => navigation.navigate('WorkerEdit', { workerId: worker.id })}
          style={styles.actionButton}
        >
          Edit Worker
        </Button>
      </View>
    </ScrollView>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#F44336',
    marginVertical: 16,
  },
  headerCard: {
    margin: 16,
    marginBottom: 8,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  jobRole: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  card: {
    margin: 16,
    marginTop: 8,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  experienceText: {
    flex: 1,
    fontSize: 14,
    color: '#4b5563',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  languageChip: {
    margin: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateText: {
    marginTop: 8,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});