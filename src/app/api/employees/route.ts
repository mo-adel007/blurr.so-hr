import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { employeeSchema } from "@/lib/validators";
import { z } from "zod";

// src/app/api/employees/route.ts
export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const employees = await prisma.employee.findMany({
      include: {
        SalaryDetail: true
      },
      orderBy: {
        employeeId: "asc",
      },
    });

    return NextResponse.json(employees);
  } catch (error) {
    console.error("[EMPLOYEES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}


export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    try {
      const validatedData = employeeSchema.parse(body);
      
      // Check if employee ID already exists
      const existingEmployee = await prisma.employee.findUnique({
        where: {
          employeeId: validatedData.employeeId,
        },
      });

      if (existingEmployee) {
        return new NextResponse("Employee ID already exists", { status: 409 });
      }

      const employee = await prisma.employee.create({
        data: {
          employeeId: validatedData.employeeId,
          name: validatedData.name,
          joiningDate: new Date(validatedData.joiningDate),
          basicSalary: parseFloat(validatedData.basicSalary),
        },
      });

      return NextResponse.json(employee, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error("[EMPLOYEES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}