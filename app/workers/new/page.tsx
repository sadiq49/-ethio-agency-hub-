"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  passportNumber: z.string().min(5, {
    message: "Passport number must be at least 5 characters.",
  }),
  nationality: z.string().min(2, {
    message: "Nationality is required.",
  }),
  dateOfBirth: z.date({
    required_error: "Date of birth is required.",
  }),
  gender: z.string({
    required_error: "Gender is required.",
  }),
  contactNumber: z.string().min(5, {
    message: "Contact number is required.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }).optional().or(z.literal('')),
  address: z.string().optional(),
  emergencyContact: z.string().optional(),
  notes: z.string().optional(),
});

export default function AddWorkerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      passportNumber: "",
      nationality: "",
      gender: "",
      contactNumber: "",
      email: "",
      address: "",
      emergencyContact: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if passport number already exists
      const { data: existingWorker, error: checkError } = await supabase
        .from('workers')
        .select('id')
        .eq('passport_number', values.passportNumber)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        setError(checkError.message);
        return;
      }

      if (existingWorker) {
        setError("A worker with this passport number already exists.");
        return;
      }

      // Create worker record
      const { error: insertError } = await supabase
        .from('workers')
        .insert({
          name: values.name,
          passport_number: values.passportNumber,
          nationality: values.nationality,
          date_of_birth: values.dateOfBirth.toISOString(),
          gender: values.gender,
          contact_number: values.contactNumber,
          email: values.email || null,
          address: values.address || null,
          emergency_contact: values.emergencyContact || null,
          notes: values.notes || null,
          status: 'active',
        });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setSuccess(true);
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/workers');
      }, 2000);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Worker</CardTitle>
        </CardHeader>
        <CardContent>
          // Fix error display:
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          // Add loading state to submit button:
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Create Worker"}
          </Button>