import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(newsStore.getHomeSlots());
}

export async function POST(request: Request) {
  try {
    const { slot_key, position, article_id } = await request.json();
    if (!slot_key || position === undefined || !article_id) {
      return NextResponse.json({ error: 'slot_key, position, and article_id are required' }, { status: 400 });
    }

    const updated = newsStore.updateHomeSlot(slot_key, position, article_id);

    try {
      revalidatePath('/', 'page');
    } catch {
      // non-fatal
    }

    return NextResponse.json({ success: true, slot: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update slot' }, { status: 500 });
  }
}
