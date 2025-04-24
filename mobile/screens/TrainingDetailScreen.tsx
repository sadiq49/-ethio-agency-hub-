import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, Badge, Divider, Button, List, Avatar, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { theme } from '../theme';

type TrainingDetail = {
  id: string;
  title: string;
  type: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
  participants_count: number;
  completion_rate: number;
  trainer_name: string;
  description: string;
};

type Participant = {
  id: string;
  worker_id: string;
  worker_name: string;
  status: string;
  joined_at: string;
  completed_at: string | null;
};

export default function TrainingDetailScreen({ route, navigation }) {
  const { trainingId } = route.params;
  const [training, setTraining] = useState<TrainingDetail | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchTrainingDetail();
  }, [trainingId]);

  const fetchTrainingDetail = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with your actual Supabase query
      // For now, we'll simulate a delay and return mock data
      setTimeout(() => {
        const mockTraining = {
          id: trainingId,
          title: 'Arabic Language Training',
          type: 'Language',
          location: 'Addis Ababa Training Center',
          start_date: '2024-03-15',
          end_date: '2024-04-15',
          status: 'Ongoing',
          participants_count: 24,
          completion_rate: 45,
          trainer_name: 'Ahmed Mohammed',
          description: 'This comprehensive Arabic language course is designed for workers preparing for deployment to Arabic-speaking countries. The course covers basic conversation, workplace terminology, and cultural context to help workers communicate effectively in their new environment.'
        };
        
        const mockParticipants = [
          {
            id: 'P-001',
            worker_id: 'W-1234',
            worker_name: 'Abebe Kebede',
            status: 'in_progress',
            joined_at: '2024-03-15',
            completed_at: null
          },
          {
            id: 'P-002',
            worker_id: 'W-2345',
            worker_name: 'Fatima Ahmed',
            status: 'in_progress',
            joined_at: '2024-03-15',
            completed_at: null
          },
          {
            id: 'P-003',
            worker_id: 'W-3456',
            worker_name: 'Dawit Mekonnen',
            status: 'completed',
            joined_at: '2024-03-15',
            completed_at: '2024-03-30'
          }
        ];
        
        setTraining(mockTraining);
        setParticipants(mockParticipants);
        setIsLoading(false);
      }, 1000);
      
      // In a real implementation, you would use:
      /*
      const { data: trainingData, error: trainingError } = await supabase
        .from('trainings')
        .select('*')
        .eq('id', trainingId)
        .single();
      
      if (trainingError) throw trainingError;
      
      const { data: participantsData, error: participantsError } = await supabase
        .from('training_participants')
        .select('*, workers(name)')
        .eq('training_id', trainingId);
      
      if (participantsError) throw participantsError;
      
      setTraining(trainingData);
      setParticipants(participantsData.map(p => ({
        ...p,
        worker_name: p.workers?.name || 'Unknown Worker'
      })));
      */
      
    } catch (error) {
      console.error('Error fetching training details:', error);
      Alert.alert('Error', 'Failed to load training details');
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'completed':
        return '#10b981'; // green
      case 'Ongoing':
      case 'in_progress':
        return '#3b82f6'; // blue
      case 'Scheduled':
      case 'scheduled':
        return '#f59e0b'; // amber
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
        <Text style={styles.loadingText}>Loading training details...</Text>
      </View>
    );
  }

  if (!training) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#F44336" />
        <Text style={styles.errorText}>Training not found</Text>
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
          <View style={styles.headerRow}>
            <Title style={styles.title}>{training.title}</Title>
            <Badge style={{ backgroundColor: getStatusColor(training.status) }}>
              {formatStatus(training.status)}
            </Badge>
          </View>
          <Paragraph style={styles.location}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#6b7280" />
            {' '}{training.location}
          </Paragraph>
        </Card.Content>
      </Card>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'details' && styles.activeTab]}
          onPress={() => setActiveTab('details')}
        >
          <Text style={[styles.tabText, activeTab === 'details' && styles.activeTabText]}>
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'participants' && styles.activeTab]}
          onPress={() => setActiveTab('participants')}
        >
          <Text style={[styles.tabText, activeTab === 'participants' && styles.activeTabText]}>
            Participants ({participants.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      {activeTab === 'details' ? (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatDate(training.start_date)}</Text>
                <Text style={styles.statLabel}>Start Date</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{formatDate(training.end_date)}</Text>
                <Text style={styles.statLabel}>End Date</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{training.participants_count}</Text>
                <Text style={styles.statLabel}>Participants</Text>
              </View>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Training Type</Text>
              <Chip icon="tag" style={styles.chip}>{training.type}</Chip>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trainer</Text>
              <View style={styles.trainerRow}>
                <Avatar.Text 
                  size={40} 
                  label={training.trainer_name.split(' ').map(n => n[0]).join('')} 
                  backgroundColor="#e5e7eb"
                  color="#4b5563"
                />
                <Text style={styles.trainerName}>{training.trainer_name}</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Completion Rate</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressPercentage}>{training.completion_rate}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { width: `${training.completion_rate}%`, backgroundColor: getStatusColor(training.status) }
                    ]} 
                  />
                </View>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{training.description}</Text>
            </View>
          </Card.Content>
        </Card>
      ) : (
        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              {participants.map((participant) => (
                <List.Item
                  key={participant.id}
                  title={participant.worker_name}
                  description={`Joined: ${formatDate(participant.joined_at)}`}
                  left={props => (
                    <Avatar.Text 
                      {...props}
                      size={40} 
                      label={participant.worker_name.split(' ').map(n => n[0]).join('')} 
                      backgroundColor="#e5e7eb"
                      color="#4b5563"
                    />
                  )}
                  right={props => (
                    <Badge 
                      {...props}
                      style={{ 
                        backgroundColor: getStatusColor(participant.status),
                        alignSelf: 'center'
                      }}
                    >
                      {formatStatus(participant.status)}
                    </Badge>
                  )}
                  style={styles.listItem}
                />
              ))}
            </List.Section>
            
            {participants.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="account-group" size={48} color="#d1d5db" />
                <Text style={styles.emptyStateText}>No participants yet</Text>
              </View>
            )}
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
          onPress={() => Alert.alert('Edit', 'Edit training functionality to be implemented')}
          style={styles.actionButton}
        >
          Edit Training
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    marginBottom: 20,
    fontSize: 18,
    color: '#F44336',
  },
  headerCard: {
    margin: 16,
    borderColor: '#e5e7eb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  activeTabText: {
    color: '#fff',
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: '#e5e7eb',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  divider: {
    marginVertical: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 8,
  },
  chip: {
    alignSelf: 'flex-start',
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerName: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  listItem: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 8,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  }
});