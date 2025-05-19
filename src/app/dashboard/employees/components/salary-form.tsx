"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { salarySchema } from "@/lib/validators";
import { z } from "zod";

type FormErrors = {
  [K in keyof z.infer<typeof salarySchema>]?: string[];
};

interface SalaryFormProps {
  onSubmit: (data: z.infer<typeof salarySchema>) => Promise<void>;
  isLoading: boolean;
  initialData?: {
    month: string;
    bonus: number;
    deductible: number;
  };
}

export function SalaryForm({ onSubmit, isLoading, initialData }: SalaryFormProps) {
  const [formData, setFormData] = useState({
    month: "",
    bonus: "",
    deductible: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        month: initialData.month,
        bonus: initialData.bonus.toString(),
        deductible: initialData.deductible.toString(),
      });
    }
  }, [initialData]);

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
      salarySchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            const field = err.path[0].toString() as keyof FormErrors;
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
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="month">Month</Label>
        <Input
          id="month"
          name="month"
          type="month"
          value={formData.month}
          onChange={handleInputChange}
          className={errors.month ? "border-destructive" : ""}
          max={new Date().toISOString().split("T")[0].slice(0, 7)}
        />
        {errors.month?.map((error) => (
          <p key={error} className="text-sm text-destructive">{error}</p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="bonus">Bonus</Label>
        <Input
          id="bonus"
          name="bonus"
          type="number"
          placeholder="0.00"
          value={formData.bonus}
          onChange={handleInputChange}
          className={errors.bonus ? "border-destructive" : ""}
          min="0"
          max="1000000"
          step="0.01"
        />
        {errors.bonus?.map((error) => (
          <p key={error} className="text-sm text-destructive">{error}</p>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="deductible">Deductible</Label>
        <Input
          id="deductible"
          name="deductible"
          type="number"
          placeholder="0.00"
          value={formData.deductible}
          onChange={handleInputChange}
          className={errors.deductible ? "border-destructive" : ""}
          min="0"
          max="1000000"
          step="0.01"
        />
        {errors.deductible?.map((error) => (
          <p key={error} className="text-sm text-destructive">{error}</p>
        ))}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Salary Details" : "Add Salary Details")}
      </Button>
    </form>
  );
}

