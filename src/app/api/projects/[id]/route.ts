import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { sanitizeText } from '@/lib/sanitize';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const projectUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  stack: z.string().min(1, "Stack is required").optional(),
  status: z.enum(['in-progress', 'completed']).optional(),
  learnings: z.string().optional(),
  githubUrl: z.union([z.string().url(), z.literal('')]).optional(),
  demoUrl: z.union([z.string().url(), z.literal('')]).optional(),
  demoVideoUrl: z.union([z.string().url(), z.literal('')]).optional(),
  builtDate: z.string().optional(),
  imageIds: z.array(z.string()).optional(),
  coverImageId: z.string().nullable().optional(),
});

// GET - Fetch single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT - Update project
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    console.log('[Project Update] Received data:', JSON.stringify(body, null, 2));

    // Normalize status value to match enum (handle legacy data)
    if (body.status && typeof body.status === 'string') {
      const statusLower = body.status.toLowerCase().replace(/\s+/g, '-');
      if (statusLower.includes('progress')) {
        body.status = 'in-progress';
      } else if (statusLower.includes('complete')) {
        body.status = 'completed';
      }
    }

    const validatedData = projectUpdateSchema.parse(body);

    const { name, description, stack, status, learnings, githubUrl, demoUrl, demoVideoUrl, builtDate, imageIds, coverImageId } = validatedData;

    // Sanitize text fields to replace curly quotes and special characters
    const sanitizedName = name ? sanitizeText(name) : undefined;
    const sanitizedDescription = description ? sanitizeText(description) : undefined;
    const sanitizedStack = stack ? sanitizeText(stack) : undefined;
    const sanitizedLearnings = learnings !== undefined ? sanitizeText(learnings) : undefined;

    console.log('[Project Update] Validated and sanitized data');

    // Update project with new data in a single database operation
    // Using 'set' replaces all image relations at once (clears + connects)
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(sanitizedName && { name: sanitizedName }),
        ...(sanitizedDescription && { description: sanitizedDescription }),
        ...(sanitizedStack && { stack: sanitizedStack }),
        ...(status && { status }),
        ...(sanitizedLearnings !== undefined && { learnings: sanitizedLearnings }),
        ...(githubUrl !== undefined && { githubUrl: githubUrl || null }),
        ...(demoUrl !== undefined && { demoUrl: demoUrl || null }),
        ...(demoVideoUrl !== undefined && { demoVideoUrl: demoVideoUrl || null }),
        ...(builtDate !== undefined && { builtDate: builtDate ? new Date(builtDate) : null }),
        ...(coverImageId !== undefined && { coverImageId: coverImageId || null }),
        images: {
          set: imageIds?.map(imageId => ({ id: imageId })) || [],
        },
      },
      include: {
        images: true,
      },
    });

    // Revalidate cached pages so changes appear immediately
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath(`/projects/${project.slug}`);

    console.log('[Project Update] Successfully updated project:', project.id);
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Project Update] Validation error:', error.issues);
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    console.error('[Project Update] Error details:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Get the project slug before deleting (for revalidation)
    const project = await prisma.project.findUnique({
      where: { id },
      select: { slug: true },
    });

    await prisma.project.delete({
      where: { id },
    });

    // Revalidate cached pages
    revalidatePath('/');
    revalidatePath('/projects');
    if (project?.slug) {
      revalidatePath(`/projects/${project.slug}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
