import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-16 pt-12 pb-8 text-sm text-text-muted">
      <div className="max-w-content mx-auto px-4">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black font-reading text-accent">ദ പ്രോഫിറ്റ്</span>
              <p className="text-xs uppercase tracking-wider text-text font-bold">
                The Profit Malayalam News &amp; Business Portal
              </p>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm">
              കേരളത്തിലെ മുൻനിര ബിസിനസ്, നിക്ഷേപ, വാണിജ്യ, സമകാലിക വാർത്താ പോർട്ടൽ. വിശ്വസനീയമായ വിശകലനങ്ങളും സമയോചിതമായ റിപ്പോർട്ടുകളും.
            </p>
            {/* Social Follow Links */}
            <div className="pt-2">
              <div className="text-xs font-bold text-text mb-2">ഞങ്ങളെ ഫോളോ ചെയ്യുക:</div>
              <div className="flex items-center space-x-2 text-xs">
                <a
                  href="https://whatsapp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-[#25D366]/10 text-[#25D366] font-semibold hover:bg-[#25D366]/20"
                >
                  WhatsApp ചാനൽ
                </a>
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-[#229ED9]/10 text-[#229ED9] font-semibold hover:bg-[#229ED9]/20"
                >
                  Telegram
                </a>
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-border text-text font-semibold hover:bg-border-input"
                >
                  X (Twitter)
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded bg-[#1877F2]/10 text-[#1877F2] font-semibold hover:bg-[#1877F2]/20"
                >
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Core Categories */}
          <div>
            <h3 className="text-text font-bold text-xs uppercase tracking-wider mb-3">പ്രധാന വാർത്തകൾ</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/topic/kerala" className="hover:text-accent">കേരളം (Kerala)</Link></li>
              <li><Link href="/topic/business" className="hover:text-accent">ബിസിനസ് (Business)</Link></li>
              <li><Link href="/topic/markets" className="hover:text-accent">വിപണി (Markets)</Link></li>
              <li><Link href="/topic/personal-finance" className="hover:text-accent">വ്യക്തിഗത ധനകാര്യം</Link></li>
              <li><Link href="/topic/technology" className="hover:text-accent">സാങ്കേതികം (Tech)</Link></li>
              <li><Link href="/topic/gulf" className="hover:text-accent">ഗൾഫ് വാർത്തകൾ</Link></li>
              <li><Link href="/sections" className="text-accent font-semibold hover:underline">എല്ലാ 37 വിഭാഗങ്ങളും →</Link></li>
            </ul>
          </div>

          {/* Tools & Utilities */}
          <div>
            <h3 className="text-text font-bold text-xs uppercase tracking-wider mb-3">ടൂളുകൾ &amp; യൂട്ടിലിറ്റി</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/tools/gold-rate" className="hover:text-accent">ഇന്നത്തെ സ്വർണവില (Kerala Gold)</Link></li>
              <li><Link href="/tools/calculators" className="hover:text-accent">SIP കാൽക്കുലേറ്റർ</Link></li>
              <li><Link href="/tools/calculators" className="hover:text-accent">ഭവന വായ്പ EMI കാൽക്കുലേറ്റർ</Link></li>
              <li><Link href="/tools/currency" className="hover:text-accent">ഗൾഫ് കറൻസി നിരക്കുകൾ</Link></li>
              <li><Link href="/membership" className="text-premium font-semibold hover:underline">പ്രോഫിറ്റ് പ്രീമിയം അംഗത്വം</Link></li>
              <li><Link href="/saved" className="hover:text-accent">സേവ് ചെയ്ത ലേഖനങ്ങൾ</Link></li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h3 className="text-text font-bold text-xs uppercase tracking-wider mb-3">പോളിസി &amp; ബന്ധപ്പെടാൻ</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/about" className="hover:text-accent">ഞങ്ങളെക്കുറിച്ച് (About Us)</Link></li>
              <li><Link href="/editorial-policy" className="hover:text-accent">എഡിറ്റോറിയൽ പോളിസി</Link></li>
              <li><Link href="/topic/fact-check" className="hover:text-accent">ഫാക്ട് ചെക്ക് (Fact Check)</Link></li>
              <li><Link href="/grievance" className="hover:text-accent">പരാതി പരിഹാരം (Grievance)</Link></li>
              <li><Link href="/privacy" className="hover:text-accent">പ്രൈവസി പോളിസി (DPDP Act)</Link></li>
              <li><Link href="/admin" className="text-accent font-semibold hover:underline">എഡിറ്റോറിയൽ ലോഗിൻ / CMS</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © 2026 The Profit Malayalam. All rights reserved. Content crafted for the Malayalam readership worldwide.
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sitemap.xml" className="hover:text-text">Sitemap</Link>
            <Link href="/robots.txt" className="hover:text-text">Robots</Link>
            <span className="text-accent font-medium">മലയാളം എഡിഷൻ</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
