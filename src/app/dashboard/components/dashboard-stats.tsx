"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface DashboardStatsProps {
  stats: {
    employeeCount: number;
    projectCount: number;
    taskCount: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Active Employees</CardTitle>
            <CardDescription>Current employee count</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.employeeCount}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>Current project count</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.projectCount}</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Total Tasks</CardTitle>
            <CardDescription>All tasks count</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{stats.taskCount}</p>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}