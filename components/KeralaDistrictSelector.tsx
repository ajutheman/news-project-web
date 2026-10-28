'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { District } from '@/lib/types';

interface KeralaDistrictSelectorProps {
  districts: District[];
  activeSlug?: string;
}

export function KeralaDistrictSelector({ districts, activeSlug }: KeralaDistrictSelectorProps) {
  const [selectedZone, setSelectedZone] = useState<'all' | 'south' | 'central' | 'north'>('all');

  const filtered = selectedZone === 'all'
    ? districts
    : districts.filter(d => d.zone === selectedZone);

  return (
    <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h3 className="font-bold text-sm text-text flex items-center gap-2 font-reading">
            <span>📍</span>
            <span>ജില്ല തിരിച്ചുള്ള വാർത്തകൾ (14 Districts)</span>
          </h3>
          <p className="text-[11px] text-text-muted">
            നിങ്ങളുടെ ജില്ലയിലെ പ്രാദേശിക വികസനങ്ങളും ബിസിനസ് വാർത്തകളും തിരഞ്ഞെടുക്കൂ
          </p>
        </div>

        {/* Zone switcher */}
        <div className="flex items-center space-x-1 text-xs">
          <button
            onClick={() => setSelectedZone('all')}
            className={`px-2.5 py-1 rounded-pill font-semibold transition-colors ${
              selectedZone === 'all' ? 'bg-accent text-white' : 'bg-surface-raised hover:bg-border text-text-muted'
            }`}
          >
            എല്ലാം (14)
          </button>
          <button
            onClick={() => setSelectedZone('south')}
            className={`px-2.5 py-1 rounded-pill font-semibold transition-colors ${
              selectedZone === 'south' ? 'bg-accent text-white' : 'bg-surface-raised hover:bg-border text-text-muted'
            }`}
          >
            തെക്ക്
          </button>
          <button
            onClick={() => setSelectedZone('central')}
            className={`px-2.5 py-1 rounded-pill font-semibold transition-colors ${
              selectedZone === 'central' ? 'bg-accent text-white' : 'bg-surface-raised hover:bg-border text-text-muted'
            }`}
          >
            മധ്യം
          </button>
          <button
            onClick={() => setSelectedZone('north')}
            className={`px-2.5 py-1 rounded-pill font-semibold transition-colors ${
              selectedZone === 'north' ? 'bg-accent text-white' : 'bg-surface-raised hover:bg-border text-text-muted'
            }`}
          >
            വടക്ക്
          </button>
        </div>
      </div>

      {/* District Chips */}
      <div className="flex flex-wrap gap-2">
        {filtered.map((d) => {
          const isActive = d.slug === activeSlug;
          return (
            <Link
              key={d.id}
              href={`/districts/${d.slug}`}
              className={`text-xs px-3 py-1.5 rounded-lg border font-medium font-reading transition-all ${
                isActive
                  ? 'bg-accent text-white border-accent font-bold shadow-sm'
                  : 'bg-surface-raised hover:border-accent hover:text-accent border-border text-text'
              }`}
            >
              {d.name_ml}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
