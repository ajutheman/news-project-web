import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';
import { ArticleCard } from '@/components/ArticleCard';

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag} സംബന്ധിച്ച വാർത്തകൾ - ദ പ്രോഫിറ്റ്`,
    description: `#${decodedTag} ടാഗിലുള്ള വാർത്തകളും റിപ്പോർട്ടുകളും.`,
  };
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const { articles, total } = newsStore.getArticles({ tag: decodedTag, limit: 30 });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-border pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-text-muted">വാർത്താ ടാഗ്</span>
          <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-accent">
            #{decodedTag}
          </h1>
        </div>
        <span className="text-xs bg-surface-raised border border-border px-3 py-1.5 rounded-pill font-mono">
          {total} വാർത്തകൾ
        </span>
      </div>

      {articles.length === 0 ? (
        <div className="p-8 text-center text-text-muted bg-surface rounded-lg border border-border">
          ഈ ടാഗിൽ നിലവിൽ മറ്റ് ലേഖനങ്ങൾ ലഭ്യമല്ല.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="card" />
          ))}
        </div>
      )}
    </div>
  );
}
