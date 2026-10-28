export type StaffRole = 'super_admin' | 'editor' | 'author' | 'admin' | 'ad_manager';

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

// ================= ADVERTISING & ADSENSE =================
export type AdSlotKey = 'header_banner' | 'sidebar_banner' | 'article_middle' | 'footer_banner' | 'sticky_mobile';

export interface AdSlotConfig {
  slot_key: AdSlotKey;
  name?: string;
  size?: string; // e.g., '728x90', '300x250', '320x50'
  is_active: boolean;
  ad_type?: 'adsense' | 'direct' | 'affiliate';
  provider?: 'direct' | 'adsense' | 'affiliate';
  adsense_slot_id?: string;
  direct_title?: string;
  direct_image_url?: string;
  direct_link_url?: string;
  direct_sponsor_name?: string;
  direct_campaign_name?: string;
  direct_banner_url?: string;
  direct_target_url?: string;
  direct_alt_text?: string;
  impressions?: number;
  clicks?: number;
}

export interface AdSenseSettings {
  publisher_id: string; // 'ca-pub-XXXXXXXXXXXXXXXX'
  enable_auto_ads?: boolean;
  enable_display_ads?: boolean;
  enable_admob?: boolean;
  auto_ads_enabled?: boolean;
}

// ================= BUSINESS DIRECTORY =================
export interface BusinessListing {
  id: string;
  name_ml: string;
  name_en: string;
  category?: string;
  category_ml?: string;
  district?: string;
  city?: string;
  description?: string;
  description_ml?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  address?: string;
  address_ml?: string;
  logo_url?: string;
  tier: 'free' | 'featured' | 'gold' | 'platinum';
  is_verified: boolean;
  views?: number;
  created_at?: string;
}

// ================= JOBS & RECRUITMENT =================
export interface JobListing {
  id: string;
  title?: string;
  title_ml?: string;
  title_en?: string;
  company_name: string;
  company_logo?: string;
  location?: string;
  district?: string;
  region?: 'kerala' | 'gulf' | 'global' | 'remote';
  is_gulf?: boolean;
  gulf_country?: string;
  job_type: 'Full-time' | 'Part-time' | 'Remote' | 'Contract' | string;
  salary_range?: string;
  experience?: string;
  description?: string;
  description_ml?: string;
  apply_url_or_email?: string;
  apply_url?: string;
  is_featured?: boolean;
  is_active?: boolean;
  posted_date?: string;
  created_at?: string;
}

// ================= EVENTS & AWARDS =================
export interface NewsEvent {
  id: string;
  title?: string;
  title_ml?: string;
  title_en?: string;
  subtitle?: string;
  event_type: 'conference' | 'webinar' | 'awards' | 'workshop' | 'conclave' | string;
  date_string?: string;
  date_display?: string;
  location_or_platform?: string;
  venue_ml?: string;
  ticket_price_inr?: number;
  ticket_price?: string;
  ticket_link?: string;
  registration_url?: string;
  image_url?: string;
  banner_url?: string;
  description?: string;
  description_ml?: string;
  sponsor_names?: string[];
  is_featured: boolean;
  created_at?: string;
}

// ================= CLASSIFIEDS =================
export interface ClassifiedAd {
  id: string;
  title?: string;
  title_ml?: string;
  title_en?: string;
  category?: 'real_estate' | 'commercial' | 'business_sale' | 'vehicles' | 'machinery' | 'services' | string;
  category_ml?: string;
  district: string;
  price_inr?: number;
  price_display?: string;
  description?: string;
  description_ml?: string;
  contact_name?: string;
  contact_phone: string;
  contact_whatsapp?: string;
  image_url?: string;
  is_approved?: boolean;
  is_active?: boolean;
  created_at?: string;
}

// ================= RESEARCH REPORTS =================
export interface ResearchReport {
  id: string;
  title?: string;
  title_ml?: string;
  title_en?: string;
  category?: string;
  pages_count: number;
  format?: 'PDF' | string;
  price_inr?: number;
  price_display?: string;
  is_premium: boolean;
  cover_image_url?: string;
  summary?: string;
  summary_ml?: string;
  download_url?: string;
  downloads_count?: number;
  published_at?: string;
  published_date?: string;
}

// ================= SITE MASTER SETTINGS =================
export type SiteEdition = 'kerala' | 'gulf' | 'global';

export interface SiteSettings {
  site_name_ml?: string;
  site_title_ml?: string;
  site_name_en?: string;
  site_title_en?: string;
  tagline_ml?: string;
  tagline_en?: string;
  default_edition: SiteEdition;
  adsense_publisher_id: string;
  enable_ads?: boolean;
  enable_donations?: boolean;
  breaking_alert_text?: string;
  breaking_news_text?: string;
  breaking_news_link?: string;
  breaking_news_active?: boolean;
  whatsapp_channel_url?: string;
  telegram_channel_url?: string;
  contact_email?: string;
  contact_phone?: string;
  maintenance_mode: boolean;
}

// ================= STAFF USERS & PERMISSIONS =================
export interface StaffPermissions {
  can_publish: boolean;
  can_manage_ads: boolean;
  can_manage_categories: boolean;
  can_manage_users: boolean;
  can_moderate_comments: boolean;
  can_manage_business: boolean;
}

export interface StaffUser {
  id: string;
  email: string;
  name?: string;
  display_name?: string;
  role: StaffRole;
  permissions: StaffPermissions;
  last_login?: string;
  status?: 'active' | 'suspended';
  is_active?: boolean;
  created_at?: string;
}
