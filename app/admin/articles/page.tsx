'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article, Category } from '@/lib/types';

export default function AdminArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchArticles = () => {
    setLoading(true);
    let url = `/api/v1/articles?limit=100&status=${statusFilter || 'all'}`;
    if (categoryFilter) url += `&category=${categoryFilter}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.articles) setArticles(data.articles);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch('/api/v1/categories?flat=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [statusFilter, categoryFilter]);

  const handlePinHero = async (articleId: string, title: string) => {
    try {
      const res = await fetch('/api/v1/home-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_key: 'hero', position: 0, article_id: articleId })
      });
      const data = await res.json();
      if (data.success) {
        alert(`"${title.slice(0, 30)}..." വിജയകരമായി ഹോം പേജിലെ പ്രധാന വാർത്തയായി (Hero Story) മാറ്റി!`);
      }
    } catch {
      alert('ഹീറോ സ്ലോട്ട് മാറ്റുന്നതിൽ പിഴവ് സംഭവിച്ചു.');
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('ഈ ലേഖനം പൂർണ്ണമായി നീക്കം ചെയ്യണമെന്ന് ഉറപ്പാണോ?')) return;
    try {
      const res = await fetch(`/api/v1/articles/${slug}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => prev.filter(a => a.slug !== slug));
      }
    } catch {
      alert('ലേഖനം നീക്കം ചെയ്യാൻ സാധിച്ചില്ല.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-reading text-text">
            ലേഖനങ്ങളുടെ പട്ടിക (Articles Management)
          </h1>
          <p className="text-xs text-text-muted">
            എല്ലാ ഡ്രാഫ്റ്റുകളും പ്രസിദ്ധീകരിച്ച വാർത്തകളും ഇവിടെ നിയന്ത്രിക്കാം.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="bg-accent text-white font-bold text-xs px-4 py-2 rounded-lg hover:opacity-90 flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
        >
          <span>✨</span>
          <span>പുതിയ ലേഖനം</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="തലക്കെട്ടിൽ തിരയുക..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchArticles()}
            className="bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text min-w-[200px]"
          />
          <button
            onClick={fetchArticles}
            className="bg-surface-raised border border-border text-text hover:bg-border text-xs font-semibold px-3 py-1.5 rounded"
          >
            തിരയുക
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
          >
            <option value="">എല്ലാ സ്റ്റാറ്റസും (All Status)</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="in_review">In Review</option>
            <option value="scheduled">Scheduled</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text max-w-[160px] truncate"
          >
            <option value="">എല്ലാ വിഭാഗങ്ങളും</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name_ml}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-10 text-center text-xs text-text-muted">ലേഖനങ്ങൾ ലോഡ് ചെയ്യുന്നു...</div>
        ) : articles.length === 0 ? (
          <div className="p-10 text-center text-xs text-text-muted">
            ലേഖനങ്ങൾ ഒന്നും കണ്ടെത്താനായില്ല.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">തലക്കെട്ട്</th>
                  <th className="py-3 px-4">വിഭാഗം</th>
                  <th className="py-3 px-4">തീയതി</th>
                  <th className="py-3 px-4">സ്റ്റാറ്റസ്</th>
                  <th className="py-3 px-4">ടൈപ്പ്</th>
                  <th className="py-3 px-4 text-right">നടപടികൾ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-surface-raised/50">
                    <td className="py-3 px-4 max-w-sm truncate font-medium text-text">
                      <Link href={`/admin/articles/${art.id}/edit`} className="hover:text-accent font-reading">
                        {art.title}
                      </Link>
                      <span className="block text-[10px] text-text-muted font-mono truncate">
                        /{art.slug}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-text-muted">
                      <div>{art.category?.name_ml || '-'}</div>
                      {art.district && (
                        <span className="inline-block mt-0.5 text-[9px] bg-accent/10 text-accent font-semibold px-1.5 py-0.5 rounded">
                          📍 {art.district}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-text-muted text-[11px] whitespace-nowrap">
                      {new Date(art.published_at).toLocaleDateString('ml-IN', {
                        month: 'short',
                        day: 'numeric'
                      })}
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
                    <td className="py-3 px-4 whitespace-nowrap">
                      {art.is_premium ? (
                        <span className="text-premium font-bold">👑 Premium</span>
                      ) : (
                        <span className="text-text-muted">Free</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap space-x-2">
                      {art.status === 'published' && (
                        <button
                          type="button"
                          onClick={() => handlePinHero(art.id, art.title)}
                          title="ഹോം പേജിലെ പ്രധാന വാർത്തയാക്കുക"
                          className="bg-accent/10 text-accent hover:bg-accent hover:text-white px-2 py-0.5 rounded text-[10px] font-bold transition-colors inline-block"
                        >
                          📌 Hero
                        </button>
                      )}
                      <Link
                        href={`/article/${art.slug}`}
                        className="text-text-muted hover:text-text font-semibold inline-block"
                        target="_blank"
                      >
                        കാണുക
                      </Link>
                      <Link
                        href={`/admin/articles/${art.id}/edit`}
                        className="text-accent hover:underline font-bold inline-block"
                      >
                        എഡിറ്റ്
                      </Link>
                      <button
                        onClick={() => handleDelete(art.slug)}
                        className="text-danger hover:underline font-semibold inline-block"
                      >
                        നീക്കുക
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
