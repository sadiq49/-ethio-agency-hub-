"use client";

import { useState } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface Document {
  id: string;
  worker_id: string;
  worker_name: string;
  document_type: string;
  status: string;
  submitted_at: string;
  notes: string | null;
  processor_id: string | null;
  processed_at: string | null;
}

export default function DocumentWorkflowPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  // Fetch documents with their status
  const { data: documents, isLoading, refetch } = useApiQuery<Document[]>(
    'documents',
    (query) => query.select(`
      id,
      worker_id,
      worker_name:workers(name),
      document_type,
      status,
      submitted_at,
      notes,
      processor_id,
      processed_at
    `).order('submitted_at', { ascending: false }),
    { duration: 2 * 60 * 1000 } // 2 minutes cache
  );

  // Mutation for updating document status
  const { mutate: updateDocument, isLoading: isUpdating } = useApiMutation(
    'documents',
    {
      onSuccess: () => {
        toast({
          title: "Document updated",
          description: `Document has been ${reviewAction === 'approve' ? 'approved' : 'rejected'}.`,
        });
        refetch();
        closeReviewDialog();
      },
      onError: (error) => {
        toast({
          title: "Error updating document",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  );

  const filteredDocuments = documents?.filter(doc => {
    if (activeTab === "pending") return doc.status === "pending_review";
    if (activeTab === "approved") return doc.status === "approved";
    if (activeTab === "rejected") return doc.status === "rejected";
    return true; // "all" tab
  });

  const openReviewDialog = (document: Document, action: "approve" | "reject") => {
    setSelectedDocument(document);
    setReviewAction(action);
    setReviewNotes("");
  };

  const closeReviewDialog = () => {
    setSelectedDocument(null);
    setReviewAction(null);
    setReviewNotes("");
  };

  const handleReviewSubmit = async () => {
    if (!selectedDocument || !reviewAction) return;

    const userId = "current-user-id"; // Replace with actual user ID from auth context

    await updateDocument((supabase) => 
      supabase
        .from('documents')
        .update({
          status: reviewAction === 'approve' ? 'approved' : 'rejected',
          notes: reviewNotes,
          processor_id: userId,
          processed_at: new Date().toISOString()
        })
        .eq('id', selectedDocument.id)
    );

    // Create notification for the worker
    await updateDocument((supabase) =>
      supabase
        .from('notifications')
        .insert({
          user_id: selectedDocument.worker_id,
          title: `Document ${reviewAction === 'approve' ? 'Approved' : 'Rejected'}`,
          message: `Your ${selectedDocument.document_type.replace('_', ' ')} has been ${reviewAction === 'approve' ? 'approved' : 'rejected'}.`,
          type: reviewAction === 'approve' ? 'success' : 'error',
          related_to: 'document',
          related_id: selectedDocument.id,
          read: false
        })
    );
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const getDocumentTypeBadge = (type: string) => {
    const formattedType = type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
    return <Badge variant="outline">{formattedType}</Badge>;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Processing Workflow</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="all">All Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : filteredDocuments?.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-muted-foreground">No documents found in this category.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredDocuments?.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{document.worker_name}</h3>
                          {getDocumentTypeBadge(document.document_type)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Submitted on {formatDate(document.submitted_at)}
                        </p>
                        {document.processed_at && (
                          <p className="text-sm text-muted-foreground">
                            Processed on {formatDate(document.processed_at)}
                          </p>
                        )}
                        {document.notes && (
                          <p className="text-sm mt-2 p-2 bg-muted rounded-md">
                            {document.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 self-end md:self-center">
                        {document.status === "pending_review" ? (
                          <>
                            <Button 
                              variant="outline" 
                              onClick={() => openReviewDialog(document, "reject")}
                            >
                              Reject
                            </Button>
                            <Button 
                              onClick={() => openReviewDialog(document, "approve")}
                            >
                              Approve
                            </Button>
                          </>
                        ) : (
                          <Badge 
                            variant={document.status === "approved" ? "default" : "destructive"}
                          >
                            {document.status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Document Review Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={(open) => !open && closeReviewDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve Document' : 'Reject Document'}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'approve' 
                ? 'Confirm that this document meets all requirements.' 
                : 'Please provide a reason for rejecting this document.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <div className="space-y-4 py-4">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Worker</p>
                <p className="text-sm">{selectedDocument.worker_name}</p>
              </div>
              
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Document Type</p>
                <p className="text-sm">
                  {selectedDocument.document_type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
              </div>
              
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Notes</p>
                <Textarea
                  placeholder="Add processing notes..."
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={closeReviewDialog}>
              Cancel
            </Button>
            <Button 
              onClick={handleReviewSubmit} 
              disabled={isUpdating}
              variant={reviewAction === 'approve' ? 'default' : 'destructive'}
            >
              {isUpdating ? 'Processing...' : reviewAction === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}