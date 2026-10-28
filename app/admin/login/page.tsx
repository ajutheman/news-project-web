'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setRole } = useAuth();
  const [email, setEmail] = useState('editor@theprofit.in');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'editor' | 'author'>('admin');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const demoAccounts = [
    {
      role: 'admin',
      name: 'അഡ്മിൻ (Super Admin)',
      email: 'admin@theprofit.in',
      avatar: '🛡️',
      badge: 'സമ്പൂർണ്ണ അധികാരം',
      desc: 'എല്ലാ വിഭാഗങ്ങളും, ഉപയോക്തൃ അനുമതികളും, പരസ്യങ്ങളും, സാമ്പത്തിക ഇടപാടുകളും നിയന്ത്രിക്കാം.',
    },
    {
      role: 'editor',
      name: 'സീനിയർ എഡിറ്റർ (Chief Editor)',
      email: 'editor@theprofit.in',
      avatar: '✍️',
      badge: 'പബ്ലിഷിംഗ് അനുമതി',
      desc: 'വാർത്തകൾ പരിശോധിച്ചു നേരിട്ട് പബ്ലിഷ് ചെയ്യാം, ഹോം പേജ് ഹീറോ സ്റ്റോറി മാറ്റാം.',
    },
    {
      role: 'author',
      name: 'ബിസിനസ്സ് ലേഖകൻ (Business Reporter)',
      email: 'reporter@theprofit.in',
      avatar: '📝',
      badge: 'ഡ്രാഫ്റ്റ് അനുമതി',
      desc: 'പുതിയ ലേഖനങ്ങൾ എഴുതി എഡിറ്റോറിയൽ അവലോകനത്തിനായി ഡ്രാഫ്റ്റ് സമർപ്പിക്കാം.',
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setRole(selectedRole);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 500);
    }, 400);
  };

  const handleQuickSelect = (accRole: 'admin' | 'editor' | 'author', accEmail: string) => {
    setSelectedRole(accRole);
    setEmail(accEmail);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 text-accent text-2xl font-black mb-1 border border-accent/20">
            🔐
          </div>
          <h1 className="text-2xl font-black font-reading text-text">
            പ്രോഫിറ്റ് സ്റ്റാഫ് &amp; അഡ്മിൻ ലോഗിൻ
          </h1>
          <p className="text-xs text-text-muted">
            The Profit Editorial &amp; Operations Management Portal
          </p>
        </div>

        {/* Quick Demo Staff Switcher */}
        <div className="bg-surface border border-border rounded-xl p-4 shadow-card space-y-2.5">
          <div className="text-xs font-bold text-text flex items-center justify-between">
            <span>⚡ തത്സമയ പരീക്ഷണ റോളുകൾ (Demo Switcher):</span>
            <span className="text-[10px] text-accent font-mono">Instant Auth</span>
          </div>

          <div className="space-y-2">
            {demoAccounts.map((acc) => {
              const isSelected = selectedRole === acc.role;
              return (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => handleQuickSelect(acc.role as any, acc.email)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-start space-x-3 text-xs ${
                    isSelected
                      ? 'border-accent bg-accent/10 shadow-sm'
                      : 'border-border bg-surface-raised hover:border-accent/40'
                  }`}
                >
                  <span className="text-xl">{acc.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text">{acc.name}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-accent text-white font-bold' : 'bg-surface text-text-muted border border-border'
                      }`}>
                        {acc.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-0.5 leading-snug">
                      {acc.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="bg-surface border border-border rounded-xl p-6 shadow-card space-y-4">
          <div>
            <label className="block text-xs font-bold text-text mb-1">
              ഔദ്യോഗിക ഇമെയിൽ വിലാസം (Work Email)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3.5 py-2 text-sm text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-text">
                പാസ്‌വേഡ് (Password)
              </label>
              <span className="text-[11px] text-accent hover:underline cursor-pointer">
                പാസ്‌വേഡ് മറന്നോ?
              </span>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-raised border border-border-input rounded-lg px-3.5 py-2 text-sm text-text focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-accent hover:opacity-90 text-white font-bold py-2.5 px-4 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              {loading ? (
                <span>പരിശോധിക്കുന്നു...</span>
              ) : success ? (
                <span>✅ സ്വാഗതം! പ്രവേശിക്കുന്നു...</span>
              ) : (
                <span>പ്രവേശിക്കുക ({selectedRole.toUpperCase()}) →</span>
              )}
            </button>
          </div>

          <div className="text-center pt-2 border-t border-border">
            <Link href="/" className="text-xs text-text-muted hover:text-accent">
              ← പ്രധാന വെബ്‌സൈറ്റിലേക്ക് മടങ്ങുക
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
