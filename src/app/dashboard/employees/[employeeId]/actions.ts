"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { salarySchema } from "@/lib/validators";
import { z } from "zod";

export async function addSalaryDetails(employeeId: string, data: z.infer<typeof salarySchema>) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const employee = await prisma.employee.findUnique({
      where: { employeeId },
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    // Validate data
    const validatedData = salarySchema.parse(data);

    // Check if salary details for this month already exist
    const existingSalary = await prisma.salaryDetail.findFirst({
      where: {
        employeeId: employee.id,
        month: validatedData.month,
      },
    });

    if (existingSalary) {
      throw new Error("Salary details for this month already exist");
    }

    // Create salary details
    const salary = await prisma.salaryDetail.create({
      data: {
        employeeId: employee.id,
        month: validatedData.month,
        bonus: parseFloat(validatedData.bonus),
        deductible: parseFloat(validatedData.deductible),
      },
    });

    revalidatePath(`/dashboard/employees/${employeeId}`);

    return { success: true, data: salary };
  } catch (error) {
    console.error("[ADD_SALARY_DETAILS]", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}

export async function updateSalaryDetails(
  employeeId: string, 
  salaryId: string, 
  data: z.infer<typeof salarySchema>
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const employee = await prisma.employee.findUnique({
      where: { employeeId },
      include: {
        SalaryDetail: {
          where: { id: salaryId }
        }
      }
    });

    if (!employee) {
      throw new Error("Employee not found");
    }

    if (!employee.SalaryDetail.length) {
      throw new Error("Salary details not found");
    }

    // Validate data
    const validatedData = salarySchema.parse(data);

    // Check if trying to change to a month that already exists (excluding current record)
    const existingSalary = await prisma.salaryDetail.findFirst({
      where: {
        employeeId: employee.id,
        month: validatedData.month,
        NOT: {
          id: salaryId
        }
      },
    });

    if (existingSalary) {
      throw new Error("Salary details for this month already exist");
    }

    // Update salary details
    const salary = await prisma.salaryDetail.update({
      where: { id: salaryId },
      data: {
        month: validatedData.month,
        bonus: parseFloat(validatedData.bonus),
        deductible: parseFloat(validatedData.deductible),
      },
    });

    revalidatePath(`/dashboard/employees/${employeeId}`);

    return { success: true, data: salary };
  } catch (error) {
    console.error("[UPDATE_SALARY_DETAILS]", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Something went wrong" 
    };
  }
}