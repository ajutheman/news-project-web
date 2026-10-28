'use client';

import React, { useState, useEffect } from 'react';
import { SiteSettings, SiteEdition } from '@/lib/types';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    site_title_ml: 'ദ പ്രോഫിറ്റ്',
    site_title_en: 'The Profit',
    tagline_ml: 'കേരളത്തിന്റെ സമഗ്ര ബിസിനസ്സ് & ധനകാര്യ വാർത്താ പോർട്ടൽ',
    tagline_en: "Kerala's Premier Business & Financial News Portal",
    default_edition: 'kerala',
    adsense_publisher_id: 'ca-pub-9988776655443322',
    breaking_news_text: 'ബ്രേക്കിംഗ്: കേരളത്തിൽ ഇന്നത്തെ സ്വർണവിലയിൽ പവന് ₹240 വർധനവ്; വിപണിയിൽ പുതിയ കുതിപ്പ്.',
    breaking_news_link: '/tools/gold-rate',
    breaking_news_active: true,
    whatsapp_channel_url: 'https://whatsapp.com/channel/theprofit-kerala',
    maintenance_mode: false,
  });

  useEffect(() => {
    fetch('/api/v1/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load settings:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to save settings:', err);
      alert('സെറ്റിംഗ്സ് സേവ് ചെയ്യുന്നതിൽ പിശക് സംഭവിച്ചു.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-muted">
        സൈറ്റ് സെറ്റിംഗ്സ് ലഭ്യമാക്കുന്നു...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Title & Save Button */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black font-reading text-text flex items-center gap-2">
            <span>⚙️</span>
            <span>സൈറ്റ് മാസ്റ്റർ സെറ്റിംഗ്സ് (Site Master Settings)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            വെബ്‌സൈറ്റിന്റെ പ്രധാന ശീർഷകം, ബ്രേക്കിംഗ് ന്യൂസ് സ്ട്രിപ്പ്, അന്താരാഷ്ട്ര എഡിഷനുകൾ നിയന്ത്രിക്കുക.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow-sm flex items-center space-x-2"
        >
          {saving ? (
            <span>സേവ് ചെയ്യുന്നു...</span>
          ) : success ? (
            <span>✅ ക്രമീകരണങ്ങൾ സേവ് ചെയ്തു!</span>
          ) : (
            <span>💾 സേവ് ചെയ്യുക</span>
          )}
        </button>
      </div>

      {/* Brand & Identity */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        <h2 className="text-sm font-bold font-reading text-text border-b border-border pb-2.5">
          പോർട്ടൽ ഐഡന്റിറ്റി (Brand &amp; Identity)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-text mb-1">പോർട്ടൽ നാമം (മലയാളം)</label>
            <input
              type="text"
              value={settings.site_title_ml}
              onChange={(e) => setSettings({ ...settings, site_title_ml: e.target.value })}
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-reading text-sm focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-text mb-1">പോർട്ടൽ നാമം (English)</label>
            <input
              type="text"
              value={settings.site_title_en}
              onChange={(e) => setSettings({ ...settings, site_title_en: e.target.value })}
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-text mb-1">ടാഗ್‌ലൈൻ (മലയാളം)</label>
            <input
              type="text"
              value={settings.tagline_ml}
              onChange={(e) => setSettings({ ...settings, tagline_ml: e.target.value })}
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-text mb-1">Tagline (English)</label>
            <input
              type="text"
              value={settings.tagline_en}
              onChange={(e) => setSettings({ ...settings, tagline_en: e.target.value })}
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Worldwide Edition Configuration */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        <div className="border-b border-border pb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-bold font-reading text-text">
            അന്താരാഷ്ട്ര എഡിഷനുകൾ (Worldwide Editions)
          </h2>
          <span className="text-[11px] text-accent font-semibold">
            കേരളം • ഗൾഫ് • ആഗോള
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-text mb-1">
              സ്ഥിരസ്ഥിതി പതിപ്പ് (Default Edition)
            </label>
            <select
              value={settings.default_edition}
              onChange={(e) => setSettings({ ...settings, default_edition: e.target.value as SiteEdition })}
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-semibold focus:outline-none focus:border-accent"
            >
              <option value="kerala">🌴 കേരള എഡിഷൻ (Kerala Home Edition)</option>
              <option value="gulf">🌍 ഗൾഫ് / NRI എഡിഷൻ (Middle East / Gulf)</option>
              <option value="global">🌐 ഗ്ലോബൽ എഡിഷൻ (International / Worldwide)</option>
            </select>
            <span className="text-[10px] text-text-muted mt-1 block">
              സന്ദർശകർ ആദ്യമായി വെബ്‌സൈറ്റ് തുറക്കുമ്പോൾ കാണേണ്ട പ്രാഥമിക പതിപ്പ്.
            </span>
          </div>

          <div>
            <label className="block font-bold text-text mb-1">
              ഔദ്യോഗിക WhatsApp ചാനൽ ലിങ്ക്
            </label>
            <input
              type="url"
              value={settings.whatsapp_channel_url}
              onChange={(e) => setSettings({ ...settings, whatsapp_channel_url: e.target.value })}
              placeholder="https://whatsapp.com/channel/..."
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 font-mono text-text focus:outline-none focus:border-accent"
            />
            <span className="text-[10px] text-text-muted mt-1 block">
              കേരളത്തിലെ വായനക്കാർക്ക് തത്സമയ വാർത്തകൾ നൽകുന്ന വാട്ട്‌സ്ആപ്പ് ചാനൽ ലിങ്ക്.
            </span>
          </div>
        </div>
      </div>

      {/* Breaking News Ticker Configuration */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        <div className="border-b border-border pb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-bold font-reading text-text flex items-center gap-2">
            <span>🚨</span>
            <span>ബ്രേക്കിംഗ് ന്യൂസ് സ്ട്രിപ്പ് (Breaking News Alert Bar)</span>
          </h2>

          <label className="flex items-center space-x-2 cursor-pointer text-xs font-bold text-text">
            <input
              type="checkbox"
              checked={settings.breaking_news_active}
              onChange={(e) => setSettings({ ...settings, breaking_news_active: e.target.checked })}
              className="rounded text-accent focus:ring-accent"
            />
            <span>{settings.breaking_news_active ? 'സജീവം (Active)' : 'മറയ്ക്കുക (Hidden)'}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block font-bold text-text mb-1">ബ്രേക്കിംഗ് വാർത്താ വാചകം (Alert Text)</label>
            <input
              type="text"
              value={settings.breaking_news_text}
              onChange={(e) => setSettings({ ...settings, breaking_news_text: e.target.value })}
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-reading focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block font-bold text-text mb-1">ലിങ്ക് ചെയ്യുന്ന പേജ് (Link URL)</label>
            <input
              type="text"
              value={settings.breaking_news_link}
              onChange={(e) => setSettings({ ...settings, breaking_news_link: e.target.value })}
              placeholder="/article/slug അല്ലെങ്കിൽ /tools/gold-rate"
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 font-mono text-text focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* Maintenance Mode */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-text">മെയിന്റനൻസ് മോഡ് (Maintenance Mode)</h2>
            <p className="text-xs text-text-muted mt-0.5">
              സജീവമാക്കിയാൽ പൊതു വായനക്കാർക്ക് വെബ്‌സൈറ്റ് നവീകരണ സന്ദേശം ദൃശ്യമാകും (അഡ്മിനുകൾക്ക് CMS ലഭ്യമായിരിക്കും).
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenance_mode}
              onChange={(e) => setSettings({ ...settings, maintenance_mode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-surface-raised peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
          </label>
        </div>
      </div>
    </form>
  );
}
