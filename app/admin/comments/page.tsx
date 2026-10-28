'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Comment } from '@/lib/types';

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = () => {
    setLoading(true);
    fetch('/api/v1/comments?all=true')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setComments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleModerate = async (id: string, status: 'visible' | 'hidden') => {
    try {
      const res = await fetch('/api/v1/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setComments(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      }
    } catch {
      alert('കമന്റ് മാറ്റാൻ സാധിച്ചില്ല.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl md:text-2xl font-bold font-reading text-text">
          അഭിപ്രായങ്ങളുടെ മോഡറേഷൻ (Comments Moderation)
        </h1>
        <p className="text-xs text-text-muted">
          വായനക്കാർ പങ്കുവെച്ച അഭിപ്രായങ്ങൾ പരിശോധിക്കുക, അനുവദിക്കുകയോ മറച്ചുവെക്കുകയോ ചെയ്യുക.
        </p>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">കമന്റുകൾ പരിശോധിക്കുന്നു...</div>
        ) : comments.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted">കമന്റുകൾ ഒന്നും ലഭിച്ചിട്ടില്ല.</div>
        ) : (
          <div className="divide-y divide-border">
            {comments.map((comm) => (
              <div key={comm.id} className="p-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-text font-reading">{comm.user_name}</span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(comm.created_at).toLocaleString('ml-IN')}
                    </span>
                    <span className={`px-2 py-0.2 rounded text-[9px] font-bold uppercase ${
                      comm.status === 'visible'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}>
                      {comm.status}
                    </span>
                  </div>
                  <p className="text-xs text-text leading-relaxed bg-surface-raised p-2 rounded border border-border">
                    {comm.body}
                  </p>
                  <div className="text-[10px] text-text-muted font-mono">
                    Article ID: {comm.article_id}
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  {comm.status === 'visible' ? (
                    <button
                      onClick={() => handleModerate(comm.id, 'hidden')}
                      className="bg-warning/10 text-warning hover:bg-warning/20 text-xs font-semibold px-3 py-1 rounded"
                    >
                      മറയ്ക്കുക (Hide)
                    </button>
                  ) : (
                    <button
                      onClick={() => handleModerate(comm.id, 'visible')}
                      className="bg-success text-white hover:opacity-90 text-xs font-semibold px-3 py-1 rounded"
                    >
                      പ്രദർശിപ്പിക്കുക (Approve)
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
