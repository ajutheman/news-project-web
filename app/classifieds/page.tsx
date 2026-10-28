'use client';

import React, { useState, useEffect } from 'react';
import { ClassifiedAd } from '@/lib/types';
import { AdSlot } from '@/components/AdSlot';

export default function ClassifiedsPage() {
  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/v1/classifieds')
      .then((res) => res.json())
      .then((data) => {
        if (data.classifieds) setAds(data.classifieds);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load classifieds:', err);
        setLoading(false);
      });
  }, []);

  const categories = [
    'all',
    'വാണിജ്യ സ്ഥലം (Commercial Real Estate)',
    'വിൽപനയ്ക്കുള്ള സംരംഭങ്ങൾ (Businesses For Sale)',
    'മെഷിനറി & ഉപകരണങ്ങൾ (Machinery)',
    'വാഹനങ്ങൾ (Commercial Vehicles)',
  ];

  const filtered = ads.filter((ad) => {
    if (!ad.is_active) return false;
    if (selectedCategory !== 'all' && ad.category_ml !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-500/15 via-surface to-accent/10 border border-border rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold">
            <span>📢</span>
            <span>ക്ലാസിഫൈഡ്സ് പരസ്യങ്ങൾ (The Profit Classifieds)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-reading text-text leading-tight">
            വാണിജ്യ ആവശ്യങ്ങൾക്കായുള്ള ക്ലാസിഫൈഡ് വിപണി
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            വാണിജ്യ കെട്ടിടങ്ങൾ, വിൽപനയ്ക്കുള്ള സംരംഭങ്ങൾ, വ്യാവസായിക യന്ത്രങ്ങൾ, നിക്ഷേപ പങ്കാളിത്തങ്ങൾ എന്നിവയ്ക്കുള്ള വിശ്വാസ്യതയാർന്ന ക്ലാസിഫൈഡ്സ്.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setShowPostModal(true)}
              className="bg-accent hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-pill text-xs shadow-sm flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>ക്ലാസിഫൈഡ് പരസ്യം നൽകുക (Post an Ad)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <AdSlot slotKey="header_banner" />

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-pill font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-accent text-white shadow-sm'
                : 'bg-surface border border-border text-text hover:bg-surface-raised'
            }`}
          >
            {cat === 'all' ? 'എല്ലാ പരസ്യങ്ങളും' : cat}
          </button>
        ))}
      </div>

      {/* Classifieds Grid */}
      {loading ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center text-xs text-text-muted">
          പരസ്യങ്ങൾ ലഭ്യമാക്കുന്നു...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center space-y-2">
          <span className="text-3xl">📢</span>
          <h3 className="font-bold text-text font-reading">പരസ്യങ്ങൾ കണ്ടെത്താനായില്ല</h3>
          <p className="text-xs text-text-muted">മറ്റൊരു വിഭാഗം തിരഞ്ഞെടുക്കുക.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((ad) => (
            <div
              key={ad.id}
              className="bg-surface border border-border hover:border-accent/40 rounded-xl overflow-hidden shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                {ad.image_url && (
                  <div className="relative aspect-[16/10] bg-surface-raised overflow-hidden">
                    <img
                      src={ad.image_url}
                      alt={ad.title_ml}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-xs font-mono font-bold px-2.5 py-1 rounded">
                      {ad.price_display}
                    </span>
                  </div>
                )}

                <div className="p-5 space-y-2.5">
                  <div className="text-[11px] font-bold text-accent uppercase tracking-wider">
                    {ad.category_ml}
                  </div>
                  <h3 className="font-bold text-base text-text font-reading leading-snug">
                    {ad.title_ml}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                    {ad.description_ml}
                  </p>
                  <div className="text-[11px] text-text-muted pt-2 border-t border-border">
                    📍 {ad.district}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center gap-2">
                <a
                  href={`tel:${ad.contact_phone}`}
                  className="flex-1 bg-surface-raised hover:bg-border text-text font-bold py-2 px-3 rounded-lg text-xs text-center border border-border transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>📞</span>
                  <span>വിളിക്കുക</span>
                </a>
                <a
                  href={`https://wa.me/${ad.contact_phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>💬</span>
                  <span>വാട്ട്‌സ്ആപ്പ്</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Classified Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold font-reading text-base text-text">
                ക്ലാസിഫൈഡ് പരസ്യം നൽകുക (Post a Classified Ad)
              </h3>
              <button onClick={() => setShowPostModal(false)} className="text-text-muted hover:text-text text-lg">
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <span className="text-4xl">🎉</span>
                <h4 className="font-bold text-text font-reading text-base">പരസ്യം സ്വീകരിച്ചു!</h4>
                <p className="text-xs text-text-muted">
                  ഞങ്ങളുടെ ക്ലാസിഫൈഡ് ഡെസ്ക് പരിശോധിച്ച ശേഷം 1 മണിക്കൂറിനുള്ളിൽ നിങ്ങളുടെ പരസ്യം ലൈവ് ആകും.
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
                  <label className="block font-bold text-text mb-1">പരസ്യ തലക്കെട്ട്</label>
                  <input
                    type="text"
                    required
                    placeholder="ഉദാ: കൊച്ചി എം.ജി റോഡിൽ വാണിജ്യ കെട്ടിടം വാടകയ്ക്ക്"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-reading"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">വിഭാഗം</label>
                    <select className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text">
                      <option>വാണിജ്യ സ്ഥലം (Commercial Real Estate)</option>
                      <option>വിൽപനയ്ക്കുള്ള സംരംഭങ്ങൾ (Businesses For Sale)</option>
                      <option>മെഷിനറി & ഉപകരണങ്ങൾ (Machinery)</option>
                      <option>വാഹനങ്ങൾ (Commercial Vehicles)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-text mb-1">വില / വാടക</label>
                    <input
                      type="text"
                      required
                      placeholder="₹85,000/മാസം"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">ജില്ല</label>
                    <select className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text">
                      <option>എറണാകുളം</option>
                      <option>തിരുവനന്തപുരം</option>
                      <option>കോഴിക്കോട്</option>
                      <option>തൃശ്ശൂർ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-text mb-1">ഫോൺ / വാട്ട്‌സ്ആപ്പ് നമ്പർ</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXXXXXXX"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-text mb-1">വിശദാംശങ്ങൾ</label>
                  <textarea
                    rows={3}
                    placeholder="കെട്ടിടത്തിന്റെ വിസ്തീർണ്ണം, സൗകര്യങ്ങൾ..."
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>

                <div className="bg-surface-raised p-3 rounded-lg border border-border space-y-1">
                  <div className="font-bold text-text text-[11px]">പരസ്യ നിരക്ക്:</div>
                  <div className="text-[10px] text-text-muted">
                    15 ദിവസത്തേക്ക്: ₹750 | 30 ദിവസത്തേക്ക്: ₹1,200 (ഫോട്ടോ ഉൾപ്പെടെ)
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
                    സമർപ്പിക്കുക
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
