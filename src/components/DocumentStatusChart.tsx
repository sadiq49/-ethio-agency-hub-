import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Title } from 'react-native-paper';
import { PieChart } from 'react-native-chart-kit';
import { theme } from '../theme';

export const DocumentStatusChart = ({ data }) => {
  const chartData = [
    {
      name: 'Approved',
      count: data.approvedDocuments || 0,
      color: theme.colors.success,
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Pending',
      count: data.pendingDocuments || 0,
      color: theme.colors.warning,
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Rejected',
      count: data.rejectedDocuments || 0,
      color: theme.colors.error,
      legendFontColor: '#7F7F7F',
    },
  ];

  // Filter out zero values
  const filteredData = chartData.filter(item => item.count > 0);
  
  // Calculate total for percentage
  const total = chartData.reduce((sum, item) => sum + item.count, 0);
  
  // Format data for pie chart
  const pieData = filteredData.map(item => ({
    name: item.name,
    population: item.count,
    color: item.color,
    legendFontColor: item.legendFontColor,
    legendFontSize: 12,
  }));

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Title style={styles.title}>Document Status Overview</Title>
        
        {total > 0 ? (
          <>
            <PieChart
              data={pieData}
              width={Dimensions.get('window').width - 64}
              height={180}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
            
            <View style={styles.legendContainer}>
              {chartData.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>
                    {item.name}: {item.count} ({total > 0 ? Math.round((item.count / total) * 100) : 0}%)
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : (
          <Text style={styles.emptyText}>No document data available</Text>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  legendContainer: {
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 40,
    fontStyle: 'italic',
    color: theme.colors.backdrop,
  },
});