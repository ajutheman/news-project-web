import React from 'react';
import Link from 'next/link';

export default function EditorialPolicyPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="border-b border-border pb-4">
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text">
          എഡിറ്റോറിയൽ പോളിസി &amp; പ്രമാണങ്ങൾ (Editorial Standards)
        </h1>
        <p className="text-xs text-text-muted mt-1">
          ദ പ്രോഫിറ്റ് വാർത്താ വിഭാഗം പാലിക്കുന്ന നൈതിക മാനദണ്ഡങ്ങൾ.
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert text-xs leading-relaxed space-y-4 text-text">
        <h2 className="text-base font-bold text-text">1. സത്യസന്ധതയും കൃത്യതയും</h2>
        <p>
          എല്ലാ സാമ്പത്തിക, വിപണി, പൊതുവാർത്തകളും കൃത്യമായ രേഖകളും വിശ്വസനീയമായ ഉറവിടങ്ങളും പരിശോധിച്ച ശേഷം മാത്രമേ പ്രസിദ്ധീകരിക്കുകയുള്ളൂ.
        </p>

        <h2 className="text-base font-bold text-text">2. തിരുത്തൽ നയം (Corrections Policy)</h2>
        <p>
          വാർത്തകളിൽ വസ്തുതാപരമായ പിഴവുകൾ ശ്രദ്ധയിൽപ്പെട്ടാൽ സമയബന്ധിതമായി തിരുത്തലുകൾ വരുത്തുകയും ലേഖനത്തിന്റെ തുടക്കത്തിൽ അപ്ഡേറ്റ് ചെയ്ത വിവരം വ്യക്തമാക്കുകയും ചെയ്യും.
        </p>

        <h2 className="text-base font-bold text-text">3. ഫാക്ട് ചെക്ക് (Fact Checking)</h2>
        <p>
          സോഷ്യൽ മീഡിയ വഴിയും മറ്റ് മാധ്യമങ്ങൾ വഴിയും പ്രചരിക്കുന്ന വ്യാജ സാമ്പത്തിക വിവരങ്ങളും തട്ടിപ്പുകളും പരിശോധിക്കാൻ ഞങ്ങൾക്ക് പ്രത്യേക ഫാക്ട് ചെക്ക് വിഭാഗം പ്രവർത്തിക്കുന്നു.
        </p>
      </div>
    </div>
  );
}
