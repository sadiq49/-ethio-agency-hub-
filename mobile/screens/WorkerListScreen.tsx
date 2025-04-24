import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { Searchbar, Card, Badge, Chip, FAB, Divider, Avatar, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

// Sample data for workers
const workers = [
  {
    id: 'W-1234',
    name: 'Abebe Kebede',
    jobRole: 'Domestic Worker',
    status: 'Ready for Deployment',
    destination: 'Saudi Arabia',
    completedTrainings: 3,
    pendingTrainings: 1,
    profileImage: null
  },
  {
    id: 'W-2345',
    name: 'Fatima Ahmed',
    jobRole: 'Caregiver',
    status: 'In Training',
    destination: 'UAE',
    completedTrainings: 1,
    pendingTrainings: 2,
    profileImage: null
  },
  {
    id: 'W-3456',
    name: 'Dawit Mekonnen',
    jobRole: 'Driver',
    status: 'Documentation Pending',
    destination: 'Kuwait',
    completedTrainings: 2,
    pendingTrainings: 0,
    profileImage: null
  },
  {
    id: 'W-4567',
    name: 'Sara Tesfaye',
    jobRole: 'Nurse',
    status: 'Deployed',
    destination: 'Saudi Arabia',
    completedTrainings: 4,
    pendingTrainings: 0,
    profileImage: null
  },
  {
    id: 'W-5678',
    name: 'Mohammed Ali',
    jobRole: 'Construction Worker',
    status: 'Ready for Deployment',
    destination: 'Qatar',
    completedTrainings: 3,
    pendingTrainings: 0,
    profileImage: null
  }
];

const WorkerListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch workers from Supabase here
    // For now, we're using the mock data defined above
  }, []);

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.jobRole.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;
    const matchesDestination = destinationFilter === 'all' || worker.destination === destinationFilter;
    
    return matchesSearch && matchesStatus && matchesDestination;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ready for Deployment':
        return '#10b981'; // green
      case 'In Training':
        return '#3b82f6'; // blue
      case 'Documentation Pending':
        return '#f59e0b'; // amber
      case 'Deployed':
        return '#6366f1'; // indigo
      default:
        return '#6b7280'; // gray
    }
  };

  const renderWorkerItem = ({ item }) => (
    <Card style={styles.card} mode="outlined" onPress={() => navigation.navigate('WorkerDetail', { workerId: item.id })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.workerInfo}>
            <Avatar.Text 
              size={50} 
              label={item.name.split(' ').map(n => n[0]).join('')} 
              backgroundColor="#e5e7eb"
              color="#4b5563"
            />
            <View style={styles.workerDetails}>
              <Text style={styles.workerName}>{item.name}</Text>
              <Text style={styles.workerId}>{item.id}</Text>
              <Text style={styles.jobRole}>{item.jobRole}</Text>
            </View>
          </View>
          <Badge style={{ backgroundColor: getStatusColor(item.status) }}>
            {item.status}
          </Badge>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#6b7280" />
            <Text style={styles.infoText}>Destination: {item.destination}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="school" size={16} color="#6b7280" />
            <Text style={styles.infoText}>
              Trainings: {item.completedTrainings} completed, {item.pendingTrainings} pending
            </Text>
          </View>
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
        <Button 
          mode="text" 
          icon="eye" 
          onPress={() => navigation.navigate('WorkerDetail', { workerId: item.id })}
        >
          View
        </Button>
        <Button 
          mode="text" 
          icon="pencil" 
          onPress={() => navigation.navigate('WorkerEdit', { workerId: item.id })}
        >
          Edit
        </Button>
        <Button 
          mode="contained" 
          icon="account-details" 
          onPress={() => navigation.navigate('WorkerDocuments', { workerId: item.id })}
        >
          Documents
        </Button>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Worker Management</Text>
        <Text style={styles.subtitle}>Manage worker profiles and documentation</Text>
      </View>
      
      <Searchbar
        placeholder="Search workers..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={statusFilter === 'all'}
            onPress={() => setStatusFilter('all')}
            style={styles.filterChip}
          >
            All Status
          </Chip>
          <Chip
            selected={statusFilter === 'Ready for Deployment'}
            onPress={() => setStatusFilter('Ready for Deployment')}
            style={styles.filterChip}
          >
            Ready for Deployment
          </Chip>
          <Chip
            selected={statusFilter === 'In Training'}
            onPress={() => setStatusFilter('In Training')}
            style={styles.filterChip}
          >
            In Training
          </Chip>
          <Chip
            selected={statusFilter === 'Documentation Pending'}
            onPress={() => setStatusFilter('Documentation Pending')}
            style={styles.filterChip}
          >
            Documentation Pending
          </Chip>
          <Chip
            selected={statusFilter === 'Deployed'}
            onPress={() => setStatusFilter('Deployed')}
            style={styles.filterChip}
          >
            Deployed
          </Chip>
          
          <Divider style={styles.verticalDivider} />
          
          <Chip
            selected={destinationFilter === 'all'}
            onPress={() => setDestinationFilter('all')}
            style={styles.filterChip}
          >
            All Destinations
          </Chip>
          <Chip
            selected={destinationFilter === 'Saudi Arabia'}
            onPress={() => setDestinationFilter('Saudi Arabia')}
            style={styles.filterChip}
          >
            Saudi Arabia
          </Chip>
          <Chip
            selected={destinationFilter === 'UAE'}
            onPress={() => setDestinationFilter('UAE')}
            style={styles.filterChip}
          >
            UAE
          </Chip>
          <Chip
            selected={destinationFilter === 'Kuwait'}
            onPress={() => setDestinationFilter('Kuwait')}
            style={styles.filterChip}
          >
            Kuwait
          </Chip>
          <Chip
            selected={destinationFilter === 'Qatar'}
            onPress={() => setDestinationFilter('Qatar')}
            style={styles.filterChip}
          >
            Qatar
          </Chip>
        </ScrollView>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{workers.length}</Text>
          <Text style={styles.statLabel}>Total Workers</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {workers.filter(w => w.status === 'Ready for Deployment').length}
          </Text>
          <Text style={styles.statLabel}>Ready for Deployment</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {workers.filter(w => w.status === 'Deployed').length}
          </Text>
          <Text style={styles.statLabel}>Deployed</Text>
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Loading workers...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkers}
          renderItem={renderWorkerItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="account-search" size={48} color="#d1d5db" />
              <Text style={styles.emptyStateText}>No workers found</Text>
            </View>
          }
        />
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="New Worker"
        onPress={() => navigation.navigate('WorkerCreate')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  searchBar: {
    margin: 16,
    elevation: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  verticalDivider: {
    height: 24,
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 8,
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 4,
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
    paddingBottom: 80, // Extra padding for FAB
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  workerDetails: {
    marginLeft: 12,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  workerId: {
    fontSize: 12,
    color: '#6b7280',
  },
  jobRole: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 2,
  },
  divider: {
    marginVertical: 12,
  },
  infoSection: {
    marginTop: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
});

export default WorkerListScreen;