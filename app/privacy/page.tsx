import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text">
          പ്രൈവസി പോളിസി &amp; ഡാറ്റ സംരക്ഷണം (DPDP Act Compliance)
        </h1>
        <p className="text-xs text-text-muted mt-1">
          ഇന്ത്യൻ ഡിജിറ്റൽ വ്യക്തിഗത വിവര സംരക്ഷണ നിയമപ്രകാരമുള്ള (Digital Personal Data Protection Act) വ്യവസ്ഥകൾ.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert text-xs leading-relaxed space-y-4 text-text">
        <h2 className="text-base font-bold text-text">വിവര ശേഖരണം &amp; ഉപയോഗം</h2>
        <p>
          വായനക്കാരുടെ സ്വകാര്യത ഞങ്ങൾ പൂർണ്ണമായും മാനിക്കുന്നു. അക്കൗണ്ട് ലോഗിൻ, സേവ് ചെയ്ത ലേഖനങ്ങൾ, പ്രീമിയം സബ്‌സ്‌ക്രിപ്ഷൻ എന്നിവ സുഗമമാക്കാൻ ആവശ്യമായ വിവരങ്ങൾ മാത്രമേ ശേഖരിക്കുകയുള്ളൂ.
        </p>

        <h2 className="text-base font-bold text-text">കുക്കികൾ (Cookies)</h2>
        <p>
          സൈറ്റിന്റെ സുഗമമായ പ്രവർത്തനത്തിനും (ഡാർക്ക് മോഡ്, സെഷൻ ഓർമ്മിക്കൽ) പേഴ്സണലൈസ്ഡ് ഫീഡ് തയ്യാറാക്കാനുമാണ് കുക്കികൾ ഉപയോഗിക്കുന്നത്.
        </p>

        <h2 className="text-base font-bold text-text">ഡാറ്റ നീക്കം ചെയ്യാനുള്ള അവകാശം</h2>
        <p>
          നിങ്ങളുടെ അക്കൗണ്ട് വിവരങ്ങൾ നീക്കം ചെയ്യാനോ നിങ്ങളുടെ ഡാറ്റ ഡൗൺലോഡ് ചെയ്യാനോ ആഗ്രഹിക്കുന്നുവെങ്കിൽ പ്രൊഫൈൽ ക്രമീകരണങ്ങളിൽ നിന്നും അല്ലെങ്കിൽ ഞങ്ങളുടെ ഗ്രീവൻസ് ഓഫീസറെ ബന്ധപ്പെട്ടോ സാധ്യമാണ്.
        </p>
      </div>
    </div>
  );
}
