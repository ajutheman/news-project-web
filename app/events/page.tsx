'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NewsEvent } from '@/lib/types';
import { AdSlot } from '@/components/AdSlot';

export default function EventsHubPage() {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/events')
      .then((res) => res.json())
      .then((data) => {
        if (data.events) setEvents(data.events);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load events:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-amber-500/15 via-surface to-accent/10 border border-border rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <span>🎟️</span>
            <span>ബിസിനസ്സ് ഇവന്റുകൾ &amp; അവാർഡുകൾ (Events &amp; Summits)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-reading text-text leading-tight">
            കേരളത്തിലെ സംരംഭക കൂട്ടായ്മകളും ബിസിനസ്സ് അവാർഡുകളും
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            പ്രമുഖ വ്യവസായികൾ, സ്റ്റാർട്ടപ്പ് സ്ഥാപകർ, നിക്ഷേപകർ എന്നിവർ പങ്കെടുക്കുന്ന വാർഷിക കോൺക്ലേവുകളിലും ഓൺലൈൻ പരിശീലനങ്ങളിലും പങ്കാളികളാകൂ.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="#events-list"
              className="bg-accent hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-pill text-xs shadow-sm"
            >
              ഇവന്റുകൾ കാണുക ↓
            </a>
            <a
              href="mailto:events@theprofit.in?subject=Sponsorship%20Enquiry"
              className="bg-surface border border-border hover:bg-surface-raised text-text font-semibold px-4 py-2.5 rounded-pill text-xs"
            >
              സ്പോൺസർഷിപ്പ് അന്വേഷണങ്ങൾക്ക് ↗
            </a>
          </div>
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <AdSlot slotKey="header_banner" />

      {/* Events Grid */}
      <div id="events-list" className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold font-reading text-text flex items-center gap-2">
            <span>🗓️</span>
            <span>വരവിരിക്കുന്ന പ്രധാന പരിപാടികൾ (Upcoming Events)</span>
          </h2>
          <span className="text-xs text-text-muted">{events.length} ഇവന്റുകൾ ലഭ്യമാണ്</span>
        </div>

        {loading ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center text-xs text-text-muted">
            ഇവന്റുകൾ ലഭ്യമാക്കുന്നു...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-surface border border-border hover:border-accent/40 rounded-xl overflow-hidden shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Banner Image */}
                  {evt.banner_url && (
                    <div className="relative aspect-[16/9] overflow-hidden bg-surface-raised">
                      <img
                        src={evt.banner_url}
                        alt={evt.title_ml}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded uppercase shadow-sm ${
                        evt.event_type === 'awards'
                          ? 'bg-amber-500 text-white'
                          : evt.event_type === 'conclave'
                          ? 'bg-blue-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}>
                        {evt.event_type}
                      </span>
                      {evt.is_featured && (
                        <span className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          ★ ഫീച്ചേർഡ്
                        </span>
                      )}
                    </div>
                  )}

                  {/* Body */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-bold text-base text-text font-reading leading-snug">
                      {evt.title_ml}
                    </h3>
                    <div className="text-xs text-text-muted">{evt.title_en}</div>

                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                      {evt.description_ml}
                    </p>

                    <div className="space-y-1.5 pt-2 text-xs text-text border-t border-border">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span className="font-semibold">{evt.date_display}</span>
                      </div>
                      <div className="flex items-center gap-2 text-text-muted">
                        <span>📍</span>
                        <span className="line-clamp-1">{evt.venue_ml}</span>
                      </div>
                      <div className="flex items-center gap-2 text-accent font-bold font-mono">
                        <span>🎟️</span>
                        <span>പ്രവേശന ഫീസ്: {evt.ticket_price}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0">
                  <a
                    href={evt.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full block bg-accent hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-lg text-xs text-center transition-all shadow-sm"
                  >
                    സീറ്റ് ബുക്ക് ചെയ്യുക (Register Now) →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
