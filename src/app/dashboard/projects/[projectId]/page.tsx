"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusIcon, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "../components/task-form";
import { TaskTable } from "../components/task-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "../components/kanban-board";

export default function ProjectTasksPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [tasks, setTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<any>(null);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}/tasks`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        variant: "destructive",
      });
    } finally {
      setIsTableLoading(false);
    }
  };

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.projectId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch project");
      }
      const data = await response.json();
      setProject(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch project",
        variant: "destructive",
      });
      router.push("/dashboard/projects");
    }
  };

  useEffect(() => {
    fetchProject();
    fetchTasks();
  }, [params.projectId]);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const url = editingTask 
        ? `/api/projects/${params.projectId}/tasks/${editingTask.id}`
        : `/api/projects/${params.projectId}/tasks`;
      
      const method = editingTask ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${editingTask ? 'update' : 'add'} task`);
      }

      await fetchTasks();
      setIsOpen(false);
      setEditingTask(null);

      toast({
        title: "Success",
        description: `Task ${editingTask ? 'updated' : 'added'} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : `Failed to ${editingTask ? 'update' : 'add'} task`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setIsOpen(true);
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      const task = tasks.find((t: any) => t.id === taskId);
      if (!task) return;

      const response = await fetch(`/api/projects/${params.projectId}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...task, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task status");

      await fetchTasks();
      
      toast({
        description: "Task status updated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task status",
        variant: "destructive",
      });
    }
  };

  if (!project) {
    return null;
  }

  return (
    <div className="container p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard/projects")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold">{project.title}</h1>
        </div>
        <Dialog 
          open={isOpen} 
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setEditingTask(null);
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
              <DialogDescription>
                {editingTask ? 'Edit task details' : `Add a new task to ${project.title}`}
              </DialogDescription>
            </DialogHeader>
            <TaskForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading}
              initialData={editingTask}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Tasks</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kanban">
            <TabsList>
              <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            <TabsContent value="kanban" className="mt-4">
              <KanbanBoard 
                tasks={tasks}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                isLoading={isTableLoading}
              />
            </TabsContent>
            <TabsContent value="list" className="mt-4">
              <TaskTable 
                tasks={tasks} 
                isLoading={isTableLoading}
                onEdit={handleEdit}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}