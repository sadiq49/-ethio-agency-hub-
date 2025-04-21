"use client";

import { useState } from 'react';
import StatusCards from '@/components/dashboard/status-cards';
import WorkerStatistics from '@/components/dashboard/worker-statistics';
import TodaysTasks from '@/components/dashboard/todays-tasks';
import RecentActivities from '@/components/dashboard/recent-activities';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/dashboard/date-range-picker';
import { Button } from '@/components/ui/button';
import { PlusCircle, Calendar, FileText, Users } from 'lucide-react';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: undefined,
  });
  
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Worker
          </Button>
        </div>
      </div>
      
      <StatusCards />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Worker Statistics</CardTitle>
              <CardDescription>
                Monthly worker status and deployment trends
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <WorkerStatistics />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="tasks" className="space-y-4">
              <TabsList>
                <TabsTrigger value="tasks" className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Today's Tasks
                </TabsTrigger>
                <TabsTrigger value="activities" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Recent Activities
                </TabsTrigger>
                <TabsTrigger value="flying" className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Today Flying
                </TabsTrigger>
              </TabsList>
              <TabsContent value="tasks" className="space-y-4">
                <TodaysTasks />
              </TabsContent>
              <TabsContent value="activities" className="space-y-4">
                <RecentActivities />
              </TabsContent>
              <TabsContent value="flying" className="space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="rounded-md border p-4 text-center">
                    <p className="text-sm text-muted-foreground">No workers are scheduled to fly today</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}