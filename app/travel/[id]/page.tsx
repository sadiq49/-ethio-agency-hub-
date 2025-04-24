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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useAuth } from "@/contexts/auth-context";

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
  accommodation: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface RelatedDocument {
  id: string;
  document_type: string;
  status: string;
  submitted_at: string;
}

const formSchema = z.object({
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  departure_date: z.date({
    required_error: "Departure date is required.",
  }),
  return_date: z.date().optional().nullable(),
  status: z.string({
    required_error: "Status is required.",
  }),
  visa_status: z.string({
    required_error: "Visa status is required.",
  }),
  ticket_status: z.string({
    required_error: "Ticket status is required.",
  }),
  accommodation: z.string().optional(),
  notes: z.string().optional(),
});

export default function TravelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { data: travel, isLoading: travelLoading, refetch: refetchTravel } = useApiQuery<TravelRecord>(
    'travel_records',
    (query) => query.select(`
      *,
      worker_name:workers(name)
    `).eq('id', params.id).single(),
    { cacheKey: `travel-${params.id}` }
  );

  const { data: relatedDocuments, isLoading: documentsLoading } = useApiQuery<RelatedDocument[]>(
    'documents',
    (query) => query.select('*')
      .eq('worker_id', travel?.worker_id || '')
      .in('document_type', ['visa', 'passport', 'work_permit'])
      .order('submitted_at', { ascending: false }),
    { 
      cacheKey: `travel-${params.id}-documents`,
      enabled: !!travel?.worker_id
    }
  );

  const { mutate: updateTravel } = useApiMutation('travel_records', {
    onSuccess: () => {
      setSuccess(true);
      setIsEditMode(false);
      refetchTravel();
      
      // Create notification for status changes
      if (travel) {
        const newStatus = form.getValues().status;
        if (newStatus !== travel.status) {
          createStatusNotification(travel.worker_id, newStatus);
        }
      }
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      departure_date: undefined,
      return_date: null,
      status: "",
      visa_status: "",
      ticket_status: "",
      accommodation: "",
      notes: "",
    },
  });

  // Set form values when travel data is loaded
  useState(() => {
    if (travel && !form.formState.isDirty) {
      form.reset({
        destination: travel.destination,
        departure_date: travel.departure_date ? new Date(travel.departure_date) : undefined,
        return_date: travel.return_date ? new Date(travel.return_date) : null,
        status: travel.status,
        visa_status: travel.visa_status,
        ticket_status: travel.ticket_status,
        accommodation: travel.accommodation || "",
        notes: travel.notes || "",
      });
    }
  });

  async function createStatusNotification(workerId: string, status: string) {
    try {
      let title = '';
      let message = '';
      let type = '';
      
      switch (status) {
        case 'scheduled':
          title = 'Travel Scheduled';
          message = `Your travel to ${travel?.destination} has been scheduled.`;
          type = 'info';
          break;
        case 'in_progress':
          title = 'Travel In Progress';
          message = `Your travel to ${travel?.destination} is now in progress.`;
          type = 'info';
          break;
        case 'completed':
          title = 'Travel Completed';
          message = `Your travel to ${travel?.destination} has been marked as completed.`;
          type = 'success';
          break;
        case 'cancelled':
          title = 'Travel Cancelled';
          message = `Your travel to ${travel?.destination} has been cancelled.`;
          type = 'error';
          break;
        case 'delayed':
          title = 'Travel Delayed';
          message = `Your travel to ${travel?.destination} has been