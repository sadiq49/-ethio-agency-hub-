import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { Video } from 'expo-av';
import PDFReader from 'rn-pdf-reader-js';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

export default function TrainingContentScreen({ route, navigation }) {
  const { trainingId, moduleId } = route.params;
  const [content, setContent] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const video = React.useRef(null);

  useEffect(() => {
    fetchContent();
  }, [trainingId, moduleId]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      // Fetch training content
      const { data, error } = await supabase
        .from('training_content')
        .select('*')
        .eq('training_id', trainingId)
        .eq('module_id', moduleId)
        .single();
      
      if (error) throw error;
      setContent(data);
      
      // Fetch user progress
      const { data: progressData, error: progressError } = await supabase
        .from('training_progress')
        .select('progress_percentage')
        .eq('worker_id', user.id)
        .eq('training_id', trainingId)
        .eq('module_id', moduleId)
        .single();
      
      if (!progressError && progressData) {
        setProgress(progressData.progress_percentage);
      }
    } catch (error) {
      console.error('Error fetching training content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (newProgress) => {
    try {
      const { error } = await supabase
        .from('training_progress')
        .upsert({
          worker_id: user.id,
          training_id: trainingId,
          module_id: moduleId,
          progress_percentage: newProgress,
          last_accessed: new Date().toISOString()
        });
      
      if (error) throw error;
      setProgress(newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleContentComplete = async () => {
    await updateProgress(100);
    navigation.goBack();
  };

  const renderContentByType = () => {
    if (!content) return null;
    
    switch (content.content_type) {
      case 'video':
        return (
          <View style={styles.videoContainer}>
            <Video
              ref={video}
              source={{ uri: content.content_url }}
              useNativeControls
              resizeMode="contain"
              isLooping={false}
              onPlaybackStatusUpdate={status => {
                if (status.didJustFinish) {
                  updateProgress(100);
                } else if (status.positionMillis && status.durationMillis) {
                  const newProgress = Math.round((status.positionMillis / status.durationMillis) * 100);
                  if (newProgress > progress && newProgress % 10 === 0) {
                    updateProgress(newProgress);
                  }
                }
              }}
              style={styles.video}
            />
          </View>
        );
        
      case 'pdf':
        return (
          <View style={styles.pdfContainer}>
            <PDFReader
              source={{ uri: content.content_url }}
              onLoadComplete={(numberOfPages) => {
                console.log(`PDF loaded with ${numberOfPages} pages`);
              }}
              onPageChanged={(page, numberOfPages) => {
                const newProgress = Math.round((page / numberOfPages) * 100);
                if (newProgress > progress) {
                  updateProgress(newProgress);
                }
              }}
              style={styles.pdf}
            />
          </View>
        );
        
      case 'html':
        return (
          <WebView
            source={{ uri: content.content_url }}
            style={styles.webview}
            onLoadProgress={({ nativeEvent }) => {
              if (nativeEvent.progress > 0.9 && progress < 100) {
                updateProgress(100);
              }
            }}
          />
        );
        
      case 'text':
      default:
        return (
          <ScrollView style={styles.textContainer}>
            <Title style={styles.contentTitle}>{content.title}</Title>
            <Paragraph style={styles.contentText}>{content.content_text}</Paragraph>
            
            <Button 
              mode="contained" 
              onPress={handleContentComplete}
              style={styles.completeButton}
            >
              Mark as Complete
            </Button>
          </ScrollView>
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

  return (
    <View style={styles.container}>
      {renderContentByType()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: '100%',
    height: 300,
  },
  pdfContainer: {
    flex: 1,
  },
  pdf: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    padding: 16,
  },
  contentTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  completeButton: {
    marginTop: 24,
    marginBottom: 40,
  },
});