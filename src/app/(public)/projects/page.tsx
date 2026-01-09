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
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: true,
    },
  });

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem',
    }}>
      {/* Quote Section */}
      <div style={{ margin: '3rem 0' }}>
        <DailyQuote variant="projects" />
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          marginTop: '2rem',
        }}
        className="projects-grid">
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
                style={{
                  border: 'none',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                <article style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#fff',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
                className="project-card">
                  {/* Cover Image */}
                  <div style={{
                    width: '100%',
                    height: '220px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                  }}>
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={coverImage?.width || 800}
                      height={coverImage?.height || 600}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Project Content */}
                  <div style={{
                    padding: '1.5rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}>
                    <h2 style={{
                      marginBottom: '0',
                      marginTop: 0,
                      fontSize: '1.4rem',
                      color: 'var(--color-text)',
                      lineHeight: '1.4',
                    }}>
                      {project.name}
                    </h2>

                    <div className="meta">
                      <span className="date" style={{ fontSize: '0.9rem' }}>
                        {formattedDate}
                      </span>
                      <span style={{ color: 'var(--color-border)', margin: '0 0.5rem' }}>|</span>
                      <span style={{
                        fontSize: '0.85rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        background: project.status === 'completed' ? '#dcfce7' : '#f1f5f9',
                        color: project.status === 'completed' ? '#166534' : '#475569',
                        fontWeight: 600,
                        fontFamily: 'var(--font-ui)',
                        textTransform: 'capitalize',
                      }}>
                        {project.status}
                      </span>
                    </div>

                    {/* Tech Stack */}
                    <div style={{
                      fontSize: '0.85rem',
                      color: 'var(--color-muted)',
                      fontFamily: 'var(--font-ui)',
                    }}>
                      {project.stack}
                    </div>

                    {/* Excerpt */}
                    <p style={{
                      margin: 0,
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      color: 'var(--color-text-secondary)',
                      flex: 1,
                    }}>
                      {excerpt}
                    </p>

                    {/* View Project */}
                    <div style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      letterSpacing: '0.05em',
                    }}>
                      View Project →
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <p>No projects yet.</p>
      )}
    </div>
  );
}
