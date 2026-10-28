'use client';

import React, { useState, useEffect } from 'react';
import { Comment } from '@/lib/types';

interface ArticleCommentsProps {
  articleId: string;
}

export function ArticleComments({ articleId }: ArticleCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [userName, setUserName] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/v1/comments?articleId=${encodeURIComponent(articleId)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
      })
      .catch(() => {});
  }, [articleId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !body.trim()) return;

    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/v1/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId,
          user_name: userName.trim(),
          body: body.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setComments(prev => [data.comment, ...prev]);
        setBody('');
        setMessage('നിങ്ങളുടെ അഭിപ്രായം വിജയകരമായി രേഖപ്പെടുത്തി.');
        setTimeout(() => setMessage(''), 4000);
      }
    } catch {
      setMessage('അഭിപ്രായം രേഖപ്പെടുത്തുന്നതിൽ തടസ്സം നേരിട്ടു. വീണ്ടും ശ്രമിക്കുക.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="my-10 pt-6 border-t border-border">
      <h3 className="text-lg font-bold font-reading text-text mb-4 flex items-center justify-between">
        <span>അഭിപ്രായങ്ങൾ ({comments.length})</span>
        <span className="text-xs text-text-muted font-normal">Comments</span>
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="bg-surface-raised border border-border rounded-lg p-4 mb-6">
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">
          നിങ്ങളുടെ അഭിപ്രായം എഴുതൂ
        </h4>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="നിങ്ങളുടെ പേര് (Name)"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full bg-surface border border-border-input rounded px-3 py-1.5 text-xs text-text focus:outline-none focus:border-accent"
            required
          />
          <textarea
            placeholder="അഭിപ്രായം ഇവിടെ രേഖപ്പെടുത്താം..."
            rows={3}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-surface border border-border-input rounded px-3 py-2 text-xs text-text focus:outline-none focus:border-accent"
            required
          />
          <div className="flex items-center justify-between">
            {message ? (
              <span className="text-xs text-success font-medium">{message}</span>
            ) : (
              <span className="text-[11px] text-text-muted">മര്യാദയുള്ള സംഭാഷണങ്ങൾ പ്രോത്സാഹിപ്പിക്കപ്പെടുന്നു.</span>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="bg-accent hover:opacity-90 text-white text-xs font-bold px-4 py-1.5 rounded transition-all disabled:opacity-50"
            >
              {submitting ? 'പോസ്റ്റ് ചെയ്യുന്നു...' : 'പോസ്റ്റ് ചെയ്യുക'}
            </button>
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-xs text-text-muted italic text-center py-4">
            ആരും ഇതുവരെ അഭിപ്രായം രേഖപ്പെടുത്തിയിട്ടില്ല. ആദ്യത്തെ ആളാകൂ!
          </p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="bg-surface border border-border rounded-lg p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-text font-reading">{c.user_name}</span>
                <span className="text-[10px] text-text-muted">
                  {new Date(c.created_at).toLocaleDateString('ml-IN', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-xs text-text leading-relaxed">{c.body}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
