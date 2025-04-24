"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

interface FiltersProps {
  filters: {
    startDate: Date | null;
    endDate: Date | null;
    documentType: string;
    status: string;
  };
  onFilterChange: (filters: any) => void;
}

export function DocumentProcessingFilters({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (key: string, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const resetValues = {
      startDate: null,
      endDate: null,
      documentType: "all",
      status: "all",
    };
    setLocalFilters(resetValues);
    onFilterChange(resetValues);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <DatePicker
                id="startDate"
                selected={filters.startDate}
                onChange={date => handleFilterChange('startDate', date)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localFilters.endDate ? (
                      format(localFilters.endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={localFilters.endDate || undefined}
                    onSelect={(date) => handleChange("endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                value={localFilters.documentType}
                onValueChange={(value) => handleChange("documentType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="visa">Visa</SelectItem>
                  <SelectItem value="work_permit">Work Permit</SelectItem>
                  <SelectItem value="medical_certificate">Medical Certificate</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={localFilters.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending_review">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="needs_correction">Needs Correction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={handleResetFilters}
              className="w-full sm:w-auto"
            >
              Reset Filters
            </Button>
            <Button 
              onClick={handleApplyFilters}
              className="w-full sm:w-auto"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}