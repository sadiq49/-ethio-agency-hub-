"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApiQuery } from "@/hooks/use-api-query";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

interface Worker {
  id: string;
  name: string;
  passport_number: string;
  nationality: string;
  date_of_birth: string;
  gender: string;
  contact_number: string;
  email: string | null;
  address: string | null;
  emergency_contact: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

interface Document {
  id: string;
  document_type: string;
  status: string;
  submitted_at: string;
  processed_at: string | null;
}

interface TravelRecord {
  id: string;
  destination: string;
  departure_date: string;
  return_date: string | null;
  status: string;
  visa_status: string;
  ticket_status: string;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  passport_number: z.string().min(5, {
    message: "Passport number must be at least 5 characters.",
  }),
  nationality: z.string().min(2, {
    message: "Nationality is required.",
  }),
  contact_number: z.string().min(5, {
    message: "Contact number is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal('')),
  address: z.string().optional(),
  emergency_contact: z.string().optional(),
  notes: z.string().optional(),
  status: z.string({
    required_error: "Status is required.",
  }),
});

export default function WorkerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { data: worker, isLoading: workerLoading, refetch: refetchWorker } = useApiQuery<Worker>(
    'workers',
    (query) => query.select('*').eq('id', params.id).single(),
    { cacheKey: `worker-${params.id}` }
  );

  const { data: documents, isLoading: documentsLoading } = useApiQuery<Document[]>(
    'documents',
    (query) => query.select('*').eq('worker_id', params.id).order('submitted_at', { ascending: false }),
    { cacheKey: `worker-${params.id}-documents` }
  );

  const { data: travelRecords, isLoading: travelLoading } = useApiQuery<TravelRecord[]>(
    'travel_records',
    (query) => query.select('*').eq('worker_id', params.id).order('departure_date', { ascending: false }),
    { cacheKey: `worker-${params.id}-travel` }
  );

  const { mutate: updateWorker } = useApiMutation('workers', {
    onSuccess: () => {
      setSuccess(true);
      setIsEditMode(false);
      refetchWorker();
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  });

  const { mutate: deleteWorker } = useApiMutation('workers', {
    onSuccess: () => {
      router.push('/workers');
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      passport_number: "",
      nationality: "",
      contact_number: "",
      email: "",
      address: "",
      emergency_contact: "",
      notes: "",
      status: "",
    },
  });

  // Set form values when worker data is loaded
  useState(() => {
    if (worker && !form.formState.isDirty) {
      form.reset({
        name: worker.name,
        passport_number: worker.passport_number,
        nationality: worker.nationality,
        contact_number: worker.contact_number,
        email: worker.email || "",
        address: worker.address || "",
        emergency_contact: worker.emergency_contact || "",
        notes: worker.notes || "",
        status: worker.status,
      });
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    
    try {
      await updateWorker((supabase) => 
        supabase
          .from('workers')
          .update({
            name: values.name,
            passport_number: values.passport_number,
            nationality: values.nationality,
            contact_number: values.contact_number,
            email: values.email || null,
            address: values.address || null,
            emergency_contact: values.emergency_contact || null,
            notes: values.notes || null,
            status: values.status,
          })
          .eq('id', params.id)
      );
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteWorker((supabase) => 
        supabase
          .from('workers')
          .delete()
          .eq('id', params.id)
      );
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  }

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

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Badge variant="outline">Pending Review</Badge>;
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "needs_correction":
        return <Badge variant="warning">Needs Correction</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTravelStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return format(new Date(dateString), "PPP");
  };

  if (workerLoading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Alert variant="destructive">
          <AlertDescription>
            Worker not found. They may have been deleted or you don't have permission to view them.
          </AlertDescription>
        </Alert>
        <Button className="mt-4" onClick={() => router.push('/workers')}>
          Back to Workers
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{worker.name}</h1>
        <div className="flex gap-2">
          {!isEditMode && (
            <>
              <Button variant="outline" onClick={() => router.push('/workers')}>
                Back
              </Button>
              <Button onClick={() => setIsEditMode(true)}>
                Edit Worker
              </Button>
            </>
          )}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert>
          <AlertDescription>
            Worker information updated successfully.
          </AlertDescription>
        </Alert>
      )}

      {isEditMode ? (
        <Card>
          <CardHeader>
            <CardTitle>Edit Worker</CardTitle>
            <CardDescription>
              Update worker information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="passport_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Passport Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nationality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nationality</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="blacklisted">Blacklisted</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="emergency_contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditMode(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <div className="flex gap-2">
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" type="button" disabled={isLoading}>
                          Delete Worker
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Are you sure?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete the worker
                            and all associated records.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                          </Button>
                          // Add useEffect for initial data load:
                          useEffect(() => {
                            if (worker && !form.formState.isDirty) {
                              form.reset({
                                name: worker.name,
                                passport_number: worker.passport_number,
                                nationality: worker.nationality,
                                contact_number: worker.contact_number,
                                email: worker.email || "",
                                address: worker.address || "",
                                emergency_contact: worker.emergency_contact || "",
                                notes: worker.notes || "",
                                status: worker.status,
                              });
                            }
                          }, [worker, form]);
                          
                          // Add loading state to delete button:
                          <Button 
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading}
                          >
                            {isLoading ? "Deleting..." : "Delete Worker"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="profile">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="travel">Travel</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Worker Profile</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div></div>