import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Projects',
  description: 'A log of my coding projects and what I learned.',
};

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
      },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem' }}>Projects</h1>
      <p style={{ marginBottom: '3rem', fontSize: '1.3rem', color: 'var(--color-muted)', maxWidth: '100%' }}>
          This is a learning log, not a showcase. Here are the things I've built to understand how things work.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {projects.length > 0 ? (
          projects.map((project) => {
            const coverImage = project.images?.find(img => img.id === project.coverImageId) || project.images?.[0];

            return (
              <div key={project.slug} style={{
                display: 'grid',
                gridTemplateColumns: coverImage ? '300px 1fr' : '1fr',
                gap: '1.5rem',
                padding: '2rem',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                background: '#fff'
              }}>
                {/* Cover Image */}
                {coverImage && (
                  <Link href={`/projects/${project.slug}`} style={{ border: 'none', display: 'block' }}>
                    <Image
                      src={coverImage.url}
                      alt={coverImage.alt || project.name}
                      width={coverImage.width || 800}
                      height={coverImage.height || 600}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                      }}
                      sizes="300px"
                    />
                  </Link>
                )}

                {/* Project Info */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <Link href={`/projects/${project.slug}`} style={{ border: 'none' }}>
                      <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)' }}>{project.name}</h2>
                    </Link>
                    <span style={{
                      fontSize: '0.85rem',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: project.status === 'completed' ? '#dcfce7' : '#f1f5f9',
                      color: project.status === 'completed' ? '#166534' : '#475569',
                      fontWeight: 700,
                      fontFamily: 'var(--font-ui)'
                    }}>
                      {project.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: '1.5' }} dangerouslySetInnerHTML={{ __html: project.description }} />
                  <div style={{ fontSize: '0.95rem', fontFamily: 'var(--font-ui)' }}>
                    <span style={{ color: 'var(--color-muted)', marginRight: '0.5rem' }}>Built with:</span>
                    <span style={{ color: 'var(--color-text)' }}>{project.stack}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No projects yet.</p>
        )}
      </div>
    </div>
  );
}
