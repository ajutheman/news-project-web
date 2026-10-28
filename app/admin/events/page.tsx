'use client';

import React, { useState, useEffect } from 'react';
import { NewsEvent } from '@/lib/types';

export default function AdminEventsPage() {
  const [events, setEvents] = useState<NewsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newEvent, setNewEvent] = useState<Partial<NewsEvent>>({
    title_ml: '',
    title_en: '',
    event_type: 'conclave',
    date_display: '',
    venue_ml: '',
    ticket_price: '₹2,500',
    registration_url: '',
    is_featured: true,
    banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
    description_ml: '',
  });

  const fetchEvents = () => {
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
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleToggleFeatured = async (id: string, current: boolean) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_featured: !current } : e))
    );

    try {
      await fetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_featured: !current }),
      });
    } catch (err) {
      console.error('Failed to toggle featured:', err);
      fetchEvents();
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewEvent({
          title_ml: '',
          title_en: '',
          event_type: 'conclave',
          date_display: '',
          venue_ml: '',
          ticket_price: '₹2,500',
          registration_url: '',
          is_featured: true,
          banner_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80',
          description_ml: '',
        });
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to add event:', err);
      alert('ഇവന്റ് ചേർക്കുന്നതിൽ പിശക് സംഭവിച്ചു.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black font-reading text-text flex items-center gap-2">
            <span>🎟️</span>
            <span>ബിസിനസ്സ് കോൺക്ലേവ് &amp; അവാർഡുകൾ (Events &amp; Awards)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            ബിസിനസ്സ് കോൺക്ലേവുകൾ, വെബിനാറുകൾ, അവാർഡ് നൈറ്റുകൾ എന്നിവ സംഘടിപ്പിച്ച് ടിക്കറ്റ് വരുമാനവും സ്പോൺസർഷിപ്പും നേടുക.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-accent hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm flex items-center space-x-1.5"
        >
          <span>✨</span>
          <span>+ പുതിയ ഇവന്റ് ചേർക്കുക</span>
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">ഡാറ്റ ലഭ്യമാക്കുന്നു...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">ഇവന്റ് നാമം</th>
                  <th className="py-3 px-3">ഇനം (Type)</th>
                  <th className="py-3 px-3">തീയതി &amp; വേദി</th>
                  <th className="py-3 px-3">ടിക്കറ്റ് നിരക്ക്</th>
                  <th className="py-3 px-3 text-center">ഫീച്ചേർഡ്</th>
                  <th className="py-3 px-4 text-right">രജിസ്ട്രേഷൻ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {events.map((evt) => (
                  <tr key={evt.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-text font-reading">{evt.title_ml}</div>
                      <div className="text-[11px] text-text-muted">{evt.title_en}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        evt.event_type === 'awards'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : evt.event_type === 'conclave'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {evt.event_type}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-text-muted">
                      <div className="font-semibold text-text">{evt.date_display}</div>
                      <div className="text-[11px]">{evt.venue_ml}</div>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-accent">
                      {evt.ticket_price}
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleFeatured(evt.id, evt.is_featured)}
                        className={`text-xs px-2 py-0.5 rounded font-bold ${
                          evt.is_featured
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-surface-raised text-text-muted'
                        }`}
                      >
                        {evt.is_featured ? 'Featured ★' : 'Standard'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <a
                        href={evt.registration_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline font-bold"
                      >
                        ലിങ്ക് കാണുക ↗
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold font-reading text-base text-text">
                പുതിയ ഇവന്റ് ചേർക്കുക (Add Event)
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-text-muted hover:text-text text-lg">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">ഇവന്റ് പേര് (മലയാളം)</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title_ml}
                    onChange={(e) => setNewEvent({ ...newEvent, title_ml: e.target.value })}
                    placeholder="കേരള ബിസിനസ്സ് കോൺക്ലേവ് 2026"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-reading"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">Event Title (English)</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title_en}
                    onChange={(e) => setNewEvent({ ...newEvent, title_en: e.target.value })}
                    placeholder="Kerala Business Conclave 2026"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">ഇവന്റ് ഇനം</label>
                  <select
                    value={newEvent.event_type}
                    onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value as any })}
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-semibold"
                  >
                    <option value="conclave">കോൺക്ലേവ് (Conclave / Summit)</option>
                    <option value="awards">ബിസിനസ്സ് അവാർഡ്സ് (Business Awards)</option>
                    <option value="webinar">വെബിനാർ (Webinar / Workshop)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">ടിക്കറ്റ് നിരക്ക് (Ticket Fee)</label>
                  <input
                    type="text"
                    required
                    value={newEvent.ticket_price}
                    onChange={(e) => setNewEvent({ ...newEvent, ticket_price: e.target.value })}
                    placeholder="₹2,500 അല്ലെങ്കിൽ സൗജന്യം"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-text mb-1">തീയതി &amp; സമയം</label>
                  <input
                    type="text"
                    required
                    value={newEvent.date_display}
                    onChange={(e) => setNewEvent({ ...newEvent, date_display: e.target.value })}
                    placeholder="2026 നവംബർ 15, രാവിലെ 9:30"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>
                <div>
                  <label className="block font-bold text-text mb-1">വേദി (Venue)</label>
                  <input
                    type="text"
                    required
                    value={newEvent.venue_ml}
                    onChange={(e) => setNewEvent({ ...newEvent, venue_ml: e.target.value })}
                    placeholder="ഗ്രാൻഡ് ഹയാത്ത്, ബോൾഗാട്ടി, കൊച്ചി"
                    className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-text mb-1">രജിസ്ട്രേഷൻ ലിങ്ക് (Booking URL)</label>
                <input
                  type="url"
                  required
                  value={newEvent.registration_url}
                  onChange={(e) => setNewEvent({ ...newEvent, registration_url: e.target.value })}
                  placeholder="https://insider.in/kerala-business-conclave"
                  className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 font-mono text-text"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-border text-text font-semibold"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-accent hover:opacity-90 text-white font-bold"
                >
                  {saving ? 'സേവ് ചെയ്യുന്നു...' : 'പ്രസിദ്ധീകരിക്കുക'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
