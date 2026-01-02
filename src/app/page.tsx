import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const recentPost = await prisma.post.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <section style={{ marginBottom: '4rem' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '3rem', color: 'var(--color-primary)' }}>Hello.</h1>
        <p style={{ fontSize: '1.5rem', maxWidth: '480px' }}>
          Welcome to my personal thinking space. <br/>
          I write here to learn, reflect, and document my journey in code and life.
        </p>
      </section>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem' }}>
        <Link href="/posts" style={{ fontSize: '1.25rem', fontWeight: 600, borderBottomWidth: '2px' }}>
          Read Posts
        </Link>
        <Link href="/projects" style={{ fontSize: '1.25rem', fontWeight: 600, borderBottomWidth: '2px' }}>
          View Projects
        </Link>
      </div>

      {recentPost && (
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-muted)', fontWeight: 500, fontFamily: 'var(--font-ui)' }}>LATEST POST</h2>
            <Link href="/posts" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', border: 'none' }}>View all &rarr;</Link>
          </div>

          <div className="post-item">
            <Link href={`/posts/${recentPost.slug}`} style={{ border: 'none' }}>
              <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.8rem' }}>{recentPost.title}</h3>
              <div className="meta" style={{ marginBottom: '1rem' }}>
                <span className="date">{recentPost.createdAt.toLocaleDateString()}</span>
                <span>•</span>
                <span className="tag">{recentPost.category}</span>
              </div>
              <div style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--color-text)' }}>
                 {/* Creating a plain text excerpt from HTML is tricky without a library, using a simple slice here.
                     Ideally we strip HTML tags. */}
                 <div dangerouslySetInnerHTML={{ __html: recentPost.content.slice(0, 200) + '...' }} />
              </div>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
