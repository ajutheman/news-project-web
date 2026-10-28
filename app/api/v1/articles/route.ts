import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category') || undefined;
  const authorSlug = searchParams.get('author') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const status = searchParams.get('status') || undefined;
  const isPremium = searchParams.has('isPremium') ? searchParams.get('isPremium') === 'true' : undefined;
  const search = searchParams.get('search') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

  const result = newsStore.getArticles({
    categorySlug,
    authorSlug,
    tag,
    status,
    isPremium,
    search,
    limit,
    offset
  });

  return NextResponse.json(result);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title || !data.category_id || !data.author_id) {
      return NextResponse.json({ error: 'Title, category_id, and author_id are required' }, { status: 400 });
    }

    const saved = newsStore.saveArticle(data);
    return NextResponse.json({ success: true, article: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save article' }, { status: 500 });
  }
}
