export type StaffRole = 'author' | 'editor' | 'admin';

export interface Profile {
  id: string;
  email?: string;
  phone?: string;
  display_name?: string;
  preferred_language: 'ml' | 'en';
  staff_role?: StaffRole;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name_ml: string;
  name_en: string;
  parent_id?: string | null;
  sort_order: number;
  show_in_nav: boolean;
  is_premium_section: boolean;
  created_at?: string;
  children?: Category[];
}

export interface Author {
  id: string;
  slug: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
}

export type ArticleStatus = 'draft' | 'in_review' | 'scheduled' | 'published' | 'archived';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category_id: string;
  category?: Category;
  author_id: string;
  author?: Author;
  hero_image_url?: string;
  hero_caption?: string;
  hero_credit?: string;
  status: ArticleStatus;
  published_at: string;
  scheduled_for?: string | null;
  read_minutes: number;
  is_premium: boolean;
  preview_paragraphs: number;
  preview_html?: string;
  body_html: string;
  body_text?: string;
  is_sponsored: boolean;
  sponsor_name?: string;
  language: 'ml' | 'en';
  seo_title?: string;
  seo_description?: string;
  tags?: string[];
  district?: string;
  views?: number;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: string;
  slug: string;
  name_ml: string;
  name_en: string;
  zone: 'south' | 'central' | 'north';
  headquarters_ml: string;
}

export interface Video {
  id: string;
  youtube_id: string;
  title: string;
  category?: string;
  thumbnail_url?: string;
  is_short: boolean;
  published_at: string;
  duration?: string;
  views?: number;
  created_at: string;
}

export interface DailyRate {
  id: string;
  rate_date: string;
  metal: 'gold_22k' | 'gold_24k' | 'silver';
  region: string;
  unit: 'gram' | 'pavan' | 'kg';
  amount_paise: number;
  amount_inr: number;
  change_inr?: number;
  source: string;
}

export interface CurrencyRate {
  code: string;
  name_en: string;
  name_ml: string;
  rate_to_inr: number;
  flag: string;
}

export interface Comment {
  id: string;
  article_id: string;
  user_name: string;
  user_id?: string;
  parent_id?: string | null;
  body: string;
  status: 'pending' | 'visible' | 'hidden';
  created_at: string;
}

export interface Reaction {
  article_id: string;
  mood: 'like' | 'love' | 'sad' | 'angry' | 'surprised';
  count: number;
}

export interface HomeSlot {
  id?: string;
  slot_key: 'hero' | 'breaking' | 'top_markets' | 'brand_connect';
  position: number;
  article_id: string;
  article?: Article;
}

export interface Plan {
  id: string;
  code: string;
  name: string;
  name_ml: string;
  amount_inr: number;
  amount_paise: number;
  currency: string;
  billing_interval: 'month' | 'year';
  features: string[];
}
