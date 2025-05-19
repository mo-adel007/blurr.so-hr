import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { taskSchema } from "@/lib/validators";
import { z } from "zod";

export async function PUT(
  req: Request,
  { params }: { params: { projectId: string; taskId: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const task = await prisma.task.findUnique({
      where: {
        id: params.taskId,
      },
    });

    if (!task) {
      return new NextResponse("Task not found", { status: 404 });
    }

    const body = await req.json();

    try {
      const validatedData = taskSchema.parse(body);
      
      const updatedTask = await prisma.task.update({
        where: {
          id: params.taskId,
        },
        data: validatedData,
      });

      return NextResponse.json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error("[TASK_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}