"use client";

import { useState } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchIcon, CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TravelRecord {
  id: string;
  worker_id: string;
  worker_name: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  status: string;
  visa_status: string;
  ticket_status: string;
}

export default function TravelPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: travelRecords, isLoading, error } = useApiQuery<TravelRecord[]>(
    'travel_records',
    (query) => query.select(`
      *,
      worker_name:workers(name)
    `).order('departure_date', { ascending: false }),
    { duration: 5 * 60 * 1000 } // 5 minutes cache
  );

  const filteredRecords = travelRecords?.filter(record => {
    const matchesSearch = 
      record.worker_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.destination.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "delayed":
        return <Badge variant="warning">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) return "N/A";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Travel Management</h1>
        <Button onClick={() => router.push('/travel/new')}>
          Add Travel Record
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by worker name or destination..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : error ? (
        <Card className="bg-destructive/10">
          <CardContent className="p-4">
            <p className="text-destructive">
              Error loading travel records. Please try refreshing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Worker</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Return</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Visa</TableHead>
                <TableHead>Ticket</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    No travel records found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRecords?.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.worker_name}</TableCell>
                    <TableCell>{record.destination}</TableCell>
                    <TableCell>{formatDate(record.departure_date)}</TableCell>
                    <TableCell>{formatDate(record.return_date)}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <Badge variant={record.visa_status === "approved" ? "default" : "outline"}>
                        {record.visa_status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={record.ticket_status === "confirmed" ? "default" : "outline"}>
                        {record.ticket_status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => router.push(`/travel/${record.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}