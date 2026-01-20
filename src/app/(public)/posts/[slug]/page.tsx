import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Revalidate every 1 hour - pages are cached and served from CDN
export const revalidate = 3600;

// Pre-generate pages for all existing posts at build time
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { visibility: 'public' },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await prisma.post.findUnique({ where: { slug }});
    if (!post) return {};
    return { title: post.title };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        images: true,
      },
  });


  if (!post) {
    notFound();
  }

  // Block draft posts from public access
  if (post.visibility === 'draft') {
    notFound();
  }

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

  const coverImage = post.images?.find(img => img.id === post.coverImageId) || post.images?.[0];
  const imageUrl = coverImage?.url || '/sunshine_leaves.avif';
  const imageAlt = coverImage?.alt || post.title;

  return (
    <article style={{ margin: '2rem', padding: 0}}>
      {/* Main Content Container */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem 4rem',
      }}>
        {/* Header with Title First, Then Meta */}
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{
            margin: '0',
            fontSize: '2.5rem',
            lineHeight: 1.2,
            fontWeight: 700,
          }}>
            {post.title}
          </h1>
          <div className="meta" style={{ fontSize: '1rem' }}>
            <span className="date">
              {formattedDate}
              {wasEdited && <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginLeft: '0.5rem' }}>(Updated)</span>}
            </span>
            <span style={{ margin: '0 0.5rem', color: 'var(--color-border)' }}>|</span>
            <span className="tag">{post.category}</span>
          </div>
        </header>

        {/* Cover Image - Full Width (always show) */}
        <div style={{ marginBottom: '2rem' }}>
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={coverImage?.width || 1200}
            height={coverImage?.height || 600}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '500px',
              objectFit: 'cover',
              objectPosition: 'bottom center',
              borderRadius: '16px',
            }}
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>


        {/* Render HTML content from Editor */}
        <div
          className="content prose prose-lg max-w-none"
          style={{
            fontSize: '1.2rem',
            fontFamily: 'var(--font-body)',
            lineHeight: '1.8',
          }}
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Additional Images Gallery */}
        {post.images && post.images.filter(img => img.id !== post.coverImageId).length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}>
              {post.images
                .filter(img => img.id !== post.coverImageId)
                .map((image) => (
                  <Image
                    key={image.id}
                    src={image.url}
                    alt={image.alt || image.filename}
                    width={image.width || 400}
                    height={image.height || 300}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{
          borderTop: '1px solid var(--color-border)',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.03)',
          paddingTop: '2rem',
          marginTop: '4rem',
        }}>
          <Link
            href="/posts"
            style={{
              color: 'var(--color-muted)',
              border: 'none',
              textDecoration: 'none',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.95rem',
            }}
          >
            ← Back to Posts
          </Link>
        </div>
      </div>
    </article>
  );
}
