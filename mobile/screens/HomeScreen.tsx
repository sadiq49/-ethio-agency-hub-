import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Title, Paragraph, List } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from '../styles';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Welcome Back!</Title>
            <Paragraph>Your dashboard overview</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Recent Activities</Title>
            <List.Section>
              <List.Item
                title="Document Uploaded"
                description="Passport copy submitted"
                left={props => <List.Icon {...props} icon="file-upload" />}
              />
              <List.Item
                title="Status Update"
                description="Visa application in progress"
                left={props => <List.Icon {...props} icon="clock" />}
              />
              <List.Item
                title="Training Scheduled"
                description="Language training - Tomorrow 10:00 AM"
                left={props => <List.Icon {...props} icon="calendar" />}
              />
            </List.Section>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Title>Upcoming Tasks</Title>
            <List.Section>
              <List.Item
                title="Medical Checkup"
                description="Schedule your medical examination"
                left={props => <List.Icon {...props} icon="medical-bag" />}
              />
              <List.Item
                title="Document Submission"
                description="Submit remaining documents"
                left={props => <List.Icon {...props} icon="file-document" />}
              />
            </List.Section>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}