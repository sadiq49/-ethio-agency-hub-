import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RadioButton, Text } from 'react-native-paper';
import { theme } from '../../theme';

export default function DocumentFiltersScreen({ route, navigation }) {
  const { filters, updateFilter, resetFilters, onApply } = route.params;

  const handleApply = () => {
    if (onApply) {
      onApply();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title>Document Filters</Title>
      </View>
      
      <Divider />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Document Status</Text>
        <RadioButton.Group 
          onValueChange={value => updateFilter('status', value)} 
          value={filters.status}
        >
          <RadioButton.Item label="All Statuses" value="all" />
          <RadioButton.Item label="Pending Review" value="pending_review" />
          <RadioButton.Item label="Approved" value="approved" />
          <RadioButton.Item label="Rejected" value="rejected" />
          <RadioButton.Item label="Needs Correction" value="needs_correction" />
          <RadioButton.Item label="Expired" value="expired" />
        </RadioButton.Group>
      </View>
      
      <Divider />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Document Type</Text>
        <RadioButton.Group 
          onValueChange={value => updateFilter('documentType', value)} 
          value={filters.documentType}
        >
          <RadioButton.Item label="All Types" value="all" />
          <RadioButton.Item label="Passport" value="passport" />
          <RadioButton.Item label="Visa" value="visa" />
          <RadioButton.Item label="Work Permit" value="work_permit" />
          <RadioButton.Item label="Medical Certificate" value="medical_certificate" />
          <RadioButton.Item label="Contract" value="contract" />
        </RadioButton.Group>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button 
          mode="outlined" 
          onPress={resetFilters}
          style={styles.button}
        >
          Reset Filters
        </Button>
        
        <Button 
          mode="contained" 
          onPress={handleApply}
          style={styles.button}
        >
          Apply Filters
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});