"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import { 
  Search, 
  Filter, 
  Settings,
  Play,
  Pause,
  RefreshCw,
  FileText,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Shield,
  History,
  PlusCircle,
  Cog,
  Workflow,
  FileCheck,
  FileWarning,
  Inbox,
  Send,
  Upload,
  Download,
  Trash2,
  Mail,
  MessageSquare,
  Globe,
  FirstAid,
  CheckCircle,
  AlertTriangle,
  Passport,
  Plane
} from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  type: "Document" | "Payment" | "Notification" | "Integration" | "Security";
  status: "Active" | "Paused" | "Draft" | "Error";
  triggers: string[];
  actions: string[];
  lastRun: string;
  nextRun?: string;
  successRate: number;
  totalExecutions: number;
  averageTime: string;
  securityLevel?: "Basic" | "Enhanced" | "Maximum";
  dataHandling?: {
    encryption: boolean;
    retentionPolicy: string;
    accessLevel: "Public" | "Internal" | "Restricted" | "Confidential";
  };
  notifications?: {
    channels: string[];
    recipients: string[];
    priority: "Low" | "Medium" | "High" | "Critical";
  };
  documentManagement?: {
    fileTypes: string[];
    storage: string;
    maxSize: string;
    validationRules: string[];
  };
}

const workflows: Workflow[] = [
  {
    id: "WF-001",
    name: "Document Verification",
    type: "Document",
    status: "Active",
    triggers: ["New Document Upload", "Document Update"],
    actions: [
      "Validate Document Format",
      "Check Expiry Dates",
      "Verify Authenticity",
      "Update Status"
    ],
    lastRun: "2024-03-15 14:30",
    nextRun: "2024-03-15 15:30",
    successRate: 98.5,
    totalExecutions: 1250,
    averageTime: "45s",
    securityLevel: "Enhanced",
    dataHandling: {
      encryption: true,
      retentionPolicy: "90 days",
      accessLevel: "Restricted"
    },
    documentManagement: {
      fileTypes: ["PDF", "JPEG", "PNG"],
      storage: "Encrypted Cloud Storage",
      maxSize: "10MB",
      validationRules: ["Format Validation", "OCR Verification", "Tamper Detection"]
    }
  },
  {
    id: "WF-002",
    name: "Payment Processing",
    type: "Payment",
    status: "Active",
    triggers: ["Payment Received", "Refund Request"],
    actions: [
      "Verify Amount",
      "Process Transaction",
      "Send Receipt",
      "Update Records"
    ],
    lastRun: "2024-03-15 14:15",
    nextRun: "2024-03-15 15:15",
    successRate: 99.8,
    totalExecutions: 890,
    averageTime: "30s",
    securityLevel: "Maximum",
    dataHandling: {
      encryption: true,
      retentionPolicy: "7 years",
      accessLevel: "Confidential"
    },
    notifications: {
      channels: ["Email", "SMS", "In-App"],
      recipients: ["Customer", "Finance Department"],
      priority: "High"
    }
  },
  {
    id: "WF-003",
    name: "Status Notifications",
    type: "Notification",
    status: "Active",
    triggers: ["Status Change", "Document Expiry", "Milestone Reached"],
    actions: [
      "Generate Notification",
      "Send Email",
      "Send SMS",
      "Log Communication"
    ],
    lastRun: "2024-03-15 14:00",
    nextRun: "2024-03-15 15:00",
    successRate: 100,
    totalExecutions: 2340,
    averageTime: "15s",
    securityLevel: "Enhanced",
    notifications: {
      channels: ["Email", "SMS", "WhatsApp", "In-App"],
      recipients: ["Worker", "Agency", "Employer"],
      priority: "Medium"
    }
  },
  {
    id: "WF-004",
    name: "MOLS Integration",
    type: "Integration",
    status: "Error",
    triggers: ["Document Submission", "Status Update"],
    actions: [
      "Prepare Data",
      "Submit to MOLS",
      "Process Response",
      "Update Status"
    ],
    lastRun: "2024-03-15 13:45",
    successRate: 94.2,
    totalExecutions: 560,
    averageTime: "1m 15s",
    securityLevel: "Maximum",
    dataHandling: {
      encryption: true,
      retentionPolicy: "5 years",
      accessLevel: "Restricted"
    }
  },
  {
    id: "WF-005",
    name: "Secure Document Storage",
    type: "Security",
    status: "Active",
    triggers: ["Document Upload", "Access Request", "Retention Period End"],
    actions: [
      "Encrypt Document",
      "Apply Access Controls",
      "Log Access Attempts",
      "Automatic Purging"
    ],
    lastRun: "2024-03-15 14:45",
    nextRun: "2024-03-15 15:45",
    successRate: 100,
    totalExecutions: 780,
    averageTime: "5s",
    securityLevel: "Maximum",
    dataHandling: {
      encryption: true,
      retentionPolicy: "Custom Per Document",
      accessLevel: "Confidential"
    },
    documentManagement: {
      fileTypes: ["All Document Types"],
      storage: "Multi-tiered Encrypted Storage",
      maxSize: "50MB",
      validationRules: ["Integrity Check", "Classification", "Access Logging"]
    }
  },
  {
    id: "WF-006",
    name: "Document Expiry Alerts",
    type: "Notification",
    status: "Active",
    triggers: ["30 Days Before Expiry", "15 Days Before Expiry", "5 Days Before Expiry"],
    actions: [
      "Check Document Database",
      "Generate Alerts List",
      "Send Multi-channel Notifications",
      "Escalate Unacknowledged Alerts"
    ],
    lastRun: "2024-03-15 13:30",
    nextRun: "2024-03-16 08:00",
    successRate: 99.5,
    totalExecutions: 450,
    averageTime: "25s",
    notifications: {
      channels: ["Email", "SMS", "WhatsApp", "System Alert"],
      recipients: ["Document Owner", "Supervisor", "Compliance Team"],
      priority: "High"
    }
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Document":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "Payment":
      return <Send className="h-4 w-4 text-green-500" />;
    case "Notification":
      return <Bell className="h-4 w-4 text-purple-500" />;
    case "Integration":
      return <RefreshCw className="h-4 w-4 text-orange-500" />;
    case "Security":
      return <Shield className="h-4 w-4 text-red-500" />;
    default:
      return <Workflow className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Paused":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Draft":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Error":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <Play className="h-4 w-4 text-green-500" />;
    case "Paused":
      return <Pause className="h-4 w-4 text-yellow-500" />;
    case "Draft":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "Error":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

export default function AutomationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("workflows");

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || workflow.type === typeFilter;
    const matchesStatus = statusFilter === "all" || workflow.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Digital Automation</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <div className="flex overflow-auto pb-2">
        <div className="flex border-b w-full">
          <button
            onClick={() => setActiveTab("workflows")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "workflows"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            Workflows
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
            Document Management
          </button>
          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "notifications"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap flex items-center ${
              activeTab === "security"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Shield className="mr-2 h-4 w-4" />
            Security & Privacy
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.filter(w => w.status === "Active").length}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Running smoothly
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
            <div className="text-2xl font-bold text-green-600">
              {Math.round(workflows.reduce((acc, w) => acc + w.successRate, 0) / workflows.length)}%
            </div>
            <p className="text-xs text-muted-foreground pt-1">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Executions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workflows.reduce((acc, w) => acc + w.totalExecutions, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Average Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45s</div>
            <p className="text-xs text-muted-foreground pt-1">
              Per workflow
            </p>
          </CardContent>
        </Card>
      </div>

      {activeTab === "workflows" && (
        <>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search workflows..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-36 sm:w-44">
                  <div className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Document">Document</SelectItem>
                  <SelectItem value="Payment">Payment</SelectItem>
                  <SelectItem value="Notification">Notification</SelectItem>
                  <SelectItem value="Integration">Integration</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
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
                  <SelectItem value="Paused">Paused</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Error">Error</SelectItem>
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
                    <TableHead>Workflow</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkflows.map((workflow) => (
                    <TableRow key={workflow.id}>
                      <TableCell className="font-medium">{workflow.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{workflow.name}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {workflow.triggers.map((trigger, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {trigger}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(workflow.type)}
                          <span>{workflow.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>Success Rate</span>
                            <span>{workflow.successRate}%</span>
                          </div>
                          <Progress 
                            value={workflow.successRate} 
                            className="h-2" 
                          />
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            Avg: {workflow.averageTime}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{workflow.lastRun}</div>
                          {workflow.nextRun && (
                            <div className="text-xs text-muted-foreground">
                              Next: {workflow.nextRun}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(workflow.status)}
                          <Badge className={getStatusColor(workflow.status)}>
                            {workflow.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <History className="mr-2 h-4 w-4" />
                            Logs
                          </Button>
                          <Button size="sm">
                            <Cog className="mr-2 h-4 w-4" />
                            Configure
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
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-green-100 p-2 rounded-full">
                      <FileCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Document Verification</div>
                      <div className="text-sm text-muted-foreground">
                        Successfully processed 25 documents
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      5m ago
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-red-100 p-2 rounded-full">
                      <FileWarning className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">MOLS Integration</div>
                      <div className="text-sm text-muted-foreground">
                        API connection timeout
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      15m ago
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Send className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">Notifications</div>
                      <div className="text-sm text-muted-foreground">
                        Sent 150 status updates
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      30m ago
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">API Response Time</span>
                      <span className="text-sm text-muted-foreground">250ms</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Queue Processing</span>
                      <span className="text-sm text-muted-foreground">45/50</span>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Storage Usage</span>
                      <span className="text-sm text-muted-foreground">75%</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Security Status</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Secure</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Encryption</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === "security" && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Security & Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border rounded-lg p-4 bg-green-50">
                    <h3 className="font-medium flex items-center mb-3">
                      <Shield className="h-5 w-5 text-green-600 mr-2" />
                      Encryption Protocols
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Document Encryption</span>
                        <Badge className="bg-green-100 text-green-800">AES-256</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Payment Data</span>
                        <Badge className="bg-green-100 text-green-800">PCI DSS Compliant</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Communication</span>
                        <Badge className="bg-green-100 text-green-800">TLS 1.3</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Database</span>
                        <Badge className="bg-green-100 text-green-800">Field-level Encryption</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <h3 className="font-medium flex items-center mb-3">
                      <Lock className="h-5 w-5 text-blue-600 mr-2" />
                      Access Controls
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Multi-factor Authentication</span>
                        <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Role-based Access</span>
                        <Badge className="bg-blue-100 text-blue-800">Enforced</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Session Timeouts</span>
                        <Badge className="bg-blue-100 text-blue-800">30 Minutes</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Automated Log Analysis</span>
                        <Badge className="bg-blue-100 text-blue-800">Real-time</Badge>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Data Retention Policies</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-muted-foreground">Document Type</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Retention Period</div>
                      </div>
                      <div>
                        <div className="font-medium text-muted-foreground">Disposal Method</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm border-b pb-2">
                      <div>Personal Identification</div>
                      <div>5 years after contract end</div>
                      <div>Secure deletion</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm border-b pb-2">
                      <div>Financial Records</div>
                      <div>7 years</div>
                      <div>Encrypted archiving</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm border-b pb-2">
                      <div>Travel Documents</div>
                      <div>2 years after expiry</div>
                      <div>Secure deletion</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>Medical Records</div>
                      <div>10 years</div>
                      <div>Encrypted archiving</div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Security Compliance</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="p-3 border rounded bg-slate-50 text-center">
                      <div className="text-xs text-muted-foreground mb-1">GDPR</div>
                      <div className="font-medium text-green-600">Compliant</div>
                    </div>
                    <div className="p-3 border rounded bg-slate-50 text-center">
                      <div className="text-xs text-muted-foreground mb-1">ISO 27001</div>
                      <div className="font-medium text-green-600">Certified</div>
                    </div>
                    <div className="p-3 border rounded bg-slate-50 text-center">
                      <div className="text-xs text-muted-foreground mb-1">SOC 2</div>
                      <div className="font-medium text-green-600">Compliant</div>
                    </div>
                    <div className="p-3 border rounded bg-slate-50 text-center">
                      <div className="text-xs text-muted-foreground mb-1">PCI DSS</div>
                      <div className="font-medium text-green-600">Level 1</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Other tabs will be added here */}
    </div>
  );
}