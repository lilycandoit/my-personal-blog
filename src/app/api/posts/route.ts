import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { slugify } from '@/lib/utils';

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(['Learning', 'Life', 'Moments']),
  slug: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = postSchema.parse(body);

    const { title, content, category, slug } = validatedData;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        category,
        slug: slug || slugify(title),
      },
    });
    return NextResponse.json(post);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}


