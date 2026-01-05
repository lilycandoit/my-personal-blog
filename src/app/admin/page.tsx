import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { PenLine, FileText, LayoutGrid, Plus, Edit } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const [postCount, projectCount, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.project.count(),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const prompts = [
    "What's one small thing you learned today?",
    "If you could explain a complex topic to a child, what would it be?",
    "Describe a moment where code felt like art.",
    "What's a project you're dreaming of building?",
    "Write about a coding challenge that made you think differently."
  ];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800 }}>Welcome back, Lily.</h1>
        <p style={{ color: 'var(--color-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>It's a good day to think and build.</p>
      </header>

      {/* Writing Prompt Card */}
      <div className="admin-card" style={{
        marginBottom: '3rem',
        background: 'linear-gradient(135deg, #f8faff 0%, #eef4fc 100%)',
        border: '1px solid var(--color-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          boxShadow: '0 4px 12px rgba(93, 156, 236, 0.15)'
        }}>
          <PenLine size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Writing Prompt</h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '1.2rem', fontWeight: 500, color: 'var(--color-text)' }}>"{randomPrompt}"</p>
        </div>
        <Link href="/admin/posts/new" className="primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem 1.5rem' }}>
          <Plus size={18} /> Start Writing
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(93, 156, 236, 0.1)', borderRadius: '10px', color: 'var(--color-primary)' }}>
            <FileText size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Total Posts</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{postCount}</p>
          </div>
        </div>
        <div className="admin-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(160, 210, 235, 0.1)', borderRadius: '10px', color: 'var(--color-secondary)' }}>
            <LayoutGrid size={20} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-muted)' }}>Active Projects</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>{projectCount}</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>Recent Posts</h2>
        <Link href="/posts" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', border: 'none' }}>View all &rarr;</Link>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {recentPosts.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-muted)' }}>
              No thoughts shared yet.
              <br/>
              <Link href="/admin/posts/new" style={{ color: 'var(--color-primary)', display: 'inline-block', marginTop: '1rem' }}>Write your first post</Link>
            </div>
        ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#fcfdfe', borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>TITLE</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>CATEGORY</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>DATE</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--color-muted)', fontWeight: 600 }}>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {recentPosts.map(post => {
                  const formattedDate = new Intl.DateTimeFormat('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                  }).format(new Date(post.createdAt));

                  return (
                    <tr key={post.id} className="admin-table-row" style={{ borderBottom: '1px solid #f8faff', transition: 'background 0.2s' }}>
                      <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>
                        <Link href={`/posts/${post.slug}`} style={{ border: 'none' }}>{post.title}</Link>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                          <span className="tag">{post.category}</span>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.9rem', color: 'var(--color-muted)' }}>{formattedDate}</td>
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                        <Link
                          href={`/admin/posts/${post.id}/edit`}
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
                      </td>
                    </tr>
                  );
                })}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
}


