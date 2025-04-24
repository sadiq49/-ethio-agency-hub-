"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApiQuery } from '@/hooks/use-api-query';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { DatePickerWithRange } from '@/components/dashboard/date-range-picker';
import { Download, Filter, RefreshCw } from 'lucide-react';

/**
 * Advanced Analytics Component
 * 
 * Provides comprehensive data visualization and analysis tools for worker management,
 * document processing, and deployment metrics.
 * 
 * Features:
 * - Multiple visualization types (bar, line, pie charts)
 * - Time-based trend analysis
 * - Comparative metrics
 * - Data filtering and customization
 * - Export capabilities
 * 
 * @returns React component with advanced analytics UI
 */
export default function AdvancedAnalytics() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  
  const [metricType, setMetricType] = useState('workers');
  const [visualization, setVisualization] = useState('bar');
  const [groupBy, setGroupBy] = useState('status');
  
  // Fetch analytics data with caching
  const { 
    data: analyticsData, 
    isLoading, 
    error,
    refetch
  } = useApiQuery(
    'analytics_data',
    (query) => {
      // Format date range for query
      const fromDate = dateRange.from ? dateRange.from.toISOString() : undefined;
      const toDate = dateRange.to ? dateRange.to.toISOString() : undefined;
      
      // Build query based on metric type
      let q = query.from(metricType);
      
      // Apply date filters if applicable
      if (fromDate && toDate) {
        if (metricType === 'workers') {
          q = q.gte('created_at', fromDate).lte('created_at', toDate);
        } else if (metricType === 'documents') {
          q = q.gte('upload_date', fromDate).lte('upload_date', toDate);
        } else if (metricType === 'deployments') {
          q = q.gte('deployment_date', fromDate).lte('deployment_date', toDate);
        }
      }
      
      return q.select('*');
    },
    { 
      duration: 5 * 60 * 1000, // 5 minutes cache
      cacheKey: `analytics:${metricType}:${dateRange.from?.toISOString()}:${dateRange.to?.toISOString()}:${groupBy}`
    }
  );
  
  // Process data for visualization
  const processData = () => {
    if (!analyticsData) return [];
    
    // Group data by the selected grouping field
    const groupedData = analyticsData.reduce((acc, item) => {
      const key = item[groupBy] || 'unknown';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {});
    
    // Format for visualization
    return Object.entries(groupedData).map(([key, items]) => ({
      name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: items.length,
      items
    }));
  };
  
  const chartData = processData();
  
  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Export data as CSV
  const exportData = () => {
    if (!analyticsData) return;
    
    // Create CSV content
    const headers = Object.keys(analyticsData[0]).join(',');
    const rows = analyticsData.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    ).join('\n');
    
    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${metricType}_analytics_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Advanced Analytics</h1>
        <div className="flex items-center gap-2">
          <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={exportData} disabled={!analyticsData || isLoading}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Data Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Metric Type</label>
              <Select value={metricType} onValueChange={setMetricType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select metric type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workers">Workers</SelectItem>
                  <SelectItem value="documents">Documents</SelectItem>
                  <SelectItem value="deployments">Deployments</SelectItem>
                  <SelectItem value="visas">Visas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Group By</label>
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grouping" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="nationality">Nationality</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Visualization</label>
              <Select value={visualization} onValueChange={setVisualization}>
                <SelectTrigger>
                  <SelectValue placeholder="Select visualization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {metricType.charAt(0).toUpperCase() + metricType.slice(1)} by {groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}
            </CardTitle>
            <CardDescription>
              {dateRange.from && dateRange.to 
                ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                : 'All time data'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-80">
                <p>Loading analytics data...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-80 text-destructive">
                <p>Error loading data. Please try again.</p>
              </div>
            ) : chartData.length === 0 ? (
              <div className="flex items-center justify-center h-80 text-muted-foreground">
                <p>No data available for the selected filters.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                {visualization === 'bar' ? (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Count" />
                  </BarChart>
                ) : visualization === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" name="Count" />
                  </LineChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                )}
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      
      {analyticsData && analyticsData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Data Insights</CardTitle>
            <CardDescription>
              Key metrics and trends from your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Total Count</h3>
                <p className="text-2xl font-bold">{analyticsData.length}</p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Most Common</h3>
                <p className="text-2xl font-bold">
                  {chartData.sort((a, b) => b.value - a.value)[0]?.name || 'N/A'}
                </p>
              </div>
              
              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Growth</h3>
                <p className="text-2xl font-bold">
                  {dateRange.from && dateRange.to 
                    ? `${((analyticsData.length / (
                        (dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)
                      )) * 30).toFixed(1)}/month`
                    : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}