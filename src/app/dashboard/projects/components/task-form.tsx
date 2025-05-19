"use client";

import { useState } from "react";
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
}

type TaskFormState = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  assignedTo: string;
  status: "todo" | "in_progress" | "completed" | "on_hold";
};

export function TaskForm({ onSubmit, isLoading }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormState>({
    title: "",
    description: "",
    priority: "low",
    assignedTo: "",
    status: "todo",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
            if (!formattedErrors[field]) {
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
    setFormData({
      title: "",
      description: "",
      priority: "low",
      assignedTo: "",
      status: "todo",
    });
    setErrors({});
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
        <Input
          id="assignedTo"
          name="assignedTo"
          placeholder="Enter assignee name"
          value={formData.assignedTo}
          onChange={handleInputChange}
          className={errors.assignedTo ? "border-red-500" : ""}
        />
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
        {isLoading ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
}