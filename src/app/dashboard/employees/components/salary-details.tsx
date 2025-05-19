"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SalaryForm } from "./salary-form";
import { SalaryTable } from "./salary-table";
import { addSalaryDetails, updateSalaryDetails } from "../[employeeId]/actions";

interface Employee {
  id: string;
  employeeId: string;
  name: string;
  joiningDate: string;
  basicSalary: number;
  SalaryDetail: Array<{
    id: string;
    month: string;
    bonus: number;
    deductible: number;
  }>;
}

interface SalaryDetailsProps {
  employee: Employee;
  salaries: Employee['SalaryDetail'];
}

export function SalaryDetails({ employee, salaries }: SalaryDetailsProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSalary, setEditingSalary] = useState<Employee['SalaryDetail'][0] | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      let result;
      
      if (editingSalary) {
        result = await updateSalaryDetails(employee.employeeId, editingSalary.id, data);
      } else {
        result = await addSalaryDetails(employee.employeeId, data);
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsOpen(false);
      setEditingSalary(null);
      router.refresh();

      toast({
        title: "Success",
        description: `Salary details ${editingSalary ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${editingSalary ? 'update' : 'add'} salary details`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (salary: Employee['SalaryDetail'][0]) => {
    setEditingSalary(salary);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/dashboard/employees")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
        
        <Dialog 
          open={isOpen} 
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setEditingSalary(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add Salary Details
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSalary ? 'Edit' : 'Add'} Salary Details</DialogTitle>
              <DialogDescription>
                {editingSalary ? 'Edit' : 'Add'} salary details for {employee.name}
              </DialogDescription>
            </DialogHeader>
            <SalaryForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
              initialData={editingSalary || undefined}
            />
          </DialogContent>
        </Dialog>
      </div>

      <SalaryTable 
        salaries={salaries} 
        basicSalary={employee.basicSalary}
        isLoading={false}
        onEdit={handleEdit}
      />
    </div>
  );
}