'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function EditProject() {
  const params = useParams();
  const projectId = params.id as string;
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
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  // Fetch existing project data
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (!res.ok) throw new Error('Failed to fetch project');

        const project = await res.json();
        setName(project.name);
        setDescription(project.description);
        setStack(project.stack);
        // Normalize status to match enum values
        const normalizedStatus = project.status === 'completed' ? 'completed' : 'in-progress';
        setStatus(normalizedStatus);
        setLearnings(project.learnings || '');
        setGithubUrl(project.githubUrl || '');
        setDemoUrl(project.demoUrl || '');
        setDemoVideoUrl(project.demoVideoUrl || '');
        setBuiltDate(project.builtDate ? project.builtDate.substring(0, 7) : '');
        setImages(project.images || []);
        setCoverImageId(project.coverImageId || '');
      } catch (error) {
        console.error('Error fetching project:', error);
        alert('Error loading project');
      } finally {
        setFetching(false);
      }
    }

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const imageIds = images.map(img => img.id);

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
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
        router.push('/admin');
      } else {
        const errorData = await res.json();
        console.error('API Error:', errorData);
        const errorMessage = typeof errorData.error === 'string'
          ? errorData.error
          : JSON.stringify(errorData.error);
        alert(`Error updating project: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error updating project:', error);
      alert(`Error updating project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
        <p>Loading project...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Edit Project</h1>
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
                type="submit"
                disabled={loading}
                className="primary"
                style={{ opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Updating...' : 'Update Project'}
            </button>
        </div>
      </form>
    </div>
  );
}
