'use client';

import React, { useState, useEffect } from 'react';
import { JobListing } from '@/lib/types';

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRegion, setFilterRegion] = useState<'all' | 'kerala' | 'gulf'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newJob, setNewJob] = useState<Partial<JobListing>>({
    title_ml: '',
    title_en: '',
    company_name: '',
    district: 'എറണാകുളം',
    is_gulf: false,
    gulf_country: '',
    salary_range: '',
    job_type: 'Full-time',
    apply_url: '',
    description_ml: '',
    is_active: true,
  });

  const fetchJobs = () => {
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
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleActive = async (id: string, current: boolean) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, is_active: !current } : j))
    );

    try {
      await fetch('/api/v1/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !current }),
      });
    } catch (err) {
      console.error('Failed to toggle job status:', err);
      fetchJobs();
    }
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/v1/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewJob({
          title_ml: '',
          title_en: '',
          company_name: '',
          district: 'എറണാകുളം',
          is_gulf: false,
          gulf_country: '',
          salary_range: '',
          job_type: 'Full-time',
          apply_url: '',
          description_ml: '',
          is_active: true,
        });
        fetchJobs();
      }
    } catch (err) {
      console.error('Failed to add job:', err);
      alert('തൊഴിൽ അവസരം ചേർക്കുന്നതിൽ പിശക് സംഭവിച്ചു.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = jobs.filter((j) => {
    if (filterRegion === 'kerala') return !j.is_gulf;
    if (filterRegion === 'gulf') return j.is_gulf;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black font-reading text-text flex items-center gap-2">
            <span>👔</span>
            <span>തൊഴിൽ &amp; റിക്രൂട്ട്മെന്റ് ബോർഡ് (Jobs &amp; Recruitment)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            കേരളത്തിലെയും ഗൾഫ് നാടുകളിലെയും മികച്ച തൊഴിലവസരങ്ങൾ ലിസ്റ്റ് ചെയ്തു വരുമാനം കണ്ടെത്തുക.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-accent hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm flex items-center space-x-1.5"
        >
          <span>✨</span>
          <span>+ പുതിയ തൊഴിലവസരം ചേർക്കുക</span>
        </button>
      </div>

      {/* Region Filter */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-text-muted font-bold">മേഖല:</span>
        <button
          onClick={() => setFilterRegion('all')}
          className={`px-3 py-1 rounded-pill font-semibold transition-colors ${
            filterRegion === 'all'
              ? 'bg-accent text-white'
              : 'bg-surface border border-border text-text hover:bg-surface-raised'
          }`}
        >
          എല്ലാം ({jobs.length})
        </button>
        <button
          onClick={() => setFilterRegion('kerala')}
          className={`px-3 py-1 rounded-pill font-semibold transition-colors ${
            filterRegion === 'kerala'
              ? 'bg-accent text-white'
              : 'bg-surface border border-border text-text hover:bg-surface-raised'
          }`}
        >
          🌴 കേരളം ({jobs.filter((j) => !j.is_gulf).length})
        </button>
        <button
          onClick={() => setFilterRegion('gulf')}
          className={`px-3 py-1 rounded-pill font-semibold transition-colors ${
            filterRegion === 'gulf'
              ? 'bg-accent text-white'
              : 'bg-surface border border-border text-text hover:bg-surface-raised'
          }`}
        >
          🌍 ഗൾഫ് / NRI ({jobs.filter((j) => j.is_gulf).length})
        </button>
      </div>

      {/* Jobs Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">ഡാറ്റ ലഭ്യമാക്കുന്നു...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">തസ്തിക (Job Title)</th>
                  <th className="py-3 px-3">കമ്പനി</th>
                  <th className="py-3 px-3">സ്ഥലം / രാജ്യം</th>
                  <th className="py-3 px-3">ശമ്പള നിരക്ക്</th>
                  <th className="py-3 px-3">തരം</th>
                  <th className="py-3 px-4 text-right">സ്റ്റാറ്റസ്</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-text font-reading">{job.title_ml}</div>
                      <div className="text-[11px] text-text-muted">{job.title_en}</div>
                    </td>

                    <td className="py-3 px-3 text-text font-semibold">{job.company_name}</td>

                    <td className="py-3 px-3 text-text-muted">
                      {job.is_gulf ? (
                        <span className="text-amber-600 dark:text-amber-400 font-bold">
                          🌍 {job.gulf_country}
                        </span>
                      ) : (
                        <span>🌴 {job.district}</span>
                      )}
                    </td>

                    <td className="py-3 px-3 font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {job.salary_range}
                    </td>

                    <td className="py-3 px-3">
                      <span className="bg-surface-raised border border-border px-2 py-0.5 rounded text-[10px] font-medium text-text">
                        {job.job_type}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleToggleActive(job.id, !!job.is_active)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                          job.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        {job.is_active ? 'Active (സജീവം)' : 'Closed'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold font-reading text-base text-text">
                പുതിയ തൊഴിലവസരം ചേർക്കുക (Post a Job)
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddJob} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">തസ്തിക (മലയാളം)</label>
                  <input
                    type="text"
                    required
                    value={newJob.title_ml}
                    onChange={(e) => setNewJob({ ...newJob, title_ml: e.target.value })}
                    placeholder="ഉദാ: ചീഫ് ഫിനാൻഷ്യൽ ഓഫീസർ"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-reading"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">Job Title (English)</label>
                  <input
                    type="text"
                    required
                    value={newJob.title_en}
                    onChange={(e) => setNewJob({ ...newJob, title_en: e.target.value })}
                    placeholder="Chief Financial Officer"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">കമ്പനി നാമം</label>
                  <input
                    type="text"
                    required
                    value={newJob.company_name}
                    onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                    placeholder="കമ്പനി പേര്"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">ശമ്പള നിരക്ക് (Salary)</label>
                  <input
                    type="text"
                    required
                    value={newJob.salary_range}
                    onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                    placeholder="₹15,00,000 - ₹20,00,000/yr അല്ലെങ്കിൽ AED 12,000/mo"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-mono"
                  />
                </div>
              </div>

              <div className="bg-surface-raised p-3 rounded-lg border border-border space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-text">
                  <input
                    type="checkbox"
                    checked={newJob.is_gulf}
                    onChange={(e) => setNewJob({ ...newJob, is_gulf: e.target.checked })}
                    className="rounded text-accent focus:ring-accent"
                  />
                  <span>ഇതൊരു ഗൾഫ് / NRI തൊഴിലവസരമാണ് (Gulf Opening)</span>
                </label>

                {newJob.is_gulf ? (
                  <div>
                    <label className="block text-[11px] font-bold text-text mb-1">ഗൾഫ് രാജ്യം / നഗരം</label>
                    <select
                      value={newJob.gulf_country}
                      onChange={(e) => setNewJob({ ...newJob, gulf_country: e.target.value })}
                      className="w-full bg-surface border border-border-input rounded px-2.5 py-1.5 text-xs text-text"
                    >
                      <option value="ദുബായ്, യുഎഇ">ദുബായ്, യുഎഇ (Dubai, UAE)</option>
                      <option value="അബുദാബി, യുഎഇ">അബുദാബി, യുഎഇ (Abu Dhabi, UAE)</option>
                      <option value="റിയാദ്, സൗദി അറേബ്യ">റിയാദ്, സൗദി അറേബ്യ (Riyadh, KSA)</option>
                      <option value="ദോഹ, ഖത്തർ">ദോഹ, ഖത്തർ (Doha, Qatar)</option>
                      <option value="മസ്കറ്റ്, ഒമാൻ">മസ്കറ്റ്, ഒമാൻ (Muscat, Oman)</option>
                      <option value="കുവൈത്ത് സിറ്റി">കുവൈത്ത് സിറ്റി (Kuwait City)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-text mb-1">കേരളത്തിലെ ജില്ല</label>
                    <select
                      value={newJob.district}
                      onChange={(e) => setNewJob({ ...newJob, district: e.target.value })}
                      className="w-full bg-surface border border-border-input rounded px-2.5 py-1.5 text-xs text-text"
                    >
                      {['എറണാകുളം (കൊച്ചി)', 'തിരുവനന്തപുരം (ടെക്നോപാർക്ക്)', 'കോഴിക്കോട് (സൈബർപാർക്ക്)', 'തൃശ്ശൂർ', 'കണ്ണൂർ', 'മലപ്പുറം', 'കോട്ടയം', 'പാലക്കാട്', 'കൊല്ലം'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-text mb-1">അപേക്ഷിക്കാനുള്ള ലിങ്ക് അല്ലെങ്കിൽ ഇമെയിൽ (Apply URL)</label>
                <input
                  type="text"
                  required
                  value={newJob.apply_url}
                  onChange={(e) => setNewJob({ ...newJob, apply_url: e.target.value })}
                  placeholder="https://company.com/careers അല്ലെങ്കിൽ mailto:careers@company.com"
                  className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-border text-text font-semibold"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-accent hover:opacity-90 text-white font-bold"
                >
                  {saving ? 'പോസ്റ്റ് ചെയ്യുന്നു...' : 'പ്രസിദ്ധീകരിക്കുക'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
