"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentRecord } from "@/app/reports/document-processing/page";

interface DocumentProcessingTableProps {
  documents: DocumentRecord[];
  isLoading: boolean;
}

export function DocumentProcessingTable({ documents, isLoading }: DocumentProcessingTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <div className="grid grid-cols-5 gap-4 p-4 font-medium text-sm border-b">
            <div>Worker</div>
            <div>Document Type</div>
            <div>Status</div>
            <div>Submitted</div>
            <div>Processing Time</div>
          </div>
          
          {isLoading ? (
            // Skeleton loaders for table rows
            <div className="divide-y">
              {Array(5).fill(0).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No documents found matching the current filters.</p>
            </div>
          ) : (
            // Actual content when loaded
            <div className="divide-y">
              {documents.map((doc) => (
                <div key={doc.id} className="grid grid-cols-5 gap-4 p-4">
                  <div className="truncate">{doc.worker_name}</div>
                  <div className="truncate">{doc.document_type}</div>
                  <div>
                    <Badge variant={getStatusVariant(doc.status)}>
                      {formatStatus(doc.status)}
                    </Badge>
                  </div>
                  <div>{formatDate(doc.submitted_at)}</div>
                  <div>
                    {doc.processing_time 
                      ? `${doc.processing_time.toFixed(1)} hours` 
                      : 'Not processed'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton loader for table rows
function TableRowSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-4 p-4">
      <Skeleton className="h-5 w-[120px]" />
      <Skeleton className="h-5 w-[100px]" />
      <Skeleton className="h-5 w-[80px]" />
      <Skeleton className="h-5 w-[90px]" />
      <Skeleton className="h-5 w-[70px]" />
    </div>
  );
}