import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 4,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileName: {
    marginTop: 10,
  },
  logoutButton: {
    marginVertical: 16,
  },
  // Auth styles
  authContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  authTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  // Document upload styles
  uploadButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  documentPreview: {
    width: '100%',
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
  },
  progressBar: {
    marginTop: 8,
    height: 4,
    borderRadius: 2,
  },
  // Training styles
  progressOverview: {
    marginTop: 16,
  },
  progressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  overallProgress: {
    height: 8,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'right',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  trainingCard: {
    marginBottom: 16,
  },
  trainingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusChip: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  trainingProgress: {
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 16,
  },
  actionButtons: {
    marginTop: 16,
  },
  // Notification styles
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unreadBadge: {
    backgroundColor: '#ef4444',
  },
  notificationCard: {
    marginBottom: 8,
    elevation: 2,
  },
  unreadNotification: {
    backgroundColor: '#f0f9ff',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    marginRight: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#999',
  },
});