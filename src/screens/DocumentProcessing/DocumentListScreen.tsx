import React, { useCallback, useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Title, Paragraph, Badge, ActivityIndicator, Button, Menu, Divider, Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { theme } from '../../theme';
import { useFilters } from '../../hooks/useFilters';
import { SafeAreaView } from 'react-native-safe-area-context';

type DocumentRecord = {
  id: string;
  worker_name: string;
  document_type: string;
  status: string;
  submitted_at: string | null;
  processed_at: string | null;
  processing_time: number | null;
  processor_name: string | null;
};

export default function DocumentListScreen({ navigation }) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState<string | null>(null);
  const { filters, updateFilter, resetFilters } = useFilters({
    searchQuery: '',
    status: 'all',
    documentType: 'all'
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      
      // Replace with your actual Supabase query
      const { data, error } = await supabase
        .from('documents')
        .select('*, workers(name)')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the data
      const formattedData = data?.map(doc => ({
        ...doc,
        worker_name: doc.workers?.name || 'Unknown Worker',
      })) || [];
      
      setDocuments(formattedData);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge style={styles.pendingBadge}>Pending Review</Badge>;
      case 'approved':
        return <Badge style={styles.approvedBadge}>Approved</Badge>;
      case 'rejected':
        return <Badge style={styles.rejectedBadge}>Rejected</Badge>;
      case 'expired':
        return <Badge style={styles.expiredBadge}>Expired</Badge>;
      case 'needs_correction':
        return <Badge style={styles.correctionBadge}>Needs Correction</Badge>;
      default:
        return <Badge style={styles.defaultBadge}>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'PPP');
  };

  const formatDocumentType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.worker_name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(filters.searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || doc.status === filters.status;
    const matchesType = filters.documentType === 'all' || doc.document_type === filters.documentType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const renderDocumentItem = ({ item }: { item: DocumentRecord }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title>{item.worker_name}</Title>
          {getStatusBadge(item.status)}
        </View>
        
        <Paragraph style={styles.documentType}>
          {formatDocumentType(item.document_type)}
        </Paragraph>
        
        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Submitted:</Text>
            <Text style={styles.dateValue}>{formatDate(item.submitted_at)}</Text>
          </View>
          
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Processed:</Text>
            <Text style={styles.dateValue}>{formatDate(item.processed_at)}</Text>
          </View>
        </View>
        
        {item.processing_time && (
          <Text style={styles.processingTime}>
            Processing Time: {item.processing_time.toFixed(1)} hours
          </Text>
        )}
      </Card.Content>
      
      <Card.Actions>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('DocumentDetail', { documentId: item.id })}
        >
          View Details
        </Button>
        
        <View style={{ flex: 1 }} />
        
        <Menu
          visible={menuVisible === item.id}
          onDismiss={() => setMenuVisible(null)}
          anchor={
            <TouchableOpacity onPress={() => setMenuVisible(item.id)}>
              <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          }
        >
          <Menu.Item onPress={() => {
            setMenuVisible(null);
            navigation.navigate('DocumentDetail', { documentId: item.id });
          }} title="View Details" />
          <Divider />
          <Menu.Item onPress={() => {
            setMenuVisible(null);
            navigation.navigate('WorkerProfile', { workerId: item.worker_id });
          }} title="View Worker Profile" />
          <Divider />
          <Menu.Item onPress={() => {
            setMenuVisible(null);
            // Implement document download functionality
          }} title="Download Document" />
        </Menu>
      </Card.Actions>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        <Searchbar
          placeholder="Search documents..."
          onChangeText={(query) => updateFilter('searchQuery', query)}
          value={filters.searchQuery}
          style={styles.searchBar}
        />
        
        <View style={styles.filterButtons}>
          <Button 
            mode="outlined" 
            onPress={() => navigation.navigate('DocumentFilters', { 
              filters, 
              updateFilter,
              resetFilters,
              onApply: () => navigation.goBack()
            })}
            style={styles.filterButton}
          >
            <MaterialCommunityIcons name="filter-variant" size={18} color={theme.colors.primary} />
            Filters
          </Button>
          
          <Button 
            mode="outlined" 
            onPress={resetFilters}
            style={styles.filterButton}
          >
            <MaterialCommunityIcons name="filter-remove" size={18} color={theme.colors.primary} />
            Reset
          </Button>
        </View>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredDocuments}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No documents found</Text>
            </View>
          }
          refreshing={isLoading}
          onRefresh={fetchDocuments}
        />
      )}
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('UploadDocument')}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchBar: {
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
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
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentType: {
    fontSize: 16,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
  },
  dateValue: {
    fontSize: 14,
  },
  processingTime: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: theme.colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  pendingBadge: {
    backgroundColor: '#f59e0b',
  },
  approvedBadge: {
    backgroundColor: '#10b981',
  },
  rejectedBadge: {
    backgroundColor: '#ef4444',
  },
  expiredBadge: {
    backgroundColor: '#6b7280',
  },
  correctionBadge: {
    backgroundColor: '#3b82f6',
  },
  defaultBadge: {
    backgroundColor: '#6b7280',
  },
});