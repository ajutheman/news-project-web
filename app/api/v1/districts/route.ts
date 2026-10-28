import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET() {
  const districts = newsStore.getDistricts();
  return NextResponse.json(districts);
}
