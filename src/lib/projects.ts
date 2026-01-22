import { prisma } from './prisma';
import type { Project, Image } from '@prisma/client';

// Project with images included
export type ProjectWithImages = Project & {
  images: Image[];
};

/**
 * Sort projects by builtDate (month/year), then by createdAt as tiebreaker
 * Newest first
 */
export function sortProjects<T extends { builtDate: Date | null; createdAt: Date }>(
  projects: T[]
): T[] {
  return [...projects].sort((a, b) => {
    const dateA = new Date(a.builtDate || a.createdAt);
    const dateB = new Date(b.builtDate || b.createdAt);

    // Compare year and month only (ignore day/time since builtDate is month-only)
    const yearMonthA = dateA.getFullYear() * 12 + dateA.getMonth();
    const yearMonthB = dateB.getFullYear() * 12 + dateB.getMonth();

    // If different months, sort by month (newest first)
    if (yearMonthB !== yearMonthA) {
      return yearMonthB - yearMonthA;
    }

    // Same month - use createdAt as tiebreaker (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Fetch all projects with images, sorted by date
 */
export async function getProjects(): Promise<ProjectWithImages[]> {
  const projects = await prisma.project.findMany({
    include: {
      images: true,
    },
  });

  return sortProjects(projects);
}

/**
 * Fetch a single project by slug
 */
export async function getProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
  return prisma.project.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });
}

/**
 * Get all project slugs (for static generation)
 */
export async function getAllProjectSlugs(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    select: { slug: true },
  });
  return projects.map((p) => p.slug);
}
