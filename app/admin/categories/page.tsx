'use client';

import React, { useState, useEffect } from 'react';
import { Category } from '@/lib/types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form State
  const [nameMl, setNameMl] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNav, setShowInNav] = useState(false);
  const [isPremiumSection, setIsPremiumSection] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const loadCategories = () => {
    setLoading(true);
    fetch('/api/v1/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setNameMl(cat.name_ml);
    setNameEn(cat.name_en);
    setSlug(cat.slug);
    setParentId(cat.parent_id || '');
    setSortOrder(cat.sort_order);
    setShowInNav(cat.show_in_nav);
    setIsPremiumSection(cat.is_premium_section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setEditingCategory(null);
    setNameMl('');
    setNameEn('');
    setSlug('');
    setParentId('');
    setSortOrder(categories.length);
    setShowInNav(false);
    setIsPremiumSection(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameMl.trim() || !nameEn.trim() || !slug.trim()) return;

    setStatusMessage('സേവ് ചെയ്യുന്നു...');
    try {
      const res = await fetch('/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory?.id,
          name_ml: nameMl.trim(),
          name_en: nameEn.trim(),
          slug: slug.trim().toLowerCase(),
          parent_id: parentId || null,
          sort_order: Number(sortOrder) || 0,
          show_in_nav: showInNav,
          is_premium_section: isPremiumSection
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage('വിഭാഗം വിജയകരമായി സേവ് ചെയ്തു!');
        handleReset();
        loadCategories();
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } catch {
      setStatusMessage('പിഴവ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" വിഭാഗം നീക്കം ചെയ്യണമെന്ന് ഉറപ്പാണോ?`)) return;
    try {
      const res = await fetch(`/api/v1/categories?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        loadCategories();
      }
    } catch {
      alert('വിഭാഗം നീക്കം ചെയ്യാൻ സാധിച്ചില്ല.');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-reading text-text">
          വാർത്താ വിഭാഗങ്ങളുടെ മാനേജ്മെന്റ് (Category Management)
        </h1>
        <p className="text-xs text-text-muted">
          37 കാറ്റഗറികളും അവയുടെ മാതൃ-ഉപവിഭാഗ ബന്ധങ്ങളും ഇവിടെ എഡിറ്റ് ചെയ്യാം.
        </p>
      </div>

      {/* Category Editor / Creator Form */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
        <h2 className="text-sm font-bold font-reading text-text mb-4 border-b border-border pb-2">
          {editingCategory ? `വിഭാഗം തിരുത്തുക: ${editingCategory.name_ml}` : 'പുതിയ വിഭാഗം ചേർക്കുക (Add Category)'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">മലയാളം പേര് (Malayalam Name) *</label>
              <input
                type="text"
                required
                value={nameMl}
                onChange={(e) => setNameMl(e.target.value)}
                placeholder="ഉദാ: സ്റ്റാർട്ടപ്പ്"
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">ഇംഗ്ലീഷ് പേര് (English Name) *</label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => {
                  setNameEn(e.target.value);
                  if (!editingCategory && !slug) {
                    setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="e.g. Startups"
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">URL സ്ലഗ്ഗ് (Slug) *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="startups"
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs font-mono text-text focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">മാതൃ വിഭാഗം (Parent Category):</label>
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
              >
                <option value="">-- പ്രധാന വിഭാഗം (None / Top-level) --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_ml} ({c.name_en})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-text block mb-1">ക്രമ നമ്പർ (Sort Order):</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10))}
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={showInNav}
                onChange={(e) => setShowInNav(e.target.checked)}
                className="rounded text-accent"
              />
              <span>ടോപ്പ് ബാർ മെനുവിൽ കാണിക്കുക (Show in Nav)</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={isPremiumSection}
                onChange={(e) => setIsPremiumSection(e.target.checked)}
                className="rounded text-accent"
              />
              <span className="text-premium">👑 പ്രീമിയം വിഭാഗം (Premium Only)</span>
            </label>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            {statusMessage ? (
              <span className="text-xs text-success font-bold">{statusMessage}</span>
            ) : <span />}

            <div className="space-x-2">
              {editingCategory && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-surface-raised border border-border text-text px-4 py-1.5 rounded text-xs font-semibold hover:bg-border"
                >
                  റദ്ദാക്കുക (Cancel)
                </button>
              )}
              <button
                type="submit"
                className="bg-accent text-white px-5 py-1.5 rounded text-xs font-bold hover:opacity-90 transition-all shadow-sm"
              >
                {editingCategory ? 'അപ്ഡേറ്റ് ചെയ്യുക' : 'വിഭാഗം ചേർക്കുക'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Category Tree Hierarchy List */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        <h2 className="text-sm font-bold font-reading text-text border-b border-border pb-2">
          നിലവിലുള്ള വിഭാഗങ്ങളുടെ ഘടന (Hierarchy Tree)
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">വിഭാഗങ്ങൾ ലോഡ് ചെയ്യുന്നു...</div>
        ) : (
          <div className="space-y-4">
            {categories.map((parent) => (
              <div key={parent.id} className="border border-border rounded-lg p-3 bg-surface-raised">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-sm text-text font-reading">
                      {parent.is_premium_section && '👑 '}
                      {parent.name_ml}
                    </span>
                    <span className="text-xs text-text-muted font-mono">
                      ({parent.name_en} / {parent.slug})
                    </span>
                    {parent.show_in_nav && (
                      <span className="bg-accent/10 text-accent text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Nav
                      </span>
                    )}
                  </div>

                  <div className="space-x-2 text-xs">
                    <button
                      onClick={() => handleEdit(parent)}
                      className="text-accent hover:underline font-bold"
                    >
                      എഡിറ്റ്
                    </button>
                    <button
                      onClick={() => handleDelete(parent.id, parent.name_ml)}
                      className="text-danger hover:underline font-semibold"
                    >
                      നീക്കുക
                    </button>
                  </div>
                </div>

                {/* Sub-categories */}
                {parent.children && parent.children.length > 0 && (
                  <div className="mt-3 pl-4 border-l-2 border-border/80 space-y-2">
                    {parent.children.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between py-1 px-2.5 bg-surface rounded text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-text font-medium font-reading">↳ {sub.name_ml}</span>
                          <span className="text-text-muted font-mono text-[11px]">
                            ({sub.name_en} / {sub.slug})
                          </span>
                        </div>
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="text-accent hover:underline font-semibold"
                          >
                            എഡിറ്റ്
                          </button>
                          <button
                            onClick={() => handleDelete(sub.id, sub.name_ml)}
                            className="text-danger hover:underline font-semibold"
                          >
                            നീക്കുക
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
