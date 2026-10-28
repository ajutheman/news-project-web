import { NextResponse } from 'next/server';
import { newsStore } from '@/lib/data/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const articleId = searchParams.get('articleId');
  const all = searchParams.get('all') === 'true';

  if (all) {
    return NextResponse.json(newsStore.getAllComments());
  }

  if (!articleId) {
    return NextResponse.json({ error: 'articleId is required' }, { status: 400 });
  }

  return NextResponse.json(newsStore.getComments(articleId));
}

export async function POST(request: Request) {
  try {
    const { articleId, user_name, body } = await request.json();
    if (!articleId || !user_name || !body) {
      return NextResponse.json({ error: 'articleId, user_name, and body are required' }, { status: 400 });
    }

    const comment = newsStore.addComment(articleId, user_name, body);
    return NextResponse.json({ success: true, comment });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to post comment' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    if (!id || !['visible', 'hidden'].includes(status)) {
      return NextResponse.json({ error: 'Valid id and status are required' }, { status: 400 });
    }

    const updated = newsStore.moderateComment(id, status);
    return NextResponse.json({ success: true, comment: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to moderate comment' }, { status: 500 });
  }
}
