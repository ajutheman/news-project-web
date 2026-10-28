'use client';

import React from 'react';
import Link from 'next/link';
import { AdSlot } from '@/components/AdSlot';

export default function BrandConnectPage() {
  const brandStories = [
    {
      id: 'brand-1',
      title: 'സൗത്ത് ഇന്ത്യൻ ബാങ്ക്: കേരളത്തിലെ എംഎസ്എംഇ സംരംഭകർക്കായി പുതിയ വായ്പാ പദ്ധതി',
      client: 'South Indian Bank',
      logo: '🏦',
      summary: 'സംസ്ഥാനത്തെ ചെറുകിട ഇടത്തരം ബിസിനസുകൾക്ക് ഈടില്ലാതെ വേഗത്തിൽ വായ്പ ലഭ്യമാക്കുന്ന പ്രത്യേക സ്കീം അവതരിപ്പിച്ച് സൗത്ത് ഇന്ത്യൻ ബാങ്ക്.',
      date: '2026 ഒക്ടോബർ 26',
      readTime: '3 മിനിറ്റ്',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80',
      badge: 'സ്പോൺസേർഡ് ഫീച്ചർ (Sponsored)',
    },
    {
      id: 'brand-2',
      title: 'കല്യാൺ ജുവല്ലേഴ്സ് ആഗോള വിപുലീകരണം: മിഡിൽ ഈസ്റ്റിൽ 15 പുതിയ ഷോറൂമുകൾ തുറക്കുന്നു',
      client: 'Kalyan Jewellers',
      logo: '✨',
      summary: 'ഗൾഫ് മേഖലയിലെ പ്രവാസി മലയാളികൾക്കായി പ്രത്യേക വെഡ്ഡിംഗ് കളക്ഷനുകളോടെ വിപുലീകരണത്തിനൊരുങ്ങി പ്രമുഖ ജ്വല്ലറി ബ്രാൻഡ്.',
      date: '2026 ഒക്ടോബർ 24',
      readTime: '4 മിനിറ്റ്',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80',
      badge: 'ബ്രാൻഡ് പാർട്ണർ (Partner)',
    },
    {
      id: 'brand-3',
      title: 'ലുലു ഗ്രൂപ്പ് ഇ-കൊമേഴ്സ് ഹബ്ബ്: കൊച്ചിയിൽ അത്യാധുനിക ലോജിസ്റ്റിക്സ് സെന്റർ സജ്ജമായി',
      client: 'LuLu Group International',
      logo: '🛒',
      summary: 'ദക്ഷിണേന്ത്യയിലെ ഓർഡറുകൾ അതിവേഗം എത്തിക്കാൻ കളമശ്ശേരിയിൽ 5 ലക്ഷം ചതുരശ്രയടി വിസ്തീർണ്ണത്തിൽ അത്യാധുനിക ഗോഡൗൺ.',
      date: '2026 ഒക്ടോബർ 20',
      readTime: '3 മിനിറ്റ്',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
      badge: 'സ്പോൺസേർഡ് സ്റ്റോറി (Sponsored)',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-accent/15 via-surface to-accent/5 border border-border rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-pill bg-accent/10 border border-accent/20 text-accent text-xs font-bold">
            <span>✨</span>
            <span>ബ്രാൻഡ് കണക്ട് (Brand Connect &amp; Sponsored Stories)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black font-reading text-text leading-tight">
            കേരളത്തിലെ മുൻനിര ബ്രാൻഡുകളുടെ വിജയഗാഥകളും ഇന്നൊവേഷനുകളും
          </h1>
          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            ബിസിനസ്സ് പങ്കാളികൾ അവതരിപ്പിക്കുന്ന ഉൽപ്പന്നങ്ങൾ, സേവനങ്ങൾ, സി.എസ്.ആർ പ്രവർത്തനങ്ങൾ എന്നിവ വ്യക്തമായ സ്പോൺസേർഡ് ലേബലോടെ പ്രസിദ്ധീകരിക്കുന്നു.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <a
              href="mailto:ads@theprofit.in?subject=Brand%20Connect%20Publishing"
              className="bg-accent hover:opacity-90 text-white font-bold px-5 py-2.5 rounded-pill text-xs shadow-sm"
            >
              ബ്രാൻഡ് സ്റ്റോറി പബ്ലിഷ് ചെയ്യാൻ ↗
            </a>
          </div>
        </div>
      </div>

      {/* Top Banner Advertisement */}
      <AdSlot slotKey="header_banner" />

      {/* Stories Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-base font-bold font-reading text-text">
            സമീപകാല ബ്രാൻഡ് സ്റ്റോറികൾ
          </h2>
          <span className="text-xs text-text-muted">വായനാസമയം 3-5 മിനിറ്റ്</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brandStories.map((story) => (
            <div
              key={story.id}
              className="bg-surface border border-border rounded-xl overflow-hidden shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-surface-raised overflow-hidden">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                    {story.badge}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs text-text-muted font-bold">
                    <span>{story.logo}</span>
                    <span>{story.client}</span>
                  </div>

                  <h3 className="font-bold text-base text-text font-reading leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-text-muted leading-relaxed line-clamp-3">
                    {story.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-border flex items-center justify-between text-[11px] text-text-muted">
                <span>{story.date}</span>
                <span className="font-mono">⏱ {story.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
