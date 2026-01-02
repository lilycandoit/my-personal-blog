'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div style={{ padding: '2rem' }}>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="admin-container">
        <aside className="admin-sidebar">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--color-primary)' }}>Admin Space</h2>
            <nav style={{ flex: 1 }}>
                <Link href="/admin" className="admin-nav-link">Dashboard</Link>
                <Link href="/admin/posts/new" className="admin-nav-link">+ New Post</Link>
                <Link href="/admin/projects/new" className="admin-nav-link">+ New Project</Link>
                 <Link href="/" className="admin-nav-link" style={{ marginTop: '2rem', color: '#8da1b9' }} target="_blank">View Site &rarr;</Link>
            </nav>
            <button
                onClick={() => signOut()}
                className="admin-nav-link"
                style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}
            >
                <LogOut size={16} /> Sign out
            </button>
        </aside>
        <main className="admin-main">
            {children}
        </main>
    </div>
  );
}
