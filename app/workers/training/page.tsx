"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  FileText,
  Users,
  Award,
  BookOpen,
  BarChart3,
  Globe,
  Building,
  PieChart,
  Pencil,
  Trash2,
  Download,
  ChevronRight,
  ExternalLink
} from "lucide-react";

interface Training {
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  participants: number;
  completionRate: number;
  trainer: string;
  location: string;
  description?: string;
  curriculum?: {
    module: string;
    duration: string;
    topics: string[];
  }[];
  assessments?: {
    name: string;
    type: string;
    passingScore: number;
  }[];
  materials?: string[];
}

interface Worker {
  id: string;
  name: string;
  avatar?: string;
  training: {
    completed: string[];
    ongoing: string[];
    scheduled: string[];
  };
  certifications: {
    name: string;
    issueDate: string;
    expiryDate: string;
    status: string;
    score?: number;
    certificate?: string; // URL to certificate
  }[];
  skills: {
    name: string;
    level: number; // 1-5
    verifiedBy?: string;
  }[];
  attendance?: {
    trainingId: string;
    present: number; // days present
    absent: number; // days absent
    late: number; // days late
  }[];
  performance?: {
    trainingId: string;
    score: number;
    feedback: string;
  }[];
}

const trainings: Training[] = [
  {
    id: "TR-2023-001",
    title: "Basic Arabic Language",
    type: "Language",
    startDate: "2023-12-01",
    endDate: "2023-12-15",
    status: "Completed",
    participants: 25,
    completionRate: 92,
    trainer: "Ahmed Mohammed",
    location: "Main Training Center",
    description: "Fundamental Arabic language training focused on everyday communication for workers in Middle Eastern countries.",
    curriculum: [
      {
        module: "Module 1: Greetings & Basic Phrases",
        duration: "3 days",
        topics: ["Common greetings", "Self-introduction", "Numbers and time"]
      },
      {
        module: "Module 2: Household Terms",
        duration: "4 days",
        topics: ["Kitchen vocabulary", "Cleaning terminology", "Basic instructions"]
      },
      {
        module: "Module 3: Practical Conversations",
        duration: "5 days",
        topics: ["Making requests", "Understanding directions", "Emergency phrases"]
      }
    ],
    assessments: [
      {
        name: "Oral Examination",
        type: "Speaking",
        passingScore: 70
      },
      {
        name: "Written Test",
        type: "Written",
        passingScore: 65
      }
    ],
    materials: ["Textbook: Arabic for Beginners", "Audio files pack", "Flashcards set"]
  },
  {
    id: "TR-2023-002",
    title: "Housekeeping Skills",
    type: "Professional",
    startDate: "2023-12-10",
    endDate: "2023-12-25",
    status: "Ongoing",
    participants: 30,
    completionRate: 60,
    trainer: "Sarah Hassan",
    location: "Skills Development Center",
    description: "Comprehensive housekeeping training covering modern cleaning techniques, equipment operation, and service standards.",
    curriculum: [
      {
        module: "Module 1: Cleaning Fundamentals",
        duration: "4 days",
        topics: ["Cleaning agents", "Surface types", "Safety procedures"]
      },
      {
        module: "Module 2: Room Service",
        duration: "5 days",
        topics: ["Bedroom preparation", "Bathroom sanitization", "Turndown service"]
      },
      {
        module: "Module 3: Special Cleaning",
        duration: "3 days",
        topics: ["Stain removal", "Carpet care", "Delicate item handling"]
      }
    ]
  },
  {
    id: "TR-2023-003",
    title: "Cultural Awareness",
    type: "Orientation",
    startDate: "2024-01-05",
    endDate: "2024-01-10",
    status: "Scheduled",
    participants: 40,
    completionRate: 0,
    trainer: "Fatima Ali",
    location: "Main Training Center",
    description: "Cultural training to prepare workers for adapting to Middle Eastern customs, traditions, and workplace expectations."
  },
  {
    id: "TR-2024-001",
    title: "Childcare Essentials",
    type: "Professional",
    startDate: "2024-01-15",
    endDate: "2024-01-30",
    status: "Scheduled",
    participants: 20,
    completionRate: 0,
    trainer: "Mariam Khalid",
    location: "Family Care Training Hub",
    description: "Training for nannies and childcare professionals covering child development, safety, activities, and nutrition."
  },
  {
    id: "TR-2024-002",
    title: "Advanced Arabic Communication",
    type: "Language",
    startDate: "2024-02-01",
    endDate: "2024-02-20",
    status: "Scheduled",
    participants: 15,
    completionRate: 0,
    trainer: "Ahmed Mohammed",
    location: "Language Institute",
    description: "Follow-up course for workers who completed basic Arabic, focusing on advanced communication skills."
  }
];

const workers: Worker[] = [
  {
    id: "W1001",
    name: "Amina Hassan",
    avatar: "/workers/amina.jpg",
    training: {
      completed: ["Basic Arabic Language", "Housekeeping Skills"],
      ongoing: ["Cultural Awareness"],
      scheduled: ["Customer Service"],
    },
    certifications: [
      {
        name: "Arabic Language Proficiency",
        issueDate: "2023-12-15",
        expiryDate: "2024-12-15",
        status: "Valid",
        score: 85,
        certificate: "/certificates/arabic-amina.pdf"
      },
      {
        name: "Professional Housekeeping",
        issueDate: "2023-11-30",
        expiryDate: "2024-11-30",
        status: "Valid",
        score: 92,
        certificate: "/certificates/housekeeping-amina.pdf"
      },
    ],
    skills: [
      { name: "Arabic Language", level: 4, verifiedBy: "Language Institute" },
      { name: "Housekeeping", level: 5, verifiedBy: "Skills Development Center" },
      { name: "Childcare", level: 3 }
    ],
    attendance: [
      { trainingId: "TR-2023-001", present: 14, absent: 0, late: 1 },
      { trainingId: "TR-2023-002", present: 15, absent: 0, late: 0 }
    ],
    performance: [
      { trainingId: "TR-2023-001", score: 85, feedback: "Excellent progress in pronunciation and vocabulary" },
      { trainingId: "TR-2023-002", score: 92, feedback: "Outstanding attention to detail and quick learner" }
    ]
  },
  {
    id: "W1002",
    name: "Fatima Omar",
    avatar: "/workers/fatima.jpg",
    training: {
      completed: ["Basic Arabic Language"],
      ongoing: ["Housekeeping Skills"],
      scheduled: ["Cultural Awareness"],
    },
    certifications: [
      {
        name: "Arabic Language Proficiency",
        issueDate: "2023-12-15",
        expiryDate: "2024-12-15",
        status: "Valid",
        score: 78,
        certificate: "/certificates/arabic-fatima.pdf"
      },
    ],
    skills: [
      { name: "Arabic Language", level: 3, verifiedBy: "Language Institute" },
      { name: "Cooking", level: 4 },
      { name: "Childcare", level: 4 }
    ],
    attendance: [
      { trainingId: "TR-2023-001", present: 13, absent: 1, late: 1 },
      { trainingId: "TR-2023-002", present: 10, absent: 0, late: 2 }
    ],
    performance: [
      { trainingId: "TR-2023-001", score: 78, feedback: "Good progress but needs more practice with conversation" }
    ]
  },
  {
    id: "W1003",
    name: "Mohammed Ali",
    avatar: "/workers/mohammed.jpg",
    training: {
      completed: ["Basic Arabic Language"],
      ongoing: ["Professional Driving"],
      scheduled: ["Cultural Awareness"],
    },
    certifications: [
      {
        name: "Arabic Language Proficiency",
        issueDate: "2023-12-15",
        expiryDate: "2024-12-15",
        status: "Valid",
        score: 82,
        certificate: "/certificates/arabic-mohammed.pdf"
      },
    ],
    skills: [
      { name: "Arabic Language", level: 4, verifiedBy: "Language Institute" },
      { name: "Driving", level: 5 },
      { name: "Security", level: 3 }
    ]
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300";
    case "Ongoing":
      return "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-300";
    case "Scheduled":
      return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-300";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300";
    case "Expired":
      return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900 dark:text-red-300";
    case "Valid":
      return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "Ongoing":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "Scheduled":
      return <Calendar className="h-4 w-4 text-yellow-500" />;
    case "Cancelled":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "Expired":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case "Valid":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    default:
      return null;
  }
};

export default function TrainingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTrainings = trainings.filter((training) => {
    const matchesSearch =
      training.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      training.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || training.status === statusFilter;
    const matchesType = typeFilter === "all" || training.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Training Management</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Training
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Trainings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground pt-1">
              3 starting this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground pt-1">
              +45 from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
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
              Certifications Issued
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">189</div>
            <p className="text-xs text-muted-foreground pt-1">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search trainings..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 sm:w-44">
              <div className="flex items-center">
                <GraduationCap className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Language">Language</SelectItem>
              <SelectItem value="Professional">Professional</SelectItem>
              <SelectItem value="Orientation">Orientation</SelectItem>
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
                <TableHead>Training</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Trainer</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell className="font-medium">{training.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{training.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {training.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{training.type}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{training.startDate}</div>
                      <div className="text-muted-foreground">{training.endDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-xs">
                        <span>{training.participants} participants</span>
                        <span>{training.completionRate}%</span>
                      </div>
                      <Progress value={training.completionRate} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(training.status)}
                      <Badge className={getStatusColor(training.status)}>
                        {training.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{training.trainer}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">View</Button>
                      <Button size="sm">Manage</Button>
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
            <CardTitle>Recent Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workers.map((worker) => (
                <div key={worker.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {worker.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{worker.name}</p>
                      <span className="text-xs text-muted-foreground">{worker.id}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {worker.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {cert.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Trainings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainings
                .filter((t) => t.status === "Scheduled")
                .map((training) => (
                  <div key={training.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{training.title}</p>
                        <Badge variant="outline">{training.participants} participants</Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Starts {training.startDate}
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