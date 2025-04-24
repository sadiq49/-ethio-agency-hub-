"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useApiQuery } from "@/hooks/use-api-query";

interface WorkerStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  blacklisted: number;
  documents_per_worker: number;
  avg_processing_time: number;
}

interface WorkersByNationality {
  nationality: string;
  count: number;
}

interface DocumentsByType {
  document_type: string;
  count: number;
}

export function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const { data: stats, isLoading: statsLoading } = useApiQuery<WorkerStats>(
    'worker_stats',
    (query) => query.select('*').single(),
    { duration: 15 * 60 * 1000 } // 15 minutes cache
  );

  const { data: workersByNationality, isLoading: nationalityLoading } = useApiQuery<WorkersByNationality[]>(
    'workers_by_nationality',
    (query) => query.select('*').order('count', { ascending: false }),
    { duration: 15 * 60 * 1000 } // 15 minutes cache
  );

  const { data: documentsByType, isLoading: documentsLoading } = useApiQuery<DocumentsByType[]>(
    'documents_by_type',
    (query) => query.select('*').order('count', { ascending: false }),
    { duration: 15 * 60 * 1000 } // 15 minutes cache
  );

  const isLoading = statsLoading || nationalityLoading || documentsLoading;

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Prepare data for status distribution pie chart
  const statusData = stats ? [
    { name: "Active", value: stats.active, color: "#10b981" },
    { name: "Inactive", value: stats.inactive, color: "#6b7280" },
    { name: "Pending", value: stats.pending, color: "#f59e0b" },
    { name: "Blacklisted", value: stats.blacklisted, color: "#ef4444" },
  ] : [];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nationality">Nationality Distribution</TabsTrigger>
          <TabsTrigger value="documents">Document Types</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Workers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <div className="text-2xl font-bold">
                    {stats?.total || 0}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Workers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <div className="text-2xl font-bold text-green-600">
                    {stats?.active || 0}
                    <span className="text-xs text-muted-foreground ml-2">
                      ({stats ? ((stats.active / stats.total) * 100).toFixed(1) : 0}%)
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Documents Per Worker
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <div className="text-2xl font-bold">
                    {stats?.documents_per_worker.toFixed(1) || 0}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Avg. Processing Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-[100px]" />
                ) : (
                  <div className="text-2xl font-bold">
                    {stats?.avg_processing_time.toFixed(1) || 0}
                    <span className="text-xs text-muted-foreground ml-2">hours</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Worker Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value} workers`, 'Count']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nationality" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Workers by Nationality</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={workersByNationality}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nationality" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Workers" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents by Type</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={documentsByType?.map(item => ({
                      ...item,
                      document_type: item.document_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                    }))}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="document_type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Documents" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}