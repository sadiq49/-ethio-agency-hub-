import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  color?: 'default' | 'green' | 'blue' | 'yellow' | 'red' | 'purple';
  progress?: number;
}

export function StatCard({ 
  title, 
  value, 
  description, 
  icon, 
  color = 'default',
  progress
}: StatCardProps) {
  const colorClasses = {
    default: "bg-gradient-to-br from-slate-50 to-slate-100",
    green: "bg-gradient-to-br from-green-50 to-green-100",
    blue: "bg-gradient-to-br from-blue-50 to-blue-100",
    yellow: "bg-gradient-to-br from-yellow-50 to-yellow-100",
    red: "bg-gradient-to-br from-red-50 to-red-100",
    purple: "bg-gradient-to-br from-purple-50 to-purple-100"
  };

  const textColorClasses = {
    default: "text-slate-800",
    green: "text-green-800",
    blue: "text-blue-800",
    yellow: "text-yellow-800",
    red: "text-red-800",
    purple: "text-purple-800"
  };

  const valueColorClasses = {
    default: "text-slate-900",
    green: "text-green-600",
    blue: "text-blue-600",
    yellow: "text-yellow-600",
    red: "text-red-600",
    purple: "text-purple-600"
  };

  const progressColorClasses = {
    default: "bg-slate-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
    purple: "bg-purple-500"
  };

  return (
    <Card className={colorClasses[color]}>
      <CardHeader className="pb-2">
        <CardTitle className={`text-sm font-medium flex items-center ${textColorClasses[color]}`}>
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueColorClasses[color]}`}>{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground pt-1">{description}</p>
        )}
        {progress !== undefined && (
          <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${progressColorClasses[color]} rounded-full`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}