import React from 'react';
import { Metadata } from 'next';
import { newsStore } from '@/lib/data/store';
import { ArticleCard } from '@/components/ArticleCard';

export const metadata: Metadata = {
  title: 'വാർത്തകൾ തിരയുക (Search) - ദ പ്രോഫിറ്റ്',
  description: 'മലയാളത്തിലും ഇംഗ്ലീഷിലും വാർത്തകളും ലേഖനങ്ങളും തിരയുക.',
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q || '';

  // Transliteration helper dictionary to map common Manglish terms to Malayalam keywords
  const manglishMap: Record<string, string> = {
    'swarnam': 'സ്വർണം',
    'gold': 'സ്വർണം',
    'kerala': 'കേരളം',
    'infopark': 'ഇൻഫോപാർക്ക്',
    'share': 'ഓഹരി',
    'stock': 'ഓഹരി',
    'cricket': 'ക്രിക്കറ്റ്',
    'sanju': 'സഞ്ജു',
    'cinema': 'സിനിമ',
    'film': 'സിനിമ',
  };

  const extraQuery = manglishMap[query.toLowerCase().trim()] || '';
  const effectiveQuery = extraQuery ? `${query} ${extraQuery}` : query;

  const { articles, total } = query.trim()
    ? newsStore.getArticles({ search: query, limit: 30 })
    : { articles: [], total: 0 };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold font-reading text-text">
          വാർത്തകൾ തിരയുക (Search)
        </h1>
        <p className="mt-1 text-xs text-text-muted">
          മലയാളത്തിലോ മംഗ്ലീഷിലോ (Manglish) ഇംഗ്ലീഷിലോ തിരയാവുന്നതാണ്.
        </p>

        <form method="GET" action="/search" className="mt-4 flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="ഉദാ: സ്വർണം, gold, ടെക്നോപാർക്ക്, വിപണി..."
            className="flex-1 bg-surface border border-border-input rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-accent"
            autoFocus
          />
          <button
            type="submit"
            className="bg-accent text-white px-6 py-2.5 rounded-md text-sm font-bold hover:opacity-90 transition-all"
          >
            തിരയുക
          </button>
        </form>
      </div>

      {query && (
        <div className="pt-4 border-t border-border">
          <div className="text-xs text-text-muted mb-4">
            &quot;<strong>{query}</strong>&quot; എന്നതിന് ലഭിച്ച ഫലങ്ങൾ: {total} വാർത്തകൾ
          </div>

          {articles.length === 0 ? (
            <div className="bg-surface border border-border rounded-lg p-10 text-center text-text-muted">
              ക്ഷമിക്കുക, ഈ വാക്കിൽ വാർത്തകൾ ഒന്നും കണ്ടെത്താനായില്ല. മറ്റൊരു വാക്ക് ഉപയോഗിച്ച് തിരഞ്ഞു നോക്കുക.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map((art) => (
                <ArticleCard key={art.id} article={art} variant="card" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
