'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BusinessListing } from '@/lib/types';
import { AdSlot } from '@/components/AdSlot';

export default function BusinessDirectoryPage() {
  const [businesses, setBusinesses] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showListingModal, setShowListingModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/v1/directory')
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses) setBusinesses(data.businesses);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load directory:', err);
        setLoading(false);
      });
  }, []);

  const categories = [
    'all',
    'ധനകാര്യം & ബാങ്കിംഗ്',
    'സ്വർണം & ആഭരണം',
    'ഐടി & സോഫ്റ്റ്‌വെയർ',
    'ഹെൽത്ത് കെയർ',
    'റിയൽ എസ്റ്റേറ്റ്',
    'വിദ്യാഭ്യാസം',
  ];

  const districts = [
    'all',
    'എറണാകുളം',
    'തിരുവനന്തപുരം',
    'തൃശ്ശൂർ',
    'കോഴിക്കോട്',
    'കണ്ണൂർ',
    'മലപ്പുറം',
    'കോട്ടയം',
    'പാലക്കാട്',
    'കൊല്ലം',
  ];

  const filtered = businesses.filter((b) => {
    const bCat = b.category_ml || b.category || '';
    if (selectedCategory !== 'all' && bCat !== selectedCategory) return false;
    if (selectedDistrict !== 'all' && b.district !== selectedDistrict) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        b.name_ml.toLowerCase().includes(q) ||
        b.name_en.toLowerCase().includes(q) ||
        (b.description_ml || b.description || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-accent/15 via-surface to-accent/5 border border-border rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
            <span>💼</span>
            <span>കേരള ബിസിനസ്സ് ഡയറക്ടറി (Business Directory)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-reading text-text leading-tight">
            കേരളത്തിലെ പ്രമുഖ സംരംഭങ്ങളെയും സേവനങ്ങളെയും അടുത്തറിയാം
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            ധനകാര്യം, ടെക്നോളജി, സ്വർണം, റിയൽ എസ്റ്റേറ്റ്, വിദ്യാഭ്യാസം തുടങ്ങി വിവിധ മേഖലകളിലെ വിശ്വസ്തരായ സംരംഭകരെ നേരിട്ട് ബന്ധപ്പെടുക.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setShowListingModal(true)}
              className="bg-accent hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-pill text-xs shadow-sm flex items-center gap-1.5"
            >
              <span>✨</span>
              <span>നിങ്ങളുടെ ബിസിനസ്സ് ലിസ്റ്റ് ചെയ്യുക</span>
            </button>
            <a
              href="#listings"
              className="bg-surface border border-border hover:bg-surface-raised text-text font-semibold px-4 py-2.5 rounded-pill text-xs"
            >
              ഡയറക്ടറി പരിശോധിക്കുക ↓
            </a>
          </div>
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <AdSlot slotKey="header_banner" />

      {/* Search and Filters Bar */}
      <div id="listings" className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="കമ്പനി അല്ലെങ്കിൽ സേവനം തിരയുക..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-raised border border-border-input rounded-lg pl-9 pr-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
            />
            <span className="absolute left-3 top-2.5 text-text-muted text-xs">🔍</span>
          </div>

          {/* District Dropdown */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-xs text-text font-semibold focus:outline-none focus:border-accent"
            >
              <option value="all">📍 എല്ലാ ജില്ലകളും (All Districts)</option>
              {districts.filter((d) => d !== 'all').map((d) => (
                <option key={d} value={d}>📍 {d}</option>
              ))}
            </select>
          </div>

          {/* Results Count & Reset */}
          <div className="flex items-center justify-between text-xs text-text-muted px-2">
            <span>ലഭ്യമായ സ്ഥാപനങ്ങൾ: <strong className="text-text">{filtered.length}</strong></span>
            {(selectedCategory !== 'all' || selectedDistrict !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedDistrict('all');
                  setSearchQuery('');
                }}
                className="text-accent font-bold hover:underline"
              >
                ഫിൽട്ടർ ഒഴിവാക്കുക ↺
              </button>
            )}
          </div>
        </div>

        {/* Category Chips Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-pill whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-accent text-white font-bold'
                  : 'bg-surface-raised border border-border text-text hover:bg-border'
              }`}
            >
              {cat === 'all' ? 'എല്ലാ വിഭാഗങ്ങളും' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Cards Grid */}
      {loading ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center text-xs text-text-muted">
          ഡയറക്ടറി വിവരങ്ങൾ ലഭ്യമാക്കുന്നു...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center space-y-2">
          <span className="text-3xl">🔍</span>
          <h3 className="font-bold text-text font-reading">സ്ഥാപനങ്ങൾ കണ്ടെത്താനായില്ല</h3>
          <p className="text-xs text-text-muted">തിരഞ്ഞെടുത്ത ഫിൽട്ടറുകൾ മാറ്റി വീണ്ടും തിരയുക.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((biz) => (
            <div
              key={biz.id}
              className={`bg-surface border rounded-xl p-5 shadow-card space-y-4 transition-all relative overflow-hidden ${
                biz.tier === 'platinum'
                  ? 'border-purple-500/40 ring-1 ring-purple-500/20'
                  : biz.tier === 'gold'
                  ? 'border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'border-border'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  {biz.logo_url ? (
                    <img
                      src={biz.logo_url}
                      alt={biz.name_ml}
                      className="w-12 h-12 rounded-xl object-cover border border-border shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 text-accent font-black text-lg flex items-center justify-center font-reading">
                      {biz.name_ml.charAt(0)}
                    </div>
                  )}

                  <div>
                    <h3 className="font-bold text-base text-text font-reading flex items-center gap-1.5">
                      <span>{biz.name_ml}</span>
                      {biz.is_verified && (
                        <span className="text-blue-500 text-xs" title="വേരിഫൈഡ് സ്ഥാപനം">
                          ✓
                        </span>
                      )}
                    </h3>
                    <div className="text-xs text-text-muted font-medium">{biz.name_en}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  biz.tier === 'platinum'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                    : biz.tier === 'gold'
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                    : 'bg-surface-raised text-text-muted border border-border'
                }`}>
                  {biz.tier}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                {biz.description_ml}
              </p>

              {/* Tags & Address */}
              <div className="text-xs text-text-muted flex flex-wrap items-center gap-3 pt-2 border-t border-border">
                <span className="bg-surface-raised px-2 py-0.5 rounded text-[11px] font-semibold text-text">
                  📂 {biz.category_ml}
                </span>
                <span className="text-[11px]">📍 {biz.district}</span>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {biz.phone && (
                  <a
                    href={`tel:${biz.phone}`}
                    className="flex-1 bg-surface-raised hover:bg-border text-text font-bold py-2 px-3 rounded-lg text-xs text-center border border-border transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>📞</span>
                    <span>വിളിക്കുക</span>
                  </a>
                )}

                {biz.whatsapp && (
                  <a
                    href={`https://wa.me/${biz.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>💬</span>
                    <span>വാട്ട്‌സ്ആപ്പ്</span>
                  </a>
                )}

                {biz.website && (
                  <a
                    href={biz.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-surface-raised hover:bg-border text-text font-bold p-2 rounded-lg text-xs border border-border transition-colors"
                    title="വെബ്‌സൈറ്റ് സന്ദർശിക്കുക"
                  >
                    🌐
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Listing Submission Modal */}
      {showListingModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold font-reading text-base text-text">
                നിങ്ങളുടെ ബിസിനസ്സ് ലിസ്റ്റ് ചെയ്യുക (List Your Business)
              </h3>
              <button onClick={() => setShowListingModal(false)} className="text-text-muted hover:text-text text-lg">
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-3">
                <span className="text-4xl">🎉</span>
                <h4 className="font-bold text-text font-reading text-base">വിവരങ്ങൾ സ്വീകരിച്ചു!</h4>
                <p className="text-xs text-text-muted">
                  ഞങ്ങളുടെ ബിസിനസ്സ് ഡെസ്ക് നിങ്ങളുടെ അപേക്ഷ പരിശോധിച്ച ശേഷം വേരിഫിക്കേഷൻ പൂർത്തിയാക്കും.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setShowListingModal(false);
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
                  <label className="block font-bold text-text mb-1">സ്ഥാപനത്തിന്റെ പേര്</label>
                  <input
                    type="text"
                    required
                    placeholder="സ്ഥാപന നാമം"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">വിഭാഗം</label>
                    <select className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text">
                      <option>ധനകാര്യം & ബാങ്കിംഗ്</option>
                      <option>സ്വർണം & ആഭരണം</option>
                      <option>ഐടി & സോഫ്റ്റ്‌വെയർ</option>
                      <option>റിയൽ എസ്റ്റേറ്റ്</option>
                      <option>വിദ്യാഭ്യാസം</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-text mb-1">ജില്ല</label>
                    <select className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text">
                      <option>എറണാകുളം</option>
                      <option>തിരുവനന്തപുരം</option>
                      <option>കോഴിക്കോട്</option>
                      <option>തൃശ്ശൂർ</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-text mb-1">ഫോൺ നമ്പർ</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98XXXXXXXX"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-text mb-1">ഇമെയിൽ</label>
                    <input
                      type="email"
                      required
                      placeholder="contact@business.com"
                      className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                    />
                  </div>
                </div>

                <div className="bg-surface-raised p-3 rounded-lg border border-border space-y-1">
                  <div className="font-bold text-text text-[11px]">ലിസ്റ്റിംഗ് പ്ലാനുകൾ:</div>
                  <div className="text-[10px] text-text-muted space-y-0.5">
                    <div>• ഫീച്ചേർഡ് പ്ലാൻ: ₹5,000/വർഷം (വേരിഫൈഡ് ബാഡ്ജ് + വാട്ട്‌സ്ആപ്പ് ബട്ടൺ)</div>
                    <div>• ഗോൾഡ് പ്ലാൻ: ₹15,000/വർഷം (വിഭാഗത്തിന്റെ മുകൾനിരയിൽ ഫീച്ചർ)</div>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowListingModal(false)}
                    className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-border text-text font-semibold"
                  >
                    റദ്ദാക്കുക
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-accent hover:opacity-90 text-white font-bold"
                  >
                    അപേക്ഷ സമർപ്പിക്കുക
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
