import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';
import { AdSlotKey } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slotKey = searchParams.get('slot') as AdSlotKey | null;

  if (slotKey) {
    const slot = newsStore.getAdSlotByKey(slotKey);
    return NextResponse.json({ slot, adsense: newsStore.getAdSenseSettings() });
  }

  return NextResponse.json({
    slots: newsStore.getAdSlots(),
    adsense: newsStore.getAdSenseSettings()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if updating AdSense global settings
    if (body.type === 'adsense_settings') {
      const updated = newsStore.updateAdSenseSettings(body.settings);
      try { revalidatePath('/', 'page'); } catch {}
      return NextResponse.json({ success: true, adsense: updated });
    }

    // Updating specific ad slot
    if (body.slot_key) {
      const updatedSlot = newsStore.updateAdSlot(body.slot_key, body.data);
      try { revalidatePath('/', 'page'); } catch {}
      return NextResponse.json({ success: true, slot: updatedSlot });
    }

    return NextResponse.json({ error: 'slot_key or type required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update ads' }, { status: 500 });
  }
}
