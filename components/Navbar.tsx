'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';

interface NavbarProps {
  categories: Array<{
    id: string;
    slug: string;
    name_ml: string;
    name_en: string;
    show_in_nav: boolean;
    is_premium_section: boolean;
  }>;
  goldRate?: {
    gram: number;
    pavan: number;
  };
}

export function Navbar({ categories, goldRate }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { user, saves } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [edition, setEdition] = useState<'kerala' | 'gulf' | 'global'>('kerala');

  // Primary navigation categories (show_in_nav = true)
  const navCategories = categories.filter(c => c.show_in_nav);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="w-full border-b border-border bg-surface sticky top-0 z-50">
      {/* Top Utility Ticker Bar */}
      <div className="bg-surface-raised border-b border-border text-xs py-1.5 px-4 text-text-muted">
        <div className="max-w-content mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <span className="font-medium text-text hidden sm:inline">
              2026 ഒക്ടോബർ 28, ബുധനാഴ്ച
            </span>

            {/* Worldwide Edition Switcher */}
            <div className="flex items-center gap-1 bg-surface border border-border px-1.5 py-0.5 rounded-pill text-[11px]">
              <span className="text-text-muted font-bold text-[10px] hidden md:inline ml-1">പതിപ്പ്:</span>
              <button
                type="button"
                onClick={() => setEdition('kerala')}
                className={`px-2 py-0.5 rounded-pill transition-colors ${
                  edition === 'kerala' ? 'bg-accent text-white font-bold' : 'text-text hover:text-accent'
                }`}
                title="കേരള എഡിഷൻ"
              >
                🌴 കേരളം
              </button>
              <button
                type="button"
                onClick={() => setEdition('gulf')}
                className={`px-2 py-0.5 rounded-pill transition-colors ${
                  edition === 'gulf' ? 'bg-accent text-white font-bold' : 'text-text hover:text-accent'
                }`}
                title="ഗൾഫ് & പ്രവാസി വാർത്തകൾ"
              >
                🌍 ഗൾഫ് / NRI
              </button>
              <button
                type="button"
                onClick={() => setEdition('global')}
                className={`px-2 py-0.5 rounded-pill transition-colors ${
                  edition === 'global' ? 'bg-accent text-white font-bold' : 'text-text hover:text-accent'
                }`}
                title="ഗ്ലോബൽ വാർത്തകൾ"
              >
                🌐 ഗ്ലോബൽ
              </button>
            </div>

            {goldRate && (
              <Link
                href="/tools/gold-rate"
                className="hidden lg:inline-flex items-center gap-1.5 text-accent hover:underline font-semibold"
              >
                <span>🟡 സ്വർണം 22K:</span>
                <span>₹{goldRate.gram.toLocaleString('en-IN')}/g</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-2.5">
            <Link
              href="/support"
              className="hidden sm:inline-flex items-center gap-1 text-accent font-semibold hover:underline"
            >
              <span>💖</span>
              <span>പിന്തുണയ്ക്കുക</span>
            </Link>
            <span className="text-border hidden sm:inline">•</span>
            <Link href="/saved" className="hover:text-accent flex items-center gap-1">
              <span>സേവ് ചെയ്തവ</span>
              {saves.length > 0 && (
                <span className="bg-accent text-white rounded-pill px-1.5 py-0.2 text-[10px] font-bold">
                  {saves.length}
                </span>
              )}
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className="p-1 rounded hover:bg-border text-text transition-colors"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Link
              href="/admin/login"
              className="bg-accent/10 hover:bg-accent hover:text-white text-accent px-2.5 py-1 rounded-pill text-[11px] font-bold transition-all border border-accent/20"
              title="സ്റ്റാഫ് & എഡിറ്റോറിയൽ ലോഗിൻ"
            >
              🔐 അഡ്മിൻ
            </Link>
          </div>
        </div>
      </div>

      {/* Main Brand Logo & Search Bar */}
      <div className="max-w-content mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-text hover:bg-surface-raised rounded-md"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link href="/" className="flex flex-col">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-accent font-reading">
              ദ പ്രോഫിറ്റ്
            </span>
            <span className="text-[10px] tracking-wider uppercase text-text-muted font-semibold">
              The Profit • Kerala&apos;s Business &amp; News Portal
            </span>
          </Link>
        </div>

        {/* Desktop Search Box */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center relative max-w-sm w-full mx-6">
          <input
            type="text"
            placeholder="വാർത്തകൾ തിരയുക... (Search)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-raised border border-border-input rounded-pill py-1.5 pl-4 pr-10 text-sm focus:outline-none focus:border-accent"
          />
          <button type="submit" className="absolute right-3 text-text-muted hover:text-accent">
            🔍
          </button>
        </form>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 text-text hover:bg-surface-raised rounded-md"
            aria-label="Search"
          >
            🔍
          </button>

          <Link
            href="/membership"
            className="bg-premium-bg text-premium border border-premium/30 hover:bg-premium hover:text-white px-3.5 py-1.5 rounded-pill text-xs font-bold transition-all shadow-sm flex items-center gap-1"
          >
            <span>👑</span>
            <span>സബ്‌സ്‌ക്രൈബ്</span>
          </Link>
        </div>
      </div>

      {/* Mobile Search Input Dropdown */}
      {searchOpen && (
        <div className="p-3 bg-surface-raised border-b border-border md:hidden">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="വാർത്തകൾ തിരയുക..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-surface border border-border-input rounded-md px-3 py-1.5 text-sm"
              autoFocus
            />
            <button type="submit" className="bg-accent text-white px-4 py-1.5 rounded-md text-sm font-semibold">
              തിരയുക
            </button>
          </form>
        </div>
      )}

      {/* Primary Category Scroll Bar */}
      <nav className="border-t border-border bg-surface">
        <div className="max-w-content mx-auto px-4 flex items-center overflow-x-auto scrollbar-none text-sm font-medium">
          <Link
            href="/"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 ${
              pathname === '/'
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-text hover:text-accent'
            }`}
          >
            പ്രധാന വാർത്തകൾ
          </Link>

          {navCategories.map((cat) => {
            if (cat.slug === 'news') return null;
            const href = `/topic/${cat.slug}`;
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={cat.id}
                href={href}
                className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 ${
                  isActive
                    ? 'border-accent text-accent font-bold'
                    : 'border-transparent text-text hover:text-accent'
                } ${cat.is_premium_section ? 'text-premium font-semibold' : ''}`}
              >
                {cat.is_premium_section ? '👑 ' : ''}
                {cat.name_ml}
              </Link>
            );
          })}

          <Link
            href="/districts"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 ${
              pathname.startsWith('/districts')
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-text hover:text-accent'
            }`}
          >
            📍 ജില്ലകൾ
          </Link>

          <Link
            href="/videos"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 ${
              pathname.startsWith('/videos')
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-text hover:text-accent'
            }`}
          >
            <span>▶</span>
            <span>വീഡിയോ &amp; ഷോർട്ട്സ്</span>
          </Link>

          {/* Revenue Services Hubs */}
          <Link
            href="/directory"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 ${
              pathname.startsWith('/directory')
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-text hover:text-accent'
            }`}
          >
            💼 ബിസിനസ്സ് ഡയറക്ടറി
          </Link>

          <Link
            href="/jobs"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 ${
              pathname.startsWith('/jobs')
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-text hover:text-accent'
            }`}
          >
            👔 ജോബ്സ്
          </Link>

          <Link
            href="/events"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 ${
              pathname.startsWith('/events')
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-text hover:text-accent'
            }`}
          >
            🎟 ഇവന്റുകൾ
          </Link>

          <Link
            href="/classifieds"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 ${
              pathname.startsWith('/classifieds')
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-text hover:text-accent'
            }`}
          >
            📢 ക്ലാസിഫൈഡ്സ്
          </Link>

          <Link
            href="/reports"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 ${
              pathname.startsWith('/reports')
                ? 'border-accent text-accent font-bold'
                : 'border-transparent text-text hover:text-accent'
            }`}
          >
            📊 റിപ്പോർട്ടുകൾ
          </Link>

          {/* All Sections Button (Answers user's question with best practice drawer/page) */}
          <Link
            href="/sections"
            className={`py-2.5 px-3 whitespace-nowrap transition-colors border-b-2 flex items-center gap-1 font-semibold ${
              pathname === '/sections'
                ? 'border-accent text-accent'
                : 'border-transparent text-accent hover:opacity-80'
            }`}
          >
            <span>എല്ലാ വിഭാഗങ്ങളും</span>
            <span>▾</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-4/5 max-w-sm h-full bg-surface p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-xl font-bold font-reading text-accent">ദ പ്രോഫിറ്റ്</span>
              <button onClick={() => setMobileMenuOpen(false)} className="text-2xl p-1 text-text-muted">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-1">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                പ്രധാന വിഭാഗങ്ങൾ
              </div>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded hover:bg-surface-raised font-medium"
              >
                പ്രധാന വാർത്തകൾ
              </Link>
              {categories.slice(0, 15).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/topic/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-3 rounded hover:bg-surface-raised font-medium"
                >
                  {cat.name_ml}
                </Link>
              ))}
              <Link
                href="/sections"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 rounded bg-surface-raised text-accent font-bold"
              >
                + എല്ലാ 37 വിഭാഗങ്ങളും കാണുക
              </Link>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                ബിസിനസ്സ് &amp; സർവീസുകൾ
              </div>
              <Link
                href="/directory"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                💼 ബിസിനസ്സ് ഡയറക്ടറി
              </Link>
              <Link
                href="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                👔 തൊഴിൽ അവസരങ്ങൾ (Jobs)
              </Link>
              <Link
                href="/events"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                🎟 ഇവന്റുകൾ &amp; അവാർഡുകൾ
              </Link>
              <Link
                href="/classifieds"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                📢 ക്ലാസിഫൈഡ്സ് പരസ്യങ്ങൾ
              </Link>
              <Link
                href="/reports"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                📊 റിസർച്ച് റിപ്പോർട്ടുകൾ
              </Link>
              <Link
                href="/support"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm text-accent font-semibold hover:underline"
              >
                💖 വായനക്കാരുടെ പിന്തുണ (Support)
              </Link>
            </div>

            <div className="pt-4 border-t border-border space-y-2">
              <div className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
                യൂട്ടിലിറ്റി &amp; ടൂളുകൾ
              </div>
              <Link
                href="/tools/gold-rate"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                🟡 ഇന്നത്തെ സ്വർണവില
              </Link>
              <Link
                href="/tools/calculators"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                📊 SIP / EMI കാൽക്കുലേറ്ററുകൾ
              </Link>
              <Link
                href="/tools/currency"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                💵 ഗൾഫ് കറൻസി നിരക്കുകൾ
              </Link>
              <Link
                href="/saved"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1.5 px-3 text-sm hover:text-accent"
              >
                🔖 സേവ് ചെയ്ത ലേഖനങ്ങൾ
              </Link>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 text-sm bg-accent text-white rounded font-bold text-center mt-3"
              >
                🔐 സ്റ്റാഫ് &amp; അഡ്മിൻ ലോഗിൻ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
