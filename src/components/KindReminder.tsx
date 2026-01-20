'use client';

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
  const today = new Date().toISOString().split('T')[0];
  const dayHash = getDayHash(today + 'reminder');
  const dailyReminder = reminders.length > 0
    ? reminders[dayHash % reminders.length]
    : "Take care of yourself today! 💙";

  return (
    <div className="p-8 rounded-2xl bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 shadow-sm transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-[50px] h-[50px] rounded-full bg-[#eb78b6] flex items-center justify-center text-white flex-shrink-0">
          <Heart size={24} />
        </div>
        <h3 className="text-sm font-hand font-bold text-[#e91e8c] dark:text-pink-400 m-0 uppercase tracking-wider">
          Kind Reminder
        </h3>
      </div>

      <p className="m-0 text-lg leading-relaxed text-gray-800 dark:text-gray-200 font-hand" suppressHydrationWarning>
        {dailyReminder}
      </p>
    </div>
  );
}
