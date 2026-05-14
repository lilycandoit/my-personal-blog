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

interface PostPreviewModalProps {
  title: string;
  category: string;
  content: string;
  images: PreviewImage[];
  coverImageId: string;
  onClose: () => void;
}

export default function PostPreviewModal({
  title,
  category,
  content,
  images,
  coverImageId,
  onClose,
}: PostPreviewModalProps) {
  const coverImage = images.find((image) => image.id === coverImageId) || images[0] || null;
  const displayTitle = title.trim() || 'Untitled post';

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
    <div className="post-preview-modal" role="dialog" aria-modal="true" aria-label="Post preview">
      <div className="post-preview-backdrop" onClick={onClose} aria-hidden="true" />

      <div className="post-preview-panel">
        <div className="post-preview-toolbar">
          <div>
            <p className="post-preview-eyebrow">Preview</p>
            <h2 className="post-preview-toolbar-title">Post draft</h2>
          </div>
          <button type="button" className="post-preview-close" onClick={onClose} aria-label="Close preview">
            <X size={20} />
          </button>
        </div>

        <div className="post-preview-scroll">
          <article className="post-preview-article">
            <header className="mb-8">
              <h1 className="m-0 text-[2.5rem] leading-tight font-bold">
                {displayTitle}
              </h1>
              <div className="text-base mt-2">
                <span className="tag">{category}</span>
              </div>
            </header>

            {coverImage && (
              <div className="mb-8">
                <Image
                  src={coverImage.url}
                  alt={coverImage.alt || coverImage.filename || displayTitle}
                  width={coverImage.width || 1200}
                  height={coverImage.height || 600}
                  className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
                />
              </div>
            )}

            {content.trim() ? (
              <div
                className="content prose prose-lg max-w-none text-xl font-hand leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-muted-light dark:text-muted-dark">No content yet.</p>
            )}
          </article>
        </div>
      </div>
    </div>
  );
}
