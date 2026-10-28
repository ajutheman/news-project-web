'use client';

import React from 'react';
import { Video } from '@/lib/types';

interface VideoPlayerModalProps {
  video: Video | null;
  onClose: () => void;
}

export function VideoPlayerModal({ video, onClose }: VideoPlayerModalProps) {
  if (!video) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border rounded-2xl overflow-hidden max-w-2xl w-full shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3.5 border-b border-border bg-surface-raised">
          <div className="flex items-center space-x-2">
            <span className="text-accent text-sm">▶</span>
            <h3 className="font-bold text-xs md:text-sm font-reading text-text truncate max-w-md">
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text p-1 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Responsive YouTube Embed */}
        <div className={`relative ${video.is_short ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video'}`}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        <div className="p-4 bg-surface text-xs text-text-muted flex items-center justify-between">
          <span className="bg-surface-raised px-2.5 py-1 rounded-pill font-medium">
            {video.category || 'ദ പ്രോഫിറ്റ് വീഡിയോ'}
          </span>
          {video.duration && <span>ദൈർഘ്യം: {video.duration}</span>}
        </div>
      </div>
    </div>
  );
}
