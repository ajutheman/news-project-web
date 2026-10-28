import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';
import { ArticleCard } from '@/components/ArticleCard';
import { LiveRatesWidget } from '@/components/LiveRatesWidget';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { category } = newsStore.getCategoryBySlug(slug);

  if (!category) {
    return { title: 'വിഭാഗം കണ്ടെത്താനായില്ല - ദ പ്രോഫിറ്റ്' };
  }

  return {
    title: `${category.name_ml} (${category.name_en}) വാർത്തകൾ - ദ പ്രോഫിറ്റ്`,
    description: `${category.name_ml} വിഭാഗത്തിലെ ഏറ്റവും പുതിയ വാർത്തകളും റിപ്പോർട്ടുകളും വിശകലനങ്ങളും.`,
  };
}

export const dynamic = 'force-dynamic';

export default async function TopicPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page } = await searchParams;

  const { category, subCategories } = newsStore.getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const currentPage = parseInt(page || '1', 10);
  const pageSize = 9;
  const offset = (currentPage - 1) * pageSize;

  const { articles, total } = newsStore.getArticles({
    categorySlug: slug,
    limit: pageSize,
    offset,
  });

  const totalPages = Math.ceil(total / pageSize);
  const dailyRates = newsStore.getDailyRates();
  const currencies = newsStore.getCurrencies();

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="border-b border-border pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs text-text-muted mb-1.5">
              <Link href="/" className="hover:text-accent">ഹോം</Link>
              <span>/</span>
              {category.parent_id && (
                <>
                  <Link href="/sections" className="hover:text-accent">വിഭാഗങ്ങൾ</Link>
                  <span>/</span>
                </>
              )}
              <span className="text-text font-medium">{category.name_ml}</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
              {category.is_premium_section && <span>👑</span>}
              <span>{category.name_ml}</span>
              <span className="text-base font-normal text-text-muted font-sans">
                ({category.name_en})
              </span>
            </h1>
          </div>

          <span className="text-xs text-text-muted bg-surface-raised border border-border px-3 py-1.5 rounded-pill font-mono">
            ആകെ {total} ലേഖനങ്ങൾ
          </span>
        </div>

        {/* Sub-category Quick Chips */}
        {subCategories && subCategories.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-semibold text-text-muted flex-shrink-0">
              ഉപവിഭാഗങ്ങൾ:
            </span>
            <Link
              href={`/topic/${category.parent_id ? (newsStore.getFlatCategories().find(c => c.id === category.parent_id)?.slug || slug) : slug}`}
              className={`text-xs px-3 py-1 rounded-pill whitespace-nowrap transition-colors ${
                !category.parent_id
                  ? 'bg-accent text-white font-bold'
                  : 'bg-surface-raised hover:bg-border text-text'
              }`}
            >
              എല്ലാം
            </Link>
            {subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/topic/${sub.slug}`}
                className={`text-xs px-3 py-1 rounded-pill whitespace-nowrap transition-colors ${
                  sub.slug === slug
                    ? 'bg-accent text-white font-bold'
                    : 'bg-surface-raised hover:bg-border text-text'
                }`}
              >
                {sub.name_ml}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Articles List */}
        <div className="lg:col-span-8">
          {articles.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-10 text-center text-text-muted">
              ഈ വിഭാഗത്തിൽ നിലവിൽ പുതിയ ലേഖനങ്ങൾ ചേർത്തിട്ടില്ല.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="card" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <Link
                href={`/topic/${slug}?page=${Math.max(1, currentPage - 1)}`}
                className={`px-3 py-1.5 rounded border border-border text-xs font-semibold ${
                  currentPage <= 1 ? 'pointer-events-none opacity-40' : 'hover:bg-surface-raised'
                }`}
              >
                ◀ മുൻപത്തെ പേജ്
              </Link>

              <span className="text-xs text-text-muted font-mono">
                പേജ് {currentPage} / {totalPages}
              </span>

              <Link
                href={`/topic/${slug}?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`px-3 py-1.5 rounded border border-border text-xs font-semibold ${
                  currentPage >= totalPages ? 'pointer-events-none opacity-40' : 'hover:bg-surface-raised'
                }`}
              >
                അടുത്ത പേജ് ▶
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <LiveRatesWidget dailyRates={dailyRates} currencies={currencies} />
        </aside>
      </div>
    </div>
  );
}
