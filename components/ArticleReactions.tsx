'use client';

import React, { useState } from 'react';

interface ArticleReactionsProps {
  articleId: string;
}

export function ArticleReactions({ articleId }: ArticleReactionsProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [counts, setCounts] = useState({
    like: 48,
    love: 24,
    surprised: 12,
    sad: 3,
    angry: 2
  });

  const moods = [
    { key: 'like', emoji: '👍', label: 'ഇഷ്ടപ്പെട്ടു' },
    { key: 'love', emoji: '❤️', label: 'സ്നേഹം' },
    { key: 'surprised', emoji: '😲', label: 'അമ്പരപ്പ്' },
    { key: 'sad', emoji: '😢', label: 'സങ്കടം' },
    { key: 'angry', emoji: '😡', label: 'രോഷം' }
  ];

  const handleSelect = (key: string) => {
    if (selectedMood === key) {
      setSelectedMood(null);
      setCounts(prev => ({ ...prev, [key]: (prev as any)[key] - 1 }));
    } else {
      setCounts(prev => ({
        ...prev,
        ...(selectedMood ? { [selectedMood]: (prev as any)[selectedMood] - 1 } : {}),
        [key]: (prev as any)[key] + 1
      }));
      setSelectedMood(key);
    }
  };

  return (
    <div className="bg-surface-raised border border-border rounded-xl p-5 my-8">
      <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3 text-center">
        നിങ്ങളുടെ പ്രതികരണം രേഖപ്പെടുത്തൂ (Mood Reactions)
      </h4>

      <div className="flex items-center justify-center gap-3 sm:gap-6">
        {moods.map((m) => {
          const isSelected = selectedMood === m.key;
          const count = (counts as any)[m.key];
          return (
            <button
              key={m.key}
              onClick={() => handleSelect(m.key)}
              className={`flex flex-col items-center p-2 rounded-lg transition-transform hover:scale-110 ${
                isSelected ? 'bg-accent/10 border border-accent/40 scale-105' : 'hover:bg-surface'
              }`}
            >
              <span className="text-2xl mb-1">{m.emoji}</span>
              <span className="text-[11px] font-bold text-text">{count}</span>
              <span className="text-[10px] text-text-muted">{m.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
