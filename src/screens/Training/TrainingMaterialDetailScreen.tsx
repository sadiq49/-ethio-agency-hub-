import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { getOfflineFilePath } from '../../services/OfflineManager';

export default function TrainingMaterialDetailScreen({ route, navigation }) {
  const { materialId } = route.params;
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const { user } = useAuth();
  const videoRef = React.useRef(null);
  
  useEffect(() => {
    fetchMaterialDetails();
  }, [materialId]);
  
  const fetchMaterialDetails = async () => {
    setIsLoading(true);
    try {
      // Check if material is available offline
      const offlinePath = await getOfflineFilePath(`training_materials/${materialId}`);
      const offlineExists = offlinePath ? await FileSystem.getInfoAsync(offlinePath) : { exists: false };
      setIsOffline(offlineExists.exists);
      
      // Fetch material details
      const { data, error } = await supabase
        .from('training_materials')
        .select(`
          *,
          material_categories(name)
        `)
        .eq('id', materialId)
        .single();
      
      if (error) throw error;
      setMaterial(data);
      
      // Get file URL (either from offline storage or Supabase)
      if (offlineExists.exists) {
        setFileUrl(`file://${offlinePath}`);
      } else if (data.file_url) {
        // For online files, get a signed URL if needed
        if (data.file_url.includes('supabase')) {
          const { data: signedUrl, error: urlError } = await supabase
            .storage
            .from('training_materials')
            .createSignedUrl(data.file_path, 3600);
          
          if (!urlError) {
            setFileUrl(signedUrl);
          } else {
            setFileUrl(data.file_url);
          }
        } else {
          setFileUrl(data.file_url);
        }
      }
      
      // Log view history
      await supabase
        .from('material_view_history')
        .insert({
          material_id: materialId,
          worker_id: user.id,
          viewed_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error fetching material details:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (!fileUrl) return;
    
    try {
      // For offline files, share the local file
      if (isOffline && Platform.OS !== 'web') {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUrl.replace('file://', ''));
        }
      } else {
        // For online files, share the URL
        // Use native share dialog if available
        if (navigator.share) {
          await navigator.share({
            title: material.title,
            text: material.description,
            url: fileUrl,
          });
        }
      }
    } catch (error) {
      console.error('Error sharing material:', error);
    }
  };
  
  const renderFileViewer = () => {
    if (!fileUrl) return null;
    
    const fileType = material.file_type || 'unknown';
    
    switch (fileType) {
      case 'pdf':
        return (
          <WebView
            source={{ uri: fileUrl }}
            style={styles.webView}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
          />
        );
      case 'video':
        return (
          <Video
            ref={videoRef}
            source={{ uri: fileUrl }}
            useNativeControls
            resizeMode="contain"
            isLooping={false}
            onPlaybackStatusUpdate={status => setVideoStatus(status)}
            style={styles.video}
          />
        );
      case 'image':
        return (
          <Image
            source={{ uri: fileUrl }}
            style={styles.image}
            resizeMode="contain"
          />
        );
      case 'document':
      case 'html':
        return (
          <WebView
            source={{ uri: fileUrl }}
            style={styles.webView}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
          />
        );
      default:
        return (
          <View style={styles.unsupportedContainer}>
            <MaterialCommunityIcons name="file-question" size={64} color={theme.colors.backdrop} />
            <Text style={styles.unsupportedText}>
              This file type cannot be previewed directly.
            </Text>
            <Button 
              mode="contained" 
              onPress={handleShare}
              style={styles.downloadButton}
            >
              Open in External App
            </Button>
          </View>
        );
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (!material) {
    return (
      <View style={styles.errorContainer}>
        <Text>Material not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.headerRow}>
              <MaterialCommunityIcons 
                name={
                  material.file_type === 'pdf' ? 'file-pdf-box' :
                  material.file_type === 'video' ? 'file-video' :
                  material.file_type === 'image' ? 'file-image' :
                  material.file_type === 'document' ? 'file-document' :
                  'file'
                } 
                size={24} 
                color={theme.colors.primary} 
              />
              <Text style={styles.fileType}>{material.file_type?.toUpperCase() || 'DOCUMENT'}</Text>
              {isOffline && (
                <Chip icon="check" style={styles.offlineChip}>Offline</Chip>
              )}
            </View>
            
            <Title style={styles.title}>{material.title}</Title>
            <Paragraph style={styles.description}>{material.description}</Paragraph>
            
            <View style={styles.metaContainer}>
              <Text style={styles.metaLabel}>Added:</Text>
              <Text style={styles.metaValue}>
                {new Date(material.created_at).toLocaleDateString()}
              </Text>
              
              {material.author && (
                <>
                  <Text style={styles.metaLabel}>Author:</Text>
                  <Text style={styles.metaValue}>{material.author}</Text>
                </>
              )}
              
              {material.material_categories && material.material_categories.length > 0 && (
                <>
                  <Text style={styles.metaLabel}>Categories:</Text>
                  <View style={styles.categoriesContainer}>
                    {material.material_categories.map((category, index) => (
                      <Chip key={index} style={styles.categoryChip}>
                        {category.name}
                      </Chip>
                    ))}
                  </View>
                </>
              )}
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.actionsContainer}>
              <Button 
                mode="contained" 
                icon="share-variant" 
                onPress={handleShare}
                style={styles.actionButton}
              >
                Share
              </Button>
              
              {!isOffline && (
                <Button 
                  mode="outlined" 
                  icon="download" 
                  onPress={() => {/* Download logic */}}
                  style={styles.actionButton}
                >
                  Save Offline
                </Button>
              )}
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.fileViewerContainer}>
          {renderFileViewer()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  infoCard: {
    margin: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fileType: {
    fontSize: 12,
    color: theme.colors.backdrop,
    marginLeft: 8,
  },
  offlineChip: {
    marginLeft: 'auto',
    backgroundColor: theme.colors.success + '20',
    height: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  metaContainer: {
    marginBottom: 16,
  },
  metaLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    marginBottom: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.primary + '20',
  },
  divider: {
    marginVertical: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  fileViewerContainer: {
    margin: 16,
    height: Dimensions.get('window').height * 0.6,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  webView: {
    flex: 1,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unsupportedText: {
    textAlign: 'center',
    marginVertical: 16,
    color: theme.colors.backdrop,
  },
  downloadButton: {
    marginTop: 16,
  },
});