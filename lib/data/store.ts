import {
  Category,
  Author,
  Article,
  DailyRate,
  CurrencyRate,
  Plan,
  HomeSlot,
  Comment,
  StaffRole,
  District,
  Video
} from '../types';
import {
  SEED_CATEGORIES,
  SEED_AUTHORS,
  SEED_ARTICLES,
  SEED_DAILY_RATES,
  SEED_CURRENCIES,
  SEED_PLANS,
  SEED_HOME_SLOTS,
  KERALA_DISTRICTS,
  SEED_VIDEOS
} from './seed-data';

// Server-side in-memory state with persistence to local cache
class NewsDataStore {
  private categories: Category[] = [...SEED_CATEGORIES];
  private authors: Author[] = [...SEED_AUTHORS];
  private articles: Article[] = [...SEED_ARTICLES];
  private dailyRates: DailyRate[] = [...SEED_DAILY_RATES];
  private currencies: CurrencyRate[] = [...SEED_CURRENCIES];
  private plans: Plan[] = [...SEED_PLANS];
  private homeSlots: HomeSlot[] = [...SEED_HOME_SLOTS];
  private districts: District[] = [...KERALA_DISTRICTS];
  private videos: Video[] = [...SEED_VIDEOS];
  private comments: Comment[] = [
    {
      id: 'comm-1',
      article_id: 'art-1',
      user_name: 'രമേശ് കുമാർ',
      body: 'സ്വർണവില ഇനിയും ഉയരുമോ? സാധാരണക്കാർക്ക് ആഭരണം വാങ്ങാൻ കഴിയാത്ത അവസ്ഥയാണ്.',
      status: 'visible',
      created_at: '2026-10-28T10:15:00Z'
    },
    {
      id: 'comm-2',
      article_id: 'art-2',
      user_name: 'ഫഹദ് ഇക്ബാൽ',
      body: 'കേരളത്തിലെ ഐടി മേഖലയ്ക്ക് ഇതൊരു വലിയ ഉണർവാണ്. കൂടുതൽ എംഎൻസികൾ കൊച്ചിയിലേക്ക് വരണം.',
      status: 'visible',
      created_at: '2026-10-28T09:40:00Z'
    }
  ];

  constructor() {
    this.loadFromDisk();
  }

  private loadFromDisk() {
    try {
      if (typeof window === 'undefined') {
        // Node.js environment
        const fs = require('fs');
        const path = require('path');
        const cachePath = path.join(process.cwd(), '.data-cache.json');
        if (fs.existsSync(cachePath)) {
          const raw = fs.readFileSync(cachePath, 'utf8');
          const data = JSON.parse(raw);
          if (Array.isArray(data.articles) && data.articles.length > 0) {
            this.articles = data.articles;
          }
          if (Array.isArray(data.categories) && data.categories.length > 0) {
            this.categories = data.categories;
          }
          if (Array.isArray(data.homeSlots) && data.homeSlots.length > 0) {
            this.homeSlots = data.homeSlots;
          }
          if (Array.isArray(data.dailyRates) && data.dailyRates.length > 0) {
            this.dailyRates = data.dailyRates;
          }
          if (Array.isArray(data.comments) && data.comments.length > 0) {
            this.comments = data.comments;
          }
          if (Array.isArray(data.videos) && data.videos.length > 0) {
            this.videos = data.videos;
          }
        }
      }
    } catch {
      // fallback to seed
    }
  }

  private saveToDisk() {
    try {
      if (typeof window === 'undefined') {
        const fs = require('fs');
        const path = require('path');
        const cachePath = path.join(process.cwd(), '.data-cache.json');
        const data = {
          articles: this.articles,
          categories: this.categories,
          homeSlots: this.homeSlots,
          dailyRates: this.dailyRates,
          comments: this.comments,
          videos: this.videos
        };
        fs.writeFileSync(cachePath, JSON.stringify(data, null, 2), 'utf8');
      }
    } catch {
      // non-fatal
    }
  }

  // ================= CATEGORIES =================
  getCategories(): Category[] {
    const parents = this.categories.filter(c => !c.parent_id);
    return parents.map(parent => ({
      ...parent,
      children: this.categories.filter(c => c.parent_id === parent.id)
    }));
  }

  getFlatCategories(): Category[] {
    return this.categories;
  }

  getCategoryBySlug(slug: string): { category: Category | undefined; subCategories: Category[] } {
    const category = this.categories.find(c => c.slug === slug);
    if (!category) return { category: undefined, subCategories: [] };

    // If it's a top-level category, find its subcategories
    if (!category.parent_id) {
      const subCategories = this.categories.filter(c => c.parent_id === category.id);
      return { category, subCategories };
    }

    // If it's a subcategory, find its siblings and parent
    const parent = this.categories.find(c => c.id === category.parent_id);
    const siblings = parent ? this.categories.filter(c => c.parent_id === parent.id) : [];
    return { category, subCategories: siblings };
  }

  saveCategory(data: Partial<Category> & { name_ml: string; name_en: string; slug: string }): Category {
    const existingIndex = this.categories.findIndex(c => c.id === data.id || c.slug === data.slug);
    if (existingIndex >= 0) {
      this.categories[existingIndex] = {
        ...this.categories[existingIndex],
        ...data,
      };
      this.saveToDisk();
      return this.categories[existingIndex];
    } else {
      const newCategory: Category = {
        id: data.id || `cat-${Date.now()}`,
        slug: data.slug,
        name_ml: data.name_ml,
        name_en: data.name_en,
        parent_id: data.parent_id || null,
        sort_order: data.sort_order ?? this.categories.length,
        show_in_nav: data.show_in_nav ?? false,
        is_premium_section: data.is_premium_section ?? false,
      };
      this.categories.push(newCategory);
      this.saveToDisk();
      return newCategory;
    }
  }

  deleteCategory(id: string): boolean {
    const initialLen = this.categories.length;
    this.categories = this.categories.filter(c => c.id !== id);
    this.saveToDisk();
    return this.categories.length < initialLen;
  }

  // ================= AUTHORS =================
  getAuthors(): Author[] {
    return this.authors;
  }

  getAuthorBySlug(slug: string): Author | undefined {
    return this.authors.find(a => a.slug === slug);
  }

  // ================= ARTICLES =================
  getArticles(options: {
    categorySlug?: string;
    authorSlug?: string;
    districtSlug?: string;
    tag?: string;
    status?: string;
    isPremium?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
  } = {}): { articles: Article[]; total: number } {
    let list = this.articles.map(art => ({
      ...art,
      category: this.categories.find(c => c.id === art.category_id),
      author: this.authors.find(a => a.id === art.author_id)
    }));

    if (options.status && options.status !== 'all') {
      list = list.filter(a => a.status === options.status);
    } else if (!options.status) {
      // Default to published stories for reader views
      list = list.filter(a => a.status === 'published');
    }

    if (options.categorySlug) {
      const targetCat = this.categories.find(c => c.slug === options.categorySlug);
      if (targetCat) {
        // Include stories from this category or any of its subcategories
        const childCatIds = this.categories.filter(c => c.parent_id === targetCat.id).map(c => c.id);
        const matchIds = new Set([targetCat.id, ...childCatIds]);
        list = list.filter(a => matchIds.has(a.category_id));
      } else {
        list = [];
      }
    }

    if (options.authorSlug) {
      const author = this.authors.find(a => a.slug === options.authorSlug);
      if (author) {
        list = list.filter(a => a.author_id === author.id);
      } else {
        list = [];
      }
    }

    if (options.districtSlug) {
      list = list.filter(a => a.district === options.districtSlug);
    }

    if (options.tag) {
      const tagLower = options.tag.toLowerCase();
      list = list.filter(a => a.tags?.some(t => t.toLowerCase() === tagLower));
    }

    if (options.isPremium !== undefined) {
      list = list.filter(a => a.is_premium === options.isPremium);
    }

    if (options.search) {
      const q = options.search.toLowerCase().trim();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.body_text?.toLowerCase().includes(q) ||
        a.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort by published_at desc
    list.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

    const total = list.length;
    const offset = options.offset || 0;
    const limit = options.limit || 50;
    const paginated = list.slice(offset, offset + limit);

    return { articles: paginated, total };
  }

  getArticleBySlug(slug: string): Article | undefined {
    const art = this.articles.find(a => a.slug === slug);
    if (!art) return undefined;
    return {
      ...art,
      category: this.categories.find(c => c.id === art.category_id),
      author: this.authors.find(a => a.id === art.author_id)
    };
  }

  getArticleById(id: string): Article | undefined {
    const art = this.articles.find(a => a.id === id || a.slug === id);
    if (!art) return undefined;
    return {
      ...art,
      category: this.categories.find(c => c.id === art.category_id),
      author: this.authors.find(a => a.id === art.author_id)
    };
  }

  getHeroArticle(): Article | undefined {
    const slot = this.homeSlots.find(s => s.slot_key === 'hero' && s.position === 0);
    if (slot) {
      const art = this.articles.find(a => a.id === slot.article_id);
      if (art && art.status === 'published') {
        return {
          ...art,
          category: this.categories.find(c => c.id === art.category_id),
          author: this.authors.find(a => a.id === art.author_id)
        };
      }
    }
    return this.getArticles({ limit: 1 }).articles[0];
  }

  getBreakingNews(): Article[] {
    const slots = this.homeSlots.filter(s => s.slot_key === 'breaking');
    if (slots.length > 0) {
      const slotted = slots
        .map(s => this.articles.find(a => a.id === s.article_id && a.status === 'published'))
        .filter((a): a is Article => Boolean(a))
        .map(a => ({
          ...a,
          category: this.categories.find(c => c.id === a.category_id),
          author: this.authors.find(auth => auth.id === a.author_id)
        }));
      if (slotted.length > 0) return slotted;
    }
    return this.getArticles({ limit: 4 }).articles;
  }

  saveArticle(data: Partial<Article> & {
    title: string;
    category_id: string;
    author_id: string;
    is_hero?: boolean;
    is_breaking?: boolean;
  }): Article {
    const now = new Date().toISOString();
    const existingIndex = data.id ? this.articles.findIndex(a => a.id === data.id) : -1;

    // Helper to generate slug from title or English keywords
    const slug = data.slug || `story-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    let saved: Article;

    if (existingIndex >= 0) {
      saved = {
        ...this.articles[existingIndex],
        ...data,
        district: data.district !== undefined ? data.district : this.articles[existingIndex].district,
        updated_at: now
      };
      this.articles[existingIndex] = saved;
    } else {
      saved = {
        id: data.id || `art-${Date.now()}`,
        slug,
        title: data.title,
        excerpt: data.excerpt || '',
        category_id: data.category_id,
        author_id: data.author_id,
        district: data.district || undefined,
        hero_image_url: data.hero_image_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
        hero_caption: data.hero_caption,
        hero_credit: data.hero_credit,
        status: data.status || 'draft',
        published_at: data.published_at || (data.status === 'published' ? now : now),
        scheduled_for: data.scheduled_for || null,
        read_minutes: data.read_minutes || 3,
        is_premium: data.is_premium || false,
        preview_paragraphs: data.preview_paragraphs || 3,
        preview_html: data.preview_html || `<p>${data.excerpt || data.title}</p>`,
        body_html: data.body_html || `<p>${data.excerpt || data.title}</p>`,
        body_text: data.body_text || data.excerpt || data.title,
        is_sponsored: data.is_sponsored || false,
        sponsor_name: data.sponsor_name,
        language: data.language || 'ml',
        seo_title: data.seo_title || data.title,
        seo_description: data.seo_description || data.excerpt,
        tags: data.tags || [],
        views: 0,
        created_at: now,
        updated_at: now
      };
      this.articles.unshift(saved);
    }

    // Auto-pin to Hero slot on homepage if requested
    if (data.is_hero) {
      this.updateHomeSlot('hero', 0, saved.id);
    }

    // Auto-pin to Breaking News ticker if requested
    if (data.is_breaking) {
      this.homeSlots = [
        { id: `slot-${Date.now()}`, slot_key: 'breaking', position: 0, article_id: saved.id },
        ...this.homeSlots.filter(s => !(s.slot_key === 'breaking' && s.article_id === saved.id))
      ];
    }

    this.saveToDisk();
    return saved;
  }

  deleteArticle(id: string): boolean {
    const len = this.articles.length;
    this.articles = this.articles.filter(a => a.id !== id && a.slug !== id);
    this.homeSlots = this.homeSlots.filter(s => s.article_id !== id);
    this.saveToDisk();
    return this.articles.length < len;
  }

  // ================= RATES & CURRENCIES =================
  getDailyRates(): DailyRate[] {
    return this.dailyRates;
  }

  updateDailyRate(id: string, amount_inr: number, change_inr: number): DailyRate | undefined {
    const rate = this.dailyRates.find(r => r.id === id);
    if (!rate) return undefined;
    rate.amount_inr = amount_inr;
    rate.amount_paise = amount_inr * 100;
    rate.change_inr = change_inr;
    rate.rate_date = new Date().toISOString().split('T')[0];
    this.saveToDisk();
    return rate;
  }

  getCurrencies(): CurrencyRate[] {
    return this.currencies;
  }

  // ================= HOME SLOTS =================
  getHomeSlots(): HomeSlot[] {
    return this.homeSlots.map(s => ({
      ...s,
      article: this.articles.find(a => a.id === s.article_id)
    }));
  }

  updateHomeSlot(slot_key: HomeSlot['slot_key'], position: number, article_id: string): HomeSlot {
    const existing = this.homeSlots.find(s => s.slot_key === slot_key && s.position === position);
    let result: HomeSlot;
    if (existing) {
      existing.article_id = article_id;
      result = existing;
    } else {
      const newSlot: HomeSlot = { slot_key, position, article_id };
      this.homeSlots.push(newSlot);
      result = newSlot;
    }
    this.saveToDisk();
    return result;
  }

  // ================= COMMENTS & REACTIONS =================
  getComments(articleId: string): Comment[] {
    return this.comments.filter(c => c.article_id === articleId && c.status === 'visible');
  }

  getAllComments(): Comment[] {
    return this.comments;
  }

  addComment(articleId: string, user_name: string, body: string): Comment {
    const comment: Comment = {
      id: `comm-${Date.now()}`,
      article_id: articleId,
      user_name,
      body,
      status: 'visible', // Visible by default in local demo
      created_at: new Date().toISOString()
    };
    this.comments.unshift(comment);
    this.saveToDisk();
    return comment;
  }

  moderateComment(id: string, status: 'visible' | 'hidden'): Comment | undefined {
    const comment = this.comments.find(c => c.id === id);
    if (comment) {
      comment.status = status;
      this.saveToDisk();
    }
    return comment;
  }

  // ================= PLANS =================
  getPlans(): Plan[] {
    return this.plans;
  }

  // ================= DISTRICTS =================
  getDistricts(): District[] {
    return this.districts;
  }

  getDistrictBySlug(slug: string): District | undefined {
    return this.districts.find(d => d.slug === slug);
  }

  // ================= VIDEOS =================
  getVideos(options: { isShort?: boolean; limit?: number } = {}): Video[] {
    let list = [...this.videos];
    if (options.isShort !== undefined) {
      list = list.filter(v => v.is_short === options.isShort);
    }
    list.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    if (options.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  getVideoById(id: string): Video | undefined {
    return this.videos.find(v => v.id === id || v.youtube_id === id);
  }

  saveVideo(videoData: Partial<Video> & { youtube_id: string; title: string }): Video {
    const existingIndex = this.videos.findIndex(v => v.id === videoData.id || v.youtube_id === videoData.youtube_id);
    const now = new Date().toISOString();
    let saved: Video;
    if (existingIndex >= 0) {
      saved = { ...this.videos[existingIndex], ...videoData };
      this.videos[existingIndex] = saved;
    } else {
      saved = {
        id: videoData.id || `vid-${Date.now()}`,
        youtube_id: videoData.youtube_id,
        title: videoData.title,
        category: videoData.category || 'പൊതുവാർത്തകൾ',
        thumbnail_url: videoData.thumbnail_url || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=600&q=80',
        is_short: videoData.is_short ?? false,
        published_at: videoData.published_at || now,
        duration: videoData.duration || '2:30',
        views: 0,
        created_at: now
      };
      this.videos.unshift(saved);
    }
    this.saveToDisk();
    return saved;
  }

  // ================= ADMIN STATS =================
  getAdminStats() {
    return {
      totalArticles: this.articles.length,
      publishedArticles: this.articles.filter(a => a.status === 'published').length,
      draftArticles: this.articles.filter(a => a.status === 'draft').length,
      scheduledArticles: this.articles.filter(a => a.status === 'scheduled').length,
      premiumArticles: this.articles.filter(a => a.is_premium).length,
      categoriesCount: this.categories.length,
      authorsCount: this.authors.length,
      pendingCommentsCount: this.comments.filter(c => c.status === 'pending').length,
      totalViews: this.articles.reduce((acc, a) => acc + (a.views || 0), 0)
    };
  }
}

// Global singleton instance preserved across Next.js module reloads and chunks
const globalForNews = globalThis as unknown as { __newsStore__?: NewsDataStore };
export const newsStore = globalForNews.__newsStore__ ?? new NewsDataStore();
if (!globalForNews.__newsStore__) {
  globalForNews.__newsStore__ = newsStore;
}
