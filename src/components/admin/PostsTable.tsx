'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { PostWithImages } from '@/lib/posts';

interface PostsTableProps {
  initialPosts: PostWithImages[];
}

const visibilityStyles: Record<string, string> = {
  public: 'bg-green-500/10 text-green-700',
  unlisted: 'bg-amber-500/10 text-amber-700',
  draft: 'bg-slate-500/10 text-slate-600',
};

function getVisibilityLabel(visibility: string) {
  if (visibility === 'unlisted') return 'Unlisted';
  if (visibility === 'draft') return 'Draft';
  return 'Public';
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
      <div className="admin-card text-center p-12">
        <p className="text-muted-light dark:text-muted-dark mb-4">No posts yet.</p>
        <Link href="/admin/posts/new" className="primary">Create your first post</Link>
      </div>
    );
  }

  return (
    <div className="admin-card p-0 overflow-hidden">
      <table className="w-full border-collapse">
        <thead className="bg-[#fcfdfe] border-b border-border-light dark:border-border-dark">
          <tr>
            <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">TITLE</th>
            <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">CATEGORY</th>
            <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">VISIBILITY</th>
            <th className="py-4 px-6 text-left text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">DATE</th>
            <th className="py-4 px-6 text-center text-[0.85rem] text-muted-light dark:text-muted-dark font-semibold">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(post => {
            const wasEdited = new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();
            const dateToShow = wasEdited ? new Date(post.updatedAt) : new Date(post.createdAt);
            const formattedDate = formatDate(dateToShow, post.timezone, post.location, 'full');
            const canViewPublicly = post.visibility !== 'draft';

            return (
              <tr key={post.id} className="admin-table-row border-b border-[#f8faff] transition-colors duration-200">
                <td className="py-5 px-6 font-medium">
                  {canViewPublicly ? (
                    <Link href={`/posts/${post.slug}`} className="border-none" target="_blank" rel="noopener noreferrer">{post.title}</Link>
                  ) : (
                    <span>{post.title}</span>
                  )}
                </td>
                <td className="py-5 px-6">
                  <span className="tag">{post.category}</span>
                </td>
                <td className="py-5 px-6">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[0.8rem] font-semibold ${visibilityStyles[post.visibility] || visibilityStyles.public}`}>
                    {getVisibilityLabel(post.visibility)}
                  </span>
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
                    {canViewPublicly && (
                      <Link
                        href={`/posts/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border-none inline-flex items-center gap-2 py-2 px-3 rounded-md bg-slate-500/10 text-slate-600 text-[0.85rem] transition-all duration-200"
                      >
                        <ExternalLink size={14} /> View
                      </Link>
                    )}
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="border-none inline-flex items-center gap-2 py-2 px-3 rounded-md bg-primary/10 text-primary text-[0.85rem] transition-all duration-200"
                    >
                      <Edit size={14} /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
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
