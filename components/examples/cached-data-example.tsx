"use client";

import { useState } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Worker {
  id: string;
  name: string;
  status: string;
}

export function CachedDataExample() {
  // Fetch workers with caching (5 minute default cache)
  const { 
    data: workers, 
    isLoading, 
    error, 
    refetch 
  } = useApiQuery<Worker[]>(
    'workers',
    (query) => query.select('*').order('name'),
    { duration: 2 * 60 * 1000 } // 2 minutes cache
  );

  // Mutation hook for updating a worker
  const { 
    mutate: updateWorker, 
    isLoading: isUpdating 
  } = useApiMutation('workers', {
    onSuccess: () => {
      // Automatically invalidates workers cache
      console.log('Worker updated successfully');
    }
  });

  const handleUpdateStatus = async (workerId: string, newStatus: string) => {
    await updateWorker((supabase) => 
      supabase
        .from('workers')
        .update({ status: newStatus })
        .eq('id', workerId)
    );
  };

  if (isLoading) return <div>Loading workers...</div>;
  if (error) return <div>Error loading workers: {error.message}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Workers (Cached Data)</span>
          <Button onClick={() => refetch()} disabled={isUpdating}>
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {workers?.map((worker) => (
            <li key={worker.id} className="flex justify-between items-center">
              <span>{worker.name} - {worker.status}</span>
              <div className="space-x-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleUpdateStatus(worker.id, 'Active')}
                  disabled={isUpdating}
                >
                  Set Active
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleUpdateStatus(worker.id, 'Inactive')}
                  disabled={isUpdating}
                >
                  Set Inactive
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}