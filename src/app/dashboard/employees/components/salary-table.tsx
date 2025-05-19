"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

interface SalaryDetail {
  id: string;
  month: string;
  bonus: number;
  deductible: number;
}

interface SalaryTableProps {
  salaries: SalaryDetail[];
  isLoading: boolean;
  basicSalary: number;
  onEdit: (salary: SalaryDetail) => void;
}

export function SalaryTable({ salaries, isLoading, basicSalary, onEdit }: SalaryTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Basic Salary</TableHead>
          <TableHead>Bonus</TableHead>
          <TableHead>Deductible</TableHead>
          <TableHead>Net Salary</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {salaries.map((salary) => {
          const netSalary = basicSalary + salary.bonus - salary.deductible;
          return (
            <TableRow key={salary.id}>
              <TableCell>{new Date(salary.month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</TableCell>
              <TableCell>${basicSalary.toLocaleString()}</TableCell>
              <TableCell>${salary.bonus.toLocaleString()}</TableCell>
              <TableCell>${salary.deductible.toLocaleString()}</TableCell>
              <TableCell>${netSalary.toLocaleString()}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(salary)}
                >
                  <PencilIcon className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
        {salaries.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
              No salary details found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}