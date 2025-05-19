"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HomePage() {
  const { data: session, status } = useSession();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-8 flex items-center justify-center">
          <Image
            src="/logo.svg"
            alt="HR Portal Logo"
            width={300}
            height={300}
            className="animate-pulse"
            priority
          />
        </div>

        <h1 className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
          HR Management Portal
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 max-w-prose text-lg mx-auto text-muted-foreground"
        >
          Streamline your HR operations with our comprehensive employee management system. Manage salaries, track
          performance, and handle employee data all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          {status === "loading" ? (
            <Button disabled>Loading...</Button>
          ) : session ? (
            <Button
              asChild
              size="lg"
              className="animate-pulse"
            >
              <Link href="/dashboard">Access Portal</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                size="lg"
              >
                <Link href="/register">Get Started</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                size="lg"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3"
        >
          <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
            <h3 className="text-lg font-semibold">Employee Management</h3>
            <p className="text-sm text-muted-foreground">Efficiently manage your workforce data and records</p>
          </div>
          <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
            <h3 className="text-lg font-semibold">Salary Administration</h3>
            <p className="text-sm text-muted-foreground">Handle payroll and compensation with ease</p>
          </div>
          <div className="rounded-lg border p-4 transition-colors hover:bg-accent">
            <h3 className="text-lg font-semibold">Performance Tracking</h3>
            <p className="text-sm text-muted-foreground">Monitor and evaluate employee performance</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
