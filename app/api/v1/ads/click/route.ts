import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';
import { AdSlotKey } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { slot_key, type } = await request.json();
    if (slot_key) {
      if (type === 'click') {
        newsStore.recordAdClick(slot_key as AdSlotKey);
      } else {
        newsStore.recordAdImpression(slot_key as AdSlotKey);
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'slot_key is required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
