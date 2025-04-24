"use client";

import { useState } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, FilterIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  
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

  const { mutate: updateStatus, isLoading: isUpdating } = useApiMutation('documents', {
    onSuccess: () => {
      refetch();
    }
  });

  const filteredDocuments = documents?.filter(doc => {
    const matchesSearch = 
      doc.worker_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.document_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;
    const matchesType = typeFilter === "all" || doc.document_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge variant="outline">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "expired":
        return <Badge variant="secondary">Expired</Badge>;
      case "needs_correction":
        return <Badge variant="warning">Needs Correction</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by worker name or document type..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="needs_correction">Needs Correction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="work_permit">Work Permit</SelectItem>
                  <SelectItem value="medical_certificate">Medical Certificate</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
              {filteredDocuments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No documents found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments?.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.worker_name}</TableCell>
                    <TableCell>
                      {doc.document_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
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