'use client';

import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { quotes } from '@/../data/quotes';

// Simple hash function to get deterministic index from date
function getDayHash(dateString: string): number {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export default function DailyQuote() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const dayHash = getDayHash(today);
  const dailyQuote = quotes.length > 0
    ? quotes[dayHash % quotes.length]
    : "Every day is a new beginning.";

  if (!mounted) return null;

  return (
    <div style={{
      padding: '2rem',
      borderRadius: '16px',
      backgroundColor: '#e8f4ff',
      border: '1px solid #d0e7ff',
      boxShadow: '0 2px 12px rgba(93, 156, 236, 0.1)',
      transition: 'transform 0.3s ease',
    }}
    className="daily-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0,
        }}>
          <Quote size={24} />
        </div>
        <h3 style={{
          fontSize: '0.95rem',
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          color: 'var(--color-primary)',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Quote of the Day
        </h3>
      </div>

      <blockquote style={{
        margin: 0,
        fontSize: '1.1rem',
        lineHeight: '1.6',
        color: 'var(--color-text)',
        fontStyle: 'italic',
      }}>
        {dailyQuote}
      </blockquote>
    </div>
  );
}
