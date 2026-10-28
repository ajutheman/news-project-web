'use client';

import React, { useState } from 'react';

interface ArticleShareBarProps {
  title: string;
  slug: string;
}

export function ArticleShareBar({ title, slug }: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://theprofit.in';
  const articleUrl = `${siteUrl}/article/${slug}`;

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n\nകൂടുതൽ വായിക്കാം: ${articleUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareTelegram = () => {
    const text = encodeURIComponent(title);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(articleUrl)}&text=${text}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const shareX = () => {
    const text = encodeURIComponent(`${title} via @TheProfitNews`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(articleUrl)}`, '_blank');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-y border-border">
      <span className="text-xs font-semibold text-text-muted mr-1">പങ്കുവെക്കുക:</span>

      {/* WhatsApp (Crucial in Kerala) */}
      <button
        onClick={shareWhatsApp}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#25D366] text-white text-xs font-bold hover:opacity-90 shadow-sm transition-all"
        aria-label="Share on WhatsApp"
      >
        <span>💬</span>
        <span>WhatsApp</span>
      </button>

      {/* Telegram */}
      <button
        onClick={shareTelegram}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#229ED9] text-white text-xs font-bold hover:opacity-90 shadow-sm transition-all"
        aria-label="Share on Telegram"
      >
        <span>✈️</span>
        <span>Telegram</span>
      </button>

      {/* Facebook */}
      <button
        onClick={shareFacebook}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-[#1877F2] text-white text-xs font-bold hover:opacity-90 shadow-sm transition-all"
        aria-label="Share on Facebook"
      >
        <span>f</span>
        <span>Facebook</span>
      </button>

      {/* X / Twitter */}
      <button
        onClick={shareX}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill bg-black text-white text-xs font-bold hover:opacity-90 shadow-sm transition-all"
        aria-label="Share on X"
      >
        <span>𝕏</span>
      </button>

      {/* Copy Link */}
      <button
        onClick={copyLink}
        className="flex items-center gap-1 px-3 py-1.5 rounded-pill bg-surface-raised border border-border text-xs text-text hover:bg-border transition-all"
        aria-label="Copy link"
      >
        <span>🔗</span>
        <span>{copied ? 'ലിങ്ക് പകർത്തി!' : 'ലിങ്ക് കോപ്പി'}</span>
      </button>
    </div>
  );
}
