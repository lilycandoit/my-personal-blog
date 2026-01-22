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

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(['Learning', 'Life', 'Moments']),
  visibility: z.enum(['public', 'unlisted', 'draft']).optional().default('public'),
  featured: z.boolean().optional().default(false),
  slug: z.string().optional(),
  imageIds: z.array(z.string()).optional().default([]),
  coverImageId: z.string().nullable().optional(),
});

// GET - Fetch all posts
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { updatedAt: 'desc' }, // Most recently updated posts first
      include: {
        images: true,
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = postSchema.parse(body);

    const { title, content, category, visibility, featured, slug, imageIds, coverImageId } = validatedData;

    // Sanitize text fields to replace curly quotes and special characters
    const sanitizedTitle = sanitizeText(title);
    const sanitizedContent = sanitizeText(content);

    const post = await prisma.post.create({
      data: {
        title: sanitizedTitle,
        content: sanitizedContent,
        category,
        visibility,
        featured,
        slug: slug || slugify(sanitizedTitle),
        coverImageId: coverImageId || null,
        timezone: DEFAULT_TIMEZONE,
        location: DEFAULT_LOCATION,
        images: {
          connect: imageIds?.map(id => ({ id })) || [],
        },
      },
    });

    // Revalidate cached pages so new post appears immediately
    revalidatePath('/');
    revalidatePath('/posts');

    return NextResponse.json(post);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}


