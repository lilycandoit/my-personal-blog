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
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="m-0">All Projects</h1>
        <Link href="/admin/projects/new" className="primary flex items-center gap-2">
          <Plus size={18} /> New Project
        </Link>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
