'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Article, Category, Author, ArticleStatus } from '@/lib/types';

interface ArticleEditorFormProps {
  initialArticle?: Partial<Article>;
  isEditing?: boolean;
}

export function ArticleEditorForm({ initialArticle, isEditing = false }: ArticleEditorFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [categoryId, setCategoryId] = useState(initialArticle?.category_id || '');
  const [authorId, setAuthorId] = useState(initialArticle?.author_id || '');
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [heroImageUrl, setHeroImageUrl] = useState(initialArticle?.hero_image_url || '');
  const [heroCaption, setHeroCaption] = useState(initialArticle?.hero_caption || '');
  const [heroCredit, setHeroCredit] = useState(initialArticle?.hero_credit || '');
  const [status, setStatus] = useState<ArticleStatus>(initialArticle?.status || 'published');
  const [scheduledFor, setScheduledFor] = useState(initialArticle?.scheduled_for || '');
  const [readMinutes, setReadMinutes] = useState(initialArticle?.read_minutes || 3);
  const [isPremium, setIsPremium] = useState(initialArticle?.is_premium || false);
  const [previewParagraphs, setPreviewParagraphs] = useState(initialArticle?.preview_paragraphs || 3);
  const [isSponsored, setIsSponsored] = useState(initialArticle?.is_sponsored || false);
  const [sponsorName, setSponsorName] = useState(initialArticle?.sponsor_name || '');
  const [bodyHtml, setBodyHtml] = useState(initialArticle?.body_html || '<p>ലേഖനത്തിന്റെ ഉള്ളടക്കം ഇവിടെ എഴുതുക...</p>');
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialArticle?.seo_description || '');
  const [tagsInput, setTagsInput] = useState(initialArticle?.tags ? initialArticle.tags.join(', ') : '');

  useEffect(() => {
    fetch('/api/v1/categories?flat=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
          if (!categoryId && data.length > 0) {
            setCategoryId(data[0].id);
          }
        }
      })
      .catch(() => {});

    // Default authors
    const demoAuthors: Author[] = [
      { id: 'author-desk', slug: 'desk', display_name: 'പ്രോഫിറ്റ് ഡെസ്ക്' },
      { id: 'author-arun', slug: 'arun-kumar', display_name: 'അരുൺ കുമാർ' },
      { id: 'author-priya', slug: 'priya-nair', display_name: 'പ്രിയ നായർ' },
      { id: 'author-reshma', slug: 'reshma-george', display_name: 'രേഷ്മ ജോർജ്ജ്' }
    ];
    setAuthors(demoAuthors);
    if (!authorId) setAuthorId(demoAuthors[0].id);
  }, []);

  // Generate English slug from title
  const generateSlugFromTitle = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    // English keywords fallback slug
    const cleaned = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(cleaned ? `${cleaned}-${randomSuffix}` : `story-${Date.now().toString(36)}-${randomSuffix}`);
  };

  // Quick Story Templates
  const loadTemplate = (type: 'gold' | 'market' | 'general') => {
    if (type === 'gold') {
      setTitle('സംസ്ഥാനത്ത് സ്വർണവിലയിൽ മാറ്റം: ഇന്നത്തെ വിശദമായ നിരക്കുകൾ');
      setExcerpt('കേരളത്തിൽ ഇന്നത്തെ 22 കാരറ്റ്, 24 കാരറ്റ് സ്വർണത്തിന്റെയും വെള്ളിയുടെയും വിപണി നിരക്കുകൾ.');
      setCategoryId(categories.find(c => c.slug === 'gold-silver')?.id || categoryId);
      setHeroImageUrl('https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80');
      setBodyHtml(`
        <p>കേരളത്തിൽ ഇന്ന് സ്വർണവിലയിൽ മാറ്റം രേഖപ്പെടുത്തി. 22 കാരറ്റ് സ്വർണം ഒരു പവന് 58,800 രൂപയിലാണ് ഇന്ന് വ്യാപാരം പുരോഗമിക്കുന്നത്. ഒരു ഗ്രാമിന് 7,350 രൂപയാണ് നിരക്ക്.</p>
        <p>രാജ്യാന്തര വിപണിയിലെ മാറ്റങ്ങളും യുഎസ് ഡോളറിന്റെ മൂല്യവുമാണ് ആഭ്യന്തര വിപണിയിലും പ്രതിഫലിക്കുന്നത്.</p>
        <h3>ഇന്നത്തെ പ്രധാന നിരക്കുകൾ:</h3>
        <ul>
          <li>22K സ്വർണം (1 പവൻ): ₹58,800</li>
          <li>22K സ്വർണം (1 ഗ്രാം): ₹7,350</li>
          <li>24K സ്വർണം (1 ഗ്രാം): ₹8,018</li>
          <li>വെള്ളി (1 ഗ്രാം): ₹103</li>
        </ul>
      `);
      setTagsInput('സ്വർണവില, കേരളം, വിപണി');
    } else if (type === 'market') {
      setTitle('ഇന്ത്യൻ ഓഹരി വിപണിയിൽ മുന്നേറ്റം: സെൻസെക്സും നിഫ്റ്റിയും നേട്ടത്തിൽ');
      setExcerpt('ബാങ്കിങ്, ഐടി ഓഹരികളുടെ കരുത്തിൽ സൂചികകൾ ഉയർന്നു.');
      setCategoryId(categories.find(c => c.slug === 'markets')?.id || categoryId);
      setHeroImageUrl('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80');
      setBodyHtml(`
        <p>ഇന്ത്യൻ ഓഹരി വിപണി ഇന്ന് വ്യാപാരത്തിന്റെ തുടക്കം മുതൽ ശക്തമായ നേട്ടത്തിലാണ്. ബിഎസ്ഇ സെൻസെക്സ് 350 പോയിന്റ് ഉയർന്നു.</p>
        <p>വിദേശ നിക്ഷേപകരുടെ തുടർച്ചയായ വാങ്ങലുകളും അനുകൂലമായ ആഗോള വിപണി സൂചനകളും നിക്ഷേപകർക്ക് ആത്മവിശ്വാസം പകർന്നു.</p>
      `);
      setTagsInput('ഓഹരി വിപണി, സെൻസെക്സ്, നിഫ്റ്റി');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !categoryId || !authorId) {
      setNotification({ type: 'error', message: 'ദയവായി തലക്കെട്ടും വിഭാഗവും എഡിറ്ററും തിരഞ്ഞെടുക്കുക.' });
      return;
    }

    setSaving(true);
    setNotification(null);

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const payload = {
      id: initialArticle?.id,
      title: title.trim(),
      slug: slug.trim() || `story-${Date.now().toString(36)}`,
      category_id: categoryId,
      author_id: authorId,
      excerpt: excerpt.trim(),
      hero_image_url: heroImageUrl.trim(),
      hero_caption: heroCaption.trim(),
      hero_credit: heroCredit.trim(),
      status,
      scheduled_for: scheduledFor || null,
      read_minutes: Number(readMinutes) || 3,
      is_premium: isPremium,
      preview_paragraphs: Number(previewParagraphs) || 3,
      body_html: bodyHtml,
      body_text: excerpt || title,
      is_sponsored: isSponsored,
      sponsor_name: isSponsored ? sponsorName.trim() : null,
      seo_title: seoTitle.trim() || title.trim(),
      seo_description: seoDescription.trim() || excerpt.trim(),
      tags
    };

    try {
      const res = await fetch('/api/v1/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success && data.article) {
        setNotification({ type: 'success', message: 'ലേഖനം വിജയകരമായി സേവ് ചെയ്തു!' });
        setTimeout(() => {
          router.push('/admin/articles');
        }, 1200);
      } else {
        setNotification({ type: 'error', message: data.error || 'ലേഖനം സേവ് ചെയ്യുന്നതിൽ പിഴവ് സംഭവിച്ചു.' });
      }
    } catch {
      setNotification({ type: 'error', message: 'നെറ്റ്‌വർക്ക് കണക്ഷൻ പരിശോധിക്കുക.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-reading text-text">
            {isEditing ? 'ലേഖനം തിരുത്തുക (Edit Article)' : 'പുതിയ ലേഖനം എഴുതുക (New Article)'}
          </h1>
          <p className="text-xs text-text-muted">
            തലക്കെട്ടും ഉള്ളടക്കവും മലയാളത്തിൽ ടൈപ്പ് ചെയ്യുക അല്ലെങ്കിൽ പേസ്റ്റ് ചെയ്യുക.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex border border-border rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 font-semibold ${
                activeTab === 'edit' ? 'bg-accent text-white' : 'bg-surface text-text'
              }`}
            >
              എഡിറ്റർ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 font-semibold ${
                activeTab === 'preview' ? 'bg-accent text-white' : 'bg-surface text-text'
              }`}
            >
              പ്രിവ്യൂ (Preview)
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-accent hover:opacity-90 text-white font-bold text-xs px-5 py-2 rounded-lg transition-all shadow-sm disabled:opacity-50"
          >
            {saving ? 'സേവ് ചെയ്യുന്നു...' : 'സേവ് ചെയ്യുക'}
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-3 rounded-lg text-xs font-bold ${
            notification.type === 'success'
              ? 'bg-success/10 border border-success/30 text-success'
              : 'bg-danger/10 border border-danger/30 text-danger'
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Templates Selector */}
      <div className="bg-surface-raised border border-border rounded-lg p-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-text-muted">വാർത്താ ടെംപ്ലേറ്റുകൾ:</span>
        <button
          type="button"
          onClick={() => loadTemplate('gold')}
          className="bg-surface hover:bg-border border border-border px-2.5 py-1 rounded text-text font-medium"
        >
          🟡 സ്വർണവില വാർത്ത
        </button>
        <button
          type="button"
          onClick={() => loadTemplate('market')}
          className="bg-surface hover:bg-border border border-border px-2.5 py-1 rounded text-text font-medium"
        >
          📈 ഓഹരി വിപണി റിപ്പോർട്ട്
        </button>
      </div>

      {activeTab === 'preview' ? (
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
          <div className="text-xs text-text-muted uppercase font-bold tracking-wider">
            പ്രിവ്യൂ കാഴ്ച്ച (Article Live Preview)
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text">
            {title || 'തലക്കെട്ട് നൽകിയിട്ടില്ല'}
          </h1>
          <p className="text-sm text-text-muted">{excerpt}</p>
          {heroImageUrl && (
            <img src={heroImageUrl} alt={title} className="w-full max-h-96 object-cover rounded-lg" />
          )}
          <div
            className="prose prose-slate dark:prose-invert max-w-none font-reading text-text"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Editing Column */}
          <div className="lg:col-span-8 space-y-5">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-text block mb-1">
                വാർത്തയുടെ തലക്കെട്ട് (Title in Malayalam) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="മലയാളത്തിൽ വാർത്തയുടെ ആകർഷകമായ തലക്കെട്ട് നൽകുക..."
                className="w-full bg-surface border border-border-input rounded-lg px-3.5 py-2.5 text-sm font-reading text-text focus:outline-none focus:border-accent"
              />
            </div>

            {/* English Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-text">
                  ഇംഗ്ലീഷ് URL സ്ലഗ്ഗ് (English Slug) *
                </label>
                <button
                  type="button"
                  onClick={generateSlugFromTitle}
                  className="text-[11px] text-accent font-semibold hover:underline"
                >
                  ⚡ ഓട്ടോ ജനറേറ്റ്
                </button>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kerala-news-update-today"
                className="w-full bg-surface border border-border-input rounded px-3 py-1.5 text-xs font-mono text-text focus:outline-none focus:border-accent"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="text-xs font-bold text-text block mb-1">
                സംഗ്രഹം / ലീഡ് (Excerpt / Summary)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="വാർത്തയുടെ ചുരുക്കം 2 വരികളിൽ..."
                className="w-full bg-surface border border-border-input rounded px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>

            {/* Body Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-text">
                  വാർത്താ ഉള്ളടക്കം (Body HTML / Rich Text) *
                </label>
                <span className="text-[10px] text-text-muted">HTML ടാഗുകൾ (&lt;p&gt;, &lt;h3&gt;, &lt;ul&gt;) ഉപയോഗിക്കാം</span>
              </div>
              <textarea
                rows={12}
                required
                value={bodyHtml}
                onChange={(e) => setBodyHtml(e.target.value)}
                className="w-full bg-surface border border-border-input rounded-lg p-3 text-xs font-reading text-text leading-relaxed focus:outline-none focus:border-accent"
              />
            </div>

            {/* Hero Image Options */}
            <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                ഹീറോ ചിത്രം &amp; വിവരങ്ങൾ (Hero Image)
              </h3>
              <div>
                <label className="text-[11px] text-text-muted block mb-1">ഇമേജ് URL (Image URL):</label>
                <input
                  type="url"
                  value={heroImageUrl}
                  onChange={(e) => setHeroImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-text-muted block mb-1">ക്യാപ്ഷൻ (Caption):</label>
                  <input
                    type="text"
                    value={heroCaption}
                    onChange={(e) => setHeroCaption(e.target.value)}
                    placeholder="ചിത്രവിവരണം..."
                    className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-text-muted block mb-1">ഫോട്ടോ കടപ്പാട് (Credit):</label>
                  <input
                    type="text"
                    value={heroCredit}
                    onChange={(e) => setHeroCredit(e.target.value)}
                    placeholder="Photo: Reuters / Special Arrangement"
                    className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                  />
                </div>
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                സെർച്ച് എഞ്ചിൻ ഒപ്റ്റിമൈസേഷൻ (SEO Meta)
              </h3>
              <div>
                <label className="text-[11px] text-text-muted block mb-1">SEO Title:</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="ഗൂഗിളിൽ കാണേണ്ട തലക്കെട്ട്..."
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                />
              </div>
              <div>
                <label className="text-[11px] text-text-muted block mb-1">SEO Description:</label>
                <input
                  type="text"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="മെറ്റാ വിവരണം..."
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar Options Column */}
          <div className="lg:col-span-4 space-y-5">
            {/* Publishing Settings */}
            <div className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-4">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider border-b border-border pb-2">
                പ്രസിദ്ധീകരണ വിവരങ്ങൾ
              </h3>

              <div>
                <label className="text-xs font-bold text-text block mb-1">സ്റ്റാറ്റസ് (Status):</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs font-semibold text-text"
                >
                  <option value="published">Published (പ്രസിദ്ധീകരിക്കുക)</option>
                  <option value="draft">Draft (ഡ്രാഫ്റ്റ്)</option>
                  <option value="in_review">In Review (എഡിറ്റർ പരിശോധനയിൽ)</option>
                  <option value="scheduled">Scheduled (ഷെഡ്യൂൾ ചെയ്യുക)</option>
                  <option value="archived">Archived (ആർക്കൈവ്)</option>
                </select>
              </div>

              {status === 'scheduled' && (
                <div>
                  <label className="text-xs font-bold text-text block mb-1">ഷെഡ്യൂൾ ചെയ്യേണ്ട സമയം:</label>
                  <input
                    type="datetime-local"
                    value={scheduledFor}
                    onChange={(e) => setScheduledFor(e.target.value)}
                    className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-text block mb-1">വിഭാഗം (37 Categories Tree) *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.parent_id ? `  ↳ ${c.name_ml} (${c.name_en})` : `• ${c.name_ml} (${c.name_en})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">ലേഖകൻ (Author):</label>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value)}
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                >
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.display_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">വായനാ സമയം (മിനിറ്റിൽ):</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={readMinutes}
                  onChange={(e) => setReadMinutes(parseInt(e.target.value, 10))}
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-text block mb-1">ടാഗുകൾ (Comma separated):</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="കേരളം, വിപണി, സ്വർണം"
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                />
              </div>
            </div>

            {/* Premium & Monetization Gate */}
            <div className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-3">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider border-b border-border pb-2">
                👑 പ്രീമിയം &amp; പരസ്യ ക്രമീകരണങ്ങൾ
              </h3>

              <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="rounded text-accent"
                />
                <span className="text-premium">പ്രീമിയം എക്‌സ്‌ക്ലൂസീവ് സ്റ്റോറി</span>
              </label>

              {isPremium && (
                <div>
                  <label className="text-[11px] text-text-muted block mb-1">
                    സൗജന്യ പ്രിവ്യൂ ഖണ്ഡികകൾ (Preview Paragraphs):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={previewParagraphs}
                    onChange={(e) => setPreviewParagraphs(parseInt(e.target.value, 10))}
                    className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                  />
                  <span className="text-[10px] text-text-muted block mt-1">
                    ഇത്രയും ഖണ്ഡികകൾക്ക് ശേഷം പേവാൾ ലോക്ക് പ്രത്യക്ഷപ്പെടും.
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-border">
                <label className="flex items-center space-x-2 text-xs font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSponsored}
                    onChange={(e) => setIsSponsored(e.target.checked)}
                    className="rounded text-accent"
                  />
                  <span>സ്പോൺസേർഡ് ഉള്ളടക്കം (Brand Connect)</span>
                </label>
                {isSponsored && (
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    placeholder="സ്പോൺസറുടെ പേര്..."
                    className="mt-2 w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
