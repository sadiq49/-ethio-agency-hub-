"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileText, Table, BarChart } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface DataExportProps {
  data: any[];
  filename?: string;
  disabled?: boolean;
}

/**
 * Data Export Component
 * 
 * A reusable component for exporting data in various formats.
 * Supports CSV, JSON, and Excel export formats.
 * 
 * @param data - Array of data objects to export
 * @param filename - Base filename for the exported file (without extension)
 * @param disabled - Whether the export functionality is disabled
 * @returns React component with export UI
 */
export function DataExport({ data, filename = 'export', disabled = false }: DataExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  // Export data as CSV
  const exportCSV = () => {
    if (!data || data.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Create CSV content
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => 
        Object.values(item).map(value => {
          // Handle different value types
          if (value === null || value === undefined) return '""';
          if (typeof value === 'string') return `"${value.replace(/"/g, '""')}"`;
          if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return value;
        }).join(',')
      ).join('\n');
      
      const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
      const encodedUri = encodeURI(csvContent);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Data has been exported as CSV",
      });
    } catch (error) {
      console.error('CSV export error:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Export data as JSON
  const exportJSON = () => {
    if (!data || data.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Create JSON content
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and trigger download
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Data has been exported as JSON",
      });
    } catch (error) {
      console.error('JSON export error:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Export data as Excel (XLSX)
  const exportExcel = async () => {
    if (!data || data.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsExporting(true);
      
      // Dynamically import xlsx library
      const XLSX = await import('xlsx').then(mod => mod.default);
      
      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      
      // Generate Excel file
      XLSX.writeFile(workbook, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast({
        title: "Export Successful",
        description: "Data has been exported as Excel",
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled || isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportCSV}>
          <Table className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportJSON}>
          <FileText className="mr-2 h-4 w-4" />
          Export as JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportExcel}>
          <BarChart className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}