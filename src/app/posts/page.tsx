import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Posts',
  description: 'All my writing and reflections.',
};

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '3rem' }}>Posts</h1>
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} style={{ marginBottom: '2.5rem' }}>
              <Link href={`/posts/${post.slug}`} style={{ borderBottom: 'none', display: 'block', textDecoration: 'none' }} className="post-link">
                <h2 style={{ marginBottom: '0.5rem', marginTop: 0, fontSize: '1.6rem', color: 'var(--color-text)' }}>
                  {post.title}
                </h2>
              </Link>
              <div className="meta">
                <span className="date">{post.createdAt.toLocaleDateString()}</span>
                <span style={{ color: 'var(--color-border)' }}>|</span>
                <span className="tag" style={{ backgroundColor: 'rgba(93, 156, 236, 0.1)' }}>{post.category}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}
