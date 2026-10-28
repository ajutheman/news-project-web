import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const events = newsStore.getEvents();
  return NextResponse.json({ events, total: events.length });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title || !data.date_string) {
      return NextResponse.json({ error: 'title and date_string are required' }, { status: 400 });
    }

    const saved = newsStore.saveEvent(data);
    try { revalidatePath('/events', 'page'); } catch {}
    return NextResponse.json({ success: true, event: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  const deleted = newsStore.deleteEvent(id);
  try { revalidatePath('/events', 'page'); } catch {}
  return NextResponse.json({ success: deleted });
}
