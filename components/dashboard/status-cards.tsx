"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Loader2, 
  PlaneTakeoff, 
  AlertCircle, 
  RefreshCw,
  Clock
} from "lucide-react";

const statusData = [
  {
    title: "Total Workers",
    value: "2,453",
    icon: Users,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  {
    title: "In Process",
    value: "345",
    icon: Loader2,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
  {
    title: "Abroad",
    value: "1,892",
    icon: PlaneTakeoff,
    iconColor: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
  },
  {
    title: "Missing",
    value: "7",
    icon: AlertCircle,
    iconColor: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
  {
    title: "Visa Expires Soon",
    value: "23",
    icon: Clock,
    iconColor: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950",
  },
];

export default function StatusCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statusData.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <div className={`${item.bgColor} p-2 rounded-full`}>
              <item.icon className={`h-4 w-4 ${item.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground pt-1">
              {index === 1 ? "+5.2% from last month" : 
              index === 2 ? "+12.3% from last month" : 
              index === 3 ? "-2.1% from last month" : 
              index === 4 ? "+3 from last week" : 
              "+49 from last month"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}