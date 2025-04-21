"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Search, Filter, Building2, Phone, Mail, MapPin, FileText, PlusCircle, CheckCircle2, AlertCircle, Clock, Building as Bank, Stethoscope, CheckCircle as Shield, GraduationCap, Globe, History, Users } from "lucide-react";

interface Institution {
  id: string;
  name: string;
  type: "Government" | "Bank" | "Insurance" | "Medical" | "Training";
  status: "Active" | "Pending" | "Inactive";
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  address: string;
  services: string[];
  lastInteraction: string;
  activeWorkers: number;
  verificationStatus: boolean;
  license?: {
    number: string;
    expiryDate: string;
  };
  governmentDetails?: {
    regulatoryBody: string;
    complianceLevel: string;
    reportingFrequency: string;
  };
  bankDetails?: {
    swiftCode: string;
    accountTypes: string[];
    transferFees: string;
  };
  insuranceDetails?: {
    policyTypes: string[];
    coverageLimits: string;
    claimProcessTime: string;
  };
  medicalDetails?: {
    facilityType: string;
    specializations: string[];
    certifications: string[];
  };
}

const institutions: Institution[] = [
  {
    id: "INST-001",
    name: "Ministry of Labor",
    type: "Government",
    status: "Active",
    contact: {
      name: "Ahmed Mohammed",
      phone: "+251-11-1234567",
      email: "contact@mol.gov.et"
    },
    address: "Addis Ababa, Ethiopia",
    services: ["Worker Registration", "Document Verification", "Compliance Monitoring"],
    lastInteraction: "2024-03-15",
    activeWorkers: 1250,
    verificationStatus: true,
    license: {
      number: "GOV-2024-001",
      expiryDate: "2025-12-31"
    },
    governmentDetails: {
      regulatoryBody: "Federal Government",
      complianceLevel: "High",
      reportingFrequency: "Monthly"
    }
  },
  {
    id: "INST-002",
    name: "Commercial Bank of Ethiopia",
    type: "Bank",
    status: "Active",
    contact: {
      name: "Sara Haile",
      phone: "+251-11-5678901",
      email: "corporate@cbe.com.et"
    },
    address: "Addis Ababa, Ethiopia",
    services: ["Salary Transfer", "Foreign Exchange", "Worker Accounts"],
    lastInteraction: "2024-03-14",
    activeWorkers: 850,
    verificationStatus: true,
    license: {
      number: "BANK-2024-123",
      expiryDate: "2025-06-30"
    },
    bankDetails: {
      swiftCode: "CBETETAA",
      accountTypes: ["Foreign Currency", "Savings", "Salary"],
      transferFees: "2% for international transfers"
    }
  },
  {
    id: "INST-003",
    name: "Ethiopian Insurance Corporation",
    type: "Insurance",
    status: "Active",
    contact: {
      name: "Mohammed Ali",
      phone: "+251-11-9876543",
      email: "corporate@eic.com.et"
    },
    address: "Addis Ababa, Ethiopia",
    services: ["Worker Insurance", "Travel Insurance", "Health Coverage"],
    lastInteraction: "2024-03-13",
    activeWorkers: 620,
    verificationStatus: true,
    license: {
      number: "INS-2024-456",
      expiryDate: "2025-09-30"
    },
    insuranceDetails: {
      policyTypes: ["Health", "Accident", "Life"],
      coverageLimits: "Up to $50,000 USD",
      claimProcessTime: "7-14 days"
    }
  },
  {
    id: "INST-004",
    name: "St. Paul's Hospital",
    type: "Medical",
    status: "Active",
    contact: {
      name: "Dr. Yohannes Bekele",
      phone: "+251-11-3456789",
      email: "info@stpauls.com.et"
    },
    address: "Addis Ababa, Ethiopia",
    services: ["Medical Examination", "Vaccination", "Health Certificates"],
    lastInteraction: "2024-03-12",
    activeWorkers: 450,
    verificationStatus: true,
    license: {
      number: "MED-2024-789",
      expiryDate: "2025-03-31"
    },
    medicalDetails: {
      facilityType: "General Hospital",
      specializations: ["Occupational Health", "Travel Medicine", "Vaccinations"],
      certifications: ["ISO 9001", "National Hospital Standards"]
    }
  },
  {
    id: "INST-005",
    name: "Federal Ministry of Foreign Affairs",
    type: "Government",
    status: "Active",
    contact: {
      name: "Elizabeth Tesfa",
      phone: "+251-11-5551234",
      email: "international@mfa.gov.et"
    },
    address: "Addis Ababa, Ethiopia",
    services: ["Visa Verification", "International Coordination", "Worker Protection Abroad"],
    lastInteraction: "2024-03-10",
    activeWorkers: 980,
    verificationStatus: true,
    license: {
      number: "GOV-2024-002",
      expiryDate: "2025-12-31"
    },
    governmentDetails: {
      regulatoryBody: "Federal Government",
      complianceLevel: "High",
      reportingFrequency: "Weekly"
    }
  },
  {
    id: "INST-006",
    name: "Dashen Bank",
    type: "Bank",
    status: "Active",
    contact: {
      name: "Mekonnen Abebe",
      phone: "+251-11-5678902",
      email: "corporate@dashenbank.com.et"
    },
    address: "Addis Ababa, Ethiopia",
    services: ["Remittance Services", "Salary Accounts", "Mobile Banking for Workers"],
    lastInteraction: "2024-03-08",
    activeWorkers: 720,
    verificationStatus: true,
    license: {
      number: "BANK-2024-124",
      expiryDate: "2025-05-31"
    },
    bankDetails: {
      swiftCode: "DASHETAA",
      accountTypes: ["Remittance", "Savings", "Foreign Worker"],
      transferFees: "1.5% for international transfers"
    }
  },
  {
    id: "INST-007",
    name: "Nyala Insurance",
    type: "Insurance",
    status: "Pending",
    contact: {
      name: "Fatima Nur",
      phone: "+251-11-9876544",
      email: "corporate@nyala-insurance.com.et"
    },
    address: "Addis Ababa, Ethiopia",
    services: ["Migrant Worker Insurance", "Health Insurance", "Life Insurance"],
    lastInteraction: "2024-03-05",
    activeWorkers: 0,
    verificationStatus: false,
    insuranceDetails: {
      policyTypes: ["Travel", "Health", "Personal Accident"],
      coverageLimits: "Up to $75,000 USD",
      claimProcessTime: "10-21 days"
    }
  },
  {
    id: "INST-008",
    name: "Black Lion Hospital",
    type: "Medical",
    status: "Active",
    contact: {
      name: "Dr. Alem Desta",
      phone: "+251-11-3456790",
      email: "info@blacklion.gov.et"
    },
    address: "Addis Ababa, Ethiopia",
    services: ["Comprehensive Medical Exams", "Specialist Consultations", "Medical Certification"],
    lastInteraction: "2024-03-02",
    activeWorkers: 580,
    verificationStatus: true,
    license: {
      number: "MED-2024-790",
      expiryDate: "2025-02-28"
    },
    medicalDetails: {
      facilityType: "Teaching Hospital",
      specializations: ["General Health", "Cardiology", "Respiratory"],
      certifications: ["National Medical Board", "WHO Standards"]
    }
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Government":
      return <Building2 className="h-4 w-4 text-blue-500" />;
    case "Bank":
      return <Bank className="h-4 w-4 text-green-500" />;
    case "Insurance":
      return <Shield className="h-4 w-4 text-purple-500" />;
    case "Medical":
      return <Stethoscope className="h-4 w-4 text-red-500" />;
    case "Training":
      return <GraduationCap className="h-4 w-4 text-orange-500" />;
    default:
      return <Building2 className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Inactive":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

function BadgeDiv({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${className}`}>
      {children}
    </div>
  );
}

export default function InstitutionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      institution.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || institution.type === typeFilter;
    const matchesStatus = statusFilter === "all" || institution.status === statusFilter;
    const matchesTab = activeTab === "all" || institution.type === activeTab;
    
    return matchesSearch && matchesType && matchesStatus && matchesTab;
  });

  const governmentCount = institutions.filter(i => i.type === "Government").length;
  const bankCount = institutions.filter(i => i.type === "Bank").length;
  const insuranceCount = institutions.filter(i => i.type === "Insurance").length;
  const medicalCount = institutions.filter(i => i.type === "Medical").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Local Institution Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Institution
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Institutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{institutions.length}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {institutions.filter(i => i.status === "Active").length}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Currently collaborating
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Verifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {institutions.filter(i => i.status === "Pending").length}
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Service Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground pt-1">
              Required services
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex overflow-auto pb-2">
        <div className="flex border-b w-full">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "all"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            All Institutions
          </button>
          <button
            onClick={() => setActiveTab("Government")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "Government"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-muted-foreground"
            }`}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Government ({governmentCount})
          </button>
          <button
            onClick={() => setActiveTab("Bank")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "Bank"
                ? "border-b-2 border-green-500 text-green-500"
                : "text-muted-foreground"
            }`}
          >
            <Bank className="mr-2 h-4 w-4" />
            Banks ({bankCount})
          </button>
          <button
            onClick={() => setActiveTab("Insurance")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "Insurance"
                ? "border-b-2 border-purple-500 text-purple-500"
                : "text-muted-foreground"
            }`}
          >
            <Shield className="mr-2 h-4 w-4" />
            Insurance ({insuranceCount})
          </button>
          <button
            onClick={() => setActiveTab("Medical")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "Medical"
                ? "border-b-2 border-red-500 text-red-500"
                : "text-muted-foreground"
            }`}
          >
            <Stethoscope className="mr-2 h-4 w-4" />
            Medical ({medicalCount})
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search institutions..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 sm:w-44">
              <div className="flex items-center">
                <Building2 className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Government">Government</SelectItem>
              <SelectItem value="Bank">Bank</SelectItem>
              <SelectItem value="Insurance">Insurance</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 sm:w-44">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Institution</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Services</TableHead>
                <TableHead>Workers</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInstitutions.map((institution) => (
                <TableRow key={institution.id}>
                  <TableCell className="font-medium">{institution.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {institution.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{institution.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {institution.address}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(institution.type)}
                      <BadgeDiv className={getStatusColor(institution.status)}>
                        {institution.status}
                      </BadgeDiv>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {institution.contact.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {institution.contact.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {institution.contact.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {institution.services.map((service, index) => (
                        <BadgeDiv key={index} className="text-xs">
                          {service}
                        </BadgeDiv>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{institution.activeWorkers}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <BadgeDiv className={getStatusColor(institution.status)}>
                      {institution.status}
                    </BadgeDiv>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <History className="mr-2 h-4 w-4" />
                        History
                      </Button>
                      <Button size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Institution Type Specific Information Cards */}
      {activeTab !== "all" && (
        <div className="grid gap-6 md:grid-cols-2">
          {activeTab === "Government" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-blue-500" />
                  Government Integration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Regulatory Compliance</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Worker registration frameworks established
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Automated reporting systems active
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Document verification channels open
                      </li>
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        Compliance audit responses pending
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Reporting Schedule</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Daily Updates</span>
                        <span>07:00 AM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Weekly Reports</span>
                        <span>Friday</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Compliance</span>
                        <span>5th</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quarterly Review</span>
                        <span>End of Quarter</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "Bank" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bank className="mr-2 h-5 w-5 text-green-500" />
                  Banking Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Financial Services</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Automated salary transfers
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Worker remittance services
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Foreign currency accounts
                      </li>
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        Mobile banking integration in progress
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Transaction Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Remittances Processed</span>
                        <span>1,245 monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salary Transfers</span>
                        <span>3,570 monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Transfer Time</span>
                        <span>1.5 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Worker Accounts</span>
                        <span>5,200 active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "Insurance" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-purple-500" />
                  Insurance Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Policy Management</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Worker health insurance active
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Travel insurance coverage
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Accident protection policies
                      </li>
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        Repatriation coverage review
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Claims Processing</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Open Claims</span>
                        <span>37 active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Processing</span>
                        <span>12 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Settlement Rate</span>
                        <span>92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Claims Filed (YTD)</span>
                        <span>237</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "Medical" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="mr-2 h-5 w-5 text-red-500" />
                  Medical Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Health Certifications</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Pre-departure medical screenings
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Vaccination verification
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Health certificate processing
                      </li>
                      <li className="flex items-center">
                        <Clock className="h-4 w-4 text-amber-500 mr-2" />
                        Destination-specific health checks
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Processing Statistics</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Medical Exams</span>
                        <span>425 monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vaccinations</span>
                        <span>380 monthly</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Processing</span>
                        <span>2.5 days</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clearance Rate</span>
                        <span>94%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Integration Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredInstitutions.slice(0, 3).map((institution) => (
                  <div key={institution.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {institution.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{institution.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Last interaction: {institution.lastInteraction}
                        </div>
                      </div>
                    </div>
                    <BadgeDiv>
                      {institution.type}
                    </BadgeDiv>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {institutions.slice(0, 3).map((institution) => (
                <div key={institution.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {institution.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{institution.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Last interaction: {institution.lastInteraction}
                      </div>
                    </div>
                  </div>
                  <BadgeDiv>
                    {institution.type}
                  </BadgeDiv>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>License Renewals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {institutions
                .filter(inst => inst.license)
                .map((institution) => (
                  <div key={institution.id} className="space-y-3 border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{institution.name}</div>
                      <BadgeDiv>
                        {institution.license?.number}
                      </BadgeDiv>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Expiry Date</span>
                      <span>{institution.license?.expiryDate}</span>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}