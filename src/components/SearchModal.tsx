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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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

  const fuse = useMemo(() => new Fuse(data, {
    keys: [
      { name: 'title', weight: 1 },
      { name: 'content', weight: 0.5 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
  }), [data]);

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
        className="fixed inset-0 bg-black/60 z-[9998] animate-[fadeIn_0.2s_ease-out]"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[600px] bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl z-[9999] scale-in max-h-[80vh] flex flex-col"
      >
        {/* Search Input */}
        <div className="flex items-center gap-4 p-6 border-b border-border-light dark:border-border-dark">
          <SearchIcon size={24} className="text-muted-light dark:text-muted-dark" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search posts and projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-0 text-lg font-hand outline-none text-gray-800 dark:text-gray-100 placeholder:text-muted-light dark:placeholder:text-muted-dark"
            aria-label="Search input"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              aria-label="Clear search"
              className="bg-transparent border-0 p-2 cursor-pointer flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={20} className="text-muted-light dark:text-muted-dark" />
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close search"
            className="bg-transparent border-0 p-2 cursor-pointer flex items-center rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-800 dark:text-gray-100" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-2">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <Link
                key={idx}
                href={item.type === 'post' ? `/posts/${item.slug}` : `/projects/${item.slug}`}
                onClick={handleSelect}
                className="flex items-center gap-4 p-4 rounded-lg transition-colors no-underline border-0 mb-1 hover:bg-background-light dark:hover:bg-gray-700"
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${
                  item.type === 'post'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary-light/20 dark:bg-secondary-dark/20 text-secondary-light dark:text-secondary-dark'
                }`}>
                  {item.type === 'post' ? <FileText size={20} /> : <FolderCode size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis mb-1 font-hand">
                    {item.title}
                  </div>
                  <div className="text-sm text-muted-light dark:text-muted-dark whitespace-nowrap overflow-hidden text-ellipsis font-hand">
                    {item.description || (item.type === 'post' ? item.category : item.status)}
                  </div>
                </div>
              </Link>
            ))
          ) : query ? (
            <div className="py-12 px-6 text-center text-muted-light dark:text-muted-dark text-base font-hand">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-12 px-6 text-center text-muted-light dark:text-muted-dark text-base font-hand">
              Start typing to search posts and projects
            </div>
          )}
        </div>

        {/* Keyboard hint */}
        <div className="px-6 py-4 border-t border-border-light dark:border-border-dark text-sm text-muted-light dark:text-muted-dark font-hand text-center">
          Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded font-mono">ESC</kbd> to close
        </div>
      </div>
    </>
  );
}
