import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  FileCheck, 
  FileX, 
  RefreshCcw,
  XCircle,
  FileText
} from "lucide-react";

type StatusType = 
  | 'active' | 'inactive' | 'pending' | 'blacklisted'
  | 'approved' | 'rejected' | 'needs_correction' | 'pending_review' | 'expired'
  | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed'
  | 'probation'
  | 'verified' | 'missing' | 'uploaded';

interface StatusBadgeProps {
  status: StatusType | string;
  variant?: 'document' | 'worker' | 'travel' | 'agent' | 'default';
  showIcon?: boolean;
}

export function StatusBadge({ status, variant = 'default', showIcon = true }: StatusBadgeProps) {
  // Common status mappings
  const commonStatuses: Record<string, { color: string, icon: React.ReactNode }> = {
    active: { color: "bg-green-500", icon: <CheckCircle className="h-4 w-4" /> },
    inactive: { color: "bg-gray-200 text-gray-800", icon: <XCircle className="h-4 w-4" /> },
    pending: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: <Clock className="h-4 w-4" /> },
    approved: { color: "bg-green-500", icon: <FileCheck className="h-4 w-4" /> },
    rejected: { color: "bg-red-500", icon: <FileX className="h-4 w-4" /> },
    completed: { color: "bg-green-500", icon: <CheckCircle className="h-4 w-4" /> },
    cancelled: { color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
    delayed: { color: "bg-orange-500", icon: <AlertCircle className="h-4 w-4" /> },
    in_progress: { color: "bg-blue-500", icon: <RefreshCcw className="h-4 w-4" /> },
    scheduled: { color: "border border-gray-300", icon: <Clock className="h-4 w-4" /> },
    pending_review: { color: "border border-gray-300", icon: <Clock className="h-4 w-4" /> },
    needs_correction: { color: "bg-orange-500", icon: <AlertCircle className="h-4 w-4" /> },
    expired: { color: "bg-gray-500", icon: <AlertCircle className="h-4 w-4" /> },
    probation: { color: "bg-amber-100 text-amber-800 border-amber-300", icon: <AlertCircle className="h-4 w-4" /> },
    verified: { color: "bg-blue-500", icon: <FileCheck className="h-4 w-4" /> },
    missing: { color: "bg-gray-200 text-gray-800", icon: <FileText className="h-4 w-4" /> },
    uploaded: { color: "bg-blue-500", icon: <FileText className="h-4 w-4" /> },
  };

  // Get status config or use default
  const statusConfig = commonStatuses[status.toLowerCase()] || { 
    color: "border border-gray-300", 
    icon: <FileText className="h-4 w-4" /> 
  };

  return (
    <Badge className={statusConfig.color}>
      {showIcon && <span className="mr-1">{statusConfig.icon}</span>}
      {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </Badge>
  );
}