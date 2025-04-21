"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Search, 
  Filter, 
  Upload,
  FileCheck,
  FileX,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Stamp,
  Send,
  RefreshCw,
  Building2,
  PlusCircle,
  FolderOpen,
  FileUp,
  FileClock,
  FileCheck2,
  FilePlus,
  Globe,
  UserCheck,
  Calendar,
  CircleEllipsis,
  ExternalLink,
  ChevronRight,
  XCircle,
  Info,
  HelpCircle,
  FileSymlink
} from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "missing";
  uploadDate?: string;
  verificationDate?: string;
  remarks?: string;
  fileUrl?: string;
}

interface AuthenticationStep {
  id: string;
  name: string;
  status: "pending" | "completed" | "rejected" | "not_started";
  date?: string;
  remarks?: string;
  documents?: Document[];
}

interface Submission {
  id: string;
  workerName: string;
  workerID: string;
  workerPassport: string;
  workerPhoto?: string;
  destination: string;
  agent: string;
  status: string;
  submissionDate: string;
  documents: {
    passport: boolean;
    nationalId: boolean;
    medical: boolean;
    insurance: boolean;
    contract: boolean;
    coc: boolean;
  };
  documentList: Document[];
  foreignAffairsStatus: "pending" | "authenticated" | "rejected" | "not_submitted";
  molsStatus: "pending" | "approved" | "rejected" | "not_submitted";
  remarks?: string;
  workflow: {
    documentCollection: AuthenticationStep;
    contractAuthentication: AuthenticationStep;
    molsSubmission: AuthenticationStep;
    molsApproval: AuthenticationStep;
  };
  history: {
    date: string;
    status: string;
    user: string;
    remarks?: string;
  }[];
}

const submissions: Submission[] = [
  {
    id: "MOLS-2024-001",
    workerName: "Amina Hassan",
    workerID: "W1001",
    workerPassport: "EP1234567",
    workerPhoto: "/workers/amina.jpg",
    destination: "Saudi Arabia",
    agent: "Al Safwa Manpower",
    status: "Under Authentication",
    submissionDate: "2024-03-15",
    documents: {
      passport: true,
      nationalId: true,
      medical: true,
      insurance: true,
      contract: true,
      coc: true
    },
    documentList: [
      {
        id: "DOC-001",
        name: "Passport",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-12",
        verificationDate: "2024-03-13",
        fileUrl: "/documents/passport-amina.pdf"
      },
      {
        id: "DOC-002",
        name: "National ID",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-12",
        verificationDate: "2024-03-13",
        fileUrl: "/documents/national-id-amina.pdf"
      },
      {
        id: "DOC-003",
        name: "Medical Certificate",
        type: "Health",
        status: "approved",
        uploadDate: "2024-03-10",
        verificationDate: "2024-03-12",
        fileUrl: "/documents/medical-amina.pdf"
      },
      {
        id: "DOC-004",
        name: "Insurance Policy",
        type: "Insurance",
        status: "approved",
        uploadDate: "2024-03-12",
        verificationDate: "2024-03-14",
        fileUrl: "/documents/insurance-amina.pdf"
      },
      {
        id: "DOC-005",
        name: "Signed Contract",
        type: "Legal",
        status: "approved",
        uploadDate: "2024-03-14",
        verificationDate: "2024-03-15",
        fileUrl: "/documents/contract-amina.pdf"
      },
      {
        id: "DOC-006",
        name: "Certificate of Competency",
        type: "Qualification",
        status: "approved",
        uploadDate: "2024-03-13",
        verificationDate: "2024-03-15",
        fileUrl: "/documents/coc-amina.pdf"
      }
    ],
    foreignAffairsStatus: "pending",
    molsStatus: "not_submitted",
    workflow: {
      documentCollection: {
        id: "STEP-1",
        name: "Document Collection",
        status: "completed",
        date: "2024-03-14",
        remarks: "All required documents collected and verified"
      },
      contractAuthentication: {
        id: "STEP-2",
        name: "Contract Authentication",
        status: "pending",
        date: "2024-03-15",
        remarks: "Submitted to Foreign Affairs, awaiting authentication"
      },
      molsSubmission: {
        id: "STEP-3",
        name: "MOLS Submission",
        status: "not_started"
      },
      molsApproval: {
        id: "STEP-4",
        name: "MOLS Approval",
        status: "not_started"
      }
    },
    history: [
      {
        date: "2024-03-15",
        status: "Under Authentication",
        user: "Ahmed Ibrahim",
        remarks: "Submitted to Foreign Affairs for contract authentication"
      },
      {
        date: "2024-03-14",
        status: "Documents Complete",
        user: "Fatima Nur",
        remarks: "All required documents verified and ready for submission"
      },
      {
        date: "2024-03-10",
        status: "In Progress",
        user: "Fatima Nur",
        remarks: "Started document collection process"
      }
    ]
  },
  {
    id: "MOLS-2024-002",
    workerName: "Fatima Omar",
    workerID: "W1002",
    workerPassport: "EP7654321",
    workerPhoto: "/workers/fatima.jpg",
    destination: "Dubai",
    agent: "Dubai Employment Services",
    status: "Ready for MOLS",
    submissionDate: "2024-03-10",
    documents: {
      passport: true,
      nationalId: true,
      medical: true,
      insurance: true,
      contract: true,
      coc: true
    },
    documentList: [
      {
        id: "DOC-007",
        name: "Passport",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-05",
        verificationDate: "2024-03-06",
        fileUrl: "/documents/passport-fatima.pdf"
      },
      {
        id: "DOC-008",
        name: "National ID",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-05",
        verificationDate: "2024-03-06",
        fileUrl: "/documents/national-id-fatima.pdf"
      },
      {
        id: "DOC-009",
        name: "Medical Certificate",
        type: "Health",
        status: "approved",
        uploadDate: "2024-03-07",
        verificationDate: "2024-03-08",
        fileUrl: "/documents/medical-fatima.pdf"
      },
      {
        id: "DOC-010",
        name: "Insurance Policy",
        type: "Insurance",
        status: "approved",
        uploadDate: "2024-03-06",
        verificationDate: "2024-03-07",
        fileUrl: "/documents/insurance-fatima.pdf"
      },
      {
        id: "DOC-011",
        name: "Signed Contract",
        type: "Legal",
        status: "approved",
        uploadDate: "2024-03-08",
        verificationDate: "2024-03-09",
        fileUrl: "/documents/contract-fatima.pdf"
      },
      {
        id: "DOC-012",
        name: "Certificate of Competency",
        type: "Qualification",
        status: "approved",
        uploadDate: "2024-03-07",
        verificationDate: "2024-03-08",
        fileUrl: "/documents/coc-fatima.pdf"
      }
    ],
    foreignAffairsStatus: "authenticated",
    molsStatus: "pending",
    remarks: "Awaiting final approval",
    workflow: {
      documentCollection: {
        id: "STEP-1",
        name: "Document Collection",
        status: "completed",
        date: "2024-03-08",
        remarks: "All required documents collected and verified"
      },
      contractAuthentication: {
        id: "STEP-2",
        name: "Contract Authentication",
        status: "completed",
        date: "2024-03-12",
        remarks: "Contract authenticated by Ethiopian Foreign Affairs"
      },
      molsSubmission: {
        id: "STEP-3",
        name: "MOLS Submission",
        status: "pending",
        date: "2024-03-13",
        remarks: "Submitted to MOLS portal, awaiting approval"
      },
      molsApproval: {
        id: "STEP-4",
        name: "MOLS Approval",
        status: "not_started"
      }
    },
    history: [
      {
        date: "2024-03-13",
        status: "Submitted to MOLS",
        user: "Ahmed Ibrahim",
        remarks: "All authenticated documents submitted to MOLS portal"
      },
      {
        date: "2024-03-12",
        status: "Authenticated",
        user: "Foreign Affairs Office",
        remarks: "Contract authenticated and stamped"
      },
      {
        date: "2024-03-10",
        status: "Sent for Authentication",
        user: "Ahmed Ibrahim",
        remarks: "Documents sent to Foreign Affairs for authentication"
      },
      {
        date: "2024-03-08",
        status: "Documents Complete",
        user: "Fatima Nur",
        remarks: "All required documents verified and ready for submission"
      }
    ]
  },
  {
    id: "MOLS-2024-003",
    workerName: "Sara Ahmed",
    workerID: "W1003",
    workerPassport: "EP8765432",
    destination: "Qatar",
    agent: "Qatar International",
    status: "Documents Incomplete",
    submissionDate: "2024-03-12",
    documents: {
      passport: true,
      nationalId: true,
      medical: false,
      insurance: false,
      contract: true,
      coc: true
    },
    documentList: [
      {
        id: "DOC-013",
        name: "Passport",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-09",
        verificationDate: "2024-03-10",
        fileUrl: "/documents/passport-sara.pdf"
      },
      {
        id: "DOC-014",
        name: "National ID",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-09",
        verificationDate: "2024-03-10",
        fileUrl: "/documents/national-id-sara.pdf"
      },
      {
        id: "DOC-015",
        name: "Medical Certificate",
        type: "Health",
        status: "missing"
      },
      {
        id: "DOC-016",
        name: "Insurance Policy",
        type: "Insurance",
        status: "missing"
      },
      {
        id: "DOC-017",
        name: "Signed Contract",
        type: "Legal",
        status: "approved",
        uploadDate: "2024-03-11",
        verificationDate: "2024-03-12",
        fileUrl: "/documents/contract-sara.pdf"
      },
      {
        id: "DOC-018",
        name: "Certificate of Competency",
        type: "Qualification",
        status: "approved",
        uploadDate: "2024-03-11",
        verificationDate: "2024-03-12",
        fileUrl: "/documents/coc-sara.pdf"
      }
    ],
    foreignAffairsStatus: "pending",
    molsStatus: "not_submitted",
    remarks: "Missing medical certificate and insurance",
    workflow: {
      documentCollection: {
        id: "STEP-1",
        name: "Document Collection",
        status: "pending",
        date: "2024-03-12",
        remarks: "Medical certificate and insurance policy still missing"
      },
      contractAuthentication: {
        id: "STEP-2",
        name: "Contract Authentication",
        status: "not_started"
      },
      molsSubmission: {
        id: "STEP-3",
        name: "MOLS Submission",
        status: "not_started"
      },
      molsApproval: {
        id: "STEP-4",
        name: "MOLS Approval",
        status: "not_started"
      }
    },
    history: [
      {
        date: "2024-03-12",
        status: "Documents Incomplete",
        user: "Fatima Nur",
        remarks: "Missing medical certificate and insurance policy"
      },
      {
        date: "2024-03-09",
        status: "In Progress",
        user: "Fatima Nur",
        remarks: "Started document collection process"
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Under Authentication":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300";
    case "Ready for MOLS":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300";
    case "Documents Incomplete":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300";
    case "Approved":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300";
    case "Completed":
      return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Under Authentication":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Ready for MOLS":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "Documents Incomplete":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case "Approved":
      return <FileCheck className="h-4 w-4 text-blue-500" />;
    case "Completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    default:
      return null;
  }
};

const getWorkflowStepIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "pending":
      return <Clock className="h-5 w-5 text-yellow-500" />;
    case "rejected":
      return <XCircle className="h-5 w-5 text-red-500" />;
    case "not_started":
      return <CircleEllipsis className="h-5 w-5 text-gray-300" />;
    default:
      return <CircleEllipsis className="h-5 w-5 text-gray-300" />;
  }
};

const getDocumentStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800 border-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    case "missing":
      return "bg-gray-100 text-gray-800 border-gray-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getDocumentStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <FileCheck2 className="h-4 w-4 text-green-500" />;
    case "pending":
      return <FileClock className="h-4 w-4 text-yellow-500" />;
    case "rejected":
      return <FileX className="h-4 w-4 text-red-500" />;
    case "missing":
      return <FilePlus className="h-4 w-4 text-gray-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

function BadgeDiv({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className || ''}`}>
      {children}
    </div>
  );
}

export default function MOLSSubmissionPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newSubmissionOpen, setNewSubmissionOpen] = useState(false);

  // Filter submissions based on search and status filter
  const filteredSubmissions = submissions.filter((submission) => {
    const matchesSearch =
      submission.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.workerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.workerPassport.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics for the dashboard
  const totalSubmissions = submissions.length;
  const underAuthentication = submissions.filter(s => s.status === "Under Authentication").length;
  const readyForMOLS = submissions.filter(s => s.status === "Ready for MOLS").length;
  const documentsIncomplete = submissions.filter(s => s.status === "Documents Incomplete").length;
  const approved = submissions.filter(s => s.status === "Approved").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <FileSymlink className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">MOLS Submission System</h1>
              <p className="text-blue-100 text-sm mt-1">Process and track worker documentation for MOLS approval</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20" onClick={() => setUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Documents
            </Button>
            <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => setNewSubmissionOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Submission
            </Button>
          </div>
        </div>
      </div>

      {/* Quick stats dashboard */}
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <CardTitle className="text-sm font-medium text-slate-700">
                Total Submissions
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalSubmissions}</div>
            <p className="text-xs text-slate-500 pt-1">
              +{Math.floor(totalSubmissions * 0.15)} this month
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Stamp className="h-4 w-4 text-yellow-500" />
              <CardTitle className="text-sm font-medium text-yellow-700">
                Under Authentication
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">{underAuthentication}</div>
            <p className="text-xs text-yellow-600 pt-1">
              At Foreign Affairs
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <CardTitle className="text-sm font-medium text-red-700">
                Incomplete Docs
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{documentsIncomplete}</div>
            <p className="text-xs text-red-600 pt-1">
              Requires attention
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-green-500" />
              <CardTitle className="text-sm font-medium text-green-700">
                Ready for MOLS
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{readyForMOLS}</div>
            <p className="text-xs text-green-600 pt-1">
              Authenticated & Ready
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-sm font-medium text-blue-700">
                Approval Rate
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">92%</div>
            <p className="text-xs text-blue-600 pt-1">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="relative w-full md:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, ID, passport..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-44">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Under Authentication">Under Authentication</SelectItem>
              <SelectItem value="Ready for MOLS">Ready for MOLS</SelectItem>
              <SelectItem value="Documents Incomplete">Documents Incomplete</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submissions table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Authentication</TableHead>
                <TableHead>MOLS Status</TableHead>
                <TableHead>Submission Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((submission) => (
                  <TableRow 
                    key={submission.id} 
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <TableCell className="font-medium">{submission.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {submission.workerPhoto ? (
                            <AvatarImage src={submission.workerPhoto} alt={submission.workerName} />
                          ) : (
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {submission.workerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{submission.workerName}</div>
                          <div className="text-xs text-muted-foreground flex gap-2">
                            <span>{submission.workerID}</span>
                            <span>•</span>
                            <span>{submission.workerPassport}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-slate-400" />
                        <span>{submission.destination}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Completion</span>
                          <span>
                            {Object.values(submission.documents).filter(Boolean).length}/6
                          </span>
                        </div>
                        <Progress 
                          value={Object.values(submission.documents).filter(Boolean).length / 6 * 100} 
                          className="h-2" 
                        />
                        <div className="flex gap-1 mt-1">
                          {Object.entries(submission.documents).map(([key, value], index) => (
                            <span 
                              key={index} 
                              className={`h-5 w-1 rounded-full ${value ? 'bg-green-500' : 'bg-gray-300'}`}
                            ></span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {submission.foreignAffairsStatus === "authenticated" ? (
                          <BadgeDiv className="bg-green-100 text-green-800 border-green-300">
                            <Stamp className="mr-1 h-3 w-3" />
                            Authenticated
                          </BadgeDiv>
                        ) : submission.foreignAffairsStatus === "rejected" ? (
                          <BadgeDiv className="bg-red-100 text-red-800 border-red-300">
                            <FileX className="mr-1 h-3 w-3" />
                            Rejected
                          </BadgeDiv>
                        ) : (
                          <BadgeDiv className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </BadgeDiv>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {submission.molsStatus === "approved" ? (
                          <BadgeDiv className="bg-green-100 text-green-800 border-green-300">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Approved
                          </BadgeDiv>
                        ) : submission.molsStatus === "rejected" ? (
                          <BadgeDiv className="bg-red-100 text-red-800 border-red-300">
                            <FileX className="mr-1 h-3 w-3" />
                            Rejected
                          </BadgeDiv>
                        ) : submission.molsStatus === "pending" ? (
                          <BadgeDiv className="bg-yellow-100 text-yellow-800 border-yellow-300">
                            <Clock className="mr-1 h-3 w-3" />
                            Pending
                          </BadgeDiv>
                        ) : (
                          <BadgeDiv className="bg-gray-100 text-gray-800 border-gray-300">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Not Submitted
                          </BadgeDiv>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={(e) => {
                          e.stopPropagation();
                          // Handle status check
                        }}>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Check Status
                        </Button>
                        {submission.foreignAffairsStatus === "authenticated" && 
                         submission.molsStatus === "not_submitted" && (
                          <Button size="sm" onClick={(e) => {
                            e.stopPropagation();
                            // Handle MOLS submission
                          }}>
                            <Send className="mr-2 h-4 w-4" />
                            Submit to MOLS
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileText className="h-8 w-8 mb-2" />
                      <p>No submissions found matching your criteria</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Submission Details Dialog */}
      <Dialog 
        open={!!selectedSubmission} 
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <BadgeDiv className={getStatusColor(selectedSubmission.status)}>
                    {getStatusIcon(selectedSubmission.status)}
                    <span className="ml-1">{selectedSubmission.status}</span>
                  </BadgeDiv>
                  <DialogTitle className="ml-2">{selectedSubmission.workerName} - {selectedSubmission.id}</DialogTitle>
                </div>
                <DialogDescription>
                  MOLS Submission Process for {selectedSubmission.destination}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="summary" className="mt-2" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-50 p-1">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <FileText className="mr-2 h-4 w-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <FolderOpen className="mr-2 h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="workflow" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Workflow
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                    <Clock className="mr-2 h-4 w-4" />
                    History
                  </TabsTrigger>
                </TabsList>
                
                {/* Summary Tab */}
                <TabsContent value="summary" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Worker Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            {selectedSubmission.workerPhoto ? (
                              <AvatarImage src={selectedSubmission.workerPhoto} alt={selectedSubmission.workerName} />
                            ) : (
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {selectedSubmission.workerName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-lg">{selectedSubmission.workerName}</h4>
                            <p className="text-sm text-muted-foreground">{selectedSubmission.workerID}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 text-sm mt-4">
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Passport:</span>
                              <span className="font-medium">{selectedSubmission.workerPassport}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Destination:</span>
                              <span className="font-medium">{selectedSubmission.destination}</span>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Agent:</span>
                              <span className="font-medium">{selectedSubmission.agent}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Submitted:</span>
                              <span className="font-medium">{selectedSubmission.submissionDate}</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Status Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-gray-400" />
                            <span>Document Completion</span>
                          </div>
                          <div className="text-sm font-medium">
                            {Object.values(selectedSubmission.documents).filter(Boolean).length}/6
                          </div>
                        </div>
                        <Progress 
                          value={Object.values(selectedSubmission.documents).filter(Boolean).length / 6 * 100} 
                          className="h-2" 
                        />
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <Stamp className="h-4 w-4 text-gray-400" />
                            <span>Foreign Affairs</span>
                          </div>
                          <BadgeDiv className={
                            selectedSubmission.foreignAffairsStatus === "authenticated" 
                              ? "bg-green-100 text-green-800 border-green-300"
                              : selectedSubmission.foreignAffairsStatus === "rejected"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : "bg-yellow-100 text-yellow-800 border-yellow-300"
                          }>
                            {selectedSubmission.foreignAffairsStatus === "authenticated" 
                              ? "Authenticated" 
                              : selectedSubmission.foreignAffairsStatus === "rejected"
                              ? "Rejected"
                              : "Pending"}
                          </BadgeDiv>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            <span>MOLS Portal</span>
                          </div>
                          <BadgeDiv className={
                            selectedSubmission.molsStatus === "approved" 
                              ? "bg-green-100 text-green-800 border-green-300"
                              : selectedSubmission.molsStatus === "rejected"
                              ? "bg-red-100 text-red-800 border-red-300"
                              : selectedSubmission.molsStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                              : "bg-gray-100 text-gray-800 border-gray-300"
                          }>
                            {selectedSubmission.molsStatus === "approved" 
                              ? "Approved" 
                              : selectedSubmission.molsStatus === "rejected"
                              ? "Rejected"
                              : selectedSubmission.molsStatus === "pending"
                              ? "Pending"
                              : "Not Submitted"}
                          </BadgeDiv>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {selectedSubmission.remarks && (
                      <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Remarks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{selectedSubmission.remarks}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Action Required</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedSubmission.documents &&
                       !Object.values(selectedSubmission.documents).every(Boolean) ? (
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-amber-800">Documents Incomplete</h4>
                              <p className="text-amber-700 mt-1">
                                Please upload the missing documents before proceeding with authentication.
                              </p>
                              <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Missing Documents
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : selectedSubmission.foreignAffairsStatus === "pending" ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-800">Authentication in Progress</h4>
                              <p className="text-blue-700 mt-1">
                                The contract is currently being authenticated by Ethiopian Foreign Affairs.
                                This process typically takes 2-3 business days.
                              </p>
                              <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Check Authentication Status
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : selectedSubmission.foreignAffairsStatus === "authenticated" &&
                         selectedSubmission.molsStatus === "not_submitted" ? (
                        <div className="bg-green-50 border border-green-200 rounded-md p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <Send className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-green-800">Ready for MOLS Submission</h4>
                              <p className="text-green-700 mt-1">
                                All documents have been authenticated. Ready to submit to the MOLS portal for final approval.
                              </p>
                              <Button size="sm" className="mt-2 bg-green-600 hover:bg-green-700">
                                <Send className="mr-2 h-4 w-4" />
                                Submit to MOLS Portal
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : selectedSubmission.molsStatus === "pending" ? (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-md p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <Clock className="h-5 w-5 text-indigo-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-indigo-800">MOLS Review in Progress</h4>
                              <p className="text-indigo-700 mt-1">
                                The submission is currently being reviewed by the Ministry of Labor and Social Affairs.
                                This process typically takes 5-7 business days.
                              </p>
                              <Button size="sm" className="mt-2 bg-indigo-600 hover:bg-indigo-700">
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Check MOLS Status
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : selectedSubmission.molsStatus === "approved" ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-md p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-emerald-800">MOLS Approval Complete</h4>
                              <p className="text-emerald-700 mt-1">
                                The submission has been approved by MOLS. The worker is now cleared for travel.
                              </p>
                              <Button size="sm" className="mt-2 bg-emerald-600 hover:bg-emerald-700">
                                <FileText className="mr-2 h-4 w-4" />
                                Download Approval
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-red-800">Action Required</h4>
                              <p className="text-red-700 mt-1">
                                This submission requires attention. Please review the details and take appropriate action.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Documents Tab */}
                <TabsContent value="documents" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle>Required Documents</CardTitle>
                        <Button size="sm" variant="outline">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload New Document
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedSubmission.documentList.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              {getDocumentStatusIcon(doc.status)}
                              <div>
                                <h4 className="font-medium">{doc.name}</h4>
                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <BadgeDiv className={getDocumentStatusColor(doc.status)}>
                                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                              </BadgeDiv>
                              {doc.fileUrl && (
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                              {doc.status === "missing" && (
                                <Button size="sm">
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Workflow Tab */}
                <TabsContent value="workflow" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>MOLS Submission Workflow</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        {/* Timeline connector line */}
                        <div className="absolute left-[21px] top-6 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                        
                        {/* Step 1: Document Collection */}
                        <div className="flex gap-4 relative z-10 mb-6">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getWorkflowStepIcon(selectedSubmission.workflow.documentCollection.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium text-base">Document Collection</h4>
                            <p className="text-sm text-muted-foreground">
                              Gather and verify all required worker documents
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <BadgeDiv className={
                                selectedSubmission.workflow.documentCollection.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : selectedSubmission.workflow.documentCollection.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : selectedSubmission.workflow.documentCollection.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                              }>
                                {selectedSubmission.workflow.documentCollection.status.charAt(0).toUpperCase() + 
                                selectedSubmission.workflow.documentCollection.status.slice(1)}
                              </BadgeDiv>
                              {selectedSubmission.workflow.documentCollection.date && (
                                <span className="text-xs text-muted-foreground">
                                  {selectedSubmission.workflow.documentCollection.date}
                                </span>
                              )}
                            </div>
                            {selectedSubmission.workflow.documentCollection.remarks && (
                              <p className="text-sm mt-1 text-muted-foreground">
                                {selectedSubmission.workflow.documentCollection.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Step 2: Contract Authentication */}
                        <div className="flex gap-4 relative z-10 mb-6">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getWorkflowStepIcon(selectedSubmission.workflow.contractAuthentication.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium text-base">Contract Authentication</h4>
                            <p className="text-sm text-muted-foreground">
                              Authentication by Ethiopian Foreign Affairs
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <BadgeDiv className={
                                selectedSubmission.workflow.contractAuthentication.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : selectedSubmission.workflow.contractAuthentication.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : selectedSubmission.workflow.contractAuthentication.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                              }>
                                {selectedSubmission.workflow.contractAuthentication.status.charAt(0).toUpperCase() + 
                                selectedSubmission.workflow.contractAuthentication.status.slice(1)}
                              </BadgeDiv>
                              {selectedSubmission.workflow.contractAuthentication.date && (
                                <span className="text-xs text-muted-foreground">
                                  {selectedSubmission.workflow.contractAuthentication.date}
                                </span>
                              )}
                            </div>
                            {selectedSubmission.workflow.contractAuthentication.remarks && (
                              <p className="text-sm mt-1 text-muted-foreground">
                                {selectedSubmission.workflow.contractAuthentication.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Step 3: MOLS Submission */}
                        <div className="flex gap-4 relative z-10 mb-6">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getWorkflowStepIcon(selectedSubmission.workflow.molsSubmission.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium text-base">MOLS Submission</h4>
                            <p className="text-sm text-muted-foreground">
                              Submit authenticated documents through MOLS portal
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <BadgeDiv className={
                                selectedSubmission.workflow.molsSubmission.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : selectedSubmission.workflow.molsSubmission.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : selectedSubmission.workflow.molsSubmission.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                              }>
                                {selectedSubmission.workflow.molsSubmission.status.charAt(0).toUpperCase() + 
                                selectedSubmission.workflow.molsSubmission.status.slice(1)}
                              </BadgeDiv>
                              {selectedSubmission.workflow.molsSubmission.date && (
                                <span className="text-xs text-muted-foreground">
                                  {selectedSubmission.workflow.molsSubmission.date}
                                </span>
                              )}
                            </div>
                            {selectedSubmission.workflow.molsSubmission.remarks && (
                              <p className="text-sm mt-1 text-muted-foreground">
                                {selectedSubmission.workflow.molsSubmission.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Step 4: MOLS Approval */}
                        <div className="flex gap-4 relative z-10">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getWorkflowStepIcon(selectedSubmission.workflow.molsApproval.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium text-base">MOLS Approval</h4>
                            <p className="text-sm text-muted-foreground">
                              Final approval from Ministry of Labor and Social Affairs
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <BadgeDiv className={
                                selectedSubmission.workflow.molsApproval.status === "completed"
                                  ? "bg-green-100 text-green-800 border-green-300"
                                  : selectedSubmission.workflow.molsApproval.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                  : selectedSubmission.workflow.molsApproval.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : "bg-gray-100 text-gray-800 border-gray-300"
                              }>
                                {selectedSubmission.workflow.molsApproval.status.charAt(0).toUpperCase() + 
                                selectedSubmission.workflow.molsApproval.status.slice(1)}
                              </BadgeDiv>
                              {selectedSubmission.workflow.molsApproval.date && (
                                <span className="text-xs text-muted-foreground">
                                  {selectedSubmission.workflow.molsApproval.date}
                                </span>
                              )}
                            </div>
                            {selectedSubmission.workflow.molsApproval.remarks && (
                              <p className="text-sm mt-1 text-muted-foreground">
                                {selectedSubmission.workflow.molsApproval.remarks}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* History Tab */}
                <TabsContent value="history" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Submission History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {selectedSubmission.history.map((event, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="flex-shrink-0 w-12 text-xs text-muted-foreground text-right pt-0.5">
                              {event.date}
                            </div>
                            <div className="relative">
                              <div className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-blue-600"></div>
                              <div className="h-7 w-7 rounded-full border border-blue-100 bg-blue-50"></div>
                              {index !== selectedSubmission.history.length - 1 && (
                                <div className="absolute top-7 bottom-0 left-3.5 w-px bg-gray-200 -mb-6"></div>
                              )}
                            </div>
                            <div className="flex-grow pb-6">
                              <h4 className="font-medium">{event.status}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                {event.remarks}
                              </p>
                              <div className="text-xs text-muted-foreground mt-2">
                                By {event.user}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex justify-between items-center border-t mt-4 pt-4">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  {selectedSubmission.foreignAffairsStatus === "authenticated" && 
                   selectedSubmission.molsStatus === "not_submitted" && (
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Submit to MOLS
                    </Button>
                  )}
                  {selectedSubmission.foreignAffairsStatus === "pending" && (
                    <Button>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check Authentication Status
                    </Button>
                  )}
                  {selectedSubmission.molsStatus === "pending" && (
                    <Button>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check MOLS Status
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}