import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, Button, ActivityIndicator } from 'react-native-paper';
import { supabase } from '../../../lib/database/supabase';
import { useRoute, useNavigation } from '@react-navigation/native';

type TrainingMaterial = {
  id: string;
  title: string;
  description: string;
  content: string;
  file_url?: string;
  created_at: string;
  // Add other fields as needed
};

export default function TrainingMaterialDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { materialId } = route.params as { materialId: string };
  
  const [material, setMaterial] = useState<TrainingMaterial | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchMaterialDetails();
  }, [materialId]);
  
  const fetchMaterialDetails = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('training_materials')
        .select('*')
        .eq('id', materialId)
        .single();
      
      if (error) throw error;
      
      setMaterial(data);
    } catch (error) {
      console.error('Error fetching training material:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }
  
  if (!material) {
    return (
      <View style={styles.errorContainer}>
        <Text>Training material not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{material.title}</Title>
          <Paragraph>{material.description}</Paragraph>
          
          <View style={styles.contentContainer}>
            <Text>{material.content}</Text>
          </View>
          
          {material.file_url && (
            <Button 
              mode="contained" 
              onPress={() => {/* Implement file opening logic */}}
              style={styles.button}
            >
              Open Material
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  contentContainer: {
    marginVertical: 16,
  },
  button: {
    marginTop: 16,
  },
});