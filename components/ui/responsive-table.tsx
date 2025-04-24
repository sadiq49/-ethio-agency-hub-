"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { cn } from "@/lib/utils";

interface ResponsiveTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessorKey: keyof T;
    cell?: (item: T) => React.ReactNode;
    className?: string;
    mobileLabel?: string;
    showOnMobile?: boolean;
  }[];
  className?: string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  className,
}: ResponsiveTableProps<T>) {
  const mobileColumns = columns.filter((col) => col.showOnMobile !== false);

  return (
    <div className={className}>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey as string} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={i}>
                {columns.map((column) => (
                  <TableCell key={column.accessorKey as string} className={column.className}>
                    {column.cell
                      ? column.cell(item)
                      : (item[column.accessorKey] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((item, i) => (
          <div
            key={i}
            className="bg-card rounded-lg border shadow-sm p-4 space-y-3"
          >
            {mobileColumns.map((column) => (
              <div key={column.accessorKey as string} className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">
                  {column.mobileLabel || column.header}:
                </span>
                <span className="text-sm font-medium text-right">
                  {column.cell
                    ? column.cell(item)
                    : (item[column.accessorKey] as React.ReactNode)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}