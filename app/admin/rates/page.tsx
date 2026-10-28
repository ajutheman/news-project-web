'use client';

import React, { useState, useEffect } from 'react';
import { DailyRate, CurrencyRate } from '@/lib/types';

export default function AdminRatesPage() {
  const [rates, setRates] = useState<DailyRate[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bullion' | 'currency'>('bullion');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // New Currency Form State
  const [showAddCurrency, setShowAddCurrency] = useState(false);
  const [newCurrencyCode, setNewCurrencyCode] = useState('');
  const [newCurrencyNameEn, setNewCurrencyNameEn] = useState('');
  const [newCurrencyNameMl, setNewCurrencyNameMl] = useState('');
  const [newCurrencyRate, setNewCurrencyRate] = useState<number | ''>('');
  const [newCurrencyFlag, setNewCurrencyFlag] = useState('🌐');
  const [currencySearch, setCurrencySearch] = useState('');

  const fetchRates = () => {
    setLoading(true);
    fetch('/api/v1/rates')
      .then(res => res.json())
      .then(data => {
        if (data.rates) setRates(data.rates);
        if (data.currencies) setCurrencies(data.currencies);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        showNotification('നിരക്കുകൾ ലോഡ് ചെയ്യാൻ സാധിച്ചില്ല.', 'error');
      });
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // 1. Update Bullion Rate
  const handleRateUpdate = async (id: string, amount_inr: number, change_inr: number) => {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/v1/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, amount_inr, change_inr })
      });
      const data = await res.json();
      if (data.success) {
        setRates(prev => prev.map(r => r.id === id ? data.rate : r));
        showNotification('സ്വർണ/വെള്ളി നിരക്ക് വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!');
      } else {
        showNotification(data.error || 'അപ്ഡേറ്റ് പരാജയപ്പെട്ടു', 'error');
      }
    } catch {
      showNotification('നിരക്ക് അപ്ഡേറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // 2. Update Currency Exchange Rate
  const handleCurrencyUpdate = async (code: string, rate_to_inr: number) => {
    setUpdatingId(code);
    try {
      const res = await fetch('/api/v1/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, rate_to_inr, type: 'currency' })
      });
      const data = await res.json();
      if (data.success) {
        setCurrencies(prev => prev.map(c => c.code.toUpperCase() === code.toUpperCase() ? data.currency : c));
        showNotification(`${code} വിനിമയ നിരക്ക് വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!`);
      } else {
        showNotification(data.error || 'കറൻസി അപ്ഡേറ്റ് പരാജയപ്പെട്ടു', 'error');
      }
    } catch {
      showNotification('കറൻസി അപ്ഡേറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // 3. Add New Currency
  const handleAddCurrency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCurrencyCode.trim() || !newCurrencyNameEn.trim() || !newCurrencyNameMl.trim() || typeof newCurrencyRate !== 'number') {
      showNotification('ദയവായി എല്ലാ വിവരങ്ങളും നൽകുക', 'error');
      return;
    }

    setUpdatingId('add-currency');
    try {
      const res = await fetch('/api/v1/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'currency',
          code: newCurrencyCode.trim().toUpperCase(),
          name_en: newCurrencyNameEn.trim(),
          name_ml: newCurrencyNameMl.trim(),
          rate_to_inr: newCurrencyRate,
          flag: newCurrencyFlag.trim() || '🌐'
        })
      });
      const data = await res.json();
      if (data.success) {
        // Add or update in list
        setCurrencies(prev => {
          const exists = prev.some(c => c.code.toUpperCase() === data.currency.code.toUpperCase());
          if (exists) {
            return prev.map(c => c.code.toUpperCase() === data.currency.code.toUpperCase() ? data.currency : c);
          }
          return [...prev, data.currency];
        });
        showNotification(`പുതിയ കറൻസി ${data.currency.code} വിജയകരമായി ചേർത്തു!`);
        // Reset form
        setNewCurrencyCode('');
        setNewCurrencyNameEn('');
        setNewCurrencyNameMl('');
        setNewCurrencyRate('');
        setNewCurrencyFlag('🌐');
        setShowAddCurrency(false);
      } else {
        showNotification(data.error || 'കറൻസി ചേർക്കാൻ സാധിച്ചില്ല', 'error');
      }
    } catch {
      showNotification('പിഴവ് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // 4. Delete Currency
  const handleDeleteCurrency = async (code: string, name: string) => {
    if (!confirm(`"${code} - ${name}" കറൻസി നീക്കം ചെയ്യണമെന്ന് ഉറപ്പാണോ?`)) return;
    try {
      const res = await fetch(`/api/v1/rates?code=${encodeURIComponent(code)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setCurrencies(prev => prev.filter(c => c.code.toUpperCase() !== code.toUpperCase()));
        showNotification(`${code} വിജയകരമായി നീക്കം ചെയ്തു!`);
      } else {
        showNotification(data.error || 'നീക്കം ചെയ്യാൻ സാധിച്ചില്ല', 'error');
      }
    } catch {
      showNotification('കറൻസി നീക്കം ചെയ്യാൻ സാധിച്ചില്ല.', 'error');
    }
  };

  const filteredCurrencies = currencies.filter(c =>
    c.code.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.name_en.toLowerCase().includes(currencySearch.toLowerCase()) ||
    c.name_ml.includes(currencySearch)
  );

  const gold22kG = rates.find(r => r.metal === 'gold_22k' && r.unit === 'gram');
  const gold22kP = rates.find(r => r.metal === 'gold_22k' && r.unit === 'pavan');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold font-reading text-text flex items-center gap-2">
            <span>🪙</span>
            <span>സ്വർണം &amp; ആഗോള കറൻസി നിരക്കുകൾ (Rates Management)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            തത്സമയ അപ്ഡേറ്റ് - ഇവിടെ വരുത്തുന്ന മാറ്റങ്ങൾ ടോപ്പ് ബാർ, ലൈവ് വിജറ്റ്, കാൽക്കുലേറ്ററുകൾ എന്നിവയിൽ ഉടനടി മാറും.
          </p>
        </div>

        <button
          onClick={fetchRates}
          disabled={loading}
          className="self-start sm:self-auto bg-surface border border-border hover:bg-surface-raised text-text px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          <span>റീഫ്രഷ് ചെയ്യുക</span>
        </button>
      </div>

      {/* Status Notification Banner */}
      {statusMessage && (
        <div
          className={`text-xs font-bold p-3 rounded-lg shadow-sm flex items-center justify-between transition-all ${
            statusMessage.type === 'success'
              ? 'bg-success text-white'
              : 'bg-danger text-white'
          }`}
        >
          <span>{statusMessage.type === 'success' ? '✓' : '⚠'} {statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-white hover:opacity-80 text-sm font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('bullion')}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'bullion'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          <span>🟡</span>
          <span>സ്വർണ &amp; വെള്ളി നിരക്കുകൾ (Kerala Bullion)</span>
          <span className="bg-surface-raised px-1.5 py-0.5 rounded text-[10px]">
            {rates.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('currency')}
          className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'currency'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          <span>💵</span>
          <span>ആഗോള കറൻസി വിനിമയ നിരക്കുകൾ (Global Forex)</span>
          <span className="bg-surface-raised px-1.5 py-0.5 rounded text-[10px]">
            {currencies.length}
          </span>
        </button>
      </div>

      {/* TAB 1: BULLION RATES */}
      {activeTab === 'bullion' && (
        <div className="space-y-4">
          <div className="bg-surface-raised/50 border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-text">
              <span className="text-base">💡</span>
              <span>
                <strong>ഓട്ടോ-കണക്കുകൂട്ടൽ:</strong> 22K 1 ഗ്രാമിന് നൽകുന്ന നിരക്കിന്റെ 8 ഇരട്ടിയാണ് സാധാരണ 1 പവന് (8 ഗ്രാം).
              </span>
            </div>
            {gold22kG && gold22kP && (
              <button
                type="button"
                onClick={() => {
                  const autoPavan = gold22kG.amount_inr * 8;
                  const autoChange = (gold22kG.change_inr || 0) * 8;
                  handleRateUpdate(gold22kP.id, autoPavan, autoChange);
                }}
                className="bg-accent/10 hover:bg-accent/20 text-accent font-bold px-3 py-1.5 rounded-md text-xs transition-colors"
              >
                1 പവൻ നിരക്ക് സ്വയം കണക്കാക്കുക (₹{(gold22kG.amount_inr * 8).toLocaleString('en-IN')})
              </button>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-text-muted bg-surface rounded-xl border border-border">
              നിരക്കുകൾ പരിശോധിക്കുന്നു...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rates.map((rate) => (
                <BullionRateCard
                  key={rate.id}
                  rate={rate}
                  onSave={(amt, change) => handleRateUpdate(rate.id, amt, change)}
                  isSaving={updatingId === rate.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CURRENCY RATES */}
      {activeTab === 'currency' && (
        <div className="space-y-4">
          {/* Action and Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={currencySearch}
                onChange={(e) => setCurrencySearch(e.target.value)}
                placeholder="കറൻസി തിരയുക (കോഡ്, പേര് e.g. AED, USD, ദിർഹം)..."
                className="w-full bg-surface border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
              />
              <span className="absolute left-2.5 top-1.5 text-text-muted text-xs">🔍</span>
            </div>

            <button
              onClick={() => setShowAddCurrency(!showAddCurrency)}
              className="bg-accent hover:opacity-90 text-white font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all shadow-sm self-start sm:self-auto"
            >
              <span>{showAddCurrency ? '✕ ഫോം ഒളിപ്പിക്കുക' : '✨ + പുതിയ കറൻസി ചേർക്കുക'}</span>
            </button>
          </div>

          {/* Add New Currency Card */}
          {showAddCurrency && (
            <div className="bg-surface border-2 border-accent/40 rounded-xl p-5 shadow-card animate-fadeIn">
              <h2 className="text-sm font-bold font-reading text-text mb-3 border-b border-border pb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>✨</span>
                  <span>പുതിയ കറൻസി ചേർക്കുക (Add New Currency Rate)</span>
                </span>
                <span className="text-[10px] text-text-muted font-normal">
                  തത്സമയം കൺവെർട്ടറിലും വിനിമയ ലിസ്റ്റിലും ലഭിക്കും
                </span>
              </h2>

              <form onSubmit={handleAddCurrency} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                  <div>
                    <label className="text-xs font-bold text-text block mb-1">കറൻസി കോഡ് *</label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={newCurrencyCode}
                      onChange={(e) => setNewCurrencyCode(e.target.value.toUpperCase())}
                      placeholder="e.g. CAD, AUD, SGD"
                      className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs font-mono uppercase text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text block mb-1">ഇംഗ്ലീഷ് പേര് *</label>
                    <input
                      type="text"
                      required
                      value={newCurrencyNameEn}
                      onChange={(e) => setNewCurrencyNameEn(e.target.value)}
                      placeholder="e.g. Canadian Dollar"
                      className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text block mb-1">മലയാളം പേര് *</label>
                    <input
                      type="text"
                      required
                      value={newCurrencyNameMl}
                      onChange={(e) => setNewCurrencyNameMl(e.target.value)}
                      placeholder="e.g. കനേഡിയൻ ഡോളർ"
                      className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text block mb-1">1 യൂണിറ്റ് = ₹ INR *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newCurrencyRate}
                      onChange={(e) => setNewCurrencyRate(parseFloat(e.target.value) || '')}
                      placeholder="e.g. 61.50"
                      className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs font-bold text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-text block mb-1">പതാക ഇമോജി (Flag)</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        maxLength={4}
                        value={newCurrencyFlag}
                        onChange={(e) => setNewCurrencyFlag(e.target.value)}
                        className="w-14 text-center bg-surface-raised border border-border-input rounded px-2 py-1.5 text-base text-text"
                      />
                      <div className="flex gap-1 text-sm overflow-x-auto py-1">
                        {['🇨🇦', '🇦🇺', '🇸🇬', '🇯🇵', '🇲🇾', '🇪🇺', '🇳🇿'].map(f => (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setNewCurrencyFlag(f)}
                            className="hover:scale-125 transition-transform"
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setShowAddCurrency(false)}
                    className="bg-surface-raised border border-border text-text px-4 py-1.5 rounded text-xs font-semibold hover:bg-border"
                  >
                    റദ്ദാക്കുക
                  </button>
                  <button
                    type="submit"
                    disabled={updatingId === 'add-currency'}
                    className="bg-accent text-white px-5 py-1.5 rounded text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {updatingId === 'add-currency' ? 'ചേർക്കുന്നു...' : 'കറൻസി സേവ് ചെയ്യുക'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Currency Cards Grid */}
          {loading ? (
            <div className="p-12 text-center text-xs text-text-muted bg-surface rounded-xl border border-border">
              കറൻസി നിരക്കുകൾ പരിശോധിക്കുന്നു...
            </div>
          ) : filteredCurrencies.length === 0 ? (
            <div className="p-8 text-center text-xs text-text-muted bg-surface rounded-xl border border-border">
              കറൻസികൾ ഒന്നും കണ്ടെത്തിയില്ല.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredCurrencies.map((curr) => (
                <CurrencyEditCard
                  key={curr.code}
                  currency={curr}
                  onSave={(rate) => handleCurrencyUpdate(curr.code, rate)}
                  onDelete={() => handleDeleteCurrency(curr.code, curr.name_ml)}
                  isSaving={updatingId === curr.code}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------- SUB-COMPONENTS ----------------

function BullionRateCard({
  rate,
  onSave,
  isSaving
}: {
  rate: DailyRate;
  onSave: (amt: number, change: number) => void;
  isSaving: boolean;
}) {
  const [amount, setAmount] = useState(rate.amount_inr);
  const [change, setChange] = useState(rate.change_inr || 0);

  useEffect(() => {
    setAmount(rate.amount_inr);
    setChange(rate.change_inr || 0);
  }, [rate]);

  const titleMap: Record<string, { title: string; subtitle: string; icon: string }> = {
    'rate-gold-22k-g': { title: '22K സ്വർണം (1 ഗ്രാം)', subtitle: 'കേരള വിപണി സാധാരണ സ്വർണ നിരക്ക്', icon: '🟡' },
    'rate-gold-22k-p': { title: '22K സ്വർണം (1 പവൻ - 8 ഗ്രാം)', subtitle: 'കേരളത്തിലെ ആഭരണ വിപണി പവൻ വില', icon: '👑' },
    'rate-gold-24k-g': { title: '24K തനി സ്വർണം (1 ഗ്രാം)', subtitle: '99.9% ശുദ്ധമായ ഗോൾഡ് ബാർ നിരക്ക്', icon: '✨' },
    'rate-silver-g': { title: 'വെള്ളി (1 ഗ്രാം)', subtitle: 'വെള്ളി വിപണി നിരക്ക്', icon: '⚪' },
  };

  const meta = titleMap[rate.id] || {
    title: `${rate.metal} (${rate.unit})`,
    subtitle: `റീജിയൻ: ${rate.region}`,
    icon: '🪙'
  };

  const hasChanged = amount !== rate.amount_inr || change !== (rate.change_inr || 0);

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-card flex flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{meta.icon}</span>
            <div>
              <h3 className="font-bold text-sm text-text font-reading">{meta.title}</h3>
              <p className="text-[11px] text-text-muted mt-0.5">{meta.subtitle}</p>
            </div>
          </div>

          <span className="text-[10px] font-mono bg-surface-raised border border-border px-2 py-0.5 rounded text-text-muted">
            {rate.source || 'Kerala Bullion'}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-text-muted block mb-1">
              ഇന്നത്തെ നിരക്ക് (₹ INR) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-surface-raised border border-border-input rounded-md px-3 py-2 text-sm font-extrabold text-text font-mono focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-text-muted block mb-1">
              മാറ്റം (+/- ₹)
            </label>
            <input
              type="number"
              value={change}
              onChange={(e) => setChange(parseFloat(e.target.value) || 0)}
              className="w-full bg-surface-raised border border-border-input rounded-md px-3 py-2 text-sm font-bold text-text font-mono focus:outline-none focus:border-accent"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="text-xs">
          {change !== 0 && (
            <span className={`font-bold flex items-center gap-1 ${change > 0 ? 'text-danger' : 'text-success'}`}>
              <span>{change > 0 ? '▲' : '▼'}</span>
              <span>₹{Math.abs(change)} {change > 0 ? 'കൂടി' : 'കുറഞ്ഞു'}</span>
            </span>
          )}
        </div>

        <button
          onClick={() => onSave(amount, change)}
          disabled={isSaving || !hasChanged}
          className={`font-bold text-xs px-5 py-2 rounded-lg transition-all shadow-sm ${
            hasChanged
              ? 'bg-accent hover:opacity-90 text-white'
              : 'bg-surface-raised text-text-muted opacity-60 cursor-not-allowed'
          }`}
        >
          {isSaving ? 'സേവ് ചെയ്യുന്നു...' : hasChanged ? 'മാറ്റം സേവ് ചെയ്യുക' : 'അപ്ഡേറ്റഡ് ആണ്'}
        </button>
      </div>
    </div>
  );
}

function CurrencyEditCard({
  currency,
  onSave,
  onDelete,
  isSaving
}: {
  currency: CurrencyRate;
  onSave: (rate: number) => void;
  onDelete: () => void;
  isSaving: boolean;
}) {
  const [rate, setRate] = useState(currency.rate_to_inr);

  useEffect(() => {
    setRate(currency.rate_to_inr);
  }, [currency.rate_to_inr]);

  const hasChanged = rate !== currency.rate_to_inr;

  return (
    <div className="bg-surface border border-border rounded-xl p-4 shadow-card flex flex-col justify-between gap-3 hover:border-accent/40 transition-colors">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{currency.flag}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-text font-mono">{currency.code}</span>
                <span className="text-[10px] font-semibold text-text-muted">
                  ({currency.name_en})
                </span>
              </div>
              <p className="text-xs font-semibold text-text font-reading mt-0.5">
                {currency.name_ml}
              </p>
            </div>
          </div>

          <button
            onClick={onDelete}
            title="കറൻസി നീക്കം ചെയ്യുക"
            className="text-text-muted hover:text-danger text-xs p-1"
          >
            🗑
          </button>
        </div>

        <div className="mt-3">
          <label className="text-[10px] font-bold text-text-muted block mb-1">
            1 {currency.code} = ₹ INR
          </label>
          <div className="flex items-center gap-2">
            <span className="text-text-muted font-bold text-xs">₹</span>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
              className="w-full bg-surface-raised border border-border-input rounded-md px-3 py-1.5 text-xs font-bold font-mono text-text focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="mt-2 text-[11px] text-text-muted bg-surface-raised px-2.5 py-1 rounded flex items-center justify-between font-mono">
          <span>1,000 {currency.code}:</span>
          <span className="font-bold text-text">
            ₹{(rate * 1000).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <button
        onClick={() => onSave(rate)}
        disabled={isSaving || !hasChanged}
        className={`w-full font-bold text-xs py-1.5 rounded-md transition-all shadow-sm ${
          hasChanged
            ? 'bg-accent hover:opacity-90 text-white'
            : 'bg-surface-raised text-text-muted opacity-50 cursor-not-allowed'
        }`}
      >
        {isSaving ? 'സേവ് ചെയ്യുന്നു...' : hasChanged ? 'നിരക്ക് അപ്ഡേറ്റ് ചെയ്യുക' : 'സേവ്ഡ്'}
      </button>
    </div>
  );
}
