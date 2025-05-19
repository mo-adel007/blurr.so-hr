"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { taskSchema } from "@/lib/validators";
import { z } from "zod";

type FormErrors = {
  [K in keyof z.infer<typeof taskSchema>]?: string[];
} & {
  [key: string]: string[] | undefined;
};

interface TaskFormProps {
  onSubmit: (data: z.infer<typeof taskSchema>) => Promise<void>;
  isLoading: boolean;
  initialData?: any;
}

type TaskFormState = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignedTo: string;
  status: "todo" | "in_progress" | "completed" | "on_hold";
};

interface Employee {
  id: string;
  employeeId: string;
  name: string;
}

export function TaskForm({ onSubmit, isLoading, initialData }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormState>({
    title: "",
    description: "",
    priority: "low",
    assignedTo: "",
    status: "todo",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        priority: initialData.priority,
        assignedTo: initialData.assignedTo,
        status: initialData.status,
      });
    }
  }, [initialData]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const response = await fetch("/api/employees");
        if (!response.ok) throw new Error("Failed to fetch employees");
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoadingEmployees(false);
      }
    }

    fetchEmployees();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    try {
      taskSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: FormErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            const field = err.path[0].toString();
            if (!formattedErrors[field as keyof FormErrors]) {
              formattedErrors[field as keyof FormErrors] = [];
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
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleInputChange}
          className={errors.title ? "border-red-500" : ""}
        />
        {errors.title?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter task description"
          value={formData.description}
          onChange={handleInputChange}
          className={errors.description ? "border-red-500" : ""}
        />
        {errors.description?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => handleSelectChange("priority", value)}
        >
          <SelectTrigger className={errors.priority ? "border-red-500" : ""}>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Select
          value={formData.assignedTo}
          onValueChange={(value) => handleSelectChange("assignedTo", value)}
        >
          <SelectTrigger className={errors.assignedTo ? "border-red-500" : ""}>
            <SelectValue placeholder="Select employee" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingEmployees ? (
              <SelectItem value="loading">Loading employees...</SelectItem>
            ) : employees.length === 0 ? (
              <SelectItem value="none">No employees available</SelectItem>
            ) : (
              employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.employeeId}>
                  {employee.name} ({employee.employeeId})
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {errors.assignedTo?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        >
          <SelectTrigger className={errors.status ? "border-red-500" : ""}>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
        {errors.status?.map((error) => (
          <p key={error} className="text-sm text-red-500">{error}</p>
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (initialData ? "Updating..." : "Adding...") : (initialData ? "Update Task" : "Add Task")}
      </Button>
    </form>
  );
}