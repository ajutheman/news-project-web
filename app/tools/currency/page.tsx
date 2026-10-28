'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SEED_CURRENCIES } from '@/lib/data/seed-data';

export default function CurrencyRatesPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('AED');
  const [amount, setAmount] = useState<number>(1000);

  const current = SEED_CURRENCIES.find(c => c.code === selectedCurrency) || SEED_CURRENCIES[0];
  const inrResult = (amount * current.rate_to_inr).toFixed(2);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-text-muted mb-1">
          <Link href="/" className="hover:text-accent">ഹോം</Link>
          <span>/</span>
          <span>ടൂളുകൾ</span>
          <span>/</span>
          <span className="text-text font-medium">ഗൾഫ് കറൻസി</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
          <span>💵</span>
          <span>ഗൾഫ് കറൻസി നിരക്കുകൾ (Gulf &amp; Global Exchange Rates)</span>
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          യു.എ.ഇ ദിർഹം, സൗദി റിയാൽ, ഖത്തർ റിയാൽ, കുവൈത്ത് ദിനാർ അടക്കം വിദേശ കറൻസികളുടെ ഇന്നത്തെ രൂപയുടെ മൂല്യം.
        </p>
      </div>

      {/* Converter Box */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-card">
        <h2 className="text-base font-bold font-reading text-text mb-4">
          തത്സമയ കറൻസി കൺവെർട്ടർ (Live Converter)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">
              കറൻസി തിരഞ്ഞെടുക്കുക:
            </label>
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-sm font-semibold text-text"
            >
              {SEED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} - {c.name_ml}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-text-muted block mb-1">
              തുക ({current.code}):
            </label>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseFloat(e.target.value) || 0))}
              className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-sm font-semibold text-text"
            />
          </div>

          <div className="bg-surface-raised border border-border rounded-lg p-3 text-center md:text-left">
            <span className="text-[11px] text-text-muted block">ഇന്ത്യൻ രൂപയിൽ (INR):</span>
            <span className="text-xl md:text-2xl font-black text-accent font-mono block">
              ₹{parseFloat(inrResult).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Currency Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-bold text-sm text-text font-reading">
            പ്രധാന ഗൾഫ് &amp; അന്താരാഷ്ട്ര കറൻസികളുടെ നിരക്ക് (1 യൂണിറ്റ് = ₹ INR)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-6">കറൻസി</th>
                <th className="py-3 px-6">കോഡ്</th>
                <th className="py-3 px-6 text-right">ഇന്നത്തെ മൂല്യം (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {SEED_CURRENCIES.map((c) => (
                <tr key={c.code} className="hover:bg-surface-raised/60">
                  <td className="py-3 px-6 flex items-center gap-2 font-medium text-text">
                    <span className="text-base">{c.flag}</span>
                    <span>{c.name_ml} ({c.name_en})</span>
                  </td>
                  <td className="py-3 px-6 font-mono text-text-muted font-bold">
                    {c.code}
                  </td>
                  <td className="py-3 px-6 text-right font-mono font-bold text-text text-sm">
                    ₹{c.rate_to_inr.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
