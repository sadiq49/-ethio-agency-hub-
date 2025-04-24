"use client";

import { useState } from "react";
import { useApiQuery } from "@/hooks/use-api-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { DotsHorizontalIcon, PlusIcon, SearchIcon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Worker {
  id: string;
  name: string;
  passport_number: string;
  nationality: string;
  status: string;
  documents_count: number;
  pending_documents: number;
}

export default function WorkersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: workers, isLoading, error } = useApiQuery<Worker[]>(
    'workers',
    (query) => query.select(`
      *,
      documents_count:documents(count),
      pending_documents:documents(count).eq('status', 'pending_review')
    `).order('name'),
    { duration: 5 * 60 * 1000 } // 5 minutes cache
  );

  const filteredWorkers = workers?.filter(worker => 
    worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.passport_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.nationality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "blacklisted":
        return <Badge variant="destructive">Blacklisted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Workers</h1>
        <Button onClick={() => router.push('/workers/new')}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Worker
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workers by name, passport number, or nationality..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
              Error loading workers. Please try refreshing.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Passport Number</TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Pending</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No workers found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                filteredWorkers?.map((worker) => (
                  <TableRow key={worker.id}>
                    <TableCell className="font-medium">{worker.name}</TableCell>
                    <TableCell>{worker.passport_number}</TableCell>
                    <TableCell>{worker.nationality}</TableCell>
                    <TableCell>{getStatusBadge(worker.status)}</TableCell>
                    <TableCell>{worker.documents_count}</TableCell>
                    <TableCell>{worker.pending_documents}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        onClick={() => router.push(`/workers/${worker.id}`)}
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