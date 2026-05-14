'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Editor from '@/components/Editor';
import ImageUploader from '@/components/ImageUploader';
import PostPreviewModal from '@/components/admin/PostPreviewModal';

interface UploadedImage {
  id: string;
  url: string;
  filename: string;
  size: number;
  width?: number;
  height?: number;
}

export default function EditPost() {
  const params = useParams();
  const postId = params.id as string;
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Learning');
  const [visibility, setVisibility] = useState('public');
  const [content, setContent] = useState('');
  const [featured, setFeatured] = useState(false);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [coverImageId, setCoverImageId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const router = useRouter();

  // Fetch existing post data
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${postId}`);
        if (!res.ok) throw new Error('Failed to fetch post');

        const post = await res.json();
        setTitle(post.title);
        setCategory(post.category);
        setVisibility(post.visibility || 'public');
        setContent(post.content);
        setFeatured(post.featured || false);
        setImages(post.images || []);
        setCoverImageId(post.coverImageId || '');
      } catch (error) {
        console.error('Error fetching post:', error);
        alert('Error loading post');
      } finally {
        setFetching(false);
      }
    }

    fetchPost();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const imageIds = images.map(img => img.id);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
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
        router.push('/admin');
      } else {
        alert('Error updating post');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <p>Loading post...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Edit Post</h1>
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

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
                type="button"
                onClick={() => router.push('/admin')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={() => {
                  window.setTimeout(() => setPreviewOpen(true), 0);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#f1f5f9',
                  color: '#334155',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
            >
                Preview
            </button>
            <button
                type="submit"
                disabled={loading}
                className="primary"
                style={{ opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Updating...' : 'Update Post'}
            </button>
        </div>
      </form>

      {previewOpen && (
        <PostPreviewModal
          title={title}
          category={category}
          content={content}
          images={images}
          coverImageId={coverImageId}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  );
}
