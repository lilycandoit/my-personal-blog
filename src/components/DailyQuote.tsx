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

interface DailyQuoteProps {
  variant?: 'home' | 'posts' | 'projects';
}

export default function DailyQuote({ variant = 'home' }: DailyQuoteProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  // Use different salt for each page to get different quote
  const salt = variant === 'posts' ? 'posts-quote' : variant === 'projects' ? 'projects-quote' : '';
  const dayHash = getDayHash(today + salt);
  const dailyQuote = quotes.length > 0
    ? quotes[dayHash % quotes.length]
    : "Every day is a new beginning.";

  // Detect if it's a joke (has ? or ! or doesn't have " - ")
  const isJoke = dailyQuote.includes('?') ||
                 dailyQuote.includes('!') ||
                 !dailyQuote.includes(' - ');

  // Format the quote text with quotation marks around quote only (not author)
  let formattedQuote = dailyQuote;
  if (!isJoke && dailyQuote.includes(' - ')) {
    const [quoteText, author] = dailyQuote.split(' - ');
    formattedQuote = `"${quoteText}" - ${author}`;
  }

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', justifyContent: 'center' }}>
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
          What quote for today?
        </h3>
      </div>

      <blockquote style={{
        margin: 0,
        fontSize: '1.1rem',
        lineHeight: '1.6',
        color: 'var(--color-text)',
        fontStyle: isJoke ? 'normal' : 'italic',
        textAlign: 'center',
      }}>
        {formattedQuote}
      </blockquote>
    </div>
  );
}
