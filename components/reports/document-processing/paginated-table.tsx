"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { DocumentRecord } from "@/app/reports/document-processing/page";
import { FileCheck, FileX, Clock, AlertCircle, Eye } from "lucide-react";

interface PaginatedTableProps {
  documents: DocumentRecord[];
  isLoading: boolean;
  pageSize?: number;
}

export function PaginatedDocumentTable({ 
  documents, 
  isLoading,
  pageSize = 10
}: PaginatedTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Calculate pagination
  const totalPages = Math.ceil(documents.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDocuments = documents.slice(startIndex, startIndex + pageSize);
  
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
            Pending Review
          </Badge>
        );
      case "needs_correction":
        return (
          <Badge className="bg-orange-100 text-orange-800 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Needs Correction
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
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Type</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead>Processing Time</TableHead>
              <TableHead>Processor</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDocuments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No documents found matching your criteria.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
                    {doc.document_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </TableCell>
                  <TableCell>{doc.worker_name}</TableCell>
                  <TableCell>{getStatusBadge(doc.status)}</TableCell>
                  <TableCell>{new Date(doc.submitted_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {doc.processed_at ? new Date(doc.processed_at).toLocaleDateString() : "-"}
                  </TableCell>
                  <TableCell>
                    {doc.processing_time ? `${doc.processing_time.toFixed(1)} hours` : "-"}
                  </TableCell>
                  <TableCell>{doc.processor_name || "-"}</TableCell>
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
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}