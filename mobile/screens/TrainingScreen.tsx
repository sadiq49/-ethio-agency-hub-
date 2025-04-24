tionimport React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Searchbar, Card, Badge, ProgressBar, Chip, FAB, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Sample data for trainings
const trainings = [
  {
    id: 'TR-001',
    title: 'Arabic Language Training',
    type: 'Language',
    location: 'Addis Ababa Training Center',
    startDate: '2024-03-15',
    endDate: '2024-04-15',
    status: 'Ongoing',
    participants: 24,
    completionRate: 45,
    trainer: 'Ahmed Mohammed'
  },
  {
    id: 'TR-002',
    title: 'Housekeeping Professional Skills',
    type: 'Professional',
    location: 'Bahir Dar Vocational Center',
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: 'Scheduled',
    participants: 18,
    completionRate: 0,
    trainer: 'Sara Tesfaye'
  },
  {
    id: 'TR-003',
    title: 'Cultural Orientation for Saudi Arabia',
    type: 'Orientation',
    location: 'Addis Ababa Training Center',
    startDate: '2024-02-10',
    endDate: '2024-03-10',
    status: 'Completed',
    participants: 32,
    completionRate: 100,
    trainer: 'Mohammed Ali'
  },
  {
    id: 'TR-004',
    title: 'Caregiving Essentials',
    type: 'Professional',
    location: 'Hawassa Training Facility',
    startDate: '2024-03-20',
    endDate: '2024-04-20',
    status: 'Ongoing',
    participants: 15,
    completionRate: 30,
    trainer: 'Tigist Haile'
  }
];

// Sample data for workers with certifications
const workers = [
  {
    id: 'W-1234',
    name: 'Abebe Kebede',
    certifications: [
      { name: 'Arabic Language', date: '2024-03-10' },
      { name: 'Cultural Orientation', date: '2024-03-05' }
    ]
  },
  {
    id: 'W-2345',
    name: 'Fatima Ahmed',
    certifications: [
      { name: 'Housekeeping', date: '2024-03-12' }
    ]
  },
  {
    id: 'W-3456',
    name: 'Dawit Mekonnen',
    certifications: [
      { name: 'Caregiving', date: '2024-03-08' },
      { name: 'First Aid', date: '2024-03-01' }
    ]
  }
];

const TrainingScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch =
      training.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      training.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
    const matchesType = typeFilter === 'all' || training.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return '#10b981'; // green
      case 'Ongoing':
        return '#3b82f6'; // blue
      case 'Scheduled':
        return '#f59e0b'; // amber
      default:
        return '#6b7280'; // gray
    }
  };

  const renderTrainingItem = ({ item }) => (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.location}</Text>
          </View>
          <Badge style={{ backgroundColor: getStatusColor(item.status) }}>
            {item.status}
          </Badge>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {item.startDate} - {item.endDate}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="account-group" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {item.participants} participants
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="school" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {item.trainer}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="tag" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              {item.type}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>Completion</Text>
            <Text style={styles.progressPercentage}>{item.completionRate}%</Text>
          </View>
          <ProgressBar 
            progress={item.completionRate / 100} 
            color={getStatusColor(item.status)} 
            style={styles.progressBar} 
          />
        </View>
      </Card.Content>
      
      <Card.Actions style={styles.cardActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="eye" size={16} color="#3b82f6" />
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="account-group" size={16} color="#3b82f6" />
          <Text style={styles.actionButtonText}>Participants</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionButton, styles.primaryActionButton]}>
          <Icon name="pencil" size={16} color="#ffffff" />
          <Text style={styles.primaryActionButtonText}>Manage</Text>
        </TouchableOpacity>
      </Card.Actions>
    </Card>
  );

  const renderCertificationItem = ({ item }) => (
    <Card style={styles.certCard} mode="outlined">
      <Card.Content>
        <View style={styles.certCardHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.name.split(' ').map(n => n[0]).join('')}
            </Text>
          </View>
          <View style={styles.certCardContent}>
            <View style={styles.certCardTitleRow}>
              <Text style={styles.certCardTitle}>{item.name}</Text>
              <Text style={styles.certCardId}>{item.id}</Text>
            </View>
            <View style={styles.certBadgesContainer}>
              {item.certifications.map((cert, index) => (
                <Chip 
                  key={index} 
                  style={styles.certBadge}
                  icon="check-circle"
                >
                  {cert.name}
                </Chip>
              ))}
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Management</Text>
        <Text style={styles.subtitle}>Manage worker training programs</Text>
      </View>
      
      <Searchbar
        placeholder="Search trainings..."
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
            selected={statusFilter === 'Ongoing'}
            onPress={() => setStatusFilter('Ongoing')}
            style={styles.filterChip}
          >
            Ongoing
          </Chip>
          <Chip
            selected={statusFilter === 'Scheduled'}
            onPress={() => setStatusFilter('Scheduled')}
            style={styles.filterChip}
          >
            Scheduled
          </Chip>
          <Chip
            selected={statusFilter === 'Completed'}
            onPress={() => setStatusFilter('Completed')}
            style={styles.filterChip}
          >
            Completed
          </Chip>
          
          <Chip
            selected={typeFilter === 'all'}
            onPress={() => setTypeFilter('all')}
            style={styles.filterChip}
          >
            All Types
          </Chip>
          <Chip
            selected={typeFilter === 'Language'}
            onPress={() => setTypeFilter('Language')}
            style={styles.filterChip}
          >
            Language
          </Chip>
          <Chip
            selected={typeFilter === 'Professional'}
            onPress={() => setTypeFilter('Professional')}
            style={styles.filterChip}
          >
            Professional
          </Chip>
          <Chip
            selected={typeFilter === 'Orientation'}
            onPress={() => setTypeFilter('Orientation')}
            style={styles.filterChip}
          >
            Orientation
          </Chip>
        </ScrollView>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Active Trainings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>245</Text>
          <Text style={styles.statLabel}>Participants</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>92%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
      </View>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Current Trainings</Text>
      </View>
      
      <FlatList
        data={filteredTrainings}
        renderItem={renderTrainingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Certifications</Text>
      </View>
      
      <FlatList
        data={workers}
        renderItem={renderCertificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        label="New Training"
        onPress={() => console.log('Add new training')}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  divider: {
    marginVertical: 12,
  },
  cardDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 8,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4b5563',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  cardActions: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 4,
  },
  primaryActionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  primaryActionButtonText: {
    fontSize: 14,
    color: '#ffffff',
    marginLeft: 4,
  },
  certCard: {
    marginBottom: 12,
    borderColor: '#e5e7eb',
  },
  certCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  certCardContent: {
    flex: 1,
  },
  certCardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  certCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  certCardId: {
    fontSize: 12,
    color: '#6b7280',
  },
  certBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  certBadge: {
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#f3f4f6',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3b82f6',
  },
});

export default TrainingScreen;