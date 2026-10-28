'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function AccountPage() {
  const { user, logout, isMember } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto py-12 text-center space-y-4">
        <h1 className="text-xl font-bold font-reading text-text">ലോഗിൻ ചെയ്തിട്ടില്ല</h1>
        <p className="text-xs text-text-muted">
          നിങ്ങളുടെ അക്കൗണ്ട് കാണുന്നതിന് ദയവായി ലോഗിൻ ചെയ്യുക.
        </p>
        <Link
          href="/auth/login"
          className="inline-block bg-accent text-white text-xs font-bold px-5 py-2 rounded-pill hover:opacity-90"
        >
          ലോഗിൻ ചെയ്യുക →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl font-bold font-reading text-text">
          എന്റെ പ്രൊഫൈൽ &amp; അക്കൗണ്ട് (My Account)
        </h1>
        <p className="text-xs text-text-muted">
          സബ്‌സ്‌ക്രിപ്ഷനും അക്കൗണ്ട് ക്രമീകരണങ്ങളും.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-card space-y-6">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-accent/20 text-accent font-extrabold text-xl flex items-center justify-center font-reading">
            {user.display_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-bold text-base text-text">{user.display_name}</div>
            <div className="text-xs text-text-muted font-mono">{user.email}</div>
            <div className="mt-1 flex items-center gap-2">
              <span className="bg-surface-raised border border-border text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                റോൾ: {user.role}
              </span>
              {isMember && (
                <span className="bg-premium text-white text-[11px] font-bold px-2 py-0.5 rounded">
                  👑 പ്രീമിയം അംഗം
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Membership Details */}
        <div className="bg-surface-raised border border-border rounded-lg p-4 space-y-2 text-xs">
          <div className="font-bold text-text">മെമ്പർഷിപ്പ് നിലവാരം:</div>
          {isMember ? (
            <div>
              <p className="text-success font-semibold">✓ വാർഷിക സബ്‌സ്‌ക്രിപ്ഷൻ ആക്ടീവ് ആണ്.</p>
              <p className="text-text-muted text-[11px] mt-0.5">അടുത്ത റിന്യൂവൽ തീയതി: {user.member_until}</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-text-muted">സൗജന്യ അക്കൗണ്ട് (Free tier)</span>
              <Link href="/membership" className="text-premium font-bold hover:underline">
                പ്രീമിയത്തിലേക്ക് അപ്ഗ്രേഡ് ചെയ്യുക →
              </Link>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <button
            onClick={logout}
            className="text-danger hover:underline text-xs font-semibold"
          >
            ലോഗ് ഔട്ട് ചെയ്യുക
          </button>

          {['admin', 'editor', 'author'].includes(user.role) && (
            <Link
              href="/admin"
              className="bg-accent text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-90 shadow-sm"
            >
              അഡ്മിൻ പാനലിലേക്ക് →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
