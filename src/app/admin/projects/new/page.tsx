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

export default function NewProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('');
  const [status, setStatus] = useState('in-progress');
  const [learnings, setLearnings] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  const [builtDate, setBuiltDate] = useState('');
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

    const savedDraft = localStorage.getItem('project-draft');
    let draftToRestore: {
      name?: string;
      description?: string;
      stack?: string;
      status?: string;
      learnings?: string;
      githubUrl?: string;
      demoUrl?: string;
      demoVideoUrl?: string;
      builtDate?: string;
      images?: UploadedImage[];
      coverImageId?: string;
    } | null = null;

    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        // Only ask if there's actual content
        if (draft.name || draft.description) {
          if (confirm('Restore unsaved draft?')) {
            draftToRestore = draft;
          } else {
            localStorage.removeItem('project-draft');
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }

    const frame = window.requestAnimationFrame(() => {
      if (draftToRestore) {
        setName(draftToRestore.name || '');
        setDescription(draftToRestore.description || '');
        setStack(draftToRestore.stack || '');
        setStatus(draftToRestore.status || 'in-progress');
        setLearnings(draftToRestore.learnings || '');
        setGithubUrl(draftToRestore.githubUrl || '');
        setDemoUrl(draftToRestore.demoUrl || '');
        setDemoVideoUrl(draftToRestore.demoVideoUrl || '');
        setBuiltDate(draftToRestore.builtDate || '');
        setImages(draftToRestore.images || []);
        setCoverImageId(draftToRestore.coverImageId || '');
      }
      setDraftLoaded(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  // Auto-save (only after draft is loaded to prevent overwriting on mount)
  useEffect(() => {
    if (!draftLoaded) return; // Don't auto-save until we've checked for existing draft

    if (name || description) {
      const draft = { name, description, stack, status, learnings, githubUrl, demoUrl, demoVideoUrl, builtDate, images, coverImageId };
      localStorage.setItem('project-draft', JSON.stringify(draft));
    }
  }, [name, description, stack, status, learnings, githubUrl, demoUrl, demoVideoUrl, builtDate, images, coverImageId, draftLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const imageIds = images.map(img => img.id);

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        stack,
        status,
        learnings,
        githubUrl,
        demoUrl,
        demoVideoUrl,
        builtDate,
        imageIds,
        coverImageId: coverImageId || (imageIds.length > 0 ? imageIds[0] : null),
      }),
    });

    if (res.ok) {
      localStorage.removeItem('project-draft'); // Clear draft on successful save
      router.push('/admin');
    } else {
      alert('Error creating project');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Log a Project</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Project Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ fontSize: '1.2rem', padding: '0.75rem' }}
          />
        </div>

        <div className="admin-form-grid">
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Built Date (Optional)</label>
              <input
                type="month"
                value={builtDate}
                onChange={e => setBuiltDate(e.target.value)}
              />
              <p className="admin-help-text">
                When was this project actually built? (e.g., Jan 2024)
              </p>
            </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Project Images</label>
          <ImageUploader
            images={images}
            onImagesChange={setImages}
            maxImages={10}
            coverImageId={coverImageId}
            onCoverImageChange={setCoverImageId}
          />
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Project Summary</label>
           <textarea
               style={{ minHeight: '80px' }}
               value={learnings}
               onChange={(e) => setLearnings(e.target.value)}
               placeholder="One sentence or key takeaway people should remember about this project."
           ></textarea>
           <p className="admin-help-text">
             This appears in the left sidebar above Tech Stack.
           </p>
        </div>

        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Tech Stack</label>
            <input
                type="text"
                placeholder="React, Next.js..."
                value={stack}
                onChange={(e) => setStack(e.target.value)}
                required
            />
        </div>

        <div className="admin-form-grid">
             <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>GitHub URL (Optional)</label>
                <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
             </div>
             <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Demo URL (Optional)</label>
                <input type="url" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} />
             </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Demo Video URL (Optional)</label>
          <input
            type="url"
            placeholder="YouTube or Vimeo link"
            value={demoVideoUrl}
            onChange={e => setDemoVideoUrl(e.target.value)}
          />
          <p className="admin-help-text">
            For longer demos, paste a YouTube/Vimeo link
          </p>
        </div>

        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description (Detailed)</label>
            <Editor value={description} onChange={setDescription} />
        </div>

        <div style={{ display: 'flex', justifySelf: 'flex-end', justifyContent: 'flex-end' }}>
            <button
                type="submit"
                disabled={loading}
                className="primary"
                style={{ opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Saving...' : 'Save Project'}
            </button>
        </div>
      </form>
    </div>
  );
}
