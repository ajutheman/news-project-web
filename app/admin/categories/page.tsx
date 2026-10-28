'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Category } from '@/lib/types';

type FormMode = 'main' | 'sub' | 'edit';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Form Fields
  const [nameMl, setNameMl] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [parentId, setParentId] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [showInNav, setShowInNav] = useState(false);
  const [isPremiumSection, setIsPremiumSection] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedParents, setCollapsedParents] = useState<Record<string, boolean>>({});

  const loadCategories = () => {
    setLoading(true);
    fetch('/api/v1/categories')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showNotification('വിഭാഗങ്ങൾ ലോഡ് ചെയ്യാൻ സാധിച്ചില്ല.', 'error');
      });
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // List of top-level main categories for parent selection
  const mainCategories = useMemo(() => {
    return categories.filter(c => !c.parent_id);
  }, [categories]);

  // Open Form for Adding a Main Category
  const openAddMainCategory = () => {
    setEditingCategory(null);
    setFormMode('main');
    setNameMl('');
    setNameEn('');
    setSlug('');
    setParentId(''); // No parent = Main category
    setSortOrder(mainCategories.length + 1);
    setShowInNav(false);
    setIsPremiumSection(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Form for Adding a Sub Category (optionally under a pre-selected parent)
  const openAddSubCategory = (preselectedParentId?: string) => {
    setEditingCategory(null);
    setFormMode('sub');
    setNameMl('');
    setNameEn('');
    setSlug('');
    setParentId(preselectedParentId || (mainCategories[0]?.id || ''));
    setSortOrder(1);
    setShowInNav(false);
    setIsPremiumSection(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Form for Editing an existing category
  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormMode('edit');
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
    setFormMode(null);
    setEditingCategory(null);
    setNameMl('');
    setNameEn('');
    setSlug('');
    setParentId('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameMl.trim() || !nameEn.trim() || !slug.trim()) {
      showNotification('മലയാളം പേര്, ഇംഗ്ലീഷ് പേര്, സ്ലഗ്ഗ് എന്നിവ നൽകുക', 'error');
      return;
    }

    if (formMode === 'sub' && !parentId) {
      showNotification('ദയവായി ഒരു മാതൃ പ്രധാന വിഭാഗം (Parent Category) തിരഞ്ഞെടുക്കുക', 'error');
      return;
    }

    try {
      const finalParentId = formMode === 'main' ? null : (parentId || null);

      const res = await fetch('/api/v1/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory?.id,
          name_ml: nameMl.trim(),
          name_en: nameEn.trim(),
          slug: slug.trim().toLowerCase(),
          parent_id: finalParentId,
          sort_order: Number(sortOrder) || 0,
          show_in_nav: showInNav,
          is_premium_section: isPremiumSection
        })
      });
      const data = await res.json();
      if (data.success) {
        showNotification(
          editingCategory
            ? 'വിഭാഗം വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!'
            : formMode === 'main'
            ? 'പുതിയ പ്രധാന വിഭാഗം വിജയകരമായി ചേർത്തു!'
            : 'പുതിയ ഉപവിഭാഗം വിജയകരമായി ചേർത്തു!'
        );
        handleReset();
        loadCategories();
      } else {
        showNotification(data.error || 'സേവ് ചെയ്യാൻ സാധിച്ചില്ല', 'error');
      }
    } catch {
      showNotification('പിഴവ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.', 'error');
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
        showNotification(`"${name}" നീക്കം ചെയ്തു!`);
        loadCategories();
      } else {
        showNotification(data.error || 'നീക്കം ചെയ്യാൻ സാധിച്ചില്ല', 'error');
      }
    } catch {
      showNotification('വിഭാഗം നീക്കം ചെയ്യാൻ സാധിച്ചില്ല.', 'error');
    }
  };

  const toggleCollapse = (id: string) => {
    setCollapsedParents(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories
      .map(parent => {
        const matchesParent =
          parent.name_ml.includes(query) ||
          parent.name_en.toLowerCase().includes(query) ||
          parent.slug.toLowerCase().includes(query);

        const matchingChildren = (parent.children || []).filter(
          child =>
            child.name_ml.includes(query) ||
            child.name_en.toLowerCase().includes(query) ||
            child.slug.toLowerCase().includes(query)
        );

        if (matchesParent) {
          return parent;
        } else if (matchingChildren.length > 0) {
          return {
            ...parent,
            children: matchingChildren
          };
        }
        return null;
      })
      .filter(Boolean) as Category[];
  }, [categories, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header and Quick Add Buttons */}
      <div className="border-b border-border pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-reading text-text flex items-center gap-2">
            <span>🗂️</span>
            <span>വാർത്താ വിഭാഗങ്ങളുടെ മാനേജ്മെന്റ് (Category Management)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            പ്രധാന വിഭാഗങ്ങളും (Main Categories) ഉപവിഭാഗങ്ങളും (Sub-Categories) വെബ്സൈറ്റിൽ തത്സമയം ചേർക്കാനും എഡിറ്റ് ചെയ്യാനും സാധിക്കും.
          </p>
        </div>

        {/* Dedicated Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openAddMainCategory}
            className="bg-accent hover:opacity-90 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>✨ + പുതിയ പ്രധാന വിഭാഗം (Add Main)</span>
          </button>

          <button
            onClick={() => openAddSubCategory()}
            className="bg-surface border-2 border-accent text-accent hover:bg-accent/10 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>↳ + പുതിയ ഉപവിഭാഗം (Add Sub)</span>
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div
          className={`text-xs font-bold p-3 rounded-lg shadow-sm flex items-center justify-between ${
            statusMessage.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'
          }`}
        >
          <span>{statusMessage.type === 'success' ? '✓' : '⚠'} {statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="text-white hover:opacity-80">
            ×
          </button>
        </div>
      )}

      {/* Category Editor / Creator Form */}
      {formMode && (
        <div className="bg-surface border-2 border-accent/40 rounded-xl p-5 shadow-card animate-fadeIn">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
            <div>
              <h2 className="text-base font-bold font-reading text-text flex items-center gap-2">
                {formMode === 'main' && (
                  <>
                    <span>✨</span>
                    <span>പുതിയ പ്രധാന വിഭാഗം ചേർക്കുക (New Main Category)</span>
                  </>
                )}
                {formMode === 'sub' && (
                  <>
                    <span>↳</span>
                    <span>പുതിയ ഉപവിഭാഗം ചേർക്കുക (New Sub-Category)</span>
                  </>
                )}
                {formMode === 'edit' && (
                  <>
                    <span>✏️</span>
                    <span>
                      വിഭാഗം തിരുത്തുക: {editingCategory?.name_ml} ({editingCategory?.parent_id ? 'ഉപവിഭാഗം' : 'പ്രധാന വിഭാഗം'})
                    </span>
                  </>
                )}
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                {formMode === 'main' && 'ഈ വിഭാഗം ഒരു ഉയർന്ന തലത്തിലുള്ള (Top-Level) പ്രധാന കാറ്റഗറിയായിരിക്കും.'}
                {formMode === 'sub' && 'തിരഞ്ഞെടുത്ത പ്രധാന വിഭാഗത്തിന് കീഴിലുള്ള ഒരു ഉപവിഭാഗമായി (Sub-Category) ഇത് മാറും.'}
                {formMode === 'edit' && 'വിഭാഗത്തിന്റെ വിവരങ്ങളിൽ മാറ്റം വരുത്തുക.'}
              </p>
            </div>

            <button
              onClick={handleReset}
              className="text-text-muted hover:text-text text-sm font-bold p-1"
            >
              ✕ റദ്ദാക്കുക
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* If Sub-category or Editing, specify parent */}
            {(formMode === 'sub' || formMode === 'edit') && (
              <div className="bg-surface-raised/70 border border-border p-3.5 rounded-lg">
                <label className="text-xs font-bold text-text block mb-1">
                  മാതൃ പ്രധാന വിഭാഗം (Parent Main Category) *
                </label>
                <select
                  required={formMode === 'sub'}
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full bg-surface border border-border-input rounded px-3 py-2 text-xs font-semibold text-text focus:outline-none focus:border-accent"
                >
                  {formMode === 'edit' && (
                    <option value="">-- പ്രധാന വിഭാഗം (Top-Level / No Parent) --</option>
                  )}
                  {formMode === 'sub' && (
                    <option value="" disabled>-- ഏത് പ്രധാന വിഭാഗത്തിന് കീഴിലാണ്? തിരഞ്ഞെടുക്കുക --</option>
                  )}
                  {mainCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      🏷️ {c.name_ml} ({c.name_en})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-text-muted mt-1 block">
                  {formMode === 'sub'
                    ? 'ഈ ഉപവിഭാഗം മുകളിൽ തിരഞ്ഞെടുത്ത പ്രധാന കാറ്റഗറിയുടെ കീഴിൽ ദൃശ്യമാകും.'
                    : 'പ്രധാന വിഭാഗമാക്കണമെങ്കിൽ "Top-Level" തിരഞ്ഞെടുക്കുക.'}
                </span>
              </div>
            )}

            {formMode === 'main' && (
              <div className="bg-accent/5 border border-accent/20 px-3.5 py-2.5 rounded-lg text-xs text-accent font-semibold flex items-center gap-2">
                <span>🏷️</span>
                <span>ഇതൊരു ഉയർന്ന തലത്തിലുള്ള പ്രധാന വിഭാഗമായിരിക്കും (Top-Level Category).</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  മലയാളം പേര് (Malayalam Name) *
                </label>
                <input
                  type="text"
                  required
                  value={nameMl}
                  onChange={(e) => setNameMl(e.target.value)}
                  placeholder="ഉദാ: വിപണി, സ്റ്റാർട്ടപ്പ്"
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-xs text-text font-reading focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  ഇംഗ്ലീഷ് പേര് (English Name) *
                </label>
                <input
                  type="text"
                  required
                  value={nameEn}
                  onChange={(e) => {
                    setNameEn(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
                    }
                  }}
                  placeholder="e.g. Markets, Startups"
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  URL സ്ലഗ്ഗ് (Slug) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, '-'))}
                  placeholder="markets"
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-xs font-mono text-text focus:outline-none focus:border-accent"
                />
                <span className="text-[10px] text-text-muted block mt-0.5">
                  /topic/{slug || 'example'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div>
                <label className="text-xs font-bold text-text block mb-1">ക്രമ നമ്പർ (Sort Order):</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div className="sm:col-span-2 flex flex-wrap gap-4 pt-4 sm:pt-0">
                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showInNav}
                    onChange={(e) => setShowInNav(e.target.checked)}
                    className="rounded text-accent focus:ring-accent"
                  />
                  <span>ടോപ്പ് ബാർ മെനുവിൽ കാണിക്കുക (Show in Nav)</span>
                </label>

                <label className="flex items-center space-x-2 text-xs font-semibold cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPremiumSection}
                    onChange={(e) => setIsPremiumSection(e.target.checked)}
                    className="rounded text-accent focus:ring-accent"
                  />
                  <span className="text-premium">👑 പ്രീമിയം വിഭാഗം (Premium Only)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={handleReset}
                className="bg-surface-raised border border-border text-text px-4 py-2 rounded text-xs font-semibold hover:bg-border transition-colors"
              >
                റദ്ദാക്കുക
              </button>
              <button
                type="submit"
                className="bg-accent text-white px-6 py-2 rounded text-xs font-bold hover:opacity-90 transition-all shadow-sm"
              >
                {editingCategory ? 'അപ്ഡേറ്റ് ചെയ്യുക' : 'വിഭാഗം സേവ് ചെയ്യുക'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Tree & Hierarchy Section */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        {/* Search and Tree Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="text-sm font-bold font-reading text-text flex items-center gap-2">
              <span>🌳</span>
              <span>വിഭാഗങ്ങളുടെ ഘടന (Categories Hierarchy Tree)</span>
            </h2>
            <span className="text-[11px] text-text-muted">
              ആകെ പ്രധാന വിഭാഗങ്ങൾ: {mainCategories.length} | മൊത്തം വിഭാഗങ്ങൾ: {categories.reduce((acc, c) => acc + 1 + (c.children?.length || 0), 0)}
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="വിഭാഗം തിരയുക (മലയാളം, English, Slug)..."
              className="w-full bg-surface-raised border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
            />
            <span className="absolute left-2.5 top-1.5 text-text-muted text-xs">🔍</span>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-text-muted">വിഭാഗങ്ങൾ ലോഡ് ചെയ്യുന്നു...</div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">വിഭാഗങ്ങൾ ഒന്നും കണ്ടെത്തിയില്ല.</div>
        ) : (
          <div className="space-y-3">
            {filteredCategories.map((parent) => {
              const isCollapsed = !!collapsedParents[parent.id];
              const childCount = parent.children?.length || 0;

              return (
                <div
                  key={parent.id}
                  className="border border-border rounded-xl overflow-hidden bg-surface-raised/40 transition-colors hover:border-accent/30"
                >
                  {/* Main Category Header Row */}
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-raised">
                    <div className="flex items-center space-x-2.5 flex-wrap">
                      {childCount > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleCollapse(parent.id)}
                          className="w-5 h-5 rounded flex items-center justify-center text-xs bg-surface border border-border text-text hover:bg-border transition-colors"
                          title={isCollapsed ? 'ഉപവിഭാഗങ്ങൾ കാണിക്കുക' : 'ഉപവിഭാഗങ്ങൾ ഒളിപ്പിക്കുക'}
                        >
                          {isCollapsed ? '+' : '−'}
                        </button>
                      )}

                      <span className="font-extrabold text-sm text-text font-reading flex items-center gap-1.5">
                        {parent.is_premium_section && <span>👑</span>}
                        <span>{parent.name_ml}</span>
                      </span>

                      <span className="text-xs text-text-muted font-mono">
                        ({parent.name_en} • /topic/{parent.slug})
                      </span>

                      <span className="bg-accent/10 text-accent text-[10px] font-bold px-2 py-0.5 rounded-full">
                        🏷️ പ്രധാന വിഭാഗം
                      </span>

                      {childCount > 0 && (
                        <span className="bg-surface border border-border text-text-muted text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {childCount} ഉപവിഭാഗങ്ങൾ
                        </span>
                      )}

                      {parent.show_in_nav && (
                        <span className="bg-success/15 text-success text-[10px] font-bold px-1.5 py-0.5 rounded">
                          Nav
                        </span>
                      )}
                    </div>

                    {/* Quick Row Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {/* Direct action to add subcategory under this parent */}
                      <button
                        onClick={() => openAddSubCategory(parent.id)}
                        className="bg-surface hover:bg-accent hover:text-white border border-border text-accent px-2.5 py-1 rounded text-xs font-bold transition-all shadow-sm flex items-center gap-1"
                        title={`ഇതിലേക്ക് പുതിയ ഉപവിഭാഗം ചേർക്കുക`}
                      >
                        <span>↳ + ഉപവിഭാഗം</span>
                      </button>

                      <button
                        onClick={() => handleEdit(parent)}
                        className="bg-surface hover:bg-surface-raised border border-border text-text px-2.5 py-1 rounded text-xs font-semibold"
                      >
                        എഡിറ്റ്
                      </button>

                      <button
                        onClick={() => handleDelete(parent.id, parent.name_ml)}
                        className="bg-surface hover:bg-danger hover:text-white border border-border text-danger px-2 py-1 rounded text-xs font-semibold transition-colors"
                      >
                        നീക്കുക
                      </button>
                    </div>
                  </div>

                  {/* Sub-categories List (Indented Tree) */}
                  {!isCollapsed && parent.children && parent.children.length > 0 && (
                    <div className="p-3 pl-6 sm:pl-10 space-y-2 border-t border-border bg-surface">
                      {parent.children.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 px-3 bg-surface-raised rounded-lg border border-border/70 hover:border-accent/40 text-xs transition-colors"
                        >
                          <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-text-muted font-mono">↳</span>
                            <span className="text-text font-bold font-reading">
                              {sub.is_premium_section && '👑 '}
                              {sub.name_ml}
                            </span>
                            <span className="text-text-muted font-mono text-[11px]">
                              ({sub.name_en} • /topic/{sub.slug})
                            </span>
                            <span className="bg-border text-text-muted text-[10px] font-semibold px-1.5 py-0.5 rounded">
                              ഉപവിഭാഗം
                            </span>
                            {sub.show_in_nav && (
                              <span className="bg-success/15 text-success text-[10px] font-bold px-1.5 py-0.5 rounded">
                                Nav
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 self-end sm:self-auto">
                            <button
                              onClick={() => handleEdit(sub)}
                              className="text-accent hover:underline font-bold text-xs"
                            >
                              എഡിറ്റ്
                            </button>
                            <span className="text-border">|</span>
                            <button
                              onClick={() => handleDelete(sub.id, sub.name_ml)}
                              className="text-danger hover:underline font-semibold text-xs"
                            >
                              നീക്കുക
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
