'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { SEED_CATEGORIES } from '@/lib/data/seed-data';

export default function InterestsPage() {
  const { interests, toggleInterest } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
          <span>🎯</span>
          <span>നിങ്ങളുടെ താല്പര്യങ്ങൾ (My Interests)</span>
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          നിങ്ങൾക്ക് കൂടുതൽ വായിക്കാൻ ഇഷ്ടമുള്ള വിഷയങ്ങൾ തിരഞ്ഞെടുക്കൂ. അതനുസരിച്ച് പേഴ്സണലൈസ്ഡ് ഫീഡ് തയ്യാറാക്കാം.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {SEED_CATEGORIES.map((cat) => {
            const isSelected = interests.includes(cat.slug);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleInterest(cat.slug)}
                className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-accent bg-accent/10 text-accent font-bold'
                    : 'border-border bg-surface-raised hover:bg-border text-text'
                }`}
              >
                <div>
                  <span className="text-xs block font-reading">{cat.name_ml}</span>
                  <span className="text-[10px] text-text-muted font-sans font-normal">{cat.name_en}</span>
                </div>
                <span>{isSelected ? '✓' : '+'}</span>
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs text-text-muted">
            {interests.length} വിഷയങ്ങൾ തിരഞ്ഞെടുത്തു
          </span>
          <Link
            href="/my-feed"
            className="bg-accent text-white text-xs font-bold px-5 py-2 rounded-pill hover:opacity-90 transition-all shadow"
          >
            എന്റെ ഫീഡ് കാണുക →
          </Link>
        </div>
      </div>
    </div>
  );
}
