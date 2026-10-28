import React from 'react';
import Link from 'next/link';
import { newsStore } from '@/lib/data/store';

export default function AdminDashboardPage() {
  const stats = newsStore.getAdminStats();
  const { articles } = newsStore.getArticles({ limit: 8, status: undefined });

  const statCards = [
    { label: 'ആകെ ലേഖനങ്ങൾ (Total)', value: stats.totalArticles, icon: '📰', color: 'text-text' },
    { label: 'പ്രസിദ്ധീകരിച്ചവ (Published)', value: stats.publishedArticles, icon: '✅', color: 'text-success' },
    { label: 'ഡ്രാഫ്റ്റുകൾ (Drafts)', value: stats.draftArticles, icon: '📝', color: 'text-warning' },
    { label: 'പ്രീമിയം സ്റ്റോറികൾ (Premium)', value: stats.premiumArticles, icon: '👑', color: 'text-premium' },
    { label: 'ബിസിനസ്സുകൾ (Directory)', value: stats.businessesCount || 0, icon: '💼', color: 'text-accent' },
    { label: 'സജീവ ജോലികൾ (Jobs)', value: stats.activeJobsCount || 0, icon: '👔', color: 'text-accent' },
    { label: 'പരസ്യ സ്ലോട്ടുകൾ (Active Ads)', value: stats.activeAdsCount || 0, icon: '💰', color: 'text-success' },
    { label: 'പരസ്യ ഇംപ്രഷൻസ് (Impressions)', value: (stats.totalAdImpressions || 0).toLocaleString('en-IN'), icon: '👁️', color: 'text-text-muted' },
    { label: 'പരസ്യ ക്ലിക്കുകൾ (Ad Clicks)', value: (stats.totalAdClicks || 0).toLocaleString('en-IN'), icon: '🖱️', color: 'text-accent' },
  ];

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-surface border border-border rounded-xl p-4 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{card.icon}</span>
              <span className={`text-xl md:text-2xl font-black font-mono ${card.color}`}>
                {card.value}
              </span>
            </div>
            <div className="text-xs text-text-muted font-medium">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions Strip */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
        <h2 className="text-sm font-bold font-reading text-text mb-3">
          എഡിറ്റോറിയൽ &amp; റവന്യൂ കുറുക്കുവഴികൾ (Quick Actions)
        </h2>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <Link
            href="/admin/articles/new"
            className="bg-accent text-white px-3.5 py-2 rounded-lg hover:opacity-90 flex items-center gap-1.5 shadow-sm"
          >
            <span>✨</span>
            <span>പുതിയ വാർത്ത എഴുതുക</span>
          </Link>
          <Link
            href="/admin/ads"
            className="bg-surface-raised border border-border text-text px-3.5 py-2 rounded-lg hover:bg-border flex items-center gap-1.5"
          >
            <span>💰</span>
            <span>പരസ്യങ്ങളും AdSense ഉം</span>
          </Link>
          <Link
            href="/admin/directory"
            className="bg-surface-raised border border-border text-text px-3.5 py-2 rounded-lg hover:bg-border flex items-center gap-1.5"
          >
            <span>💼</span>
            <span>ഡയറക്ടറി മാനേജ് ചെയ്യുക</span>
          </Link>
          <Link
            href="/admin/jobs"
            className="bg-surface-raised border border-border text-text px-3.5 py-2 rounded-lg hover:bg-border flex items-center gap-1.5"
          >
            <span>👔</span>
            <span>ജോബ് ലിസ്റ്റിംഗുകൾ</span>
          </Link>
          <Link
            href="/admin/events"
            className="bg-surface-raised border border-border text-text px-3.5 py-2 rounded-lg hover:bg-border flex items-center gap-1.5"
          >
            <span>🎟️</span>
            <span>ഇവന്റുകൾ &amp; അവാർഡുകൾ</span>
          </Link>
          <Link
            href="/admin/users"
            className="bg-surface-raised border border-border text-text px-3.5 py-2 rounded-lg hover:bg-border flex items-center gap-1.5"
          >
            <span>👥</span>
            <span>സ്റ്റാഫ് അനുമതികൾ (Permissions)</span>
          </Link>
          <Link
            href="/admin/settings"
            className="bg-surface-raised border border-border text-text px-3.5 py-2 rounded-lg hover:bg-border flex items-center gap-1.5"
          >
            <span>⚙️</span>
            <span>സൈറ്റ് സെറ്റിംഗ്സ്</span>
          </Link>
        </div>
      </div>

      {/* Recent Articles Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-bold font-reading text-text">
            സമീപകാല ലേഖനങ്ങൾ (Recent Articles)
          </h2>
          <Link href="/admin/articles" className="text-xs text-accent font-bold hover:underline">
            എല്ലാ ലേഖനങ്ങളും കാണുക →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">തലക്കെട്ട് (Title)</th>
                <th className="py-3 px-4">വിഭാഗം</th>
                <th className="py-3 px-4">സ്റ്റാറ്റസ്</th>
                <th className="py-3 px-4">പ്രീമിയം</th>
                <th className="py-3 px-4 text-right">നടപടി</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-surface-raised/50">
                  <td className="py-3 px-4 max-w-xs truncate font-medium text-text">
                    <Link href={`/admin/articles/${art.id}/edit`} className="hover:text-accent font-reading">
                      {art.title}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-text-muted">
                    {art.category?.name_ml || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      art.status === 'published'
                        ? 'bg-success/10 text-success'
                        : art.status === 'draft'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-surface-raised text-text-muted'
                    }`}>
                      {art.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {art.is_premium ? (
                      <span className="text-premium font-bold">👑 Yes</span>
                    ) : (
                      <span className="text-text-muted">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <Link
                      href={`/article/${art.slug}`}
                      className="text-text-muted hover:text-text font-semibold"
                      target="_blank"
                    >
                      കാണുക ↗
                    </Link>
                    <Link
                      href={`/admin/articles/${art.id}/edit`}
                      className="text-accent hover:underline font-bold"
                    >
                      എഡിറ്റ്
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
