"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
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
  Search, 
  Filter, 
  FileCheck,
  FileX,
  AlertCircle,
  CheckCircle2,
  FileText,
  RefreshCw,
  PlusCircle,
  Calendar,
  CalendarClock,
  FileWarning,
  Fingerprint,
  ShieldCheck,
  AlertTriangle,
  Scan,
  Download,
  Send,
  ClipboardList,
  Clock,
  Eye,
  CheckCheck,
  ListFilter,
  BookOpen,
  FileQuestion,
  Users,
  BarChart3,
  ChevronRight,
  ChevronDown,
  Building
} from "lucide-react";

interface DocumentVerification {
  id: string;
  workerName: string;
  workerID: string;
  status: "Verified" | "Issues Found" | "Pending" | "In Progress";
  documents: {
    passport: {
      status: "valid" | "expired" | "mismatch" | "missing";
      number?: string;
      issueDate?: string;
      expiryDate?: string;
      issues?: string[];
    };
    nationalId: {
      status: "valid" | "expired" | "mismatch" | "missing";
      number?: string;
      issueDate?: string;
      expiryDate?: string;
      issues?: string[];
    };
    birthCertificate: {
      status: "valid" | "mismatch" | "missing";
      number?: string;
      issues?: string[];
    };
    medicalCertificate: {
      status: "valid" | "expired" | "mismatch" | "missing";
      issueDate?: string;
      expiryDate?: string;
      issues?: string[];
    };
    policeClearance: {
      status: "valid" | "expired" | "mismatch" | "missing";
      issueDate?: string;
      expiryDate?: string;
      issues?: string[];
    };
    educationCertificates: {
      status: "valid" | "mismatch" | "missing";
      verified: boolean;
      issues?: string[];
    };
  };
  verificationDate: string;
  lastCheck: string;
  remarks?: string;
}

const verifications: DocumentVerification[] = [
  {
    id: "VER-2024-001",
    workerName: "Amina Hassan",
    workerID: "W1001",
    status: "Issues Found",
    documents: {
      passport: {
        status: "valid",
        number: "EP1234567",
        issueDate: "2023-01-15",
        expiryDate: "2028-01-14"
      },
      nationalId: {
        status: "mismatch",
        number: "1234567890",
        issues: ["Name spelling differs from passport"]
      },
      birthCertificate: {
        status: "valid",
        number: "BC123456"
      },
      medicalCertificate: {
        status: "expired",
        issueDate: "2023-03-15",
        expiryDate: "2024-03-14",
        issues: ["Certificate expired"]
      },
      policeClearance: {
        status: "valid",
        issueDate: "2024-01-15",
        expiryDate: "2024-07-14"
      },
      educationCertificates: {
        status: "valid",
        verified: true
      }
    },
    verificationDate: "2024-03-15",
    lastCheck: "2024-03-15",
    remarks: "Name mismatch needs correction, medical certificate renewal required"
  },
  {
    id: "VER-2024-002",
    workerName: "Fatima Omar",
    workerID: "W1002",
    status: "Verified",
    documents: {
      passport: {
        status: "valid",
        number: "EP7654321",
        issueDate: "2023-06-20",
        expiryDate: "2028-06-19"
      },
      nationalId: {
        status: "valid",
        number: "9876543210"
      },
      birthCertificate: {
        status: "valid",
        number: "BC654321"
      },
      medicalCertificate: {
        status: "valid",
        issueDate: "2024-02-15",
        expiryDate: "2024-08-14"
      },
      policeClearance: {
        status: "valid",
        issueDate: "2024-02-01",
        expiryDate: "2024-08-01"
      },
      educationCertificates: {
        status: "valid",
        verified: true
      }
    },
    verificationDate: "2024-03-10",
    lastCheck: "2024-03-14"
  },
  {
    id: "VER-2024-003",
    workerName: "Sara Ahmed",
    workerID: "W1003",
    status: "In Progress",
    documents: {
      passport: {
        status: "valid",
        number: "EP8765432",
        issueDate: "2023-08-10",
        expiryDate: "2028-08-09"
      },
      nationalId: {
        status: "valid",
        number: "5432109876"
      },
      birthCertificate: {
        status: "missing"
      },
      medicalCertificate: {
        status: "valid",
        issueDate: "2024-02-20",
        expiryDate: "2024-08-19"
      },
      policeClearance: {
        status: "pending",
        issueDate: "2024-03-01",
        expiryDate: "2024-09-01"
      },
      educationCertificates: {
        status: "mismatch",
        verified: false,
        issues: ["Certificate authentication pending"]
      }
    },
    verificationDate: "2024-03-12",
    lastCheck: "2024-03-15",
    remarks: "Awaiting birth certificate and education verification"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Verified":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Issues Found":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getDocumentStatusIcon = (status: string) => {
  switch (status) {
    case "valid":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "expired":
      return <CalendarClock className="h-4 w-4 text-red-500" />;
    case "mismatch":
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case "missing":
      return <FileX className="h-4 w-4 text-red-500" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-500" />;
  }
};

const getDocumentStatusColor = (status: string) => {
  switch (status) {
    case "valid":
      return "bg-green-100 text-green-800";
    case "expired":
      return "bg-red-100 text-red-800";
    case "mismatch":
      return "bg-yellow-100 text-yellow-800";
    case "missing":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Custom StatusBadge to replace Badge component
function StatusBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className || ''}`}>
      {children}
    </div>
  );
}

const DocumentVerificationTable = ({ 
  verifications, 
  onSelectVerification 
}: { 
  verifications: DocumentVerification[],
  onSelectVerification: (verification: DocumentVerification) => void
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Worker</TableHead>
              <TableHead>Document Status</TableHead>
              <TableHead>Issues</TableHead>
              <TableHead>Last Check</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <FileQuestion className="h-8 w-8 mb-2" />
                    <p>No document verifications found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              verifications.map((verification) => {
                const validDocuments = Object.values(verification.documents).filter(doc => doc.status === "valid").length;
                const totalDocuments = Object.keys(verification.documents).length;
                const percentValid = (validDocuments / totalDocuments) * 100;
                
                return (
                  <TableRow key={verification.id} className="group">
                    <TableCell className="font-medium">{verification.id}</TableCell>
                    <TableCell>
                      <div>
                        <div>{verification.workerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {verification.workerID}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Valid Documents</span>
                          <span>
                            {validDocuments}/{totalDocuments}
                          </span>
                        </div>
                        <Progress 
                          value={percentValid} 
                          className={`h-2 ${percentValid < 70 ? 'bg-yellow-100' : 'bg-green-100'}`}
                        />
                        <div className="flex gap-1 mt-1">
                          {Object.entries(verification.documents).map(([key, doc]) => (
                            <div key={key} className="relative group/tooltip">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                doc.status === "valid" ? "bg-green-100" : 
                                doc.status === "expired" ? "bg-red-100" : 
                                doc.status === "mismatch" ? "bg-yellow-100" : 
                                "bg-gray-100"
                              }`}>
                                {getDocumentStatusIcon(doc.status)}
                              </div>
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                                {key.replace(/([A-Z])/g, ' $1').trim()}: {doc.status}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {Object.entries(verification.documents)
                        .filter(([_, doc]) => doc.issues && doc.issues.length > 0)
                        .map(([key, doc]) => (
                          <div key={key} className="text-xs text-red-600 flex items-start gap-1">
                            <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                            <span>{key.replace(/([A-Z])/g, ' $1').trim()}: {doc.issues![0]}</span>
                          </div>
                        ))}
                      {!Object.values(verification.documents).some(doc => doc.issues && doc.issues.length > 0) && (
                        <span className="text-xs text-muted-foreground">No issues found</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                        {verification.lastCheck}
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge className={getStatusColor(verification.status)}>
                        {verification.status}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="outline" size="sm">
                          <Scan className="mr-2 h-4 w-4" />
                          Re-verify
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => onSelectVerification(verification)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default function CrossMatchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVerification, setSelectedVerification] = useState<DocumentVerification | null>(null);
  const [showNewVerificationDialog, setShowNewVerificationDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const filteredVerifications = verifications.filter((verification) => {
    const matchesSearch =
      verification.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      verification.workerID.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || verification.status === statusFilter;
    const matchesTab = activeTab === "all" || 
      (activeTab === "verified" && verification.status === "Verified") ||
      (activeTab === "issues" && verification.status === "Issues Found") ||
      (activeTab === "pending" && (verification.status === "Pending" || verification.status === "In Progress"));
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Calculate document stats
  const totalVerifications = verifications.length;
  const verified = verifications.filter(v => v.status === "Verified").length;
  const issuesFound = verifications.filter(v => v.status === "Issues Found").length;
  const inProgress = verifications.filter(v => v.status === "In Progress").length;
  const pendingCount = verifications.filter(v => v.status === "Pending").length;
  const verifiedPercentage = Math.round((verified / totalVerifications) * 100);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Document Cross-Match</h1>
            <p className="text-sm text-blue-100 mt-1">Verify and validate worker documents against official records</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button variant="secondary" onClick={() => setShowNewVerificationDialog(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Verification
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <ClipboardList className="mr-2 h-4 w-4 text-slate-500" />
              Total Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVerifications}</div>
            <p className="text-xs text-muted-foreground pt-1">
              +45 this month
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-green-800">
              <CheckCheck className="mr-2 h-4 w-4 text-green-600" />
              Verified Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{verified}</div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-muted-foreground">Verification rate</p>
              <span className="text-xs font-medium text-green-800">{verifiedPercentage}%</span>
            </div>
            <Progress value={verifiedPercentage} className="h-1.5 mt-1" />
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-red-800">
              <AlertTriangle className="mr-2 h-4 w-4 text-red-600" />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{issuesFound}</div>
            <div className="flex gap-2 mt-1">
              <Badge variant="outline" className="text-xs border-red-200 text-red-700 bg-red-50 font-normal">
                {Math.round((issuesFound / totalVerifications) * 100)}% of documents
              </Badge>
              <Badge variant="outline" className="text-xs border-red-200 text-red-700 bg-red-50 font-normal">
                Requires action
              </Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center text-blue-800">
              <Clock className="mr-2 h-4 w-4 text-blue-600" />
              In Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgress + pendingCount}</div>
            <div className="grid grid-cols-2 gap-1 mt-2">
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 rounded-full bg-blue-400 mr-1"></div>
                <span className="text-muted-foreground">Verifying: {inProgress}</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mr-1"></div>
                <span className="text-muted-foreground">Pending: {pendingCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
          <TabsList className="grid grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all" className="flex items-center">
              <ListFilter className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">All Documents</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="verified" className="flex items-center">
              <CheckCheck className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Verified</span>
              <span className="sm:hidden">Valid</span>
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Issues Found</span>
              <span className="sm:hidden">Issues</span>
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center">
              <Clock className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">In Progress</span>
              <span className="sm:hidden">Pending</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search worker or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 sm:w-44">
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Issues Found">Issues Found</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="m-0">
          <DocumentVerificationTable 
            verifications={filteredVerifications} 
            onSelectVerification={setSelectedVerification} 
          />
        </TabsContent>
        <TabsContent value="verified" className="m-0">
          <DocumentVerificationTable 
            verifications={filteredVerifications} 
            onSelectVerification={setSelectedVerification} 
          />
        </TabsContent>
        <TabsContent value="issues" className="m-0">
          <DocumentVerificationTable 
            verifications={filteredVerifications} 
            onSelectVerification={setSelectedVerification} 
          />
        </TabsContent>
        <TabsContent value="pending" className="m-0">
          <DocumentVerificationTable 
            verifications={filteredVerifications} 
            onSelectVerification={setSelectedVerification} 
          />
        </TabsContent>
      </Tabs>
      
      <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <ClipboardList className="mr-2 h-5 w-5 text-blue-600" />
              Document Verification Details
              {selectedVerification?.status && (
                <Badge className={`ml-2 ${getStatusColor(selectedVerification.status)}`}>
                  {selectedVerification.status}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              {selectedVerification?.workerName} ({selectedVerification?.workerID})
              <span className="mx-2">•</span>
              <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
              Last verified: {selectedVerification?.lastCheck}
            </DialogDescription>
          </DialogHeader>
          
          {selectedVerification && (
            <div className="space-y-6">
              <Tabs defaultValue="documents">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="documents" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    Verification History
                  </TabsTrigger>
                  <TabsTrigger value="actions" className="flex items-center">
                    <FileWarning className="mr-2 h-4 w-4" />
                    Required Actions
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="documents" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(selectedVerification.documents).map(([key, doc]) => (
                      <Card key={key} className={`overflow-hidden border-t-4 ${
                        doc.status === "valid" ? "border-t-green-500" : 
                        doc.status === "expired" ? "border-t-red-500" : 
                        doc.status === "mismatch" ? "border-t-yellow-500" : 
                        "border-t-gray-500"
                      }`}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center">
                            {key === "passport" ? <Fingerprint className="mr-2 h-4 w-4" /> :
                             key === "nationalId" ? <ShieldCheck className="mr-2 h-4 w-4" /> :
                             key === "birthCertificate" ? <FileCheck className="mr-2 h-4 w-4" /> :
                             key === "medicalCertificate" ? <FileText className="mr-2 h-4 w-4" /> :
                             key === "policeClearance" ? <FileWarning className="mr-2 h-4 w-4" /> :
                             key === "educationCertificates" ? <BookOpen className="mr-2 h-4 w-4" /> :
                             <FileText className="mr-2 h-4 w-4" />}
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </CardTitle>
                          <Badge className={`mt-1 ${getDocumentStatusColor(doc.status)}`}>
                            {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                          </Badge>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          {doc.number && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Number:</span>
                              <span className="font-mono">{doc.number}</span>
                            </div>
                          )}
                          {doc.issueDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Issue Date:</span>
                              <span>{doc.issueDate}</span>
                            </div>
                          )}
                          {doc.expiryDate && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Expiry Date:</span>
                              <span className={
                                new Date(doc.expiryDate) < new Date() ? "text-red-600 font-medium" : ""
                              }>{doc.expiryDate}</span>
                            </div>
                          )}
                          {doc.issues && doc.issues.length > 0 && (
                            <div className="mt-2 border-t pt-2">
                              <span className="text-muted-foreground">Issues:</span>
                              <ul className="mt-1 space-y-1">
                                {doc.issues.map((issue, index) => (
                                  <li key={index} className="text-xs text-red-600 flex gap-1">
                                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                                    <span>{issue}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="mt-3 pt-2 border-t flex justify-end">
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                              <Eye className="mr-1.5 h-3.5 w-3.5" />
                              View Document
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  {selectedVerification.remarks && (
                    <Card className="mt-4">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Remarks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm bg-gray-50 p-3 rounded border">
                          {selectedVerification.remarks}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
                
                <TabsContent value="history" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Verification Timeline</CardTitle>
                      <CardDescription>History of document verification activities</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Scan className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Initial Verification</span>
                              <Badge variant="outline" className="text-xs">Completed</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              All documents submitted and initially verified
                            </p>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {selectedVerification.verificationDate}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Issues Identified</span>
                              {selectedVerification.status === "Issues Found" && (
                                <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Pending Resolution</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {Object.entries(selectedVerification.documents)
                                .filter(([_, doc]) => doc.issues && doc.issues.length > 0)
                                .map(([key]) => key.replace(/([A-Z])/g, ' $1').trim())
                                .join(", ") || "No issues found"}
                            </p>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {selectedVerification.lastCheck}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0">
                            <RefreshCw className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">Latest Verification</span>
                              <Badge variant="outline" className="text-xs">{selectedVerification.status}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Documents cross-checked with government records
                            </p>
                            <div className="text-xs text-muted-foreground mt-1 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {selectedVerification.lastCheck}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="actions" className="pt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">Required Actions</CardTitle>
                      <CardDescription>Steps needed to resolve document issues</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {Object.entries(selectedVerification.documents)
                        .filter(([_, doc]) => doc.status !== "valid")
                        .length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-6 text-center">
                          <CheckCheck className="h-12 w-12 text-green-500 mb-3" />
                          <h3 className="font-medium text-lg">All Documents Valid</h3>
                          <p className="text-sm text-muted-foreground mt-1 max-w-md">
                            No actions required. All documents have been verified successfully.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {Object.entries(selectedVerification.documents)
                            .filter(([_, doc]) => doc.status !== "valid")
                            .map(([key, doc], index) => (
                              <div key={key} className="flex gap-3 items-start">
                                <div className="h-6 w-6 flex-shrink-0 flex items-center justify-center rounded-full bg-amber-100 text-amber-700">
                                  {index + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {key.replace(/([A-Z])/g, ' $1').trim()} - {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {doc.status === "expired" && "Document has expired and needs renewal."}
                                    {doc.status === "mismatch" && "Information doesn't match with other documents."}
                                    {doc.status === "missing" && "Document is missing and needs to be submitted."}
                                  </p>
                                  {doc.issues && doc.issues.length > 0 && (
                                    <div className="mt-1 text-xs text-red-600">
                                      {doc.issues[0]}
                                    </div>
                                  )}
                                </div>
                                <Button size="sm" variant="outline">
                                  Resolve
                                </Button>
                              </div>
                            ))
                          }
                          
                          <div className="border-t pt-4 mt-6">
                            <Button className="w-full">
                              <Send className="mr-2 h-4 w-4" />
                              Send Resolution Instructions to Worker
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedVerification(null)}>
                  Close
                </Button>
                <Button>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Re-verify Documents
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showNewVerificationDialog} onOpenChange={setShowNewVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <PlusCircle className="mr-2 h-5 w-5" />
              New Document Verification
            </DialogTitle>
            <DialogDescription>
              Start a new document verification process
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="worker">Select Worker</Label>
              <Select>
                <SelectTrigger id="worker">
                  <SelectValue placeholder="Select a worker" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="w1001">Amina Hassan (W1001)</SelectItem>
                  <SelectItem value="w1002">Fatima Omar (W1002)</SelectItem>
                  <SelectItem value="w1003">Sara Ahmed (W1003)</SelectItem>
                  <SelectItem value="w1004">Mohammed Ali (W1004)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Required Documents</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="flex items-center p-2 border rounded-md">
                  <input type="checkbox" id="doc-passport" className="mr-2" checked readOnly />
                  <Label htmlFor="doc-passport" className="text-sm cursor-pointer">Passport</Label>
                </div>
                <div className="flex items-center p-2 border rounded-md">
                  <input type="checkbox" id="doc-national-id" className="mr-2" checked readOnly />
                  <Label htmlFor="doc-national-id" className="text-sm cursor-pointer">National ID</Label>
                </div>
                <div className="flex items-center p-2 border rounded-md">
                  <input type="checkbox" id="doc-birth" className="mr-2" checked readOnly />
                  <Label htmlFor="doc-birth" className="text-sm cursor-pointer">Birth Certificate</Label>
                </div>
                <div className="flex items-center p-2 border rounded-md">
                  <input type="checkbox" id="doc-medical" className="mr-2" checked readOnly />
                  <Label htmlFor="doc-medical" className="text-sm cursor-pointer">Medical Certificate</Label>
                </div>
                <div className="flex items-center p-2 border rounded-md">
                  <input type="checkbox" id="doc-police" className="mr-2" checked readOnly />
                  <Label htmlFor="doc-police" className="text-sm cursor-pointer">Police Clearance</Label>
                </div>
                <div className="flex items-center p-2 border rounded-md">
                  <input type="checkbox" id="doc-education" className="mr-2" checked readOnly />
                  <Label htmlFor="doc-education" className="text-sm cursor-pointer">Education Certificates</Label>
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="verification-notes">Verification Notes</Label>
              <Input id="verification-notes" placeholder="Add any special instructions or notes" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewVerificationDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewVerificationDialog(false)}>
              <Scan className="mr-2 h-4 w-4" />
              Start Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}