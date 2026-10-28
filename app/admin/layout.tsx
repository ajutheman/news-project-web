'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, setRole } = useAuth();

  const isStaff = user?.role && ['admin', 'editor', 'author'].includes(user.role);

  const navLinks = [
    { href: '/admin', label: 'ഡാഷ്‌ബോർഡ്', icon: '📊' },
    { href: '/admin/articles', label: 'ലേഖനങ്ങൾ (Articles)', icon: '📝' },
    { href: '/admin/articles/new', label: '+ പുതിയ വാർത്ത', icon: '✨' },
    { href: '/admin/categories', label: 'വിഭാഗങ്ങൾ (Categories)', icon: '🗂️' },
    { href: '/admin/featured', label: 'ഹോം സ്ലോട്ടുകൾ (Featured)', icon: '📌' },
    { href: '/admin/rates', label: 'സ്വർണ നിരക്കുകൾ (Rates)', icon: '🟡' },
    { href: '/admin/comments', label: 'അഭിപ്രായങ്ങൾ (Comments)', icon: '💬' },
    { href: '/admin/roles', label: 'സ്റ്റാഫ് & റോളുകൾ (Roles)', icon: '👥' },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Header Bar */}
      <div className="bg-surface border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <Link href="/admin" className="font-extrabold text-xl text-accent font-reading">
            പ്രോഫിറ്റ് CMS
          </Link>
          <span className="text-xs bg-accent text-white font-bold px-2 py-0.5 rounded uppercase">
            {user?.role || 'Staff'}
          </span>
          <span className="text-xs text-text-muted hidden sm:inline">
            എഡിറ്റോറിയൽ മാനേജ്മെന്റ് സിസ്റ്റം
          </span>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          {/* Quick role changer to test permissions */}
          <span className="text-text-muted hidden md:inline">റോൾ മാറ്റുക:</span>
          <select
            value={user?.role || 'admin'}
            onChange={(e) => setRole(e.target.value as any)}
            className="bg-surface-raised border border-border-input rounded px-2 py-1 text-xs font-semibold text-text"
          >
            <option value="admin">Admin (അഡ്മിൻ)</option>
            <option value="editor">Editor (എഡിറ്റർ)</option>
            <option value="author">Author (ലേഖകൻ)</option>
            <option value="reader">Reader (വായനക്കാരൻ)</option>
          </select>

          <Link
            href="/"
            className="bg-surface-raised hover:bg-border text-text font-bold px-3 py-1.5 rounded transition-colors"
          >
            വെബ്‌സൈറ്റ് കാണുക ↗
          </Link>
        </div>
      </div>

      {/* Main Admin Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Sidebar Nav */}
        <aside className="lg:col-span-3 bg-surface border border-border rounded-xl p-3 shadow-card space-y-1">
          <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider px-3 py-2">
            മെനു നാവിഗേഷൻ
          </div>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'text-text hover:bg-surface-raised'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {children}
        </div>
      </div>
    </div>
  );
}
