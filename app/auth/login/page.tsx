'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, logout, setRole } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleMagicLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    login(email.trim(), 'reader');
    setSent(true);
    setTimeout(() => {
      router.push('/');
    }, 1500);
  };

  const handleQuickDemoLogin = (role: 'admin' | 'editor' | 'author' | 'reader') => {
    login(`${role}@theprofit.in`, role);
    router.push(role === 'reader' ? '/' : '/admin');
  };

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black font-reading text-accent">ദ പ്രോഫിറ്റ്</span>
          </Link>
          <h1 className="text-xl font-bold font-reading text-text">
            ലോഗിൻ / സൈൻ അപ്പ്
          </h1>
          <p className="text-xs text-text-muted">
            നിങ്ങളുടെ ഇമെയിൽ നൽകുക, പാസ്‌വേഡ് ഇല്ലാതെ ഒറ്റ ക്ലിക്കിൽ ലോഗിൻ ചെയ്യാം.
          </p>
        </div>

        {user ? (
          <div className="bg-surface-raised border border-border rounded-xl p-4 text-center space-y-3">
            <span className="text-xs text-text-muted">നിലവിൽ ലോഗിൻ ചെയ്തിരിക്കുന്നു:</span>
            <div className="font-bold text-sm text-text">{user.email}</div>
            <div className="inline-block bg-accent/10 text-accent font-semibold text-xs px-2.5 py-0.5 rounded">
              റോൾ: {user.role.toUpperCase()}
            </div>
            <div className="pt-2 flex gap-2 justify-center">
              <button
                onClick={logout}
                className="bg-danger text-white text-xs font-semibold px-4 py-1.5 rounded hover:opacity-90"
              >
                ലോഗ് ഔട്ട്
              </button>
              {user.role !== 'reader' && (
                <Link
                  href="/admin"
                  className="bg-accent text-white text-xs font-semibold px-4 py-1.5 rounded hover:opacity-90"
                >
                  അഡ്മിൻ പാനലിലേക്ക്
                </Link>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-text-muted block mb-1">
                ഇമെയിൽ വിലാസം (Email):
              </label>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-raised border border-border-input rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-accent hover:opacity-90 text-white font-bold py-2 rounded text-sm transition-all shadow"
            >
              {sent ? 'ലോഗിൻ പൂർത്തിയായി...' : 'മാജിക് ലിങ്ക് വഴി ലോഗിൻ'}
            </button>
          </form>
        )}

        {/* Quick Demo Switcher */}
        <div className="pt-4 border-t border-border">
          <div className="text-[11px] font-bold text-text-muted uppercase tracking-wider text-center mb-3">
            ഡെമോ അക്കൗണ്ടുകൾ പരീക്ഷിക്കാം (Quick Switch)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="py-1.5 px-2 rounded bg-surface-raised hover:bg-accent hover:text-white border border-border text-center transition-colors"
            >
              👑 അഡ്മിൻ (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('editor')}
              className="py-1.5 px-2 rounded bg-surface-raised hover:bg-accent hover:text-white border border-border text-center transition-colors"
            >
              ✍️ എഡിറ്റർ (Editor)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('author')}
              className="py-1.5 px-2 rounded bg-surface-raised hover:bg-accent hover:text-white border border-border text-center transition-colors"
            >
              📝 റിപ്പോർട്ടർ (Author)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('reader')}
              className="py-1.5 px-2 rounded bg-surface-raised hover:bg-accent hover:text-white border border-border text-center transition-colors"
            >
              👤 വായനക്കാരൻ (Reader)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
