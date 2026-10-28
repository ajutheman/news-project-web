import React from 'react';
import { notFound } from 'next/navigation';
import { newsStore } from '@/lib/data/store';
import { ArticleEditorForm } from '@/components/admin/ArticleEditorForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const articles = newsStore.getArticles({ limit: 100 }).articles;
  const article = articles.find(a => a.id === id || a.slug === id);

  if (!article) {
    notFound();
  }

  return <ArticleEditorForm initialArticle={article} isEditing={true} />;
}
