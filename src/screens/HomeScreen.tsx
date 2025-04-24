import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({
    pendingDocuments: 0,
    approvedDocuments: 0,
    rejectedDocuments: 0,
    totalWorkers: 0
  });
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch dashboard statistics
      const { data: statsData, error: statsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();
      
      if (statsError) throw statsError;
      
      // Fetch recent documents
      const { data: documentsData, error: documentsError } = await supabase
        .from('documents')
        .select(`
          id,
          document_type,
          status,
          submitted_at,
          worker:worker_id(name)
        `)
        .order('submitted_at', { ascending: false })
        .limit(5);
      
      if (documentsError) throw documentsError;
      
      setStats(statsData);
      setRecentDocuments(documentsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return 'check-circle';
      case 'rejected':
        return 'close-circle';
      case 'pending_review':
        return 'clock-outline';
      case 'needs_correction':
        return 'alert-circle';
      default:
        return 'file-document-outline';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      case 'pending_review':
        return theme.colors.warning;
      case 'needs_correction':
        return theme.colors.notification;
      default:
        return theme.colors.primary;
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Title style={styles.title}>Dashboard</Title>
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statsCard}>
            <Card.Content>
              <MaterialCommunityIcons 
                name="file-document-outline" 
                size={24} 
                color={theme.colors.primary} 
              />
              <Title>{stats.pendingDocuments}</Title>
              <Paragraph>Pending</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.statsCard}>
            <Card.Content>
              <MaterialCommunityIcons 
                name="check-circle" 
                size={24} 
                color={theme.colors.success} 
              />
              <Title>{stats.approvedDocuments}</Title>
              <Paragraph>Approved</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.statsCard}>
            <Card.Content>
              <MaterialCommunityIcons 
                name="close-circle" 
                size={24} 
                color={theme.colors.error} 
              />
              <Title>{stats.rejectedDocuments}</Title>
              <Paragraph>Rejected</Paragraph>
            </Card.Content>
          </Card>
        </View>
        
        {/* Quick Actions */}
        <Card style={styles.actionsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Quick Actions</Title>
            <View style={styles.actionsContainer}>
              <Button 
                mode="contained" 
                icon="camera" 
                onPress={() => navigation.navigate('SubmitDocument')}
                style={styles.actionButton}
              >
                Submit Document
              </Button>
              <Button 
                mode="outlined" 
                icon="view-list" 
                onPress={() => navigation.navigate('DocumentList')}
                style={styles.actionButton}
              >
                View Documents
              </Button>
            </View>
          </Card.Content>
        </Card>
        
        {/* Recent Documents */}
        <Card style={styles.documentsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Recent Documents</Title>
            {recentDocuments.length > 0 ? (
              recentDocuments.map((doc) => (
                <List.Item
                  key={doc.id}
                  title={doc.document_type.replace('_', ' ')}
                  description={`Submitted: ${formatDate(doc.submitted_at)}`}
                  left={props => (
                    <MaterialCommunityIcons
                      {...props}
                      name={getStatusIcon(doc.status)}
                      size={24}
                      color={getStatusColor(doc.status)}
                      style={styles.listIcon}
                    />
                  )}
                  right={props => (
                    <Paragraph {...props} style={styles.workerName}>
                      {doc.worker.name}
                    </Paragraph>
                  )}
                  onPress={() => navigation.navigate('DocumentDetail', { documentId: doc.id })}
                  style={styles.listItem}
                />
              ))
            ) : (
              <Paragraph style={styles.emptyText}>No recent documents</Paragraph>
            )}
            <Button 
              mode="text" 
              onPress={() => navigation.navigate('DocumentList')}
              style={styles.viewAllButton}
            >
              View All Documents
            </Button>
          </Card.Content>
        </Card>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statsCard: {
    width: '30%',
  },
  actionsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
  },
  documentsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  listItem: {
    paddingLeft: 0,
  },
  listIcon: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  workerName: {
    alignSelf: 'center',
    color: theme.colors.backdrop,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 16,
    fontStyle: 'italic',
  },
  viewAllButton: {
    marginTop: 8,
    alignSelf: 'center',
  },
});