import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { newsStore } from '@/lib/data/store';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = newsStore.getArticleBySlug(slug) || newsStore.getArticleById(slug);

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  return NextResponse.json(article);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = newsStore.getArticleBySlug(slug) || newsStore.getArticleById(slug);

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const deleted = newsStore.deleteArticle(article.id);

  try {
    revalidatePath('/', 'page');
    revalidatePath('/topic/[slug]', 'page');
    revalidatePath('/districts/[slug]', 'page');
    revalidatePath('/article/[slug]', 'page');
    revalidatePath('/admin/articles', 'page');
  } catch {
    // non-fatal
  }

  return NextResponse.json({ success: deleted });
}
