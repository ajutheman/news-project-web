import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';

export const metadata: Metadata = {
  title: 'എല്ലാ വാർത്താ വിഭാഗങ്ങളും (All Sections) - ദ പ്രോഫിറ്റ്',
  description: 'കേരളം, ബിസിനസ്, ഓഹരി വിപണി, കായികം, വിനോദം, സാങ്കേതികം അടക്കം 37 വാർത്താ വിഭാഗങ്ങൾ.',
};

export default function SectionsPage() {
  const categoryTree = newsStore.getCategories();
  const { articles } = newsStore.getArticles({ limit: 100 });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text">
          എല്ലാ വാർത്താ വിഭാഗങ്ങളും (All Sections)
        </h1>
        <p className="mt-1 text-sm text-text-muted">
          ദ പ്രോഫിറ്റിലെ 20 പ്രധാന വിഭാഗങ്ങളും അവയുടെ ഉപവിഭാഗങ്ങളും താഴെ നൽകുന്നു.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categoryTree.map((parent) => {
          // Count articles matching this parent or its children
          const childIds = parent.children?.map(c => c.id) || [];
          const matchIds = new Set([parent.id, ...childIds]);
          const count = articles.filter(a => matchIds.has(a.category_id)).length;

          return (
            <div
              key={parent.id}
              className="bg-surface border border-border rounded-lg p-5 shadow-card hover:border-accent transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <Link
                  href={`/topic/${parent.slug}`}
                  className="text-lg font-bold font-reading text-text hover:text-accent flex items-center gap-2"
                >
                  {parent.is_premium_section && <span>👑</span>}
                  <span>{parent.name_ml}</span>
                </Link>
                <span className="text-xs text-text-muted font-mono bg-surface-raised px-2 py-0.5 rounded">
                  {parent.name_en}
                </span>
              </div>

              {parent.children && parent.children.length > 0 ? (
                <div className="mt-3 pt-3 border-t border-border/60">
                  <span className="text-xs font-semibold text-text-muted block mb-2">
                    ഉപവിഭാഗങ്ങൾ:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {parent.children.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/topic/${sub.slug}`}
                        className="text-xs bg-surface-raised hover:bg-accent hover:text-white px-2.5 py-1 rounded-md text-text transition-colors"
                      >
                        {sub.name_ml}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-xs text-text-muted">
                  {count > 0 ? `${count} ലേഖനങ്ങൾ ലഭ്യമാണ്` : 'പ്രത്യേക റിപ്പോർട്ടുകൾ'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
