import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await prisma.project.findUnique({ where: { slug }});
    if (!project) return {};
    return { title: project.name };
}


export default async function Project({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug }});


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

        {/* Since content wasn't in original project schema but 'description' was rich text,
            I'll assume description IS the content if no separate content field exists.
            The schema has 'description' as rich text. */}

        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
             <a href="/projects" style={{ fontSize: '0.9rem', color: 'var(--color-muted)', border: 'none' }}>&larr; Back to all projects</a>
        </div>
    </article>
  );
}
