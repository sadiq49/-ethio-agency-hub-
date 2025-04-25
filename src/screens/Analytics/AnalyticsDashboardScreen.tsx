import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Title, ActivityIndicator } from 'react-native-paper';
import { DocumentStatusChart } from '../../components/DocumentStatusChart';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

export default function AnalyticsDashboardScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [documentStats, setDocumentStats] = useState({
    approvedDocuments: 0,
    pendingDocuments: 0,
    rejectedDocuments: 0
  });
  const [monthlyStats, setMonthlyStats] = useState({
    labels: [],
    approved: [],
    pending: [],
    rejected: []
  });
  const { user } = useAuth();
  
  useEffect(() => {
    fetchAnalyticsData();
  }, []);
  
  const fetchAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Fetch document statistics
      const { data: documents, error } = await supabase
        .from('documents')
        .select('id, status, created_at')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Calculate current status counts
      const stats = {
        approvedDocuments: documents.filter(doc => doc.status === 'approved').length,
        pendingDocuments: documents.filter(doc => doc.status === 'pending').length,
        rejectedDocuments: documents.filter(doc => doc.status === 'rejected').length
      };
      
      setDocumentStats(stats);
      
      // Calculate monthly statistics for the past 6 months
      const now = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 5);
      
      const months = [];
      const approvedCounts = [];
      const pendingCounts = [];
      const rejectedCounts = [];
      
      for (let i = 0; i < 6; i++) {
        const month = new Date(sixMonthsAgo);
        month.setMonth(sixMonthsAgo.getMonth() + i);
        
        const monthName = month.toLocaleString('default', { month: 'short' });
        months.push(monthName);
        
        const monthStart = new Date(month.getFullYear(), month.getMonth(), 1).toISOString();
        const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0).toISOString();
        
        const monthDocs = documents.filter(doc => 
          doc.created_at >= monthStart && doc.created_at <= monthEnd
        );
        
        approvedCounts.push(monthDocs.filter(doc => doc.status === 'approved').length);
        pendingCounts.push(monthDocs.filter(doc => doc.status === 'pending').length);
        rejectedCounts.push(monthDocs.filter(doc => doc.status === 'rejected').length);
      }
      
      setMonthlyStats({
        labels: months,
        approved: approvedCounts,
        pending: pendingCounts,
        rejected: rejectedCounts
      });
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Title style={styles.pageTitle}>Analytics Dashboard</Title>
      
      <DocumentStatusChart data={documentStats} />
      
      <Card style={styles.chartCard}>
        <Card.Content>
          <Title style={styles.chartTitle}>Monthly Document Trends</Title>
          <LineChart
            data={{
              labels: monthlyStats.labels,
              datasets: [
                {
                  data: monthlyStats.approved,
                  color: () => theme.colors.success,
                  strokeWidth: 2
                },
                {
                  data: monthlyStats.pending,
                  color: () => theme.colors.warning,
                  strokeWidth: 2
                },
                {
                  data: monthlyStats.rejected,
                  color: () => theme.colors.error,
                  strokeWidth: 2
                }
              ]
            }}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              }
            }}
            bezier
            style={styles.chart}
          />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.success }]} />
              <Text>Approved</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.warning }]} />
              <Text>Pending</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.error }]} />
              <Text>Rejected</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
      
      {/* Add more analytics components as needed */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  chartCard: {
    marginVertical: 16,
  },
  chartTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
});