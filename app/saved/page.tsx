'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { newsStore } from '@/lib/data/store';
import { ArticleCard } from '@/components/ArticleCard';

export default function SavedArticlesPage() {
  const { saves } = useAuth();
  const allArticles = newsStore.getArticles({ limit: 100 }).articles;
  const savedArticles = allArticles.filter(a => saves.includes(a.slug));

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
            <span>🔖</span>
            <span>സേവ് ചെയ്ത ലേഖനങ്ങൾ (My Saves)</span>
          </h1>
          <p className="mt-1 text-xs text-text-muted">
            പിന്നീട് വായിക്കാനായി നിങ്ങൾ മാറ്റിവെച്ച ലേഖനങ്ങൾ.
          </p>
        </div>
        <span className="text-xs bg-surface-raised border border-border px-3 py-1.5 rounded-pill font-mono">
          {savedArticles.length} ലേഖനങ്ങൾ
        </span>
      </div>

      {savedArticles.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center space-y-3">
          <span className="text-4xl block">📑</span>
          <h3 className="text-base font-bold text-text">ലേഖനങ്ങൾ ഒന്നും സേവ് ചെയ്തിട്ടില്ല</h3>
          <p className="text-xs text-text-muted max-w-md mx-auto">
            വാർത്തകൾ വായിക്കുമ്പോൾ &quot;സേവ്&quot; ബട്ടൺ ക്ലിക്ക് ചെയ്താൽ അവ ഇവിടെ പിന്നീട് വായിക്കാൻ സൂക്ഷിക്കാം.
          </p>
          <Link
            href="/"
            className="inline-block mt-3 bg-accent text-white text-xs font-bold px-4 py-2 rounded-pill hover:opacity-90 transition-all"
          >
            വാർത്തകൾ വായിക്കാം →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {savedArticles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="card" />
          ))}
        </div>
      )}
    </div>
  );
}
