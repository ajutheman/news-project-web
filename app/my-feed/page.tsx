'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { newsStore } from '@/lib/data/store';
import { ArticleCard } from '@/components/ArticleCard';

export default function MyFeedPage() {
  const { interests } = useAuth();
  const allArticles = newsStore.getArticles({ limit: 100 }).articles;

  const feedArticles = allArticles.filter(a => {
    if (interests.length === 0) return true;
    return interests.includes(a.category?.slug || '') || (a.category?.parent_id && interests.includes(a.category.parent_id));
  });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
            <span>📰</span>
            <span>എന്റെ വ്യക്തിഗത ഫീഡ് (My Feed)</span>
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            നിങ്ങൾ തിരഞ്ഞെടുത്ത താല്പര്യങ്ങൾ അടിസ്ഥാനമാക്കിയുള്ള വാർത്തകൾ.
          </p>
        </div>

        <Link
          href="/interests"
          className="text-xs bg-surface-raised border border-border hover:bg-border text-text px-3 py-1.5 rounded-pill self-start sm:self-auto font-semibold"
        >
          ⚙️ താല്പര്യങ്ങൾ മാറ്റുക
        </Link>
      </div>

      {feedArticles.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center space-y-3">
          <p className="text-sm text-text-muted">
            നിങ്ങൾ തിരഞ്ഞെടുത്ത വിഷയങ്ങളിൽ നിലവിൽ പുതിയ വാർത്തകൾ ഇല്ല.
          </p>
          <Link
            href="/interests"
            className="inline-block bg-accent text-white text-xs font-bold px-4 py-2 rounded-pill"
          >
            കൂടുതൽ വിഷയങ്ങൾ ചേർക്കൂ
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {feedArticles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="card" />
          ))}
        </div>
      )}
    </div>
  );
}
