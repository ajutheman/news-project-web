import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = newsStore.getArticleBySlug(slug);

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 400 });
  }

  return NextResponse.json(article);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = newsStore.getArticleBySlug(slug);

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const deleted = newsStore.deleteArticle(article.id);
  return NextResponse.json({ success: deleted });
}
