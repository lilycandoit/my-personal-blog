import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import DailyQuote from '@/components/DailyQuote';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects',
  description: 'Things I\'ve built to understand how things work.',
};

// Helper function to strip HTML tags and get plain text excerpt
function getExcerpt(htmlContent: string, maxLength: number = 150): string {
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
}

export default async function ProjectsPage() {
  // Fetch all projects
  const allProjects = await prisma.project.findMany({
    include: {
      images: true,
    },
  });

  // Log for debugging production
  console.log('[Projects Page] Raw projects from DB:', allProjects.map(p => ({
    name: p.name,
    builtDate: p.builtDate,
    builtDateType: typeof p.builtDate,
    createdAt: p.createdAt,
  })));

  // Sort in JavaScript: newest builtDate first, nulls at end
  const projects = allProjects.sort((a, b) => {
    // Projects without builtDate go to the end
    if (!a.builtDate && !b.builtDate) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (!a.builtDate) return 1;  // a goes after b
    if (!b.builtDate) return -1; // b goes after a

    // Both have builtDate, sort newest first (descending)
    const dateA = new Date(a.builtDate).getTime();
    const dateB = new Date(b.builtDate).getTime();

    console.log(`[Projects Page] Comparing ${a.name} (${a.builtDate}, ${dateA}) vs ${b.name} (${b.builtDate}, ${dateB})`);

    return dateB - dateA; // Higher timestamp first (newer)
  });

  console.log('[Projects Page] Sorted order:', projects.map(p => `${p.name} (${p.builtDate || 'no date'})`));

  return (
    <div className="max-w-[1400px] mx-auto px-8">
      {/* Quote Section */}
      <div className="my-12">
        <DailyQuote variant="projects" />
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {projects.map((project) => {
            const coverImage = project.images?.find(img => img.id === project.coverImageId) || project.images?.[0];
            const imageUrl = coverImage?.url || '/sunshine_leaves.avif';
            const imageAlt = coverImage?.alt || project.name;
            const excerpt = getExcerpt(project.description);

            const displayDate = new Date(project.builtDate || project.createdAt);
            const formattedDate = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              year: 'numeric'
            }).format(displayDate);

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="border-0 no-underline block hover:bg-transparent"
              >
                <article className="h-full flex flex-col border border-border-light dark:border-border-dark rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
                  {/* Cover Image */}
                  <div className="w-full h-[220px] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={coverImage?.width || 800}
                      height={coverImage?.height || 600}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    <h2 className="mb-0 mt-0 text-2xl text-gray-800 dark:text-gray-100 leading-snug">
                      {project.name}
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-muted-light dark:text-muted-dark flex-wrap">
                      <span>
                        {formattedDate}
                      </span>
                      <span className="text-border-light dark:text-border-dark">|</span>
                      <span className={`text-sm px-3 py-1 rounded-xl font-semibold capitalize ${
                        project.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Tech Stack */}
                    <div className="text-sm text-muted-light dark:text-muted-dark">
                      {project.stack}
                    </div>

                    {/* Excerpt */}
                    <p className="m-0 text-base leading-relaxed text-gray-600 dark:text-gray-400 flex-1">
                      {excerpt}
                    </p>

                    {/* View Project */}
                    <div className="text-base font-semibold text-primary tracking-wide">
                      View Project →
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">No projects yet.</p>
      )}
    </div>
  );
}
