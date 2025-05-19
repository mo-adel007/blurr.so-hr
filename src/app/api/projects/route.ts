import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { projectSchema } from "@/lib/validators";
import { z } from "zod";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const projects = await prisma.project.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    try {
      const validatedData = projectSchema.parse(body);
      
      const project = await prisma.project.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
        },
      });

      return NextResponse.json(project, { status: 201 });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new NextResponse(JSON.stringify(error.errors), { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}