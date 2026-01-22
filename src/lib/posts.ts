import { prisma } from './prisma';
import type { Post, Image } from '@prisma/client';

// Post with images included
export type PostWithImages = Post & {
  images: Image[];
};

/**
 * Sort posts by updatedAt (newest first)
 */
export function sortPosts<T extends { updatedAt: Date }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/**
 * Fetch all posts with images, sorted by updatedAt
 * Optionally filter by visibility
 */
export async function getPosts(options?: {
  visibility?: 'public' | 'unlisted' | 'draft';
  featured?: boolean;
  limit?: number;
}): Promise<PostWithImages[]> {
  const where: Record<string, unknown> = {};

  if (options?.visibility) {
    where.visibility = options.visibility;
  }
  if (options?.featured !== undefined) {
    where.featured = options.featured;
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    take: options?.limit,
    include: {
      images: true,
    },
  });

  return posts;
}

/**
 * Fetch all posts (including drafts) for admin
 */
export async function getAllPosts(): Promise<PostWithImages[]> {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      images: true,
    },
  });

  return posts;
}

/**
 * Fetch a single post by slug
 */
export async function getPostBySlug(slug: string): Promise<PostWithImages | null> {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });
}

/**
 * Get all public post slugs (for static generation)
 */
export async function getPublicPostSlugs(): Promise<string[]> {
  const posts = await prisma.post.findMany({
    where: { visibility: 'public' },
    select: { slug: true },
  });
  return posts.map((p) => p.slug);
}
