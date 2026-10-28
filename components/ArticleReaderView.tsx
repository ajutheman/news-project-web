'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { useAuth } from './AuthProvider';

interface ArticleReaderViewProps {
  article: Article;
}

export function ArticleReaderView({ article }: ArticleReaderViewProps) {
  const { isMember } = useAuth();
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');

  const isLocked = article.is_premium && !isMember;

  const fontClass =
    textSize === 'large'
      ? 'text-lg leading-relaxed'
      : textSize === 'xl'
      ? 'text-xl leading-loose'
      : 'text-base leading-relaxed';

  return (
    <div className="space-y-6">
      {/* Reader Controls Bar: Text resize */}
      <div className="flex items-center justify-between text-xs text-text-muted bg-surface-raised px-4 py-2 rounded-lg border border-border">
        <span className="font-medium">വായനാ സൗകര്യം (Reading Mode):</span>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setTextSize('normal')}
            className={`px-2 py-0.5 rounded font-bold ${
              textSize === 'normal' ? 'bg-accent text-white' : 'bg-surface hover:bg-border text-text'
            }`}
            title="സാധാരണ അക്ഷര വലിപ്പം"
          >
            A
          </button>
          <button
            onClick={() => setTextSize('large')}
            className={`px-2 py-0.5 rounded font-bold ${
              textSize === 'large' ? 'bg-accent text-white' : 'bg-surface hover:bg-border text-text'
            }`}
            title="വലിയ അക്ഷര വലിപ്പം"
          >
            A+
          </button>
          <button
            onClick={() => setTextSize('xl')}
            className={`px-2 py-0.5 rounded font-bold ${
              textSize === 'xl' ? 'bg-accent text-white' : 'bg-surface hover:bg-border text-text'
            }`}
            title="കൂടുതൽ വലിയ അക്ഷരങ്ങൾ"
          >
            A++
          </button>
        </div>
      </div>

      {/* Article Content */}
      <div
        className={`prose prose-slate dark:prose-invert max-w-none font-reading text-text ${fontClass}`}
        dangerouslySetInnerHTML={{
          __html: isLocked ? (article.preview_html || article.excerpt) : article.body_html
        }}
      />

      {/* Premium Paywall Gate */}
      {isLocked && (
        <div className="my-8 p-6 md:p-8 bg-gradient-to-b from-surface via-premium-bg to-premium-bg/80 border-2 border-premium rounded-xl text-center shadow-pop relative">
          <span className="inline-block text-3xl mb-2">👑</span>
          <h3 className="text-xl md:text-2xl font-bold font-reading text-text mb-2">
            തുടർന്ന് വായിക്കാൻ പ്രോഫിറ്റ് പ്രീമിയം സബ്‌സ്‌ക്രൈബ് ചെയ്യുക
          </h3>
          <p className="text-sm text-text-muted max-w-lg mx-auto mb-6 leading-relaxed">
            ഈ ലേഖനം ദ പ്രോഫിറ്റ് പ്രീമിയം വരിക്കാർക്കായി നീക്കിവെച്ചിട്ടുള്ളതാണ്. നിക്ഷേപ വിദഗ്ദ്ധരുടെ ആഴത്തിലുള്ള വിശകലനങ്ങളും എക്‌സ്‌ക്ലൂസീവ് റിപ്പോർട്ടുകളും വായിക്കാൻ ഇപ്പോൾ തന്നെ ചേരൂ.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/membership"
              className="w-full sm:w-auto bg-premium text-white font-bold px-6 py-2.5 rounded-pill text-sm hover:opacity-95 shadow transition-all"
            >
              പ്ലാനുകൾ കാണുക (₹99 മുതൽ) →
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto bg-surface border border-border text-text font-semibold px-5 py-2.5 rounded-pill text-sm hover:bg-surface-raised transition-all"
            >
              ഇതിനകം അംഗമാണോ? ലോഗിൻ ചെയ്യുക
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
