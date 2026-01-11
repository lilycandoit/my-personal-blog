'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import Link from 'next/link';
import { Search as SearchIcon, X, FileText, FolderCode } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch search data when modal opens
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

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Autofocus on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
        setQuery('');
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Fuse.js instance
  const fuse = useMemo(() => new Fuse(data, {
    keys: [
      { name: 'title', weight: 1 },
      { name: 'content', weight: 0.5 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
  }), [data]);

  // Search
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      const result = fuse.search(query);
      setResults(result.slice(0, 8).map(r => r.item));
    }
  }, [query, fuse]);

  const handleSelect = () => {
    onClose();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 9998,
          animation: 'fadeIn 0.2s ease-out',
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: '600px',
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          zIndex: 9999,
          animation: 'scaleIn 0.2s ease-out',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
        }}>
          <SearchIcon size={24} color="var(--color-muted)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts and projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              fontSize: '1.1rem',
              fontFamily: 'var(--font-ui)',
              outline: 'none',
              color: 'var(--color-text)',
            }}
            aria-label="Search input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              style={{
                background: 'none',
                border: 'none',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <X size={20} color="var(--color-muted)" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            style={{
              background: 'none',
              border: 'none',
              padding: '0.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} color="var(--color-text)" />
          </button>
        </div>

        {/* Results */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0.5rem',
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
                  gap: '1rem',
                  padding: '1rem',
                  borderRadius: '8px',
                  transition: 'background 0.2s ease',
                  textDecoration: 'none',
                  marginBottom: '0.25rem',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: item.type === 'post' ? 'rgba(93, 156, 236, 0.1)' : 'rgba(160, 210, 235, 0.1)',
                  color: item.type === 'post' ? 'var(--color-primary)' : 'var(--color-secondary)',
                  flexShrink: 0,
                }}>
                  {item.type === 'post' ? <FileText size={20} /> : <FolderCode size={20} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: 'var(--color-text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginBottom: '0.25rem',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontSize: '0.85rem',
                    color: 'var(--color-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.description || (item.type === 'post' ? item.category : item.status)}
                  </div>
                </div>
              </Link>
            ))
          ) : query ? (
            <div style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: 'var(--color-muted)',
              fontSize: '1rem',
            }}>
              No results found for "{query}"
            </div>
          ) : (
            <div style={{
              padding: '3rem 1.5rem',
              textAlign: 'center',
              color: 'var(--color-muted)',
              fontSize: '1rem',
            }}>
              Start typing to search posts and projects
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--color-border)',
          fontSize: '0.85rem',
          color: 'var(--color-muted)',
          fontFamily: 'var(--font-ui)',
          textAlign: 'center',
        }}>
          Press <kbd style={{
            padding: '0.2rem 0.5rem',
            background: '#f1f5f9',
            borderRadius: '4px',
            fontFamily: 'monospace',
          }}>ESC</kbd> to close
        </div>
      </div>
    </>
  );
}
