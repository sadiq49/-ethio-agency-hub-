"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, FileText, FilePdf, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type ExportFormat = 'csv' | 'excel' | 'pdf';

interface ExportDataButtonProps {
  data: any[];
  filename: string;
  label?: string;
  columns?: { key: string; header: string }[];
}

/**
 * Export Data Button Component
 * 
 * A reusable component that provides export functionality for data in various formats
 * including CSV, Excel, and PDF.
 * 
 * @param data - Array of data objects to export
 * @param filename - Base filename for the exported file (without extension)
 * @param label - Optional button label (defaults to "Export")
 * @param columns - Optional column definitions for custom header names
 * 
 * @returns React component with export dropdown button
 */
export function ExportDataButton({
  data,
  filename,
  label = "Export",
  columns,
}: ExportDataButtonProps) {
  const [isExporting, setIsExporting] = useState<ExportFormat | null>(null);

  // Prepare column headers if not provided
  const getColumns = () => {
    if (columns) return columns;
    
    // If no columns provided, generate from first data item
    if (data.length === 0) return [];
    
    return Object.keys(data[0]).map(key => ({
      key,
      header: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
    }));
  };

  const exportData = async (format: ExportFormat) => {
    if (data.length === 0) return;
    
    setIsExporting(format);
    
    try {
      const cols = getColumns();
      
      switch (format) {
        case 'csv':
          exportCSV(data, cols, filename);
          break;
        case 'excel':
          exportExcel(data, cols, filename);
          break;
        case 'pdf':
          exportPDF(data, cols, filename);
          break;
      }
    } catch (error) {
      console.error(`Error exporting ${format}:`, error);
    } finally {
      setIsExporting(null);
    }
  };

  const exportCSV = (data: any[], cols: { key: string; header: string }[], filename: string) => {
    // Create CSV header row
    const headers = cols.map(col => `"${col.header}"`).join(',');
    
    // Create CSV data rows
    const rows = data.map(item => 
      cols.map(col => {
        const value = item[col.key];
        // Wrap strings in quotes and handle null/undefined
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : (value ?? '');
      }).join(',')
    );
    
    // Combine header and rows
    const csv = [headers, ...rows].join('\n');
    
    // Create and download blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  const exportExcel = (data: any[], cols: { key: string; header: string }[], filename: string) => {
    // Create worksheet data with headers
    const wsData = [
      cols.map(col => col.header),
      ...data.map(item => cols.map(col => item[col.key] ?? ''))
    ];
    
    // Create worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    
    // Generate and download Excel file
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportPDF = (data: any[], cols: { key: string; header: string }[], filename: string) => {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Prepare data for autotable
    const tableHeaders = cols.map(col => col.header);
    const tableData = data.map(item => cols.map(col => item[col.key] ?? ''));
    
    // Add title
    doc.text(filename, 14, 15);
    
    // Add table
    (doc as any).autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 20,
      margin: { top: 20 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [41, 128, 185] },
    });
    
    // Save PDF
    doc.save(`${filename}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={isExporting !== null}>
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => exportData('csv')} disabled={isExporting !== null}>
          <FileText className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('excel')} disabled={isExporting !== null}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData('pdf')} disabled={isExporting !== null}>
          <FilePdf className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}