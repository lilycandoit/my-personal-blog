import { formatDate } from '@/lib/utils';
import { getPostBySlug, getPublicPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

// Revalidate every 1 hour - pages are cached and served from CDN
export const revalidate = 3600;

// Pre-generate pages for all existing posts at build time
export async function generateStaticParams() {
  const slugs = await getPublicPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return { title: post.title };
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
  const formattedDate = formatDate(dateToShow, post.timezone, post.location, 'full');

  const coverImage = post.images?.find(img => img.id === post.coverImageId) || post.images?.[0];
  const imageUrl = coverImage?.url || '/sunshine_leaves.avif';
  const imageAlt = coverImage?.alt || post.title;

  return (
    <article className="m-8 p-0">
      {/* Main Content Container */}
      <div className="max-w-[900px] mx-auto px-8 pb-16">
        {/* Header with Title First, Then Meta */}
        <header className="mb-8">
          <h1 className="m-0 text-[2.5rem] leading-tight font-bold">
            {post.title}
          </h1>
          <div className="text-base">
            <span className="date">
              {formattedDate}
              {wasEdited && (
                <span className="text-sm text-primary ml-2">(Updated)</span>
              )}
            </span>
            <span className="mx-2 text-border-light dark:text-border-dark">|</span>
            <span className="tag">{post.category}</span>
          </div>
        </header>

        {/* Cover Image - Full Width */}
        <div className="mb-8">
          <Image
            src={imageUrl}
            alt={imageAlt}
            width={coverImage?.width || 1200}
            height={coverImage?.height || 600}
            className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
            sizes="(max-width: 768px) 100vw, 900px"
          />
        </div>

        {/* Render HTML content from Editor */}
        <div
          className="content prose prose-lg max-w-none text-xl font-hand leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Additional Images Gallery */}
        {post.images && post.images.filter(img => img.id !== post.coverImageId).length > 0 && (
          <div className="mt-12">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
              {post.images
                .filter(img => img.id !== post.coverImageId)
                .map((image) => (
                  <Image
                    key={image.id}
                    src={image.url}
                    alt={image.alt || image.filename}
                    width={image.width || 400}
                    height={image.height || 300}
                    className="w-full h-auto rounded-xl shadow-md"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-border-light dark:border-border-dark shadow-[0_-2px_8px_rgba(0,0,0,0.03)] pt-8 mt-16">
          <Link
            href="/posts"
            className="text-muted-light dark:text-muted-dark border-none no-underline font-ui text-[0.95rem] hover:text-primary"
          >
            ← Back to Posts
          </Link>
        </div>
      </div>
    </article>
  );
}
