import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

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
      where: { slug }
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

        {/* Render HTML content from Editor */}
        <div
            className="content prose prose-lg max-w-none"
            style={{ fontSize: '1.2rem', fontFamily: 'var(--font-body)' }}
            dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
             <a href="/posts" style={{ fontSize: '1.1rem', color: 'var(--color-muted)', border: 'none' }}>&larr; Back to all posts</a>
        </div>
    </article>
  );
}
