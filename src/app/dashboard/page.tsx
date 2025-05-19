// src/app/dashboard/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Users, 
  Folders, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

async function getStats() {
  const [
    employeeCount,
    projectCount,
    taskStats,
    recentProjects,
    upcomingTasks
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.project.count(),
    prisma.task.groupBy({
      by: ['status'],
      _count: true,
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { tasks: true }
        }
      }
    }),
    prisma.task.findMany({
      where: {
        status: {
          in: ['todo', 'in_progress']
        }
      },
      take: 5,
      orderBy: { priority: 'desc' },
      include: {
        project: true
      }
    })
  ]);

  const taskStatusCount = {
    total: taskStats.reduce((acc, curr) => acc + curr._count, 0),
    completed: taskStats.find(s => s.status === 'completed')?._count || 0,
    inProgress: taskStats.find(s => s.status === 'in_progress')?._count || 0,
    todo: taskStats.find(s => s.status === 'todo')?._count || 0,
    onHold: taskStats.find(s => s.status === 'on_hold')?._count || 0,
  };

  return {
    employeeCount,
    projectCount,
    taskStats: taskStatusCount,
    recentProjects,
    upcomingTasks
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getStats();

  const taskCompletionRate = stats.taskStats.total > 0
    ? ((stats.taskStats.completed / stats.taskStats.total) * 100).toFixed(1)
    : 0;

  return (
    <div className="container p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back, {session?.user?.name || "User"}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.employeeCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <Folders className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.projectCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.taskStats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {taskCompletionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tasks In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.taskStats.inProgress}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Latest projects created in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentProjects.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No projects found. Start by creating your first project.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {stats.recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {project._count.tasks} tasks
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <ArrowRight className="h-4 w-4" />
                          <span className="sr-only">View project</span>
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>
                High priority tasks that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.upcomingTasks.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No upcoming tasks found.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  {stats.upcomingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {task.project.title}
                        </p>
                      </div>
                      <div className={cn(
                        "text-xs font-medium",
                        task.priority === "high" ? "text-red-500" :
                        task.priority === "medium" ? "text-yellow-500" :
                        "text-green-500"
                      )}>
                        {task.priority}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
