import { FilterBar } from "@/components/ui/filter-bar";

// Usage
<FilterBar
  searchPlaceholder="Search workers..."
  searchValue={searchTerm}
  onSearchChange={setSearchTerm}
  filters={[
    {
      name: "status",
      label: "Status",
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: "all", label: "All Statuses" },
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" }
      ]
    }
  ]}
/>import { StatCard } from "@/components/ui/stat-card";
import { Users } from "lucide-react";

// Usage
<StatCard
  title="Total Workers"
  value={1234}
  description="Active contracts"
  icon={<Users className="h-4 w-4" />}
  color="blue"
  progress={75}
/>import { useFilters } from "@/hooks/useFilters";

// Usage
const { filters, updateFilter, resetFilters } = useFilters({
  searchTerm: "",
  status: "all",
  type: "all"
});

// Update a single filter
updateFilter("status", "active");

// Reset all filters
resetFilters();import { useFilteredData } from "@/hooks/useFilteredData";

// Usage
const filteredData = useFilteredData(
  workers,
  filters,
  (worker, filters) => {
    return (
      worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
      (filters.status === "all" || worker.status === filters.status)
    );
  }
);import { usePagination } from "@/hooks/usePagination";

// Usage
const {
  currentPage,
  totalPages,
  paginatedData,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredData, { pageSize: 10 });import { useFilteredData } from "@/hooks/useFilteredData";

// Usage
const filteredData = useFilteredData(
  workers,
  filters,
  (worker, filters) => {
    return (
      worker.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
      (filters.status === "all" || worker.status === filters.status)
    );
  }
);
## Implementation Example

Here's how you would refactor one of your existing components using the new component library:

```tsx:c%3A%5CUsers%5CAdministrator%5CDesktop%5Cproject-bolt-sb1-tsql4g8u%5Capp%5Cdocuments%5Cpage-refactored.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery, useApiMutation } from "@/lib/api";
import { FilterBar } from "@/components/ui/filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { useFilters } from "@/hooks/useFilters";
import { useFilteredData } from "@/hooks/useFilteredData";

interface Document {
  id: string;
  worker_id: string;
  worker_name: string;
  document_type: string;
  status: string;
  submitted_at: string;
  processed_at: string | null;
  expiry_date: string | null;
}

export default function DocumentsPage() {
  const router = useRouter();
  
  // Use the custom hooks for filter management
  const { filters, updateFilter } = useFilters({
    searchTerm: "",
    status: "all",
    type: "all"
  });

  const { data: documents, isLoading, error, refetch } = useApiQuery<Document[]>(
    'documents',
    (query) => query.select(`
      id,
      worker_id,
      worker_name:workers(name),
      document_type,
      status,
      submitted_at,
      processed_at,
      expiry_date
    `).order('submitted_at', { ascending: false }),
    { duration: 5 * 60 * 1000 } // 5 minutes cache
  );

  // Use the filtered data hook
  const filteredDocuments = useFilteredData(
    documents,
    filters,
    (doc, filters) => {
      const matchesSearch = 
        doc.worker_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === "all" || doc.status === filters.status;
      const matchesType = filters.type === "all" || doc.document_type === filters.type;
      
      return matchesSearch && matchesStatus && matchesType;
    }
  );

  const { mutate: updateStatus, isLoading: isUpdating } = useApiMutation('documents', {
    onSuccess: () => {
      refetch();
    }
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const handleApprove = async (id: string) => {
    await updateStatus((supabase) => 
      supabase
        .from('documents')
        .update({ 
          status: 'approved',
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
    );
  };

  const handleReject = async (id: string) => {
    await updateStatus((supabase) => 
      supabase
        .from('documents')
        .update({ 
          status: 'rejected',
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Button onClick={() => router.push('/documents/upload')}>
          Upload Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {/* Using the new FilterBar component */}
          <FilterBar
            searchPlaceholder="Search by worker name or document type..."
            searchValue={filters.searchTerm}
            onSearchChange={(value) => updateFilter("searchTerm", value)}
            filters={[
              {
                name: "status",
                label: "Filter by status",
                value: filters.status,
                onChange: (value) => updateFilter("status", value),
                options: [
                  { value: "all", label: "All Statuses" },
                  { value: "pending_review", label: "Pending Review" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "expired", label: "Expired" },
                  { value: "needs_correction", label: "Needs Correction" }
                ]
              },
              {
                name: "type",
                label: "Filter by type",
                value: filters.type,
                onChange: (value) => updateFilter("type", value),
                options: [
                  { value: "all", label: "All Types" },
                  { value: "passport", label: "Passport" },
                  { value: "visa", label: "Visa" },
                  { value: "work_permit", label: "Work Permit" },
                  { value: "medical_certificate", label: "Medical Certificate" },
                  { value: "contract", label: "Contract" }
                ]
              }
            ]}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : error ? (
        <Card className="bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-destructive">
              Error loading documents. Please try refreshing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No documents found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.worker_name}</TableCell>
                    <TableCell>
                      {doc.document_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </TableCell>
                    <TableCell>
                      {/* Using the new StatusBadge component */}
                      <StatusBadge status={doc.status} variant="document" />
                    </TableCell>
                    <TableCell>{formatDate(doc.submitted_at)}</TableCell>
                    <TableCell>{formatDate(doc.processed_at)}</TableCell>
                    <TableCell>{formatDate(doc.expiry_date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => router.push(`/documents/${doc.id}`)}
                        >
                          View
                        </Button>
                        {doc.status === "pending_review" && (
                          <>
                            <Button
                              variant="outline"
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleApprove(doc.id)}
                              disabled={isUpdating}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleReject(doc.id)}
                              disabled={isUpdating}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
## Implementation Example

Here's how you would refactor one of your existing components using the new component library:

```tsx:c%3A%5CUsers%5CAdministrator%5CDesktop%5Cproject-bolt-sb1-tsql4g8u%5Capp%5Cdocuments%5Cpage-refactored.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useApiQuery, useApiMutation } from "@/lib/api";
import { FilterBar } from "@/components/ui/filter-bar";
import { StatusBadge } from "@/components/ui/status-badge";
import { useFilters } from "@/hooks/useFilters";
import { useFilteredData } from "@/hooks/useFilteredData";

interface Document {
  id: string;
  worker_id: string;
  worker_name: string;
  document_type: string;
  status: string;
  submitted_at: string;
  processed_at: string | null;
  expiry_date: string | null;
}

export default function DocumentsPage() {
  const router = useRouter();
  
  // Use the custom hooks for filter management
  const { filters, updateFilter } = useFilters({
    searchTerm: "",
    status: "all",
    type: "all"
  });

  const { data: documents, isLoading, error, refetch } = useApiQuery<Document[]>(
    'documents',
    (query) => query.select(`
      id,
      worker_id,
      worker_name:workers(name),
      document_type,
      status,
      submitted_at,
      processed_at,
      expiry_date
    `).order('submitted_at', { ascending: false }),
    { duration: 5 * 60 * 1000 } // 5 minutes cache
  );

  // Use the filtered data hook
  const filteredDocuments = useFilteredData(
    documents,
    filters,
    (doc, filters) => {
      const matchesSearch = 
        doc.worker_name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        doc.document_type.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      const matchesStatus = filters.status === "all" || doc.status === filters.status;
      const matchesType = filters.type === "all" || doc.document_type === filters.type;
      
      return matchesSearch && matchesStatus && matchesType;
    }
  );

  const { mutate: updateStatus, isLoading: isUpdating } = useApiMutation('documents', {
    onSuccess: () => {
      refetch();
    }
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const handleApprove = async (id: string) => {
    await updateStatus((supabase) => 
      supabase
        .from('documents')
        .update({ 
          status: 'approved',
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
    );
  };

  const handleReject = async (id: string) => {
    await updateStatus((supabase) => 
      supabase
        .from('documents')
        .update({ 
          status: 'rejected',
          processed_at: new Date().toISOString()
        })
        .eq('id', id)
    );
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Documents</h1>
        <Button onClick={() => router.push('/documents/upload')}>
          Upload Document
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          {/* Using the new FilterBar component */}
          <FilterBar
            searchPlaceholder="Search by worker name or document type..."
            searchValue={filters.searchTerm}
            onSearchChange={(value) => updateFilter("searchTerm", value)}
            filters={[
              {
                name: "status",
                label: "Filter by status",
                value: filters.status,
                onChange: (value) => updateFilter("status", value),
                options: [
                  { value: "all", label: "All Statuses" },
                  { value: "pending_review", label: "Pending Review" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                  { value: "expired", label: "Expired" },
                  { value: "needs_correction", label: "Needs Correction" }
                ]
              },
              {
                name: "type",
                label: "Filter by type",
                value: filters.type,
                onChange: (value) => updateFilter("type", value),
                options: [
                  { value: "all", label: "All Types" },
                  { value: "passport", label: "Passport" },
                  { value: "visa", label: "Visa" },
                  { value: "work_permit", label: "Work Permit" },
                  { value: "medical_certificate", label: "Medical Certificate" },
                  { value: "contract", label: "Contract" }
                ]
              }
            ]}
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : error ? (
        <Card className="bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-destructive">
              Error loading documents. Please try refreshing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Processed</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No documents found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.worker_name}</TableCell>
                    <TableCell>
                      {doc.document_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </TableCell>
                    <TableCell>
                      {/* Using the new StatusBadge component */}
                      <StatusBadge status={doc.status} variant="document" />
                    </TableCell>
                    <TableCell>{formatDate(doc.submitted_at)}</TableCell>
                    <TableCell>{formatDate(doc.processed_at)}</TableCell>
                    <TableCell>{formatDate(doc.expiry_date)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          onClick={() => router.push(`/documents/${doc.id}`)}
                        >
                          View
                        </Button>
                        {doc.status === "pending_review" && (
                          <>
                            <Button
                              variant="outline"
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleApprove(doc.id)}
                              disabled={isUpdating}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleReject(doc.id)}
                              disabled={isUpdating}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}# Component Library Documentation

This document provides an overview of the reusable components available in our application.

## UI Components

### StatusBadge

Displays a status with consistent styling across the application.

```tsx
import { StatusBadge } from "@/components/ui/status-badge";

// Usage
<StatusBadge status="approved" />
<StatusBadge status="pending" variant="document" showIcon={false} />