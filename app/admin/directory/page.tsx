'use client';

import React, { useState, useEffect } from 'react';
import { BusinessListing } from '@/lib/types';

export default function AdminDirectoryPage() {
  const [businesses, setBusinesses] = useState<BusinessListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newBiz, setNewBiz] = useState<Partial<BusinessListing>>({
    name_ml: '',
    name_en: '',
    category_ml: 'ധനകാര്യം & ബാങ്കിംഗ്',
    district: 'എറണാകുളം',
    phone: '',
    whatsapp: '',
    tier: 'featured',
    is_verified: true,
    website: '',
    address_ml: '',
    description_ml: '',
  });

  const fetchBusinesses = () => {
    fetch('/api/v1/directory')
      .then((res) => res.json())
      .then((data) => {
        if (data.businesses) setBusinesses(data.businesses);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load businesses:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleToggleVerified = async (id: string, current: boolean) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_verified: !current } : b))
    );

    try {
      await fetch('/api/v1/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_verified: !current }),
      });
    } catch (err) {
      console.error('Failed to update verification:', err);
      fetchBusinesses();
    }
  };

  const handleAddBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/v1/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBiz),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewBiz({
          name_ml: '',
          name_en: '',
          category_ml: 'ധനകാര്യം & ബാങ്കിംഗ്',
          district: 'എറണാകുളം',
          phone: '',
          whatsapp: '',
          tier: 'featured',
          is_verified: true,
          website: '',
          address_ml: '',
          description_ml: '',
        });
        fetchBusinesses();
      }
    } catch (err) {
      console.error('Failed to add business:', err);
      alert('ബിസിനസ്സ് ചേർക്കുന്നതിൽ പിശക് സംഭവിച്ചു.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = businesses.filter((b) => {
    if (filterTier === 'all') return true;
    return b.tier === filterTier;
  });

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black font-reading text-text flex items-center gap-2">
            <span>💼</span>
            <span>ബിസിനസ്സ് ഡയറക്ടറി മാനേജ്മെന്റ് (Paid Business Listings)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            സ്ഥാപനങ്ങൾ നൽകുന്ന പെയ്ഡ് പ്രൊഫൈലുകൾ, വേരിഫൈഡ് ബാഡ്ജുകൾ, കോൺടാക്റ്റ് വിവരങ്ങൾ നിയന്ത്രിക്കുക.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-accent hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm flex items-center space-x-1.5"
        >
          <span>✨</span>
          <span>+ പുതിയ ലിസ്റ്റിംഗ് ചേർക്കുക</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-text-muted font-bold">പ്ലാൻ ഫിൽട്ടർ:</span>
        {['all', 'platinum', 'gold', 'featured', 'free'].map((tier) => (
          <button
            key={tier}
            onClick={() => setFilterTier(tier)}
            className={`px-3 py-1 rounded-pill font-semibold capitalize transition-colors ${
              filterTier === tier
                ? 'bg-accent text-white'
                : 'bg-surface border border-border text-text hover:bg-surface-raised'
            }`}
          >
            {tier === 'all' ? 'എല്ലാം (All)' : tier}
          </button>
        ))}
      </div>

      {/* Directory Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">ഡാറ്റ ലഭ്യമാക്കുന്നു...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">സ്ഥാപനം (Business)</th>
                  <th className="py-3 px-3">വിഭാഗം</th>
                  <th className="py-3 px-3">ജില്ല</th>
                  <th className="py-3 px-3">പ്ലാൻ (Tier)</th>
                  <th className="py-3 px-3 text-center">വേരിഫൈഡ്</th>
                  <th className="py-3 px-4 text-right">ഫോൺ / വാട്ട്‌സ്ആപ്പ്</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((biz) => (
                  <tr key={biz.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-text font-reading flex items-center gap-1.5">
                        <span>{biz.name_ml}</span>
                        {biz.is_verified && <span className="text-blue-500 text-xs">✓</span>}
                      </div>
                      <div className="text-[11px] text-text-muted">{biz.name_en}</div>
                    </td>

                    <td className="py-3 px-3 text-text font-medium">{biz.category_ml}</td>
                    <td className="py-3 px-3 text-text-muted">{biz.district}</td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        biz.tier === 'platinum'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                          : biz.tier === 'gold'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : biz.tier === 'featured'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-surface-raised text-text-muted border border-border'
                      }`}>
                        {biz.tier}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleVerified(biz.id, biz.is_verified)}
                        className={`text-xs px-2 py-0.5 rounded font-bold ${
                          biz.is_verified
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-surface-raised text-text-muted'
                        }`}
                      >
                        {biz.is_verified ? 'Verified ✓' : 'Unverified'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right font-mono text-[11px] text-text">
                      <div>{biz.phone || '-'}</div>
                      <div className="text-emerald-600">{biz.whatsapp ? `WA: ${biz.whatsapp}` : ''}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold font-reading text-base text-text">
                പുതിയ ബിസിനസ്സ് ചേർക്കുക (Add Business)
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBusiness} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">സ്ഥാപന നാമം (മലയാളം)</label>
                  <input
                    type="text"
                    required
                    value={newBiz.name_ml}
                    onChange={(e) => setNewBiz({ ...newBiz, name_ml: e.target.value })}
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-reading"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">Company Name (English)</label>
                  <input
                    type="text"
                    required
                    value={newBiz.name_en}
                    onChange={(e) => setNewBiz({ ...newBiz, name_en: e.target.value })}
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">വിഭാഗം</label>
                  <select
                    value={newBiz.category_ml}
                    onChange={(e) => setNewBiz({ ...newBiz, category_ml: e.target.value })}
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  >
                    <option value="ധനകാര്യം & ബാങ്കിംഗ്">ധനകാര്യം &amp; ബാങ്കിംഗ്</option>
                    <option value="സ്വർണം & ആഭരണം">സ്വർണം &amp; ആഭരണം</option>
                    <option value="ഐടി & സോഫ്റ്റ്‌വെയർ">ഐടി &amp; സോഫ്റ്റ്‌വെയർ</option>
                    <option value="ഹെൽത്ത് കെയർ">ഹെൽത്ത് കെയർ</option>
                    <option value="റിയൽ എസ്റ്റേറ്റ്">റിയൽ എസ്റ്റേറ്റ്</option>
                    <option value="വിദ്യാഭ്യാസം">വിദ്യാഭ്യാസം</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">ജില്ല</label>
                  <select
                    value={newBiz.district}
                    onChange={(e) => setNewBiz({ ...newBiz, district: e.target.value })}
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  >
                    {['എറണാകുളം', 'തിരുവനന്തപുരം', 'തൃശ്ശൂർ', 'കോഴിക്കോട്', 'കണ്ണൂർ', 'മലപ്പുറം', 'കോട്ടയം', 'കൊല്ലം', 'പാലക്കാട്', 'ആലപ്പുഴ', 'കാസർഗോഡ്', 'പത്തനംതിട്ട', 'ഇടുക്കി', 'വയനാട്'].map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">ഫോൺ നമ്പർ</label>
                  <input
                    type="text"
                    value={newBiz.phone}
                    onChange={(e) => setNewBiz({ ...newBiz, phone: e.target.value })}
                    placeholder="+91 484 XXXXXXX"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">വാട്ട്‌സ്ആപ്പ് നമ്പർ</label>
                  <input
                    type="text"
                    value={newBiz.whatsapp}
                    onChange={(e) => setNewBiz({ ...newBiz, whatsapp: e.target.value })}
                    placeholder="+91 98XXXXXXXX"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">ലിസ്റ്റിംഗ് പ്ലാൻ (Tier)</label>
                  <select
                    value={newBiz.tier}
                    onChange={(e) => setNewBiz({ ...newBiz, tier: e.target.value as any })}
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-bold"
                  >
                    <option value="platinum">പ്ലാറ്റിനം (Platinum - ₹25,000/yr)</option>
                    <option value="gold">ഗോൾഡ് (Gold - ₹15,000/yr)</option>
                    <option value="featured">ഫീച്ചേർഡ് (Featured - ₹5,000/yr)</option>
                    <option value="free">സൗജന്യ ലിസ്റ്റിംഗ് (Free)</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center space-x-2 cursor-pointer font-bold text-text">
                    <input
                      type="checkbox"
                      checked={newBiz.is_verified}
                      onChange={(e) => setNewBiz({ ...newBiz, is_verified: e.target.checked })}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span>വേരിഫൈഡ് ബാഡ്ജ് നൽകുക</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-border text-text font-semibold"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-accent hover:opacity-90 text-white font-bold"
                >
                  {saving ? 'സേവ് ചെയ്യുന്നു...' : 'ലിസ്റ്റ് ചെയ്യുക'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
