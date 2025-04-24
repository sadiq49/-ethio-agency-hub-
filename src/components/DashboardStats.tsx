import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

export const DashboardStats = ({ stats, onCardPress }) => {
  return (
    <View style={styles.statsContainer}>
      <Card 
        style={[styles.statsCard, { backgroundColor: theme.colors.primary + '15' }]}
        onPress={() => onCardPress('pending')}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="clock-outline" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Title style={styles.statValue}>{stats.pendingDocuments || 0}</Title>
          <Paragraph style={styles.statLabel}>Pending</Paragraph>
        </Card.Content>
      </Card>
      
      <Card 
        style={[styles.statsCard, { backgroundColor: theme.colors.success + '15' }]}
        onPress={() => onCardPress('approved')}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={24} 
            color={theme.colors.success} 
          />
          <Title style={styles.statValue}>{stats.approvedDocuments || 0}</Title>
          <Paragraph style={styles.statLabel}>Approved</Paragraph>
        </Card.Content>
      </Card>
      
      <Card 
        style={[styles.statsCard, { backgroundColor: theme.colors.error + '15' }]}
        onPress={() => onCardPress('rejected')}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="close-circle" 
            size={24} 
            color={theme.colors.error} 
          />
          <Title style={styles.statValue}>{stats.rejectedDocuments || 0}</Title>
          <Paragraph style={styles.statLabel}>Rejected</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    width: '31%',
  },
  cardContent: {
    alignItems: 'center',
    padding: 8,
  },
  statValue: {
    fontSize: 24,
    marginVertical: 4,
  },
  statLabel: {
    textAlign: 'center',
    marginTop: 0,
  },
});

## 3. Progress Tracking System

### Implementation Steps:

1. **Dashboard Statistics**
   - Create dashboard components for document status
   - Implement training progress visualization
   - Add overall compliance status indicators

2. **Timeline View**
   - Create activity timeline component
   - Track document submissions, status changes, and training completions
   - Implement filtering and sorting options

3. **Persistence**
   - Store progress data in Supabase
   - Implement offline caching for progress data
   - Add sync functionality for offline changes

### Example Code for Dashboard Component:
```typescript
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

export const DashboardStats = ({ stats, onCardPress }) => {
  return (
    <View style={styles.statsContainer}>
      <Card 
        style={[styles.statsCard, { backgroundColor: theme.colors.primary + '15' }]}
        onPress={() => onCardPress('pending')}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="clock-outline" 
            size={24} 
            color={theme.colors.primary} 
          />
          <Title style={styles.statValue}>{stats.pendingDocuments || 0}</Title>
          <Paragraph style={styles.statLabel}>Pending</Paragraph>
        </Card.Content>
      </Card>
      
      <Card 
        style={[styles.statsCard, { backgroundColor: theme.colors.success + '15' }]}
        onPress={() => onCardPress('approved')}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={24} 
            color={theme.colors.success} 
          />
          <Title style={styles.statValue}>{stats.approvedDocuments || 0}</Title>
          <Paragraph style={styles.statLabel}>Approved</Paragraph>
        </Card.Content>
      </Card>
      
      <Card 
        style={[styles.statsCard, { backgroundColor: theme.colors.error + '15' }]}
        onPress={() => onCardPress('rejected')}
      >
        <Card.Content style={styles.cardContent}>
          <MaterialCommunityIcons 
            name="close-circle" 
            size={24} 
            color={theme.colors.error} 
          />
          <Title style={styles.statValue}>{stats.rejectedDocuments || 0}</Title>
          <Paragraph style={styles.statLabel}>Rejected</Paragraph>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsCard: {
    width: '31%',
  },
  cardContent: {
    alignItems: 'center',
    padding: 8,
  },
  statValue: {
    fontSize: 24,
    marginVertical: 4,
  },
  statLabel: {
    textAlign: 'center',
    marginTop: 0,
  },
});