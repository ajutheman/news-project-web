'use client';

import React, { useState } from 'react';

export default function GrievancePage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text">
          പരാതി പരിഹാര സെൽ (Grievance Redressal)
        </h1>
        <p className="text-xs text-text-muted mt-1">
          വാർത്തകളിലെ തെറ്റുകൾ, പകർപ്പവകാശ ലംഘനങ്ങൾ, മറ്റ് പരാതികൾ എന്നിവ അറിയിക്കാം.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-card">
        {submitted ? (
          <div className="p-6 text-center text-success font-bold text-sm bg-success/10 rounded-lg">
            ✓ നിങ്ങളുടെ പരാതി വിജയകരമായി സമർപ്പിച്ചു. ഞങ്ങളുടെ ഗ്രീവൻസ് ഓഫീസർ 48 മണിക്കൂറിനുള്ളിൽ പരിശോധിക്കുന്നതാണ്.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-text block mb-1">നിങ്ങളുടെ പേര് *</label>
              <input
                type="text"
                required
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text block mb-1">ഇമെയിൽ വിലാസം *</label>
              <input
                type="email"
                required
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text block mb-1">വാർത്തയുടെ ലിങ്ക് (Article URL)</label>
              <input
                type="url"
                placeholder="https://theprofit.in/article/..."
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-1.5 text-xs text-text"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text block mb-1">പരാതിയുടെ വിവരങ്ങൾ *</label>
              <textarea
                rows={4}
                required
                placeholder="വിശദാംശങ്ങൾ ഇവിടെ രേഖപ്പെടുത്തുക..."
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-xs text-text"
              />
            </div>
            <button
              type="submit"
              className="bg-accent text-white px-5 py-2 rounded text-xs font-bold hover:opacity-90"
            >
              പരാതി സമർപ്പിക്കുക
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
