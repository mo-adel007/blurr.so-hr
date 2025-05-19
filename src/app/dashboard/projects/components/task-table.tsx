"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClipboardListIcon, SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignedTo: string;
  status: string;
}

interface TaskTableProps {
  tasks: Task[];
  isLoading: boolean;
}

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const statusColors = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  on_hold: "bg-yellow-100 text-yellow-800",
};

export function TaskTable({ tasks, isLoading }: TaskTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ClipboardListIcon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No tasks yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first task.
        </p>
      </motion.div>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value) {
                toast({
                  description: `Searching for "${e.target.value}"...`
                });
              }
            }}
            className="max-w-sm"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <SearchIcon className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No results found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No tasks found matching &quot;{searchTerm}&quot;
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (e.target.value) {
              toast({
                description: `Searching for "${e.target.value}"...`
              });
            }
          }}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                <Badge className={priorityColors[task.priority as keyof typeof priorityColors]}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>
                <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                  {task.status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}