import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { slugify } from '@/lib/utils';
import { sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  stack: z.string().min(1, "Stack is required"),
  status: z.enum(['in-progress', 'completed']),
  learnings: z.string().optional().default(''),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  demoVideoUrl: z.string().url().optional().or(z.literal('')),
  builtDate: z.string().optional(),
  imageIds: z.array(z.string()).optional().default([]),
  coverImageId: z.string().nullable().optional(),
});

// GET - Fetch all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
      },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    const { name, description, stack, status, learnings, githubUrl, demoUrl, demoVideoUrl, builtDate, imageIds, coverImageId } = validatedData;

    // Sanitize text fields to replace curly quotes and special characters
    const sanitizedName = sanitizeText(name);
    const sanitizedDescription = sanitizeText(description);
    const sanitizedStack = sanitizeText(stack);
    const sanitizedLearnings = learnings ? sanitizeText(learnings) : '';

    const project = await prisma.project.create({
      data: {
        name: sanitizedName,
        description: sanitizedDescription,
        stack: sanitizedStack,
        status,
        learnings: sanitizedLearnings,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        demoVideoUrl: demoVideoUrl || null,
        builtDate: builtDate ? new Date(builtDate) : null,
        coverImageId: coverImageId || null,
        slug: slugify(sanitizedName),
        images: {
          connect: imageIds?.map(id => ({ id })) || [],
        },
      },
    });
    return NextResponse.json(project);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}


