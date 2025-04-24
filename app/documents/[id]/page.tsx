"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Document {
  id: string;
  worker_id: string;
  worker_name: string;
  document_type: string;
  status: string;
  submitted_at: string;
  processed_at: string | null;
  processor_id: string | null;
  processor_name: string | null;
  notes: string | null;
  file_path: string;
}

const formSchema = z.object({
  status: z.enum(["approved", "rejected", "needs_correction"]),
  notes: z.string().optional(),
});

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  const { data: document, isLoading: documentLoading, refetch: refetchDocument } = useApiQuery<Document>(
    'documents',
    (query) => query.select(`
      *,
      worker_name:workers(name),
      processor_name:users(name)
    `).eq('id', params.id).single(),
    { cacheKey: `document-${params.id}` }
  );

  const { mutate: updateDocument } = useApiMutation('documents', {
    onSuccess: () => {
      setSuccess(true);
      refetchDocument();
      
      // Create notification for the worker
      if (document) {
        createNotification(document.worker_id, form.getValues().status);
      }
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "approved",
      notes: "",
    },
  });

  // Fetch document file when document data is loaded
  useState(() => {
    if (document && document.file_path) {
      fetchDocumentFile(document.file_path);
    }
  });

  async function fetchDocumentFile(filePath: string) {
    try {
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
      
      if (error) {
        console.error('Error fetching document file:', error);
        return;
      }
      
      setFileUrl(data.signedUrl);
    } catch (error) {
      console.error('Error fetching document file:', error);
    }
  }

  async function createNotification(workerId: string, status: string) {
    try {
      let title = '';
      let message = '';
      let type = '';
      
      switch (status) {
        case 'approved':
          title = 'Document Approved';
          message = `Your ${document?.document_type.replace('_', ' ')} has been approved.`;
          type = 'success';
          break;
        case 'rejected':
          title = 'Document Rejected';
          message = `Your ${document?.document_type.replace('_', ' ')} has been rejected. Please check the notes for details.`;
          type = 'error';
          break;
        case 'needs_correction':
          title = 'Document Needs Correction';
          message = `Your ${document?.document_type.replace('_', ' ')} needs correction. Please check the notes for details.`;
          type = 'warning';
          break;
      }
      
      await supabase
        .from('notifications')
        .insert({
          user_id: workerId,
          title,
          message,
          type,
          related_to: 'document',
          related_id: params.id,
          read: false
        });
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      setError("You must be logged in to process documents.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const now = new Date().toISOString();
      
      await updateDocument((supabase) => 
        supabase
          .from('documents')
          .update({
            status: values.status,
            notes: values.notes || null,
            processed_at: now,
            processor_id: user.id,
            processing_time: calculateProcessingTime(document?.submitted_at || '', now)
          })
          .eq('id', params.id)
      );
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function calculateProcessingTime(submittedAt: string, processedAt: string): number {
    const submitted = new Date(submittedAt);
    const processed = new Date(processedAt);
    const diffInHours = (processed.getTime() - submitted.getTime()) / (1000 * 60 * 60);
    return parseFloat(diffInHours.toFixed(2));
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge variant="outline">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "needs_correction":
        return <Badge variant="warning">Needs Correction</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

  if (documentLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            Document not found. It may have been deleted or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push('/documents')}>
          Back to Documents
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {document.document_type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h1>
        <Button variant="outline" onClick={() => router.push('/documents')}>
          Back to Documents
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription>
            Document processed successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              {fileUrl ? (
                document.file_path.endsWith('.pdf') ? (
                  <iframe 
                    src={fileUrl} 
                    className="w-full h-[600px] border rounded"
                    title="Document Preview"
                  />
                ) : (
                  <img 
                    src={fileUrl} 
                    alt="Document Preview" 
                    className="max-h-[600px] object-contain"
                  />
                )
              ) : (
                <div className="flex items-center justify-center h-[400px] bg-muted rounded">
                  <p className="text-muted-foreground">Document preview not available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Worker</p>
                <p>{document.worker_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <div>{getStatusBadge(document.status)}</div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                <p>{formatDate(document.submitted_at)}</p>
              </div>
              {document.processed_at && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processed</p>
                    <p>{formatDate(document.processed_at)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Processed By</p>
                    <p>{document.processor_name || "Unknown"}</p>
                  </div>
                </>
              )}
              {document.notes && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Notes</p>
                  <p className="whitespace-pre-wrap">{document.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {document.status === "pending_review" && (
            <Card>
              <CardHeader>
                <CardTitle>Process Document</CardTitle>
                <CardDescription>
                  Review and update the status of this document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={isLoading}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="needs_correction">Needs Correction</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add any notes or feedback here..." 
                              {...field} 
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Processing..." : "Submit"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}