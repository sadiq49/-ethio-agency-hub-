 and import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Badge, Avatar, Divider, Button, ActivityIndicator, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Participant {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'absent' | 'pending';
  progress: number;
  attendance: number;
  avatar?: string;
}

interface TrainingParticipantsScreenProps {
  route: {
    params: {
      trainingId: string;
      trainingTitle: string;
    };
  };
  navigation: any;
}

export default function TrainingParticipantsScreen({ route, navigation }: TrainingParticipantsScreenProps) {
  const { trainingId, trainingTitle } = route.params;
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchParticipants();
  }, [trainingId]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      
      // In a real implementation, you would fetch from Supabase
      // For now, using mock data
      setTimeout(() => {
        const mockParticipants: Participant[] = [
          {
            id: 'P001',
            name: 'Abebe Kebede',
            status: 'active',
            progress: 75,
            attendance: 90,
          },
          {
            id: 'P002',
            name: 'Fatima Ahmed',
            status: 'completed',
            progress: 100,
            attendance: 95,
          },
          {
            id: 'P003',
            name: 'Dawit Mekonnen',
            status: 'absent',
            progress: 45,
            attendance: 60,
          },
          {
            id: 'P004',
            name: 'Sara Tesfaye',
            status: 'pending',
            progress: 0,
            attendance: 0,
          },
          {
            id: 'P005',
            name: 'Mohammed Ali',
            status: 'active',
            progress: 80,
            attendance: 85,
          },
        ];
        
        setParticipants(mockParticipants);
        setLoading(false);
      }, 1000);
      
      // Actual implementation would be:
      /*
      const { data, error } = await supabase
        .from('training_participants')
        .select('*, workers(*)')
        .eq('training_id', trainingId);
        
      if (error) throw error;
      
      const formattedParticipants = data.map(item => ({
        id: item.id,
        name: item.workers.name,
        status: item.status,
        progress: item.progress,
        attendance: item.attendance,
        avatar: item.workers.avatar_url
      }));
      
      setParticipants(formattedParticipants);
      */
    } catch (error) {
      console.error('Error fetching participants:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#3b82f6'; // blue
      case 'completed':
        return '#10b981'; // green
      case 'absent':
        return '#ef4444'; // red
      case 'pending':
        return '#f59e0b'; // amber
      default:
        return '#6b7280'; // gray
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'absent':
        return 'Absent';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || participant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderParticipantItem = ({ item }: { item: Participant }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.participantInfo}>
            <Avatar.Text 
              size={40} 
              label={item.name.split(' ').map(n => n[0]).join('')} 
              backgroundColor="#e0e0e0"
            />
            <View style={styles.nameContainer}>
              <Title style={styles.name}>{item.name}</Title>
              <Badge style={{ backgroundColor: getStatusColor(item.status) }}>
                {getStatusLabel(item.status)}
              </Badge>
            </View>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${item.progress}%`, backgroundColor: getStatusColor(item.status) }
                ]} 
              />
            </View>
            <Text style={styles.statValue}>{item.progress}%</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Attendance</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${item.attendance}%`, 
                    backgroundColor: item.attendance < 70 ? '#ef4444' : '#10b981' 
                  }
                ]} 
              />
            </View>
            <Text style={styles.statValue}>{item.attendance}%</Text>
          </View>
        </View>
      </Card.Content>
      
      <Card.Actions>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('WorkerProfile', { workerId: item.id })}
        >
          View Profile
        </Button>
        <Button 
          mode="contained" 
          onPress={() => {
            // Handle marking attendance or updating progress
          }}
        >
          Update Status
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{trainingTitle} - Participants</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search participants"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'all' && styles.activeFilter]}
            onPress={() => setStatusFilter('all')}
          >
            <Text style={statusFilter === 'all' ? styles.activeFilterText : styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'active' && styles.activeFilter]}
            onPress={() => setStatusFilter('active')}
          >
            <Text style={statusFilter === 'active' ? styles.activeFilterText : styles.filterText}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'completed' && styles.activeFilter]}
            onPress={() => setStatusFilter('completed')}
          >
            <Text style={statusFilter === 'completed' ? styles.activeFilterText : styles.filterText}>Completed</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, statusFilter === 'absent' && styles.activeFilter]}
            onPress={() => setStatusFilter('absent')}
          >
            <Text style={statusFilter === 'absent' ? styles.activeFilterText : styles.filterText}>Absent</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading participants...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredParticipants}
          renderItem={renderParticipantItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="account-group" size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>No participants found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  searchBar: {
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  activeFilter: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    color: '#4b5563',
    fontSize: 12,
  },
  activeFilterText: {
    color: '#ffffff',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#6b7280',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nameContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  divider: {
    marginVertical: 12,
  },
  statsContainer: {
    marginTop: 8,
  },
  statItem: {
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 16,
  },
});