import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { taskSchema } from "@/lib/validators";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const tasks = await prisma.task.findMany({
      where: {
        projectId: params.projectId,
      },
      orderBy: {
        priority: "desc",
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("[TASKS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.projectId,
      },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    const body = await req.json();

    try {
      const validatedData = taskSchema.parse(body);
      
      const task = await prisma.task.create({
        data: {
          ...validatedData,
          projectId: params.projectId,
        },
      });

      return NextResponse.json(task, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error("[TASKS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}