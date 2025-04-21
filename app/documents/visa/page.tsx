"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar,
  Send,
  RefreshCw,
  Building2,
  PlusCircle,
  Stamp,
  Bell,
  CalendarClock,
  FileWarning,
  Globe,
  UserCheck,
  Plane,
  ExternalLink,
  Eye,
  Archive,
  Download,
  Printer,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CircleClock,
  CircleHelp,
  Pencil,
  FileQuestion,
  CalendarDays,
  CreditCard,
  Users,
  ClipboardCheck,
  MoreHorizontal,
  AlertTriangle,
  Trash,
  CalendarPlus,
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
  status: "approved" | "pending" | "rejected" | "missing";
  uploadDate?: string;
  verificationDate?: string;
  remarks?: string;
  fileUrl?: string;
}

interface Interview {
  id: string;
  scheduled: boolean;
  date?: string;
  time?: string;
  status?: "Scheduled" | "Completed" | "Missed" | "Rescheduled";
  location?: string;
  interviewer?: string;
  feedback?: string;
  notes?: string;
}

interface VisaStage {
  id: string;
  name: string;
  status: "completed" | "in_progress" | "pending" | "rejected";
  startDate?: string;
  endDate?: string;
  remarks?: string;
}

interface VisaApplication {
  id: string;
  workerName: string;
  workerID: string;
  workerPassport: string;
  workerPhoto?: string;
  destination: string;
  embassy: string;
  status: "Under Review" | "Approved" | "Rejected" | "Pending" | "Processing" | "Interview" | "Expired";
  submissionDate: string;
  documents: {
    passport: boolean;
    photo: boolean;
    medical: boolean;
    insurance: boolean;
    coc: boolean;
    contract: boolean;
  };
  documentList: Document[];
  expiryDate?: string;
  issueDate?: string;
  visaNumber?: string;
  visaType?: "Work" | "Tourist" | "Business" | "Family";
  duration?: string;
  remarks?: string;
  interview?: Interview;
  molsApproval: boolean;
  foreignAffairsApproval: boolean;
  fees?: {
    amount: number;
    currency: string;
    paid: boolean;
    paymentDate?: string;
    paymentMethod?: string;
    receiptNumber?: string;
  };
  stages: {
    application: VisaStage;
    documentation: VisaStage;
    embassy: VisaStage;
    interview: VisaStage;
    decision: VisaStage;
  };
  history: {
    date: string;
    action: string;
    user: string;
    remarks?: string;
  }[];
}

const visaApplications: VisaApplication[] = [
  {
    id: "VISA-2024-001",
    workerName: "Amina Hassan",
    workerID: "W1001",
    workerPassport: "EP1234567",
    workerPhoto: "/workers/amina.jpg",
    destination: "Saudi Arabia",
    embassy: "Royal Embassy of Saudi Arabia",
    status: "Under Review",
    submissionDate: "2024-03-15",
    documents: {
      passport: true,
      photo: true,
      medical: true,
      insurance: true,
      coc: true,
      contract: true
    },
    documentList: [
      {
        id: "VDOC-001",
        name: "Passport",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-12",
        verificationDate: "2024-03-13",
        fileUrl: "/documents/passport-amina.pdf"
      },
      {
        id: "VDOC-002",
        name: "Photographs",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-12",
        verificationDate: "2024-03-13",
        fileUrl: "/documents/photos-amina.jpg"
      },
      {
        id: "VDOC-003",
        name: "Medical Certificate",
        type: "Health",
        status: "approved",
        uploadDate: "2024-03-10",
        verificationDate: "2024-03-12",
        fileUrl: "/documents/medical-amina.pdf"
      },
      {
        id: "VDOC-004",
        name: "Insurance Policy",
        type: "Insurance",
        status: "approved",
        uploadDate: "2024-03-12",
        verificationDate: "2024-03-14",
        fileUrl: "/documents/insurance-amina.pdf"
      },
      {
        id: "VDOC-005",
        name: "Certificate of Competency",
        type: "Qualification",
        status: "approved",
        uploadDate: "2024-03-13",
        verificationDate: "2024-03-14",
        fileUrl: "/documents/coc-amina.pdf"
      },
      {
        id: "VDOC-006",
        name: "Employment Contract",
        type: "Legal",
        status: "approved",
        uploadDate: "2024-03-11",
        verificationDate: "2024-03-14",
        fileUrl: "/documents/contract-amina.pdf"
      }
    ],
    interview: {
      id: "INT-001",
      scheduled: true,
      date: "2024-03-20",
      time: "10:00 AM",
      status: "Scheduled",
      location: "Saudi Embassy, Addis Ababa",
      interviewer: "Embassy Officer",
      notes: "Bring original documents and arrive 30 minutes early"
    },
    molsApproval: true,
    foreignAffairsApproval: true,
    visaType: "Work",
    duration: "2 years",
    fees: {
      amount: 2000,
      currency: "SAR",
      paid: true,
      paymentDate: "2024-03-14",
      paymentMethod: "Bank Transfer",
      receiptNumber: "RCP-2024-0032"
    },
    stages: {
      application: {
        id: "STG-A001",
        name: "Application Submission",
        status: "completed",
        startDate: "2024-03-10",
        endDate: "2024-03-11",
        remarks: "Application submitted successfully"
      },
      documentation: {
        id: "STG-A002",
        name: "Document Verification",
        status: "completed",
        startDate: "2024-03-11",
        endDate: "2024-03-14",
        remarks: "All documents verified and approved"
      },
      embassy: {
        id: "STG-A003",
        name: "Embassy Processing",
        status: "in_progress",
        startDate: "2024-03-15",
        remarks: "Application under review by the embassy"
      },
      interview: {
        id: "STG-A004",
        name: "Interview Process",
        status: "pending",
        remarks: "Interview scheduled for 2024-03-20"
      },
      decision: {
        id: "STG-A005",
        name: "Final Decision",
        status: "pending",
        remarks: "Pending embassy review and interview"
      }
    },
    history: [
      {
        date: "2024-03-15",
        action: "Application Submitted to Embassy",
        user: "Ahmed Ibrahim",
        remarks: "All documents submitted for embassy review"
      },
      {
        date: "2024-03-14",
        action: "Documents Verified",
        user: "Fatima Nur",
        remarks: "All required documents verified and approved"
      },
      {
        date: "2024-03-12",
        action: "Interview Scheduled",
        user: "Fatima Nur",
        remarks: "Embassy interview scheduled for March 20"
      },
      {
        date: "2024-03-10",
        action: "Application Started",
        user: "Fatima Nur",
        remarks: "Visa application process initiated"
      }
    ]
  },
  {
    id: "VISA-2024-002",
    workerName: "Fatima Omar",
    workerID: "W1002",
    workerPassport: "EP7654321",
    workerPhoto: "/workers/fatima.jpg",
    destination: "Dubai",
    embassy: "UAE Embassy",
    status: "Approved",
    submissionDate: "2024-03-01",
    issueDate: "2024-03-10",
    expiryDate: "2026-03-10",
    visaNumber: "UAE-2024-87645",
    documents: {
      passport: true,
      photo: true,
      medical: true,
      insurance: true,
      coc: true,
      contract: true
    },
    documentList: [
      {
        id: "VDOC-007",
        name: "Passport",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-02-28",
        verificationDate: "2024-03-01",
        fileUrl: "/documents/passport-fatima.pdf"
      },
      {
        id: "VDOC-008",
        name: "Photographs",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-02-28",
        verificationDate: "2024-03-01",
        fileUrl: "/documents/photos-fatima.jpg"
      },
      {
        id: "VDOC-009",
        name: "Medical Certificate",
        type: "Health",
        status: "approved",
        uploadDate: "2024-02-25",
        verificationDate: "2024-03-01",
        fileUrl: "/documents/medical-fatima.pdf"
      },
      {
        id: "VDOC-010",
        name: "Insurance Policy",
        type: "Insurance",
        status: "approved",
        uploadDate: "2024-02-27",
        verificationDate: "2024-03-01",
        fileUrl: "/documents/insurance-fatima.pdf"
      },
      {
        id: "VDOC-011",
        name: "Certificate of Competency",
        type: "Qualification",
        status: "approved",
        uploadDate: "2024-02-26",
        verificationDate: "2024-03-01",
        fileUrl: "/documents/coc-fatima.pdf"
      },
      {
        id: "VDOC-012",
        name: "Employment Contract",
        type: "Legal",
        status: "approved",
        uploadDate: "2024-02-26",
        verificationDate: "2024-03-01",
        fileUrl: "/documents/contract-fatima.pdf"
      }
    ],
    interview: {
      id: "INT-002",
      scheduled: true,
      date: "2024-03-05",
      time: "11:30 AM",
      status: "Completed",
      location: "UAE Embassy, Addis Ababa",
      interviewer: "Consular Officer",
      feedback: "Interview completed successfully. Candidate demonstrated good communication skills and understanding of job requirements."
    },
    visaType: "Work",
    duration: "2 years",
    molsApproval: true,
    foreignAffairsApproval: true,
    fees: {
      amount: 1500,
      currency: "AED",
      paid: true,
      paymentDate: "2024-03-02",
      paymentMethod: "Credit Card",
      receiptNumber: "RCP-2024-0018"
    },
    stages: {
      application: {
        id: "STG-B001",
        name: "Application Submission",
        status: "completed",
        startDate: "2024-02-25",
        endDate: "2024-03-01",
        remarks: "Application submitted successfully"
      },
      documentation: {
        id: "STG-B002",
        name: "Document Verification",
        status: "completed",
        startDate: "2024-03-01",
        endDate: "2024-03-02",
        remarks: "All documents verified and approved"
      },
      embassy: {
        id: "STG-B003",
        name: "Embassy Processing",
        status: "completed",
        startDate: "2024-03-02",
        endDate: "2024-03-08",
        remarks: "Embassy processed the application"
      },
      interview: {
        id: "STG-B004",
        name: "Interview Process",
        status: "completed",
        startDate: "2024-03-05",
        endDate: "2024-03-05",
        remarks: "Interview completed successfully"
      },
      decision: {
        id: "STG-B005",
        name: "Final Decision",
        status: "completed",
        startDate: "2024-03-08",
        endDate: "2024-03-10",
        remarks: "Visa approved and issued"
      }
    },
    history: [
      {
        date: "2024-03-10",
        action: "Visa Issued",
        user: "UAE Embassy",
        remarks: "Visa approved and issued"
      },
      {
        date: "2024-03-05",
        action: "Interview Completed",
        user: "Consular Officer",
        remarks: "Applicant passed the interview"
      },
      {
        date: "2024-03-02",
        action: "Application Processed",
        user: "Ahmed Ibrahim",
        remarks: "All documents verified and submitted to embassy"
      },
      {
        date: "2024-03-01",
        action: "Application Submitted",
        user: "Fatima Nur",
        remarks: "Visa application initiated and submitted"
      }
    ]
  },
  {
    id: "VISA-2024-003",
    workerName: "Sara Ahmed",
    workerID: "W1003",
    workerPassport: "EP8765432",
    destination: "Qatar",
    embassy: "Embassy of Qatar",
    status: "Pending",
    submissionDate: "2024-03-12",
    documents: {
      passport: true,
      photo: true,
      medical: false,
      insurance: false,
      coc: true,
      contract: true
    },
    documentList: [
      {
        id: "VDOC-013",
        name: "Passport",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-10",
        verificationDate: "2024-03-11",
        fileUrl: "/documents/passport-sara.pdf"
      },
      {
        id: "VDOC-014",
        name: "Photographs",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-10",
        verificationDate: "2024-03-11",
        fileUrl: "/documents/photos-sara.jpg"
      },
      {
        id: "VDOC-015",
        name: "Medical Certificate",
        type: "Health",
        status: "missing"
      },
      {
        id: "VDOC-016",
        name: "Insurance Policy",
        type: "Insurance",
        status: "missing"
      },
      {
        id: "VDOC-017",
        name: "Certificate of Competency",
        type: "Qualification",
        status: "approved",
        uploadDate: "2024-03-09",
        verificationDate: "2024-03-11",
        fileUrl: "/documents/coc-sara.pdf"
      },
      {
        id: "VDOC-018",
        name: "Employment Contract",
        type: "Legal",
        status: "approved",
        uploadDate: "2024-03-09",
        verificationDate: "2024-03-11",
        fileUrl: "/documents/contract-sara.pdf"
      }
    ],
    interview: {
      id: "INT-003",
      scheduled: false
    },
    remarks: "Missing medical certificate and insurance",
    visaType: "Work",
    duration: "1 year",
    molsApproval: false,
    foreignAffairsApproval: true,
    fees: {
      amount: 1800,
      currency: "QAR",
      paid: false
    },
    stages: {
      application: {
        id: "STG-C001",
        name: "Application Submission",
        status: "completed",
        startDate: "2024-03-09",
        endDate: "2024-03-12",
        remarks: "Application submitted with incomplete documents"
      },
      documentation: {
        id: "STG-C002",
        name: "Document Verification",
        status: "in_progress",
        startDate: "2024-03-12",
        remarks: "Missing medical certificate and insurance policy"
      },
      embassy: {
        id: "STG-C003",
        name: "Embassy Processing",
        status: "pending",
        remarks: "Pending document completion"
      },
      interview: {
        id: "STG-C004",
        name: "Interview Process",
        status: "pending",
        remarks: "Not yet scheduled"
      },
      decision: {
        id: "STG-C005",
        name: "Final Decision",
        status: "pending",
        remarks: "Pending document completion and interview"
      }
    },
    history: [
      {
        date: "2024-03-12",
        action: "Application Paused",
        user: "Ahmed Ibrahim",
        remarks: "Application process paused due to missing documents"
      },
      {
        date: "2024-03-11",
        action: "Documents Partially Verified",
        user: "Fatima Nur",
        remarks: "Some documents verified, others missing"
      },
      {
        date: "2024-03-09",
        action: "Application Started",
        user: "Fatima Nur",
        remarks: "Visa application process initiated"
      }
    ]
  },
  {
    id: "VISA-2024-004",
    workerName: "Mohammed Ali",
    workerID: "W1004",
    workerPassport: "EP9876543",
    workerPhoto: "/workers/mohammed.jpg",
    destination: "Kuwait",
    embassy: "Kuwait Embassy",
    status: "Processing",
    submissionDate: "2024-03-08",
    documents: {
      passport: true,
      photo: true,
      medical: true,
      insurance: true,
      coc: true,
      contract: true
    },
    documentList: [
      {
        id: "VDOC-019",
        name: "Passport",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-05",
        verificationDate: "2024-03-07",
        fileUrl: "/documents/passport-mohammed.pdf"
      },
      {
        id: "VDOC-020",
        name: "Photographs",
        type: "Identity",
        status: "approved",
        uploadDate: "2024-03-05",
        verificationDate: "2024-03-07",
        fileUrl: "/documents/photos-mohammed.jpg"
      },
      {
        id: "VDOC-021",
        name: "Medical Certificate",
        type: "Health",
        status: "approved",
        uploadDate: "2024-03-04",
        verificationDate: "2024-03-07",
        fileUrl: "/documents/medical-mohammed.pdf"
      },
      {
        id: "VDOC-022",
        name: "Insurance Policy",
        type: "Insurance",
        status: "approved",
        uploadDate: "2024-03-06",
        verificationDate: "2024-03-07",
        fileUrl: "/documents/insurance-mohammed.pdf"
      },
      {
        id: "VDOC-023",
        name: "Certificate of Competency",
        type: "Qualification",
        status: "approved",
        uploadDate: "2024-03-05",
        verificationDate: "2024-03-07",
        fileUrl: "/documents/coc-mohammed.pdf"
      },
      {
        id: "VDOC-024",
        name: "Employment Contract",
        type: "Legal",
        status: "approved",
        uploadDate: "2024-03-05",
        verificationDate: "2024-03-07",
        fileUrl: "/documents/contract-mohammed.pdf"
      }
    ],
    interview: {
      id: "INT-004",
      scheduled: true,
      date: "2024-03-25",
      time: "10:30 AM",
      status: "Scheduled",
      location: "Kuwait Embassy, Addis Ababa",
      interviewer: "Embassy Official"
    },
    visaType: "Work",
    duration: "2 years",
    molsApproval: true,
    foreignAffairsApproval: true,
    fees: {
      amount: 1700,
      currency: "KWD",
      paid: true,
      paymentDate: "2024-03-07",
      paymentMethod: "Bank Transfer",
      receiptNumber: "RCP-2024-0025"
    },
    stages: {
      application: {
        id: "STG-D001",
        name: "Application Submission",
        status: "completed",
        startDate: "2024-03-04",
        endDate: "2024-03-08",
        remarks: "Application submitted successfully"
      },
      documentation: {
        id: "STG-D002",
        name: "Document Verification",
        status: "completed",
        startDate: "2024-03-07",
        endDate: "2024-03-08",
        remarks: "All documents verified and approved"
      },
      embassy: {
        id: "STG-D003",
        name: "Embassy Processing",
        status: "in_progress",
        startDate: "2024-03-10",
        remarks: "Application being processed by embassy"
      },
      interview: {
        id: "STG-D004",
        name: "Interview Process",
        status: "pending",
        remarks: "Interview scheduled for March 25"
      },
      decision: {
        id: "STG-D005",
        name: "Final Decision",
        status: "pending",
        remarks: "Pending interview and embassy review"
      }
    },
    history: [
      {
        date: "2024-03-10",
        action: "Embassy Processing Started",
        user: "Kuwait Embassy",
        remarks: "Application now being processed by embassy"
      },
      {
        date: "2024-03-09",
        action: "Interview Scheduled",
        user: "Ahmed Ibrahim",
        remarks: "Embassy interview scheduled for March 25"
      },
      {
        date: "2024-03-08",
        action: "Application Submitted",
        user: "Fatima Nur",
        remarks: "All documents submitted to embassy"
      },
      {
        date: "2024-03-04",
        action: "Application Started",
        user: "Fatima Nur",
        remarks: "Visa application process initiated"
      }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Under Review":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300";
    case "Approved":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300";
    case "Rejected":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300";
    case "Pending":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300";
    case "Processing":
      return "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-300";
    case "Interview":
      return "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900 dark:text-purple-300";
    case "Expired":
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Under Review":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "Approved":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "Rejected":
      return <FileX className="h-4 w-4 text-red-500" />;
    case "Pending":
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case "Processing":
      return <RefreshCw className="h-4 w-4 text-indigo-500" />;
    case "Interview":
      return <Calendar className="h-4 w-4 text-purple-500" />;
    case "Expired":
      return <FileWarning className="h-4 w-4 text-gray-500" />;
    default:
      return null;
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
      return <FileCheck className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "rejected":
      return <FileX className="h-4 w-4 text-red-500" />;
    case "missing":
      return <FileWarning className="h-4 w-4 text-gray-500" />;
    default:
      return <FileText className="h-4 w-4 text-gray-500" />;
  }
};

const getStageStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 border-green-300";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getStageStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CircleCheck className="h-5 w-5 text-green-500" />;
    case "in_progress":
      return <CircleClock className="h-5 w-5 text-blue-500" />;
    case "pending":
      return <CircleHelp className="h-5 w-5 text-yellow-500" />;
    case "rejected":
      return <CircleAlert className="h-5 w-5 text-red-500" />;
    default:
      return null;
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export default function VisaManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<VisaApplication | null>(null);
  const [activeTab, setActiveTab] = useState("summary");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newApplicationOpen, setNewApplicationOpen] = useState(false);

  // Filter applications based on search, status, and destination
  const filteredApplications = visaApplications.filter((application) => {
    const matchesSearch =
      application.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.workerID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (application.workerPassport && application.workerPassport.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (application.visaNumber && application.visaNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || application.status === statusFilter;
    const matchesDestination = destinationFilter === "all" || application.destination === destinationFilter;
    
    return matchesSearch && matchesStatus && matchesDestination;
  });

  // Calculate statistics for the dashboard
  const totalApplications = visaApplications.length;
  const underReview = visaApplications.filter(a => a.status === "Under Review").length;
  const processing = visaApplications.filter(a => a.status === "Processing").length;
  const pending = visaApplications.filter(a => a.status === "Pending").length;
  const approved = visaApplications.filter(a => a.status === "Approved").length;
  const rejected = visaApplications.filter(a => a.status === "Rejected").length;
  const expiringSoon = visaApplications.filter(a => {
    if (a.expiryDate) {
      const expiryDate = new Date(a.expiryDate);
      const today = new Date();
      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 30 && diffDays > 0;
    }
    return false;
  }).length;

  // Get unique destinations for filtering
  const destinations = Array.from(new Set(visaApplications.map(a => a.destination)));

  return (
    <div className="flex flex-col gap-6">
      {/* Gradient header */}
      <div className="rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600 p-6 shadow-md">
        <h1 className="text-2xl font-bold text-white mb-2">Visa Applications</h1>
        <p className="text-purple-100">Manage and track worker visa applications</p>
      </div>
      
      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-full p-2 bg-purple-100">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Applications</p>
              <h3 className="text-2xl font-bold">{visaApplications.length}</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-full p-2 bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Under Review</p>
              <h3 className="text-2xl font-bold">{
                visaApplications.filter(app => app.status === "Under Review").length
              }</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-full p-2 bg-blue-100">
              <HourglassClock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Process</p>
              <h3 className="text-2xl font-bold">{
                visaApplications.filter(app => app.status === "Processing").length
              }</h3>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="rounded-full p-2 bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Approved</p>
              <h3 className="text-2xl font-bold">{
                visaApplications.filter(app => app.status === "Approved").length
              }</h3>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, ID or passport..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Under Review">Under Review</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={destinationFilter} onValueChange={setDestinationFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by destination" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Destinations</SelectItem>
              <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
              <SelectItem value="UAE">UAE</SelectItem>
              <SelectItem value="Qatar">Qatar</SelectItem>
              <SelectItem value="Kuwait">Kuwait</SelectItem>
              <SelectItem value="Bahrain">Bahrain</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Applications Table */}
      <Card>
        <CardHeader className="pb-1.5">
          <div className="flex items-center justify-between">
            <CardTitle>Visa Applications</CardTitle>
            <Button onClick={() => setNewApplicationOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Application
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-center">Documents</TableHead>
                <TableHead className="text-center">Interview</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => {
                // Calculate document completion
                const totalDocs = application.documentList.length;
                const approvedDocs = application.documentList.filter(doc => doc.status === "approved").length;
                const docPercentage = totalDocs > 0 ? Math.round((approvedDocs / totalDocs) * 100) : 0;
                
                return (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">{application.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {application.workerPhoto ? (
                            <AvatarImage src={application.workerPhoto} alt={application.workerName} />
                          ) : (
                            <AvatarFallback className="bg-purple-100 text-purple-600">
                              {application.workerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium leading-none">{application.workerName}</p>
                          <p className="text-xs text-muted-foreground">{application.workerPassport}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{application.destination}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-2">
                          <p className="text-sm">{approvedDocs}/{totalDocs}</p>
                          {docPercentage === 100 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <CircleAlert className="h-4 w-4 text-amber-500" />
                          )}
                        </div>
                        <Progress value={docPercentage} className="h-1.5 w-16 mt-1" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {application.interview?.scheduled ? (
                        <Badge variant="outline" className={
                          application.interview.status === "Completed" 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : application.interview.status === "Missed"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : application.interview.status === "Rescheduled"
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }>
                          {application.interview.status}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
                          Not Scheduled
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={getStatusColor(application.status)}>
                        {getStatusIcon(application.status)}
                        <span className="ml-1">{application.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedApplication(application)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Application
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CalendarPlus className="mr-2 h-4 w-4" />
                            Schedule Interview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Document
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                            Mark Issue
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash className="mr-2 h-4 w-4 text-red-500" />
                            Delete Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredApplications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <FileX className="h-8 w-8 mb-2" />
                      <p>No visa applications found</p>
                      <p className="text-sm">Try adjusting your search or filters</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Application Details Dialog */}
      <Dialog 
        open={!!selectedApplication} 
        onOpenChange={(open) => !open && setSelectedApplication(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedApplication && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getStatusColor(selectedApplication.status)}>
                    {getStatusIcon(selectedApplication.status)}
                    <span className="ml-1">{selectedApplication.status}</span>
                  </Badge>
                  <DialogTitle className="ml-2">{selectedApplication.workerName} - {selectedApplication.id}</DialogTitle>
                </div>
                <DialogDescription>
                  Visa Application for {selectedApplication.destination}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="summary" className="mt-2" onValueChange={setActiveTab}>
                <TabsList className="bg-slate-50 p-1">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <FileText className="mr-2 h-4 w-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Upload className="mr-2 h-4 w-4" />
                    Documents
                  </TabsTrigger>
                  <TabsTrigger value="interview" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Calendar className="mr-2 h-4 w-4" />
                    Interview
                  </TabsTrigger>
                  <TabsTrigger value="timeline" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                    <Clock className="mr-2 h-4 w-4" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
                
                {/* Summary Tab */}
                <TabsContent value="summary" className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Applicant Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            {selectedApplication.workerPhoto ? (
                              <AvatarImage src={selectedApplication.workerPhoto} alt={selectedApplication.workerName} />
                            ) : (
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {selectedApplication.workerName.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-lg">{selectedApplication.workerName}</h4>
                            <p className="text-sm text-muted-foreground">{selectedApplication.workerID}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 text-sm mt-4">
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Passport:</span>
                              <span className="font-medium">{selectedApplication.workerPassport}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Destination:</span>
                              <span className="font-medium">{selectedApplication.destination}</span>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <p className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Embassy:</span>
                              <span className="font-medium">{selectedApplication.embassy}</span>
                            </p>
                            <p className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-gray-500">Applied:</span>
                              <span className="font-medium">{selectedApplication.submissionDate}</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Visa Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>Visa Type</span>
                          </div>
                          <div className="text-sm font-medium">
                            {selectedApplication.visaType || "Work"}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-gray-400" />
                            <span>Duration</span>
                          </div>
                          <div className="text-sm font-medium">
                            {selectedApplication.duration || "Not specified"}
                          </div>
                        </div>
                        
                        {selectedApplication.visaNumber && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileCheck className="h-4 w-4 text-gray-400" />
                              <span>Visa Number</span>
                            </div>
                            <div className="text-sm font-medium">
                              {selectedApplication.visaNumber}
                            </div>
                          </div>
                        )}
                        
                        {selectedApplication.issueDate && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>Issue Date</span>
                            </div>
                            <div className="text-sm font-medium">
                              {selectedApplication.issueDate}
                            </div>
                          </div>
                        )}
                        
                        {selectedApplication.expiryDate && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarClock className="h-4 w-4 text-gray-400" />
                              <span>Expiry Date</span>
                            </div>
                            <div className="text-sm font-medium">
                              {selectedApplication.expiryDate}
                            </div>
                          </div>
                        )}
                        
                        {selectedApplication.fees && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-gray-400" />
                              <span>Fees</span>
                            </div>
                            <div className="text-sm font-medium">
                              {formatCurrency(selectedApplication.fees.amount, selectedApplication.fees.currency)}
                              {selectedApplication.fees.paid ? (
                                <span className="text-green-600 ml-2">(Paid)</span>
                              ) : (
                                <span className="text-red-600 ml-2">(Unpaid)</span>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {selectedApplication.remarks && (
                      <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Remarks</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">{selectedApplication.remarks}</p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Visa Application Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Application Stage */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getStageStatusIcon(selectedApplication.stages.application.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium">Application Submission</h4>
                            <p className="text-sm text-muted-foreground">
                              Initial application and document collection
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <Badge variant="outline" className={getStageStatusColor(selectedApplication.stages.application.status)}>
                                {selectedApplication.stages.application.status === "completed" ? "Completed" :
                                 selectedApplication.stages.application.status === "in_progress" ? "In Progress" :
                                 selectedApplication.stages.application.status === "pending" ? "Pending" : "Rejected"}
                              </Badge>
                              {selectedApplication.stages.application.endDate && (
                                <span className="text-xs text-muted-foreground">
                                  Completed on {selectedApplication.stages.application.endDate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Documentation Stage */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getStageStatusIcon(selectedApplication.stages.documentation.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium">Document Verification</h4>
                            <p className="text-sm text-muted-foreground">
                              Verification of all required documents
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <Badge variant="outline" className={getStageStatusColor(selectedApplication.stages.documentation.status)}>
                                {selectedApplication.stages.documentation.status === "completed" ? "Completed" :
                                 selectedApplication.stages.documentation.status === "in_progress" ? "In Progress" :
                                 selectedApplication.stages.documentation.status === "pending" ? "Pending" : "Rejected"}
                              </Badge>
                              {selectedApplication.stages.documentation.endDate && (
                                <span className="text-xs text-muted-foreground">
                                  Completed on {selectedApplication.stages.documentation.endDate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Embassy Stage */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getStageStatusIcon(selectedApplication.stages.embassy.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium">Embassy Processing</h4>
                            <p className="text-sm text-muted-foreground">
                              Processing by the embassy of destination country
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <Badge variant="outline" className={getStageStatusColor(selectedApplication.stages.embassy.status)}>
                                {selectedApplication.stages.embassy.status === "completed" ? "Completed" :
                                 selectedApplication.stages.embassy.status === "in_progress" ? "In Progress" :
                                 selectedApplication.stages.embassy.status === "pending" ? "Pending" : "Rejected"}
                              </Badge>
                              {selectedApplication.stages.embassy.endDate && (
                                <span className="text-xs text-muted-foreground">
                                  Completed on {selectedApplication.stages.embassy.endDate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Interview Stage */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getStageStatusIcon(selectedApplication.stages.interview.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium">Interview Process</h4>
                            <p className="text-sm text-muted-foreground">
                              Interview with embassy officials
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <Badge variant="outline" className={getStageStatusColor(selectedApplication.stages.interview.status)}>
                                {selectedApplication.stages.interview.status === "completed" ? "Completed" :
                                 selectedApplication.stages.interview.status === "in_progress" ? "In Progress" :
                                 selectedApplication.stages.interview.status === "pending" ? "Pending" : "Rejected"}
                              </Badge>
                              {selectedApplication.interview?.scheduled && (
                                <span className="text-xs text-muted-foreground">
                                  {selectedApplication.interview.status === "Completed" 
                                    ? "Interview completed" 
                                    : `Scheduled for ${selectedApplication.interview.date}`}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Decision Stage */}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-200">
                            {getStageStatusIcon(selectedApplication.stages.decision.status)}
                          </div>
                          <div className="flex-grow pt-1">
                            <h4 className="font-medium">Final Decision</h4>
                            <p className="text-sm text-muted-foreground">
                              Visa approval or rejection decision
                            </p>
                            <div className="mt-2 flex items-center gap-3">
                              <Badge variant="outline" className={getStageStatusColor(selectedApplication.stages.decision.status)}>
                                {selectedApplication.stages.decision.status === "completed" ? "Completed" :
                                 selectedApplication.stages.decision.status === "in_progress" ? "In Progress" :
                                 selectedApplication.stages.decision.status === "pending" ? "Pending" : "Rejected"}
                              </Badge>
                              {selectedApplication.stages.decision.endDate && (
                                <span className="text-xs text-muted-foreground">
                                  Decision on {selectedApplication.stages.decision.endDate}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
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
                        {selectedApplication.documentList.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              {getDocumentStatusIcon(doc.status)}
                              <div>
                                <h4 className="font-medium">{doc.name}</h4>
                                <p className="text-xs text-muted-foreground">{doc.type}</p>
                                {doc.uploadDate && (
                                  <p className="text-xs text-muted-foreground">
                                    Uploaded: {doc.uploadDate}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getDocumentStatusColor(doc.status)}>
                                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                              </Badge>
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
                
                {/* Interview Tab */}
                <TabsContent value="interview" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Interview Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedApplication.interview?.scheduled ? (
                        <div className="space-y-4">
                          <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                              <div>
                                <h3 className="font-medium text-purple-900 flex items-center">
                                  <Calendar className="mr-2 h-5 w-5 text-purple-700" />
                                  {selectedApplication.interview.status} Interview
                                </h3>
                                <p className="text-sm text-purple-700 mt-1">
                                  {selectedApplication.interview.date} {selectedApplication.interview.time && `at ${selectedApplication.interview.time}`}
                                </p>
                              </div>
                              <Badge variant="outline" className={
                                selectedApplication.interview.status === "Completed" 
                                  ? "bg-green-100 text-green-800 border-green-300" 
                                  : selectedApplication.interview.status === "Missed"
                                  ? "bg-red-100 text-red-800 border-red-300"
                                  : selectedApplication.interview.status === "Rescheduled"
                                  ? "bg-amber-100 text-amber-800 border-amber-300"
                                  : "bg-purple-100 text-purple-800 border-purple-300"
                              }>
                                {selectedApplication.interview.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Interview Location</h4>
                              <p className="text-sm">{selectedApplication.interview.location || selectedApplication.embassy}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium mb-2">Interviewer</h4>
                              <p className="text-sm">{selectedApplication.interview.interviewer || "Embassy Official"}</p>
                            </div>
                          </div>
                          
                          {selectedApplication.interview.notes && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Interview Notes</h4>
                              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm">
                                {selectedApplication.interview.notes}
                              </div>
                            </div>
                          )}
                          
                          {selectedApplication.interview.feedback && (
                            <div>
                              <h4 className="text-sm font-medium mb-2">Interview Feedback</h4>
                              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-sm">
                                {selectedApplication.interview.feedback}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex gap-2 mt-4">
                            {selectedApplication.interview.status === "Scheduled" && (
                              <>
                                <Button variant="outline" size="sm">
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Reschedule
                                </Button>
                                <Button size="sm">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Add to Calendar
                                </Button>
                              </>
                            )}
                            {selectedApplication.interview.status === "Completed" && (
                              <Button size="sm" variant="outline">
                                <Pencil className="mr-2 h-4 w-4" />
                                Update Feedback
                              </Button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <Calendar className="h-12 w-12 text-slate-300 mb-4" />
                          <h3 className="text-lg font-medium">No Interview Scheduled</h3>
                          <p className="text-sm text-muted-foreground max-w-sm mt-2">
                            This application doesn't have an interview scheduled yet. Schedule an interview when all required documents are verified.
                          </p>
                          <Button className="mt-4">
                            <Calendar className="mr-2 h-4 w-4" />
                            Schedule Interview
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Timeline Tab */}
                <TabsContent value="timeline" className="mt-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Application Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        {/* Timeline connector line */}
                        <div className="absolute left-12 top-8 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                        
                        <div className="space-y-8">
                          {selectedApplication.history.map((event, index) => (
                            <div key={index} className="flex gap-4 relative z-10">
                              <div className="text-xs text-right text-muted-foreground w-20 pt-1">
                                {event.date}
                              </div>
                              <div className="relative">
                                <div className="absolute top-1.5 left-1.5 h-2 w-2 rounded-full bg-purple-600"></div>
                                <div className="h-7 w-7 rounded-full border border-purple-100 bg-purple-50"></div>
                              </div>
                              <div className="flex-grow pb-4">
                                <h4 className="font-medium">{event.action}</h4>
                                {event.remarks && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {event.remarks}
                                  </p>
                                )}
                                <div className="text-xs text-muted-foreground mt-2">
                                  By {event.user}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex justify-between items-center border-t mt-4 pt-4">
                <Button variant="outline" onClick={() => setSelectedApplication(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  {selectedApplication.status === "Approved" && (
                    <>
                      <Button variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print Visa
                      </Button>
                      <Button>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </>
                  )}
                  {selectedApplication.status === "Under Review" || selectedApplication.status === "Processing" && (
                    <Button>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Check Status
                    </Button>
                  )}
                  {selectedApplication.status === "Pending" && (
                    <Button>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Missing Documents
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