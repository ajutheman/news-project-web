'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GoldRateTrackerPage() {
  const [weightType, setWeightType] = useState<'gram' | 'pavan'>('pavan');
  const [quantity, setQuantity] = useState<number>(1);
  const [makingChargesPercent, setMakingChargesPercent] = useState<number>(8); // 8% making charge
  const gstPercent = 3; // 3% GST on gold jewellery in India

  const [gold22kRatePerGram, setGold22kRatePerGram] = useState(7350);
  const [gold22kRatePerPavan, setGold22kRatePerPavan] = useState(58800);
  const [gold24kRatePerGram, setGold24kRatePerGram] = useState(8018);
  const [silverRatePerGram, setSilverRatePerGram] = useState(103);

  const [gold22kChange, setGold22kChange] = useState(45);
  const [goldPavanChange, setGoldPavanChange] = useState(360);
  const [gold24kChange, setGold24kChange] = useState(50);
  const [silverChange, setSilverChange] = useState(1.5);

  useEffect(() => {
    fetch('/api/v1/rates')
      .then(res => res.json())
      .then(data => {
        if (data.rates) {
          const g22 = data.rates.find((r: any) => r.metal === 'gold_22k' && r.unit === 'gram');
          const p22 = data.rates.find((r: any) => r.metal === 'gold_22k' && r.unit === 'pavan');
          const g24 = data.rates.find((r: any) => r.metal === 'gold_24k' && r.unit === 'gram');
          const sil = data.rates.find((r: any) => r.metal === 'silver' && r.unit === 'gram');

          if (g22) { setGold22kRatePerGram(g22.amount_inr); setGold22kChange(g22.change_inr || 0); }
          if (p22) { setGold22kRatePerPavan(p22.amount_inr); setGoldPavanChange(p22.change_inr || 0); }
          if (g24) { setGold24kRatePerGram(g24.amount_inr); setGold24kChange(g24.change_inr || 0); }
          if (sil) { setSilverRatePerGram(sil.amount_inr); setSilverChange(sil.change_inr || 0); }
        }
      })
      .catch(() => {});
  }, []);

  const basePrice =
    weightType === 'pavan'
      ? quantity * gold22kRatePerPavan
      : quantity * gold22kRatePerGram;

  const makingChargeAmount = Math.round((basePrice * makingChargesPercent) / 100);
  const subtotal = basePrice + makingChargeAmount;
  const gstAmount = Math.round((subtotal * gstPercent) / 100);
  const finalTotal = subtotal + gstAmount;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-text-muted mb-1">
          <Link href="/" className="hover:text-accent">ഹോം</Link>
          <span>/</span>
          <span>ടൂളുകൾ</span>
          <span>/</span>
          <span className="text-text font-medium">സ്വർണവില</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
          <span>🟡</span>
          <span>കേരള സ്വർണവില &amp; ആഭരണ കാൽക്കുലേറ്റർ</span>
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          ഇന്നത്തെ തത്സമയ നിരക്കുകളും ആഭരണം വാങ്ങുമ്പോൾ വരുന്ന യഥാർത്ഥ ചെലവും കണക്കുകൂട്ടാം.
        </p>
      </div>

      {/* Today's Rate Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border-2 border-accent/40 rounded-xl p-4 shadow-card text-center">
          <span className="text-xs font-semibold text-text-muted block">22K സ്വർണം (1 പവൻ)</span>
          <span className="text-2xl font-black text-accent mt-1 block">
            ₹{gold22kRatePerPavan.toLocaleString('en-IN')}
          </span>
          <span className={`text-[11px] font-semibold mt-1 inline-block ${goldPavanChange >= 0 ? 'text-danger' : 'text-success'}`}>
            {goldPavanChange >= 0 ? `▲ ₹${goldPavanChange} (ഇന്ന് കൂടിയത്)` : `▼ ₹${Math.abs(goldPavanChange)} (ഇന്ന് കുറഞ്ഞു)`}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-card text-center">
          <span className="text-xs font-semibold text-text-muted block">22K സ്വർണം (1 ഗ്രാം)</span>
          <span className="text-2xl font-black text-text mt-1 block">
            ₹{gold22kRatePerGram.toLocaleString('en-IN')}
          </span>
          <span className={`text-[11px] font-semibold mt-1 inline-block ${gold22kChange >= 0 ? 'text-danger' : 'text-success'}`}>
            {gold22kChange >= 0 ? `▲ ₹${gold22kChange} (ഇന്ന് കൂടിയത്)` : `▼ ₹${Math.abs(gold22kChange)} (ഇന്ന് കുറഞ്ഞു)`}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-card text-center">
          <span className="text-xs font-semibold text-text-muted block">24K തനി സ്വർണം (1 ഗ്രാം)</span>
          <span className="text-2xl font-black text-text mt-1 block">
            ₹{gold24kRatePerGram.toLocaleString('en-IN')}
          </span>
          <span className={`text-[11px] font-semibold mt-1 inline-block ${gold24kChange >= 0 ? 'text-danger' : 'text-success'}`}>
            {gold24kChange >= 0 ? `▲ ₹${gold24kChange} (99.9% പ്യൂരിറ്റി)` : `▼ ₹${Math.abs(gold24kChange)} (99.9% പ്യൂരിറ്റി)`}
          </span>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-card text-center">
          <span className="text-xs font-semibold text-text-muted block">വെള്ളി (1 ഗ്രാം)</span>
          <span className="text-2xl font-black text-text mt-1 block">
            ₹{silverRatePerGram.toLocaleString('en-IN')}
          </span>
          <span className={`text-[11px] font-semibold mt-1 inline-block ${silverChange >= 0 ? 'text-danger' : 'text-success'}`}>
            {silverChange >= 0 ? `▲ ₹${silverChange}` : `▼ ₹${Math.abs(silverChange)}`}
          </span>
        </div>
      </div>

      {/* Jewellery Purchase Calculator */}
      <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-card">
        <h2 className="text-lg md:text-xl font-bold font-reading text-text mb-4 flex items-center gap-2">
          <span>🧮</span>
          <span>സ്വർണാഭരണ ബിൽ കാൽക്കുലേറ്റർ (Jewellery Calculator)</span>
        </h2>
        <p className="text-xs text-text-muted mb-6">
          നിങ്ങൾ വാങ്ങാൻ ഉദ്ദേശിക്കുന്ന ആഭരണത്തിന്റെ അളവും പണിക്കൂലിയും നൽകി യഥാർത്ഥ ബിൽ തുക കൃത്യമായി കണക്കാക്കുക.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-text-muted block mb-1.5">
                യൂണിറ്റ് തിരഞ്ഞെടുക്കുക:
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWeightType('pavan')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md border ${
                    weightType === 'pavan'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface-raised border-border text-text'
                  }`}
                >
                  പവൻ (8 ഗ്രാം)
                </button>
                <button
                  type="button"
                  onClick={() => setWeightType('gram')}
                  className={`flex-1 py-2 text-xs font-bold rounded-md border ${
                    weightType === 'gram'
                      ? 'bg-accent text-white border-accent'
                      : 'bg-surface-raised border-border text-text'
                  }`}
                >
                  ഗ്രാം (Gram)
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted block mb-1.5">
                തൂക്കം ({weightType === 'pavan' ? 'പവൻ' : 'ഗ്രാം'}):
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted block mb-1.5">
                പണിക്കൂലി / വേസ്റ്റേജ് (Making Charges %): {makingChargesPercent}%
              </label>
              <input
                type="range"
                min="3"
                max="25"
                step="0.5"
                value={makingChargesPercent}
                onChange={(e) => setMakingChargesPercent(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>3% (ലളിതം)</span>
                <span>8% (സാധാരണ)</span>
                <span>15%+ (ഡിസൈനർ)</span>
              </div>
            </div>
          </div>

          {/* Breakdown Card */}
          <div className="bg-surface-raised border border-border rounded-lg p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-sm text-text border-b border-border pb-2 mb-3">
                ബിൽ എസ്റ്റിമേറ്റ് വിവരങ്ങൾ
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">സ്വർണത്തിന്റെ അടിസ്ഥാന വില:</span>
                  <span className="font-semibold text-text">₹{basePrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">പണിക്കൂലി ({makingChargesPercent}%):</span>
                  <span className="font-semibold text-text">₹{makingChargeAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">സബ് ടോട്ടൽ:</span>
                  <span className="font-semibold text-text">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">GST (3%):</span>
                  <span className="font-semibold text-text">₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-border mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-text">ആകെ നൽകേണ്ട തുക:</span>
                <span className="text-xl md:text-2xl font-black text-accent">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[10px] text-text-muted mt-2">
                * ജ്വല്ലറികൾ അനുസരിച്ച് പണിക്കൂലിയിൽ വ്യത്യാസമുണ്ടാകാം. ഹാൾമാർക്കിംഗ് ചാർജ്ജ് (₹45 + GST) ഇതിൽ ഉൾപ്പെടുത്തിയിട്ടില്ല.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
