'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

interface PreviewImage {
  id: string;
  url: string;
  filename: string;
  width?: number;
  height?: number;
  alt?: string | null;
}

interface ProjectPreviewModalProps {
  name: string;
  description: string;
  stack: string;
  status: string;
  summary: string;
  githubUrl: string;
  demoUrl: string;
  builtDate: string;
  images: PreviewImage[];
  coverImageId: string;
  onClose: () => void;
}

function formatStatus(status: string) {
  return status.replace(/-/g, ' ');
}

function formatBuiltDate(value: string) {
  if (!value) return 'Built date not set';

  const [year, month] = value.split('-').map(Number);
  if (!year || !month) return value;

  return new Intl.DateTimeFormat('en-AU', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1, 1));
}

export default function ProjectPreviewModal({
  name,
  description,
  stack,
  status,
  summary,
  githubUrl,
  demoUrl,
  builtDate,
  images,
  coverImageId,
  onClose,
}: ProjectPreviewModalProps) {
  const coverImage = images.find((image) => image.id === coverImageId) || images[0] || null;
  const galleryImages = images.filter((image) => image.id !== coverImage?.id);
  const displayName = name.trim() || 'Untitled project';
  const displayStack = stack.trim() || 'Tech stack not set yet.';
  const displaySummary = summary.trim();

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="post-preview-modal" role="dialog" aria-modal="true" aria-label="Project preview">
      <div className="post-preview-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="post-preview-panel">
        <div className="post-preview-toolbar">
          <div>
            <p className="post-preview-eyebrow">Preview</p>
            <h2 className="post-preview-toolbar-title">Project draft</h2>
          </div>
          <button type="button" className="post-preview-close" onClick={onClose} aria-label="Close preview">
            <X size={20} />
          </button>
        </div>

        <div className="post-preview-scroll">
          <article className="post-preview-article">
            <header className="mb-8">
              <h1 className="m-0 text-[2.35rem] leading-tight font-bold">
                {displayName}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="text-base text-muted-light">
                  {formatBuiltDate(builtDate)}
                </span>
                <span
                  className={`inline-flex rounded-md px-3 py-1 text-sm font-semibold capitalize ${
                    status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {formatStatus(status)}
                </span>
              </div>
            </header>

            {coverImage && (
              <div className="mb-8">
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || coverImage.filename || displayName}
                  width={coverImage.width || 1200}
                  height={coverImage.height || 700}
                  className="w-full h-auto max-h-[520px] object-contain rounded-2xl"
                />
              </div>
            )}

            <div className="grid gap-8 min-[760px]:grid-cols-[240px_minmax(0,1fr)]">
              <aside className="space-y-5">
                {displaySummary && (
                  <section className="rounded-xl border border-border-light bg-white p-5">
                    <h2 className="m-0 mb-3 text-xl">About</h2>
                    <p className="m-0 text-base leading-relaxed text-gray-700">
                      {displaySummary}
                    </p>
                  </section>
                )}

                <section className="rounded-xl border border-border-light bg-white p-5">
                  <h2 className="m-0 mb-3 text-xl">Stack</h2>
                  <p className="m-0 text-base leading-relaxed text-gray-700">
                    {displayStack}
                  </p>
                </section>

                {(githubUrl || demoUrl) && (
                  <section className="grid gap-3">
                    {githubUrl && (
                      <a
                        href={githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-primary bg-primary px-4 py-3 text-center font-ui text-sm font-semibold text-white hover:bg-primary-hover hover:text-white"
                      >
                        View Code
                      </a>
                    )}
                    {demoUrl && (
                      <a
                        href={demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-primary bg-white px-4 py-3 text-center font-ui text-sm font-semibold text-primary hover:bg-primary/10"
                      >
                        Live
                      </a>
                    )}
                  </section>
                )}
              </aside>

              <main className="min-w-0">
                {description.trim() ? (
                  <div
                    className="content prose prose-lg max-w-none text-xl font-hand leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{ __html: description }}
                  />
                ) : (
                  <p className="text-muted-light">No project story yet.</p>
                )}
              </main>
            </div>

            {galleryImages.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 text-2xl">Project Gallery</h2>
                <div className="grid gap-5 sm:grid-cols-2">
                  {galleryImages.map((image) => (
                    <Image
                      key={image.id}
                      src={image.url}
                      alt={image.alt || image.filename}
                      width={image.width || 700}
                      height={image.height || 480}
                      className="aspect-[4/3] w-full rounded-xl object-cover"
                    />
                  ))}
                </div>
              </section>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
