"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import documentWorkflow, { DocumentStatus } from "@/lib/document-workflow";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface DocumentProcessorProps {
  document: {
    id: string;
    worker_id: string;
    worker_name: string;
    document_type: string;
    status: DocumentStatus;
    submitted_at: string;
    file_url: string;
    notes: string | null;
  };
  onProcessed?: () => void;
}

export function DocumentProcessor({ document, onProcessed }: DocumentProcessorProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  
  const canProcess = profile?.role === "admin" || profile?.role === "processor";
  const isPending = document.status === "pending_review";
  const needsCorrection = document.status === "needs_correction";
  
  const getStatusBadge = (status: DocumentStatus) => {
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
  
  const handleAction = async () => {
    if (!action || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await documentWorkflow.transitionDocument(
        document.id,
        action,
        notes,
        user.id
      );
      
      setDialogOpen(false);
      if (onProcessed) onProcessed();
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const openDialog = (actionType: string) => {
    setAction(actionType);
    setNotes("");
    setError(null);
    setDialogOpen(true);
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{document.document_type.replace("_", " ").replace(/\b\w/g, c => c.toUpperCase())}</CardTitle>
            <CardDescription>
              Submitted by {document.worker_name} on {format(new Date(document.submitted_at), "PPP")}
            </CardDescription>
          </div>
          {getStatusBadge(document.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-4">
          {document.file_url ? (
            <iframe 
              src={document.file_url} 
              className="w-full h-full rounded-md"
              title={`${document.document_type} preview`}
            />
          ) : (
            <div className="text-muted-foreground">Document preview not available</div>
          )}
        </div>
        
        {document.notes && (
          <div className="bg-muted p-3 rounded-md text-sm mt-2">
            <p className="font-semibold">Notes:</p>
            <p>{document.notes}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {canProcess && isPending && (
          <>
            <Button 
              variant="outline" 
              onClick={() => openDialog("request_correction")}
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              Request Correction
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => openDialog("reject")}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button 
              variant="default" 
              onClick={() => openDialog("approve")}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </>
        )}
        
        {needsCorrection && document.worker_id === user?.id && (
          <Button 
            variant="default" 
            onClick={() => openDialog("resubmit")}
          >
            Resubmit
          </Button>
        )}
      </CardFooter>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approve" && "Approve Document"}
              {action === "reject" && "Reject Document"}
              {action === "request_correction" && "Request Correction"}
              {action === "resubmit" && "Resubmit this document for review."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAction} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}it" && "Resubmit Document"}
            </DialogTitle>
            <DialogDescription>
              {action === "approve" && "The document will be marked as approved."}
              {action === "reject" && "The document will be rejected."}
              {action === "request_correction" && "Request changes to this document."}
              {action === "resubmit" && "Resubmit this document for review."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              placeholder="Add notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            
            {error && (
              <div className="text-sm text-destructive">{error}</div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleAction} disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}