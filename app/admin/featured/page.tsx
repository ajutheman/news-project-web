'use client';

import React, { useState, useEffect } from 'react';
import { Article, HomeSlot } from '@/lib/types';

export default function AdminFeaturedSlotsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [slots, setSlots] = useState<HomeSlot[]>([]);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    fetch('/api/v1/articles?limit=50')
      .then(res => res.json())
      .then(data => {
        if (data.articles) setArticles(data.articles);
      })
      .catch(() => {});

    fetch('/api/v1/home-slots')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setSlots(data);
      })
      .catch(() => {});
  }, []);

  const handleSlotChange = async (slot_key: HomeSlot['slot_key'], position: number, article_id: string) => {
    try {
      const res = await fetch('/api/v1/home-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slot_key, position, article_id })
      });
      const data = await res.json();
      if (data.success) {
        setSlots(prev => {
          const filtered = prev.filter(s => !(s.slot_key === slot_key && s.position === position));
          return [...filtered, { slot_key, position, article_id }];
        });
        setSavedMessage('ഹോം സ്ലോട്ട് വിജയകരമായി മാറ്റി!');
        setTimeout(() => setSavedMessage(''), 3000);
      }
    } catch {
      alert('സ്ലോട്ട് അപ്ഡേറ്റ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു.');
    }
  };

  const getArticleIdForSlot = (key: string, pos: number) => {
    return slots.find(s => s.slot_key === key && s.position === pos)?.article_id || '';
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl md:text-2xl font-bold font-reading text-text">
          ഹോം പേജ് ഫീച്ചേർഡ് സ്ലോട്ടുകൾ (Featured &amp; Pinned Stories)
        </h1>
        <p className="text-xs text-text-muted">
          ഹോം പേജിലെ പ്രധാന വാർത്ത (Hero), ബ്രേക്കിങ് ന്യൂസ് ടിക്കർ എന്നിവയിലേക്ക് ലേഖനങ്ങൾ പിൻ ചെയ്യുക.
        </p>
      </div>

      {savedMessage && (
        <div className="bg-success text-white text-xs font-bold p-3 rounded-lg shadow">
          ✓ {savedMessage}
        </div>
      )}

      {/* Hero Story Slot */}
      <div className="bg-surface border-2 border-accent/40 rounded-xl p-5 shadow-card space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold font-reading text-text flex items-center gap-2">
            <span>⭐</span>
            <span>പ്രധാന ലീഡ് സ്റ്റോറി (Hero Story - Home Top)</span>
          </span>
          <span className="text-[10px] bg-accent text-white font-bold px-2 py-0.5 rounded uppercase">
            Slot: hero [0]
          </span>
        </div>
        <p className="text-xs text-text-muted">
          ഹോം പേജിന്റെ മുകൾഭാഗത്ത് വലിയ ചിത്രത്തോടും തലക്കെട്ടോടും കൂടി കാണിക്കുന്ന പ്രധാന വാർത്ത.
        </p>
        <select
          value={getArticleIdForSlot('hero', 0)}
          onChange={(e) => handleSlotChange('hero', 0, e.target.value)}
          className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-xs font-semibold text-text"
        >
          <option value="">-- ലേഖനം തിരഞ്ഞെടുക്കുക --</option>
          {articles.map((a) => (
            <option key={a.id} value={a.id}>
              [{a.category?.name_ml}] {a.title}
            </option>
          ))}
        </select>
      </div>

      {/* Breaking News Ticker Slots */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        <h2 className="text-sm font-bold font-reading text-text border-b border-border pb-2">
          🔴 ബ്രേക്കിങ് ന്യൂസ് ടിക്കർ സ്ലോട്ടുകൾ (Breaking Ticker)
        </h2>

        {[0, 1, 2].map((pos) => (
          <div key={pos} className="space-y-1">
            <label className="text-xs font-semibold text-text-muted block">
              ബ്രേക്കിങ് വാർത്ത #{pos + 1}:
            </label>
            <select
              value={getArticleIdForSlot('breaking', pos)}
              onChange={(e) => handleSlotChange('breaking', pos, e.target.value)}
              className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
            >
              <option value="">-- വാർത്ത തിരഞ്ഞെടുക്കുക --</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Top Markets Slots */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
        <h2 className="text-sm font-bold font-reading text-text border-b border-border pb-2">
          📈 വിപണി &amp; ബിസിനസ് ഫീച്ചേർഡ് സ്ലോട്ടുകൾ
        </h2>

        {[0, 1].map((pos) => (
          <div key={pos} className="space-y-1">
            <label className="text-xs font-semibold text-text-muted block">
              മാർക്കറ്റ് സ്റ്റോറി #{pos + 1}:
            </label>
            <select
              value={getArticleIdForSlot('top_markets', pos)}
              onChange={(e) => handleSlotChange('top_markets', pos, e.target.value)}
              className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
            >
              <option value="">-- വാർത്ത തിരഞ്ഞെടുക്കുക --</option>
              {articles.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
