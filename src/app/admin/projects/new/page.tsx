'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';

export default function NewProject() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stack, setStack] = useState('');
  const [status, setStatus] = useState('learning');
  const [learnings, setLearnings] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, stack, status, learnings, githubUrl, demoUrl }),
    });

    if (res.ok) {
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

        <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Description (Detailed)</label>
            <Editor value={description} onChange={setDescription} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
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
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="learning">Learning</option>
                    <option value="experimenting">Experimenting</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                </select>
            </div>
        </div>

        <div>
           <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>What worked? What didn't?</label>
           <textarea
               style={{ minHeight: '100px' }}
               value={learnings}
               onChange={(e) => setLearnings(e.target.value)}
               placeholder="Key takeaways..."
           ></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
             <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>GitHub URL (Optional)</label>
                <input type="url" value={githubUrl} onChange={e => setGithubUrl(e.target.value)} />
             </div>
             <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Demo URL (Optional)</label>
                <input type="url" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} />
             </div>
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
