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
    take: 6,
    include: {
      images: true,
    },
  }).then(posts => posts.slice(0, 3));

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
    <div className="m-0 p-0">
      {/* Hero Section */}
      <Hero />

      {/* Quote + Reminder Section */}
      <div className="max-w-[1280px] mx-auto px-8 pt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <DailyQuote />
          <KindReminder />
        </div>
      </div>

      {/* Main Content: Two Column Layout */}
      <div className="max-w-[1280px] mx-auto px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12">
          {/* LEFT: Latest Posts */}
          <div>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl m-0 text-primary font-bold font-hand">LATEST POSTS</h2>
              <Link href="/posts" className="text-base text-primary border-0 font-hand hover:bg-transparent">
                View all &rarr;
              </Link>
            </div>

            {latestBig && (() => {
              const { dateToShow, coverImage } = getPostMeta(latestBig);
              const imageUrl = coverImage?.url || '/sunshine_leaves.avif';
              return (
                <Link
                  href={`/posts/${latestBig.slug}`}
                  className="border-0 no-underline block mb-8 hover:bg-transparent"
                >
                  <div className="rounded-2xl overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                    <Image
                      src={imageUrl}
                      alt={coverImage?.alt || latestBig.title}
                      width={800}
                      height={400}
                      className="w-full h-[300px] object-cover object-center-bottom"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900/30 text-primary text-sm font-semibold font-hand">
                          {latestBig.category}
                        </span>
                        {latestBig.featured && (
                          <span className="px-3 py-1 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-bold font-hand uppercase tracking-wide">
                            ⭐ Featured
                          </span>
                        )}
                        <span className="text-sm text-muted-light dark:text-muted-dark font-hand">
                          {formatDate(dateToShow)}
                        </span>
                      </div>
                      <h3 className="m-0 mb-4 text-[1.75rem] text-gray-800 dark:text-gray-100 font-hand font-bold leading-tight">
                        {latestBig.title}
                      </h3>
                      <div className="text-[1.05rem] leading-relaxed text-gray-600 dark:text-gray-400 font-hand">
                        <div dangerouslySetInnerHTML={{ __html: latestBig.content.slice(0, 200) + '...' }} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })()}

            {/* Compact Latest Posts */}
            <div className="flex flex-col gap-6">
              {latestCompact.map((post) => {
                const { dateToShow, coverImage } = getPostMeta(post);
                const imageUrl = coverImage?.url || '/sunshine_leaves.avif';
                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="border-0 no-underline hover:bg-transparent"
                  >
                    <div className="flex gap-6 p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-all duration-200 hover:shadow-md hover:-translate-y-1">
                      <Image
                        src={imageUrl}
                        alt={coverImage?.alt || post.title}
                        width={150}
                        height={150}
                        className="w-[150px] h-[150px] object-cover rounded-lg flex-shrink-0"
                        sizes="150px"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-semibold font-hand">
                            {post.category}
                          </span>
                          {post.featured && (
                            <span className="px-2.5 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-[0.65rem] font-bold font-hand uppercase tracking-wide">
                              ⭐ Featured
                            </span>
                          )}
                          <span className="text-sm text-muted-light dark:text-muted-dark font-hand">
                            {formatDate(dateToShow)}
                          </span>
                        </div>
                        <h4 className="m-0 mb-2 text-xl text-gray-800 dark:text-gray-100 font-hand font-semibold leading-tight">
                          {post.title}
                        </h4>
                        <p className="m-0 text-[0.95rem] text-gray-600 dark:text-gray-400 leading-normal font-hand">
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
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-2xl m-0 text-primary font-bold font-hand">FEATURED POSTS</h2>
              <Link href="/posts" className="text-base text-primary border-0 font-hand hover:bg-transparent">
                View all &rarr;
              </Link>
            </div>

            <div className="flex flex-col gap-8">
              {featuredPosts.map((post) => {
                const { dateToShow, coverImage } = getPostMeta(post);
                const imageUrl = coverImage?.url || '/sunshine_leaves.avif';
                return (
                  <Link
                    key={post.id}
                    href={`/posts/${post.slug}`}
                    className="border-0 no-underline hover:bg-transparent"
                  >
                    <div className="rounded-xl overflow-hidden border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <Image
                        src={imageUrl}
                        alt={coverImage?.alt || post.title}
                        width={400}
                        height={250}
                        className="w-full h-[200px] object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-900/30 text-primary text-xs font-semibold font-hand">
                            {post.category}
                          </span>
                        </div>
                        <h4 className="m-0 mb-2 text-xl text-gray-800 dark:text-gray-100 font-hand font-semibold leading-tight">
                          {post.title}
                        </h4>
                        <p className="m-0 mb-3 text-sm text-gray-600 dark:text-gray-400 leading-normal font-hand">
                          <span dangerouslySetInnerHTML={{ __html: post.content.replace(/<[^>]*>/g, '').slice(0, 120) + '...' }} />
                        </p>
                        <span className="text-sm text-muted-light dark:text-muted-dark font-hand">
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
