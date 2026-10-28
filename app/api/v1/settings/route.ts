import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const settings = newsStore.getSiteSettings();
  return NextResponse.json({ settings });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const updated = newsStore.updateSiteSettings(data);
    try {
      revalidatePath('/', 'page');
      revalidatePath('/admin', 'page');
    } catch {}
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
