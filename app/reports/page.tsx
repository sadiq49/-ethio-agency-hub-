"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { DatePickerWithRange } from "@/components/dashboard/date-range-picker";
import { 
  Search, 
  Filter, 
  Download,
  FileText,
  BarChart2,
  PieChart,
  TrendingUp,
  Users,
  Calendar,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  FileWarning,
  Building2,
  Globe,
  DollarSign,
  Share2
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Report {
  id: string;
  name: string;
  type: "Analytics" | "Financial" | "Compliance" | "Performance";
  category: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  lastGenerated: string;
  nextScheduled?: string;
  status: "Generated" | "Scheduled" | "Processing" | "Failed";
  metrics: {
    name: string;
    value: number;
    change: number;
    trend: "up" | "down" | "neutral";
  }[];
}

const reports: Report[] = [
  {
    id: "REP-2024-001",
    name: "Worker Deployment Analytics",
    type: "Analytics",
    category: "Operations",
    frequency: "Daily",
    lastGenerated: "2024-03-15 14:30",
    nextScheduled: "2024-03-16 14:30",
    status: "Generated",
    metrics: [
      {
        name: "Total Deployments",
        value: 1250,
        change: 15,
        trend: "up"
      },
      {
        name: "Success Rate",
        value: 92,
        change: 3,
        trend: "up"
      },
      {
        name: "Processing Time",
        value: 45,
        change: -5,
        trend: "down"
      }
    ]
  },
  {
    id: "REP-2024-002",
    name: "Financial Performance",
    type: "Financial",
    category: "Finance",
    frequency: "Monthly",
    lastGenerated: "2024-03-01 09:00",
    nextScheduled: "2024-04-01 09:00",
    status: "Generated",
    metrics: [
      {
        name: "Revenue",
        value: 450000,
        change: 12,
        trend: "up"
      },
      {
        name: "Expenses",
        value: 280000,
        change: 5,
        trend: "up"
      },
      {
        name: "Profit Margin",
        value: 37,
        change: 2,
        trend: "up"
      }
    ]
  },
  {
    id: "REP-2024-003",
    name: "Compliance Audit",
    type: "Compliance",
    category: "Legal",
    frequency: "Quarterly",
    lastGenerated: "2024-03-10 11:15",
    status: "Processing",
    metrics: [
      {
        name: "Compliance Score",
        value: 95,
        change: 0,
        trend: "neutral"
      },
      {
        name: "Violations",
        value: 3,
        change: -2,
        trend: "down"
      },
      {
        name: "Resolution Time",
        value: 72,
        change: -12,
        trend: "down"
      }
    ]
  }
];

const performanceData = [
  { month: "Jan", Workers: 65, Success: 55, Issues: 10 },
  { month: "Feb", Workers: 72, Success: 62, Issues: 10 },
  { month: "Mar", Workers: 85, Success: 75, Issues: 10 },
  { month: "Apr", Workers: 78, Success: 70, Issues: 8 },
  { month: "May", Workers: 90, Success: 82, Issues: 8 },
  { month: "Jun", Workers: 95, Success: 88, Issues: 7 }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Generated":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Scheduled":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Processing":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Generated":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "Scheduled":
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case "Processing":
      return <RefreshCw className="h-4 w-4 text-yellow-500" />;
    case "Failed":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "up":
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case "down":
      return <TrendingUp className="h-4 w-4 text-red-500 transform rotate-180" />;
    default:
      return <TrendingUp className="h-4 w-4 text-gray-500 transform rotate-90" />;
  }
};

export default function ReportsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(),
    to: undefined,
  });

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Reports & Analytics</h1>
        <div className="flex gap-2">
          <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground pt-1">
              Generated this month
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
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground pt-1">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45s</div>
            <p className="text-xs text-muted-foreground pt-1">
              Average generation time
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Scheduled Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">12</div>
            <p className="text-xs text-muted-foreground pt-1">
              Next 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    className="text-xs"
                    stroke="#888888"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    className="text-xs"
                    stroke="#888888"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="Workers"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                  />
                  <Area
                    type="monotone"
                    dataKey="Success"
                    stackId="1"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                  />
                  <Area
                    type="monotone"
                    dataKey="Issues"
                    stackId="1"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports[0].metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{metric.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {getTrendIcon(metric.trend)}
                      <span className={`text-sm ${
                        metric.trend === "up" ? "text-green-600" :
                        metric.trend === "down" ? "text-red-600" :
                        "text-gray-600"
                      }`}>
                        {metric.change > 0 ? "+" : ""}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold">
                    {metric.value}
                    {metric.name.includes("Rate") || metric.name.includes("Margin") ? "%" : ""}
                  </div>
                </div>
              ))}
            </div>
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 sm:w-44">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Analytics">Analytics</SelectItem>
              <SelectItem value="Financial">Financial</SelectItem>
              <SelectItem value="Compliance">Compliance</SelectItem>
              <SelectItem value="Performance">Performance</SelectItem>
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
                <TableHead>Report</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Next Scheduled</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {report.category}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{report.frequency}</TableCell>
                  <TableCell>{report.lastGenerated}</TableCell>
                  <TableCell>
                    {report.nextScheduled || "Not scheduled"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(report.status)}
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        <Share2 className="mr-2 h-4 w-4" />
                        Share
                      </Button>
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
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
            <CardTitle>Report Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-blue-100 p-2 rounded-full">
                  <BarChart2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Analytics Reports</div>
                    <Badge variant="outline">45 Reports</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Performance and trend analysis
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Financial Reports</div>
                    <Badge variant="outline">32 Reports</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Revenue and expense tracking
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Building2 className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Compliance Reports</div>
                    <Badge variant="outline">28 Reports</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Regulatory compliance tracking
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-green-100 p-2 rounded-full">
                  <FileCheck className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Monthly Performance Report</div>
                  <div className="text-sm text-muted-foreground">
                    Generated successfully
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
                  <div className="font-medium">Financial Analysis</div>
                  <div className="text-sm text-muted-foreground">
                    Processing in progress
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  5h ago
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="bg-red-100 p-2 rounded-full">
                  <FileWarning className="h-4 w-4 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Compliance Audit Report</div>
                  <div className="text-sm text-muted-foreground">
                    Generation failed
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  1d ago
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}