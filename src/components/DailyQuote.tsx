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
  const salt = variant === 'posts' ? 'posts-quote' : variant === 'projects' ? 'projects-quote' : '';
  const dayHash = getDayHash(today + salt);
  const dailyQuote = quotes.length > 0
    ? quotes[dayHash % quotes.length]
    : "Every day is a new beginning.";

  // Detect if it's a joke
  const isJoke = dailyQuote.includes('?') ||
                 dailyQuote.includes('!') ||
                 !dailyQuote.includes(' - ');

  // Format the quote text
  let formattedQuote = dailyQuote;
  if (!isJoke && dailyQuote.includes(' - ')) {
    const [quoteText, author] = dailyQuote.split(' - ');
    formattedQuote = `"${quoteText}" - ${author}`;
  }

  if (!mounted) return null;

  return (
    <div className="p-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 shadow-sm transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-[50px] h-[50px] rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0">
          <Quote size={24} />
        </div>
        <h3 className="text-sm font-hand font-bold text-primary m-0 uppercase tracking-wider">
          What quote for today?
        </h3>
      </div>

      <blockquote className={`m-0 text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-hand ${!isJoke ? 'italic' : ''}`}>
        {formattedQuote}
      </blockquote>
    </div>
  );
}
