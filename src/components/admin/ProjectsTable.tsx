'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { ProjectWithImages } from '@/lib/projects';

interface ProjectsTableProps {
  initialProjects: ProjectWithImages[];
}

export default function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState(initialProjects);
  const router = useRouter();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setProjects(projects.filter(p => p.id !== id));
        router.refresh(); // Refresh server component data
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project');
    }
  };

  if (projects.length === 0) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--color-muted)', marginBottom: '1rem' }}>No projects yet.</p>
        <Link href="/admin/projects/new" className="primary">Log your first project</Link>
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ background: '#fcfdfe', borderBottom: '1px solid var(--color-border)' }}>
          <tr>
            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>NAME</th>
            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>STATUS</th>
            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>STACK</th>
            <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>DATE</th>
            <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            const wasEdited = new Date(project.updatedAt).getTime() !== new Date(project.createdAt).getTime();
            const dateToShow = wasEdited ? new Date(project.updatedAt) : new Date(project.createdAt);
            const formattedDate = formatDate(dateToShow, project.timezone, project.location, 'full');

            return (
              <tr key={project.id} className="admin-table-row" style={{ borderBottom: '1px solid #f8faff', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>
                  <Link href={`/projects/${project.slug}`} style={{ border: 'none' }} target="_blank">{project.name}</Link>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span className="tag" style={{
                    backgroundColor: project.status === 'completed' ? '#dcfce7' : 'rgba(93, 156, 236, 0.1)',
                    color: project.status === 'completed' ? '#166534' : 'var(--color-primary)',
                    textTransform: 'capitalize'
                  }}>
                    {project.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-text)' }}>
                  {project.stack}
                </td>
                <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-muted)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <span>{formattedDate}</span>
                    {wasEdited && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)' }}>
                        (Updated)
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      style={{
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        background: 'rgba(93, 156, 236, 0.1)',
                        color: 'var(--color-primary)',
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      style={{
                        border: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '6px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#dc2626',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
