import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import DailyQuote from '@/components/DailyQuote';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Posts',
  description: 'All my writing and reflections.',
};

// Helper function to strip HTML tags and get plain text excerpt
function getExcerpt(htmlContent: string, maxLength: number = 150): string {
  // Remove HTML tags
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  if (text.length <= maxLength) return text;

  // Truncate and add ellipsis
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
}

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      images: true,
    },
  });

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem',
    }}>
      {/* Quote Section */}
      <div style={{ margin: '3rem 0' }}>
        <DailyQuote variant="posts" />
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          marginTop: '2rem',
        }}
        className="posts-grid">
          {posts.map((post) => {
            const coverImage = post.images?.find(img => img.id === post.coverImageId) || post.images?.[0];
            const imageUrl = coverImage?.url || '/sunshine_leaves.avif';
            const imageAlt = coverImage?.alt || post.title;
            const excerpt = getExcerpt(post.content);

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
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                style={{
                  border: 'none',
                  textDecoration: 'none',
                  display: 'block',
                }}
              >
                <article style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#fff',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                }}
                className="post-card">
                  {/* Cover Image */}
                  <div style={{
                    width: '100%',
                    height: '220px',
                    overflow: 'hidden',
                    backgroundColor: '#f5f5f5',
                  }}>
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={coverImage?.width || 800}
                      height={coverImage?.height || 600}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Post Content */}
                  <div style={{
                    padding: '1.5rem',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}>
                    <h2 style={{
                      marginBottom: '0',
                      marginTop: 0,
                      fontSize: '1.4rem',
                      color: 'var(--color-text)',
                      lineHeight: '1.4',
                    }}>
                      {post.title}
                    </h2>

                    <div className="meta">
                      <span className="date" style={{ fontSize: '0.9rem' }}>
                        {formattedDate}
                        {wasEdited && (
                          <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--color-primary)',
                            marginLeft: '0.5rem'
                          }}>
                            (Updated)
                          </span>
                        )}
                      </span>
                      <span style={{ color: 'var(--color-border)', margin: '0 0.5rem' }}>|</span>
                      <span className="tag" style={{
                        backgroundColor: 'rgba(93, 156, 236, 0.1)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.85rem',
                      }}>
                        {post.category}
                      </span>
                    </div>

                    {/* Excerpt */}
                    <p style={{
                      margin: 0,
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      color: 'var(--color-text-secondary)',
                      flex: 1,
                    }}>
                      {excerpt}
                    </p>

                    {/* Read More */}
                    <div style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      letterSpacing: '0.05em',
                    }}>
                      Read More →
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
