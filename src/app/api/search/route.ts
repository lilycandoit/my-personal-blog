import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function stripHtml(html: string) {
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

export async function GET() {
  const [posts, projects] = await Promise.all([
    prisma.post.findMany({
      select: { slug: true, title: true, content: true, category: true }
    }),
    prisma.project.findMany({
      select: { slug: true, name: true, description: true, stack: true, learnings: true }
    })
  ]);

  const formattedPosts = posts.map(p => ({
    type: 'post',
    slug: p.slug,
    title: p.title,
    description: stripHtml(p.content).slice(0, 160),
    content: `${p.title} ${p.category} ${stripHtml(p.content)}`
  }));

  const formattedProjects = projects.map(p => ({
    type: 'project',
    slug: p.slug,
    title: p.name,
    description: stripHtml(p.description).slice(0, 160),
    content: `${p.name} ${p.stack} ${stripHtml(p.description)} ${p.learnings}`
  }));

  return NextResponse.json([...formattedPosts, ...formattedProjects]);
}

