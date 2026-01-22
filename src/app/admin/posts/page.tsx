import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getAllPosts } from '@/lib/posts';
import PostsTable from '@/components/admin/PostsTable';

// Force dynamic to always get fresh data in admin
export const dynamic = 'force-dynamic';

export default async function AdminPostsPage() {
  // Fetch data directly on the server - no loading state needed!
  const posts = await getAllPosts();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>All Posts</h1>
        <Link href="/admin/posts/new" className="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> New Post
        </Link>
      </div>

      <PostsTable initialPosts={posts} />
    </div>
  );
}
