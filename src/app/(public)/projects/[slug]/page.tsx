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
    <article style={{ margin: '2rem', padding: 0 }}>
      {/* Main Content Container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem 4rem',
      }}>
        {/* Header: Title and Date/Location inline */}
        <header
          className="project-title-row"
          style={{
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <h1 style={{
            margin: 0,
            fontSize: '2.5rem',
            lineHeight: 1.2,
            fontWeight: 700,
          }}>
            {project.name}
          </h1>
          <span
            className="project-date"
            style={{
              fontSize: '1rem',
              color: 'var(--color-muted)',
              fontFamily: 'var(--font-hand)',
              whiteSpace: 'nowrap',
            }}
          >
            {formattedDate}
          </span>
        </header>

        {/* Grid Layout: 1/3 Sidebar + 2/3 Description */}
        <div className="project-single-grid" style={{ marginBottom: '3rem' }}>
          {/* Left Sidebar (1/3) */}
          <div>
            {/* Status Tag */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                background: project.status === 'completed' ? '#dcfce7' : '#e0f2fe',
                color: project.status === 'completed' ? '#166534' : '#0369a1',
                border: project.status === 'completed' ? '1px solid #bbf7d0' : '1px solid #bae6fd',
              }}>
                {project.status}
              </span>
            </div>

            {/* Thumbnail Image */}
            {thumbnailImage && (
              <div style={{ marginBottom: '1.5rem' }}>
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
            <div style={{
              background: '#f8faff',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              marginBottom: '1.5rem',
            }}>
              <h3 style={{
                margin: '0 0 1rem 0',
                fontSize: '1.1rem',
                fontFamily: 'var(--font-ui)',
                fontWeight: 600,
              }}>
                Tech Stack
              </h3>
              <p style={{
                margin: 0,
                fontSize: '0.95rem',
                lineHeight: 1.6,
              }}>
                {project.stack}
              </p>
            </div>

            {/* View Code and Demo Buttons */}
            {(project.githubUrl || project.demoUrl) && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                marginBottom: '1.5rem',
              }}>
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '0.75rem 1.5rem',
                      background: 'var(--color-primary)',
                      color: 'white',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                    }}
                  >
                    View Code
                  </a>
                )}
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      padding: '0.75rem 1.5rem',
                      background: 'white',
                      color: 'var(--color-primary)',
                      border: '2px solid var(--color-primary)',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.95rem',
                      fontWeight: 500,
                    }}
                  >
                    Live Demo
                  </a>
                )}
              </div>
            )}

            {/* Key Takeaways (Optional) */}
            {project.learnings && (
              <div style={{
                background: '#fffbf0',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #ffe8a3',
              }}>
                <h3 style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: '1.1rem',
                  fontFamily: 'var(--font-ui)',
                  fontWeight: 600,
                }}>
                  Key Takeaways
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}>
                  {project.learnings}
                </p>
              </div>
            )}
          </div>

          {/* Right Content (2/3) - Description */}
          <div>
            <div
              className="prose prose-lg"
              style={{
                fontSize: '1.2rem',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.8',
              }}
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
        </div>

        {/* Demo Video */}
        {project.demoVideoUrl && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Demo Video</h2>
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            }}>
              <iframe
                src={project.demoVideoUrl.replace('watch?v=', 'embed/')}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Project Gallery */}
        {project.images && project.images.filter(img => img.id !== thumbnailImage?.id).length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Project Gallery</h2>
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
        <div style={{
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.03)',
          paddingTop: '2rem',
          marginTop: '4rem',
        }}>
          <Link
            href="/projects"
            style={{
              color: 'var(--color-muted)',
              border: 'none',
              textDecoration: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Projects
          </Link>
        </div>
      </div>
    </article>
  );
}
