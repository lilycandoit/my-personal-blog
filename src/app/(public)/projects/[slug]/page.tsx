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

function formatStatus(status: string) {
  return status.replace(/-/g, ' ');
}

function getVideoEmbedUrl(url: string) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes('youtube.com')) {
      const videoId = parsed.searchParams.get('v');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsed.hostname.includes('youtu.be')) {
      const videoId = parsed.pathname.replace('/', '');
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }

    if (parsed.hostname.includes('vimeo.com')) {
      const videoId = parsed.pathname.split('/').filter(Boolean).pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
  } catch {
    return url.replace('watch?v=', 'embed/');
  }

  return url.replace('watch?v=', 'embed/');
}

export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const dateToShow = project.builtDate ? new Date(project.builtDate) : new Date(project.createdAt);
  const formattedDate = formatDate(dateToShow, project.timezone, project.location, 'month-year');
  const coverImage = project.images?.find((img) => img.id === project.coverImageId) || project.images?.[0];
  const galleryImages = project.images?.filter((img) => img.id !== coverImage?.id) || [];
  const hasLinks = Boolean(project.githubUrl || project.demoUrl);
  const hasLearnings = project.learnings.trim().length > 0;

  return (
    <article className="px-5 py-8 md:px-8">
      <div className="mx-auto max-w-[1120px] pb-16">
        <header className="mb-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <div>
            <Link
              href="/projects"
              className="mb-6 inline-block border-none text-sm text-muted-light hover:bg-transparent hover:text-primary"
            >
              Back to Projects
            </Link>

            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-md px-3 py-1 text-sm font-semibold capitalize ${
                  project.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-sky-100 text-sky-700'
                }`}
              >
                {formatStatus(project.status)}
              </span>
              <span className="text-base text-muted-light dark:text-muted-dark">
                {formattedDate}, {project.location}
              </span>
            </div>

            <h1 className="m-0 max-w-[780px] text-[2.35rem] leading-tight md:text-[3rem]">
              {project.name}
            </h1>
          </div>

          <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
            <p className="m-0 mb-3 text-sm font-semibold uppercase text-muted-light dark:text-muted-dark">
              Project Snapshot
            </p>
            <dl className="m-0 grid gap-4 text-base">
              <div>
                <dt className="font-semibold text-gray-900 dark:text-gray-50">Built</dt>
                <dd className="m-0 text-muted-light dark:text-muted-dark">{formattedDate}</dd>
              </div>
              <div>
                <dt className="font-semibold text-gray-900 dark:text-gray-50">Stack</dt>
                <dd className="m-0 text-muted-light dark:text-muted-dark">{project.stack}</dd>
              </div>
            </dl>
          </div>
        </header>

        {coverImage && (
          <section className="mb-12">
            <ImageWithZoom
              src={coverImage.url}
              alt={coverImage.alt || project.name}
              width={coverImage.width || 1200}
              height={coverImage.height || 760}
              aspectRatio="16/9"
              objectFit="cover"
              borderRadius="12px"
            />
          </section>
        )}

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <main className="min-w-0">
            <section className="mb-12">
              <p className="m-0 mb-3 text-sm font-semibold uppercase text-muted-light dark:text-muted-dark">
                The Story
              </p>
              <div
                className="prose prose-lg max-w-none text-xl font-body leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
            </section>

            {hasLearnings && (
              <section className="mb-12 border-l-4 border-primary bg-primary/5 px-6 py-5">
                <h2 className="m-0 mb-4 text-2xl">What Changed While Building It</h2>
                <p className="m-0 text-lg leading-relaxed text-gray-700 dark:text-gray-200">
                  {project.learnings}
                </p>
              </section>
            )}

            {project.demoVideoUrl && (
              <section className="mb-12">
                <h2 className="mb-4 text-2xl">Demo Walkthrough</h2>
                <div className="relative h-0 overflow-hidden rounded-xl pb-[56.25%] shadow-md">
                  <iframe
                    src={getVideoEmbedUrl(project.demoVideoUrl)}
                    className="absolute left-0 top-0 h-full w-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </section>
            )}

            {galleryImages.length > 0 && (
              <section className="mb-12">
                <div className="mb-5">
                  <p className="m-0 mb-2 text-sm font-semibold uppercase text-muted-light dark:text-muted-dark">
                    Screenshots
                  </p>
                  <h2 className="m-0 text-2xl">Pieces Worth Remembering</h2>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {galleryImages.map((image) => (
                    <ImageWithZoom
                      key={image.id}
                      src={image.url}
                      alt={image.alt || image.filename}
                      width={image.width || 700}
                      height={image.height || 480}
                      aspectRatio="4/3"
                      objectFit="cover"
                    />
                  ))}
                </div>
              </section>
            )}
          </main>

          <aside className="space-y-5 lg:sticky lg:top-24">
            <section className="rounded-xl border border-border-light bg-[#f8faff] p-5 dark:border-border-dark dark:bg-surface-dark">
              <h2 className="m-0 mb-3 text-xl">Tech Notes</h2>
              <p className="m-0 text-base leading-relaxed text-gray-700 dark:text-gray-200">
                {project.stack}
              </p>
            </section>

            {hasLinks && (
              <section className="rounded-xl border border-border-light bg-white p-5 dark:border-border-dark dark:bg-surface-dark">
                <h2 className="m-0 mb-4 text-xl">Links</h2>
                <div className="grid gap-3">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-primary bg-primary px-4 py-3 text-center font-ui text-sm font-semibold text-white hover:bg-primary-hover hover:text-white"
                    >
                      View Code
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border border-primary bg-white px-4 py-3 text-center font-ui text-sm font-semibold text-primary hover:bg-primary/10"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </section>
            )}
          </aside>
        </div>

        <footer className="mt-16 border-t border-border-light pt-8 shadow-[0_-2px_8px_rgba(0,0,0,0.03)] dark:border-border-dark">
          <Link
            href="/projects"
            className="border-none font-ui text-[0.95rem] text-muted-light no-underline hover:bg-transparent hover:text-primary dark:text-muted-dark"
          >
            Back to Projects
          </Link>
        </footer>
      </div>
    </article>
  );
}
