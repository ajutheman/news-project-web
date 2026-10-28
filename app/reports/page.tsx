'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ResearchReport } from '@/lib/types';
import { AdSlot } from '@/components/AdSlot';

export default function ReportsLibraryPage() {
  const [reports, setReports] = useState<ResearchReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/reports')
      .then((res) => res.json())
      .then((data) => {
        if (data.reports) setReports(data.reports);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load reports:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-purple-500/15 via-surface to-accent/10 border border-border rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
            <span>📑</span>
            <span>പ്രോഫിറ്റ് റിസർച്ച് &amp; വൈറ്റ്പേപ്പറുകൾ (Research &amp; Reports)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-reading text-text leading-tight">
            കേരള സമ്പദ്‌വ്യവസ്ഥയെയും സംരംഭകത്വത്തെയും കുറിച്ചുള്ള ആധികാരിക പഠനങ്ങൾ
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            കേരളത്തിലെ സ്റ്റാർട്ടപ്പ് ഇക്കോസിസ്റ്റം, പ്രവാസി നിക്ഷേപ പ്രവണതകൾ, റിയൽ എസ്റ്റേറ്റ് വളർച്ച എന്നിവ സംബന്ധിച്ച സമഗ്ര ഡാറ്റയും അനലിറ്റിക്സും.
          </p>
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <AdSlot slotKey="header_banner" />

      {/* Reports Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold font-reading text-text flex items-center gap-2">
            <span>📊</span>
            <span>ലഭ്യമായ ഗവേഷണ റിപ്പോർട്ടുകൾ (Published Reports)</span>
          </h2>
          <span className="text-xs text-text-muted">{reports.length} റിപ്പോർട്ടുകൾ</span>
        </div>

        {loading ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center text-xs text-text-muted">
            റിപ്പോർട്ടുകൾ ലഭ്യമാക്കുന്നു...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-surface border border-border hover:border-accent/40 rounded-xl overflow-hidden shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  {rep.cover_image_url && (
                    <div className="relative aspect-[16/9] bg-surface-raised overflow-hidden">
                      <img
                        src={rep.cover_image_url}
                        alt={rep.title_ml}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
                        {rep.pages_count} പേജുകൾ (PDF)
                      </span>
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-text-muted">
                        തീയതി: {rep.published_date}
                      </span>
                      {rep.is_premium ? (
                        <span className="bg-premium text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          👑 പ്രീമിയം ({rep.price_display})
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded">
                          സൗജന്യം (Free)
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base md:text-lg text-text font-reading leading-snug">
                      {rep.title_ml}
                    </h3>
                    <div className="text-xs text-text-muted font-medium">{rep.title_en}</div>

                    <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                      {rep.summary_ml}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  {rep.is_premium ? (
                    <Link
                      href="/membership"
                      className="w-full block bg-premium hover:opacity-95 text-white font-bold py-2.5 px-4 rounded-lg text-xs text-center transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>👑</span>
                      <span>അൺലോക്ക് ചെയ്യുക ({rep.price_display})</span>
                    </Link>
                  ) : (
                    <a
                      href={rep.download_url}
                      className="w-full block bg-accent hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-lg text-xs text-center transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <span>📥</span>
                      <span>സൗജന്യ PDF ഡൗൺലോഡ് ചെയ്യുക</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
