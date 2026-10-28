'use client';

import React from 'react';
import Link from 'next/link';
import { Article } from '@/lib/types';
import { useAuth } from './AuthProvider';

interface ArticleCardProps {
  article: Article;
  variant?: 'hero' | 'card' | 'compact' | 'minimal';
  rank?: number;
}

export function ArticleCard({ article, variant = 'card', rank }: ArticleCardProps) {
  const { isSaved, toggleSave } = useAuth();
  const saved = isSaved(article.slug);

  const formattedDate = new Date(article.published_at).toLocaleDateString('ml-IN', {
    month: 'short',
    day: 'numeric',
  });

  if (variant === 'hero') {
    return (
      <article className="group relative bg-surface border border-border rounded-lg overflow-hidden shadow-card hover:shadow-pop transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-surface-raised">
            <img
              src={article.hero_image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-base"
              loading="eager"
            />
            {article.is_premium && (
              <span className="absolute top-3 left-3 bg-premium text-white text-xs font-bold px-2.5 py-1 rounded-pill shadow">
                👑 പ്രീമിയം
              </span>
            )}
          </div>

          <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                <Link
                  href={`/topic/${article.category?.slug || 'news'}`}
                  className="font-bold text-accent uppercase tracking-wider hover:underline"
                >
                  {article.category?.name_ml || 'വാർത്ത'}
                </Link>
                <div className="flex items-center space-x-2">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span>{article.read_minutes} മിനിറ്റ് വായന</span>
                </div>
              </div>

              <Link href={`/article/${article.slug}`}>
                <h1 className="text-xl md:text-2xl font-bold font-reading text-text group-hover:text-accent transition-colors leading-snug">
                  {article.title}
                </h1>
              </Link>

              <p className="mt-3 text-sm text-text-muted line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs text-text-muted">
                {article.author && (
                  <Link href={`/author/${article.author.slug}`} className="hover:text-accent font-medium">
                    {article.author.display_name}
                  </Link>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleSave(article.slug);
                }}
                className={`p-1.5 rounded hover:bg-surface-raised transition-colors ${
                  saved ? 'text-accent' : 'text-text-muted hover:text-text'
                }`}
                title={saved ? 'സേവ് ചെയ്തതിൽ നിന്ന് നീക്കുക' : 'സേവ് ചെയ്യുക'}
              >
                {saved ? '🔖 സേവ് ചെയ്തു' : '📑 സേവ്'}
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 py-3 border-b border-border last:border-0">
        {article.hero_image_url && (
          <div className="w-24 h-20 flex-shrink-0 rounded overflow-hidden bg-surface-raised relative">
            <img
              src={article.hero_image_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
            {article.is_premium && (
              <span className="absolute top-1 left-1 bg-premium text-white text-[9px] font-bold px-1 rounded">
                👑
              </span>
            )}
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <Link href={`/article/${article.slug}`}>
            <h3 className="text-sm font-semibold font-reading text-text group-hover:text-accent line-clamp-2 leading-snug">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between text-[11px] text-text-muted mt-1.5">
            <span>{article.category?.name_ml}</span>
            <span>{formattedDate}</span>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'minimal') {
    return (
      <article className="group flex gap-3 py-2.5 border-b border-border last:border-0 items-start">
        {rank !== undefined && (
          <span className="text-xl font-black text-accent/40 group-hover:text-accent transition-colors w-6">
            0{rank}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <Link href={`/article/${article.slug}`}>
            <h4 className="text-sm font-semibold font-reading text-text group-hover:text-accent line-clamp-2 leading-snug">
              {article.title}
            </h4>
          </Link>
          <div className="flex items-center space-x-2 text-[10px] text-text-muted mt-1">
            <span>{article.category?.name_ml}</span>
            <span>•</span>
            <span>{article.read_minutes} മിനിറ്റ്</span>
          </div>
        </div>
      </article>
    );
  }

  // Standard Card
  return (
    <article className="group bg-surface border border-border rounded-lg overflow-hidden flex flex-col justify-between shadow-card hover:shadow-pop transition-all">
      <div>
        <div className="aspect-[16/10] overflow-hidden bg-surface-raised relative">
          <img
            src={article.hero_image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-base"
            loading="lazy"
          />
          {article.is_premium && (
            <span className="absolute top-2 left-2 bg-premium text-white text-[11px] font-bold px-2 py-0.5 rounded-pill shadow">
              👑 പ്രീമിയം
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between text-xs text-text-muted mb-2">
            <Link
              href={`/topic/${article.category?.slug || 'news'}`}
              className="font-bold text-accent hover:underline text-[11px] uppercase tracking-wider"
            >
              {article.category?.name_ml || 'വാർത്ത'}
            </Link>
            <span>{formattedDate}</span>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h2 className="text-base font-bold font-reading text-text group-hover:text-accent transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h2>
          </Link>

          <p className="mt-2 text-xs text-text-muted line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-border/50 text-xs text-text-muted">
        <span>{article.read_minutes} മിനിറ്റ് വായന</span>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleSave(article.slug);
          }}
          className={`hover:text-accent ${saved ? 'text-accent font-semibold' : ''}`}
        >
          {saved ? '🔖 സേവ് ചെയ്തു' : '📑 സേവ്'}
        </button>
      </div>
    </article>
  );
}
