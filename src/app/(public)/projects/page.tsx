'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { LayoutGrid, List } from 'lucide-react';

interface Project {
  id: string;
  slug: string;
  name: string;
  description: string;
  stack: string;
  status: string;
  githubUrl: string | null;
  demoUrl: string | null;
  coverImageId: string | null;
  createdAt: string;
  images: {
    id: string;
    url: string;
    alt: string | null;
    filename: string;
    width: number | null;
    height: number | null;
  }[];
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedView = localStorage.getItem('projectsViewMode') as 'grid' | 'list';
    if (savedView) setViewMode(savedView);

    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const toggleView = (mode: 'grid' | 'list') => {
    setViewMode(mode);
    localStorage.setItem('projectsViewMode', mode);
  };

  const getShortDescription = (html: string) => {
    const text = html.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Projects</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => toggleView('grid')}
            style={{
              padding: '0.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: viewMode === 'grid' ? 'var(--color-primary)' : 'white',
              color: viewMode === 'grid' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => toggleView('list')}
            style={{
              padding: '0.5rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: viewMode === 'list' ? 'var(--color-primary)' : 'white',
              color: viewMode === 'list' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <p style={{ marginBottom: '3rem', fontSize: '1.3rem', color: 'var(--color-muted)', maxWidth: '100%' }}>
        This is a learning log, not a showcase. Here are the things I've built to understand how things work.
      </p>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : '1fr',
          gap: '2rem',
        }}>
          {projects.map((project) => {
            const coverImage = project.images?.find(img => img.id === project.coverImageId) || project.images?.[0];
            const createdDate = new Date(project.createdAt);
            const monthYear = new Intl.DateTimeFormat('en-US', {
              month: 'short',
              year: 'numeric'
            }).format(createdDate);

            return (
              <div key={project.slug} style={{
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                background: '#fff',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: viewMode === 'grid' ? 'column' : 'row',
                gap: viewMode === 'list' ? '1.5rem' : '0',
              }}>
                {/* Thumbnail */}
                {coverImage && (
                  <Link href={`/projects/${project.slug}`} style={{ border: 'none', display: 'block', flexShrink: 0 }}>
                    <Image
                      src={coverImage.url}
                      alt={coverImage.alt || project.name}
                      width={coverImage.width || 400}
                      height={coverImage.height || 300}
                      style={{
                        width: viewMode === 'grid' ? '100%' : '200px',
                        height: viewMode === 'grid' ? 'auto' : '200px',
                        objectFit: 'cover',
                      }}
                      sizes={viewMode === 'grid' ? '300px' : '200px'}
                    />
                  </Link>
                )}

                {/* Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  <Link href={`/projects/${project.slug}`} style={{ border: 'none' }}>
                    <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)' }}>{project.name}</h2>
                  </Link>

                  {/* Tech Stack */}
                  <div style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)' }}>
                    {project.stack.split(',').map((tech, i) => (
                      <span key={i}>
                        {tech.trim()}
                        {i < project.stack.split(',').length - 1 && ' · '}
                      </span>
                    ))}
                  </div>

                  {/* Short Description */}
                  <p style={{ fontSize: '1rem', lineHeight: '1.6', margin: 0, color: 'var(--color-text)' }}>
                    {getShortDescription(project.description)}
                  </p>

                  {/* Links */}
                  <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', fontFamily: 'var(--font-ui)' }}>
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{
                        padding: '0.4rem 0.8rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        color: 'var(--color-text)',
                        textDecoration: 'none',
                      }}>
                        GitHub
                      </a>
                    )}
                    {project.demoUrl && (
                      <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{
                        padding: '0.4rem 0.8rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: '6px',
                        color: 'var(--color-text)',
                        textDecoration: 'none',
                      }}>
                        Live
                      </a>
                    )}
                  </div>

                  {/* Status & Date */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <span style={{
                      fontSize: '0.85rem',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: project.status === 'completed' ? '#dcfce7' : '#f1f5f9',
                      color: project.status === 'completed' ? '#166534' : '#475569',
                      fontWeight: 700,
                      fontFamily: 'var(--font-ui)',
                      textTransform: 'capitalize',
                    }}>
                      {project.status}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)' }}>
                      {monthYear}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
