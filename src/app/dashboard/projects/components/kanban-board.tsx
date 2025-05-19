"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PencilIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  assignedTo: string;
  status: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: string) => void;
  isLoading: boolean;
}

const statusColumns = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "completed", label: "Completed" },
  { id: "on_hold", label: "On Hold" },
];

const priorityColors = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

export function KanbanBoard({ tasks, onEdit, onStatusChange, isLoading }: KanbanBoardProps) {
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    onStatusChange(taskId, status);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {statusColumns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col gap-4 rounded-lg border bg-muted/50 p-4"
          >
            <h3 className="font-semibold">{column.label}</h3>
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-24 rounded-md bg-muted"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
      {statusColumns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col gap-4 rounded-lg border bg-muted/50 p-4"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, column.id)}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{column.label}</h3>
            <Badge variant="secondary" className="ml-2">
              {tasks.filter((task) => task.status === column.id).length}
            </Badge>
          </div>

          <div className="flex flex-col gap-2">
            {tasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card
                    className="cursor-move p-4 hover:border-primary/50"
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{task.title}</p>
                          <Badge
                            className={priorityColors[task.priority as keyof typeof priorityColors]}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {task.description}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => onEdit(task)}
                      >
                        <PencilIcon className="h-4 w-4" />
                        <span className="sr-only">Edit task</span>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}