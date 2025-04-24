"use client";

import { useState, useEffect } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import StatusCards from '@/components/dashboard/status-cards';
import WorkerStatistics from '@/components/dashboard/worker-statistics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

export default function ResponsiveDashboard() {
  // Fetch dashboard statistics with caching (5 minute cache)
  const { 
    data: dashboardStats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useApiQuery(
    'dashboard_stats',
    (query) => query.select('*').single(),
    { duration: 5 * 60 * 1000 } // 5 minutes cache
  );

  // Fetch worker data with caching (2 minute cache)
  const { 
    data: workerData, 
    isLoading: workersLoading, 
    error: workersError,
    refetch: refetchWorkers
  } = useApiQuery(
    'worker_stats',
    (query) => query.select('*').order('month'),
    { duration: 2 * 60 * 1000 } // 2 minutes cache
  );

  const isLoading = statsLoading || workersLoading;
  const hasError = statsError || workersError;

  const handleRefresh = () => {
    refetchStats();
    refetchWorkers();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <Button onClick={handleRefresh} disabled={isLoading} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          {isLoading ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>
      
      {hasError ? (
        <Card className="bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-destructive">
              Error loading dashboard data. Please try refreshing.
            </p>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-[100px] w-full" />
            ))}
          </div>
          <Skeleton className="h-[300px] w-full" />
        </>
      ) : (
        <>
          <StatusCards data={dashboardStats} />
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle>Worker Statistics</CardTitle>
                <CardDescription>
                  Monthly worker status and deployment trends
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <WorkerStatistics data={workerData} />
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}