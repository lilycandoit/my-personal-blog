'use client';
import { useState, useEffect, useRef, useMemo } from 'react';
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
      setResults(result.slice(0, 5).map(r => r.item));
    }
  }, [query, fuse]);

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
      <div className="flex items-center border border-border-light dark:border-border-dark rounded-xl bg-white/80 dark:bg-surface-dark/80 backdrop-blur-sm transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white dark:focus-within:bg-surface-dark">
        <SearchIcon size={18} className="text-muted-light dark:text-muted-dark ml-2 mr-2" />
        <input
          type="text"
          placeholder="Search posts/projects"
          className="bg-transparent border-none text-sm font-hand outline-none w-[160px] text-gray-800 dark:text-gray-100 placeholder:text-muted-light dark:placeholder:text-muted-dark"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="bg-transparent border-0 p-0 cursor-pointer ml-2 flex hover:opacity-70"
          >
            <X size={16} className="text-muted-light dark:text-muted-dark" />
          </button>
        )}
      </div>

      {isOpen && (results.length > 0 || query) && (
        <div className="absolute top-[calc(100%+12px)] right-0 w-80 max-h-[400px] overflow-y-auto bg-surface-light dark:bg-surface-dark backdrop-blur-2xl border border-border-light dark:border-border-dark rounded-2xl shadow-2xl z-[1000]">
          {results.length > 0 ? (
            results.map((item, idx) => (
              <Link
                key={idx}
                href={item.type === 'post' ? `/posts/${item.slug}` : `/projects/${item.slug}`}
                onClick={handleSelect}
                className={`flex items-center gap-3 px-4 py-3 transition-colors no-underline border-0 hover:bg-background-light dark:hover:bg-gray-700 ${
                  idx === results.length - 1 ? '' : 'border-b border-gray-100 dark:border-gray-800'
                }`}
              >
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                  item.type === 'post'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary-light/20 dark:bg-secondary-dark/20 text-secondary-light dark:text-secondary-dark'
                }`}>
                  {item.type === 'post' ? <FileText size={16} /> : <FolderCode size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 whitespace-nowrap overflow-hidden text-ellipsis font-hand">
                    {item.title}
                  </div>
                  <div className="text-xs text-muted-light dark:text-muted-dark whitespace-nowrap overflow-hidden text-ellipsis font-hand">
                    {item.description}
                  </div>
                </div>
              </Link>
            ))
          ) : query && (
            <div className="p-4 text-center text-muted-light dark:text-muted-dark text-sm font-hand">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
