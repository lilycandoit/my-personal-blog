'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Editor from '@/components/Editor';

export default function NewPost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Learning');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, category, content }),
    });

    if (res.ok) {
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
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Content</label>
            <Editor value={content} onChange={setContent} />
        </div>

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
