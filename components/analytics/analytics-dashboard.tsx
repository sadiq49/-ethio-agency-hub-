"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/dashboard/date-range-picker';
import { Button } from '@/components/ui/button';
import { Download, Filter, RefreshCw } from 'lucide-react';
import WorkerDeploymentChart from './worker-deployment-chart';
import DocumentProcessingMetrics from './document-processing-metrics';
import AgentPerformanceTable from './agent-performance-table';
import TravelTrendsChart from './travel-trends-chart';
import FinancialMetrics from './financial-metrics';

/**
 * Advanced Analytics Dashboard
 * 
 * Provides comprehensive data visualization and analysis tools for monitoring
 * worker deployment, document processing, agent performance, and financial metrics.
 * 
 * Features:
 * - Interactive charts and graphs
 * - Date range filtering
 * - Data export capabilities
 * - Trend analysis and forecasting
 * 
 * @returns React component with advanced analytics UI
 */
export default function AnalyticsDashboard() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const refreshData = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const exportData = (format: 'csv' | 'excel' | 'pdf') => {
    // Implementation for exporting data in different formats
    console.log(`Exporting data in ${format} format`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Advanced Analytics</h1>
        <div className="flex items-center gap-2">
          <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportData('csv')}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData('excel')}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData('pdf')}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="workers" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="workers">Worker Deployment</TabsTrigger>
          <TabsTrigger value="documents">Document Processing</TabsTrigger>
          <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          <TabsTrigger value="travel">Travel Trends</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        
        <TabsContent value="workers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Worker Deployment Analytics</CardTitle>
              <CardDescription>
                Track worker deployment trends, status changes, and destination countries
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <WorkerDeploymentChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Processing Metrics</CardTitle>
              <CardDescription>
                Analyze document processing times, approval rates, and bottlenecks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <DocumentProcessingMetrics dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Analysis</CardTitle>
              <CardDescription>
                Compare agent performance, worker placement rates, and efficiency
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <AgentPerformanceTable dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="travel" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Travel Trends Analysis</CardTitle>
              <CardDescription>
                Visualize travel patterns, destination countries, and seasonal trends
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <TravelTrendsChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Metrics</CardTitle>
              <CardDescription>
                Track revenue, expenses, and profitability by agent and destination
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <FinancialMetrics dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Import these at the top of the file
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";