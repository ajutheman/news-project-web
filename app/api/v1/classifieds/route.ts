import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const district = searchParams.get('district') || undefined;

  const classifieds = newsStore.getClassifieds({ category, district });
  return NextResponse.json({ classifieds, total: classifieds.length });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title || !data.contact_phone || !data.district) {
      return NextResponse.json({ error: 'title, contact_phone, and district are required' }, { status: 400 });
    }

    const saved = newsStore.saveClassified(data);
    try { revalidatePath('/classifieds', 'page'); } catch {}
    return NextResponse.json({ success: true, classified: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  const deleted = newsStore.deleteClassified(id);
  try { revalidatePath('/classifieds', 'page'); } catch {}
  return NextResponse.json({ success: deleted });
}
