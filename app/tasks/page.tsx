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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  PlusCircle,
  Plane,
  FileText,
  UserCheck,
  Building2,
  Send,
  Timer,
  Bell,
  CalendarClock,
  FileWarning,
  Users
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  type: "Document" | "Visa" | "Flight" | "Training" | "Meeting" | "Other";
  priority: "High" | "Medium" | "Low";
  status: "Pending" | "In Progress" | "Completed" | "Overdue";
  dueTime: string;
  dueDate: string;
  assignedTo?: string;
  relatedTo?: {
    type: "Worker" | "Document" | "Flight";
    id: string;
    name: string;
  };
  description?: string;
  checklist?: {
    item: string;
    completed: boolean;
  }[];
}

const tasks: Task[] = [
  {
    id: "TSK-2024-001",
    title: "Submit MOLS documents for Amina Hassan",
    type: "Document",
    priority: "High",
    status: "Pending",
    dueTime: "10:00 AM",
    dueDate: "2024-04-04",
    assignedTo: "Sarah Ahmed",
    relatedTo: {
      type: "Worker",
      id: "W1001",
      name: "Amina Hassan"
    },
    description: "Submit all required documents to MOLS for final approval",
    checklist: [
      { item: "Verify passport copy", completed: true },
      { item: "Check medical certificate", completed: true },
      { item: "Validate contract", completed: false },
      { item: "Prepare cover letter", completed: true }
    ]
  },
  {
    id: "TSK-2024-002",
    title: "Flight check-in for today's departures",
    type: "Flight",
    priority: "High",
    status: "In Progress",
    dueTime: "12:00 PM",
    dueDate: "2024-04-04",
    assignedTo: "Mohammed Ali",
    description: "Complete online check-in for all workers departing today",
    checklist: [
      { item: "Verify travel documents", completed: true },
      { item: "Check baggage allowance", completed: true },
      { item: "Print boarding passes", completed: false },
      { item: "Arrange airport transport", completed: false }
    ]
  },
  {
    id: "TSK-2024-003",
    title: "Visa status follow-up",
    type: "Visa",
    priority: "Medium",
    status: "Pending",
    dueTime: "02:00 PM",
    dueDate: "2024-04-04",
    assignedTo: "Fatima Omar",
    description: "Follow up on pending visa applications at the embassy",
    checklist: [
      { item: "Call embassy", completed: false },
      { item: "Update tracking system", completed: false },
      { item: "Notify relevant parties", completed: false }
    ]
  },
  {
    id: "TSK-2024-004",
    title: "Pre-departure orientation",
    type: "Training",
    priority: "High",
    status: "Pending",
    dueTime: "03:30 PM",
    dueDate: "2024-04-04",
    assignedTo: "Ahmed Hassan",
    relatedTo: {
      type: "Worker",
      id: "W1002",
      name: "Sara Ahmed"
    },
    description: "Conduct final orientation session for departing workers",
    checklist: [
      { item: "Prepare materials", completed: true },
      { item: "Set up training room", completed: false },
      { item: "Take attendance", completed: false },
      { item: "Distribute handouts", completed: false }
    ]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Document":
      return <FileText className="h-4 w-4 text-blue-500" />;
    case "Visa":
      return <FileWarning className="h-4 w-4 text-purple-500" />;
    case "Flight":
      return <Plane className="h-4 w-4 text-green-500" />;
    case "Training":
      return <Users className="h-4 w-4 text-orange-500" />;
    case "Meeting":
      return <UserCheck className="h-4 w-4 text-indigo-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "Overdue":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "In Progress":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "Pending":
      return <Timer className="h-4 w-4 text-yellow-500" />;
    case "Overdue":
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

function TodayTasks({ tasks, onSelectTask }: { tasks: Task[], onSelectTask: (task: Task) => void }) {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Time</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Calendar className="h-8 w-8 mb-2" />
                    <p>No tasks scheduled for today</p>
                    <p className="text-sm">Add a new task to get started</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{task.dueTime}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{task.title}</div>
                      {task.relatedTo && (
                        <div className="text-xs text-muted-foreground">
                          Related to: {task.relatedTo.name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(task.type)}
                      <span>{task.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.checklist && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>
                            {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
                          </span>
                        </div>
                        <Progress 
                          value={task.checklist.filter(item => item.completed).length / task.checklist.length * 100} 
                          className="h-2" 
                        />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(task.status)}
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(task.status)}`}>
                        {task.status}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onSelectTask(task)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Details
                      </Button>
                      <Button size="sm">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<"today" | "list">("today");

  // Get today's date for filtering
  const today = new Date().toISOString().split('T')[0]; // format: YYYY-MM-DD

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || task.type === typeFilter;
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    // If in today view, only show tasks due today
    const matchesToday = viewMode === "list" || task.dueDate === today;
    
    return matchesSearch && matchesType && matchesStatus && matchesToday;
  });

  // Calculate statistics
  const totalTasks = tasks.filter(t => t.dueDate === today).length;
  const completedTasks = tasks.filter(t => t.dueDate === today && t.status === "Completed").length;
  const inProgressTasks = tasks.filter(t => t.dueDate === today && t.status === "In Progress").length;
  const overdueTasks = tasks.filter(t => t.dueDate === today && t.status === "Overdue").length;
  const pendingTasks = tasks.filter(t => t.dueDate === today && t.status === "Pending").length;
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Today's Tasks</h1>
            <p className="text-sm text-indigo-100 mt-1">
              Keep track of all agency tasks and ensure timely completion
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setViewMode("today")}>
              <Calendar className="mr-2 h-4 w-4" />
              Today's View
            </Button>
            <Button variant="secondary" onClick={() => setViewMode("list")}>
              <FileText className="mr-2 h-4 w-4" />
              List View
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Banner */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <CardContent className="py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4">
                <Bell className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="font-semibold text-indigo-900">
                  Today's Task Summary ({completedTasks}/{totalTasks})
                </h2>
                <p className="text-sm text-indigo-700">
                  {completedTasks} completed • {inProgressTasks} in progress • {pendingTasks} pending • {overdueTasks} overdue
                </p>
              </div>
            </div>
            <div>
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTasks}</div>
            <p className="text-xs text-muted-foreground pt-1">
              For today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-xs text-muted-foreground pt-1">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Being worked on
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
            <p className="text-xs text-muted-foreground pt-1">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
              <SelectItem value="Document">Document</SelectItem>
              <SelectItem value="Visa">Visa</SelectItem>
              <SelectItem value="Flight">Flight</SelectItem>
              <SelectItem value="Training">Training</SelectItem>
              <SelectItem value="Interview">Interview</SelectItem>
              <SelectItem value="Ticket">Ticket</SelectItem>
              <SelectItem value="Meeting">Meeting</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
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
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === "today" ? (
        <TodayTasks 
          tasks={filteredTasks} 
          onSelectTask={setSelectedTask} 
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Due Time</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Search className="h-8 w-8 mb-2" />
                        <p>No tasks found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{task.title}</div>
                          {task.relatedTo && (
                            <div className="text-xs text-muted-foreground">
                              Related to: {task.relatedTo.name}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(task.type)}
                          <span>{task.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{task.dueTime}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {task.checklist && (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Progress</span>
                              <span>
                                {task.checklist.filter(item => item.completed).length}/{task.checklist.length}
                              </span>
                            </div>
                            <Progress 
                              value={task.checklist.filter(item => item.completed).length / task.checklist.length * 100} 
                              className="h-2" 
                            />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(task.status)}
                          <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(task.status)}`}>
                            {task.status}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Details
                          </Button>
                          <Button size="sm">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Complete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
            <DialogDescription>
              View and manage task details and progress
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-4">Task Information</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Priority</span>
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getPriorityColor(selectedTask.priority)}`}>
                        {selectedTask.priority}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Due at {selectedTask.dueTime}</span>
                    </div>
                    {selectedTask.assignedTo && (
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                        <span>Assigned to {selectedTask.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedTask.relatedTo && (
                  <div>
                    <h4 className="font-medium mb-4">Related Information</h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedTask.relatedTo.type}: {selectedTask.relatedTo.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {selectedTask.checklist && (
                <div>
                  <h4 className="font-medium mb-4">Task Checklist</h4>
                  <div className="space-y-2">
                    {selectedTask.checklist.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg border">
                        <span>{item.item}</span>
                        {item.completed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t flex justify-end gap-2">
                <Button variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  Set Reminder
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Complete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}