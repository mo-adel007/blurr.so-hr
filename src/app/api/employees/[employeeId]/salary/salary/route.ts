import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const salarySchema = z.object({
  month: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Please enter a valid month (YYYY-MM)"),
  bonus: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Bonus must be a positive number"),
  deductible: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, "Deductible must be a positive number"),
});

export async function GET(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const employee = await prisma.employee.findUnique({
      where: {
        employeeId: params.employeeId,
      },
      include: {
        SalaryDetail: true,
      },
    });

    if (!employee) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    // Sort salary details by month in descending order
    const sortedSalaries = employee.SalaryDetail.sort((a, b) => 
      new Date(b.month).getTime() - new Date(a.month).getTime()
    );

    return NextResponse.json(sortedSalaries);
  } catch (error) {
    console.error("[SALARY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { employeeId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const employee = await prisma.employee.findUnique({
      where: {
        employeeId: params.employeeId,
      },
    });

    if (!employee) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    const body = await req.json();

    try {
      const validatedData = salarySchema.parse(body);

      // Check if salary details for this month already exist
      const existingSalary = await prisma.salaryDetail.findFirst({
        where: {
          employeeId: employee.id,
          month: validatedData.month,
        },
      });

      if (existingSalary) {
        return new NextResponse(
          JSON.stringify({ message: "Salary details for this month already exist" }), 
          { status: 409, headers: { 'Content-Type': 'application/json' } }
        );
      }

      const salary = await prisma.salaryDetail.create({
        data: {
          employeeId: employee.id,
          month: validatedData.month,
          bonus: parseFloat(validatedData.bonus),
          deductible: parseFloat(validatedData.deductible),
        },
      });

      return NextResponse.json(salary, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(
          JSON.stringify({ message: error.errors[0].message }), 
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("[SALARY_POST]", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}