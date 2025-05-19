"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  joiningDate: string;
  basicSalary: number;
  SalaryDetail?: Array<{
    id: string;
    month: string;
    bonus: number;
    deductible: number;
  }>;
}

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
}

export function EmployeeTable({ employees, isLoading }: EmployeeTableProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>(employees);

  useEffect(() => {
    if (selectedMonth) {
      // Filter employees based on selected month
      const filtered = employees.map(employee => ({
        ...employee,
        SalaryDetail: employee.SalaryDetail?.filter(salary => 
          salary.month === selectedMonth
        )
      }));
      setFilteredEmployees(filtered);
    } else {
      setFilteredEmployees(employees);
    }
  }, [selectedMonth, employees]);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[150px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-48"
          max={new Date().toISOString().split("T")[0].slice(0, 7)}
        />
        {selectedMonth && (
          <Button 
            variant="outline" 
            onClick={() => setSelectedMonth("")}
          >
            Clear Filter
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead>Basic Salary</TableHead>
            {selectedMonth && (
              <>
                <TableHead>Bonus</TableHead>
                <TableHead>Deductible</TableHead>
                <TableHead>Net Salary</TableHead>
              </>
            )}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.map((employee) => {
            const salaryDetail = employee.SalaryDetail?.[0];
            const netSalary = salaryDetail 
              ? employee.basicSalary + salaryDetail.bonus - salaryDetail.deductible 
              : employee.basicSalary;

            return (
              <TableRow key={employee.id}>
                <TableCell>{employee.employeeId}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{new Date(employee.joiningDate).toLocaleDateString()}</TableCell>
                <TableCell>${employee.basicSalary.toLocaleString()}</TableCell>
                {selectedMonth && (
                  <>
                    <TableCell>${salaryDetail?.bonus.toLocaleString() ?? 0}</TableCell>
                    <TableCell>${salaryDetail?.deductible.toLocaleString() ?? 0}</TableCell>
                    <TableCell>${netSalary.toLocaleString()}</TableCell>
                  </>
                )}
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link href={`/dashboard/employees/${employee.employeeId}`}>
                      {selectedMonth ? "Edit Details" : "View Details"}
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
          {filteredEmployees.length === 0 && (
            <TableRow>
              <TableCell 
                colSpan={selectedMonth ? 8 : 5} 
                className="text-center py-4 text-muted-foreground"
              >
                No employees found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
