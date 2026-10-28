import React from 'react';
import { notFound } from 'next/navigation';
import { newsStore } from '@/lib/data/store';
import { ArticleEditorForm } from '@/components/admin/ArticleEditorForm';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = newsStore.getArticleById(id);

  if (!article) {
    notFound();
  }

  return <ArticleEditorForm initialArticle={article} isEditing={true} />;
}
