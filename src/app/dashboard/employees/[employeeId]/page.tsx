import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { SalaryDetails } from "../components/salary-details";

async function getEmployee(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { employeeId },
    include: {
      SalaryDetail: {
        orderBy: {
          month: 'desc'
        }
      }
    }
  });

  if (!employee) {
    return null;
  }

  return {
    ...employee,
    joiningDate: employee.joiningDate.toISOString(),
    createdAt: employee.createdAt.toISOString(),
  };
}

export default async function EmployeeSalaryPage({
  params
}: {
  params: { employeeId: string }
}) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const employee = await getEmployee(params.employeeId);

  if (!employee) {
    redirect("/dashboard/employees");
  }

  return (
    <div className="container p-6">
      <Card>
        <CardHeader>
          <CardTitle>{employee.name}</CardTitle>
          <CardDescription>Employee ID: {employee.employeeId}</CardDescription>
        </CardHeader>
        <CardContent>
          <SalaryDetails 
            employee={employee} 
            salaries={employee.SalaryDetail} 
          />
        </CardContent>
      </Card>
    </div>
  );
}