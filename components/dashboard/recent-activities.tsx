import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Activity {
  user: {
    name: string;
    avatar?: string;
    initials: string;
  };
  action: string;
  subject: string;
  timestamp: string;
  type: "worker" | "visa" | "document" | "system";
}

const activities: Activity[] = [
  {
    user: {
      name: "Sarah Ahmed",
      initials: "SA",
    },
    action: "updated",
    subject: "Fatima Omar",
    timestamp: "10 minutes ago",
    type: "worker",
  },
  {
    user: {
      name: "Mohammed Ali",
      initials: "MA",
    },
    action: "submitted",
    subject: "MOLS documents",
    timestamp: "32 minutes ago",
    type: "document",
  },
  {
    user: {
      name: "Aisha Hassan",
      initials: "AH",
    },
    action: "approved",
    subject: "visa application",
    timestamp: "1 hour ago",
    type: "visa",
  },
  {
    user: {
      name: "System",
      initials: "SY",
    },
    action: "flagged",
    subject: "expiring visa",
    timestamp: "2 hours ago",
    type: "system",
  },
  {
    user: {
      name: "Yusuf Ibrahim",
      initials: "YI",
    },
    action: "registered",
    subject: "new worker",
    timestamp: "3 hours ago",
    type: "worker",
  },
];

function getTypeColor(type: string) {
  switch (type) {
    case "worker":
      return "text-blue-500 bg-blue-50 dark:bg-blue-950/30";
    case "visa":
      return "text-green-500 bg-green-50 dark:bg-green-950/30";
    case "document":
      return "text-purple-500 bg-purple-50 dark:bg-purple-950/30";
    case "system":
      return "text-orange-500 bg-orange-50 dark:bg-orange-950/30";
    default:
      return "text-gray-500 bg-gray-50 dark:bg-gray-800";
  }
}

export default function RecentActivities() {
  return (
    <div className="space-y-4">
      {activities.map((activity, i) => (
        <div key={i} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
            <AvatarFallback>{activity.user.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-semibold">{activity.user.name}</span>{" "}
              <span>{activity.action}</span>{" "}
              <span className="font-semibold">{activity.subject}</span>
            </p>
            <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
          </div>
          <div>
            <span className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              getTypeColor(activity.type)
            )}>
              {activity.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}