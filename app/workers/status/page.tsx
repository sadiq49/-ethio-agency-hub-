"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Filter, 
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
  UserCheck,
  Plane,
  UserX,
  RefreshCw,
  CalendarClock,
  ArrowLeftRight,
  FileWarning,
  Building2,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";

interface Worker {
  id: string;
  name: string;
  destination: string;
  status: "Waiting" | "In Process" | "Today Flying" | "Abroad" | "Return" | "Extend" | "Terminate" | "Missing";
  employer?: string;
  contractDuration?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  contact?: string;
  milestones: {
    registration: boolean;
    documents: boolean;
    training: boolean;
    visa: boolean;
    contract: boolean;
    travel: boolean;
  };
  history: {
    date: string;
    status: string;
    description: string;
  }[];
  lastUpdate: string;
  remarks?: string;
}

const workers: Worker[] = [
  {
    id: "W1001",
    name: "Amina Hassan",
    destination: "Saudi Arabia",
    status: "Abroad",
    employer: "Al Safwa Household",
    contractDuration: "2 years",
    startDate: "2024-01-15",
    endDate: "2026-01-14",
    location: "Riyadh",
    contact: "+966-50-1234567",
    milestones: {
      registration: true,
      documents: true,
      training: true,
      visa: true,
      contract: true,
      travel: true
    },
    history: [
      {
        date: "2024-01-15",
        status: "Abroad",
        description: "Successfully arrived at destination"
      },
      {
        date: "2024-01-14",
        status: "Today Flying",
        description: "Departed from Addis Ababa"
      },
      {
        date: "2024-01-10",
        status: "In Process",
        description: "Visa approved"
      }
    ],
    lastUpdate: "2024-03-15"
  },
  {
    id: "W1002",
    name: "Fatima Omar",
    destination: "Dubai",
    status: "In Process",
    milestones: {
      registration: true,
      documents: true,
      training: true,
      visa: false,
      contract: false,
      travel: false
    },
    history: [
      {
        date: "2024-03-10",
        status: "In Process",
        description: "Visa application submitted"
      },
      {
        date: "2024-03-05",
        status: "In Process",
        description: "Training completed"
      },
      {
        date: "2024-03-01",
        status: "Waiting",
        description: "Initial registration"
      }
    ],
    lastUpdate: "2024-03-10",
    remarks: "Awaiting visa approval"
  },
  {
    id: "W1003",
    name: "Sara Ahmed",
    destination: "Kuwait",
    status: "Missing",
    employer: "Kuwait Household Services",
    contractDuration: "2 years",
    startDate: "2023-06-15",
    endDate: "2025-06-14",
    location: "Kuwait City",
    milestones: {
      registration: true,
      documents: true,
      training: true,
      visa: true,
      contract: true,
      travel: true
    },
    history: [
      {
        date: "2024-03-01",
        status: "Missing",
        description: "Lost contact with worker"
      },
      {
        date: "2023-06-15",
        status: "Abroad",
        description: "Started employment"
      }
    ],
    lastUpdate: "2024-03-01",
    remarks: "Investigation ongoing"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Waiting":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    case "In Process":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Today Flying":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Abroad":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Return":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    case "Extend":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
    case "Terminate":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Missing":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Waiting":
      return <Clock className="h-4 w-4 text-gray-500" />;
    case "In Process":
      return <RefreshCw className="h-4 w-4 text-yellow-500" />;
    case "Today Flying":
      return <Plane className="h-4 w-4 text-blue-500" />;
    case "Abroad":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "Return":
      return <ArrowLeftRight className="h-4 w-4 text-purple-500" />;
    case "Extend":
      return <CalendarClock className="h-4 w-4 text-indigo-500" />;
    case "Terminate":
      return <FileWarning className="h-4 w-4 text-red-500" />;
    case "Missing":
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    default:
      return null;
  }
};

// Custom StatusBadge component to replace Badge
function StatusBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className || ''}`}>
      {children}
    </div>
  );
}

export default function StatusTrackingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [destinationFilter, setDestinationFilter] = useState("all");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  // Helper function to check if a date is within range
  const isDateInRange = (dateStr: string, range: string): boolean => {
    if (range === "all") return true;
    
    const date = new Date(dateStr);
    const today = new Date();
    
    switch (range) {
      case "today":
        return date.toDateString() === today.toDateString();
      case "week": {
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        return date >= weekStart;
      }
      case "month": {
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return date >= monthStart;
      }
      default:
        return true;
    }
  };

  const filteredWorkers = workers.filter((worker) => {
    const matchesSearch =
      worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      worker.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || worker.status === statusFilter;
    const matchesDestination = 
      destinationFilter === "all" || 
      (destinationFilter === "saudi" && worker.destination === "Saudi Arabia") ||
      (destinationFilter === "uae" && worker.destination === "Dubai") ||
      (destinationFilter === "kuwait" && worker.destination === "Kuwait") ||
      (destinationFilter === "qatar" && worker.destination === "Qatar") ||
      (destinationFilter === "bahrain" && worker.destination === "Bahrain");
    
    const matchesDateRange = isDateInRange(worker.lastUpdate, dateRangeFilter);
    
    return matchesSearch && matchesStatus && matchesDestination && matchesDateRange;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Status Tracking</h1>
            <p className="text-sm text-indigo-100 mt-1">Monitor worker status throughout the employment lifecycle</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary">
              <History className="mr-2 h-4 w-4" />
              Status History
            </Button>
            <Button variant="secondary">
              <FileText className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-slate-50 to-slate-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Workers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,453</div>
            <p className="text-xs text-muted-foreground pt-1">
              Active contracts
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Abroad
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1,892</div>
            <p className="text-xs text-muted-foreground pt-1">
              Currently employed
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              In Process
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">345</div>
            <p className="text-xs text-muted-foreground pt-1">
              Under processing
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-muted-foreground pt-1">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Breakdown of current worker statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-gray-50">
                  <Clock className="h-8 w-8 text-gray-500 mb-2" />
                  <div className="text-2xl font-bold">157</div>
                  <div className="text-sm text-muted-foreground text-center">Waiting</div>
                  <div className="w-full mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-500" style={{ width: '7%' }}></div>
                    </div>
                    <div className="text-xs text-right text-muted-foreground mt-1">7%</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-yellow-50">
                  <RefreshCw className="h-8 w-8 text-yellow-500 mb-2" />
                  <div className="text-2xl font-bold">345</div>
                  <div className="text-sm text-muted-foreground text-center">In Process</div>
                  <div className="w-full mt-2">
                    <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: '14%' }}></div>
                    </div>
                    <div className="text-xs text-right text-muted-foreground mt-1">14%</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-blue-50">
                  <Plane className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="text-2xl font-bold">32</div>
                  <div className="text-sm text-muted-foreground text-center">Today Flying</div>
                  <div className="w-full mt-2">
                    <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: '1%' }}></div>
                    </div>
                    <div className="text-xs text-right text-muted-foreground mt-1">1%</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-green-50">
                  <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                  <div className="text-2xl font-bold">1,892</div>
                  <div className="text-sm text-muted-foreground text-center">Abroad</div>
                  <div className="w-full mt-2">
                    <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '77%' }}></div>
                    </div>
                    <div className="text-xs text-right text-muted-foreground mt-1">77%</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center p-4 rounded-lg bg-purple-50">
                  <ArrowLeftRight className="h-8 w-8 text-purple-500 mb-2" />
                  <div className="text-xl font-medium">12</div>
                  <div className="text-sm text-muted-foreground text-center">Return</div>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-indigo-50">
                  <CalendarClock className="h-8 w-8 text-indigo-500 mb-2" />
                  <div className="text-xl font-medium">8</div>
                  <div className="text-sm text-muted-foreground text-center">Extend</div>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-red-50">
                  <FileWarning className="h-8 w-8 text-red-500 mb-2" />
                  <div className="text-xl font-medium">5</div>
                  <div className="text-sm text-muted-foreground text-center">Terminate</div>
                </div>
                
                <div className="flex flex-col items-center p-4 rounded-lg bg-orange-50">
                  <AlertCircle className="h-8 w-8 text-orange-500 mb-2" />
                  <div className="text-xl font-medium">2</div>
                  <div className="text-sm text-muted-foreground text-center">Missing</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Workers with status changes in next 14 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              <div className="flex items-start gap-3 p-3 border border-blue-100 bg-blue-50 rounded-md">
                <div className="flex-shrink-0 mt-1">
                  <Plane className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="font-medium">Ahmed Hassan (W1234)</div>
                  <div className="text-sm text-muted-foreground">Flying to Saudi Arabia</div>
                  <div className="text-xs text-blue-600 mt-2">
                    Tomorrow - 10:45 AM - SV843
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border border-yellow-100 bg-yellow-50 rounded-md">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="font-medium">Fatima Omar (W1002)</div>
                  <div className="text-sm text-muted-foreground">Visa expected approval</div>
                  <div className="text-xs text-yellow-600 mt-2">
                    In 2 days
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border border-indigo-100 bg-indigo-50 rounded-md">
                <div className="flex-shrink-0 mt-1">
                  <CalendarClock className="h-5 w-5 text-indigo-500" />
                </div>
                <div>
                  <div className="font-medium">Maria Garcia (W1001)</div>
                  <div className="text-sm text-muted-foreground">Contract extension due</div>
                  <div className="text-xs text-indigo-600 mt-2">
                    In 5 days
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border border-green-100 bg-green-50 rounded-md">
                <div className="flex-shrink-0 mt-1">
                  <UserCheck className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="font-medium">John Smith (W1054)</div>
                  <div className="text-sm text-muted-foreground">Probation period ending</div>
                  <div className="text-xs text-green-600 mt-2">
                    In 1 week
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 border border-purple-100 bg-purple-50 rounded-md">
                <div className="flex-shrink-0 mt-1">
                  <ArrowLeftRight className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <div className="font-medium">Amina Hassan (W1001)</div>
                  <div className="text-sm text-muted-foreground">Expected return date</div>
                  <div className="text-xs text-purple-600 mt-2">
                    In 12 days
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="w-full md:w-72 space-y-2">
              <Label htmlFor="search-workers">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-workers"
                  type="search"
                  placeholder="Search workers..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="space-y-2">
                <Label htmlFor="status-filter">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Waiting">Waiting</SelectItem>
                    <SelectItem value="In Process">In Process</SelectItem>
                    <SelectItem value="Today Flying">Today Flying</SelectItem>
                    <SelectItem value="Abroad">Abroad</SelectItem>
                    <SelectItem value="Return">Return</SelectItem>
                    <SelectItem value="Extend">Extend</SelectItem>
                    <SelectItem value="Terminate">Terminate</SelectItem>
                    <SelectItem value="Missing">Missing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination-filter">Destination</Label>
                <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                  <SelectTrigger id="destination-filter">
                    <SelectValue placeholder="Destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Destinations</SelectItem>
                    <SelectItem value="saudi">Saudi Arabia</SelectItem>
                    <SelectItem value="uae">UAE</SelectItem>
                    <SelectItem value="kuwait">Kuwait</SelectItem>
                    <SelectItem value="qatar">Qatar</SelectItem>
                    <SelectItem value="bahrain">Bahrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRangeFilter} onValueChange={setDateRangeFilter}>
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Date Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Worker</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Milestones</TableHead>
                <TableHead>Contract Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.id}</TableCell>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell>{worker.destination}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>Progress</span>
                        <span>
                          {Object.values(worker.milestones).filter(Boolean).length}/6
                        </span>
                      </div>
                      <Progress 
                        value={Object.values(worker.milestones).filter(Boolean).length / 6 * 100} 
                        className="h-2" 
                      />
                      <div className="flex gap-1 mt-1">
                        {Object.entries(worker.milestones).map(([key, value]) => (
                          value ? 
                          <CheckCircle2 key={key} className="h-3 w-3 text-green-500" /> :
                          <AlertCircle key={key} className="h-3 w-3 text-muted-foreground" />
                        ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {worker.startDate && worker.endDate ? (
                      <div className="text-sm">
                        <div>{worker.startDate}</div>
                        <div className="text-muted-foreground">{worker.endDate}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not started</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(worker.status)}
                      <div>
                        <StatusBadge className={getStatusColor(worker.status)}>
                          <span>{worker.status}</span>
                        </StatusBadge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{worker.lastUpdate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedWorker(worker)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                      <Button size="sm">
                        <RefreshCw className="mr-2 h-4 w-4" />
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

      <Dialog open={!!selectedWorker} onOpenChange={() => setSelectedWorker(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Worker Status Details</DialogTitle>
            <DialogDescription>
              View complete status history and details
            </DialogDescription>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Current Status</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <StatusBadge className={getStatusColor(selectedWorker.status)}>
                        <span className="flex items-center">
                          {getStatusIcon(selectedWorker.status)}
                          <span className="ml-1">{selectedWorker.status}</span>
                        </span>
                      </StatusBadge>
                    </div>
                    {selectedWorker.employer && (
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedWorker.employer}</span>
                      </div>
                    )}
                    {selectedWorker.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedWorker.location}</span>
                      </div>
                    )}
                    {selectedWorker.contact && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedWorker.contact}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Contract Details</h4>
                  <div className="space-y-4">
                    {selectedWorker.contractDuration && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Duration: {selectedWorker.contractDuration}</span>
                      </div>
                    )}
                    {selectedWorker.startDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Start: {selectedWorker.startDate}</span>
                      </div>
                    )}
                    {selectedWorker.endDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>End: {selectedWorker.endDate}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Status History</h4>
                <div className="space-y-4">
                  {selectedWorker.history.map((event: { status: string; date: string; description: string }, index: number) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                      <div className="flex-shrink-0">
                        {getStatusIcon(event.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <StatusBadge className={getStatusColor(event.status)}>
                            <span>{event.status}</span>
                          </StatusBadge>
                          <span className="text-sm text-muted-foreground">
                            {event.date}
                          </span>
                        </div>
                        <p className="mt-1 text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}