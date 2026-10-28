import React from 'react';
import Link from 'next/link';
import { DailyRate, CurrencyRate } from '@/lib/types';

interface LiveRatesWidgetProps {
  dailyRates: DailyRate[];
  currencies: CurrencyRate[];
}

export function LiveRatesWidget({ dailyRates, currencies }: LiveRatesWidgetProps) {
  const gold22kG = dailyRates.find(r => r.metal === 'gold_22k' && r.unit === 'gram');
  const gold22kP = dailyRates.find(r => r.metal === 'gold_22k' && r.unit === 'pavan');
  const silverG = dailyRates.find(r => r.metal === 'silver' && r.unit === 'gram');

  return (
    <div className="bg-surface border border-border rounded-lg p-5 shadow-card space-y-5">
      {/* Gold Rates Header */}
      <div>
        <div className="flex items-center justify-between border-b border-border pb-2.5 mb-3">
          <h3 className="font-bold text-sm text-text flex items-center gap-1.5 font-reading">
            <span>🟡</span>
            <span>കേരള സ്വർണവില (ഇന്ന്)</span>
          </h3>
          <span className="text-[10px] text-text-muted">22 കാരറ്റ്</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-surface-raised p-2.5 rounded-md border border-border">
            <span className="text-[11px] text-text-muted block">1 ഗ്രാം</span>
            <span className="text-base font-extrabold text-text block">
              ₹{gold22kG ? gold22kG.amount_inr.toLocaleString('en-IN') : '7,350'}
            </span>
            {gold22kG?.change_inr !== undefined && (
              <span className={`text-[10px] font-semibold ${gold22kG.change_inr >= 0 ? 'text-danger' : 'text-success'}`}>
                {gold22kG.change_inr >= 0 ? `▲ ₹${gold22kG.change_inr}` : `▼ ₹${Math.abs(gold22kG.change_inr)}`}
              </span>
            )}
          </div>

          <div className="bg-surface-raised p-2.5 rounded-md border border-border">
            <span className="text-[11px] text-text-muted block">1 പവൻ (8g)</span>
            <span className="text-base font-extrabold text-accent block">
              ₹{gold22kP ? gold22kP.amount_inr.toLocaleString('en-IN') : '58,800'}
            </span>
            {gold22kP?.change_inr !== undefined && (
              <span className={`text-[10px] font-semibold ${gold22kP.change_inr >= 0 ? 'text-danger' : 'text-success'}`}>
                {gold22kP.change_inr >= 0 ? `▲ ₹${gold22kP.change_inr}` : `▼ ₹${Math.abs(gold22kP.change_inr)}`}
              </span>
            )}
          </div>
        </div>

        {silverG && (
          <div className="mt-2.5 text-center text-xs text-text-muted bg-surface-raised py-1.5 rounded">
            വെള്ളി 1 ഗ്രാം: <strong className="text-text">₹{silverG.amount_inr}</strong>
          </div>
        )}

        <div className="mt-3 text-center">
          <Link
            href="/tools/gold-rate"
            className="text-xs font-bold text-accent hover:underline inline-flex items-center gap-1"
          >
            <span>സ്വർണവില ചാർട്ടും കാൽക്കുലേറ്ററും →</span>
          </Link>
        </div>
      </div>

      {/* NRI Currency Strip */}
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-bold text-sm text-text flex items-center gap-1.5 font-reading">
            <span>💵</span>
            <span>ഗൾഫ് കറൻസി നിരക്ക്</span>
          </h3>
          <span className="text-[10px] text-text-muted">₹ INR-ൽ</span>
        </div>

        <div className="space-y-1.5 text-xs">
          {currencies.slice(0, 4).map((c) => (
            <div key={c.code} className="flex items-center justify-between py-1 px-2 rounded hover:bg-surface-raised">
              <span className="flex items-center gap-1.5">
                <span>{c.flag}</span>
                <span className="font-medium text-text">{c.name_ml}</span>
                <span className="text-[10px] text-text-muted font-mono">({c.code})</span>
              </span>
              <span className="font-bold font-mono text-text">₹{c.rate_to_inr.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="mt-2 text-center">
          <Link
            href="/tools/currency"
            className="text-xs font-semibold text-text-muted hover:text-accent"
          >
            എല്ലാ കറൻസികളും കാണുക →
          </Link>
        </div>
      </div>
    </div>
  );
}
