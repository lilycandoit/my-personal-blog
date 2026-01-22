import { formatDate } from '@/lib/utils';
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/projects';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ImageWithZoom from '@/components/ImageWithZoom';

// Revalidate every 1 hour - pages are cached and served from CDN
export const revalidate = 3600;

// Pre-generate pages for all existing projects at build time
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) return {};
    return { title: project.name };
}


export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);


  if (!project) {
    notFound();
  }

  // Format date (Month Year only)
  const dateToShow = project.builtDate ? new Date(project.builtDate) : new Date(project.createdAt);
  const formattedDate = formatDate(dateToShow, project.timezone, project.location, 'month-year');

  // Get thumbnail image (cover or first image)
  const thumbnailImage = project.images?.find(img => img.id === project.coverImageId) || project.images?.[0];

  return (
    <article className="m-8 p-0">
      {/* Main Content Container */}
      <div className="max-w-[900px] mx-auto px-8 pb-16">
        {/* Header: Title and Date/Location inline */}
        <header className="project-title-row mb-8 flex items-baseline justify-between gap-4 flex-wrap">
          <h1 className="m-0 text-[2.5rem] leading-tight font-bold">
            {project.name}
          </h1>
          <span className="project-date text-base text-muted-light dark:text-muted-dark font-hand whitespace-nowrap">
            {formattedDate}
          </span>
        </header>

        {/* Grid Layout: 1/3 Sidebar + 2/3 Description */}
        <div className="project-single-grid mb-12">
          {/* Left Sidebar (1/3) */}
          <div>
            {/* Status Tag */}
            <div className="mb-6">
              <span className={`inline-block py-2 px-4 rounded-lg text-[0.9rem] font-semibold capitalize ${
                project.status === 'completed'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-sky-100 text-sky-700 border border-sky-200'
              }`}>
                {project.status}
              </span>
            </div>

            {/* Thumbnail Image */}
            {thumbnailImage && (
              <div className="mb-6">
                <ImageWithZoom
                  src={thumbnailImage.url}
                  alt={thumbnailImage.alt || project.name}
                  width={thumbnailImage.width || 400}
                  height={thumbnailImage.height || 300}
                  aspectRatio="4/3"
                  objectFit="cover"
                />
              </div>
            )}

            {/* Tech Stack Card */}
            <div className="bg-[#f8faff] p-6 rounded-xl border border-border-light dark:border-border-dark mb-6">
              <h3 className="m-0 mb-4 text-[1.1rem] font-ui font-semibold">
                Tech Stack
              </h3>
              <p className="m-0 text-[0.95rem] leading-relaxed">
                {project.stack}
              </p>
            </div>

            {/* View Code and Demo Buttons */}
            {(project.githubUrl || project.demoUrl) && (
              <div className="flex flex-col gap-3 mb-6">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-3 px-6 bg-primary text-white rounded-lg no-underline font-ui text-[0.95rem] font-medium border-none"
                  >
                    View Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-3 px-6 bg-white text-primary border-2 border-primary rounded-lg no-underline font-ui text-[0.95rem] font-medium"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            )}

            {/* Key Takeaways (Optional) */}
            {project.learnings && (
              <div className="bg-[#fffbf0] p-6 rounded-xl border border-[#ffe8a3]">
                <h3 className="m-0 mb-3 text-[1.1rem] font-ui font-semibold">
                  Key Takeaways
                </h3>
                <p className="m-0 text-[0.95rem] leading-relaxed">
                  {project.learnings}
                </p>
              </div>
            )}
          </div>

          {/* Right Content (2/3) - Description */}
          <div>
            <div
              className="prose prose-lg text-xl font-body leading-[1.8]"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
        </div>

        {/* Demo Video */}
        {project.demoVideoUrl && (
          <div className="mb-12">
            <h2 className="text-2xl mb-4">Demo Video</h2>
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-md">
              <iframe
                src={project.demoVideoUrl.replace('watch?v=', 'embed/')}
                className="absolute top-0 left-0 w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Project Gallery */}
        {project.images && project.images.filter(img => img.id !== thumbnailImage?.id).length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl mb-4">Project Gallery</h2>
            <div className="project-gallery">
              {project.images
                .filter(img => img.id !== thumbnailImage?.id)
                .map((image) => (
                  <ImageWithZoom
                    key={image.id}
                    src={image.url}
                    alt={image.alt || image.filename}
                    width={image.width || 500}
                    height={image.height || 350}
                    aspectRatio="4/3"
                    objectFit="cover"
                  />
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border-light dark:border-border-dark shadow-[0_-2px_8px_rgba(0,0,0,0.03)] pt-8 mt-16">
          <Link
            href="/projects"
            className="text-muted-light dark:text-muted-dark border-none no-underline font-ui text-[0.95rem] hover:text-primary"
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    </article>
  );
}
