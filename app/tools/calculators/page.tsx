'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CalculatorsPage() {
  const [activeTab, setActiveTab] = useState<'sip' | 'emi' | 'fd'>('sip');

  // SIP State
  const [sipMonthly, setSipMonthly] = useState<number>(5000);
  const [sipRate, setSipRate] = useState<number>(12);
  const [sipYears, setSipYears] = useState<number>(10);

  // EMI State
  const [emiAmount, setEmiAmount] = useState<number>(3000000); // 30 Lakhs
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiYears, setEmiYears] = useState<number>(20);

  // FD State
  const [fdAmount, setFdAmount] = useState<number>(100000);
  const [fdRate, setFdRate] = useState<number>(7.1);
  const [fdYears, setFdYears] = useState<number>(3);

  // Calculate SIP: M * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  const calculateSip = () => {
    const i = sipRate / 100 / 12;
    const n = sipYears * 12;
    const maturity = Math.round(sipMonthly * ((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    const invested = sipMonthly * n;
    const wealthGain = maturity - invested;
    return { invested, wealthGain, maturity };
  };

  // Calculate EMI: P * r * (1 + r)^n / ( (1 + r)^n - 1 )
  const calculateEmi = () => {
    const r = emiRate / 100 / 12;
    const n = emiYears * 12;
    const emi = Math.round((emiAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - emiAmount;
    return { emi, totalInterest, totalPayment };
  };

  // Calculate FD: P * (1 + r/4)^(4*t) (quarterly compounding standard in India)
  const calculateFd = () => {
    const r = fdRate / 100;
    const n = 4;
    const t = fdYears;
    const maturity = Math.round(fdAmount * Math.pow(1 + r / n, n * t));
    const interest = maturity - fdAmount;
    return { maturity, interest };
  };

  const sipResult = calculateSip();
  const emiResult = calculateEmi();
  const fdResult = calculateFd();

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-text-muted mb-1">
          <Link href="/" className="hover:text-accent">ഹോം</Link>
          <span>/</span>
          <span>ടൂളുകൾ</span>
          <span>/</span>
          <span className="text-text font-medium">കാൽക്കുലേറ്ററുകൾ</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
          <span>📊</span>
          <span>സാമ്പത്തിക കാൽക്കുലേറ്ററുകൾ (Financial Calculators)</span>
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          മ്യൂച്വൽ ഫണ്ട് SIP, ഭവന വായ്പ EMI, ബാങ്ക് ഫിക്സഡ് ഡെപ്പോസിറ്റ് വളർച്ച മലയാളത്തിൽ എളുപ്പത്തിൽ കണക്കാക്കാം.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border space-x-2">
        <button
          onClick={() => setActiveTab('sip')}
          className={`py-2.5 px-5 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'sip'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          📈 SIP കാൽക്കുലേറ്റർ
        </button>
        <button
          onClick={() => setActiveTab('emi')}
          className={`py-2.5 px-5 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'emi'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          🏠 ഭവന വായ്പ EMI
        </button>
        <button
          onClick={() => setActiveTab('fd')}
          className={`py-2.5 px-5 font-bold text-sm border-b-2 transition-all ${
            activeTab === 'fd'
              ? 'border-accent text-accent'
              : 'border-transparent text-text-muted hover:text-text'
          }`}
        >
          🏦 FD കാൽക്കുലേറ്റർ
        </button>
      </div>

      {/* SIP Tab */}
      {activeTab === 'sip' && (
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>പ്രതിമാസ നിക്ഷേപം (Monthly SIP):</span>
                <span className="text-accent font-mono">₹{sipMonthly.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={sipMonthly}
                onChange={(e) => setSipMonthly(parseInt(e.target.value, 10))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>പ്രതീക്ഷിക്കുന്ന വാർഷിക വരുമാനം (Expected Return):</span>
                <span className="text-accent font-mono">{sipRate}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="0.5"
                value={sipRate}
                onChange={(e) => setSipRate(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>കാലയളവ് (Time Period):</span>
                <span className="text-accent font-mono">{sipYears} വർഷം</span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={sipYears}
                onChange={(e) => setSipYears(parseInt(e.target.value, 10))}
                className="w-full accent-accent"
              />
            </div>
          </div>

          <div className="bg-surface-raised border border-border rounded-lg p-5 flex flex-col justify-between">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">ആകെ നിങ്ങൾ നിക്ഷേപിക്കുന്നത്:</span>
                <span className="font-bold text-text font-mono">₹{sipResult.invested.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">ലാഭമായി ലഭിക്കുന്നത് (Wealth Gain):</span>
                <span className="font-bold text-success font-mono">₹{sipResult.wealthGain.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-border mt-6">
              <span className="text-xs text-text-muted block">കാലാവധിയിൽ ലഭിക്കുന്ന ആകെ തുക:</span>
              <span className="text-2xl md:text-3xl font-black text-accent font-mono">
                ₹{sipResult.maturity.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* EMI Tab */}
      {activeTab === 'emi' && (
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>വായ്പാ തുക (Loan Amount):</span>
                <span className="text-accent font-mono">₹{emiAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="50000"
                value={emiAmount}
                onChange={(e) => setEmiAmount(parseInt(e.target.value, 10))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>പലിശ നിരക്ക് (Interest Rate %):</span>
                <span className="text-accent font-mono">{emiRate}%</span>
              </div>
              <input
                type="range"
                min="6"
                max="16"
                step="0.1"
                value={emiRate}
                onChange={(e) => setEmiRate(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>തിരിച്ചടവ് കാലാവധി (Tenure):</span>
                <span className="text-accent font-mono">{emiYears} വർഷം</span>
              </div>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={emiYears}
                onChange={(e) => setEmiYears(parseInt(e.target.value, 10))}
                className="w-full accent-accent"
              />
            </div>
          </div>

          <div className="bg-surface-raised border border-border rounded-lg p-5 flex flex-col justify-between">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">ആകെ പലിശ തുക (Total Interest):</span>
                <span className="font-bold text-danger font-mono">₹{emiResult.totalInterest.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">ആകെ തിരിച്ചടവ് (Total Payment):</span>
                <span className="font-bold text-text font-mono">₹{emiResult.totalPayment.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-border mt-6">
              <span className="text-xs text-text-muted block">പ്രതിമാസ EMI:</span>
              <span className="text-2xl md:text-3xl font-black text-accent font-mono">
                ₹{emiResult.emi.toLocaleString('en-IN')} / മാസം
              </span>
            </div>
          </div>
        </div>
      )}

      {/* FD Tab */}
      {activeTab === 'fd' && (
        <div className="bg-surface border border-border rounded-xl p-6 md:p-8 shadow-card grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>നിക്ഷേപ തുക (Deposit Amount):</span>
                <span className="text-accent font-mono">₹{fdAmount.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={fdAmount}
                onChange={(e) => setFdAmount(parseInt(e.target.value, 10))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>വാർഷിക പലിശ നിരക്ക് (Interest Rate %):</span>
                <span className="text-accent font-mono">{fdRate}%</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.1"
                value={fdRate}
                onChange={(e) => setFdRate(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-text mb-1">
                <span>കാലാവധി (Years):</span>
                <span className="text-accent font-mono">{fdYears} വർഷം</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={fdYears}
                onChange={(e) => setFdYears(parseInt(e.target.value, 10))}
                className="w-full accent-accent"
              />
            </div>
          </div>

          <div className="bg-surface-raised border border-border rounded-lg p-5 flex flex-col justify-between">
            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">ലഭിക്കുന്ന ആകെ പലിശ:</span>
                <span className="font-bold text-success font-mono">₹{fdResult.interest.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-dashed border-border mt-6">
              <span className="text-xs text-text-muted block">കാലാവധിയിൽ തിരികെ ലഭിക്കുന്നത്:</span>
              <span className="text-2xl md:text-3xl font-black text-accent font-mono">
                ₹{fdResult.maturity.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
