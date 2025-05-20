import { Suspense } from "react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardStats } from "./components/dashboard-stats";
import { DashboardLoading } from "./components/dashboard-loading";

async function getStats() {
  const employeeCount = await prisma.employee.count();
  const projectCount = await prisma.project.count();
  const taskCount = await prisma.task.count();
  
  return {
    employeeCount,
    projectCount,
    taskCount
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getStats();

  return (
    <div className="container p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome {session?.user?.name || "User"}!</CardTitle>
            <CardDescription>You&apos;re logged in with {session?.user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This is your protected dashboard page.</p>
          </CardContent>
        </Card>
        
        <Suspense fallback={<DashboardLoading />}>
          <DashboardStats stats={stats} />
        </Suspense>
      </div>
    </div>
  );
}