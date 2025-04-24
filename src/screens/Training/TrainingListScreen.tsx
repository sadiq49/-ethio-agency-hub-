import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, Title, Paragraph, Button, ProgressBar, Chip, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';

export default function TrainingListScreen({ navigation }) {
  const [trainings, setTrainings] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchTrainings();
  }, []);

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      // Fetch all training modules
      const { data: trainingData, error: trainingError } = await supabase
        .from('training_modules')
        .select('*')
        .order('required', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (trainingError) throw trainingError;
      
      // Fetch user progress for all modules
      const { data: progressData, error: progressError } = await supabase
        .from('training_progress')
        .select('*')
        .eq('worker_id', user.id);
      
      if (progressError) throw progressError;
      
      // Convert progress data to a map for easier access
      const progressMap = {};
      if (progressData) {
        progressData.forEach(item => {
          progressMap[item.training_id] = item;
        });
      }
      
      setTrainings(trainingData || []);
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error fetching trainings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTrainings();
  };

  const handleTrainingPress = (training) => {
    const progress = userProgress[training.id]?.progress_percentage || 0;
    
    navigation.navigate('TrainingDetail', {
      trainingId: training.id,
      title: training.title,
      currentProgress: progress
    });
  };

  const renderTrainingItem = ({ item }) => {
    const progress = userProgress[item.id]?.progress_percentage || 0;
    const status = userProgress[item.id]?.status || 'not_started';
    
    return (
      <Card 
        style={styles.trainingCard} 
        onPress={() => handleTrainingPress(item)}
      >
        <Card.Content>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons 
              name={item.icon || 'school'} 
              size={24} 
              color={theme.colors.primary} 
            />
            {item.required && (
              <Chip style={styles.requiredChip}>Required</Chip>
            )}
          </View>
          
          <Title style={styles.trainingTitle}>{item.title}</Title>
          <Paragraph style={styles.trainingDescription}>
            {item.description}
          </Paragraph>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressLabelContainer}>
              <Text style={styles.progressLabel}>
                {status === 'completed' ? 'Completed' : `${progress}% Complete`}
              </Text>
              <Text style={styles.duration}>
                {item.estimated_duration} min
              </Text>
            </View>
            <ProgressBar 
              progress={progress / 100} 
              color={status === 'completed' ? theme.colors.success : theme.colors.primary}
              style={styles.progressBar}
            />
          </View>
          
          <View style={styles.tagsContainer}>
            {item.tags && item.tags.map((tag, index) => (
              <Chip key={index} style={styles.tag}>
                {tag}
              </Chip>
            ))}
          </View>
          
          <Button 
            mode={status === 'completed' ? 'outlined' : 'contained'} 
            onPress={() => handleTrainingPress(item)}
            style={styles.actionButton}
          >
            {status === 'not_started' ? 'Start Training' : 
             status === 'in_progress' ? 'Continue Training' : 
             'Review Training'}
          </Button>
        </Card.Content>
      </Card>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={trainings}
        renderItem={renderTrainingItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Title style={styles.headerTitle}>Training Modules</Title>
            <Paragraph style={styles.headerSubtitle}>
              Complete required trainings to maintain compliance
            </Paragraph>
          </View>
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Title style={styles.emptyTitle}>No Training Modules</Title>
              <Paragraph style={styles.emptyText}>
                There are no training modules available at this time.
              </Paragraph>
            </Card.Content>
          </Card>
        }
      />
    </View>
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
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
  },
  headerSubtitle: {
    color: theme.colors.backdrop,
  },
  trainingCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  requiredChip: {
    backgroundColor: theme.colors.error + '20',
  },
  trainingTitle: {
    fontSize: 18,
    marginBottom: 4,
  },
  trainingDescription: {
    marginBottom: 12,
    color: theme.colors.backdrop,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 14,
  },
  duration: {
    fontSize: 14,
    color: theme.colors.backdrop,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.primary + '20',
  },
  actionButton: {
    marginTop: 4,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.backdrop,
  },
});