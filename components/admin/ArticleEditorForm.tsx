'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Article, Category, Author, ArticleStatus } from '@/lib/types';

interface ArticleEditorFormProps {
  initialArticle?: Partial<Article>;
  isEditing?: boolean;
}

const KERALA_DISTRICTS_LIST = [
  { slug: '', name: 'സംസ്ഥാനം / ആഗോള പൊതുവാർത്ത (Statewide / None)' },
  { slug: 'thiruvananthapuram', name: 'തിരുവനന്തപുരം (Thiruvananthapuram)' },
  { slug: 'kollam', name: 'കൊല്ലം (Kollam)' },
  { slug: 'pathanamthitta', name: 'പത്തനംതിട്ട (Pathanamthitta)' },
  { slug: 'alappuzha', name: 'ആലപ്പുഴ (Alappuzha)' },
  { slug: 'kottayam', name: 'കോട്ടയം (Kottayam)' },
  { slug: 'idukki', name: 'ഇടുക്കി (Idukki)' },
  { slug: 'ernakulam', name: 'എറണാകുളം - കൊച്ചി (Ernakulam / Kochi)' },
  { slug: 'thrissur', name: 'തൃശ്ശൂർ (Thrissur)' },
  { slug: 'palakkad', name: 'പാലക്കാട് (Palakkad)' },
  { slug: 'malappuram', name: 'മലപ്പുറം (Malappuram)' },
  { slug: 'kozhikode', name: 'കോഴിക്കോട് (Kozhikode)' },
  { slug: 'wayanad', name: 'വയനാട് (Wayanad)' },
  { slug: 'kannur', name: 'കണ്ണൂർ (Kannur)' },
  { slug: 'kasaragod', name: 'കാസർഗോഡ് (Kasaragod)' },
];

const IMAGE_PRESETS = [
  { label: '🟡 സ്വർണം', url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80' },
  { label: '📈 ഓഹരി വിപണി', url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80' },
  { label: '🏢 കൊച്ചി ഐടി', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
  { label: '🌴 കേരള ടൂറിസം', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
  { label: '⚓ വിഴിഞ്ഞം പോർട്ട്', url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80' },
  { label: '🌾 കാർഷികം', url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1200&q=80' },
  { label: '💰 ബാങ്കിംഗ്', url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80' },
  { label: '🗞️ വാർത്താ ഡെസ്ക്', url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80' },
];

export function ArticleEditorForm({ initialArticle, isEditing = false }: ArticleEditorFormProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [savedArticle, setSavedArticle] = useState<Article | null>(null);

  // Form Fields
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [categoryId, setCategoryId] = useState(initialArticle?.category_id || '');
  const [authorId, setAuthorId] = useState(initialArticle?.author_id || '');
  const [district, setDistrict] = useState(initialArticle?.district || '');
  const [isHero, setIsHero] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [heroImageUrl, setHeroImageUrl] = useState(
    initialArticle?.hero_image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'
  );
  const [heroCaption, setHeroCaption] = useState(initialArticle?.hero_caption || '');
  const [heroCredit, setHeroCredit] = useState(initialArticle?.hero_credit || '');
  const [status, setStatus] = useState<ArticleStatus>(initialArticle?.status || 'published');
  const [scheduledFor, setScheduledFor] = useState(initialArticle?.scheduled_for || '');
  const [readMinutes, setReadMinutes] = useState(initialArticle?.read_minutes || 3);
  const [isPremium, setIsPremium] = useState(initialArticle?.is_premium || false);
  const [previewParagraphs, setPreviewParagraphs] = useState(initialArticle?.preview_paragraphs || 3);
  const [isSponsored, setIsSponsored] = useState(initialArticle?.is_sponsored || false);
  const [sponsorName, setSponsorName] = useState(initialArticle?.sponsor_name || '');
  const [bodyHtml, setBodyHtml] = useState(
    initialArticle?.body_html || '<p>ലേഖനത്തിന്റെ പൂർണ്ണമായ വിവരണം ഇവിടെ എഴുതുക...</p>'
  );
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
    const cleaned = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setSlug(cleaned ? `${cleaned}-${randomSuffix}` : `story-${Date.now().toString(36)}-${randomSuffix}`);
  };

  // Quick Story Templates
  const loadTemplate = (type: 'gold' | 'market' | 'kerala') => {
    if (type === 'gold') {
      setTitle('സംസ്ഥാനത്ത് സ്വർണവിലയിൽ മാറ്റം: ഇന്നത്തെ വിശദമായ നിരക്കുകൾ');
      setSlug(`kerala-gold-rate-update-${Date.now().toString(36)}`);
      setExcerpt('കേരളത്തിൽ ഇന്നത്തെ 22 കാരറ്റ്, 24 കാരറ്റ് സ്വർണത്തിന്റെയും വെള്ളിയുടെയും വിപണി നിരക്കുകൾ.');
      setCategoryId(categories.find(c => c.slug === 'gold-silver')?.id || categoryId);
      setHeroImageUrl('https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80');
      setHeroCaption('കേരളത്തിലെ ജ്വല്ലറികളിൽ ഇന്നത്തെ സ്വർണവില');
      setHeroCredit('ഫയൽ ചിത്രം');
      setBodyHtml(`
        <p>കേരളത്തിൽ ഇന്ന് സ്വർണവിലയിൽ വ്യതിയാനം രേഖപ്പെടുത്തി. വിവാഹ സീസൺ സജീവമായിരിക്കെ സ്വർണവിപണിയിലെ വിലമാറ്റങ്ങൾ ഉപഭോക്താക്കൾ അതീവ ശ്രദ്ധയോടെയാണ് നിരീക്ഷിക്കുന്നത്.</p>
        <p>ഒരു പവൻ (8 ഗ്രാം) 22 കാരറ്റ് സ്വർണത്തിന് ഇന്നത്തെ നിരക്ക് ₹58,800 രൂപയാണ്. ഒരു ഗ്രാമിന് ₹7,350 രൂപ. 24 കാരറ്റ് ശുദ്ധസ്വർണത്തിന് ഒരു ഗ്രാമിന് ₹8,018 രൂപയാണ് വിപണി നിരക്ക്.</p>
        <h3>ഇന്നത്തെ പ്രധാന നിരക്കുകൾ ഒറ്റനോട്ടത്തിൽ:</h3>
        <ul>
          <li><strong>22 കാരറ്റ് സ്വർണം (1 പവൻ):</strong> ₹58,800</li>
          <li><strong>22 കാരറ്റ് സ്വർണം (1 ഗ്രാം):</strong> ₹7,350</li>
          <li><strong>24 കാരറ്റ് സ്വർണം (1 ഗ്രാം):</strong> ₹8,018</li>
          <li><strong>വെള്ളി (1 ഗ്രാം):</strong> ₹103</li>
        </ul>
        <p>ആഗോള വിപണിയിലെ ട്രഷറി വരുമാനത്തിലെ മാറ്റങ്ങളും പശ്ചിമേഷ്യൻ രാഷ്ട്രീയ സാഹചര്യങ്ങളുമാണ് നിലവിൽ സ്വർണവിലയെ സ്വാധീനിക്കുന്നത്.</p>
      `);
      setTagsInput('സ്വർണവില, കേരളം, വിപണി, പവൻ');
    } else if (type === 'market') {
      setTitle('ഇന്ത്യൻ ഓഹരി വിപണിയിൽ മുന്നേറ്റം: സെൻസെക്സും നിഫ്റ്റിയും നേട്ടത്തിൽ');
      setSlug(`indian-stock-market-gains-${Date.now().toString(36)}`);
      setExcerpt('ബാങ്കിങ്, ഐടി ഓഹരികളുടെ കരുത്തിൽ സൂചികകൾ ഉയർന്നു; നിക്ഷേപകരിൽ ആത്മവിശ്വാസം.');
      setCategoryId(categories.find(c => c.slug === 'markets')?.id || categoryId);
      setHeroImageUrl('https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80');
      setHeroCaption('ബോംബെ സ്റ്റോക്ക് എക്സ്ചേഞ്ച് വ്യാപാരം');
      setHeroCredit('PTI Photo');
      setBodyHtml(`
        <p>ഇന്ത്യൻ ഓഹരി വിപണി ഇന്ന് വ്യാപാരത്തിന്റെ തുടക്കം മുതൽ ശക്തമായ നേട്ടത്തിലാണ്. വിദേശ നിക്ഷേപകരുടെ തുടർച്ചയായ വാങ്ങലുകളും അനുകൂലമായ ആഗോള വിപണി സൂചനകളും നിക്ഷേപകർക്ക് ആത്മവിശ്വാസം പകർന്നു.</p>
        <p>ബോംബെ ഓഹരി സൂചികയായ സെൻസെക്സ് 350 പോയിന്റ് ഉയർന്ന് 81,500 നിലവാരത്തിലും, ദേശീയ ഓഹരി സൂചികയായ നിഫ്റ്റി 105 പോയിന്റ് ഉയർന്ന് 24,850 ലും വ്യാപാരം പുരോഗമിക്കുന്നു.</p>
      `);
      setTagsInput('ഓഹരി വിപണി, സെൻസെക്സ്, നിഫ്റ്റി, ബിസിനസ്');
    } else if (type === 'kerala') {
      setTitle('കൊച്ചി മെട്രോ രണ്ടാം ഘട്ട വികസനം: നിർമ്മാണ പ്രവർത്തനങ്ങൾക്ക് വേഗതയേറി');
      setSlug(`kochi-metro-phase-2-construction-speed-${Date.now().toString(36)}`);
      setExcerpt('കാക്കനാട് ഇൻഫോപാർക്കിലേക്കുള്ള പുതിയ മെട്രോ പാത അടുത്ത വർഷം പൂർത്തിയാക്കാൻ ലക്ഷ്യം.');
      setCategoryId(categories.find(c => c.slug === 'real-estate' || c.slug === 'kerala-business')?.id || categoryId);
      setDistrict('ernakulam');
      setHeroImageUrl('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80');
      setHeroCaption('കൊച്ചി മെട്രോ കാക്കനാട് പാത നിർമ്മാണം');
      setHeroCredit('പ്രത്യേക ക്രമീകരണം');
      setBodyHtml(`
        <p>കൊച്ചി മെട്രോയുടെ രണ്ടാം ഘട്ടമായ കലൂർ ജവഹർലാൽ നെഹ്റു സ്റ്റേഡിയം മുതൽ കാക്കനാട് ഇൻഫോപാർക്ക് വരെയുള്ള പാതയുടെ നിർമ്മാണ പ്രവർത്തനങ്ങൾ അതിവേഗം പുരോഗമിക്കുന്നു.</p>
        <p>11.2 കിലോമീറ്റർ ദൈർഘ്യമുള്ള പിങ്ക് ലൈനിൽ 11 സ്റ്റേഷനുകളാണുള്ളത്. പുതിയ പാത പൂർത്തിയാകുന്നതോടെ ഇൻഫോപാർക്കിലെ ആയിരക്കണക്കിന് ഐടി പ്രൊഫഷണലുകൾക്ക് യാത്ര കൂടുതൽ ആശ്വാസകരമാകും.</p>
      `);
      setTagsInput('കൊച്ചി മെട്രോ, കാക്കനാട്, ഇൻഫോപാർക്ക്, വികസനം');
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

    const finalSlug = slug.trim() || `story-${Date.now().toString(36)}`;

    const payload = {
      id: initialArticle?.id,
      title: title.trim(),
      slug: finalSlug,
      category_id: categoryId,
      author_id: authorId,
      district: district || null,
      is_hero: isHero,
      is_breaking: isBreaking,
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
        setSavedArticle(data.article);
        setNotification({
          type: 'success',
          message: status === 'published'
            ? 'ലേഖനം വിജയകരമായി വെബ്സൈറ്റിൽ പ്രസിദ്ധീകരിച്ചു! താഴെയുള്ള ലിങ്കുകൾ ഉപയോഗിച്ച് നേരിട്ട് കാണാം.'
            : 'ലേഖനം വിജയകരമായി സേവ് ചെയ്തു!'
        });
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
            തലക്കെട്ടും ഉള്ളടക്കവും മലയാളത്തിൽ ടൈപ്പ് ചെയ്യുക. പ്രസിദ്ധീകരിച്ചാൽ ഉടൻ പബ്ലിക് വെബ്സൈറ്റിൽ ലഭ്യമാകും.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex border border-border rounded-lg overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('edit')}
              className={`px-3 py-1.5 font-semibold transition-colors ${
                activeTab === 'edit' ? 'bg-accent text-white' : 'bg-surface text-text hover:bg-surface-raised'
              }`}
            >
              എഡിറ്റർ
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 font-semibold transition-colors ${
                activeTab === 'preview' ? 'bg-accent text-white' : 'bg-surface text-text hover:bg-surface-raised'
              }`}
            >
              പ്രിവ്യൂ (Preview)
            </button>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-accent hover:opacity-90 text-white font-bold text-xs px-5 py-2 rounded-lg transition-all shadow-sm disabled:opacity-50 flex items-center gap-1.5"
          >
            {saving ? (
              <span>സേവ് ചെയ്യുന്നു...</span>
            ) : (
              <>
                <span>🚀</span>
                <span>{status === 'published' ? 'പ്രസിദ്ധീകരിക്കുക' : 'സേവ് ചെയ്യുക'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Banner with Instant Live Links */}
      {savedArticle && (
        <div className="bg-success/10 border-2 border-success/40 rounded-xl p-5 space-y-3 animate-fade-in shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🎉</span>
            <div>
              <h3 className="text-sm font-bold text-success font-reading">
                വാർത്ത വിജയകരമായി സേവ് ചെയ്തു! പബ്ലിക് വെബ്സൈറ്റിൽ തത്സമയം ലഭ്യമാണ്.
              </h3>
              <p className="text-xs text-text-muted">
                ഹെഡ്‌ലൈൻ: <strong className="text-text font-reading">{savedArticle.title}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-success/20">
            <Link
              href={`/article/${savedArticle.slug}`}
              target="_blank"
              className="bg-accent text-white text-xs font-bold px-3.5 py-1.5 rounded-lg hover:opacity-90 flex items-center gap-1 shadow-sm"
            >
              <span>🌐</span>
              <span>ലേഖനം വെബ്സൈറ്റിൽ കാണുക</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="bg-surface hover:bg-border border border-border text-xs font-semibold px-3 py-1.5 rounded-lg text-text flex items-center gap-1"
            >
              <span>🏠</span>
              <span>ഹോം പേജ് സന്ദർശിക്കുക</span>
            </Link>

            {savedArticle.district && (
              <Link
                href={`/districts/${savedArticle.district}`}
                target="_blank"
                className="bg-surface hover:bg-border border border-border text-xs font-semibold px-3 py-1.5 rounded-lg text-text flex items-center gap-1"
              >
                <span>📍</span>
                <span>ജില്ലാ പേജ് കാണുക</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => router.push('/admin/articles')}
              className="text-xs text-text-muted hover:text-text font-medium px-2 py-1 underline"
            >
              ലേഖനങ്ങളുടെ പട്ടികയിലേക്ക് മടങ്ങുക
            </button>
          </div>
        </div>
      )}

      {notification && !savedArticle && (
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

      {/* Quick Templates Selector */}
      <div className="bg-surface-raised border border-border rounded-lg p-3 flex flex-wrap items-center gap-2 text-xs">
        <span className="font-bold text-text-muted">വാർത്താ ടെംപ്ലേറ്റുകൾ (1-ക്ലിക്ക്):</span>
        <button
          type="button"
          onClick={() => loadTemplate('gold')}
          className="bg-surface hover:bg-border border border-border px-2.5 py-1 rounded text-text font-medium transition-colors"
        >
          🟡 സ്വർണവില വാർത്ത
        </button>
        <button
          type="button"
          onClick={() => loadTemplate('market')}
          className="bg-surface hover:bg-border border border-border px-2.5 py-1 rounded text-text font-medium transition-colors"
        >
          📈 ഓഹരി വിപണി റിപ്പോർട്ട്
        </button>
        <button
          type="button"
          onClick={() => loadTemplate('kerala')}
          className="bg-surface hover:bg-border border border-border px-2.5 py-1 rounded text-text font-medium transition-colors"
        >
          🌴 കേരള ബിസിനസ് / മെട്രോ
        </button>
      </div>

      {activeTab === 'preview' ? (
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 space-y-6">
          <div className="text-xs text-text-muted uppercase font-bold tracking-wider flex items-center justify-between border-b border-border pb-2">
            <span>തത്സമയ കാഴ്ച്ച (Live Reader Preview)</span>
            {district && (
              <span className="bg-accent/10 text-accent px-2 py-0.5 rounded text-[10px] font-bold">
                📍 {KERALA_DISTRICTS_LIST.find(d => d.slug === district)?.name}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text leading-snug">
            {title || 'തലക്കെട്ട് നൽകിയിട്ടില്ല'}
          </h1>
          <p className="text-sm text-text-muted font-reading leading-relaxed">{excerpt}</p>
          {heroImageUrl && (
            <div className="space-y-1.5">
              <img src={heroImageUrl} alt={title} className="w-full max-h-96 object-cover rounded-lg border border-border" />
              {(heroCaption || heroCredit) && (
                <div className="text-[11px] text-text-muted italic flex justify-between">
                  <span>{heroCaption}</span>
                  <span>{heroCredit}</span>
                </div>
              )}
            </div>
          )}
          <div
            className="prose prose-slate dark:prose-invert max-w-none font-reading text-text leading-relaxed pt-4 border-t border-border"
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
                placeholder="മലയാളത്തിൽ ആകർഷകമായ തലക്കെട്ട് നൽകുക..."
                className="w-full bg-surface border border-border-input rounded-lg px-3.5 py-2.5 text-sm font-reading text-text focus:outline-none focus:border-accent"
              />
            </div>

            {/* English Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-text">
                  ഇംഗ്ലീഷ് URL സ്ലഗ്ഗ് (English URL Slug) *
                </label>
                <button
                  type="button"
                  onClick={generateSlugFromTitle}
                  className="text-[11px] text-accent font-semibold hover:underline flex items-center gap-1"
                >
                  <span>⚡</span>
                  <span>ഓട്ടോ ജനറേറ്റ്</span>
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
                സംഗ്രഹം / ഇൻട്രോ (Excerpt / Lead Summary)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="വാർത്തയുടെ ചുരുക്കം 2 വരികളിൽ..."
                className="w-full bg-surface border border-border-input rounded px-3 py-2 text-xs font-reading text-text focus:outline-none focus:border-accent"
              />
            </div>

            {/* Body Editor */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-text">
                  വാർത്താ ഉള്ളടക്കം (Body HTML / Paragraphs) *
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

            {/* Hero Image Options & Presets */}
            <div className="bg-surface border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-text uppercase tracking-wider">
                  ഹീറോ ചിത്രം (Hero Photo)
                </h3>
                <span className="text-[10px] text-text-muted">ഒരു ക്ലിക്ക് പ്രീസെറ്റുകൾ തിരഞ്ഞെടുക്കാം</span>
              </div>

              {/* Image Presets */}
              <div>
                <label className="text-[11px] text-text-muted block mb-1.5 font-semibold">വേഗത്തിലുള്ള ഫോട്ടോ പ്രീസെറ്റുകൾ:</label>
                <div className="flex flex-wrap gap-1.5">
                  {IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setHeroImageUrl(preset.url)}
                      className="text-[11px] bg-surface-raised hover:bg-border border border-border px-2 py-1 rounded text-text font-medium transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-text-muted block mb-1 font-semibold">ചിത്രത്തിന്റെ URL:</label>
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
                  <option value="published">Published (പ്രസിദ്ധീകരിക്കുക - തത്സമയം ലൈവ്)</option>
                  <option value="draft">Draft (ഡ്രാഫ്റ്റ് - എഡിറ്റർക്ക് മാത്രം)</option>
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
                <label className="text-xs font-bold text-text block mb-1">വിഭാഗം (37 Categories) *</label>
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

              {/* District Selector */}
              <div>
                <label className="text-xs font-bold text-text block mb-1">
                  ജില്ല (Kerala District):
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
                >
                  {KERALA_DISTRICTS_LIST.map((d) => (
                    <option key={d.slug} value={d.slug}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-text-muted mt-1 block">
                  തിരഞ്ഞെടുത്താൽ ആ ജില്ലയുടെ ഹൈപ്പർലോക്കൽ പേജിലും ഹോം പേജിലെ ജില്ലാ സെലക്ടറിലും വാർത്ത ഉൾപ്പെടും.
                </span>
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

            {/* Editorial Promotion Controls */}
            <div className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-3">
              <h3 className="text-xs font-bold text-text uppercase tracking-wider border-b border-border pb-2 flex items-center justify-between">
                <span>🌟 ഹോം പേജ് പ്ലേസ്‌മെന്റ്</span>
                <span className="text-[10px] text-accent font-semibold">Instant Display</span>
              </h3>

              <label className="flex items-start space-x-2 text-xs font-semibold cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isHero}
                  onChange={(e) => setIsHero(e.target.checked)}
                  className="mt-0.5 rounded text-accent"
                />
                <div>
                  <span className="text-text block font-bold">📌 പ്രധാന വാർത്തയാക്കുക (Hero Story)</span>
                  <span className="text-[10px] text-text-muted block">
                    ഹോം പേജിലെ ഏറ്റവും മുകളിൽ പ്രധാന വലിയ ലീഡ് വാർത്തയായി പ്രതിഷ്ഠിക്കുക.
                  </span>
                </div>
              </label>

              <label className="flex items-start space-x-2 text-xs font-semibold cursor-pointer select-none pt-2 border-t border-border">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                  className="mt-0.5 rounded text-accent"
                />
                <div>
                  <span className="text-text block font-bold text-danger">⚡ ബ്രേക്കിംഗ് ന്യൂസ് ടിക്കർ (Breaking News)</span>
                  <span className="text-[10px] text-text-muted block">
                    ഹോം പേജിലെ മുകൾഭാഗത്തുള്ള ചുവന്ന ബ്രേക്കിംഗ് ന്യൂസ് സ്ട്രിപ്പിൽ ഉടൻ കാണിക്കുക.
                  </span>
                </div>
              </label>
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
