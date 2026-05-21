'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, LayoutGrid, Plus, ExternalLink, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { signOut } from 'next-auth/react';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, router, isLoginPage]);

  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed');
    const frame = window.requestAnimationFrame(() => {
      setIsSidebarCollapsed(saved === 'true');
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggleSidebar = () => {
    const next = !isSidebarCollapsed;
    setIsSidebarCollapsed(next);
    localStorage.setItem('admin-sidebar-collapsed', String(next));
  };

  if (status === 'loading') {
    return <div className="p-8">Loading...</div>;
  }

  if (!session && !isLoginPage) {
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }


  return (
    <div className={`admin-container w-full min-h-screen ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

        <aside className="admin-sidebar">
            <div className="mb-8 flex items-center justify-between gap-3">
                <h2 className="admin-sidebar-title text-xl font-bold text-primary">Admin Space</h2>
                <button
                    type="button"
                    onClick={toggleSidebar}
                    className="admin-sidebar-toggle"
                    aria-label={isSidebarCollapsed ? 'Expand admin sidebar' : 'Collapse admin sidebar'}
                    title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isSidebarCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                </button>
            </div>
            <nav className="flex-1 flex flex-col gap-1">
                <Link href="/admin" className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}>
                    <LayoutGrid size={18} /> <span className="admin-nav-text">Dashboard</span>
                </Link>
                <Link href="/admin/posts/new" className={`admin-nav-link ${pathname === '/admin/posts/new' ? 'active' : ''}`}>
                    <Plus size={18} /> <span className="admin-nav-text">New Post</span>
                </Link>
                <Link href="/admin/projects/new" className={`admin-nav-link ${pathname === '/admin/projects/new' ? 'active' : ''}`}>
                    <Plus size={18} /> <span className="admin-nav-text">New Project</span>
                </Link>

                <div className="h-px bg-border-light dark:bg-border-dark my-6" />

                <Link href="/" className="admin-nav-link text-muted-light dark:text-muted-dark" target="_blank">
                    <ExternalLink size={18} /> <span className="admin-nav-text">View Site</span>
                </Link>
            </nav>
            <button
                onClick={() => signOut()}
                className="admin-nav-link mt-auto text-red-500 border-none bg-transparent cursor-pointer"
            >
                <LogOut size={18} /> <span className="admin-nav-text">Sign out</span>
            </button>

        </aside>
        <main className="admin-main">
            {children}
        </main>
    </div>
  );
}
