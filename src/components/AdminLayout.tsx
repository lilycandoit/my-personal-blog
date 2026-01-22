'use client';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut, LayoutGrid, Plus, ExternalLink } from 'lucide-react';
import { signOut } from 'next-auth/react';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, router, isLoginPage]);

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
    <div className="admin-container w-full min-h-screen">

        <aside className="admin-sidebar">
            <h2 className="text-xl font-bold mb-8 text-primary">Admin Space</h2>
            <nav className="flex-1 flex flex-col gap-1">
                <Link href="/admin" className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}>
                    <LayoutGrid size={18} /> Dashboard
                </Link>
                <Link href="/admin/posts/new" className={`admin-nav-link ${pathname === '/admin/posts/new' ? 'active' : ''}`}>
                    <Plus size={18} /> New Post
                </Link>
                <Link href="/admin/projects/new" className={`admin-nav-link ${pathname === '/admin/projects/new' ? 'active' : ''}`}>
                    <Plus size={18} /> New Project
                </Link>

                <div className="h-px bg-border-light dark:bg-border-dark my-6" />

                <Link href="/" className="admin-nav-link text-muted-light dark:text-muted-dark" target="_blank">
                    <ExternalLink size={18} /> View Site
                </Link>
            </nav>
            <button
                onClick={() => signOut()}
                className="admin-nav-link mt-auto text-red-500 border-none bg-transparent cursor-pointer"
            >
                <LogOut size={18} /> Sign out
            </button>

        </aside>
        <main className="admin-main">
            {children}
        </main>
    </div>
  );
}
