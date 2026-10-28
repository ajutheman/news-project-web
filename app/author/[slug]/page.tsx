import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';
import { ArticleCard } from '@/components/ArticleCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const author = newsStore.getAuthorBySlug(slug);

  if (!author) {
    return { title: 'എഴുത്തുകാരനെ കണ്ടെത്താനായില്ല - ദ പ്രോഫിറ്റ്' };
  }

  return {
    title: `${author.display_name} - ലേഖനങ്ങളും വാർത്തകളും | ദ പ്രോഫിറ്റ്`,
    description: author.bio || `${author.display_name} എഴുതിയ ലേഖനങ്ങൾ.`,
  };
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = newsStore.getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const { articles } = newsStore.getArticles({ authorSlug: slug, limit: 30 });

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Author Profile Header */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-card">
        <div className="w-20 h-20 rounded-full bg-accent/20 text-accent font-extrabold text-2xl flex items-center justify-center font-reading flex-shrink-0">
          {author.display_name.charAt(0)}
        </div>
        <div className="text-center sm:text-left space-y-2">
          <h1 className="text-2xl font-bold font-reading text-text">
            {author.display_name}
          </h1>
          <p className="text-sm text-text-muted leading-relaxed">
            {author.bio || 'ദ പ്രോഫിറ്റ് എഡിറ്റോറിയൽ ടീം അംഗം'}
          </p>
          <div className="text-xs text-text-muted pt-1">
            ആകെ പ്രസിദ്ധീകരിച്ചത്: <strong className="text-text">{articles.length} ലേഖനങ്ങൾ</strong>
          </div>
        </div>
      </div>

      {/* Author Articles Grid */}
      <div>
        <h2 className="text-xl font-bold font-reading text-text mb-6 border-b border-border pb-3">
          {author.display_name} എഴുതിയ ലേഖനങ്ങൾ
        </h2>

        {articles.length === 0 ? (
          <div className="p-8 text-center text-text-muted bg-surface rounded-lg border border-border">
            ലേഖനങ്ങൾ ഒന്നും ചേർത്തിട്ടില്ല.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="card" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
