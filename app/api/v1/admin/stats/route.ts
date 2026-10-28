import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET() {
  const stats = newsStore.getAdminStats();
  return NextResponse.json(stats);
}
