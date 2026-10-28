import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';
import { KeralaDistrictSelector } from '@/components/KeralaDistrictSelector';
import { ArticleCard } from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'ജില്ലാ വാർത്തകൾ (All 14 Districts News) - ദ പ്രോഫിറ്റ്',
  description: 'കേരളത്തിലെ 14 ജില്ലകളിലെയും പ്രാദേശിക വികസനം, കൃഷി, വ്യാപാരം, വ്യവസായ വാർത്തകൾ.',
};

export default function DistrictsHubPage() {
  const districts = newsStore.getDistricts();
  const { articles } = newsStore.getArticles({ limit: 6 });

  const zones = [
    { key: 'south', name_ml: 'തെക്കൻ കേരളം (South Kerala)', desc: 'തിരുവനന്തപുരം, കൊല്ലം, പത്തനംതിട്ട, ആലപ്പുഴ' },
    { key: 'central', name_ml: 'മധ്യ കേരളം (Central Kerala)', desc: 'കോട്ടയം, ഇടുക്കി, എറണാകുളം (കൊച്ചി), തൃശ്ശൂർ, പാലക്കാട്' },
    { key: 'north', name_ml: 'വടക്കൻ കേരളം (North Kerala / Malabar)', desc: 'മലപ്പുറം, കോഴിക്കോട്, വയനാട്, കണ്ണൂർ, കാസർഗോഡ്' },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-text-muted mb-1.5">
          <Link href="/" className="hover:text-accent">ഹോം</Link>
          <span>/</span>
          <span className="text-text font-medium">ജില്ലാ വാർത്തകൾ</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
          <span>📍</span>
          <span>കേരളത്തിലെ 14 ജില്ലാ വാർത്തകൾ (Hyperlocal News)</span>
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          സംസ്ഥാനത്തെ 14 റവന്യൂ ജില്ലകളിലെയും തദ്ദേശീയ വികസന പദ്ധതികൾ, വ്യാപാര വാർത്തകൾ, പ്രാദേശിക മാറ്റങ്ങൾ ഇവിടെ തിരഞ്ഞെടുക്കാം.
        </p>
      </div>

      {/* Interactive District Filter */}
      <KeralaDistrictSelector districts={districts} />

      {/* 3 Regional Zones Breakdown */}
      <div className="space-y-6">
        {zones.map((zone) => {
          const zoneDistricts = districts.filter(d => d.zone === zone.key);
          return (
            <div key={zone.key} className="bg-surface border border-border rounded-xl p-5 shadow-card">
              <div className="border-b border-border pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold font-reading text-text">
                    {zone.name_ml}
                  </h2>
                  <span className="text-xs text-text-muted">{zone.desc}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {zoneDistricts.map((d) => (
                  <Link
                    key={d.id}
                    href={`/districts/${d.slug}`}
                    className="p-3 rounded-lg border border-border bg-surface-raised hover:border-accent hover:shadow-card transition-all text-center group"
                  >
                    <span className="text-lg block mb-1">🏛️</span>
                    <span className="font-bold text-xs font-reading text-text group-hover:text-accent block">
                      {d.name_ml}
                    </span>
                    <span className="text-[10px] text-text-muted block mt-0.5 font-mono">
                      {d.name_en}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Latest State & Local Stories */}
      <div>
        <h2 className="text-xl font-bold font-reading text-text mb-4 border-b border-border pb-2">
          പ്രധാന പ്രാദേശിക റിപ്പോർട്ടുകൾ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="card" />
          ))}
        </div>
      </div>
    </div>
  );
}
