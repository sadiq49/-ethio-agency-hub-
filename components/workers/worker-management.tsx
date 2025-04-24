"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal,
  FileText,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Worker, useWorkerActions } from '@/lib/db/workers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkerManagementProps {
  initialWorkers: Worker[];
  totalCount: number;
}

export function WorkerManagement({ initialWorkers, totalCount }: WorkerManagementProps) {
  const [workers, setWorkers] = useState<Worker[]>(initialWorkers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [workerToDelete, setWorkerToDelete] = useState<Worker | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const router = useRouter();
  const { updateWorkerStatus, deleteWorker } = useWorkerActions();
  const { toast } = useToast();

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.passport_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         worker.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (workerId: string, newStatus: Worker['status']) => {
    try {
      const updatedWorker = await updateWorkerStatus(workerId, newStatus);
      setWorkers(workers.map(w => w.id === workerId ? updatedWorker : w));
      
      toast({
        title: "Status updated",
        description: `Worker status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update worker status",
      });
    }
  };

  const handleDeleteWorker = async () => {
    if (!workerToDelete) return;
    
    try {
      await deleteWorker(workerToDelete.id);
      setWorkers(workers.filter(w => w.id !== workerToDelete.id));
      
      toast({
        title: "Worker deleted",
        description: "Worker has been successfully deleted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete worker",
      });
    } finally {
      setWorkerToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = (status: Worker['status']) => {
    const statusConfig = {
      registered: { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: <AlertCircle className="h-3 w-3 mr-1 text-blue-600" /> },
      processing: { color: 'bg-amber-100 text-amber-800 border-amber-300', icon: <AlertCircle className="h-3 w-3 mr-1 text-amber-600" /> },
      approved: { color: 'bg-green-100 text-green-800 border-green-300', icon: <CheckCircle className="h-3 w-3 mr-1 text-green-600" /> },
      deployed: { color: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: <CheckCircle className="h-3 w-3 mr-1 text-indigo-600" /> },
      returned: { color: 'bg-slate-100 text-slate-800 border-slate-300', icon: <AlertCircle className="h-3 w-3 mr-1 text-slate-600" /> },
      blacklisted: { color: 'bg-red-100 text-red-800 border-red-300', icon: <XCircle className="h-3 w-3 mr-1 text-red-600" /> },
    };

    const config = statusConfig[status];

    return (
      <Badge variant="outline" className={`flex items-center ${config.color} shadow-sm`}>
        {config.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  // Calculate status counts for summary cards
  const statusCounts = workers.reduce((acc, worker) => {
    acc[worker.status] = (acc[worker.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-full">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Worker Management</h1>
              <p className="text-primary-100">Manage your workforce efficiently</p>
            </div>
          </div>
          <Button className="bg-white text-primary-700 hover:bg-primary-50" asChild>
            <Link href="/workers/new">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Worker
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Total Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-blue-800">{workers.length}</span>
              <Users className="h-8 w-8 text-blue-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Approved Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-800">{statusCounts.approved || 0}</span>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-amber-800">{statusCounts.processing || 0}</span>
              <AlertCircle className="h-8 w-8 text-amber-500 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Search and Filter Section */}
      <Card className="border-primary-100">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-primary-500" />
              <Input
                type="search"
                placeholder="Search workers..."
                className="pl-8 border-primary-200 focus:border-primary-400 focus:ring-primary-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-primary-200 focus:ring-primary-400">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Workers Table */}
      <Card className="border-primary-100 shadow-sm overflow-hidden">
        <div className="rounded-md bg-white">
          <Table>
            <TableHeader className="bg-primary-50">
              <TableRow>
                <TableHead className="font-semibold text-primary-700">Name</TableHead>
                <TableHead className="font-semibold text-primary-700">Nationality</TableHead>
                <TableHead className="font-semibold text-primary-700">Passport</TableHead>
                <TableHead className="font-semibold text-primary-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-primary-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.length > 0 ? (
                filteredWorkers.map((worker) => (
                  <TableRow 
                    key={worker.id}
                    className="hover:bg-primary-50/50 transition-colors"
                  >
                    <TableCell className="font-medium">{worker.full_name}</TableCell>
                    <TableCell>{worker.nationality}</TableCell>
                    <TableCell>{worker.passport_number || "—"}</TableCell>
                    <TableCell>{getStatusBadge(worker.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/workers/${worker.id}`)}>
                            <FileText className="mr-2 h-4 w-4 text-primary-500" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/workers/${worker.id}/edit`)}>
                            <Edit className="mr-2 h-4 w-4 text-amber-500" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setWorkerToDelete(worker);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center text-neutral-500">
                      <Users className="h-8 w-8 mb-2 opacity-40" />
                      <p>No workers found</p>
                      <p className="text-sm">Try adjusting your search or filter</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination or results summary */}
        <div className="py-2 px-4 bg-primary-50/50 border-t border-primary-100 text-sm text-neutral-600">
          Showing {filteredWorkers.length} of {totalCount} workers
        </div>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="border-red-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Worker</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {workerToDelete?.full_name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-300">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteWorker}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-500"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}