import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { TextInput, Button, Title, HelperText, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWorkerRegistration } from '../../lib/hooks/useWorkerRegistration';
import { styles } from '../../styles';

export default function RegisterWorkerScreen({ navigation }: any) {
  const [fullName, setFullName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { registerWorker, loading, error } = useWorkerRegistration();

  const handleRegistration = async () => {
    try {
      await registerWorker({
        full_name: fullName,
        passport_number: passportNumber,
        destination,
        status: 'Pending'
      });

      setSnackbarMessage('Worker registered successfully');
      setSnackbarVisible(true);
      
      // Reset form
      setFullName('');
      setPassportNumber('');
      setDestination('');
      
      // Navigate back after success
      setTimeout(() => navigation.goBack(), 2000);
    } catch (err) {
      setSnackbarMessage('Failed to register worker');
      setSnackbarVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Title style={styles.title}>Register New Worker</Title>

        <View style={styles.formContainer}>
          <TextInput
            label="Full Name"
            value={fullName}
            onChangeText={setFullName}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Passport Number"
            value={passportNumber}
            onChangeText={setPassportNumber}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Destination Country"
            value={destination}
            onChangeText={setDestination}
            mode="outlined"
            style={styles.input}
          />

          {error && (
            <HelperText type="error">
              {error.message}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleRegistration}
            loading={loading}
            style={styles.button}
            disabled={!fullName || !passportNumber || !destination}
          >
            Register Worker
          </Button>
        </View>

        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
        >
          {snackbarMessage}
        </Snackbar>
      </ScrollView>
    </SafeAreaView>
  );
}