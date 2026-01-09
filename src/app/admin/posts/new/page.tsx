'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';
import ImageUploader from '@/components/ImageUploader';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
}

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Learning');
  const [visibility, setVisibility] = useState('public');
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coverImageId, setCoverImageId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const hasPromptedRef = useRef(false);
  const router = useRouter();

  // Restore draft on mount (only once)
  useEffect(() => {
    // Prevent double prompt in React.StrictMode
    if (hasPromptedRef.current) return;
    hasPromptedRef.current = true;

    const savedDraft = localStorage.getItem('post-draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Only ask if there's actual content
        if (draft.title || draft.content) {
          if (confirm('Restore unsaved draft?')) {
            setTitle(draft.title || '');
            setCategory(draft.category || 'Learning');
            setVisibility(draft.visibility || 'public');
            setContent(draft.content || '');
            setFeatured(draft.featured || false);
            setImages(draft.images || []);
            setCoverImageId(draft.coverImageId || '');
          } else {
            localStorage.removeItem('post-draft');
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
    setDraftLoaded(true);
  }, []);

  // Auto-save (only after draft is loaded to prevent overwriting on mount)
  useEffect(() => {
    if (!draftLoaded) return; // Don't auto-save until we've checked for existing draft

    if (title || content) {
      const draft = { title, category, visibility, content, featured, images, coverImageId };
      localStorage.setItem('post-draft', JSON.stringify(draft));
    }
  }, [title, category, visibility, content, featured, images, coverImageId, draftLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const imageIds = images.map(img => img.id);

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        category,
        visibility,
        content,
        featured,
        imageIds,
        coverImageId: coverImageId || (imageIds.length > 0 ? imageIds[0] : null),
      }),
    });

    if (res.ok) {
      localStorage.removeItem('post-draft'); // Clear draft on successful publish
      router.push('/admin');
    } else {
      alert('Error creating post');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Write a new thought</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Title</label>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ fontSize: '1.2rem', padding: '0.75rem' }}
          />
        </div>

        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Category</label>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="Learning">Learning</option>
                <option value="Life">Life</option>
                <option value="Moments">Moments</option>
            </select>
        </div>

        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Visibility</label>
            <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
            >
                <option value="public">Public (visible to everyone)</option>
                <option value="unlisted">Unlisted (accessible via link only)</option>
                <option value="draft">Draft (only visible in admin)</option>
            </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                style={{
                  width: '20px',
                  height: '20px',
                  cursor: 'pointer',
                }}
            />
            <label htmlFor="featured" style={{ fontWeight: 500, cursor: 'pointer', marginBottom: 0 }}>
              Featured (show on homepage)
            </label>
        </div>

        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content</label>
            <Editor value={content} onChange={setContent} />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Images</label>
          <ImageUploader images={images} onImagesChange={setImages} maxImages={10} />
        </div>

        {images.length > 0 && (
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Cover Image</label>
            <select
              value={coverImageId}
              onChange={e => setCoverImageId(e.target.value)}
              style={{ maxWidth: '300px' }}
            >
              <option value="">Auto (first image)</option>
              {images.map(img => (
                <option key={img.id} value={img.id}>
                  {img.filename}
                </option>
              ))}
            </select>
          </div>
        )}

        <div style={{ display: 'flex', justifySelf: 'flex-end', justifyContent: 'flex-end' }}>
            <button
                type="submit"
                disabled={loading}
                className="primary"
                style={{ opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Publishing...' : 'Publish'}
            </button>
        </div>
      </form>
    </div>
  );
}
