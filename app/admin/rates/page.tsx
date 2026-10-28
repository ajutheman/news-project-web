'use client';

import React, { useState, useEffect } from 'react';
import { DailyRate } from '@/lib/types';

export default function AdminRatesPage() {
  const [rates, setRates] = useState<DailyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const fetchRates = () => {
    setLoading(true);
    fetch('/api/v1/rates')
      .then(res => res.json())
      .then(data => {
        if (data.rates) setRates(data.rates);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleRateUpdate = async (id: string, amount_inr: number, change_inr: number) => {
    setUpdatingId(id);
    setMessage('');
    try {
      const res = await fetch('/api/v1/rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, amount_inr, change_inr })
      });
      const data = await res.json();
      if (data.success) {
        setRates(prev => prev.map(r => r.id === id ? data.rate : r));
        setMessage('നിരക്ക് വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch {
      alert('നിരക്ക് അപ്ഡേറ്റ് ചെയ്യാൻ സാധിച്ചില്ല.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl md:text-2xl font-bold font-reading text-text">
          സ്വർണ &amp; വെള്ളി നിരക്ക് മാനേജ്മെന്റ് (Daily Bullion Rates)
        </h1>
        <p className="text-xs text-text-muted">
          ഇവിടെ മാറ്റം വരുത്തുന്ന നിരക്കുകൾ വെബ്‌സൈറ്റിലെ ടോപ്പ് ബാർ, സൈഡ്‌ബാർ, കാൽക്കുലേറ്റർ എന്നിവയിൽ ഉടനടി പ്രതിഫലിക്കും.
        </p>
      </div>

      {message && (
        <div className="bg-success text-white text-xs font-bold p-3 rounded-lg shadow">
          ✓ {message}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">നിരക്കുകൾ പരിശോധിക്കുന്നു...</div>
        ) : (
          rates.map((rate) => (
            <RateEditCard
              key={rate.id}
              rate={rate}
              onSave={(amt, change) => handleRateUpdate(rate.id, amt, change)}
              isSaving={updatingId === rate.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

function RateEditCard({
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

  const titleMap: Record<string, string> = {
    'rate-gold-22k-g': '22K സ്വർണം (1 ഗ്രാം)',
    'rate-gold-22k-p': '22K സ്വർണം (1 പവൻ - 8 ഗ്രാം)',
    'rate-gold-24k-g': '24K തനി സ്വർണം (1 ഗ്രാം)',
    'rate-silver-g': 'വെള്ളി (1 ഗ്രാം)',
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h3 className="font-bold text-sm text-text font-reading">
          {titleMap[rate.id] || `${rate.metal} (${rate.unit})`}
        </h3>
        <span className="text-[10px] text-text-muted font-mono block mt-0.5">
          റീജിയൻ: {rate.region} | ഉറവിടം: {rate.source}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div>
          <label className="text-[10px] font-bold text-text-muted block">നിരക്ക് (₹ INR):</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="w-32 bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs font-bold text-text"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-text-muted block">മാറ്റം (+/- ₹):</label>
          <input
            type="number"
            value={change}
            onChange={(e) => setChange(parseFloat(e.target.value) || 0)}
            className="w-24 bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs font-bold text-text"
          />
        </div>

        <button
          onClick={() => onSave(amount, change)}
          disabled={isSaving}
          className="self-end bg-accent hover:opacity-90 text-white font-bold text-xs px-4 py-1.5 rounded transition-all shadow-sm disabled:opacity-50"
        >
          {isSaving ? 'അപ്ഡേറ്റ് ചെയ്യുന്നു...' : 'സേവ്'}
        </button>
      </div>
    </div>
  );
}
