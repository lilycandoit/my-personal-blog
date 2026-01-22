import Link from 'next/link';
import Image from 'next/image';
import { getProjects } from '@/lib/projects';
import { formatDate } from '@/lib/utils';
import DailyQuote from '@/components/DailyQuote';

// Revalidate every 1 hour - pages are cached and served from CDN
export const revalidate = 3600;

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
  // Fetch all projects (already sorted by the utility)
  const projects = await getProjects();

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
            const formattedDate = formatDate(displayDate, project.timezone, project.location, 'month-year');

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
