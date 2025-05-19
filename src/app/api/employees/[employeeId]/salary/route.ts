import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

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
    });

    if (!employee) {
      return new NextResponse(
        JSON.stringify({ message: "Employee not found" }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json(employee);
  } catch (error) {
    console.error("[EMPLOYEE_GET]", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}