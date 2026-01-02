'use client';
import { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { Search as SearchIcon, X, FileText, FolderCode } from 'lucide-react';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/search');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Failed to load search data', e);
      }
    };
    if (isOpen && data.length === 0) {
      fetchData();
    }
  }, [isOpen, data.length]);

  const fuse = new Fuse(data, {
    keys: [
      { name: 'title', weight: 1 },
      { name: 'content', weight: 0.5 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
  });

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      const result = fuse.search(query);
      setResults(result.slice(0, 5).map(r => r.item));
    }
  }, [query, data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="search-bar" style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '0px 12px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <SearchIcon size={18} className="text-[var(--color-muted)]" style={{ marginRight: '8px' }} />
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          style={{
            width: isOpen || query ? '240px' : '150px',
            background: 'transparent',
            border: 'none',
            fontSize: '0.95rem',
            fontFamily: 'var(--font-ui)',
            outline: 'none',
            transition: 'width 0.3s ease'
          }}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginLeft: '8px', display: 'flex' }}
          >
            <X size={16} className="text-muted" />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || query) && (
        <div className="search-results scrollbar-hide" style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          right: 0,
          width: '320px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          zIndex: 100,
          overflow: 'hidden'
        }}>
          {results.length > 0 ? (
            results.map((item, idx) => (
              <Link
                key={idx}
                href={item.type === 'post' ? `/posts/${item.slug}` : `/projects/${item.slug}`}
                onClick={handleSelect}
                className="search-result-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: idx === results.length - 1 ? 'none' : '1px solid rgba(0,0,0,0.05)',
                  transition: 'background 0.2s ease',
                  textDecoration: 'none'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: item.type === 'post' ? 'rgba(93, 156, 236, 0.1)' : 'rgba(160, 210, 235, 0.1)',
                  color: item.type === 'post' ? 'var(--color-primary)' : 'var(--color-secondary)'
                }}>
                  {item.type === 'post' ? <FileText size={16} /> : <FolderCode size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                     {item.description}
                  </div>
                </div>
              </Link>
            ))
          ) : query && (
            <div style={{ padding: '16px', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.9rem' }}>
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        .search-bar:focus-within {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 4px rgba(93, 156, 236, 0.1);
          background-color: white !important;
        }
        .search-result-item:hover {
          background-color: #f8faff;
        }
      `}</style>
    </div>
  );
}

