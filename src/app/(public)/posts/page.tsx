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
  const text = htmlContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  const truncated = text.slice(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.slice(0, lastSpace) + '...' : truncated + '...';
}

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { visibility: 'public' },
    orderBy: { updatedAt: 'desc' }, // Most recently updated posts first
    include: {
      images: true,
    },
  });

  return (
    <div className="max-w-[1400px] mx-auto px-8">
      {/* Quote Section */}
      <div className="my-12">
        <DailyQuote variant="posts" />
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {posts.map((post) => {
            const coverImage = post.images?.find(img => img.id === post.coverImageId) || post.images?.[0];
            const imageUrl = coverImage?.url || '/sunshine_leaves.avif';
            const imageAlt = coverImage?.alt || post.title;
            const excerpt = getExcerpt(post.content);

            const wasEdited = new Date(post.updatedAt).getTime() !== new Date(post.createdAt).getTime();
            const dateToShow = wasEdited ? new Date(post.updatedAt) : new Date(post.createdAt);

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
                className="border-0 no-underline block hover:bg-transparent"
              >
                <article className="h-full flex flex-col border border-border-light dark:border-border-dark rounded-2xl overflow-hidden bg-surface-light dark:bg-surface-dark transition-all duration-300 shadow-sm hover:shadow-lg hover:-translate-y-1">
                  {/* Cover Image */}
                  <div className="w-full h-[220px] overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={imageUrl}
                      alt={imageAlt}
                      width={coverImage?.width || 800}
                      height={coverImage?.height || 600}
                      className="w-full h-full object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Post Content */}
                  <div className="p-6 flex-1 flex flex-col gap-4">
                    <h2 className="mb-0 mt-0 text-2xl text-gray-800 dark:text-gray-100 leading-snug">
                      {post.title}
                    </h2>

                    <div className="flex items-center gap-2 text-sm text-muted-light dark:text-muted-dark flex-wrap">
                      <span>
                        {formattedDate}
                        {wasEdited && (
                          <span className="text-xs text-primary ml-2">
                            (Updated)
                          </span>
                        )}
                      </span>
                      <span className="text-border-light dark:text-border-dark">|</span>
                      <span className="bg-primary/10 dark:bg-primary/20 text-primary px-3 py-1 rounded-xl text-sm">
                        {post.category}
                      </span>
                    </div>

                    {/* Excerpt */}
                    <p className="m-0 text-base leading-relaxed text-gray-600 dark:text-gray-400 flex-1">
                      {excerpt}
                    </p>

                    {/* Read More */}
                    <div className="text-base font-semibold text-primary tracking-wide">
                      Read More →
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400">No posts found.</p>
      )}
    </div>
  );
}
