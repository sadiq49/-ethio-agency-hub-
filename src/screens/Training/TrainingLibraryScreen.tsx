import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Searchbar, Chip, ActivityIndicator, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { downloadForOffline, isDownloadedForOffline } from '../../services/OfflineManager';

export default function TrainingLibraryScreen({ navigation }) {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadStatus, setDownloadStatus] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    fetchTrainingMaterials();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Apply filters when search query or selected categories change
    applyFilters();
  }, [searchQuery, selectedCategories, materials]);

  const fetchTrainingMaterials = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('training_materials')
        .select(`
          *,
          material_categories(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Check which materials are downloaded for offline use
      const materialsWithOfflineStatus = await Promise.all(
        (data || []).map(async (material) => {
          const isOffline = await isDownloadedForOffline(`training_materials/${material.id}`);
          return { ...material, isOffline };
        })
      );
      
      setMaterials(materialsWithOfflineStatus);
      setFilteredMaterials(materialsWithOfflineStatus);
    } catch (error) {
      console.error('Error fetching training materials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('material_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Add this function to enhance search capabilities
  const enhancedSearch = (query, materials) => {
    if (!query) return materials;
    
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return materials.filter(material => {
      const searchableText = `${material.title} ${material.description} ${material.material_categories.map(c => c.name).join(' ')}`.toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  };
  
  // Then replace the existing search filter in applyFilters function
  const applyFilters = () => {
    let filtered = [...materials];
    
    // Apply enhanced search filter
    if (searchQuery) {
      filtered = enhancedSearch(searchQuery, filtered);
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(material => {
        const materialCategories = material.material_categories.map(c => c.name);
        return selectedCategories.some(category => materialCategories.includes(category));
      });
    }
    
    setFilteredMaterials(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleMaterialPress = (material) => {
    navigation.navigate('TrainingMaterialDetail', {
      materialId: material.id,
      title: material.title
    });
  };

  const handleDownloadForOffline = async (material) => {
    try {
      setDownloadStatus({
        ...downloadStatus,
        [material.id]: 'downloading'
      });
      
      // Download the material for offline use
      await downloadForOffline(
        `training_materials/${material.id}`,
        material.file_url,
        material.title
      );
      
      // Update the material's offline status
      setMaterials(materials.map(m => 
        m.id === material.id ? { ...m, isOffline: true } : m
      ));
      
      setDownloadStatus({
        ...downloadStatus,
        [material.id]: 'completed'
      });
    } catch (error) {
      console.error('Error downloading material:', error);
      setDownloadStatus({
        ...downloadStatus,
        [material.id]: 'error'
      });
    }
  };

  const renderMaterialItem = ({ item }) => {
    const materialType = item.file_type || 'unknown';
    const iconName = 
      materialType === 'pdf' ? 'file-pdf-box' :
      materialType === 'video' ? 'file-video' :
      materialType === 'image' ? 'file-image' :
      materialType === 'document' ? 'file-document' :
      'file';
    
    const isDownloading = downloadStatus[item.id] === 'downloading';
    const hasDownloadError = downloadStatus[item.id] === 'error';
    
    return (
      <Card style={styles.materialCard} onPress={() => handleMaterialPress(item)}>
        <Card.Content>
          <View style={styles.materialHeader}>
            <MaterialCommunityIcons name={iconName} size={24} color={theme.colors.primary} />
            <View style={styles.materialMeta}>
              <Text style={styles.materialType}>{materialType.toUpperCase()}</Text>
              {item.isOffline && (
                <Chip icon="check" style={styles.offlineChip}>Offline</Chip>
              )}
            </View>
          </View>
          
          <Title style={styles.materialTitle}>{item.title}</Title>
          <Paragraph style={styles.materialDescription} numberOfLines={2}>
            {item.description}
          </Paragraph>
          
          <View style={styles.materialCategories}>
            {item.material_categories.map((category, index) => (
              <Chip 
                key={index} 
                style={styles.categoryChip}
                onPress={() => toggleCategory(category.name)}
              >
                {category.name}
              </Chip>
            ))}
          </View>
          
          <View style={styles.materialFooter}>
            <Text style={styles.materialDate}>
              Added: {new Date(item.created_at).toLocaleDateString()}
            </Text>
            
            {!item.isOffline && (
              <Button
                mode="outlined"
                icon={isDownloading ? null : "download"}
                loading={isDownloading}
                onPress={() => handleDownloadForOffline(item)}
                style={styles.downloadButton}
                disabled={isDownloading}
              >
                {isDownloading ? 'Downloading...' : 'Save Offline'}
              </Button>
            )}
            
            {hasDownloadError && (
              <Text style={styles.errorText}>Download failed</Text>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search training materials"
        onChangeText={handleSearch}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category, index) => (
            <Chip
              key={index}
              selected={selectedCategories.includes(category.name)}
              onPress={() => toggleCategory(category.name)}
              style={styles.filterChip}
              selectedColor={theme.colors.primary}
            >
              {category.name}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredMaterials}
          renderItem={renderMaterialItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons name="file-search" size={64} color={theme.colors.backdrop} />
              <Text style={styles.emptyText}>No training materials found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  categoriesContainer: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  filterChip: {
    marginHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  materialCard: {
    marginBottom: 16,
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  materialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialType: {
    fontSize: 12,
    color: theme.colors.backdrop,
    marginRight: 8,
  },
  offlineChip: {
    backgroundColor: theme.colors.success + '20',
    height: 24,
  },
  materialTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  materialDescription: {
    color: theme.colors.backdrop,
    marginBottom: 8,
  },
  materialCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.primary + '20',
  },
  materialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  materialDate: {
    fontSize: 12,
    color: theme.colors.backdrop,
  },
  downloadButton: {
    height: 36,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    color: theme.colors.backdrop,
    textAlign: 'center',
  },
});