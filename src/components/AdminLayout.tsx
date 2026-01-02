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
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!session && !isLoginPage) {
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }


  return (
    <div className="admin-container" style={{ width: '100%', minHeight: '100vh' }}>

        <aside className="admin-sidebar">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--color-primary)' }}>Admin Space</h2>
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <Link href="/admin" className={`admin-nav-link ${pathname === '/admin' ? 'active' : ''}`}>
                    <LayoutGrid size={18} /> Dashboard
                </Link>
                <Link href="/admin/posts/new" className={`admin-nav-link ${pathname === '/admin/posts/new' ? 'active' : ''}`}>
                    <Plus size={18} /> New Post
                </Link>
                <Link href="/admin/projects/new" className={`admin-nav-link ${pathname === '/admin/projects/new' ? 'active' : ''}`}>
                    <Plus size={18} /> New Project
                </Link>

                <div style={{ height: '1px', background: 'var(--color-border)', margin: '1.5rem 0' }} />

                <Link href="/" className="admin-nav-link" style={{ color: 'var(--color-muted)' }} target="_blank">
                    <ExternalLink size={18} /> View Site
                </Link>
            </nav>
            <button
                onClick={() => signOut()}
                className="admin-nav-link"
                style={{ marginTop: 'auto', color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}
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
