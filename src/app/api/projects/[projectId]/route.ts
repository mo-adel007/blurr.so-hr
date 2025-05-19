import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET(
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
      return new NextResponse(
        JSON.stringify({ message: "Project not found" }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[PROJECT_GET]", error);
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}