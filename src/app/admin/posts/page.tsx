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
    <div className="max-w-[1200px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="m-0">All Posts</h1>
        <Link href="/admin/posts/new" className="primary flex items-center gap-2">
          <Plus size={18} /> New Post
        </Link>
      </div>

      <PostsTable initialPosts={posts} />
    </div>
  );
}
