'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { quotes } from '@/../data/quotes';

interface DailyMomentProps {
  heroImages: string[];
}

// Simple hash function to get deterministic index from date
function getDayHash(dateString: string): number {
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export default function DailyMoment({ heroImages }: DailyMomentProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get today's date as YYYY-MM-DD for deterministic selection
  const today = new Date().toISOString().split('T')[0];
  const dayHash = getDayHash(today);

  // Select quote based on date
  const dailyQuote = quotes.length > 0
    ? quotes[dayHash % quotes.length]
    : "Every day is a new beginning.";

  // Select image based on date
  const dailyImage = heroImages.length > 0
    ? heroImages[dayHash % heroImages.length]
    : null;

  if (!mounted) {
    return (
      <div style={{
        padding: '2rem',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-card-bg)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        minHeight: '300px',
      }}>
        <div style={{ color: 'var(--color-muted)' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '2rem',
      borderRadius: '12px',
      border: '1px solid var(--color-border)',
      backgroundColor: 'var(--color-card-bg)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    }}
    className="daily-moment">
      <h3 style={{
        fontSize: '1rem',
        fontFamily: 'var(--font-ui)',
        fontWeight: 700,
        color: 'var(--color-primary)',
        marginTop: 0,
        marginBottom: '1.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        Daily Moment
      </h3>

      {dailyImage && (
        <div style={{ marginBottom: '1.5rem', borderRadius: '8px', overflow: 'hidden' }}>
          <Image
            src={dailyImage}
            alt="Daily inspiration"
            width={400}
            height={300}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
            priority
          />
        </div>
      )}

      <blockquote style={{
        margin: 0,
        padding: '1rem',
        borderLeft: '3px solid var(--color-primary)',
        backgroundColor: 'rgba(var(--color-primary-rgb), 0.05)',
        borderRadius: '4px',
        fontStyle: 'italic',
        fontSize: '1rem',
        lineHeight: '1.6',
        color: 'var(--color-text)',
      }}>
        {dailyQuote}
      </blockquote>
    </div>
  );
}
