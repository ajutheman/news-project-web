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
          <div className="flex items-center space-x-4">
            <span className="font-medium text-text">
              2026 ഒക്ടോബർ 28, ബുധനാഴ്ച
            </span>
            {goldRate && (
              <Link
                href="/tools/gold-rate"
                className="hidden sm:inline-flex items-center gap-1.5 text-accent hover:underline font-semibold"
              >
                <span>🟡 സ്വർണം 22K:</span>
                <span>₹{goldRate.gram.toLocaleString('en-IN')}/g</span>
                <span className="text-text-muted">|</span>
                <span>₹{goldRate.pavan.toLocaleString('en-IN')}/പവൻ</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/tools/calculators" className="hover:text-accent hidden md:inline">
              ധനകാര്യ കാൽക്കുലേറ്ററുകൾ
            </Link>
            <span className="text-border hidden md:inline">•</span>
            <Link href="/tools/currency" className="hover:text-accent hidden md:inline">
              ഗൾഫ് കറൻസി
            </Link>
            <span className="text-border hidden md:inline">•</span>
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
            {user?.role && ['admin', 'editor', 'author'].includes(user.role) && (
              <Link
                href="/admin"
                className="bg-accent text-white px-2 py-0.5 rounded text-xs font-semibold hover:opacity-90"
              >
                അഡ്മിൻ പാനൽ
              </Link>
            )}
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
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 px-3 text-sm bg-accent text-white rounded font-bold text-center mt-3"
              >
                അഡ്മിൻ / എഡിറ്റർ പാനൽ
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
