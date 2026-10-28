'use client';

import React, { useState } from 'react';
import { Article, Category } from '@/lib/types';
import { ArticleCard } from './ArticleCard';
import Link from 'next/link';

interface HomeTabbedSectionsProps {
  articles: Article[];
  categories: Category[];
}

export function HomeTabbedSections({ articles, categories }: HomeTabbedSectionsProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const mainTabs = [
    { slug: 'all', name_ml: 'എല്ലാം (All)' },
    { slug: 'business', name_ml: 'ബിസിനസ്' },
    { slug: 'kerala', name_ml: 'കേരളം' },
    { slug: 'technology', name_ml: 'സാങ്കേതികം' },
    { slug: 'sports', name_ml: 'കായികം' },
    { slug: 'premium', name_ml: '👑 പ്രീമിയം' },
  ];

  const filteredArticles = activeTab === 'all'
    ? articles
    : activeTab === 'premium'
    ? articles.filter(a => a.is_premium)
    : articles.filter(a => {
        const cat = categories.find(c => c.id === a.category_id);
        if (cat?.slug === activeTab) return true;
        // Also check if child category
        const parent = categories.find(c => c.id === cat?.parent_id);
        return parent?.slug === activeTab;
      });

  return (
    <section className="my-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-accent mb-6 gap-3">
        <h2 className="text-xl font-bold font-reading text-text flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-accent"></span>
          <span>വിഭാഗം തിരിച്ചുള്ള വാർത്തകൾ</span>
        </h2>

        {/* Tab buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {mainTabs.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
              className={`px-3 py-1 rounded-pill text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.slug
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-raised text-text-muted hover:text-text hover:bg-border'
              }`}
            >
              {tab.name_ml}
            </button>
          ))}
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="p-8 text-center text-text-muted bg-surface rounded-lg border border-border">
          ഈ വിഭാഗത്തിൽ നിലവിൽ പുതിയ വാർത്തകൾ ലഭ്യമല്ല.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.slice(0, 6).map((art) => (
            <ArticleCard key={art.id} article={art} variant="card" />
          ))}
        </div>
      )}

      {activeTab !== 'all' && (
        <div className="text-center mt-6">
          <Link
            href={`/topic/${activeTab}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-accent hover:underline uppercase tracking-wider"
          >
            <span>{mainTabs.find(t => t.slug === activeTab)?.name_ml} കൂടുതൽ വാർത്തകൾ കാണുക</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
