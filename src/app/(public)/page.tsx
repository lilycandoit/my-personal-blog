import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import Hero from '@/components/Hero';
import DailyQuote from '@/components/DailyQuote';
import KindReminder from '@/components/KindReminder';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch latest posts (only public)
  const latestPosts = await prisma.post.findMany({
    where: { visibility: 'public' },
    orderBy: { updatedAt: 'desc' },
    take: 4, // Get 4 for new layout (1 big + 3 compact)
    include: {
      images: true,
    },
  });

  // Get IDs of latest posts to exclude from featured section
  const latestPostIds = latestPosts.map(p => p.id);

  // Fetch featured posts (only public, exclude latest posts to avoid duplication)
  const featuredPosts = await prisma.post.findMany({
    where: {
      featured: true,
      visibility: 'public',
      id: { notIn: latestPostIds }
    },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      images: true,
    },
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }).format(date);
  };

  const getPostMeta = (post: any) => {
    const wasEdited = new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();
    const dateToShow = wasEdited ? new Date(post.updatedAt) : new Date(post.createdAt);
    const coverImage = post.coverImageId ? post.images.find((img: any) => img.id === post.coverImageId) : null;
    return { dateToShow, coverImage, wasEdited };
  };

  const [latestBig, ...latestCompact] = latestPosts;

  return (
    <div style={{ margin: 0, padding: 0 }}>
      {/* Hero Section */}
      <Hero />

      {/* Quote + Reminder Section */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3rem 2rem 0',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          <DailyQuote />
          <KindReminder />
        </div>
      </div>

      {/* Main Content: Two Column Layout */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 2rem 4rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr',
          gap: '3rem',
        }}
        className="content-grid">
          {/* LEFT: Latest Posts */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'var(--font-ui)' }}>LATEST POSTS</h2>
              <Link href="/posts" style={{ fontSize: '1rem', color: 'var(--color-primary)', border: 'none', fontFamily: 'var(--font-ui)' }}>View all &rarr;</Link>
            </div>

            {latestBig && (() => {
              const { dateToShow, coverImage } = getPostMeta(latestBig);
              return (
                <Link href={`/posts/${latestBig.slug}`} style={{ border: 'none', textDecoration: 'none', display: 'block', marginBottom: '2rem' }}>
                  <div style={{
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-card-bg)',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.3s ease',
                  }}
                  className="featured-post-card">
                    {coverImage && (
                      <Image
                        src={coverImage.url}
                        alt={coverImage.alt || latestBig.title}
                        width={800}
                        height={400}
                        style={{
                          width: '100%',
                          height: '300px',
                          objectFit: 'cover',
                          objectPosition: 'center bottom'
                        }}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    <div style={{ padding: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          backgroundColor: '#eef4fc',
                          color: 'var(--color-primary)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          fontFamily: 'var(--font-ui)',
                        }}>
                          {latestBig.category}
                        </span>
                        {latestBig.featured && (
                          <span style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: '#fff3cd',
                            color: '#856404',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            fontFamily: 'var(--font-ui)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}>
                            ⭐ Featured
                          </span>
                        )}
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)' }}>
                          {formatDate(dateToShow)}
                        </span>
                      </div>
                      <h3 style={{
                        margin: '0 0 1rem 0',
                        fontSize: '1.75rem',
                        color: 'var(--color-text)',
                        fontFamily: 'var(--font-ui)',
                        fontWeight: 700,
                        lineHeight: 1.3,
                      }}>{latestBig.title}</h3>
                      <div style={{
                        fontSize: '1.05rem',
                        lineHeight: '1.6',
                        color: 'var(--color-text-secondary)',
                      }}>
                        <div dangerouslySetInnerHTML={{ __html: latestBig.content.slice(0, 200) + '...' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* Compact Latest Posts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {latestCompact.map((post) => {
                const { dateToShow, coverImage } = getPostMeta(post);
                return (
                  <Link key={post.id} href={`/posts/${post.slug}`} style={{ border: 'none', textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex',
                      gap: '1.5rem',
                      padding: '1.5rem',
                      borderRadius: '12px',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-bg)',
                      transition: 'all 0.2s ease',
                    }}
                    className="compact-post-card">
                      {coverImage && (
                        <Image
                          src={coverImage.url}
                          alt={coverImage.alt || post.title}
                          width={150}
                          height={150}
                          style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            flexShrink: 0,
                          }}
                          sizes="150px"
                        />
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                          <span style={{
                            padding: '0.2rem 0.6rem',
                            borderRadius: '4px',
                            backgroundColor: '#eef4fc',
                            color: 'var(--color-primary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-ui)',
                          }}>
                            {post.category}
                          </span>
                          {post.featured && (
                            <span style={{
                              padding: '0.2rem 0.6rem',
                              borderRadius: '4px',
                              backgroundColor: '#fff3cd',
                              color: '#856404',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              fontFamily: 'var(--font-ui)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                            }}>
                              ⭐ Featured
                            </span>
                          )}
                          <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)' }}>
                            {formatDate(dateToShow)}
                          </span>
                        </div>
                        <h4 style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: '1.2rem',
                          color: 'var(--color-text)',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}>{post.title}</h4>
                        <p style={{
                          margin: 0,
                          fontSize: '0.95rem',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.5,
                        }}>
                          <span dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '').slice(0, 100) + '...' }} />
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Featured Posts */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--color-primary)', fontWeight: 700, fontFamily: 'var(--font-ui)' }}>FEATURED POSTS</h2>
              <Link href="/posts" style={{ fontSize: '1rem', color: 'var(--color-primary)', border: 'none', fontFamily: 'var(--font-ui)' }}>View all &rarr;</Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {featuredPosts.map((post) => {
                const { dateToShow, coverImage } = getPostMeta(post);
                return (
                  <Link key={post.id} href={`/posts/${post.slug}`} style={{ border: 'none', textDecoration: 'none' }}>
                    <div style={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid var(--color-border)',
                      backgroundColor: 'var(--color-card-bg)',
                      transition: 'all 0.3s ease',
                    }}
                    className="featured-sidebar-card">
                      {coverImage && (
                        <Image
                          src={coverImage.url}
                          alt={coverImage.alt || post.title}
                          width={400}
                          height={250}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                          }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                      <div style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '4px',
                            backgroundColor: '#eef4fc',
                            color: 'var(--color-primary)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: 'var(--font-ui)',
                          }}>
                            {post.category}
                          </span>
                        </div>
                        <h4 style={{
                          margin: '0 0 0.5rem 0',
                          fontSize: '1.25rem',
                          color: 'var(--color-text)',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}>{post.title}</h4>
                        <p style={{
                          margin: '0 0 0.75rem 0',
                          fontSize: '0.9rem',
                          color: 'var(--color-text-secondary)',
                          lineHeight: 1.5,
                        }}>
                          <span dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' }} />
                        </p>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-muted)', fontFamily: 'var(--font-ui)' }}>
                          {formatDate(dateToShow)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
