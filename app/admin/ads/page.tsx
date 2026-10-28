'use client';

import React, { useState, useEffect } from 'react';
import { AdSlotConfig, AdSenseSettings, AdSlotKey } from '@/lib/types';

const SLOT_LABELS: Record<AdSlotKey, { name: string; desc: string; size: string }> = {
  header_banner: {
    name: 'ഹെഡർ ലീഡർബോർഡ് (Header Banner)',
    desc: 'ഹോം പേജിന്റെ മുകൾഭാഗത്ത് ലോഗോയ്ക്കും പ്രധാന വാർത്തകൾക്കും താഴെ പ്രദർശിപ്പിക്കുന്നു.',
    size: '728 × 90 px',
  },
  sidebar_banner: {
    name: 'സൈഡ്ബാർ എം.പി.യു (Sidebar MPU)',
    desc: 'വാർത്തകളുടെയും ഹോം പേജിന്റെയും വലതുവശത്ത് നിരക്കുകൾക്ക് താഴെ പ്രദർശിപ്പിക്കുന്നു.',
    size: '300 × 250 px',
  },
  article_middle: {
    name: 'ലേഖനത്തിനിടയിലെ പരസ്യം (In-Article)',
    desc: 'വായനക്കാർ ലേഖനം വായിക്കുമ്പോൾ 3-ാം പാരഗ്രാഫിനു ശേഷം സ്വാഭാവികമായി ദൃശ്യമാകുന്നു.',
    size: 'റെസ്പോൺസീവ് (Responsive)',
  },
  footer_banner: {
    name: 'ഫൂട്ടർ ലീഡർബോർഡ് (Footer Banner)',
    desc: 'പേജിന്റെ ഏറ്റവും താഴെ പ്രധാന ലിങ്കുകൾക്ക് മുകളിൽ പ്രദർശിപ്പിക്കുന്നു.',
    size: '728 × 90 px',
  },
  sticky_mobile: {
    name: 'മൊബൈൽ സ്റ്റിക്കി ആങ്കർ (Sticky Mobile Banner)',
    desc: 'മൊബൈൽ ഫോണുകളിൽ സ്ക്രീനിന്റെ അടിഭാഗത്ത് സ്ഥിരമായി നിൽക്കുന്ന പരസ്യ സ്ലോട്ട്.',
    size: '320 × 50 px',
  },
};

const DEFAULT_SLOT_FIELDS: Omit<AdSlotConfig, 'slot_key'> = {
  is_active: true,
  ad_type: 'direct',
  provider: 'direct',
  direct_banner_url: '',
  direct_image_url: '',
  direct_target_url: '',
  direct_link_url: '',
  direct_alt_text: '',
  direct_title: '',
  direct_campaign_name: '',
  direct_sponsor_name: '',
  adsense_slot_id: '',
  impressions: 0,
  clicks: 0,
};

function buildInitialSlotsMap(): Record<AdSlotKey, AdSlotConfig> {
  const map: Partial<Record<AdSlotKey, AdSlotConfig>> = {};
  (Object.keys(SLOT_LABELS) as AdSlotKey[]).forEach((key) => {
    map[key] = {
      ...DEFAULT_SLOT_FIELDS,
      slot_key: key,
    };
  });
  return map as Record<AdSlotKey, AdSlotConfig>;
}

export default function AdminAdsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [adsense, setAdsense] = useState<AdSenseSettings>({
    publisher_id: 'ca-pub-9988776655443322',
    auto_ads_enabled: true,
  });
  const [slots, setSlots] = useState<Record<AdSlotKey, AdSlotConfig>>(buildInitialSlotsMap);

  useEffect(() => {
    fetch('/api/v1/ads')
      .then((res) => res.json())
      .then((data) => {
        if (data.adsense) {
          setAdsense({
            publisher_id: data.adsense.publisher_id || '',
            auto_ads_enabled: data.adsense.auto_ads_enabled ?? true,
          });
        }
        if (data.slots) {
          const map = buildInitialSlotsMap();
          const list: AdSlotConfig[] = Array.isArray(data.slots)
            ? data.slots
            : Object.values(data.slots);

          list.forEach((s) => {
            if (s && s.slot_key && map[s.slot_key]) {
              map[s.slot_key] = {
                ...map[s.slot_key],
                ...s,
                is_active: s.is_active ?? true,
                provider: s.provider || (s.ad_type === 'adsense' ? 'adsense' : 'direct'),
                ad_type: s.ad_type || s.provider || 'direct',
                direct_banner_url: s.direct_banner_url || s.direct_image_url || '',
                direct_image_url: s.direct_image_url || s.direct_banner_url || '',
                direct_target_url: s.direct_target_url || s.direct_link_url || '',
                direct_link_url: s.direct_link_url || s.direct_target_url || '',
                direct_alt_text: s.direct_alt_text || s.direct_title || '',
                direct_title: s.direct_title || s.direct_alt_text || '',
                direct_campaign_name: s.direct_campaign_name || s.direct_sponsor_name || '',
                direct_sponsor_name: s.direct_sponsor_name || s.direct_campaign_name || '',
                adsense_slot_id: s.adsense_slot_id || '',
                impressions: s.impressions ?? 0,
                clicks: s.clicks ?? 0,
              };
            }
          });
          setSlots(map);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load ads:', err);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/v1/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adsense, slots }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert('പരസ്യ ക്രമീകരണങ്ങൾ സേവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.');
      }
    } catch (err) {
      console.error('Failed to save ads:', err);
      alert('പരസ്യ ക്രമീകരണങ്ങൾ സേവ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.');
    } finally {
      setSaving(false);
    }
  };

  const updateSlot = (key: AdSlotKey, field: keyof AdSlotConfig, value: any) => {
    setSlots((prev) => {
      const current = prev[key] || { ...DEFAULT_SLOT_FIELDS, slot_key: key };
      const updated: AdSlotConfig = {
        ...current,
        [field]: value,
      };

      // Keep mirrored fields in sync for legacy compatibility
      if (field === 'provider') {
        updated.ad_type = value;
      }
      if (field === 'direct_banner_url') {
        updated.direct_image_url = value;
      }
      if (field === 'direct_target_url') {
        updated.direct_link_url = value;
      }
      if (field === 'direct_alt_text') {
        updated.direct_title = value;
      }
      if (field === 'direct_campaign_name') {
        updated.direct_sponsor_name = value;
      }

      return {
        ...prev,
        [key]: updated,
      };
    });
  };

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-muted">
        പരസ്യ ഡാറ്റ ലഭ്യമാക്കുന്നു...
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Page Title & Save Button */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black font-reading text-text flex items-center gap-2">
            <span>💰</span>
            <span>പരസ്യ മാനേജ്മെന്റ് &amp; ഗൂഗിൾ AdSense</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Google AdSense കോഡുകളും നേരിട്ടുള്ള പരസ്യദാതാക്കളുടെ ബാനറുകളും തത്സമയം ക്രമീകരിക്കുക.
          </p>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-lg text-xs transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
        >
          {saving ? (
            <span>സേവ് ചെയ്യുന്നു...</span>
          ) : saveSuccess ? (
            <span>✅ വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!</span>
          ) : (
            <span>💾 മാറ്റങ്ങൾ സേവ് ചെയ്യുക</span>
          )}
        </button>
      </div>

      {/* Google AdSense Master Configuration */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🌐</span>
            <div>
              <h2 className="text-sm font-bold font-reading text-text">
                ഗൂഗിൾ AdSense ക്രമീകരണങ്ങൾ (Google AdSense Settings)
              </h2>
              <p className="text-[11px] text-text-muted">
                ഗൂഗിൾ അഡ്‌സെൻസ് അക്കൗണ്ട് ഐഡി നൽകി വെബ്‌സൈറ്റിലുടനീളം ഓട്ടോമാറ്റിക് പരസ്യങ്ങൾ സജീവമാക്കുക.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
            AdSense Ready
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-text mb-1">
              ഗൂഗിൾ പബ്ലിഷർ ഐഡി (Publisher ID)
            </label>
            <input
              type="text"
              value={adsense.publisher_id || ''}
              onChange={(e) => setAdsense({ ...adsense, publisher_id: e.target.value })}
              placeholder="ca-pub-XXXXXXXXXXXXXXXX"
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 font-mono text-text focus:outline-none focus:border-accent"
            />
            <span className="text-[10px] text-text-muted mt-1 block">
              നിങ്ങളുടെ Google AdSense ഡാഷ്‌ബോർഡിലെ 16 അക്ക പബ്ലിഷർ ഐഡി ഇവിടെ നൽകുക.
            </span>
          </div>

          <div>
            <label className="block font-bold text-text mb-1">
              ഓട്ടോ ആഡ്സ് (Auto Ads)
            </label>
            <div className="flex items-center space-x-3 pt-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(adsense.auto_ads_enabled)}
                  onChange={(e) => setAdsense({ ...adsense, auto_ads_enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-raised peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
              <span className="text-xs text-text font-semibold">
                {adsense.auto_ads_enabled ? 'സജീവം (Enabled)' : 'നിഷ്ക്രിയം (Disabled)'}
              </span>
            </div>
            <span className="text-[10px] text-text-muted mt-1 block">
              ഗൂഗിൾ എഐ അനുയോജ്യമായ സ്ഥാനങ്ങളിൽ സ്വയം പരസ്യങ്ങൾ കാണിക്കാൻ അനുവദിക്കുന്നു.
            </span>
          </div>
        </div>
      </div>

      {/* Ad Slots & Direct Campaigns Configuration */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold font-reading text-text px-1">
          പ്രദർശന പരസ്യ സ്ലോട്ടുകൾ (Display Ad Placements)
        </h2>

        {(Object.keys(SLOT_LABELS) as AdSlotKey[]).map((key) => {
          const slot = slots[key] || {
            ...DEFAULT_SLOT_FIELDS,
            slot_key: key,
          };
          const meta = SLOT_LABELS[key];

          return (
            <div key={key} className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-text font-reading">{meta.name}</span>
                    <span className="text-[11px] font-mono bg-surface-raised text-text-muted px-2 py-0.5 rounded border border-border">
                      {meta.size}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">{meta.desc}</p>
                </div>

                {/* Status Toggle & Analytics */}
                <div className="flex items-center space-x-4">
                  <div className="text-right text-[11px] font-mono text-text-muted hidden sm:block">
                    <span>👁️ {(slot.impressions || 0).toLocaleString('en-IN')} ഇംപ്രഷൻസ്</span>
                    <span className="mx-2">•</span>
                    <span className="text-accent font-bold">🖱️ {(slot.clicks || 0).toLocaleString('en-IN')} ക്ലിക്കുകൾ</span>
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(slot.is_active)}
                      onChange={(e) => updateSlot(key, 'is_active', e.target.checked)}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span className="text-xs font-bold text-text">
                      {slot.is_active ? 'സജീവം (Active)' : 'ഓഫ് (Inactive)'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Slot Mode: Direct Banner vs Google AdSense */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-text mb-1">പരസ്യ ദാതാവ് (Provider)</label>
                  <select
                    value={slot.provider || 'direct'}
                    onChange={(e) => updateSlot(key, 'provider', e.target.value)}
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-semibold focus:outline-none focus:border-accent"
                  >
                    <option value="direct">നേരിട്ടുള്ള പരസ്യം (Direct Campaign / Sponsor)</option>
                    <option value="adsense">ഗൂഗിൾ AdSense (AdSense Ad Unit)</option>
                  </select>
                </div>

                {slot.provider === 'direct' ? (
                  <>
                    <div>
                      <label className="block font-bold text-text mb-1">ക്യാമ്പയിൻ പേര് (Campaign Name)</label>
                      <input
                        type="text"
                        value={slot.direct_campaign_name || ''}
                        onChange={(e) => updateSlot(key, 'direct_campaign_name', e.target.value)}
                        placeholder="ഉദാ: സൗത്ത് ഇന്ത്യൻ ബാങ്ക് ബിസിനസ്സ് ലോൺ"
                        className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-text mb-1">ലക്ഷ്യ ലിങ്ക് (Target Click URL)</label>
                      <input
                        type="url"
                        value={slot.direct_target_url || ''}
                        onChange={(e) => updateSlot(key, 'direct_target_url', e.target.value)}
                        placeholder="https://client-website.com"
                        className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 font-mono text-text focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block font-bold text-text mb-1">ബാനർ ഇമേജ് URL (Banner Image URL)</label>
                      <input
                        type="url"
                        value={slot.direct_banner_url || ''}
                        onChange={(e) => updateSlot(key, 'direct_banner_url', e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 font-mono text-text focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-text mb-1">പരസ്യ വിവരണം (Alt / Caption Text)</label>
                      <input
                        type="text"
                        value={slot.direct_alt_text || ''}
                        onChange={(e) => updateSlot(key, 'direct_alt_text', e.target.value)}
                        placeholder="സൗത്ത് ഇന്ത്യൻ ബാങ്ക് പരസ്യം"
                        className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
                      />
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2">
                    <label className="block font-bold text-text mb-1">AdSense സ്ലോട്ട് ഐഡി (AdSense Slot ID)</label>
                    <input
                      type="text"
                      value={slot.adsense_slot_id || ''}
                      onChange={(e) => updateSlot(key, 'adsense_slot_id', e.target.value)}
                      placeholder="1234567890"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 font-mono text-text focus:outline-none focus:border-accent"
                    />
                    <span className="text-[10px] text-text-muted mt-1 block">
                      Google AdSense-ൽ നിന്ന് സൃഷ്ടിച്ച ഈ നിശ്ചിത സ്ലോട്ടിന്റെ ഐഡി നൽകുക.
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </form>
  );
}
