import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Posts',
  description: 'All my writing and reflections.',
};

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: true,
    },
  });

  return (
    <div>
      <h1 style={{ marginBottom: '3rem' }}>Posts</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {posts.length > 0 ? (
          posts.map((post) => {
            const coverImage = post.images?.find(img => img.id === post.coverImageId) || post.images?.[0];

            // Check if post was updated after creation
            const wasEdited = new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();
            const dateToShow = wasEdited ? new Date(post.updatedAt) : new Date(post.createdAt);

            // Format date with time and timezone
            const formattedDate = new Intl.DateTimeFormat('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short'
            }).format(dateToShow);

            return (
              <div key={post.id} style={{
                display: 'grid',
                gridTemplateColumns: coverImage ? '250px 1fr' : '1fr',
                gap: '1.5rem',
                padding: '1.5rem',
                border: '1px solid var(--color-border)',
                borderRadius: '12px',
                background: '#fff',
              }}>
                {/* Cover Image */}
                {coverImage && (
                  <Link href={`/posts/${post.slug}`} style={{ border: 'none', display: 'block' }}>
                    <Image
                      src={coverImage.url}
                      alt={coverImage.alt || post.title}
                      width={coverImage.width || 800}
                      height={coverImage.height || 600}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        border: '1px solid var(--color-border)',
                      }}
                      sizes="250px"
                    />
                  </Link>
                )}

                {/* Post Info */}
                <div>
                  <Link href={`/posts/${post.slug}`} style={{ borderBottom: 'none', display: 'block', textDecoration: 'none' }} className="post-link">
                    <h2 style={{ marginBottom: '0.5rem', marginTop: 0, fontSize: '1.6rem', color: 'var(--color-text)' }}>
                      {post.title}
                    </h2>
                  </Link>
                  <div className="meta">
                    <span className="date">
                      {formattedDate}
                      {wasEdited && <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginLeft: '0.5rem' }}>(Updated)</span>}
                    </span>
                    <span style={{ color: 'var(--color-border)' }}>|</span>
                    <span className="tag" style={{ backgroundColor: 'rgba(93, 156, 236, 0.1)' }}>{post.category}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
}
