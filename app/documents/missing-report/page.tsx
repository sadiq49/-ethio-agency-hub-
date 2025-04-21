"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Search, 
  Filter, 
  AlertCircle, 
  UserX,
  Clock,
  CheckCircle2,
  FileText,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  FileWarning,
  Send,
  History,
  HelpCircle
} from "lucide-react";

interface MissingReport {
  id: string;
  workerName: string;
  workerID: string;
  destination: string;
  status: "Under Investigation" | "Located" | "Pending MOLS Review" | "Police Report Filed";
  reportDate: string;
  lastKnownLocation: string;
  investigationStatus: "Active" | "Resolved" | "Pending";
  caseSummary?: string;
  employer?: {
    name: string;
    contact: string;
    location: string;
  };
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
  };
  timeline?: {
    date: string;
    event: string;
    details: string;
  }[];
  lastUpdate: string;
  remarks?: string;
}

const missingReports: MissingReport[] = [
  {
    id: "MR-2023-001",
    workerName: "Amina Hassan",
    workerID: "W78923456",
    destination: "Dubai, UAE",
    status: "Under Investigation",
    reportDate: "Oct 15, 2023",
    lastKnownLocation: "Dubai International Airport",
    investigationStatus: "Active",
    caseSummary: "Worker failed to report to employer after airport arrival. Last contact was upon landing.",
    employer: {
      name: "Al Madina Construction",
      contact: "+971 4 123 4567",
      location: "Dubai, UAE",
    },
    emergencyContact: {
      name: "Faisal Hassan",
      relation: "Brother",
      phone: "+254 712 345 678",
    },
    timeline: [
      {
        date: "Oct 15, 2023",
        event: "Missing report filed",
        details: "Employer reported worker did not arrive at accommodation",
      },
      {
        date: "Oct 16, 2023",
        event: "Initial investigation",
        details: "Confirmed arrival at airport via flight manifests",
      },
      {
        date: "Oct 18, 2023",
        event: "Airport CCTV review",
        details: "Unable to trace post-immigration movements",
      },
    ],
    lastUpdate: "Oct 18, 2023",
    remarks: "Immigration confirmed entry but no further trace. Contacting local hospitals.",
  },
  {
    id: "MR-2023-002",
    workerName: "Hassan Ahmed",
    workerID: "W45678901",
    destination: "Riyadh, KSA",
    status: "Located",
    reportDate: "Sep 28, 2023",
    lastKnownLocation: "Riyadh City Center",
    investigationStatus: "Resolved",
    caseSummary: "Worker left accommodation without notice. Located at friend's residence in different district.",
    employer: {
      name: "Saudi Development Corp",
      contact: "+966 11 987 6543",
      location: "Riyadh, KSA",
    },
    emergencyContact: {
      name: "Fatima Ahmed",
      relation: "Sister",
      phone: "+254 723 456 789",
    },
    timeline: [
      {
        date: "Sep 28, 2023",
        event: "Missing report filed",
        details: "Not seen at accommodation for 48 hours",
      },
      {
        date: "Sep 29, 2023",
        event: "Contact attempt",
        details: "Phone unreachable, social media inactive",
      },
      {
        date: "Oct 02, 2023",
        event: "Worker located",
        details: "Found staying with friend in Al Olaya district",
      },
    ],
    lastUpdate: "Oct 02, 2023",
    remarks: "Worker returned to accommodation. Counseling session scheduled.",
  },
  {
    id: "MR-2023-003",
    workerName: "Aisha Omar",
    workerID: "W12345678",
    destination: "Abu Dhabi, UAE",
    status: "Pending MOLS Review",
    reportDate: "Oct 05, 2023",
    lastKnownLocation: "Abu Dhabi Central Bus Station",
    investigationStatus: "Pending",
    caseSummary: "Worker left worksite early citing personal emergency. Not reachable since.",
    employer: {
      name: "Emirates Hospitality Group",
      contact: "+971 2 345 6789",
      location: "Abu Dhabi, UAE",
    },
    emergencyContact: {
      name: "Ibrahim Omar",
      relation: "Father",
      phone: "+254 734 567 890",
    },
    timeline: [
      {
        date: "Oct 05, 2023",
        event: "Initial report",
        details: "Left work early saying needed to attend to emergency",
      },
      {
        date: "Oct 06, 2023",
        event: "MOLS notification",
        details: "Case escalated to Ministry of Labor",
      },
      {
        date: "Oct 10, 2023",
        event: "Embassy notification",
        details: "Kenyan Embassy in UAE notified of situation",
      },
    ],
    lastUpdate: "Oct 10, 2023",
    remarks: "Awaiting response from ministry on search authorization.",
  },
  {
    id: "MR-2023-004",
    workerName: "Mohammed Ali",
    workerID: "W98765432",
    destination: "Doha, Qatar",
    status: "Police Report Filed",
    reportDate: "Oct 20, 2023",
    lastKnownLocation: "Doha Industrial Area",
    investigationStatus: "Active",
    caseSummary: "Worker missing for 72 hours. Personal belongings left at accommodation. Local police involved.",
    employer: {
      name: "Qatar Building Services",
      contact: "+974 4567 8901",
      location: "Doha, Qatar",
    },
    emergencyContact: {
      name: "Jamila Ali",
      relation: "Wife",
      phone: "+254 745 678 901",
    },
    timeline: [
      {
        date: "Oct 20, 2023",
        event: "Missing report filed",
        details: "Supervisor reported 3-day absence without communication",
      },
      {
        date: "Oct 21, 2023",
        event: "Room inspection",
        details: "All personal documents and valuables found in room",
      },
      {
        date: "Oct 22, 2023",
        event: "Police report filed",
        details: "Case registered with Doha Industrial Area Police Station",
      },
    ],
    lastUpdate: "Oct 22, 2023",
    remarks: "Police case number DIA-2023-4567. Investigation active.",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Under Investigation":
      return "bg-amber-100 text-amber-800 hover:bg-amber-100/80";
    case "Located":
      return "bg-green-100 text-green-800 hover:bg-green-100/80";
    case "Pending MOLS Review":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
    case "Police Report Filed":
      return "bg-red-100 text-red-800 hover:bg-red-100/80";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Under Investigation":
      return <Search className="h-4 w-4 text-amber-600" />;
    case "Located":
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case "Pending MOLS Review":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "Police Report Filed":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <HelpCircle className="h-4 w-4 text-gray-600" />;
  }
};

export default function MissingReportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredReports = missingReports.filter((report) => {
    const matchesSearch =
      report.workerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.workerID.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Missing Worker Reports</h1>
        <Button>
          <UserX className="mr-2 h-4 w-4" />
          New Missing Report
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground pt-1">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Under Investigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">12</div>
            <p className="text-xs text-muted-foreground pt-1">
              Average resolution: 14 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Located
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">8</div>
            <p className="text-xs text-muted-foreground pt-1">
              80% success rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">3</div>
            <p className="text-xs text-muted-foreground pt-1">
              Awaiting MOLS response
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 sm:w-44">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Under Investigation">Under Investigation</SelectItem>
              <SelectItem value="Located">Located</SelectItem>
              <SelectItem value="Pending MOLS Review">Pending MOLS Review</SelectItem>
              <SelectItem value="Police Report Filed">Police Report Filed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Report ID</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Last Known Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Report Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{report.workerName}</div>
                      <div className="text-xs text-muted-foreground">
                        {report.workerID}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{report.destination}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {report.lastKnownLocation}
                    </div>
                    {report.caseSummary && (
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {report.caseSummary}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(report.status)}`}>
                        {report.status}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{report.reportDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <History className="mr-2 h-4 w-4" />
                        Timeline
                      </Button>
                      <Button size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Update
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}