"use client";

import { useState, useEffect } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileCheck, FileX, Clock, Eye } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  workerName: string;
  workerId: string;
  status: string;
  uploadDate: string;
}

interface LazyDocumentListProps {
  workerId?: string;
  initialPageSize?: number;
}

export function LazyDocumentList({ workerId, initialPageSize = 5 }: LazyDocumentListProps) {
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // Use optimized query with limit
  const { 
    data: documents, 
    isLoading, 
    error,
    refetch
  } = useApiQuery<Document[]>(
    'lazy_documents',
    (query) => {
      let q = query
        .select(`
          id,
          name,
          type,
          workerName:workers(name),
          workerId,
          status,
          uploadDate
        `)
        .order('uploadDate', { ascending: false })
        .limit(pageSize);
      
      // Filter by worker ID if provided
      if (workerId) {
        q = q.eq('workerId', workerId);
      }
      
      return q;
    },
    { 
      duration: 2 * 60 * 1000, // 2 minutes cache
      cacheKey: `documents:${workerId || 'all'}:${pageSize}` // Different cache key for different parameters
    }
  );

  const loadMore = () => {
    setPageSize(prevSize => prevSize + 5);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <FileCheck className="h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
            <FileX className="h-3 w-3" />
            Rejected
          </Badge>
        );
      case "pending_review":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-destructive/10">
        <CardContent className="p-4">
          <p className="text-destructive">
            Error loading documents. Please try refreshing.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Worker</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                No documents found.
              </TableCell>
            </TableRow>
          ) : (
            documents?.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.workerName}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell>{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {documents && documents.length >= pageSize && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={loadMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}