import { CheckCircle2, Clock, Hourglass, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Task {
  title: string;
  time: string;
  status: "pending" | "completed" | "overdue" | "canceled";
  priority: "low" | "medium" | "high";
}

const tasks: Task[] = [
  {
    title: "Review worker documents for MOLS submission",
    time: "9:00 AM",
    status: "completed",
    priority: "high",
  },
  {
    title: "Contact embassy for visa status update",
    time: "11:00 AM",
    status: "pending",
    priority: "medium",
  },
  {
    title: "Prepare for today's departures",
    time: "1:00 PM",
    status: "pending",
    priority: "high",
  },
  {
    title: "Submit missing document reports",
    time: "9:30 AM",
    status: "overdue",
    priority: "medium",
  },
  {
    title: "Update worker statuses in system",
    time: "4:30 PM",
    status: "pending",
    priority: "low",
  },
];

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return "text-red-500 bg-red-50 dark:bg-red-950/30";
    case "medium":
      return "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/30";
    case "low":
      return "text-blue-500 bg-blue-50 dark:bg-blue-950/30";
    default:
      return "text-gray-500 bg-gray-50 dark:bg-gray-800";
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "overdue":
      return <Hourglass className="h-4 w-4 text-red-500" />;
    case "canceled":
      return <XCircle className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
}

export default function TodaysTasks() {
  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <div
          key={i}
          className={cn(
            "flex items-start justify-between space-y-0 rounded-md border p-3",
            task.status === "completed" && "opacity-60"
          )}
        >
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">{getStatusIcon(task.status)}</div>
            <div>
              <p className={cn(
                "font-medium leading-tight",
                task.status === "completed" && "line-through"
              )}>
                {task.title}
              </p>
              <div className="flex items-center space-x-2 pt-1">
                <p className="text-xs text-muted-foreground">{task.time}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    getPriorityColor(task.priority)
                  )}
                >
                  {task.priority}
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="sr-only">Options</span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
      ))}
    </div>
  );
}