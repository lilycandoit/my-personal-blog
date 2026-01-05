import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

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

  return (
    <article style={{ maxWidth: '100%' }}>
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '2rem' }}>
            <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem', lineHeight: 1.2 }}>{post.title}</h1>
            <div className="meta" style={{ fontSize: '1rem' }}>
                <span className="date">{post.createdAt.toLocaleDateString()}</span>
                <span>—</span>
                <span className="tag">{post.category}</span>
            </div>
        </header>

        {/* Cover Image */}
        {post.images && post.images.length > 0 && post.coverImageId && (
          <div style={{ marginBottom: '2rem' }}>
            {(() => {
              const coverImage = post.images.find(img => img.id === post.coverImageId);
              if (coverImage) {
                return (
                  <Image
                    src={coverImage.url}
                    alt={coverImage.alt || post.title}
                    width={coverImage.width || 800}
                    height={coverImage.height || 600}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                    }}
                    sizes="(max-width: 768px) 100vw, 800px"
                    priority
                  />
                );
              }
              return null;
            })()}
          </div>
        )}

        {/* Render HTML content from Editor */}
        <div
            className="content prose prose-lg max-w-none"
            style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Additional Images */}
        {post.images && post.images.filter(img => img.id !== post.coverImageId).length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Gallery</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
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
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                    }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
             <a href="/posts" style={{ fontSize: '1.1rem', color: 'var(--color-muted)', border: 'none' }}>&larr; Back to all posts</a>
        </div>
    </article>
  );
}
