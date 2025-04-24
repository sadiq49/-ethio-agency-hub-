import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Card, Chip, HelperText, Divider, ActivityIndicator, Menu, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';

type TrainingFormData = {
  title: string;
  type: string;
  location: string;
  start_date: Date;
  end_date: Date;
  trainer_name: string;
  description: string;
};

export default function TrainingFormScreen({ route, navigation }) {
  const { trainingId } = route.params || {};
  const isEditing = !!trainingId;
  
  const [formData, setFormData] = useState<TrainingFormData>({
    title: '',
    type: 'Language',
    location: '',
    start_date: new Date(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    trainer_name: '',
    description: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof TrainingFormData, string>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [typeMenuVisible, setTypeMenuVisible] = useState(false);
  
  const trainingTypes = ['Language', 'Professional', 'Orientation', 'Cultural', 'Technical'];
  
  useEffect(() => {
    if (isEditing) {
      fetchTrainingData();
    }
  }, [trainingId]);
  
  const fetchTrainingData = async () => {
    try {
      setIsLoading(true);
      
      // This would be replaced with your actual Supabase query
      // For now, we'll simulate a delay and return mock data
      setTimeout(() => {
        const mockTraining = {
          id: trainingId,
          title: 'Arabic Language Training',
          type: 'Language',
          location: 'Addis Ababa Training Center',
          start_date: '2024-03-15',
          end_date: '2024-04-15',
          trainer_name: 'Ahmed Mohammed',
          description: 'This comprehensive Arabic language course is designed for workers preparing for deployment to Arabic-speaking countries.'
        };
        
        setFormData({
          ...formData,
          title: mockTraining.title,
          type: mockTraining.type,
          location: mockTraining.location,
          start_date: new Date(mockTraining.start_date),
          end_date: new Date(mockTraining.end_date),
          trainer_name: mockTraining.trainer_name,
          description: mockTraining.description,
        });
        
        setIsLoading(false);
      }, 1000);
      
      // In a real implementation, you would use:
      /*
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .eq('id', trainingId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setFormData({
          ...formData,
          title: data.title,
          type: data.type,
          location: data.location,
          start_date: new Date(data.start_date),
          end_date: new Date(data.end_date),
          trainer_name: data.trainer_name,
          description: data.description,
        });
      }
      */
      
    } catch (error) {
      console.error('Error fetching training data:', error);
      Alert.alert('Error', 'Failed to load training data');
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (field: keyof TrainingFormData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: undefined,
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Partial<Record<keyof TrainingFormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.trainer_name.trim()) {
      newErrors.trainer_name = 'Trainer name is required';
    }
    
    if (formData.end_date < formData.start_date) {
      newErrors.end_date = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // This would be replaced with your actual Supabase query
      // For now, we'll simulate a delay
      setTimeout(() => {
        setIsSaving(false);
        Alert.alert(
          isEditing ? 'Training Updated' : 'Training Created',
          isEditing ? 'The training has been updated successfully.' : 'The training has been created successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }, 1500);
      
      // In a real implementation, you would use:
      /*
      const trainingData = {
        title: formData.title,
        type: formData.type,
        location: formData.location,
        start_date: formData.start_date.toISOString(),
        end_date: formData.end_date.toISOString(),
        trainer_name: formData.trainer_name,
        description: formData.description,
        status: isEditing ? undefined : 'scheduled', // Only set status for new trainings
      };
      
      let result;
      
      if (isEditing) {
        result = await supabase
          .from('trainings')
          .update(trainingData)
          .eq('id', trainingId);
      } else {
        result = await supabase
          .from('trainings')
          .insert(trainingData);
      }
      
      if (result.error) throw result.error;
      
      setIsSaving(false);
      Alert.alert(
        isEditing ? 'Training Updated' : 'Training Created',
        isEditing ? 'The training has been updated successfully.' : 'The training has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      */
      
    } catch (error) {
      console.error('Error saving training:', error);
      Alert.alert('Error', `Failed to ${isEditing ? 'update' : 'create'} training`);
      setIsSaving(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading training data...</Text>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.formTitle}>
              {isEditing ? 'Edit Training' : 'Create New Training'}
            </Text>
            
            <View style={styles.formField}>
              <TextInput
                label="Training Title"
                value={formData.title}
                onChangeText={(value) => handleInputChange('title', value)}
                mode="outlined"
                error={!!errors.title}
              />
              {errors.title && <HelperText type="error">{errors.title}</HelperText>}
            </View>
            
            <View style={styles.formField}>
              <Text style={styles.inputLabel}>Training Type</Text>
              <View style={styles.chipContainer}>
                {trainingTypes.map((type) => (
                  <Chip
                    key={type}
                    selected={formData.type === type}
                    onPress={() => handleInputChange('type', type)}
                    style={styles.typeChip}
                  >
                    {type}
                  </Chip>
                ))}
              </View>
            </View>
            
            <View style={styles.formField}>
              <TextInput
                label="Location"
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                mode="outlined"
                error={!!errors.location}
              />
              {errors.location && <HelperText type="error">{errors.location}</HelperText>}
            </View>
            
            <View style={styles.dateRow}>
              <View style={[styles.formField, styles.dateField]}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowStartDatePicker(true)}
                  icon="calendar"
                  style={styles.dateButton}
                >
                  {formatDate(formData.start_date)}
                </Button>
                {showStartDatePicker && (
                  <DateTimePicker
                    value={formData.start_date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowStartDatePicker(false);
                      if (selectedDate) {
                        handleInputChange('start_date', selectedDate);
                      }
                    }}
                  />
                )}
              </View>
              
              <View style={[styles.formField, styles.dateField]}>
                <Text style={styles.inputLabel}>End Date</Text>
                <Button
                  mode="outlined"
                  onPress={() => setShowEndDatePicker(true)}
                  icon="calendar"
                  style={styles.dateButton}
                  error={!!errors.end_date}
                >
                  {formatDate(formData.end_date)}
                </Button>
                {showEndDatePicker && (
                  <DateTimePicker
                    value={formData.end_date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      setShowEndDatePicker(false);
                      if (selectedDate) {
                        handleInputChange('end_date', selectedDate);
                      }
                    }}
                  />
                )}
                {errors.end_date && <HelperText type="error">{errors.end_date}</HelperText>}
              </View>
            </View>
            
            <View style={styles.formField}>
              <TextInput
                label="Trainer Name"
                value={formData.trainer_name}
                onChangeText={(value) => handleInputChange('trainer_name', value)}
                mode="outlined"
                error={!!errors.trainer_name}
              />
              {errors.trainer_name && <HelperText type="error">{errors.trainer_name}</HelperText>}
            </View>
            
            <View style={styles.formField}>
              <TextInput
                label="Description"
                value={formData.description}
                onChangeText={(value) => handleInputChange('description', value)}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.textArea}
              />
            </View>
          </Card.Content>
        </Card>
        
        <View style={styles.actionContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.actionButton}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.actionButton}
            loading={isSaving}
            disabled={isSaving}
          >
            {isEditing ? 'Update Training' : 'Create Training'}
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6b7280',
  },
  card: {
    margin: 16,
    borderColor: '#e5e7eb',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateField: {
    flex: 1,
    marginRight: 8,
  },
  dateButton: {
    justifyContent: 'flex-start',
  },
  textArea: {
    minHeight: 100,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 0,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});