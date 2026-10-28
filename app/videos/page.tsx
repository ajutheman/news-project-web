'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { newsStore } from '@/lib/data/store';
import { Video } from '@/lib/types';
import { VideoShortsStrip } from '@/components/VideoShortsStrip';
import { VideoPlayerModal } from '@/components/VideoPlayerModal';

export default function VideosHubPage() {
  const allVideos = newsStore.getVideos();
  const shorts = allVideos.filter(v => v.is_short);
  const fullVideos = allVideos.filter(v => !v.is_short);

  const [activeVideo, setActiveVideo] = useState<Video | null>(fullVideos[0] || null);
  const [modalVideo, setModalVideo] = useState<Video | null>(null);

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex items-center space-x-2 text-xs text-text-muted mb-1.5">
          <Link href="/" className="hover:text-accent">ഹോം</Link>
          <span>/</span>
          <span className="text-text font-medium">വീഡിയോ വാർത്തകൾ</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text flex items-center gap-2">
          <span>📹</span>
          <span>ദ പ്രോഫിറ്റ് വീഡിയോ ന്യൂസ് &amp; ഷോർട്ട്സ് (The Profit Video Hub)</span>
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          സാമ്പത്തിക വിശകലനങ്ങൾ, സ്വർണ നിരക്ക് അപ്ഡേറ്റുകൾ, നിക്ഷേപ പാഠങ്ങൾ, യൂട്യൂബ് ഷോർട്ട്സുകൾ.
        </p>
      </div>

      {/* Featured Video Player */}
      {activeVideo && (
        <section className="bg-surface border border-border rounded-2xl overflow-hidden shadow-pop">
          <div className="aspect-video w-full bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtube_id}?rel=0`}
              title={activeVideo.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <div className="p-6 md:p-8 space-y-2">
            <div className="flex items-center space-x-2 text-xs text-text-muted">
              <span className="bg-accent/10 text-accent font-bold px-2.5 py-0.5 rounded">
                {activeVideo.category || 'പ്രത്യേക റിപ്പോർട്ട്'}
              </span>
              {activeVideo.duration && (
                <span>• ദൈർഘ്യം: {activeVideo.duration}</span>
              )}
              {activeVideo.views && (
                <span>• 👁️ {activeVideo.views.toLocaleString('en-IN')} വായനകൾ</span>
              )}
            </div>

            <h2 className="text-xl md:text-2xl font-bold font-reading text-text">
              {activeVideo.title}
            </h2>
          </div>
        </section>
      )}

      {/* YouTube Shorts Strip */}
      <VideoShortsStrip shorts={shorts} title="⚡ ഏറ്റവും പുതിയ ഷോർട്ട്സ് (YouTube Shorts)" />

      {/* All Long-Form Videos Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold font-reading text-text border-b border-border pb-3">
          എല്ലാ വീഡിയോകളും (Video Library)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {fullVideos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => setActiveVideo(vid)}
              className="group cursor-pointer bg-surface border border-border rounded-xl overflow-hidden shadow-card hover:shadow-pop transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-video relative overflow-hidden bg-surface-raised">
                  <img
                    src={vid.thumbnail_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80'}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-base"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-md group-hover:scale-110 transition-transform">
                      ▶
                    </div>
                  </div>
                  {vid.duration && (
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                      {vid.duration}
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">
                    {vid.category || 'വീഡിയോ'}
                  </span>
                  <h3 className="text-sm font-bold font-reading text-text group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                    {vid.title}
                  </h3>
                </div>
              </div>

              <div className="px-4 pb-3 text-[11px] text-text-muted flex justify-between items-center border-t border-border/50 pt-2">
                <span>{new Date(vid.published_at).toLocaleDateString('ml-IN', { month: 'short', day: 'numeric' })}</span>
                <span className="text-accent font-semibold">ഇപ്പോൾ കാണുക →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <VideoPlayerModal
        video={modalVideo}
        onClose={() => setModalVideo(null)}
      />
    </div>
  );
}
