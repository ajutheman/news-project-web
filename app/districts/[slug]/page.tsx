import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';
import { KeralaDistrictSelector } from '@/components/KeralaDistrictSelector';
import { ArticleCard } from '@/components/ArticleCard';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const district = newsStore.getDistrictBySlug(slug);

  if (!district) {
    return { title: 'ജില്ല കണ്ടെത്താനായില്ല - ദ പ്രോഫിറ്റ്' };
  }

  return {
    title: `${district.name_ml} (${district.name_en}) വാർത്തകൾ - ദ പ്രോഫിറ്റ്`,
    description: `${district.name_ml} ജില്ലയിലെ ഏറ്റവും പുതിയ വാർത്തകൾ, വികസന പദ്ധതികൾ, വ്യാപാര റിപ്പോർട്ടുകൾ.`,
  };
}

export default async function DistrictDetailPage({ params }: Props) {
  const { slug } = await params;
  const district = newsStore.getDistrictBySlug(slug);

  if (!district) {
    notFound();
  }

  const allDistricts = newsStore.getDistricts();
  // Fetch articles for this district or general state news fallback
  const { articles: districtArticles } = newsStore.getArticles({
    districtSlug: slug,
    limit: 10,
  });

  const { articles: fallbackArticles } = newsStore.getArticles({ limit: 4 });
  const displayArticles = districtArticles.length > 0 ? districtArticles : fallbackArticles;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* District Header */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-text-muted mb-1.5">
            <Link href="/" className="hover:text-accent">ഹോം</Link>
            <span>/</span>
            <Link href="/districts" className="hover:text-accent">ജില്ലകൾ</Link>
            <span>/</span>
            <span className="text-text font-medium">{district.name_ml}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
            <span>📍</span>
            <span>{district.name_ml} ജില്ലാ വാർത്തകൾ</span>
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="bg-surface-raised border border-border px-2.5 py-0.5 rounded font-mono">
              {district.name_en}
            </span>
            <span>•</span>
            <span>ആസ്ഥാനം: <strong className="text-text">{district.headquarters_ml}</strong></span>
            <span>•</span>
            <span>മേഖല: <strong className="text-text uppercase">{district.zone} Kerala</strong></span>
          </div>
        </div>

        {/* Local Highlights Card */}
        <div className="bg-surface-raised border border-border rounded-lg p-3 text-center sm:text-right text-xs">
          <span className="text-text-muted block text-[10px]">കാലാവസ്ഥ (Weather):</span>
          <span className="text-base font-bold text-text">🌤️ 29°C തെളിഞ്ഞ ആകാശം</span>
        </div>
      </div>

      {/* 14 Districts Filter Bar */}
      <KeralaDistrictSelector districts={allDistricts} activeSlug={slug} />

      {/* Articles Grid */}
      <div>
        <h2 className="text-xl font-bold font-reading text-text mb-4 border-b border-border pb-2">
          {district.name_ml} വാർത്തകളും റിപ്പോർട്ടുകളും
        </h2>

        {districtArticles.length === 0 && (
          <div className="bg-surface-raised border border-border rounded-lg p-4 mb-6 text-xs text-text-muted">
            ℹ️ {district.name_ml} ജില്ലയിൽ നിന്നുള്ള പുതിയ ബുള്ളറ്റിനുകൾ താഴെ നൽകുന്നു:
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayArticles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="card" />
          ))}
        </div>
      </div>
    </div>
  );
}
