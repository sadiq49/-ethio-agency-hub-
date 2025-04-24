"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentProcessingStats } from "@/app/reports/document-processing/page";

interface DocumentProcessingOverviewProps {
  stats: DocumentProcessingStats | null;
  isLoading: boolean;
}

export function DocumentProcessingOverview({ stats, isLoading }: DocumentProcessingOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {isLoading ? (
        // Skeleton loaders for stats cards
        <>
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </>
      ) : (
        // Actual content when loaded
        <>
          <StatCard
            title="Total Documents"
            value={stats?.totalDocuments || 0}
            icon="file-text"
          />
          <StatCard
            title="Pending Review"
            value={stats?.pendingReview || 0}
            icon="clock"
            trend={stats?.pendingReview > 10 ? "negative" : "neutral"}
          />
          <StatCard
            title="Approved"
            value={stats?.approved || 0}
            icon="check-circle"
            trend="positive"
          />
          <StatCard
            title="Rejected"
            value={stats?.rejected || 0}
            icon="x-circle"
            trend={stats?.rejected > 5 ? "negative" : "neutral"}
          />
        </>
      )}
    </div>
  );
}

// Stat card component
function StatCard({ title, value, icon, trend = "neutral" }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value}
        </div>
        <p className="text-xs text-muted-foreground">
          <Skeleton className="h-3 w-[100px]" />
        </p>
      </CardContent>
    </Card>
  );
}

// Skeleton loader for stat cards
function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          <Skeleton className="h-4 w-[120px]" />
        </CardTitle>
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          <Skeleton className="h-8 w-[80px] mb-1" />
        </div>
        <p className="text-xs text-muted-foreground">
          <Skeleton className="h-3 w-[100px]" />
        </p>
      </CardContent>
    </Card>
  );
}