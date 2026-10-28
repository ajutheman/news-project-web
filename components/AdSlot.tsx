'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdSlotKey, AdSlotConfig, AdSenseSettings } from '@/lib/types';

interface AdSlotProps {
  slotKey: AdSlotKey;
  className?: string;
  initialConfig?: AdSlotConfig;
  initialAdSense?: AdSenseSettings;
}

export function AdSlot({ slotKey, className = '', initialConfig, initialAdSense }: AdSlotProps) {
  const [config, setConfig] = useState<AdSlotConfig | undefined>(initialConfig);
  const [adsense, setAdsense] = useState<AdSenseSettings | undefined>(initialAdSense);
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(Boolean(initialConfig));

  useEffect(() => {
    if (!initialConfig) {
      fetch(`/api/v1/ads?slot=${slotKey}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.slot) setConfig(data.slot);
          if (data.adsense) setAdsense(data.adsense);
          setLoaded(true);

          // Track impression
          if (data.slot?.is_active) {
            fetch('/api/v1/ads/click', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ slot_key: slotKey, type: 'impression' })
            }).catch(() => {});
          }
        })
        .catch(() => setLoaded(true));
    }
  }, [slotKey, initialConfig]);

  if (!loaded || !config || !config.is_active || dismissed) {
    return null;
  }

  const handleAdClick = () => {
    fetch('/api/v1/ads/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot_key: slotKey, type: 'click' })
    }).catch(() => {});
  };

  // Sticky mobile anchor ad
  if (slotKey === 'sticky_mobile') {
    return (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border shadow-2xl p-2 animate-slide-up">
        <div className="flex items-center justify-between gap-2 max-w-sm mx-auto">
          <Link
            href={config.direct_link_url || '#'}
            onClick={handleAdClick}
            target={config.direct_link_url?.startsWith('http') ? '_blank' : '_self'}
            className="flex-1 flex items-center space-x-2 text-xs"
          >
            <span className="text-[9px] bg-accent/20 text-accent font-bold px-1 rounded uppercase">Ad</span>
            <span className="text-text font-bold truncate">{config.direct_title || config.name}</span>
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Close Ad"
            className="text-text-muted hover:text-text text-sm p-1"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden my-4 text-center ${className}`}>
      {/* Ad Label & Sponsor Disclosure */}
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 flex items-center justify-center gap-1.5 font-semibold">
        <span>പരസ്യം (Advertisement)</span>
        {config.direct_sponsor_name && (
          <>
            <span>•</span>
            <span className="text-text">{config.direct_sponsor_name}</span>
          </>
        )}
      </div>

      {config.ad_type === 'adsense' && adsense?.publisher_id ? (
        <div className="bg-surface-raised border border-dashed border-border rounded-lg p-4 flex flex-col items-center justify-center min-h-[90px]">
          {/* Google AdSense Display Block */}
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={adsense.publisher_id}
            data-ad-slot={config.adsense_slot_id || 'default_slot'}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
          <div className="text-xs text-text-muted font-mono mt-1">
            Google AdSense • {config.size}
          </div>
        </div>
      ) : config.direct_image_url ? (
        <Link
          href={config.direct_link_url || '#'}
          onClick={handleAdClick}
          target={config.direct_link_url?.startsWith('http') ? '_blank' : '_self'}
          className="group block relative overflow-hidden rounded-lg border border-border shadow-card hover:shadow-pop transition-all max-w-full mx-auto"
        >
          <img
            src={config.direct_image_url}
            alt={config.direct_title || 'Advertisement'}
            className="w-full object-cover max-h-48 rounded-lg group-hover:opacity-95 transition-opacity"
          />
          {config.direct_title && (
            <div className="p-2.5 bg-surface text-left border-t border-border flex items-center justify-between">
              <span className="text-xs font-bold text-text font-reading group-hover:text-accent transition-colors truncate">
                {config.direct_title}
              </span>
              <span className="text-[11px] text-accent font-semibold ml-2 whitespace-nowrap">
                കൂടുതൽ അറിയാൻ →
              </span>
            </div>
          )}
        </Link>
      ) : (
        <div className="bg-surface-raised border border-dashed border-border rounded-lg p-4 text-xs text-text-muted">
          {config.name} ({config.size})
        </div>
      )}
    </div>
  );
}
