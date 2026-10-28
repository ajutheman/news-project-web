'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { SEED_PLANS } from '@/lib/data/seed-data';

export default function MembershipPage() {
  const { isMember, activateMembership } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleCheckout = (planCode: string) => {
    setLoadingPlan(planCode);
    setTimeout(() => {
      activateMembership();
      setLoadingPlan(null);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 5000);
    }, 1200);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto py-4">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-premium text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-pill">
          👑 THE PROFIT PREMIUM
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold font-reading text-text">
          സാമ്പത്തിക അറിവിന്റെ പ്രീമിയം ലോകത്തേക്ക് സ്വാഗതം
        </h1>
        <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
          വിപണിയിലെ മികച്ച നിക്ഷേപ അവസരങ്ങൾ, ബിസിനസ് ഇൻസൈറ്റുകൾ, എക്‌സ്‌ക്ലൂസീവ് റിപ്പോർട്ടുകൾ പരസ്യങ്ങളില്ലാതെ വായിക്കൂ.
        </p>

        {isMember && (
          <div className="inline-block mt-3 bg-success/10 border border-success/30 text-success text-xs font-bold px-4 py-2 rounded-pill">
            ✓ നിങ്ങൾക്ക് ആക്ടീവ് പ്രീമിയം മെമ്പർഷിപ്പ് ഉണ്ട് (സാധുത: 2027 ഡിസംബർ 31 വരെ)
          </div>
        )}

        {successMessage && (
          <div className="bg-success text-white text-sm font-bold p-3 rounded-lg max-w-md mx-auto shadow">
            🎉 അഭിനന്ദനങ്ങൾ! നിങ്ങളുടെ പ്രീമിയം അംഗത്വം വിജയകരമായി ആക്ടീവ് ആയിരിക്കുന്നു!
          </div>
        )}
      </div>

      {/* Plans Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SEED_PLANS.map((plan) => {
          const isYearly = plan.billing_interval === 'year';
          return (
            <div
              key={plan.id}
              className={`bg-surface border-2 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-card relative overflow-hidden transition-all ${
                isYearly ? 'border-premium shadow-pop' : 'border-border'
              }`}
            >
              {isYearly && (
                <div className="absolute top-0 right-0 bg-premium text-white text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-bl-lg">
                  ഏറ്റവും ജനപ്രിയം (Best Value)
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold font-reading text-text">
                  {plan.name_ml}
                </h3>
                <span className="text-xs text-text-muted font-mono">{plan.name}</span>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black text-text font-mono">
                    ₹{plan.amount_inr}
                  </span>
                  <span className="text-xs text-text-muted font-medium">
                    / {isYearly ? 'വർഷം' : 'മാസം'}
                  </span>
                </div>

                <ul className="mt-6 space-y-3 text-xs text-text">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-success font-bold">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => handleCheckout(plan.code)}
                  disabled={loadingPlan !== null}
                  className={`w-full py-3 rounded-pill text-sm font-bold transition-all shadow-sm ${
                    isYearly
                      ? 'bg-premium hover:bg-premium/90 text-white'
                      : 'bg-surface-raised border border-border text-text hover:bg-border'
                  }`}
                >
                  {loadingPlan === plan.code
                    ? 'പ്രോസസ്സ് ചെയ്യുന്നു...'
                    : isMember
                    ? 'പ്ലാൻ പുതുക്കുക'
                    : 'ഇപ്പോൾ സബ്‌സ്‌ക്രൈബ് ചെയ്യുക'}
                </button>
                <div className="text-[10px] text-text-muted text-center mt-2">
                  സുരക്ഷിതമായ Razorpay ഓൺലൈൻ പേയ്മെന്റ് ഗേറ്റ്‌വേ.
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ or Trust badge */}
      <div className="bg-surface-raised border border-border rounded-xl p-6 text-center text-xs text-text-muted space-y-2">
        <p className="font-semibold text-text">എപ്പോൾ വേണമെങ്കിലും സബ്‌സ്‌ക്രിപ്ഷൻ റദ്ദാക്കാം.</p>
        <p>റുപേ, യുപിഐ (GPay, PhonePe, Paytm), ക്രെഡിറ്റ്/ഡെബിറ്റ് കാർഡുകൾ, നെറ്റ് ബാങ്കിംഗ് സ്വീകരിക്കപ്പെടുന്നു.</p>
        <div className="pt-2">
          <Link href="/topic/premium" className="text-accent font-bold hover:underline">
            പ്രീമിയം സ്റ്റോറികൾ സാമ്പിൾ കാണുക →
          </Link>
        </div>
      </div>
    </div>
  );
}
