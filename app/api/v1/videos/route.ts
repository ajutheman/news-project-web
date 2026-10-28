import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const isShort = searchParams.has('isShort') ? searchParams.get('isShort') === 'true' : undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : undefined;

  const videos = newsStore.getVideos({ isShort, limit });
  return NextResponse.json(videos);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.youtube_id || !data.title) {
      return NextResponse.json({ error: 'youtube_id and title are required' }, { status: 400 });
    }
    const video = newsStore.saveVideo(data);
    return NextResponse.json({ success: true, video });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save video' }, { status: 500 });
  }
}
