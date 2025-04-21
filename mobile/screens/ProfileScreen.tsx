import React from 'react';
import { ScrollView } from 'react-native';
import { Avatar, Card, Title, List, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content style={styles.profileHeader}>
            <Avatar.Image
              size={80}
              source={{ uri: 'https://ui-avatars.com/api/?name=John+Doe' }}
            />
            <Title style={styles.profileName}>John Doe</Title>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Personal Information</Title>
            <List.Section>
              <List.Item
                title="Email"
                description="john.doe@example.com"
                left={props => <List.Icon {...props} icon="email" />}
              />
              <List.Item
                title="Phone"
                description="+251 912 345 678"
                left={props => <List.Icon {...props} icon="phone" />}
              />
              <List.Item
                title="Passport"
                description="EP1234567"
                left={props => <List.Icon {...props} icon="passport" />}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Application Status</Title>
            <List.Section>
              <List.Item
                title="Current Stage"
                description="Document Verification"
                left={props => <List.Icon {...props} icon="progress-check" />}
              />
              <List.Item
                title="Next Step"
                description="Medical Examination"
                left={props => <List.Icon {...props} icon="step-forward" />}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={styles.logoutButton}
          onPress={() => {/* Handle logout */}}
        >
          Logout
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}