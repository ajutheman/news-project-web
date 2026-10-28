import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const flat = searchParams.get('flat') === 'true';

  if (flat) {
    return NextResponse.json(newsStore.getFlatCategories());
  }

  return NextResponse.json(newsStore.getCategories());
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name_ml || !data.name_en || !data.slug) {
      return NextResponse.json({ error: 'name_ml, name_en, and slug are required' }, { status: 400 });
    }

    const saved = newsStore.saveCategory(data);
    return NextResponse.json({ success: true, category: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'id parameter is required' }, { status: 400 });
    }
    const success = newsStore.deleteCategory(id);
    return NextResponse.json({ success });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 500 });
  }
}
