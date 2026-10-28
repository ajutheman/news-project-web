import React from 'react';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';
import { VideosHubClient } from '@/components/VideosHubClient';

export const metadata: Metadata = {
  title: 'വീഡിയോ വാർത്തകൾ & യൂട്യൂബ് ഷോർട്ട്സ് - ദ പ്രോഫിറ്റ്',
  description: 'സാമ്പത്തിക വിശകലനങ്ങൾ, സ്വർണ നിരക്ക് അപ്ഡേറ്റുകൾ, നിക്ഷേപ പാഠങ്ങൾ, യൂട്യൂബ് ഷോർട്ട്സുകൾ.',
};

export const dynamic = 'force-dynamic';

export default function VideosHubPage() {
  const allVideos = newsStore.getVideos();
  return <VideosHubClient initialVideos={allVideos} />;
}
