'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { PostWithImages } from '@/lib/posts';

interface PostsTableProps {
  initialPosts: PostWithImages[];
}

export default function PostsTable({ initialPosts }: PostsTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const router = useRouter();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setPosts(posts.filter(p => p.id !== id));
        router.refresh(); // Refresh server component data
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  if (posts.length === 0) {
    return (
      <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--color-muted)', marginBottom: '1rem' }}>No posts yet.</p>
        <Link href="/admin/posts/new" className="primary">Create your first post</Link>
      </div>
    );
  }

  return (
    <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
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
          {posts.map(post => {
            const wasEdited = new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();
            const dateToShow = wasEdited ? new Date(post.updatedAt) : new Date(post.createdAt);
            const formattedDate = formatDate(dateToShow, post.timezone, post.location, 'full');

            return (
              <tr key={post.id} className="admin-table-row" style={{ borderBottom: '1px solid #f8faff', transition: 'background 0.2s' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 500 }}>
                  <Link href={`/posts/${post.slug}`} style={{ border: 'none' }} target="_blank">{post.title}</Link>
                </td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span className="tag">{post.category}</span>
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
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
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
