"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { employeeSchema } from "@/lib/validators";
import { z } from "zod";

type FormErrors = {
  [K in keyof z.infer<typeof employeeSchema>]?: string[];
} & {
  [key: string]: string[] | undefined;
};


interface EmployeeFormProps {
  onSubmit: (data: z.infer<typeof employeeSchema>) => Promise<void>;
  isLoading: boolean;
}

export function EmployeeForm({ onSubmit, isLoading }: EmployeeFormProps) {
  const [formData, setFormData] = useState({
    employeeId: "",
    name: "",
    joiningDate: "",
    basicSalary: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    try {
      employeeSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            const field = err.path[0].toString();
            if (!formattedErrors[field]) {
              formattedErrors[field] = [];
            }
            formattedErrors[field]?.push(err.message);
          }
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
    setFormData({
      employeeId: "",
      name: "",
      joiningDate: "",
      basicSalary: "",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="employeeId">Employee ID</Label>
        <Input
          id="employeeId"
          name="employeeId"
          placeholder="EMP001"
          value={formData.employeeId}
          onChange={handleInputChange}
          className={errors.employeeId ? "border-red-500" : ""}
        />
        {errors.employeeId?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleInputChange}
          className={errors.name ? "border-red-500" : ""}
        />
        {errors.name?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="joiningDate">Joining Date</Label>
        <Input
          id="joiningDate"
          name="joiningDate"
          type="date"
          value={formData.joiningDate}
          onChange={handleInputChange}
          className={errors.joiningDate ? "border-red-500" : ""}
          max={new Date().toISOString().split("T")[0]}
        />
        {errors.joiningDate?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="basicSalary">Basic Salary</Label>
        <Input
          id="basicSalary"
          name="basicSalary"
          type="number"
          placeholder="50000"
          value={formData.basicSalary}
          onChange={handleInputChange}
          className={errors.basicSalary ? "border-red-500" : ""}
          min="0"
          step="0.01"
        />
        {errors.basicSalary?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Employee"}
      </Button>
    </form>
  );
}
