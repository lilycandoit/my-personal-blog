import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
  });

  return (
    <div>
      <section style={{ marginBottom: '4rem' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '2.5rem', color: 'var(--color-primary)' }}>Hello.</h1>
        <p style={{ fontSize: '1.25rem', maxWidth: '100%' }}>
          Welcome to my space! <br/>
          I write here to learn, reflect, and document my journey in code and life.
        </p>
      </section>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem' }}>
        <Link href="/posts" style={{ fontSize: '1.25rem', fontWeight: 600, borderBottomWidth: '2px' }}>
          Start reading
        </Link>
        <Link href="/projects" style={{ fontSize: '1.25rem', fontWeight: 600, borderBottomWidth: '2px' }}>
        My projects
        </Link>
      </div>

      {recentPosts.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'var(--font-ui)' }}>LATEST POSTS</h2>
            <Link href="/posts" style={{ fontSize: '1.25rem', color: 'var(--color-primary)', border: 'none' }}>View all &rarr;</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {recentPosts.map((post) => {
              // Check if post was updated after creation
              const wasEdited = new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();
              const dateToShow = wasEdited ? new Date(post.updatedAt) : new Date(post.createdAt);

              // Format date with time and timezone (same as admin panel)
              const formattedDate = new Intl.DateTimeFormat('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
              }).format(dateToShow);

              return (
                <div key={post.id} className="post-item" style={{
                  paddingBottom: '2.5rem',
                  borderBottom: '1px solid var(--color-border)',
                }}>
                  <Link href={`/posts/${post.slug}`} style={{ border: 'none' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.8rem' }}>{post.title}</h3>
                    <div className="meta" style={{ marginBottom: '1rem' }}>
                      <span className="date">
                        {formattedDate}
                        {wasEdited && <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', marginLeft: '0.5rem' }}>(Updated)</span>}
                      </span>
                      <span>•</span>
                      <span className="tag">{post.category}</span>
                    </div>
                    <div style={{ fontSize: '1.2rem', lineHeight: '1.6', color: 'var(--color-text)' }}>
                       <div dangerouslySetInnerHTML={{ __html: post.content.slice(0, 200) + '...' }} />
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
