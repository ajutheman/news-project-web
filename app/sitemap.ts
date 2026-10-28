import { MetadataRoute } from 'next';
import { newsStore } from '@/lib/data/store';

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { articles } = newsStore.getArticles({ limit: 100 });
  const categories = newsStore.getFlatCategories();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}`, lastModified: new Date(), changeFrequency: 'always', priority: 1.0 },
    { url: `${siteUrl}/sections`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/tools/gold-rate`, lastModified: new Date(), changeFrequency: 'hourly', priority: 0.9 },
    { url: `${siteUrl}/tools/calculators`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/tools/currency`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/membership`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/topic/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/article/${a.slug}`,
    lastModified: new Date(a.updated_at || a.published_at),
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
