import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getProjects } from '@/lib/projects';
import ProjectsTable from '@/components/admin/ProjectsTable';

// Force dynamic to always get fresh data in admin
export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  // Fetch data directly on the server - no loading state needed!
  const projects = await getProjects();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>All Projects</h1>
        <Link href="/admin/projects/new" className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Project
        </Link>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
