import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category') || undefined;
  const authorSlug = searchParams.get('author') || undefined;
  const districtSlug = searchParams.get('district') || undefined;
  const tag = searchParams.get('tag') || undefined;
  const status = searchParams.get('status') || undefined;
  const isPremium = searchParams.has('isPremium') ? searchParams.get('isPremium') === 'true' : undefined;
  const search = searchParams.get('search') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 50;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!, 10) : 0;

  const result = newsStore.getArticles({
    categorySlug,
    authorSlug,
    districtSlug,
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

    try {
      revalidatePath('/', 'page');
      revalidatePath('/topic/[slug]', 'page');
      revalidatePath('/districts/[slug]', 'page');
      revalidatePath('/districts', 'page');
      revalidatePath('/article/[slug]', 'page');
      revalidatePath('/admin/articles', 'page');
      revalidatePath('/admin', 'page');
    } catch {
      // non-fatal
    }

    return NextResponse.json({ success: true, article: saved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save article' }, { status: 500 });
  }
}
