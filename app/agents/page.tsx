"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
  UserCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Users,
  Calendar,
  FileText,
  PlusCircle,
  Building2,
  History,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  Clock
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  country: string;
  status: "Active" | "Pending" | "Suspended" | "Inactive";
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  address: string;
  license: {
    number: string;
    expiryDate: string;
    status: "Valid" | "Expiring" | "Expired";
  };
  performance: {
    rating: number;
    totalWorkers: number;
    activeWorkers: number;
    successRate: number;
    complaints: number;
  };
  compliance: {
    lastAudit: string;
    score: number;
    violations: number;
  };
  financials: {
    totalTransactions: number;
    pendingPayments: number;
    currency: string;
  };
  registration: {
    date: string;
    verificationStatus: "Verified" | "Pending" | "Rejected";
    documents: string[];
  };
  communication: {
    lastContact: string;
    preferredChannel: "Email" | "Phone" | "WhatsApp" | "Portal";
    responseTime: number; // in hours
    unreadMessages: number;
  };
  documentSharing: {
    sharedDocuments: number;
    pendingReviews: number;
    lastUploaded: string;
  };
}

const agents: Agent[] = [
  {
    id: "AGT-2024-001",
    name: "Al Safwa Manpower",
    country: "Saudi Arabia",
    status: "Active",
    contact: {
      name: "Abdullah Mohammed",
      phone: "+966-50-1234567",
      email: "contact@alsafwa.com"
    },
    address: "Riyadh, Saudi Arabia",
    license: {
      number: "SA-2024-123",
      expiryDate: "2025-03-15",
      status: "Valid"
    },
    performance: {
      rating: 4.8,
      totalWorkers: 250,
      activeWorkers: 180,
      successRate: 95,
      complaints: 2
    },
    compliance: {
      lastAudit: "2024-02-15",
      score: 98,
      violations: 0
    },
    financials: {
      totalTransactions: 450,
      pendingPayments: 3,
      currency: "SAR"
    },
    registration: {
      date: "2023-05-15",
      verificationStatus: "Verified",
      documents: ["Business License", "Commercial Registration", "Tax Certificate", "Insurance Policy"]
    },
    communication: {
      lastContact: "2024-03-20",
      preferredChannel: "Portal",
      responseTime: 3,
      unreadMessages: 0
    },
    documentSharing: {
      sharedDocuments: 45,
      pendingReviews: 2,
      lastUploaded: "2024-03-18"
    }
  },
  {
    id: "AGT-2024-002",
    name: "Dubai Employment Services",
    country: "UAE",
    status: "Active",
    contact: {
      name: "Hassan Ali",
      phone: "+971-50-9876543",
      email: "info@dubaiemployment.ae"
    },
    address: "Dubai, UAE",
    license: {
      number: "UAE-2024-456",
      expiryDate: "2024-12-31",
      status: "Valid"
    },
    performance: {
      rating: 4.5,
      totalWorkers: 180,
      activeWorkers: 150,
      successRate: 92,
      complaints: 4
    },
    compliance: {
      lastAudit: "2024-01-20",
      score: 95,
      violations: 1
    },
    financials: {
      totalTransactions: 320,
      pendingPayments: 5,
      currency: "AED"
    },
    registration: {
      date: "2023-08-10",
      verificationStatus: "Verified",
      documents: ["Trade License", "Chamber of Commerce Certificate", "Ministry Approval", "Financial Statement"]
    },
    communication: {
      lastContact: "2024-03-15",
      preferredChannel: "WhatsApp",
      responseTime: 1,
      unreadMessages: 3
    },
    documentSharing: {
      sharedDocuments: 38,
      pendingReviews: 0,
      lastUploaded: "2024-03-12"
    }
  },
  {
    id: "AGT-2024-003",
    name: "Kuwait Manpower Solutions",
    country: "Kuwait",
    status: "Pending",
    contact: {
      name: "Fahad Al-Salem",
      phone: "+965-555-7890",
      email: "contact@kuwaitmanpower.com"
    },
    address: "Kuwait City, Kuwait",
    license: {
      number: "KW-2024-789",
      expiryDate: "2024-06-30",
      status: "Expiring"
    },
    performance: {
      rating: 4.2,
      totalWorkers: 120,
      activeWorkers: 90,
      successRate: 88,
      complaints: 6
    },
    compliance: {
      lastAudit: "2024-03-01",
      score: 92,
      violations: 2
    },
    financials: {
      totalTransactions: 220,
      pendingPayments: 8,
      currency: "KWD"
    },
    registration: {
      date: "2024-01-12",
      verificationStatus: "Pending",
      documents: ["Business License", "Owner ID", "Application Form"]
    },
    communication: {
      lastContact: "2024-03-10",
      preferredChannel: "Phone",
      responseTime: 6,
      unreadMessages: 2
    },
    documentSharing: {
      sharedDocuments: 12,
      pendingReviews: 5,
      lastUploaded: "2024-03-05"
    }
  },
  {
    id: "AGT-2024-004",
    name: "Qatar Worker Placement",
    country: "Qatar",
    status: "Active",
    contact: {
      name: "Mohammed Al-Thani",
      phone: "+974-66-123456",
      email: "info@qatarworkers.com"
    },
    address: "Doha, Qatar",
    license: {
      number: "QA-2024-321",
      expiryDate: "2025-02-28",
      status: "Valid"
    },
    performance: {
      rating: 4.7,
      totalWorkers: 215,
      activeWorkers: 195,
      successRate: 97,
      complaints: 1
    },
    compliance: {
      lastAudit: "2024-02-20",
      score: 97,
      violations: 0
    },
    financials: {
      totalTransactions: 380,
      pendingPayments: 0,
      currency: "QAR"
    },
    registration: {
      date: "2023-04-05",
      verificationStatus: "Verified",
      documents: ["Commercial License", "Qatar Chamber Certificate", "Ministry Registration", "Insurance"]
    },
    communication: {
      lastContact: "2024-03-22",
      preferredChannel: "Portal",
      responseTime: 2,
      unreadMessages: 0
    },
    documentSharing: {
      sharedDocuments: 52,
      pendingReviews: 1,
      lastUploaded: "2024-03-21"
    }
  },
  {
    id: "AGT-2024-005",
    name: "Bahrain Employment Center",
    country: "Bahrain",
    status: "Suspended",
    contact: {
      name: "Khalid Al-Khalifa",
      phone: "+973-3900-1234",
      email: "support@bahrainemployment.bh"
    },
    address: "Manama, Bahrain",
    license: {
      number: "BH-2023-567",
      expiryDate: "2024-05-15",
      status: "Expiring"
    },
    performance: {
      rating: 3.8,
      totalWorkers: 85,
      activeWorkers: 45,
      successRate: 76,
      complaints: 12
    },
    compliance: {
      lastAudit: "2024-01-05",
      score: 72,
      violations: 4
    },
    financials: {
      totalTransactions: 145,
      pendingPayments: 15,
      currency: "BHD"
    },
    registration: {
      date: "2023-02-18",
      verificationStatus: "Verified",
      documents: ["Commercial Registration", "LMRA Certificate", "Financial Documents"]
    },
    communication: {
      lastContact: "2024-02-25",
      preferredChannel: "Email",
      responseTime: 12,
      unreadMessages: 8
    },
    documentSharing: {
      sharedDocuments: 28,
      pendingReviews: 9,
      lastUploaded: "2024-02-15"
    }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Suspended":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getLicenseStatusColor = (status: string) => {
  switch (status) {
    case "Valid":
      return "bg-green-100 text-green-800";
    case "Expiring":
      return "bg-yellow-100 text-yellow-800";
    case "Expired":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AgentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = countryFilter === "all" || agent.country === countryFilter;
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    
    return matchesSearch && matchesCountry && matchesStatus;
  });

  const totalAgents = agents.length;
  const activeAgents = agents.filter(a => a.status === "Active").length;
  const pendingAgents = agents.filter(a => a.status === "Pending").length;
  const totalActiveWorkers = agents.reduce((sum, agent) => sum + agent.performance.activeWorkers, 0);
  const avgSuccessRate = Math.round(agents.reduce((sum, agent) => sum + agent.performance.successRate, 0) / agents.length);
  const avgComplianceScore = Math.round(agents.reduce((sum, agent) => sum + agent.compliance.score, 0) / agents.length);
  const countries = [...new Set(agents.map(a => a.country))].length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Agent Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>

      <div className="flex overflow-auto pb-2">
        <div className="flex border-b w-full">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("registration")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "registration"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <UserCheck className="mr-2 h-4 w-4" />
            Registration & Verification
          </button>
          <button
            onClick={() => setActiveTab("communication")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "communication"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Mail className="mr-2 h-4 w-4" />
            Communication
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "documents"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileText className="mr-2 h-4 w-4" />
            Document Sharing
          </button>
          <button
            onClick={() => setActiveTab("performance")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "performance"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Performance
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Agents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgents}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Across {countries} countries
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalActiveWorkers}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Currently employed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSuccessRate}%</div>
            <p className="text-xs text-muted-foreground pt-1">
              Average across all agents
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avgComplianceScore}%</div>
            <p className="text-xs text-muted-foreground pt-1">
              Average rating
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search agents..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-36 sm:w-44">
              <div className="flex items-center">
                <Globe className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Country" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="Saudi Arabia">Saudi Arabia</SelectItem>
              <SelectItem value="UAE">UAE</SelectItem>
              <SelectItem value="Kuwait">Kuwait</SelectItem>
              <SelectItem value="Qatar">Qatar</SelectItem>
              <SelectItem value="Bahrain">Bahrain</SelectItem>
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
              <SelectItem value="Suspended">Suspended</SelectItem>
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
                <TableHead>Agent</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Workers</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>License</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {agent.country}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(agent.performance.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Success Rate: {agent.performance.successRate}%
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{agent.performance.activeWorkers}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total: {agent.performance.totalWorkers}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Score</span>
                        <span>{agent.compliance.score}%</span>
                      </div>
                      <Progress 
                        value={agent.compliance.score} 
                        className="h-2" 
                      />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        Last audit: {agent.compliance.lastAudit}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getLicenseStatusColor(agent.license.status)}>
                        {agent.license.status}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        Expires: {agent.license.expiryDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <History className="mr-2 h-4 w-4" />
                        History
                      </Button>
                      <Button size="sm">
                        <BarChart2 className="mr-2 h-4 w-4" />
                        Performance
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Al Safwa Manpower</div>
                  <div className="text-sm text-muted-foreground">
                    Successfully placed 15 workers
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  2h ago
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Clock className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Kuwait Manpower Solutions</div>
                  <div className="text-sm text-muted-foreground">
                    License renewal pending
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  5h ago
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-red-100 p-2 rounded-full">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Dubai Employment Services</div>
                  <div className="text-sm text-muted-foreground">
                    Compliance warning issued
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  1d ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agents
                .sort((a, b) => b.performance.rating - a.performance.rating)
                .slice(0, 3)
                .map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>
                          {agent.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{agent.name}</div>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(agent.performance.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{agent.performance.successRate}%</div>
                      <div className="text-sm text-muted-foreground">
                        Success Rate
                      </div>
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