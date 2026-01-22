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
      <div className="admin-card text-center p-12">
        <p className="text-muted-light dark:text-muted-dark mb-4">No projects yet.</p>
        <Link href="/admin/projects/new" className="primary">Log your first project</Link>
      </div>
    );
  }

  return (
    <div className="admin-card p-0 overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-[#fcfdfe] border-b border-border-light dark:border-border-dark">
          <tr>
            <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">NAME</th>
            <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">STATUS</th>
            <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">STACK</th>
            <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">DATE</th>
            <th className="py-4 px-6 text-center text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            const wasEdited = new Date(project.updatedAt).getTime() !== new Date(project.createdAt).getTime();
            const dateToShow = wasEdited ? new Date(project.updatedAt) : new Date(project.createdAt);
            const formattedDate = formatDate(dateToShow, project.timezone, project.location, 'full');

            return (
              <tr key={project.id} className="admin-table-row border-b border-[#f8faff] transition-colors duration-200">
                <td className="py-5 px-6 font-medium">
                  <Link href={`/projects/${project.slug}`} className="border-none" target="_blank">{project.name}</Link>
                </td>
                <td className="py-5 px-6">
                  <span className={`tag capitalize ${
                    project.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {project.status}
                  </span>
                </td>
                <td className="py-5 px-6 text-[0.9rem] text-text-light dark:text-text-dark">
                  {project.stack}
                </td>
                <td className="py-5 px-6 text-[0.9rem] text-muted-light dark:text-muted-dark">
                  <div className="flex flex-col gap-1">
                    <span>{formattedDate}</span>
                    {wasEdited && (
                      <span className="text-xs text-primary">
                        (Updated)
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-5 px-6 text-center">
                  <div className="flex gap-2 justify-center">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="border-none inline-flex items-center gap-2 py-2 px-3 rounded-md bg-primary/10 text-primary text-[0.85rem] transition-all duration-200"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(project.id, project.name)}
                      className="border-none inline-flex items-center gap-2 py-2 px-3 rounded-md bg-red-500/10 text-red-600 text-[0.85rem] cursor-pointer transition-all duration-200"
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
