/**
 * Export Service
 * 
 * Provides functionality to export data in various formats (CSV, Excel, PDF)
 * from different parts of the application.
 */

import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

type ExportFormat = 'csv' | 'excel' | 'pdf';

interface ExportOptions {
  fileName: string;
  format: ExportFormat;
  includeTimestamp?: boolean;
  sheetName?: string; // For Excel exports
  pdfOptions?: {
    orientation?: 'portrait' | 'landscape';
    title?: string;
    subtitle?: string;
    includeHeader?: boolean;
    includeFooter?: boolean;
  };
}

/**
 * Exports data to the specified format
 * 
 * @param data Array of objects to export
 * @param options Export configuration options
 */
export function exportData(data: any[], options: ExportOptions): void {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }
  
  const timestamp = options.includeTimestamp 
    ? `_${new Date().toISOString().replace(/[:.]/g, '-')}` 
    : '';
  
  const fileName = `${options.fileName}${timestamp}`;
  
  switch (options.format) {
    case 'csv':
      exportToCsv(data, fileName);
      break;
    case 'excel':
      exportToExcel(data, fileName, options.sheetName || 'Sheet1');
      break;
    case 'pdf':
      exportToPdf(data, fileName, options.pdfOptions);
      break;
    default:
      console.error('Unsupported export format');
  }
}

/**
 * Exports data to CSV format
 */
function exportToCsv(data: any[], fileName: string): void {
  // Get headers from the first object
  const headers = Object.keys(data[0]);
  
  // Convert data to CSV format
  const csvRows = [];
  
  // Add headers
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle special characters and quotes
      const escaped = value === null || value === undefined 
        ? '' 
        : String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // Create blob and download
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
}

/**
 * Exports data to Excel format
 */
function exportToExcel(data: any[], fileName: string, sheetName: string): void {
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  
  // Generate Excel file and download
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
}

/**
 * Exports data to PDF format
 */
function exportToPdf(
  data: any[], 
  fileName: string, 
  options?: ExportOptions['pdfOptions']
): void {
  // Default options
  const pdfOptions = {
    orientation: options?.orientation || 'portrait',
    title: options?.title || fileName,
    subtitle: options?.subtitle || '',
    includeHeader: options?.includeHeader !== false,
    includeFooter: options?.includeFooter !== false,
  };
  
  // Create new PDF document
  const doc = new jsPDF({
    orientation: pdfOptions.orientation as any,
    unit: 'mm',
    format: 'a4',
  });
  
  // Add title if specified
  if (pdfOptions.title) {
    doc.setFontSize(18);
    doc.text(pdfOptions.title, 14, 22);
  }
  
  // Add subtitle if specified
  if (pdfOptions.subtitle) {
    doc.setFontSize(12);
    doc.text(pdfOptions.subtitle, 14, 30);
  }
  
  // Get headers and data for table
  const headers = Object.keys(data[0]);
  const rows = data.map(row => headers.map(header => row[header]));
  
  // Add table to document
  (doc as any).autoTable({
    head: [headers],
    body: rows,
    startY: pdfOptions.title ? 35 : 14,
    headStyles: {
      fillColor: [51, 51, 51],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    margin: { top: 20 },
  });
  
  // Add footer with date if specified
  if (pdfOptions.includeFooter) {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Generated on ${new Date().toLocaleDateString()} | Page ${i} of ${pageCount}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  }
  
  // Save PDF
  doc.save(`${fileName}.pdf`);
}

/**
 * Creates an export button component with dropdown for format selection
 */
export function createExportButton(
  data: any[],
  baseFileName: string,
  additionalOptions?: Partial<ExportOptions>
): JSX.Element {
  // Implementation would be in a React component
  // This is just a placeholder for the service
  return null as any;
}