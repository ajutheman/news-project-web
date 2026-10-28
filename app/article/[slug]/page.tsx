import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';
import { ArticleCard } from '@/components/ArticleCard';
import { ArticleShareBar } from '@/components/ArticleShareBar';
import { ArticleReactions } from '@/components/ArticleReactions';
import { ArticleComments } from '@/components/ArticleComments';
import { ArticleReaderView } from '@/components/ArticleReaderView';
import { LiveRatesWidget } from '@/components/LiveRatesWidget';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = newsStore.getArticleBySlug(slug);

  if (!article) {
    return { title: 'ലേഖനം കണ്ടെത്താനായില്ല - ദ പ്രോഫിറ്റ്' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const canonicalUrl = `${siteUrl}/article/${article.slug}`;

  return {
    title: `${article.title} - ദ പ്രോഫിറ്റ്`,
    description: article.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.published_at,
      authors: article.author ? [article.author.display_name] : undefined,
      images: article.hero_image_url ? [{ url: article.hero_image_url }] : undefined,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = newsStore.getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  // Related articles in the same category
  const { articles: relatedArticles } = newsStore.getArticles({
    categorySlug: article.category?.slug,
    limit: 4,
  });
  const filteredRelated = relatedArticles.filter(a => a.id !== article.id).slice(0, 3);

  const dailyRates = newsStore.getDailyRates();
  const currencies = newsStore.getCurrencies();

  const formattedDate = new Date(article.published_at).toLocaleDateString('ml-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Schema.org JSON-LD NewsArticle
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.hero_image_url ? [article.hero_image_url] : [],
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    author: [{
      '@type': 'Person',
      name: article.author?.display_name || 'The Profit Desk',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'ദ പ്രോഫിറ്റ് (The Profit)',
      url: 'https://theprofit.in',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="space-y-8">
        {/* Breadcrumb & Category */}
        <div className="flex items-center space-x-2 text-xs text-text-muted">
          <Link href="/" className="hover:text-accent">ഹോം</Link>
          <span>/</span>
          {article.category && (
            <Link href={`/topic/${article.category.slug}`} className="hover:text-accent font-semibold text-accent">
              {article.category.name_ml}
            </Link>
          )}
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-reading text-text leading-tight md:leading-snug">
            {article.title}
          </h1>
          <p className="mt-3 text-base md:text-lg text-text-muted leading-relaxed">
            {article.excerpt}
          </p>
        </div>

        {/* Byline, Date & Read Time */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-border text-xs text-text-muted">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 text-accent font-bold flex items-center justify-center text-sm font-reading">
              {article.author?.display_name.charAt(0) || 'ഡെ'}
            </div>
            <div>
              {article.author ? (
                <Link href={`/author/${article.author.slug}`} className="font-bold text-text hover:text-accent block">
                  {article.author.display_name}
                </Link>
              ) : (
                <span className="font-bold text-text">ഡെസ്ക്</span>
              )}
              <span className="text-[11px] block">{formattedDate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="bg-surface-raised px-2.5 py-1 rounded-pill font-mono">
              ⏱ {article.read_minutes} മിനിറ്റ് വായന
            </span>
            {article.is_premium && (
              <span className="bg-premium text-white font-bold px-2 py-0.5 rounded text-[11px]">
                👑 പ്രീമിയം
              </span>
            )}
          </div>
        </div>

        {/* Social Share Bar */}
        <ArticleShareBar title={article.title} slug={article.slug} />

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Article Body */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Image */}
            {article.hero_image_url && (
              <figure className="rounded-lg overflow-hidden border border-border bg-surface-raised">
                <img
                  src={article.hero_image_url}
                  alt={article.title}
                  className="w-full h-auto aspect-[16/10] object-cover"
                />
                {(article.hero_caption || article.hero_credit) && (
                  <figcaption className="p-2.5 text-xs text-text-muted bg-surface flex items-center justify-between">
                    <span>{article.hero_caption}</span>
                    <span className="text-[10px] italic">{article.hero_credit}</span>
                  </figcaption>
                )}
              </figure>
            )}

            {/* Interactive Reader View with Text Size controls and Premium Paywall gate */}
            <ArticleReaderView article={article} />

            {/* Tags Strip */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-4 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-text-muted">ടാഗുകൾ:</span>
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="text-xs bg-surface-raised hover:bg-accent hover:text-white px-2.5 py-1 rounded-pill text-text transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Mood Emoji Reactions */}
            <ArticleReactions articleId={article.id} />

            {/* Comments Section */}
            <ArticleComments articleId={article.id} />
          </div>

          {/* Right Sidebar */}
          <aside className="lg:col-span-4 space-y-6">
            <LiveRatesWidget dailyRates={dailyRates} currencies={currencies} />

            {/* Related Articles */}
            {filteredRelated.length > 0 && (
              <div className="bg-surface border border-border rounded-lg p-5 shadow-card">
                <h3 className="font-bold text-sm text-text border-b border-border pb-2.5 mb-3 font-reading">
                  ബന്ധപ്പെട്ട വാർത്തകൾ (Related Stories)
                </h3>
                <div className="space-y-1">
                  {filteredRelated.map((art) => (
                    <ArticleCard key={art.id} article={art} variant="compact" />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </article>
    </>
  );
}
