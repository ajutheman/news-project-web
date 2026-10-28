'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ReaderSupportPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const predefinedAmounts = [100, 250, 500, 1000, 2500, 5000];

  const handleSupport = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const finalAmount = customAmount ? parseInt(customAmount, 10) || selectedAmount : selectedAmount;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      {/* Hero Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
          <span>💖</span>
          <span>സ്വതന്ത്ര മാധ്യമപ്രവർത്തനത്തെ പിന്തുണയ്ക്കാം</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-reading text-text leading-tight">
          നിഷ്പക്ഷമായ ബിസിനസ്സ് വാർത്തകൾക്കായി കൈകോർക്കാം
        </h1>
        <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
          &apos;ദ പ്രോഫിറ്റ്&apos; കേരളത്തിന്റെ സാമ്പത്തിക, സംരംഭക വാർത്തകൾ വിട്ടുവീഴ്ചകളില്ലാതെ വായനക്കാരിലെത്തിക്കുന്നു. നിങ്ങളുടെ ചെറിയ സംഭാവന പോലും വലിയ മാറ്റമാണ്.
        </p>
      </div>

      {submitted ? (
        <div className="bg-surface border border-emerald-500/30 rounded-2xl p-8 shadow-card text-center space-y-4">
          <span className="text-5xl">💐</span>
          <h2 className="text-2xl font-black font-reading text-text">ഹൃദയം നിറഞ്ഞ നന്ദി!</h2>
          <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
            നിങ്ങൾ നൽകിയ <strong className="text-accent font-mono font-bold">₹{finalAmount.toLocaleString('en-IN')}</strong> സംഭാവന വിജയകരമായി രേഖപ്പെടുത്തി. ഞങ്ങളുടെ ഇൻഡിപെൻഡന്റ് റിപ്പോർട്ടിംഗ് ഫണ്ടിലേക്ക് ഇത് നേരിട്ട് എത്തിച്ചേരും.
          </p>
          <div className="pt-3">
            <Link
              href="/"
              className="bg-accent hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-pill text-xs shadow-sm inline-block"
            >
              ഹോം പേജിലേക്ക് മടങ്ങുക →
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSupport} className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          {/* Preset Amount Chips */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-text uppercase tracking-wider">
              സംഭാവന തുക തിരഞ്ഞെടുക്കുക (Select Amount in INR):
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {predefinedAmounts.map((amt) => {
                const isSelected = selectedAmount === amt && !customAmount;
                return (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setCustomAmount('');
                    }}
                    className={`py-3 px-2 rounded-xl text-xs font-mono font-black transition-all ${
                      isSelected
                        ? 'bg-accent text-white shadow-md scale-105'
                        : 'bg-surface-raised border border-border text-text hover:bg-border'
                    }`}
                  >
                    ₹{amt.toLocaleString('en-IN')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Amount Input */}
          <div>
            <label className="block text-xs font-bold text-text mb-1.5">
              അല്ലെങ്കിൽ ഇഷ്ടമുള്ള തുക നൽകാം (Custom Amount):
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-3 top-2.5 text-text-muted font-bold font-mono text-sm">₹</span>
              <input
                type="number"
                min="50"
                step="50"
                placeholder="ഉദാ: 2000"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-full bg-surface-raised border border-border-input rounded-lg pl-8 pr-3 py-2 text-sm font-mono text-text focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Donor Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border">
            <div>
              <label className="block text-xs font-bold text-text mb-1">നിങ്ങളുടെ പേര് (Name)</label>
              <input
                type="text"
                required={!isAnonymous}
                disabled={isAnonymous}
                placeholder="നിങ്ങളുടെ പേര്"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-accent disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text mb-1">ഇമെയിൽ വിലാസം (Email for Receipt)</label>
              <input
                type="email"
                required
                placeholder="email@example.com"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded text-accent focus:ring-accent"
            />
            <label htmlFor="anonymous" className="text-xs text-text-muted cursor-pointer">
              എന്റെ പേര് രഹസ്യമായി സൂക്ഷിക്കുക (Anonymous contribution)
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:opacity-90 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>പ്രോസസ്സ് ചെയ്യുന്നു...</span>
              ) : (
                <span>💖 ₹{finalAmount.toLocaleString('en-IN')} സംഭാവന നൽകുക (Pay via UPI / Card)</span>
              )}
            </button>
            <div className="text-center text-[10px] text-text-muted mt-2">
              🔒 256-bit SSL സുരക്ഷിത പേയ്‌മെന്റ് • UPI (GPay, PhonePe, Paytm), നെറ്റ് ബാങ്കിംഗ്, കാർഡുകൾ എന്നിവ പിന്തുണയ്ക്കുന്നു
            </div>
          </div>
        </form>
      )}

      {/* Trust & Transparency Box */}
      <div className="bg-surface-raised border border-border rounded-xl p-5 text-xs text-text-muted space-y-2">
        <div className="font-bold text-text">സുതാര്യതയും ഉത്തരവാദിത്തവും:</div>
        <p className="leading-relaxed">
          വായനക്കാർ നൽകുന്ന ഓരോ സംഭാവനയും കേരളത്തിലെ സമഗ്ര സാമ്പത്തിക വാർത്തകൾ തയ്യാറാക്കുന്ന ലേഖകർക്കും ഇൻവെസ്റ്റിഗേറ്റീവ് റിപ്പോർട്ടുകൾക്കും സാങ്കേതിക അടിസ്ഥാനസൗകര്യങ്ങൾക്കുമായാണ് വിനിയോഗിക്കുന്നത്.
        </p>
      </div>
    </div>
  );
}
