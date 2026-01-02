import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { slugify } from '@/lib/utils';

const projectSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  stack: z.string().min(1, "Stack is required"),
  status: z.enum(['learning', 'completed', 'experimenting']),
  learnings: z.string().optional().default(''),
  githubUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = projectSchema.parse(body);

    const { name, description, stack, status, learnings, githubUrl, demoUrl } = validatedData;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        stack,
        status,
        learnings,
        githubUrl: githubUrl || null,
        demoUrl: demoUrl || null,
        slug: slugify(name),
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


