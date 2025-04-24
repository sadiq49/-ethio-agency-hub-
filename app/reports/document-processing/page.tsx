"use client";

import { useState, useEffect } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentProcessingOverview } from "@/components/reports/document-processing/overview";
import { DocumentProcessingTable } from "@/components/reports/document-processing/table";
import { DocumentProcessingCharts } from "@/components/reports/document-processing/charts";
import { DocumentProcessingFilters } from "@/components/reports/document-processing/filters";
import { Button } from "@/components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Pagination } from "@/components/ui/pagination";

export type DocumentProcessingStats = {
  totalDocuments: number;
  pendingReview: number;
  approved: number;
  rejected: number;
  processingTime: number; // Average processing time in hours
};

export type DocumentStatus = 
  | "pending_review" 
  | "approved" 
  | "rejected" 
  | "expired" 
  | "needs_correction";

export interface DocumentRecord {
  id: string;
  worker_id: string;
  worker_name: string;
  document_type: string;
  status: DocumentStatus;
  submitted_at: string;
  processed_at: string | null;
  processing_time: number | null; // in hours
  processor_id: string | null;
  processor_name: string | null;
  notes: string | null;
}

export default function DocumentProcessingReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    documentType: "all",
    status: "all",
  });
  
  // Add pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
  });

  // Fetch document processing statistics
  const { 
    data: stats, 
    isLoading: statsLoading, 
    error: statsError,
    refetch: refetchStats
  } = useApiQuery<DocumentProcessingStats>(
    'document_processing_stats',
    (query) => query.select('*').single(),
    { duration: 15 * 60 * 1000 } // 15 minutes cache
  );

  // Modify document records query to include pagination
  const { 
    data: documentsResponse, 
    isLoading: documentsLoading, 
    error: documentsError,
    refetch: refetchDocuments
  } = useApiQuery<{ data: DocumentRecord[], count: number }>(
    'documents',
    (query) => {
      let q = query.select(`
        id,
        worker_id,
        worker_name:workers(name),
        document_type,
        status,
        submitted_at,
        processed_at,
        processing_time,
        processor_id,
        processor_name:processors(name),
        notes
      `, { count: 'exact' })
      .order('submitted_at', { ascending: false })
      .range(
        (pagination.page - 1) * pagination.pageSize, 
        pagination.page * pagination.pageSize - 1
      );
      
      // Apply filters
      if (filters.startDate) {
        q = q.gte('submitted_at', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        q = q.lte('submitted_at', filters.endDate.toISOString());
      }
      if (filters.documentType !== 'all') {
        q = q.eq('document_type', filters.documentType);
      }
      if (filters.status !== 'all') {
        q = q.eq('status', filters.status);
      }
      
      return q;
    },
    { 
      duration: 5 * 60 * 1000, // 5 minutes cache
      cacheKey: `documents:${JSON.stringify(filters)}:${JSON.stringify(pagination)}` // Different cache key for different filters and pagination
    }
  );

  const documents = documentsResponse?.data || [];
  const totalDocuments = documentsResponse?.count || 0;
  const totalPages = Math.ceil(totalDocuments / pagination.pageSize);

  // Update total count when data changes
  useEffect(() => {
    if (documentsResponse?.count !== undefined) {
      setPagination(prev => ({ ...prev, total: documentsResponse.count }));
    }
  }, [documentsResponse?.count]);

  const isLoading = statsLoading || documentsLoading;
  const hasError = statsError || documentsError;

  const handleRefresh = () => {
    refetchStats();
    refetchDocuments();
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Reset to first page when filters change
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Processing Reports</h1>
        <Button onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Refresh Data"
          )}
        </Button>
      </div>

      {hasError && (
        <Card className="bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-destructive">
              Error loading report data. Please try refreshing.
            </p>
          </CardContent>
        </Card>
      )}

      <DocumentProcessingFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Records</TabsTrigger>
          <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <DocumentProcessingOverview 
            stats={stats} 
            isLoading={statsLoading} 
          />
        </TabsContent>
        
        <TabsContent value="details" className="mt-6">
          <div className="space-y-4">
            <DocumentProcessingTable 
              documents={documents} 
              isLoading={documentsLoading} 
            />
            
            {/* Add pagination UI */}
            {!documentsLoading && totalPages > 1 && (
              <div className="flex justify-center mt-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="charts" className="mt-6">
          <DocumentProcessingCharts 
            documents={documents || []} 
            stats={stats} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}