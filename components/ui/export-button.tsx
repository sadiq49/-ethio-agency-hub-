"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText, FilePdf } from 'lucide-react';
import { exportData } from '@/lib/export-service';
import { toast } from '@/components/ui/use-toast';

interface ExportButtonProps {
  data: any[];
  fileName: string;
  label?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  includeTimestamp?: boolean;
  sheetName?: string;
  pdfTitle?: string;
  pdfSubtitle?: string;
}

/**
 * Export Button Component
 * 
 * A reusable button with dropdown for exporting data in different formats.
 * Supports CSV, Excel, and PDF exports.
 * 
 * @param props Component properties
 * @returns React component
 */
export function ExportButton({
  data,
  fileName,
  label = 'Export',
  variant = 'outline',
  size = 'default',
  disabled = false,
  includeTimestamp = true,
  sheetName,
  pdfTitle,
  pdfSubtitle,
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (!data || data.length === 0) {
      toast({
        title: "Export Failed",
        description: "No data available to export",
        variant: "destructive",
      });
      return;
    }
    
    setIsExporting(true);
    
    try {
      exportData(data, {
        fileName,
        format,
        includeTimestamp,
        sheetName: sheetName || fileName,
        pdfOptions: {
          title: pdfTitle || fileName,
          subtitle: pdfSubtitle,
          includeHeader: true,
          includeFooter: true,
          orientation: 'landscape',
        },
      });
      
      toast({
        title: "Export Successful",
        description: `Data exported as ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "An error occurred during export",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} disabled={disabled || isExporting}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport('csv')}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('excel')}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FilePdf className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}