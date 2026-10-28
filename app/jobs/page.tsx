'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { JobListing } from '@/lib/types';
import { AdSlot } from '@/components/AdSlot';

export default function JobsBoardPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState<'all' | 'kerala' | 'gulf'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/v1/jobs')
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs) setJobs(data.jobs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load jobs:', err);
        setLoading(false);
      });
  }, []);

  const filtered = jobs.filter((j) => {
    if (!j.is_active) return false;
    if (filterRegion === 'kerala' && j.is_gulf) return false;
    if (filterRegion === 'gulf' && !j.is_gulf) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        (j.title_ml || j.title || '').toLowerCase().includes(q) ||
        (j.title_en || '').toLowerCase().includes(q) ||
        j.company_name.toLowerCase().includes(q) ||
        (j.district && j.district.toLowerCase().includes(q)) ||
        (j.gulf_country && j.gulf_country.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-emerald-500/15 via-surface to-accent/10 border border-border rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <span>👔</span>
            <span>തൊഴിൽ &amp; റിക്രൂട്ട്മെന്റ് ബോർഡ് (Jobs &amp; Careers)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-reading text-text leading-tight">
            കേരളത്തിലെയും ഗൾഫിലെയും മികച്ച തൊഴിലവസരങ്ങൾ
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            ഫിനാൻസ്, ഐടി, മാനേജ്മെന്റ്, മാർക്കറ്റിംഗ്, എഞ്ചിനീയറിംഗ് മേഖലകളിലെ പരിശോധിച്ചുറപ്പിച്ച ഒഴിവുകൾ നേരിട്ട് അപേക്ഷിക്കാം.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-accent hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-pill text-xs shadow-sm flex items-center gap-1.5"
            >
              <span>📢</span>
              <span>തൊഴിലവസരം പ്രസിദ്ധീകരിക്കുക (Post a Job)</span>
            </button>
            <a
              href="#openings"
              className="bg-surface border border-border hover:bg-surface-raised text-text font-semibold px-4 py-2.5 rounded-pill text-xs"
            >
              ഒഴിവുകൾ പരിശോധിക്കുക ↓
            </a>
          </div>
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <AdSlot slotKey="header_banner" />

      {/* Search & Region Filter Bar */}
      <div id="openings" className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <input
              type="text"
              placeholder="തസ്തിക, കമ്പനി അല്ലെങ്കിൽ നഗരം തിരയുക..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-raised border border-border-input rounded-lg pl-9 pr-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
            />
            <span className="absolute left-3 top-2.5 text-text-muted text-xs">🔍</span>
          </div>

          {/* Region Tabs */}
          <div className="md:col-span-6 flex items-center justify-start md:justify-end gap-1.5 text-xs">
            <button
              onClick={() => setFilterRegion('all')}
              className={`px-3 py-2 rounded-lg font-bold transition-colors ${
                filterRegion === 'all'
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-raised text-text hover:bg-border'
              }`}
            >
              എല്ലാം ({jobs.length})
            </button>
            <button
              onClick={() => setFilterRegion('kerala')}
              className={`px-3 py-2 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                filterRegion === 'kerala'
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-raised text-text hover:bg-border'
              }`}
            >
              <span>🌴</span>
              <span>കേരളം ({jobs.filter((j) => !j.is_gulf).length})</span>
            </button>
            <button
              onClick={() => setFilterRegion('gulf')}
              className={`px-3 py-2 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                filterRegion === 'gulf'
                  ? 'bg-accent text-white shadow-sm'
                  : 'bg-surface-raised text-text hover:bg-border'
              }`}
            >
              <span>🌍</span>
              <span>ഗൾഫ് / NRI ({jobs.filter((j) => j.is_gulf).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Job Cards List */}
      {loading ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center text-xs text-text-muted">
          തൊഴിലവസരങ്ങൾ ലഭ്യമാക്കുന്നു...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center space-y-2">
          <span className="text-3xl">💼</span>
          <h3 className="font-bold text-text font-reading">ഒഴിവുകൾ കണ്ടെത്താനായില്ല</h3>
          <p className="text-xs text-text-muted">തിരഞ്ഞെടുത്ത മാനദണ്ഡങ്ങൾ മാറ്റി വീണ്ടും ശ്രമിക്കുക.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="bg-surface border border-border hover:border-accent/40 rounded-xl p-5 shadow-card transition-all space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-black text-base md:text-lg text-text font-reading">
                      {job.title_ml}
                    </h3>
                    {job.is_gulf && (
                      <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded">
                        ഗൾഫ് തൊഴിൽ
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-text-muted font-medium flex items-center space-x-2">
                    <span className="font-bold text-text">{job.company_name}</span>
                    <span>•</span>
                    <span className="font-mono">{job.title_en}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm md:text-base font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {job.salary_range}
                  </div>
                  <div className="text-[11px] text-text-muted font-mono">{job.job_type}</div>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                {job.description_ml}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border text-xs">
                <div className="flex items-center space-x-3 text-text-muted">
                  <span className="flex items-center gap-1 font-medium">
                    <span>{job.is_gulf ? '🌍' : '📍'}</span>
                    <span>{job.is_gulf ? job.gulf_country : `കേരളം (${job.district})`}</span>
                  </span>
                  <span>•</span>
                  <span className="text-[11px]">തീയതി: {job.posted_date}</span>
                </div>

                <a
                  href={job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg text-xs transition-opacity flex items-center gap-1"
                >
                  <span>നേരിട്ട് അപേക്ഷിക്കുക</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post a Job Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold font-reading text-base text-text">
                തൊഴിലവസരം പ്രസിദ്ധീകരിക്കുക (Post a Vacancy)
              </h3>
              <button onClick={() => setShowPostModal(false)} className="text-text-muted hover:text-text text-lg">
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <span className="text-4xl">🎉</span>
                <h4 className="font-bold text-text font-reading text-base">തൊഴിൽ വിവരങ്ങൾ ലഭിച്ചു!</h4>
                <p className="text-xs text-text-muted">
                  ഞങ്ങളുടെ റിക്രൂട്ട്മെന്റ് ഡെസ്ക് തൊഴിൽ വിവരങ്ങൾ പരിശോധിച്ച ശേഷം പ്രസിദ്ധീകരിക്കുന്നതാണ്.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setShowPostModal(false);
                  }}
                  className="bg-accent text-white px-5 py-2 rounded-lg text-xs font-bold"
                >
                  ശരി
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block font-bold text-text mb-1">തസ്തിക (Job Title)</label>
                  <input
                    type="text"
                    required
                    placeholder="ഉദാ: ഫിനാൻഷ്യൽ അനലിസ്റ്റ്"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">കമ്പനി നാമം</label>
                    <input
                      type="text"
                      required
                      placeholder="കമ്പനി പേര്"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-text mb-1">ശമ്പള നിരക്ക്</label>
                    <input
                      type="text"
                      required
                      placeholder="₹6,00,000 - ₹9,00,000"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">തൊഴിൽ സ്ഥലം</label>
                    <input
                      type="text"
                      required
                      placeholder="കൊച്ചി / ദുബായ്"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-text mb-1">അപേക്ഷാ ഇമെയിൽ / ലിങ്ക്</label>
                    <input
                      type="text"
                      required
                      placeholder="hr@company.com"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-mono"
                    />
                  </div>
                </div>

                <div className="bg-surface-raised p-3 rounded-lg border border-border space-y-1">
                  <div className="font-bold text-text text-[11px]">ലിസ്റ്റിംഗ് നിരക്ക്:</div>
                  <div className="text-[10px] text-text-muted">
                    ഒരു മാസത്തേക്ക് സ്റ്റാൻഡേർഡ് ലിസ്റ്റിംഗ്: ₹1,500 | ഫീച്ചേർഡ് പ്രയോറിറ്റി ലിസ്റ്റിംഗ്: ₹3,500
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowPostModal(false)}
                    className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-border text-text font-semibold"
                  >
                    റദ്ദാക്കുക
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-accent hover:opacity-90 text-white font-bold"
                  >
                    പോസ്റ്റ് ചെയ്യുക
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
