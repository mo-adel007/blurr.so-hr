"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { FolderIcon, SearchIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

interface ProjectTableProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectTable({ projects, isLoading }: ProjectTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-8 w-[100px]" />
          </div>
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <FolderIcon className="h-10 w-10 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Get started by creating your first project.
        </p>
        <Button asChild className="mt-4">
          <Link href="#" onClick={() => document.querySelector<HTMLButtonElement>('[data-add-project]')?.click()}>
            Create Project
          </Link>
        </Button>
      </motion.div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search projects..."
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
            No projects found matching &quot;{searchTerm}&quot;
          </p>
          <Button variant="outline" className="mt-4" onClick={() => setSearchTerm("")}>
            Clear search
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search projects..."
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
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProjects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>{project.description}</TableCell>
              <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  onClick={() => {
                    toast({
                      description: `Viewing tasks for ${project.title}`
                    });
                  }}
                >
                  <Link href={`/dashboard/projects/${project.id}`}>
                    View Tasks
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}