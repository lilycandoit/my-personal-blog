import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await prisma.project.findUnique({ where: { slug }});
    if (!project) return {};
    return { title: project.name };
}


export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: true,
    },
  });


  if (!project) {
    notFound();
  }

  return (
    <article>
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
            <div style={{display:'flex', alignItems:'center', gap: '1rem', marginBottom:'1rem', flexWrap: 'wrap'}}>
                <h1 style={{ marginBottom: '0', fontSize: '2.5rem', lineHeight: '1' }}>{project.name}</h1>
                <span className="tag" style={{fontSize: '0.9rem', padding: '4px 10px'}}>{project.status}</span>
            </div>
            <div className="prose" style={{ fontSize: '1.3rem', color: 'var(--color-text)', marginBottom: '2rem', maxWidth: '600px' }} dangerouslySetInnerHTML={{ __html: project.description }} />

            <div style={{ background: '#f8faff', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--color-border)' }}>
                <div style={{ marginBottom: '0.5rem' }}><strong style={{ fontFamily: 'var(--font-ui)' }}>Tech Stack:</strong> {project.stack}</div>
                <div style={{ marginBottom: '1rem' }}><strong style={{ fontFamily: 'var(--font-ui)' }}>Key Takeaway:</strong> {project.learnings}</div>

                {(project.githubUrl || project.demoUrl) && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.9rem', fontFamily: 'var(--font-ui)' }}>
                        {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">View Code</a>}
                        {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>}
                    </div>
                )}
            </div>
        </header>

        {/* Demo Video */}
        {project.demoVideoUrl && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Demo Video</h2>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe
                src={project.demoVideoUrl.replace('watch?v=', 'embed/')}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Project Images */}
        {project.images && project.images.length > 0 && (
          <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Project Gallery</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}>
              {project.images.map((image) => (
                <div
                  key={image.id}
                  style={{
                    position: 'relative',
                    aspectRatio: '16/9',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || image.filename}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
             <a href="/projects" style={{ fontSize: '0.9rem', color: 'var(--color-muted)', border: 'none' }}>&larr; Back to all projects</a>
        </div>
    </article>
  );
}
