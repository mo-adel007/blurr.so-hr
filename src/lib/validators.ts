import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const employeeSchema = z.object({
  employeeId: z.string()
    .min(4, "Employee ID must be at least 4 characters")
    .regex(/^[A-Za-z0-9-]+$/, "Employee ID can only contain letters, numbers, and hyphens"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[A-Za-z\s-]+$/, "Name can only contain letters, spaces, and hyphens"),
  joiningDate: z.string()
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    }, "Joining date cannot be in the future"),
  basicSalary: z.string()
    .refine((salary) => !isNaN(parseFloat(salary)) && parseFloat(salary) > 0, "Salary must be a positive number"),
});
export const salarySchema = z.object({
  month: z.string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Please enter a valid month (YYYY-MM)")
    .refine((month) => {
      const selectedDate = new Date(month);
      const today = new Date();
      return selectedDate <= today;
    }, "Month cannot be in the future"),
  bonus: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Bonus must be a positive number")
    .refine((val) => parseFloat(val) <= 1000000, "Bonus cannot exceed 1,000,000"),
  deductible: z.string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Deductible must be a positive number")
    .refine((val) => parseFloat(val) <= 1000000, "Deductible cannot exceed 1,000,000"),
});

export const projectSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .regex(/^[A-Za-z0-9\s\-_]+$/, "Title can only contain letters, numbers, spaces, hyphens, and underscores"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
});

export const taskSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level",
  }),
  assignedTo: z.string()
    .min(1, "Please select a user to assign the task to"),
  status: z.enum(["todo", "in_progress", "completed", "on_hold"], {
    required_error: "Please select a status",
  }),
});

