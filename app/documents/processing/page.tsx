x"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DocumentProcessingFilters } from "@/components/reports/document-processing/filters";
import { 
  Search, 
  Filter, 
  FileText,
  FileCheck,
  FileX,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Stamp,
  Send,
  MoreHorizontal,
  Calendar,
  FileWarning,
  History,
  UserCheck,
  Building2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Document {
  id: string;
  name: string;
  type: string;
  workerName: string;
  workerId: string;
  status: "pending_review" | "approved" | "rejected" | "needs_correction" | "expired" | "processing";
  uploadDate: string;
  lastUpdated: string;
  currentStage: string;
  nextStage?: string;
  assignedTo?: string;
  priority: "high" | "medium" | "low";
  expiryDate?: string;
  remarks?: string;
}

interface Stage {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "pending" | "skipped" | "failed";
  completedDate?: string;
  assignedTo?: string;
  remarks?: string;
}

interface DocumentDetail {
  id: string;
  document: Document;
  stages: Stage[];
  history: {
    date: string;
    action: string;
    user: string;
    remarks?: string;
  }[];
  files: {
    name: string;
    type: string;
    uploadDate: string;
    size: string;
    url: string;
  }[];
}

// Sample data for demonstration
const documents: Document[] = [
  {
    id: "DOC-2024-001",
    name: "Passport Copy",
    type: "passport",
    workerName: "Amina Hassan",
    workerId: "W1001",
    status: "pending_review",
    uploadDate: "2024-03-15",
    lastUpdated: "2024-03-15",
    currentStage: "Initial Verification",
    nextStage: "Authentication",
    assignedTo: "Sarah Ahmed",
    priority: "high",
    expiryDate: "2029-03-14",
    remarks: "Waiting for verification of personal details"
  },
  {
    id: "DOC-2024-002",
    name: "Medical Certificate",
    type: "medical_certificate",
    workerName: "Amina Hassan",
    workerId: "W1001",
    status: "approved",
    uploadDate: "2024-03-10",
    lastUpdated: "2024-03-12",
    currentStage: "Completed",
    assignedTo: "Mohammed Ali",
    priority: "medium",
    expiryDate: "2024-09-10",
    remarks: "All medical tests passed"
  },
  {
    id: "DOC-2024-003",
    name: "Employment Contract",
    type: "contract",
    workerName: "Fatima Omar",
    workerId: "W1002",
    status: "needs_correction",
    uploadDate: "2024-03-14",
    lastUpdated: "2024-03-16",
    currentStage: "Legal Review",
    nextStage: "Authentication",
    assignedTo: "Ahmed Hassan",
    priority: "high",
    remarks: "Salary terms need clarification"
  },
  {
    id: "DOC-2024-004",
    name: "Visa Application",
    type: "visa",
    workerName: "Hassan Ahmed",
    workerId: "W1003",
    status: "processing",
    uploadDate: "2024-03-12",
    lastUpdated: "2024-03-17",
    currentStage: "Embassy Submission",
    nextStage: "Visa Issuance",
    assignedTo: "Fatima Omar",
    priority: "high",
    remarks: "Submitted to embassy, awaiting response"
  },
  {
    id: "DOC-2024-005",
    name: "Insurance Policy",
    type: "insurance",
    workerName: "Sara Ahmed",
    workerId: "W1004",
    status: "rejected",
    uploadDate: "2024-03-11",
    lastUpdated: "2024-03-13",
    currentStage: "Failed",
    assignedTo: "Mohammed Ali",
    priority: "medium",
    remarks: "Coverage amount below required minimum"
  }
];

// Sample document detail for the first document
const sampleDocumentDetail: DocumentDetail = {
  id: "DOC-2024-001",
  document: documents[0],
  stages: [
    {
      id: "stage-1",
      name: "Document Upload",
      status: "completed",
      completedDate: "2024-03-15",
      assignedTo: "System",
      remarks: "Document uploaded successfully"
    },
    {
      id: "stage-2",
      name: "Initial Verification",
      status: "in_progress",
      assignedTo: "Sarah Ahmed",
      remarks: "Verifying personal details"
    },
    {
      id: "stage-3",
      name: "Authentication",
      status: "pending",
      assignedTo: "Ahmed Hassan"
    },
    {
      id: "stage-4",
      name: "Final Approval",
      status: "pending",
      assignedTo: "Mohammed Ali"
    }
  ],
  history: [
    {
      date: "2024-03-15 14:30",
      action: "Document Uploaded",
      user: "Amina Hassan",
      remarks: "Initial upload"
    },
    {
      date: "2024-03-15 15:45",
      action: "Assigned for Verification",
      user: "System",
      remarks: "Automatically assigned to Sarah Ahmed"
    },
    {
      date: "2024-03-16 09:15",
      action: "Verification Started",
      user: "Sarah Ahmed",
      remarks: "Started verification process"
    }
  ],
  files: [
    {
      name: "passport_front.jpg",
      type: "image/jpeg",
      uploadDate: "2024-03-15",
      size: "1.2 MB",
      url: "/documents/passport_front.jpg"
    },
    {
      name: "passport_back.jpg",
      type: "image/jpeg",
      uploadDate: "2024-03-15",
      size: "1.1 MB",
      url: "/documents/passport_back.jpg"
    }
  ]
};

export default function DocumentProcessingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocument, setSelectedDocument] = useState<DocumentDetail | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | "correction" | "forward" | null>(null);
  const [actionRemarks, setActionRemarks] = useState("");
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    documentType: "all",
    status: "all",
  });
  
  // Replace sample data with real data from Supabase
  const { data: documents, isLoading: documentsLoading, refetch: refetchDocuments } = useApiQuery<Document[]>(
    'documents',
    (query) => {
      let q = query.select(`
        id,
        name:document_type,
        type:document_type,
        workerName:workers(name),
        workerId:worker_id,
        status,
        uploadDate:submitted_at,
        lastUpdated:updated_at,
        currentStage:processing_stage,
        nextStage:next_stage,
        assignedTo:assigned_to,
        priority,
        expiryDate:expiry_date,
        remarks
      `);
      
      // Apply filters if they exist
      if (filters.documentType !== "all") {
        q = q.eq('document_type', filters.documentType);
      }
      
      if (filters.status !== "all") {
        q = q.eq('status', filters.status);
      }
      
      if (filters.startDate && filters.endDate) {
        q = q.gte('submitted_at', filters.startDate)
             .lte('submitted_at', filters.endDate);
      }
      
      return q.order('submitted_at', { ascending: false });
    },
    { cacheKey: 'processing-documents' }
  );

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.workerName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filters.documentType === "all" || doc.type === filters.documentType;
    const matchesStatus = filters.status === "all" || doc.status === filters.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleViewDetails = async (documentId: string) => {
    try {
      // Fetch document details from Supabase
      const supabase = createClientComponentClient();
      
      // Get document basic info
      const { data: documentData, error: documentError } = await supabase
        .from('documents')
        .select(`
          id,
          document_type,
          status,
          submitted_at,
          updated_at,
          processing_stage,
          next_stage,
          assigned_to,
          priority,
          expiry_date,
          remarks,
          worker_id,
          workers(name)
        `)
        .eq('id', documentId)
        .single();
        
      if (documentError) throw documentError;
      
      // Get document stages
      const { data: stagesData, error: stagesError } = await supabase
        .from('document_stages')
        .select('*')
        .eq('document_id', documentId)
        .order('sequence', { ascending: true });
        
      if (stagesError) throw stagesError;
      
      // Get document history
      const { data: historyData, error: historyError } = await supabase
        .from('document_history')
        .select(`
          date:created_at,
          action,
          user:users(name),
          remarks
        `)
        .eq('document_id', documentId)
        .order('created_at', { ascending: false });
        
      if (historyError) throw historyError;
      
      // Get document files
      const { data: filesData, error: filesError } = await supabase
        .from('document_files')
        .select('*')
        .eq('document_id', documentId);
        
      if (filesError) throw filesError;
      
      // Format the data to match our DocumentDetail interface
      const documentDetail: DocumentDetail = {
        id: documentData.id,
        document: {
          id: documentData.id,
          name: documentData.document_type,
          type: documentData.document_type,
          workerName: documentData.workers.name,
          workerId: documentData.worker_id,
          status: documentData.status,
          uploadDate: documentData.submitted_at,
          lastUpdated: documentData.updated_at,
          currentStage: documentData.processing_stage,
          nextStage: documentData.next_stage,
          assignedTo: documentData.assigned_to,
          priority: documentData.priority,
          expiryDate: documentData.expiry_date,
          remarks: documentData.remarks
        },
        stages: stagesData.map(stage => ({
          id: stage.id,
          name: stage.name,
          status: stage.status,
          completedDate: stage.completed_at,
          assignedTo: stage.assigned_to,
          remarks: stage.remarks
        })),
        history: historyData.map(history => ({
          date: history.date,
          action: history.action,
          user: history.user,
          remarks: history.remarks
        })),
        files: filesData.map(file => ({
          name: file.name,
          type: file.type,
          uploadDate: file.uploaded_at,
          size: file.size,
          url: file.url
        }))
      };
      
      setSelectedDocument(documentDetail);
      setDetailsOpen(true);
    } catch (error) {
      console.error("Error fetching document details:", error);
      // Show error notification
    }
  };

  const handleAction = (type: "approve" | "reject" | "correction" | "forward") => {
    setActionType(type);
    setActionDialogOpen(true);
  };

  const submitAction = async () => {
    if (!selectedDocument || !actionType) return;
    
    try {
      const supabase = createClientComponentClient();
      const documentId = selectedDocument.document.id;
      
      // Update document status based on action type
      let newStatus = selectedDocument.document.status;
      let newStage = selectedDocument.document.currentStage;
      let nextStage = selectedDocument.document.nextStage;
      
      switch (actionType) {
        case "approve":
          // If this is the final stage, mark as approved
          if (!nextStage) {
            newStatus = "approved";
          } else {
            // Otherwise, move to next stage
            newStatus = "processing";
            newStage = nextStage;
            
            // Get the stage after the next stage
            const { data: stageData } = await supabase
              .from('document_stages')
              .select('name')
              .eq('document_id', documentId)
              .gt('sequence', selectedDocument.stages.length)
              .order('sequence', { ascending: true })
              .limit(1);
              
            nextStage = stageData && stageData.length > 0 ? stageData[0].name : null;
          }
          break;
        case "reject":
          newStatus = "rejected";
          break;
        case "correction":
          newStatus = "needs_correction";
          break;
        case "forward":
          // Similar to approve but without changing status
          if (nextStage) {
            newStage = nextStage;
            
            // Get the stage after the next stage
            const { data: stageData } = await supabase
              .from('document_stages')
              .select('name')
              .eq('document_id', documentId)
              .gt('sequence', selectedDocument.stages.length)
              .order('sequence', { ascending: true })
              .limit(1);
              
            nextStage = stageData && stageData.length > 0 ? stageData[0].name : null;
          }
          break;
      }
      
      // Update document
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          status: newStatus,
          processing_stage: newStage,
          next_stage: nextStage,
          updated_at: new Date().toISOString(),
          remarks: actionRemarks || null
        })
        .eq('id', documentId);
        
      if (updateError) throw updateError;
      
      // Add to document history
      const { error: historyError } = await supabase
        .from('document_history')
        .insert({
          document_id: documentId,
          action: actionType === "approve" ? "Approved" : 
                  actionType === "reject" ? "Rejected" : 
                  actionType === "correction" ? "Requested Correction" : 
                  "Forwarded to Next Stage",
          user_id: "current-user-id", // Replace with actual user ID
          remarks: actionRemarks
        });
        
      if (historyError) throw historyError;
      
      // Create notification for the worker
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: selectedDocument.document.workerId,
          title: `Document ${actionType === "approve" ? "Approved" : 
                  actionType === "reject" ? "Rejected" : 
                  actionType === "correction" ? "Needs Correction" : 
                  "Processing"}`,
          message: `Your ${selectedDocument.document.name} has been ${
            actionType === "approve" ? "approved" : 
            actionType === "reject" ? "rejected" : 
            actionType === "correction" ? "returned for correction" : 
            "moved to the next processing stage"
          }${actionRemarks ? `: ${actionRemarks}` : "."}`,
          type: actionType === "approve" ? "success" : 
                actionType === "reject" ? "error" : 
                actionType === "correction" ? "warning" : 
                "info",
          related_to: "document",
          related_id: documentId,
          read: false
        });
        
      if (notificationError) throw notificationError;
      
      // Close dialogs and refresh data
      setActionDialogOpen(false);
      setActionType(null);
      setActionRemarks("");
      setDetailsOpen(false);
      refetchDocuments();
      
    } catch (error) {
      console.error("Error processing document action:", error);
      // Show error notification
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Pending Review
          </Badge>
        );
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <FileX className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        );
      case "needs_correction":
        return (
          <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
            <FileWarning className="mr-1 h-3 w-3" />
            Needs Correction
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            <AlertCircle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <RefreshCw className="mr-1 h-3 w-3" />
            Processing
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Low
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {priority}
          </Badge>
        );
    }
  };

  const getStageStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <RefreshCw className="mr-1 h-3 w-3" />
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "skipped":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Skipped
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            <AlertCircle className="mr-1 h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Document Processing</h1>
        <Button onClick={() => setUploadDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload New Document
        </Button>
      </div>

      <DocumentProcessingFilters filters={filters} onFilterChange={handleFilterChange} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Stage</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No documents found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{doc.name}</span>
                        <span className="text-xs text-muted-foreground">{doc.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{doc.workerName}</span>
                        <span className="text-xs text-muted-foreground">{doc.workerId}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{doc.currentStage}</span>
                        {doc.nextStage && (
                          <span className="text-xs text-muted-foreground flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            {doc.nextStage}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getPriorityBadge(doc.priority)}</TableCell>
                    <TableCell>{doc.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(doc.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction("approve")}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("reject")}>
                              <FileX className="mr-2 h-4 w-4" />
                              Reject
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("correction")}>
                              <FileWarning className="mr-2 h-4 w-4" />
                              Request Correction
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("forward")}>
                              <Send className="mr-2 h-4 w-4" />
                              Forward to Next Stage
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Document Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              {selectedDocument?.document.id} - {selectedDocument?.document.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedDocument && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="workflow">Workflow</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Document Type</h3>
                    <p>{selectedDocument.document.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p>{getStatusBadge(selectedDocument.document.status)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Worker</h3>
                    <p>{selectedDocument.document.workerName} ({selectedDocument.document.workerId})</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Upload Date</h3>
                    <p>{selectedDocument.document.uploadDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                    <p>{selectedDocument.document.lastUpdated}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                    <p>{selectedDocument.document.assignedTo || "Not assigned"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                    <p>{getPriorityBadge(selectedDocument.document.priority)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Expiry Date</h3>
                    <p>{selectedDocument.document.expiryDate || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                    <p>{selectedDocument.document.remarks || "No remarks"}</p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => handleAction("correction")}>
                    <FileWarning className="mr-2 h-4 w-4" />
                    Request Correction
                  </Button>
                  <Button variant="outline" onClick={() => handleAction("reject")}>
                    <FileX className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button variant="outline" onClick={() => handleAction("forward")}>
                    <Send className="mr-2 h-4 w-4" />
                    Forward
                  </Button>
                  <Button onClick={() => handleAction("approve")}>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="workflow">
                <div className="space-y-4">
                  {selectedDocument.stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-grow border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{stage.name}</h3>
                          {getStageStatusBadge(stage.status)}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {stage.status === "completed" && (
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>Completed on {stage.completedDate}</span>
                            </div>
                          )}
                          {stage.assignedTo && (
                            <div className="flex items-center gap-2 mt-1">
                              <UserCheck className="h-4 w-4" />
                              <span>Assigned to {stage.assignedTo}</span>
                            </div>
                          )}
                          {stage.remarks && (
                            <div className="mt-1">
                              <p>{stage.remarks}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="history">
                <div className="space-y-4">
                  {selectedDocument.history.map((event, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <History className="h-4 w-4" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{event.action}</h3>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <p className="text-sm">By: {event.user}</p>
                        {event.remarks && (
                          <p className="text-sm text-muted-foreground mt-1">{event.remarks}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="files">
                <div className="space-y-4">
                  {selectedDocument.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between border rounded-md p-4">
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                          <h3 className="font-medium">{file.name}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{file.type}</span>
                            <span>{file.size}</span>
                            <span>Uploaded: {file.uploadDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Document"}
              {actionType === "reject" && "Reject Document"}
              {actionType === "correction" && "Request Correction"}
              {actionType === "forward" && "Forward to Next Stage"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve" && "Approve this document and move it to the next stage."}
              {actionType === "reject" && "Reject this document and provide a reason."}
              {actionType === "correction" && "Request corrections for this document."}
              {actionType === "forward" && "Forward this document to the next processing stage."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {actionType === "forward" && (
              <div className="space-y-2">
                <Label htmlFor="nextStage">Next Stage</Label>
                <Select defaultValue="authentication">
                  <SelectTrigger>
                    <SelectValue placeholder="Select next stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="authentication">Authentication</SelectItem>
                    <SelectItem value="legal_review">Legal Review</SelectItem>
                    <SelectItem value="final_approval">Final Approval</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {actionType === "forward" && (
              <div className="space-y-2">
                <Label htmlFor="assignTo">Assign To</Label>
                <Select defaultValue="ahmed">
                  <SelectTrigger>
                    <SelectValue placeholder="Select person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahmed">Ahmed Hassan</SelectItem>
                    <SelectItem value="fatima">Fatima Omar</SelectItem>
                    <SelectItem value="mohammed">Mohammed Ali</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Input
                id="remarks"
                placeholder="Add your remarks here..."
                value={actionRemarks}
                onChange={(e) => setActionRemarks(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitAction}>
              {actionType === "approve" && "Approve"}
              {actionType === "reject" && "