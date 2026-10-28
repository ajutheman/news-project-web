'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';

interface NewsTickerProps {
  articles: Article[];
}

export function NewsTicker({ articles }: NewsTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [articles.length]);

  if (!articles || articles.length === 0) return null;
  const current = articles[currentIndex];

  return (
    <div className="bg-accent/10 border-y border-accent/20 py-2 px-3 mb-6 flex items-center gap-3 rounded-md">
      <div className="flex items-center gap-1.5 bg-accent text-white text-xs font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0 animate-pulse">
        <span>🔴</span>
        <span>ബ്രേക്കിങ് ന്യൂസ്</span>
      </div>

      <div className="flex-1 overflow-hidden min-w-0">
        <Link
          href={`/article/${current.slug}`}
          className="text-xs md:text-sm font-semibold text-text hover:text-accent truncate block transition-all font-reading"
        >
          {current.title}
        </Link>
      </div>

      <div className="hidden sm:flex items-center space-x-1 text-xs text-text-muted flex-shrink-0">
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length)}
          className="p-1 hover:text-accent"
          aria-label="Previous headline"
        >
          ◀
        </button>
        <span className="text-[11px] font-mono">
          {currentIndex + 1}/{articles.length}
        </span>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % articles.length)}
          className="p-1 hover:text-accent"
          aria-label="Next headline"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
