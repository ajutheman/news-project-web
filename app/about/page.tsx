import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text">
          ഞങ്ങളെക്കുറിച്ച് (About The Profit)
        </h1>
        <p className="text-xs text-text-muted mt-1">
          കേരളത്തിലെ ആദ്യത്തെ സമ്പൂർണ്ണ ഡിജിറ്റൽ മലയാളം ബിസിനസ് &amp; ധനകാര്യ വാർത്താ പോർട്ടൽ.
        </p>
      </div>

      <div className="text-xs leading-relaxed space-y-4 text-text">
        <p>
          സാധാരണക്കാർക്കും പ്രവാസി മലയാളികൾക്കും വ്യാപാരികൾക്കും നിക്ഷേപകർക്കും കൃത്യമായ വിവരങ്ങൾ ലഭ്യമാക്കുക എന്ന ലക്ഷ്യത്തോടെയാണ് &quot;ദ പ്രോഫിറ്റ്&quot; പ്രവർത്തിക്കുന്നത്.
        </p>
        <p>
          ഓഹരി വിപണി വിശകലനങ്ങൾ, സ്വർണ നിരക്കുകൾ, സ്റ്റാർട്ടപ്പുകൾ, പേഴ്സണൽ ഫിനാൻസ് തന്ത്രങ്ങൾ, സർക്കാർ പദ്ധതികൾ എന്നിവ ലളിതമായ മലയാളത്തിൽ ഞങ്ങൾ ലഭ്യമാക്കുന്നു.
        </p>

        <div className="pt-4 border-t border-border flex gap-4">
          <Link href="/membership" className="text-accent font-bold hover:underline">
            പ്രീമിയം അംഗത്വം നേടൂ →
          </Link>
          <Link href="/grievance" className="text-text-muted hover:text-text">
            പരാതി പരിഹാര സെൽ
          </Link>
        </div>
      </div>
    </div>
  );
}
