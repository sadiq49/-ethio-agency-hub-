import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Card, Title, List, Button, ProgressBar, Chip, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles';

interface Training {
  id: string;
  name: string;
  type: 'Language' | 'Professional' | 'Safety' | 'Cultural';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  progress: number;
  schedule?: {
    date: string;
    time: string;
    duration: string;
  };
  instructor?: string;
  location?: string;
  description: string;
}

const trainings: Training[] = [
  {
    id: 'TR001',
    name: 'Basic Arabic Language',
    type: 'Language',
    status: 'In Progress',
    progress: 60,
    schedule: {
      date: '2024-03-20',
      time: '10:00 AM',
      duration: '2 hours'
    },
    instructor: 'Ahmed Mohammed',
    location: 'Main Training Center',
    description: 'Essential Arabic language skills for daily communication'
  },
  {
    id: 'TR002',
    name: 'Housekeeping Skills',
    type: 'Professional',
    status: 'Scheduled',
    progress: 0,
    schedule: {
      date: '2024-03-22',
      time: '09:00 AM',
      duration: '3 hours'
    },
    instructor: 'Sarah Hassan',
    location: 'Skills Development Center',
    description: 'Professional housekeeping and cleaning techniques'
  },
  {
    id: 'TR003',
    name: 'Cultural Awareness',
    type: 'Cultural',
    status: 'Completed',
    progress: 100,
    instructor: 'Fatima Ali',
    description: 'Understanding Middle Eastern culture and customs'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'green';
    case 'In Progress':
      return 'blue';
    case 'Scheduled':
      return 'orange';
    case 'Cancelled':
      return 'red';
    default:
      return 'gray';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'Language':
      return 'translate';
    case 'Professional':
      return 'briefcase';
    case 'Safety':
      return 'shield-check';
    case 'Cultural':
      return 'account-group';
    default:
      return 'book-open';
  }
};

export default function TrainingScreen() {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const filteredTrainings = selectedType
    ? trainings.filter(training => training.type === selectedType)
    : trainings;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Training Progress</Title>
            <View style={styles.progressOverview}>
              <Text style={styles.progressText}>Overall Progress</Text>
              <ProgressBar
                progress={0.65}
                style={styles.overallProgress}
                color="blue"
              />
              <Text style={styles.progressPercentage}>65% Complete</Text>
            </View>
          </Card.Content>
        </Card>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['All', 'Language', 'Professional', 'Safety', 'Cultural'].map((type) => (
              <Chip
                key={type}
                selected={selectedType === type || (type === 'All' && !selectedType)}
                onPress={() => setSelectedType(type === 'All' ? null : type)}
                style={styles.filterChip}
              >
                {type}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {filteredTrainings.map((training) => (
          <Card key={training.id} style={styles.trainingCard}>
            <Card.Content>
              <View style={styles.trainingHeader}>
                <View>
                  <Title>{training.name}</Title>
                  <Chip
                    mode="outlined"
                    style={[
                      styles.statusChip,
                      { borderColor: getStatusColor(training.status) }
                    ]}
                    textStyle={{ color: getStatusColor(training.status) }}
                  >
                    {training.status}
                  </Chip>
                </View>
                <List.Icon icon={getTypeIcon(training.type)} />
              </View>

              <View style={styles.trainingProgress}>
                <Text style={styles.progressText}>Progress</Text>
                <ProgressBar
                  progress={training.progress / 100}
                  style={styles.progressBar}
                  color={getStatusColor(training.status)}
                />
                <Text style={styles.progressPercentage}>
                  {training.progress}% Complete
                </Text>
              </View>

              {training.schedule && (
                <List.Item
                  title="Schedule"
                  description={`${training.schedule.date} at ${training.schedule.time} (${training.schedule.duration})`}
                  left={props => <List.Icon {...props} icon="calendar" />}
                />
              )}

              {training.instructor && (
                <List.Item
                  title="Instructor"
                  description={training.instructor}
                  left={props => <List.Icon {...props} icon="account" />}
                />
              )}

              {training.location && (
                <List.Item
                  title="Location"
                  description={training.location}
                  left={props => <List.Icon {...props} icon="map-marker" />}
                />
              )}

              <Text style={styles.description}>{training.description}</Text>

              <View style={styles.actionButtons}>
                {training.status === 'Scheduled' && (
                  <Button mode="contained" onPress={() => {}}>
                    Start Training
                  </Button>
                )}
                {training.status === 'In Progress' && (
                  <Button mode="contained" onPress={() => {}}>
                    Continue Training
                  </Button>
                )}
                {training.status === 'Completed' && (
                  <Button mode="outlined" onPress={() => {}}>
                    View Certificate
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}