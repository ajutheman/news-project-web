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
  Video,
  AdSlotConfig,
  AdSenseSettings,
  BusinessListing,
  JobListing,
  NewsEvent,
  ClassifiedAd,
  ResearchReport,
  StaffUser,
  SiteSettings
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
  SEED_VIDEOS,
  SEED_AD_SLOTS,
  SEED_ADSENSE,
  SEED_BUSINESSES,
  SEED_JOBS,
  SEED_EVENTS,
  SEED_CLASSIFIEDS,
  SEED_REPORTS,
  SEED_STAFF_USERS,
  SEED_SITE_SETTINGS
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
  private adSlots: AdSlotConfig[] = [...SEED_AD_SLOTS];
  private adsense: AdSenseSettings = { ...SEED_ADSENSE };
  private businesses: BusinessListing[] = [...SEED_BUSINESSES];
  private jobs: JobListing[] = [...SEED_JOBS];
  private events: NewsEvent[] = [...SEED_EVENTS];
  private classifieds: ClassifiedAd[] = [...SEED_CLASSIFIEDS];
  private reports: ResearchReport[] = [...SEED_REPORTS];
  private staffUsers: StaffUser[] = [...SEED_STAFF_USERS];
  private siteSettings: SiteSettings = { ...SEED_SITE_SETTINGS };
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
          if (Array.isArray(data.adSlots) && data.adSlots.length > 0) {
            this.adSlots = data.adSlots;
          }
          if (data.adsense && data.adsense.publisher_id) {
            this.adsense = data.adsense;
          }
          if (Array.isArray(data.businesses) && data.businesses.length > 0) {
            this.businesses = data.businesses;
          }
          if (Array.isArray(data.jobs) && data.jobs.length > 0) {
            this.jobs = data.jobs;
          }
          if (Array.isArray(data.events) && data.events.length > 0) {
            this.events = data.events;
          }
          if (Array.isArray(data.classifieds) && data.classifieds.length > 0) {
            this.classifieds = data.classifieds;
          }
          if (Array.isArray(data.reports) && data.reports.length > 0) {
            this.reports = data.reports;
          }
          if (Array.isArray(data.staffUsers) && data.staffUsers.length > 0) {
            this.staffUsers = data.staffUsers;
          }
          if (data.siteSettings && data.siteSettings.site_name_ml) {
            this.siteSettings = data.siteSettings;
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
          videos: this.videos,
          adSlots: this.adSlots,
          adsense: this.adsense,
          businesses: this.businesses,
          jobs: this.jobs,
          events: this.events,
          classifieds: this.classifieds,
          reports: this.reports,
          staffUsers: this.staffUsers,
          siteSettings: this.siteSettings
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

  // ================= ADVERTISING & ADSENSE =================
  getAdSlots(): AdSlotConfig[] {
    return this.adSlots;
  }

  getAdSlotByKey(slotKey: AdSlotConfig['slot_key']): AdSlotConfig | undefined {
    return this.adSlots.find(s => s.slot_key === slotKey);
  }

  updateAdSlot(slotKey: AdSlotConfig['slot_key'], data: Partial<AdSlotConfig>): AdSlotConfig | undefined {
    const slot = this.adSlots.find(s => s.slot_key === slotKey);
    if (!slot) return undefined;
    Object.assign(slot, data);
    this.saveToDisk();
    return slot;
  }

  recordAdClick(slotKey: AdSlotConfig['slot_key']) {
    const slot = this.adSlots.find(s => s.slot_key === slotKey);
    if (slot) {
      slot.clicks = (slot.clicks || 0) + 1;
      this.saveToDisk();
    }
  }

  recordAdImpression(slotKey: AdSlotConfig['slot_key']) {
    const slot = this.adSlots.find(s => s.slot_key === slotKey);
    if (slot) {
      slot.impressions = (slot.impressions || 0) + 1;
      this.saveToDisk();
    }
  }

  getAdSenseSettings(): AdSenseSettings {
    return this.adsense;
  }

  updateAdSenseSettings(data: Partial<AdSenseSettings>): AdSenseSettings {
    this.adsense = { ...this.adsense, ...data };
    this.saveToDisk();
    return this.adsense;
  }

  // ================= BUSINESS DIRECTORY =================
  getBusinesses(options: { category?: string; district?: string; search?: string } = {}): BusinessListing[] {
    let list = [...this.businesses];
    if (options.category) {
      list = list.filter(b => (b.category || b.category_ml || '').toLowerCase().includes(options.category!.toLowerCase()));
    }
    if (options.district) {
      list = list.filter(b => b.district === options.district);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(b =>
        b.name_ml.toLowerCase().includes(q) ||
        b.name_en.toLowerCase().includes(q) ||
        (b.city || '').toLowerCase().includes(q) ||
        (b.category || b.category_ml || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  getBusinessById(id: string): BusinessListing | undefined {
    return this.businesses.find(b => b.id === id);
  }

  saveBusiness(data: Partial<BusinessListing> & { name_ml: string; phone: string; category: string }): BusinessListing {
    const idx = data.id ? this.businesses.findIndex(b => b.id === data.id) : -1;
    if (idx >= 0) {
      this.businesses[idx] = { ...this.businesses[idx], ...data };
      this.saveToDisk();
      return this.businesses[idx];
    } else {
      const newBiz: BusinessListing = {
        id: data.id || `biz-${Date.now()}`,
        name_ml: data.name_ml,
        name_en: data.name_en || data.name_ml,
        category: data.category,
        district: data.district,
        city: data.city || 'കേരളം',
        description: data.description || '',
        phone: data.phone,
        whatsapp: data.whatsapp,
        email: data.email,
        website: data.website,
        address: data.address || '',
        logo_url: data.logo_url || 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=200&h=200&q=80',
        tier: data.tier || 'free',
        is_verified: data.is_verified ?? true,
        views: 0,
        created_at: new Date().toISOString()
      };
      this.businesses.unshift(newBiz);
      this.saveToDisk();
      return newBiz;
    }
  }

  deleteBusiness(id: string): boolean {
    const len = this.businesses.length;
    this.businesses = this.businesses.filter(b => b.id !== id);
    this.saveToDisk();
    return this.businesses.length < len;
  }

  // ================= JOBS & RECRUITMENT =================
  getJobs(options: { region?: string; jobType?: string; search?: string } = {}): JobListing[] {
    let list = [...this.jobs];
    if (options.region) {
      list = list.filter(j => j.region === options.region);
    }
    if (options.jobType) {
      list = list.filter(j => j.job_type === options.jobType);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(j =>
        (j.title || j.title_ml || '').toLowerCase().includes(q) ||
        j.company_name.toLowerCase().includes(q) ||
        (j.location || j.district || j.gulf_country || '').toLowerCase().includes(q)
      );
    }
    return list;
  }

  getJobById(id: string): JobListing | undefined {
    return this.jobs.find(j => j.id === id);
  }

  saveJob(data: Partial<JobListing> & { title: string; company_name: string }): JobListing {
    const idx = data.id ? this.jobs.findIndex(j => j.id === data.id) : -1;
    if (idx >= 0) {
      this.jobs[idx] = { ...this.jobs[idx], ...data };
      this.saveToDisk();
      return this.jobs[idx];
    } else {
      const newJob: JobListing = {
        id: data.id || `job-${Date.now()}`,
        title: data.title,
        company_name: data.company_name,
        company_logo: data.company_logo || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&h=100&q=80',
        location: data.location || 'കേരളം',
        region: data.region || 'kerala',
        job_type: data.job_type || 'Full-time',
        salary_range: data.salary_range,
        experience: data.experience,
        description: data.description || '',
        apply_url_or_email: data.apply_url_or_email || 'careers@theprofit.in',
        is_featured: data.is_featured ?? false,
        created_at: new Date().toISOString()
      };
      this.jobs.unshift(newJob);
      this.saveToDisk();
      return newJob;
    }
  }

  deleteJob(id: string): boolean {
    const len = this.jobs.length;
    this.jobs = this.jobs.filter(j => j.id !== id);
    this.saveToDisk();
    return this.jobs.length < len;
  }

  // ================= EVENTS & AWARDS =================
  getEvents(): NewsEvent[] {
    return this.events;
  }

  getEventById(id: string): NewsEvent | undefined {
    return this.events.find(e => e.id === id);
  }

  saveEvent(data: Partial<NewsEvent> & { title: string; date_string: string }): NewsEvent {
    const idx = data.id ? this.events.findIndex(e => e.id === data.id) : -1;
    if (idx >= 0) {
      this.events[idx] = { ...this.events[idx], ...data };
      this.saveToDisk();
      return this.events[idx];
    } else {
      const newEvt: NewsEvent = {
        id: data.id || `evt-${Date.now()}`,
        title: data.title,
        subtitle: data.subtitle,
        event_type: data.event_type || 'conference',
        date_string: data.date_string,
        location_or_platform: data.location_or_platform || 'കൊച്ചി',
        ticket_price_inr: data.ticket_price_inr ?? 0,
        ticket_link: data.ticket_link,
        image_url: data.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        description: data.description || '',
        sponsor_names: data.sponsor_names || [],
        is_featured: data.is_featured ?? false,
        created_at: new Date().toISOString()
      };
      this.events.unshift(newEvt);
      this.saveToDisk();
      return newEvt;
    }
  }

  deleteEvent(id: string): boolean {
    const len = this.events.length;
    this.events = this.events.filter(e => e.id !== id);
    this.saveToDisk();
    return this.events.length < len;
  }

  // ================= CLASSIFIEDS =================
  getClassifieds(options: { category?: string; district?: string } = {}): ClassifiedAd[] {
    let list = [...this.classifieds];
    if (options.category) {
      list = list.filter(c => c.category === options.category);
    }
    if (options.district) {
      list = list.filter(c => c.district === options.district);
    }
    return list;
  }

  saveClassified(data: Partial<ClassifiedAd> & { title: string; contact_phone: string; district: string }): ClassifiedAd {
    const idx = data.id ? this.classifieds.findIndex(c => c.id === data.id) : -1;
    if (idx >= 0) {
      this.classifieds[idx] = { ...this.classifieds[idx], ...data };
      this.saveToDisk();
      return this.classifieds[idx];
    } else {
      const newClf: ClassifiedAd = {
        id: data.id || `clf-${Date.now()}`,
        title: data.title,
        category: data.category || 'commercial',
        district: data.district,
        price_inr: data.price_inr,
        description: data.description || '',
        contact_name: data.contact_name || 'പരസ്യദാതാവ്',
        contact_phone: data.contact_phone,
        contact_whatsapp: data.contact_whatsapp,
        image_url: data.image_url || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
        is_approved: data.is_approved ?? true,
        created_at: new Date().toISOString()
      };
      this.classifieds.unshift(newClf);
      this.saveToDisk();
      return newClf;
    }
  }

  deleteClassified(id: string): boolean {
    const len = this.classifieds.length;
    this.classifieds = this.classifieds.filter(c => c.id !== id);
    this.saveToDisk();
    return this.classifieds.length < len;
  }

  // ================= RESEARCH REPORTS =================
  getReports(): ResearchReport[] {
    return this.reports;
  }

  saveReport(data: Partial<ResearchReport> & { title: string; download_url: string }): ResearchReport {
    const idx = data.id ? this.reports.findIndex(r => r.id === data.id) : -1;
    if (idx >= 0) {
      this.reports[idx] = { ...this.reports[idx], ...data };
      this.saveToDisk();
      return this.reports[idx];
    } else {
      const newRep: ResearchReport = {
        id: data.id || `rep-${Date.now()}`,
        title: data.title,
        category: data.category || 'ഇക്കണോമിക്സ്',
        pages_count: data.pages_count || 30,
        format: 'PDF',
        price_inr: data.price_inr ?? 0,
        is_premium: data.is_premium ?? false,
        cover_image_url: data.cover_image_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
        summary: data.summary || '',
        download_url: data.download_url,
        downloads_count: 0,
        published_at: new Date().toISOString()
      };
      this.reports.unshift(newRep);
      this.saveToDisk();
      return newRep;
    }
  }

  deleteReport(id: string): boolean {
    const len = this.reports.length;
    this.reports = this.reports.filter(r => r.id !== id);
    this.saveToDisk();
    return this.reports.length < len;
  }

  // ================= STAFF USERS & PERMISSIONS =================
  getStaffUsers(): StaffUser[] {
    return this.staffUsers;
  }

  getStaffUserById(id: string): StaffUser | undefined {
    return this.staffUsers.find(u => u.id === id || u.email === id);
  }

  saveStaffUser(data: Partial<StaffUser> & { email: string; role: StaffRole; name?: string; display_name?: string }): StaffUser {
    const idx = data.id ? this.staffUsers.findIndex(u => u.id === data.id || u.email === data.email) : -1;
    if (idx >= 0) {
      this.staffUsers[idx] = { ...this.staffUsers[idx], ...data };
      this.saveToDisk();
      return this.staffUsers[idx];
    } else {
      const newUser: StaffUser = {
        id: data.id || `user-${Date.now()}`,
        email: data.email,
        name: data.name || data.display_name || 'Staff Member',
        display_name: data.display_name || data.name || 'Staff Member',
        role: data.role,
        permissions: data.permissions || {
          can_publish: data.role === 'super_admin' || data.role === 'editor',
          can_manage_ads: data.role === 'super_admin' || data.role === 'ad_manager',
          can_manage_categories: data.role === 'super_admin' || data.role === 'editor',
          can_manage_users: data.role === 'super_admin',
          can_moderate_comments: true,
          can_manage_business: true
        },
        status: data.status || 'active',
        is_active: data.is_active ?? true,
        created_at: new Date().toISOString()
      };
      this.staffUsers.push(newUser);
      this.saveToDisk();
      return newUser;
    }
  }

  deleteStaffUser(id: string): boolean {
    const len = this.staffUsers.length;
    this.staffUsers = this.staffUsers.filter(u => u.id !== id);
    this.saveToDisk();
    return this.staffUsers.length < len;
  }

  // ================= SITE MASTER SETTINGS =================
  getSiteSettings(): SiteSettings {
    return this.siteSettings;
  }

  updateSiteSettings(data: Partial<SiteSettings>): SiteSettings {
    this.siteSettings = { ...this.siteSettings, ...data };
    this.saveToDisk();
    return this.siteSettings;
  }

  // ================= ADMIN STATS =================
  getAdminStats() {
    const activeAds = this.adSlots.filter(s => s.is_active).length;
    return {
      totalArticles: this.articles.length,
      publishedArticles: this.articles.filter(a => a.status === 'published').length,
      draftArticles: this.articles.filter(a => a.status === 'draft').length,
      scheduledArticles: this.articles.filter(a => a.status === 'scheduled').length,
      premiumArticles: this.articles.filter(a => a.is_premium).length,
      categoriesCount: this.categories.length,
      authorsCount: this.authors.length,
      pendingCommentsCount: this.comments.filter(c => c.status === 'pending').length,
      totalViews: this.articles.reduce((acc, a) => acc + (a.views || 0), 0),
      businessesCount: this.businesses.length,
      activeJobsCount: this.jobs.length,
      eventsCount: this.events.length,
      classifiedsCount: this.classifieds.length,
      reportsCount: this.reports.length,
      staffCount: this.staffUsers.length,
      activeAdsCount: activeAds,
      activeAdSlots: activeAds,
      totalAdImpressions: this.adSlots.reduce((acc, s) => acc + (s.impressions || 0), 0),
      totalAdClicks: this.adSlots.reduce((acc, s) => acc + (s.clicks || 0), 0)
    };
  }
}

// Global singleton instance preserved across Next.js module reloads and chunks
const globalForNews = globalThis as unknown as { __newsStore__?: NewsDataStore };
export const newsStore = globalForNews.__newsStore__ ?? new NewsDataStore();
if (!globalForNews.__newsStore__) {
  globalForNews.__newsStore__ = newsStore;
}
