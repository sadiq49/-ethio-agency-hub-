"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type WorkerStatusCount = {
  status: string;
  count: number;
};

type AgentWorkerCount = {
  agent_name: string;
  count: number;
};

type MonthlyRegistration = {
  month: string;
  count: number;
};

export default function WorkerStatusReportPage() {
  const [statusCounts, setStatusCounts] = useState<WorkerStatusCount[]>([]);
  const [agentCounts, setAgentCounts] = useState<AgentWorkerCount[]>([]);
  const [monthlyRegistrations, setMonthlyRegistrations] = useState<MonthlyRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  const supabase = createClientComponentClient();
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#FF6B6B'];
  
  useEffect(() => {
    async function fetchReportData() {
      setIsLoading(true);
      
      try {
        // Fetch worker status counts
        const { data: statusData, error: statusError } = await supabase
          .from('workers')
          .select('status, count(*)')
          .group('status');
          
        if (statusError) throw statusError;
        
        // Fetch agent worker counts
        const { data: agentData, error: agentError } = await supabase
          .from('workers')
          .select('profiles!inner(full_name), count(*)')
          .group('profiles.full_name');
          
        if (agentError) throw agentError;
        
        // Fetch monthly registrations for the past 6 months
        const { data: monthlyData, error: monthlyError } = await supabase
          .rpc('get_monthly_registrations');
          
        if (monthlyError) throw monthlyError;
        
        // Transform data for charts
        setStatusCounts(
          statusData.map((item) => ({
            status: item.status,
            count: parseInt(item.count),
          }))
        );
        
        setAgentCounts(
          agentData.map((item: any) => ({
            agent_name: item.profiles.full_name,
            count: parseInt(item.count),
          }))
        );
        
        setMonthlyRegistrations(
          monthlyData.map((item: any) => ({
            month: item.month,
            count: parseInt(item.count),
          }))
        );
      } catch (error) {
        console.error("Error fetching report data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchReportData();
  }, [supabase]);
  
  const exportToCSV = () => {
    // Implementation for exporting data to CSV
    const csvData = [
      ["Status", "Count"],
      ...statusCounts.map(item => [item.status, item.count.toString()]),
    ];
    
    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "worker_status_report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Loading report data...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Worker Status Reports</h1>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="byAgent">By Agent</TabsTrigger>
          <TabsTrigger value="byMonth">Monthly Trend</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Worker Status Distribution</CardTitle>
                <CardDescription>
                  Breakdown of workers by current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusCounts}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="status"
                      >
                        {statusCounts.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Status Summary</CardTitle>
                <CardDescription>
                  Numerical breakdown of worker statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusCounts.map((item) => (
                    <div key={item.status} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{
                            backgroundColor:
                              COLORS[statusCounts.findIndex((s) => s.status === item.status) % COLORS.length],
                          }}
                        ></div>
                        <span className="capitalize">{item.status}</span>
                      </div>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold">
                        {statusCounts.reduce((sum, item) => sum + item.count, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="byAgent">
          <Card>
            <CardHeader>
              <CardTitle>Workers by Agent</CardTitle>
              <CardDescription>
                Number of workers registered by each agent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={agentCounts}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 60,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="agent_name"
                      angle={-45}
                      textAnchor="end"
                      height={70}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" name="Number of Workers" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="byMonth">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Worker Registrations</CardTitle>
              <CardDescription>
                Number of workers registered per month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyRegistrations}
                    margin={{
                      top: 20,