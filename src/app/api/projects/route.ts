import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { slugify } from '@/lib/utils';
import { sanitizeText } from '@/lib/sanitize';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DEFAULT_TIMEZONE, DEFAULT_LOCATION } from '@/lib/config';

export const dynamic = 'force-dynamic';

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  stack: z.string().min(1, "Stack is required"),
  status: z.enum(['in-progress', 'completed']),
  learnings: z.string().optional().default(''),
  githubUrl: z.union([z.string().url(), z.literal('')]).optional(),
  demoUrl: z.union([z.string().url(), z.literal('')]).optional(),
  demoVideoUrl: z.union([z.string().url(), z.literal('')]).optional(),
  builtDate: z.string().optional(),
  imageIds: z.array(z.string()).optional().default([]),
  coverImageId: z.string().nullable().optional(),
});

// GET - Fetch all projects
export async function GET() {
  try {
    // Fetch all projects
    const projects = await prisma.project.findMany({
      include: {
        images: true,
      },
    });

    // Sort in JavaScript: newest date first (using builtDate or createdAt as fallback)
    // This matches the display logic where we show builtDate || createdAt
    const sortedProjects = projects.sort((a, b) => {
      // Use builtDate if available, otherwise fall back to createdAt (same as display logic)
      const dateA = new Date(a.builtDate || a.createdAt).getTime();
      const dateB = new Date(b.builtDate || b.createdAt).getTime();

      // Sort newest first (descending)
      return dateB - dateA;
    });

    return NextResponse.json(sortedProjects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
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
        timezone: DEFAULT_TIMEZONE,
        location: DEFAULT_LOCATION,
        slug: slugify(sanitizedName),
        images: {
          connect: imageIds?.map(id => ({ id })) || [],
        },
      },
    });

    // Revalidate cached pages so new project appears immediately
    revalidatePath('/');
    revalidatePath('/projects');

    return NextResponse.json(project);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}


