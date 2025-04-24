"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentProcessingStats, DocumentRecord } from "@/app/reports/document-processing/page";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ChartsProps {
  documents: DocumentRecord[];
  stats: DocumentProcessingStats | null;
  isLoading: boolean;
}

export function DocumentProcessingCharts({ documents, stats, isLoading }: ChartsProps) {
  // Prepare data for status distribution pie chart
  const statusData = [
    { name: "Pending Review", value: stats?.pendingReview || 0, color: "#f59e0b" },
    { name: "Approved", value: stats?.approved || 0, color: "#10b981" },
    { name: "Rejected", value: stats?.rejected || 0, color: "#ef4444" },
    { 
      name: "Other", 
      value: stats ? stats.totalDocuments - stats.pendingReview - stats.approved - stats.rejected : 0,
      color: "#6b7280" 
    },
  ].filter(item => item.value > 0);

  // Prepare data for document type distribution
  const documentTypeCount: Record<string, number> = {};
  documents.forEach(doc => {
    const type = doc.document_type;
    documentTypeCount[type] = (documentTypeCount[type] || 0) + 1;
  });

  const documentTypeData = Object.entries(documentTypeCount).map(([type, count]) => ({
    name: type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    count
  }));

  // Prepare data for processing time by document type
  const processingTimeByType: Record<string, { total: number, count: number }> = {};
  documents.forEach(doc => {
    if (doc.processing_time) {
      const type = doc.document_type;
      if (!processingTimeByType[type]) {
        processingTimeByType[type] = { total: 0, count: 0 };
      }
      processingTimeByType[type].total += doc.processing_time;
      processingTimeByType[type].count += 1;
    }
  });

  const processingTimeData = Object.entries(processingTimeByType).map(([type, data]) => ({
    name: type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    hours: data.total / data.count
  }));

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full md:col-span-2" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Document Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} documents`, 'Count']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Type Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={documentTypeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Document Count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Average Processing Time by Document Type</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={processingTimeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toFixed(1)} hours`, 'Processing Time']} />
              <Legend />
              <Bar dataKey="hours" name="Average Hours" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export function DocumentProcessingCharts({ documents, stats, isLoading }) {
  const [drilldownData, setDrilldownData] = useState(null);
  
  const handleBarClick = (data) => {
    // Generate detailed data for the clicked category
    const detailedData = documents.filter(doc => 
      doc.status === data.status || doc.document_type === data.name
    );
    setDrilldownData({
      title: data.name || data.status,
      data: detailedData
    });
  };
  
  return (
    <div className="space-y-6">
      {drilldownData ? (
        <div>
          <Button 
            variant="outline" 
            onClick={() => setDrilldownData(null)}
            className="mb-4"
          >
            Back to Overview
          </Button>
          <h3 className="text-lg font-medium mb-4">
            Details for: {drilldownData.title}
          </h3>
          {/* Detailed chart or table for drilldown data */}
          <DocumentProcessingTable 
            documents={drilldownData.data} 
            isLoading={false}
          />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Documents by Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="count" 
                    fill="#8884d8" 
                    onClick={handleBarClick}
                    cursor="pointer"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          {/* ... other charts ... */}
        </div>
      )}
    </div>
  );
}