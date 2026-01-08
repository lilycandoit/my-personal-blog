'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { reminders } from '@/../data/reminders';

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

export default function KindReminder() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const dayHash = getDayHash(today + 'reminder'); // Add salt to get different selection than quote
  const dailyReminder = reminders.length > 0
    ? reminders[dayHash % reminders.length]
    : "Take care of yourself today! 💙";

  if (!mounted) return null;

  return (
    <div style={{
      padding: '2rem',
      borderRadius: '16px',
      backgroundColor: '#ffe8f7',
      border: '1px solid #ffd0ed',
      boxShadow: '0 2px 12px rgba(236, 93, 156, 0.1)',
      transition: 'transform 0.3s ease',
    }}
    className="daily-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#e91e8c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0,
        }}>
          <Heart size={24} />
        </div>
        <h3 style={{
          fontSize: '0.95rem',
          fontFamily: 'var(--font-ui)',
          fontWeight: 700,
          color: '#e91e8c',
          margin: 0,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          Kind Reminder
        </h3>
      </div>

      <p style={{
        margin: 0,
        fontSize: '1.1rem',
        lineHeight: '1.6',
        color: 'var(--color-text)',
      }}>
        {dailyReminder}
      </p>
    </div>
  );
}
