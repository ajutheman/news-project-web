'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Video } from '@/lib/types';
import { VideoPlayerModal } from './VideoPlayerModal';

interface VideoShortsStripProps {
  shorts: Video[];
  title?: string;
  viewAllLink?: string;
}

export function VideoShortsStrip({
  shorts,
  title = 'ദ പ്രോഫിറ്റ് ഷോർട്ട്സ് (YouTube Shorts)',
  viewAllLink = '/videos'
}: VideoShortsStripProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (!shorts || shorts.length === 0) return null;

  return (
    <section className="my-10">
      <div className="flex items-center justify-between pb-3 border-b-2 border-accent mb-6">
        <h2 className="text-xl font-bold font-reading text-text flex items-center gap-2">
          <span className="text-accent text-lg">⚡</span>
          <span>{title}</span>
        </h2>

        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
          >
            <span>എല്ലാ വീഡിയോകളും</span>
            <span>→</span>
          </Link>
        )}
      </div>

      {/* Horizontal Scrollable Shorts Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {shorts.map((short) => (
          <div
            key={short.id}
            onClick={() => setSelectedVideo(short)}
            className="group cursor-pointer relative aspect-[9/14] rounded-xl overflow-hidden bg-surface-raised border border-border shadow-card hover:shadow-pop transition-all transform hover:-translate-y-1"
          >
            <img
              src={short.thumbnail_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80'}
              alt={short.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-base"
              loading="lazy"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-between p-3.5 text-white">
              <div className="flex justify-between items-center">
                <span className="bg-accent/90 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-pill tracking-wider">
                  SHORTS
                </span>
                {short.duration && (
                  <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded font-mono">
                    {short.duration}
                  </span>
                )}
              </div>

              <div>
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform shadow-md">
                  ▶
                </div>
                <h3 className="text-xs font-bold font-reading line-clamp-2 leading-snug">
                  {short.title}
                </h3>
                {short.views && (
                  <span className="text-[10px] text-gray-300 mt-1 block font-mono">
                    👁️ {short.views.toLocaleString('en-IN')} വായനകൾ
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <VideoPlayerModal
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </section>
  );
}
