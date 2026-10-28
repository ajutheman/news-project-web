import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const district = searchParams.get('district') || undefined;
  const search = searchParams.get('search') || undefined;

  const businesses = newsStore.getBusinesses({ category, district, search });
  return NextResponse.json({ businesses, total: businesses.length });
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name_ml || !data.phone || !data.category) {
      return NextResponse.json({ error: 'name_ml, phone, and category are required' }, { status: 400 });
    }

    const saved = newsStore.saveBusiness(data);
    try { revalidatePath('/directory', 'page'); } catch {}
    return NextResponse.json({ success: true, business: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

  const deleted = newsStore.deleteBusiness(id);
  try { revalidatePath('/directory', 'page'); } catch {}
  return NextResponse.json({ success: deleted });
}
