import React from 'react';
import Link from 'next/link';
import { newsStore } from '@/lib/data/store';
import { ArticleCard } from '@/components/ArticleCard';
import { NewsTicker } from '@/components/NewsTicker';
import { LiveRatesWidget } from '@/components/LiveRatesWidget';
import { HomeTabbedSections } from '@/components/HomeTabbedSections';
import { VideoShortsStrip } from '@/components/VideoShortsStrip';
import { KeralaDistrictSelector } from '@/components/KeralaDistrictSelector';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const heroArticle = newsStore.getHeroArticle();
  const breakingNews = newsStore.getBreakingNews();
  const { articles } = newsStore.getArticles({ limit: 12 });
  const dailyRates = newsStore.getDailyRates();
  const currencies = newsStore.getCurrencies();
  const categories = newsStore.getFlatCategories();
  const shorts = newsStore.getVideos({ isShort: true, limit: 4 });
  const districts = newsStore.getDistricts();

  // Articles for side strips
  const trendingArticles = articles.filter(a => a.id !== heroArticle?.id).slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Breaking News Ticker */}
      <NewsTicker articles={breakingNews} />

      {/* Top Hero Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Hero Article */}
        <div className="lg:col-span-8">
          {heroArticle && (
            <ArticleCard article={heroArticle} variant="hero" />
          )}

          {/* Quick Sub-Hero Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {articles.slice(1, 3).map((art) => (
              <ArticleCard key={art.id} article={art} variant="card" />
            ))}
          </div>
        </div>

        {/* Right Sidebar: Live Rates & Trending */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Live Gold & Currency Widget */}
          <LiveRatesWidget dailyRates={dailyRates} currencies={currencies} />

          {/* Trending Stories */}
          <div className="bg-surface border border-border rounded-lg p-5 shadow-card">
            <h3 className="font-bold text-sm text-text border-b border-border pb-2.5 mb-3 flex items-center justify-between font-reading">
              <span className="flex items-center gap-1.5">
                <span>🔥</span>
                <span>ഏറ്റവും കൂടുതൽ വായിക്കപ്പെട്ടവ</span>
              </span>
              <span className="text-[10px] text-text-muted">Most Read</span>
            </h3>

            <div className="space-y-1">
              {trendingArticles.map((art, idx) => (
                <ArticleCard
                  key={art.id}
                  article={art}
                  variant="minimal"
                  rank={idx + 1}
                />
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* Tabbed Category Stories */}
      <HomeTabbedSections articles={articles} categories={categories} />

      {/* Hyperlocal 14 Districts News Selector */}
      <KeralaDistrictSelector districts={districts} />

      {/* YouTube Shorts Reel */}
      <VideoShortsStrip shorts={shorts} />

      {/* Premium Banner Promotion */}
      <section className="bg-gradient-to-r from-amber-900/90 to-amber-950 text-white rounded-xl p-6 md:p-8 relative overflow-hidden shadow-pop">
        <div className="relative z-10 max-w-2xl">
          <span className="bg-amber-400 text-amber-950 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-pill mb-3 inline-block">
            👑 ദ പ്രോഫിറ്റ് പ്രീമിയം
          </span>
          <h2 className="text-2xl md:text-3xl font-bold font-reading leading-snug">
            സാമ്പത്തിക സ്വാതന്ത്ര്യത്തിലേക്കും മികച്ച നിക്ഷേപങ്ങളിലേക്കും വഴിതുറക്കൂ
          </h2>
          <p className="mt-2 text-sm text-amber-100/90 leading-relaxed">
            വിപണി വിശകലനങ്ങൾ, സ്പെഷ്യൽ ഇൻവെസ്റ്റിഗേറ്റീവ് റിപ്പോർട്ടുകൾ, പരസ്യങ്ങളില്ലാത്ത ശുദ്ധമായ വായനാനുഭവം. പ്രതിമാസം വെറും ₹99 മുതൽ.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/membership"
              className="bg-amber-400 hover:bg-amber-300 text-amber-950 font-bold px-5 py-2.5 rounded-pill text-sm transition-all shadow"
            >
              ഇപ്പോൾ തന്നെ അംഗമാകൂ →
            </Link>
            <Link
              href="/topic/premium"
              className="text-white hover:text-amber-200 text-xs font-semibold px-3 py-2"
            >
              പ്രീമിയം ലേഖനങ്ങൾ കാണുക
            </Link>
          </div>
        </div>
      </section>

      {/* Money & Utility Tools Hub */}
      <section className="bg-surface-raised border border-border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border mb-6 gap-2">
          <div>
            <h3 className="font-bold text-lg font-reading text-text">
              സാമ്പത്തിക ടൂളുകൾ &amp; കാൽക്കുലേറ്ററുകൾ
            </h3>
            <p className="text-xs text-text-muted">
              നിങ്ങളുടെ സമ്പാദ്യവും വായ്പകളും ലളിതമായി കണക്കുകൂട്ടാം
            </p>
          </div>
          <Link
            href="/tools/calculators"
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>എല്ലാ കാൽക്കുലേറ്ററുകളും കാണുക</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <Link
            href="/tools/calculators"
            className="p-4 bg-surface rounded-lg border border-border hover:border-accent hover:shadow-card transition-all"
          >
            <span className="text-2xl block mb-2">📈</span>
            <span className="font-bold text-sm block text-text">SIP കാൽക്കുലേറ്റർ</span>
            <span className="text-xs text-text-muted">മ്യൂച്വൽ ഫണ്ട് വളർച്ച കണക്കാക്കാം</span>
          </Link>

          <Link
            href="/tools/calculators"
            className="p-4 bg-surface rounded-lg border border-border hover:border-accent hover:shadow-card transition-all"
          >
            <span className="text-2xl block mb-2">🏠</span>
            <span className="font-bold text-sm block text-text">ഭവന വായ്പ EMI</span>
            <span className="text-xs text-text-muted">പ്രതിമാസ തിരിച്ചടവ് അറിയാം</span>
          </Link>

          <Link
            href="/tools/gold-rate"
            className="p-4 bg-surface rounded-lg border border-border hover:border-accent hover:shadow-card transition-all"
          >
            <span className="text-2xl block mb-2">🟡</span>
            <span className="font-bold text-sm block text-text">സ്വർണ നിരക്ക് ട്രാക്കർ</span>
            <span className="text-xs text-text-muted">പവൻ, ഗ്രാം കാൽക്കുലേറ്റർ</span>
          </Link>

          <Link
            href="/tools/currency"
            className="p-4 bg-surface rounded-lg border border-border hover:border-accent hover:shadow-card transition-all"
          >
            <span className="text-2xl block mb-2">💱</span>
            <span className="font-bold text-sm block text-text">ഗൾഫ് കറൻസി റേറ്റ്</span>
            <span className="text-xs text-text-muted">ദിർഹം, റിയാൽ, ദിനാർ നിരക്കുകൾ</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
