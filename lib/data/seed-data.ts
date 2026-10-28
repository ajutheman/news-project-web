import { Category, Author, Article, DailyRate, CurrencyRate, Plan, HomeSlot, District, Video } from '../types';

export const SEED_CATEGORIES: Category[] = [
  // 20 Top-level categories
  { id: 'cat-news', slug: 'news', name_ml: 'പ്രധാന വാർത്തകൾ', name_en: 'News', sort_order: 0, show_in_nav: true, is_premium_section: false },
  { id: 'cat-kerala', slug: 'kerala', name_ml: 'കേരളം', name_en: 'Kerala', sort_order: 1, show_in_nav: true, is_premium_section: false },
  { id: 'cat-india', slug: 'india', name_ml: 'ഇന്ത്യ', name_en: 'India', sort_order: 2, show_in_nav: true, is_premium_section: false },
  { id: 'cat-world', slug: 'world', name_ml: 'ലോകം', name_en: 'World', sort_order: 3, show_in_nav: true, is_premium_section: false },
  { id: 'cat-gulf', slug: 'gulf', name_ml: 'ഗൾഫ്', name_en: 'Gulf', sort_order: 4, show_in_nav: true, is_premium_section: false },
  { id: 'cat-business', slug: 'business', name_ml: 'ബിസിനസ്', name_en: 'Business', sort_order: 5, show_in_nav: true, is_premium_section: false },
  { id: 'cat-sports', slug: 'sports', name_ml: 'കായികം', name_en: 'Sports', sort_order: 6, show_in_nav: true, is_premium_section: false },
  { id: 'cat-entertainment', slug: 'entertainment', name_ml: 'വിനോദം', name_en: 'Entertainment', sort_order: 7, show_in_nav: true, is_premium_section: false },
  { id: 'cat-lifestyle', slug: 'lifestyle', name_ml: 'ലൈഫ്‌സ്റ്റൈൽ', name_en: 'Lifestyle', sort_order: 8, show_in_nav: true, is_premium_section: false },
  { id: 'cat-health', slug: 'health', name_ml: 'ആരോഗ്യം', name_en: 'Health', sort_order: 9, show_in_nav: true, is_premium_section: false },
  { id: 'cat-technology', slug: 'technology', name_ml: 'സാങ്കേതികം', name_en: 'Technology', sort_order: 10, show_in_nav: true, is_premium_section: false },
  { id: 'cat-automobile', slug: 'automobile', name_ml: 'വാഹനം', name_en: 'Automobile', sort_order: 11, show_in_nav: false, is_premium_section: false },
  { id: 'cat-travel', slug: 'travel', name_ml: 'യാത്ര', name_en: 'Travel', sort_order: 12, show_in_nav: false, is_premium_section: false },
  { id: 'cat-career', slug: 'career', name_ml: 'കരിയർ', name_en: 'Career', sort_order: 13, show_in_nav: false, is_premium_section: false },
  { id: 'cat-crime', slug: 'crime', name_ml: 'ക്രൈം', name_en: 'Crime', sort_order: 14, show_in_nav: false, is_premium_section: false },
  { id: 'cat-opinion', slug: 'opinion', name_ml: 'അഭിപ്രായം', name_en: 'Opinion and columns', sort_order: 15, show_in_nav: false, is_premium_section: false },
  { id: 'cat-fact-check', slug: 'fact-check', name_ml: 'ഫാക്ട് ചെക്ക്', name_en: 'Fact Check', sort_order: 16, show_in_nav: false, is_premium_section: false },
  { id: 'cat-youth-kids', slug: 'youth-kids', name_ml: 'യൂത്ത് & കിഡ്സ്', name_en: 'Youth and Kids', sort_order: 17, show_in_nav: false, is_premium_section: false },
  { id: 'cat-videos', slug: 'videos', name_ml: 'വീഡിയോ', name_en: 'Videos', sort_order: 18, show_in_nav: false, is_premium_section: false },
  { id: 'cat-premium', slug: 'premium', name_ml: 'പ്രീമിയം', name_en: 'Premium', sort_order: 19, show_in_nav: true, is_premium_section: true },

  // Business Sub-categories (8)
  { id: 'cat-markets', slug: 'markets', name_ml: 'വിപണി', name_en: 'Markets', parent_id: 'cat-business', sort_order: 0, show_in_nav: false, is_premium_section: false },
  { id: 'cat-personal-finance', slug: 'personal-finance', name_ml: 'വ്യക്തിഗത ധനകാര്യം', name_en: 'Personal Finance', parent_id: 'cat-business', sort_order: 1, show_in_nav: false, is_premium_section: false },
  { id: 'cat-economy', slug: 'economy', name_ml: 'സമ്പദ്‌വ്യവസ്ഥ', name_en: 'Economy', parent_id: 'cat-business', sort_order: 2, show_in_nav: false, is_premium_section: false },
  { id: 'cat-industry', slug: 'industry', name_ml: 'വ്യവസായം', name_en: 'Industry', parent_id: 'cat-business', sort_order: 3, show_in_nav: false, is_premium_section: false },
  { id: 'cat-banking-finance', slug: 'banking-finance', name_ml: 'ബാങ്കിങ്', name_en: 'Banking and Finance', parent_id: 'cat-business', sort_order: 4, show_in_nav: false, is_premium_section: false },
  { id: 'cat-startups', slug: 'startups', name_ml: 'സ്റ്റാർട്ടപ്പ്', name_en: 'Startups', parent_id: 'cat-business', sort_order: 5, show_in_nav: false, is_premium_section: false },
  { id: 'cat-gold-silver', slug: 'gold-silver', name_ml: 'സ്വർണം, വെള്ളി', name_en: 'Gold and Silver', parent_id: 'cat-business', sort_order: 6, show_in_nav: false, is_premium_section: false },
  { id: 'cat-success-stories', slug: 'success-stories', name_ml: 'വിജയകഥ', name_en: 'Success Stories', parent_id: 'cat-business', sort_order: 7, show_in_nav: false, is_premium_section: false },

  // Sports Sub-categories (3)
  { id: 'cat-cricket', slug: 'cricket', name_ml: 'ക്രിക്കറ്റ്', name_en: 'Cricket', parent_id: 'cat-sports', sort_order: 0, show_in_nav: false, is_premium_section: false },
  { id: 'cat-football', slug: 'football', name_ml: 'ഫുട്ബോൾ', name_en: 'Football', parent_id: 'cat-sports', sort_order: 1, show_in_nav: false, is_premium_section: false },
  { id: 'cat-other-sports', slug: 'other-sports', name_ml: 'മറ്റു കായികം', name_en: 'Other Sports', parent_id: 'cat-sports', sort_order: 2, show_in_nav: false, is_premium_section: false },

  // Entertainment Sub-categories (3)
  { id: 'cat-movies', slug: 'movies', name_ml: 'സിനിമ', name_en: 'Movies', parent_id: 'cat-entertainment', sort_order: 0, show_in_nav: false, is_premium_section: false },
  { id: 'cat-movie-reviews', slug: 'movie-reviews', name_ml: 'റിവ്യൂ', name_en: 'Movie Reviews', parent_id: 'cat-entertainment', sort_order: 1, show_in_nav: false, is_premium_section: false },
  { id: 'cat-music', slug: 'music', name_ml: 'സംഗീതം', name_en: 'Music', parent_id: 'cat-entertainment', sort_order: 2, show_in_nav: false, is_premium_section: false },

  // Lifestyle Sub-categories (3)
  { id: 'cat-women', slug: 'women', name_ml: 'വനിത', name_en: 'Women', parent_id: 'cat-lifestyle', sort_order: 0, show_in_nav: false, is_premium_section: false },
  { id: 'cat-beauty-fashion', slug: 'beauty-fashion', name_ml: 'ഫാഷൻ', name_en: 'Beauty and Fashion', parent_id: 'cat-lifestyle', sort_order: 1, show_in_nav: false, is_premium_section: false },
  { id: 'cat-food', slug: 'food', name_ml: 'ഭക്ഷണം', name_en: 'Food', parent_id: 'cat-lifestyle', sort_order: 2, show_in_nav: false, is_premium_section: false },
];

export const SEED_AUTHORS: Author[] = [
  { id: 'author-desk', slug: 'desk', display_name: 'പ്രോഫിറ്റ് ഡെസ്ക്', bio: 'ദ പ്രോഫിറ്റ് ഓൺലൈൻ വാർത്താ വിഭാഗം' },
  { id: 'author-arun', slug: 'arun-kumar', display_name: 'അരുൺ കുമാർ', bio: 'സീനിയർ കറസ്‌പോണ്ടന്റ്, തിരുവനന്തപുരം' },
  { id: 'author-priya', slug: 'priya-nair', display_name: 'പ്രിയ നായർ', bio: 'സാമ്പത്തിക വിപണി നിരീക്ഷകയും എഴുത്തുകാരിയും' },
  { id: 'author-reshma', slug: 'reshma-george', display_name: 'രേഷ്മ ജോർജ്ജ്', bio: 'ടെക്നോളജി & സ്റ്റാർട്ടപ്പ് റിപ്പോർട്ടർ' }
];

export const SEED_DAILY_RATES: DailyRate[] = [
  {
    id: 'rate-gold-22k-g',
    rate_date: '2026-10-28',
    metal: 'gold_22k',
    region: 'kerala',
    unit: 'gram',
    amount_paise: 735000,
    amount_inr: 7350,
    change_inr: 45,
    source: 'കേരള ഗോൾഡ് ആൻഡ് സിൽവർ മർച്ചന്റ്സ് അസോസിയേഷൻ'
  },
  {
    id: 'rate-gold-22k-p',
    rate_date: '2026-10-28',
    metal: 'gold_22k',
    region: 'kerala',
    unit: 'pavan',
    amount_paise: 5880000,
    amount_inr: 58800,
    change_inr: 360,
    source: 'കേരള ഗോൾഡ് ആൻഡ് സിൽവർ മർച്ചന്റ്സ് അസോസിയേഷൻ'
  },
  {
    id: 'rate-gold-24k-g',
    rate_date: '2026-10-28',
    metal: 'gold_24k',
    region: 'kerala',
    unit: 'gram',
    amount_paise: 801800,
    amount_inr: 8018,
    change_inr: 50,
    source: 'കേരള ഗോൾഡ് ആൻഡ് സിൽവർ മർച്ചന്റ്സ് അസോസിയേഷൻ'
  },
  {
    id: 'rate-silver-g',
    rate_date: '2026-10-28',
    metal: 'silver',
    region: 'kerala',
    unit: 'gram',
    amount_paise: 10300,
    amount_inr: 103,
    change_inr: 1.5,
    source: 'കേരള ബുളിയൻ ഡീലേഴ്സ്'
  }
];

export const SEED_CURRENCIES: CurrencyRate[] = [
  { code: 'AED', name_en: 'UAE Dirham', name_ml: 'യു.എ.ഇ ദിർഹം', rate_to_inr: 22.84, flag: '🇦🇪' },
  { code: 'SAR', name_en: 'Saudi Riyal', name_ml: 'സൗദി റിയാൽ', rate_to_inr: 22.37, flag: '🇸🇦' },
  { code: 'QAR', name_en: 'Qatari Riyal', name_ml: 'ഖത്തർ റിയാൽ', rate_to_inr: 23.05, flag: '🇶🇦' },
  { code: 'KWD', name_en: 'Kuwaiti Dinar', name_ml: 'കുവൈത്ത് ദിനാർ', rate_to_inr: 274.60, flag: '🇰🇼' },
  { code: 'OMR', name_en: 'Omani Rial', name_ml: 'ഒമാനി റിയാൽ', rate_to_inr: 218.10, flag: '🇴🇲' },
  { code: 'BHD', name_en: 'Bahraini Dinar', name_ml: 'ബഹ്‌റൈൻ ദിനാർ', rate_to_inr: 222.80, flag: '🇧🇭' },
  { code: 'USD', name_en: 'US Dollar', name_ml: 'യു.എസ് ഡോളർ', rate_to_inr: 83.92, flag: '🇺🇸' },
  { code: 'GBP', name_en: 'British Pound', name_ml: 'ബ്രിട്ടീഷ് പൗണ്ട്', rate_to_inr: 109.15, flag: '🇬🇧' }
];

export const SEED_PLANS: Plan[] = [
  {
    id: 'plan-monthly',
    code: 'monthly',
    name: 'Monthly Plan',
    name_ml: 'മാസിക പ്ലാൻ',
    amount_inr: 99,
    amount_paise: 9900,
    currency: 'INR',
    billing_interval: 'month',
    features: [
      'എല്ലാ എക്‌സ്‌ക്ലൂസീവ് പ്രീമിയം റിപ്പോർട്ടുകളും അപഗ്രഥനങ്ങളും',
      'പരസ്യങ്ങളില്ലാത്ത ശുദ്ധമായ വായനാനുഭവം',
      'ഇ-മാഗസിൻ പൂർണ്ണ പതിപ്പുകൾ വായിക്കാനും ഡൗൺലോഡ് ചെയ്യാനും ഉള്ള സൗകര്യം',
      'നിക്ഷേപ പോർട്ട്ഫോളിയോ അലേർട്ടുകൾ'
    ]
  },
  {
    id: 'plan-yearly',
    code: 'yearly',
    name: 'Annual Pass',
    name_ml: 'വാർഷിക പാസ് (17% ലാഭം)',
    amount_inr: 999,
    amount_paise: 99900,
    currency: 'INR',
    billing_interval: 'year',
    features: [
      'മാസിക പ്ലാനിലെ മുഴുവൻ ഫീച്ചറുകളും',
      '2 മാസം തികച്ചും സൗജന്യം',
      'വാർഷിക ഇൻവെസ്റ്റ്മെന്റ് സ്പെഷ്യൽ ഹാൻഡ്ബുക്ക്',
      'വിദഗ്ദ്ധർ പങ്കെടുക്കുന്ന വെബിനാറുകളിലേക്ക് സൗജന്യ പ്രവേശനം'
    ]
  }
];

export const SEED_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'kerala-gold-rate-today-surges-new-record',
    title: 'സംസ്ഥാനത്ത് സ്വർണവിലയിൽ വീണ്ടും റെക്കോർഡ് മുന്നേറ്റം: പവന് 58,800 രൂപ കടന്നു',
    excerpt: 'ആഗോള വിപണിയിലെ അനിശ്ചിതത്വങ്ങളും ഫെഡറൽ റിസർവ് നയങ്ങളും ആഭ്യന്തര വിപണിയിൽ സ്വർണവിലയിൽ കുതിച്ചുചാട്ടമുണ്ടാക്കി.',
    category_id: 'cat-gold-silver',
    author_id: 'author-priya',
    hero_image_url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    hero_caption: 'കേരളത്തിലെ ആഭരണ വിപണിയിൽ സ്വർണവില പുതിയ ഉയരങ്ങളിലേക്ക്',
    hero_credit: 'Photo: Unsplash',
    status: 'published',
    published_at: '2026-10-28T09:30:00Z',
    read_minutes: 3,
    is_premium: false,
    preview_paragraphs: 3,
    body_html: `
      <p>കേരളത്തിൽ സ്വർണവില സർവകാല റെക്കോർഡുകൾ ഭേദിച്ച് മുന്നേറുന്നു. ഇന്ന് ഗ്രാമിന് 45 രൂപയും പവന് 360 രൂപയുമാണ് വർധിച്ചത്. ഇതോടെ ഒരു പവൻ സ്വർണത്തിന്റെ വില 58,800 രൂപയിലെത്തി. ഗ്രാമിന് 7,350 രൂപയിലാണ് ഇന്ന് വ്യാപാരം നടക്കുന്നത്.</p>
      <p>വിവാഹ സീസൺ പടിവാതിൽക്കൽ എത്തിനിൽക്കെ സാധാരണക്കാരെയും നിക്ഷേപകരെയും ഒരുപോലെ ആശങ്കയിലാഴ്ത്തുന്നതാണ് നിലവിലെ വിലക്കയറ്റം. രാജ്യാന്തര വിപണിയിൽ ഔൺസിന് 2,750 ഡോളർ നിലവാരത്തിലേക്ക് സ്വർണം എത്തിയതാണ് സംസ്ഥാനത്തും പ്രതിഫലിച്ചത്.</p>
      <h3>പ്രധാന കാരണങ്ങൾ:</h3>
      <ul>
        <li>പശ്ചിമേഷ്യൻ പ്രതിസന്ധിയും ആഗോള രാഷ്ട്രീയ അനിശ്ചിതത്വങ്ങളും</li>
        <li>യു.എസ് ഡോളർ സൂചികയിലെ ഏറ്റക്കുറച്ചിലുകൾ</li>
        <li>കേന്ദ്ര ബാങ്കുകൾ വൻതോതിൽ സ്വർണം വാങ്ങി ശേഖരിക്കുന്നത്</li>
      </ul>
      <p>ആഭരണങ്ങൾ വാങ്ങുമ്പോൾ പണിക്കൂലിയും ജിഎസ്ടിയും കൂടി ചേരുമ്പോൾ ഉപഭോക്താവിന് ഒരു പവൻ സ്വർണത്തിന് 63,000 രൂപയിലധികം ചെലവഴിക്കേണ്ടി വരും. നിക്ഷേപകർക്ക് ഗോൾഡ് ഇ.ടി.എഫുകളിലും സോവറിൻ ഗോൾഡ് ബോണ്ടുകളിലും താല്പര്യം കൂടുന്നതായി വ്യാപാരികൾ വ്യക്തമാക്കുന്നു.</p>
    `,
    body_text: 'കേരളത്തിൽ സ്വർണവില സർവകാല റെക്കോർഡുകൾ ഭേദിച്ച് മുന്നേറുന്നു. ഇന്ന് ഗ്രാമിന് 45 രൂപയും പവന് 360 രൂപയുമാണ് വർധിച്ചത്. ഇതോടെ ഒരു പവൻ സ്വർണത്തിന്റെ വില 58,800 രൂപയിലെത്തി.',
    is_sponsored: false,
    language: 'ml',
    seo_title: 'Kerala Gold Rate Today: 22K & 24K Price Surges - Malayalam News',
    seo_description: 'സംസ്ഥാനത്ത് സ്വർണവിലയിൽ വീണ്ടും റെക്കോർഡ് മുന്നേറ്റം: പവന് 58,800 രൂപ കടന്നു. ഇന്നത്തെ വിശദമായ നിരക്കുകൾ.',
    tags: ['സ്വർണവില', 'കേരളം', 'വിപണി', 'സാമ്പത്തികം'],
    views: 4520,
    created_at: '2026-10-28T09:00:00Z',
    updated_at: '2026-10-28T09:30:00Z'
  },
  {
    id: 'art-2',
    slug: 'kerala-it-exports-cross-twenty-thousand-crores',
    title: 'കേരളത്തിന്റെ ഐടി കയറ്റുമതി ചരിത്രത്തിൽ ആദ്യമായി 20,000 കോടി കവിഞ്ഞു',
    excerpt: 'കൊച്ചി ഇൻഫോപാർക്കും തിരുവനന്തപുരം ടെക്നോപാർക്കും മുന്നേറ്റത്തിന് കരുത്തുപകർന്നു; കൂടുതൽ തൊഴിലവസരങ്ങൾ ഉടൻ.',
    category_id: 'cat-technology',
    author_id: 'author-reshma',
    hero_image_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    hero_caption: 'കേരളത്തിലെ ഐടി പാർക്കുകൾ അഭൂതപൂർവ്വമായ വളർച്ചയുടെ പാതയിൽ',
    hero_credit: 'Photo: Unsplash',
    status: 'published',
    published_at: '2026-10-28T08:15:00Z',
    read_minutes: 4,
    is_premium: false,
    preview_paragraphs: 3,
    body_html: `
      <p>സംസ്ഥാനത്തിന്റെ ഐടി മേഖലയ്ക്ക് അഭിമാന നേട്ടം. കഴിഞ്ഞ സാമ്പത്തിക വർഷത്തിൽ കേരളത്തിന്റെ ഐടി കയറ്റുമതി 21,500 കോടി രൂപ കടന്നതായി ഐടി വകുപ്പ് അറിയിച്ചു. മുൻ വർഷത്തെ അപേക്ഷിച്ച് 18 ശതമാനത്തിലധികം വർധനയാണ് രേഖപ്പെടുത്തിയത്.</p>
      <p>ടെക്നോപാർക്ക്, ഇൻഫോപാർക്ക്, സൈബർപാർക്ക് എന്നീ മൂന്ന് പ്രധാന ഐടി ഹബ്ബുകളിലും പുതിയ ബഹുരാഷ്ട്ര കമ്പനികൾ പ്രവർത്തനം ആരംഭിച്ചതും നിലവിലുള്ള കമ്പനികൾ തങ്ങളുടെ ഓഫീസുകൾ വിപുലീകരിച്ചതുമാണ് ഈ വളർച്ചയ്ക്ക് ആക്കം കൂട്ടിയത്.</p>
      <p>ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ്, ക്ലൗഡ് കമ്പ്യൂട്ടിങ്, ഫിൻടെക് മേഖലകളിലെ സ്റ്റാർട്ടപ്പുകൾക്കും സാങ്കേതിക കമ്പനികൾക്കും കേരളം മികച്ചൊരു കേന്ദ്രമായി മാറിക്കൊണ്ടിരിക്കുകയാണ്. കൊച്ചി വാട്ടർ മെട്രോയും മികച്ച കണക്റ്റിവിറ്റിയും ഗ്ലോബൽ കമ്പനികളെ ഇങ്ങോട്ട് ആകർഷിക്കുന്നു.</p>
    `,
    body_text: 'സംസ്ഥാനത്തിന്റെ ഐടി മേഖലയ്ക്ക് അഭിമാന നേട്ടം. കഴിഞ്ഞ സാമ്പത്തിക വർഷത്തിൽ കേരളത്തിന്റെ ഐടി കയറ്റുമതി 21,500 കോടി രൂപ കടന്നു.',
    is_sponsored: false,
    language: 'ml',
    tags: ['ഐടി', 'ടെക്നോപാർക്ക്', 'ഇൻഫോപാർക്ക്', 'കേരളം', 'തൊഴിൽ'],
    views: 3120,
    created_at: '2026-10-28T08:00:00Z',
    updated_at: '2026-10-28T08:15:00Z'
  },
  {
    id: 'art-3',
    slug: 'nifty-sensex-rally-banking-stocks-lead',
    title: 'സെൻസെക്സും നിഫ്റ്റിയും റെക്കോർഡ് നേട്ടത്തിൽ; ബാങ്കിങ് ഓഹരികൾ കുതിപ്പിൽ',
    excerpt: 'വിദേശ നിക്ഷേപകരുടെ തിരിച്ചുവരവും മികച്ച രണ്ടാം പാദ പ്രവർത്തന ഫലങ്ങളും ഓഹരി വിപണിക്ക് ഊർജ്ജമായി.',
    category_id: 'cat-markets',
    author_id: 'author-priya',
    hero_image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    hero_caption: 'ബോംബെ സ്റ്റോക്ക് എക്സ്ചേഞ്ചിൽ ശക്തമായ മുന്നേറ്റം',
    hero_credit: 'Photo: Unsplash',
    status: 'published',
    published_at: '2026-10-28T07:45:00Z',
    read_minutes: 3,
    is_premium: false,
    preview_paragraphs: 3,
    body_html: `
      <p>ഇന്ത്യൻ ഓഹരി സൂചികകൾ ഇന്ന് മികച്ച നേട്ടത്തിൽ വ്യാപാരം അവസാനിപ്പിച്ചു. ബിഎസ്ഇ സെൻസെക്സ് 420 പോയിന്റ് ഉയർന്ന് 81,750 ലെവലിലും, എൻഎസ്ഇ നിഫ്റ്റി 135 പോയിന്റ് വർധിച്ച് 24,980 നിലവാരത്തിലുമാണ് ക്ലോസ് ചെയ്തത്.</p>
      <p>എച്ച്ഡിഎഫ്സി ബാങ്ക്, ഐസിഐസിഐ ബാങ്ക്, എസ്ബിഐ എന്നീ മുൻനിര ബാങ്കുകളുടെ മികച്ച പാദഫലങ്ങളാണ് പ്രധാനമായും മുന്നേറ്റത്തിന് വഴിയൊരുക്കിയത്. നിഫ്റ്റി ബാങ്ക് സൂചിക ഒരു ശതമാനത്തിലധികം ഉയർന്നു.</p>
    `,
    body_text: 'ഇന്ത്യൻ ഓഹരി സൂചികകൾ ഇന്ന് മികച്ച നേട്ടത്തിൽ വ്യാപാരം അവസാനിപ്പിച്ചു.',
    is_sponsored: false,
    language: 'ml',
    tags: ['ഓഹരി വിപണി', 'സെൻസെക്സ്', 'നിഫ്റ്റി', 'ബാങ്കിങ്'],
    views: 2890,
    created_at: '2026-10-28T07:30:00Z',
    updated_at: '2026-10-28T07:45:00Z'
  },
  {
    id: 'art-4',
    slug: 'six-smart-saving-strategies-for-salaried-keralites',
    title: 'ശമ്പളക്കാർ സമ്പാദ്യം തുടങ്ങാൻ അറിയേണ്ട 6 ലളിതമായ തന്ത്രങ്ങൾ',
    excerpt: 'മാസാവസാനം കൈയിൽ പണമില്ലെന്ന് പരാതിപ്പെടുന്നവർക്ക് ചിട്ടയായ സമ്പാദ്യം ശീലമാക്കാൻ പ്രായോഗിക വഴികൾ.',
    category_id: 'cat-personal-finance',
    author_id: 'author-desk',
    hero_image_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80',
    hero_caption: 'വ്യക്തിഗത ധനകാര്യ ആസൂത്രണം ഭാവി സുരക്ഷിതമാക്കും',
    hero_credit: 'Photo: Unsplash',
    status: 'published',
    published_at: '2026-10-27T10:00:00Z',
    read_minutes: 5,
    is_premium: true, // PREMIUM EXCLUSIVE ARTICLE
    preview_paragraphs: 2,
    preview_html: `
      <p>ശമ്പളം അക്കൗണ്ടിൽ എത്തുമ്പോൾ തന്നെ മുഴുവൻ തുകയും ചെലവഴിച്ചു തീർക്കുന്ന ശീലം പലർക്കുമുണ്ട്. എന്നാൽ തുടക്കത്തിൽ ചെറിയൊരു തുക മാറ്റിവെച്ചാൽ പോലും വർഷങ്ങൾക്കുള്ളിൽ വലിയൊരു തുക സ്വരുക്കൂട്ടാൻ സാധിക്കും.</p>
      <p>മാസത്തിന്റെ ആദ്യ ദിനത്തിൽ തന്നെ സമ്പാദ്യ തുക നിക്ഷേപത്തിലേക്ക് മാറ്റുക എന്നതാണ് ഒന്നാമത്തെ തത്വം. ഇതിനായി 50-30-20 റൂൾ കൃത്യമായി പാലിക്കാവുന്നതാണ്.</p>
    `,
    body_html: `
      <p>ശമ്പളം അക്കൗണ്ടിൽ എത്തുമ്പോൾ തന്നെ മുഴുവൻ തുകയും ചെലവഴിച്ചു തീർക്കുന്ന ശീലം പലർക്കുമുണ്ട്. എന്നാൽ തുടക്കത്തിൽ ചെറിയൊരു തുക മാറ്റിവെച്ചാൽ പോലും വർഷങ്ങൾക്കുള്ളിൽ വലിയൊരു തുക സ്വരുക്കൂട്ടാൻ സാധിക്കും.</p>
      <p>മാസത്തിന്റെ ആദ്യ ദിനത്തിൽ തന്നെ സമ്പാദ്യ തുക നിക്ഷേപത്തിലേക്ക് മാറ്റുക എന്നതാണ് ഒന്നാമത്തെ തത്വം. ഇതിനായി 50-30-20 റൂൾ കൃത്യമായി പാലിക്കാവുന്നതാണ്.</p>
      <h3>പ്രീമിയം വിശകലനം: നിങ്ങൾ പാലിക്കേണ്ട 6 നിയമങ്ങൾ</h3>
      <ol>
        <li><strong>ഓട്ടോമാറ്റിക് SIP തുടങ്ങുക:</strong> ശമ്പളം ക്രെഡിറ്റാവുന്ന തീയതിയുടെ പിറ്റേന്ന് തന്നെ മ്യൂച്വൽ ഫണ്ട് SIP വഴി പണം പോകുന്ന രീതിയിൽ സജ്ജീകരിക്കുക.</li>
        <li><strong>എമർജൻസി ഫണ്ട് നിർബന്ധം:</strong> ചുരുങ്ങിയത് ആറ് മാസത്തെ കുടുംബ ചെലവിന് തുല്യമായ തുക ലിക്വിഡ് ഫണ്ടിലോ ഫിക്സഡ് ഡെപ്പോസിറ്റിലോ സൂക്ഷിക്കുക.</li>
        <li><strong>മെഡിക്കൽ ഇൻഷുറൻസ് സ്വന്തമായി കരുതുക:</strong> കമ്പനി നൽകുന്ന കവറേജിന് പുറമെ സ്വന്തമായി 10-15 ലക്ഷത്തിന്റെ ബേസിക് ഹെൽത്ത് ഇൻഷുറൻസ് പോളിസി എടുക്കുക.</li>
        <li><strong>ക്രെഡിറ്റ് കാർഡ് കുരുക്കുകൾ ഒഴിവാക്കുക:</strong> മിനിമം ഡ്യൂ മാത്രം അടയ്ക്കാതെ പൂർണ്ണ ബിൽ തുക കൃത്യസമയത്ത് തീർപ്പാക്കുക.</li>
        <li><strong>നികുതി ഇളവുകൾ മുൻകൂട്ടി പ്ലാൻ ചെയ്യുക:</strong> സാമ്പത്തിക വർഷത്തിന്റെ അവസാനത്തിൽ വെപ്രാളം കാട്ടാതെ ELSS, PPF, NPS എന്നിവയിൽ കൃത്യമായി നിക്ഷേപിക്കുക.</li>
        <li><strong>വാർഷിക റിവ്യൂ:</strong> ശമ്പളം കൂടുമ്പോൾ അതിനനുസരിച്ച് നിക്ഷേപ തുകയും കുറഞ്ഞത് 10% വർദ്ധിപ്പിക്കുക (Step-up SIP).</li>
      </ol>
    `,
    body_text: 'ശമ്പളക്കാർ സമ്പാദ്യം തുടങ്ങാൻ അറിയേണ്ട 6 ലളിതമായ തന്ത്രങ്ങൾ.',
    is_sponsored: false,
    language: 'ml',
    tags: ['പേഴ്സണൽ ഫിനാൻസ്', 'മ്യൂച്വൽ ഫണ്ട്', 'നിക്ഷേപം', 'എസ്.ഐ.പി'],
    views: 1980,
    created_at: '2026-10-27T09:30:00Z',
    updated_at: '2026-10-27T10:00:00Z'
  },
  {
    id: 'art-5',
    slug: 'kerala-startup-mission-funding-round-announcement',
    title: 'കേരള സ്റ്റാർട്ടപ്പുകൾക്ക് വൻ കുതിപ്പ്: 15 കമ്പനികൾക്ക് സീഡ് ഫണ്ടിംഗ് അനുവദിച്ചു',
    excerpt: 'ഡീപ്-ടെക്, ഹെൽത്ത്-ടെക്, അഗ്രി-ടെക് വിഭാഗങ്ങളിലെ സ്റ്റാർട്ടപ്പുകൾക്കാണ് കേരള സ്റ്റാർട്ടപ്പ് മിഷൻ സഹായം പ്രഖ്യാപിച്ചത്.',
    category_id: 'cat-startups',
    author_id: 'author-reshma',
    hero_image_url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    hero_caption: 'സംസ്ഥാനത്ത് സ്റ്റാർട്ടപ്പ് സംസ്കാരം കൂടുതൽ ശക്തമാകുന്നു',
    hero_credit: 'Photo: Unsplash',
    status: 'published',
    published_at: '2026-10-27T14:20:00Z',
    read_minutes: 3,
    is_premium: false,
    preview_paragraphs: 3,
    body_html: `
      <p>കേരള സ്റ്റാർട്ടപ്പ് മിഷന്റെ (KSUM) നേതൃത്വത്തിൽ സംഘടിപ്പിച്ച ബിസിനസ് കോൺക്ലേവിൽ 15 മലയാളി സ്റ്റാർട്ടപ്പുകൾക്ക് സീഡ് ഫണ്ടിംഗ് അനുവദിച്ചു. ആകെ 12 കോടി രൂപയുടെ പ്രാരംഭ നിക്ഷേപമാണ് വിവിധ വെഞ്ച്വർ ക്യാപിറ്റൽ ഫണ്ടുകളിൽ നിന്നും ഏഞ്ചൽ നിക്ഷേപകരിൽ നിന്നുമായി ഉറപ്പാക്കിയത്.</p>
      <p>ആർട്ടിഫിഷ്യൽ ഇന്റലിജൻസ് അധിഷ്ഠിത മെഡിക്കൽ ഡയഗ്നോസ്റ്റിക്സ് പ്ലാറ്റ്‌ഫോമുകൾ, ഡ്രോൺ അധിഷ്ഠിത കൃഷി സൊല്യൂഷനുകൾ എന്നിവയ്ക്ക് മികച്ച സ്വീകാര്യതയാണ് ലഭിച്ചത്.</p>
    `,
    body_text: 'കേരള സ്റ്റാർട്ടപ്പുകൾക്ക് വൻ കുതിപ്പ്: 15 കമ്പനികൾക്ക് സീഡ് ഫണ്ടിംഗ് അനുവദിച്ചു.',
    is_sponsored: false,
    language: 'ml',
    tags: ['സ്റ്റാർട്ടപ്പ്', 'കെ.എസ്.യു.എം', 'നിക്ഷേപം', 'കേരളം'],
    views: 1650,
    created_at: '2026-10-27T14:00:00Z',
    updated_at: '2026-10-27T14:20:00Z'
  },
  {
    id: 'art-6',
    slug: 'sanju-samson-century-in-syed-mushtaq-ali-trophy',
    title: 'സഞ്ജു സാംസണ് തകർപ്പൻ സെഞ്ചുറി: കേരളത്തിന് സയ്യിദ് മുഷ്താഖ് അലി ട്രോഫിയിൽ ഉജ്ജ്വല ജയം',
    excerpt: 'വെറും 48 പന്തുകളിൽ നിന്ന് 10 സിക്സറുകളോടെ 104 റൺസ്; എതിരാളികളെ നിഷ്പ്രഭമാക്കി കേരള നായകൻ.',
    category_id: 'cat-cricket',
    author_id: 'author-arun',
    hero_image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80',
    hero_caption: 'സഞ്ജു സാംസണിന്റെ ക്യാപ്റ്റൻസ് ഇന്നിങ്സ് കേരളത്തിന് ആവേശകരമായ വിജയം സമ്മാനിച്ചു',
    hero_credit: 'Photo: Unsplash',
    status: 'published',
    published_at: '2026-10-28T11:00:00Z',
    read_minutes: 2,
    is_premium: false,
    preview_paragraphs: 2,
    body_html: `
      <p>സയ്യിദ് മുഷ്താഖ് അലി ട്രോഫി ടി20 ടൂർണമെന്റിൽ ക്യാപ്റ്റൻ സഞ്ജു സാംസണിന്റെ അത്യുഗ്രൻ സെഞ്ചുറിയുടെ ബലത്തിൽ കേരളത്തിന് ഗംഭീര വിജയം. 48 പന്തുകളിൽ നിന്ന് 10 സിക്സറുകളും 7 ഫോറുകളുമടക്കം 104 റൺസാണ് സഞ്ജു അടിച്ചുകൂട്ടിയത്.</p>
      <p>മറുപടി ബാറ്റിംഗിനിറങ്ങിയ എതിരാളികൾക്ക് 20 ഓവറിൽ 150 റൺസെടുക്കാനേ കഴിഞ്ഞുള്ളൂ. ബൗളിംഗിൽ ബേസിൽ തമ്പിയും ജലജ് സക്സേനയും മികച്ച പ്രകടനം കാഴ്ചവെച്ചു.</p>
    `,
    body_text: 'സയ്യിദ് മുഷ്താഖ് അലി ട്രോഫി ടി20 ടൂർണമെന്റിൽ സഞ്ജു സാംസണ് സെഞ്ചുറി.',
    is_sponsored: false,
    language: 'ml',
    tags: ['ക്രിക്കറ്റ്', 'സഞ്ജു സാംസൺ', 'കേരള ക്രിക്കറ്റ്', 'സ്പോർട്സ്'],
    views: 5400,
    created_at: '2026-10-28T10:45:00Z',
    updated_at: '2026-10-28T11:00:00Z'
  }
];

export const SEED_HOME_SLOTS: HomeSlot[] = [
  { slot_key: 'hero', position: 0, article_id: 'art-1' },
  { slot_key: 'breaking', position: 0, article_id: 'art-1' },
  { slot_key: 'breaking', position: 1, article_id: 'art-6' },
  { slot_key: 'breaking', position: 2, article_id: 'art-2' },
  { slot_key: 'top_markets', position: 0, article_id: 'art-3' },
  { slot_key: 'top_markets', position: 1, article_id: 'art-4' },
];

export const KERALA_DISTRICTS: District[] = [
  { id: 'dist-tvm', slug: 'thiruvananthapuram', name_ml: 'തിരുവനന്തപുരം', name_en: 'Thiruvananthapuram', zone: 'south', headquarters_ml: 'തിരുവനന്തപുരം' },
  { id: 'dist-klm', slug: 'kollam', name_ml: 'കൊല്ലം', name_en: 'Kollam', zone: 'south', headquarters_ml: 'കൊല്ലം' },
  { id: 'dist-pta', slug: 'pathanamthitta', name_ml: 'പത്തനംതിട്ട', name_en: 'Pathanamthitta', zone: 'south', headquarters_ml: 'പത്തനംതിട്ട' },
  { id: 'dist-alp', slug: 'alappuzha', name_ml: 'ആലപ്പുഴ', name_en: 'Alappuzha', zone: 'south', headquarters_ml: 'ആലപ്പുഴ' },
  { id: 'dist-ktm', slug: 'kottayam', name_ml: 'കോട്ടയം', name_en: 'Kottayam', zone: 'central', headquarters_ml: 'കോട്ടയം' },
  { id: 'dist-idk', slug: 'idukki', name_ml: 'ഇടുക്കി', name_en: 'Idukki', zone: 'central', headquarters_ml: 'പൈനാവ്' },
  { id: 'dist-ekm', slug: 'ernakulam', name_ml: 'എറണാകുളം (കൊച്ചി)', name_en: 'Ernakulam (Kochi)', zone: 'central', headquarters_ml: 'കാക്കനാട്' },
  { id: 'dist-tsr', slug: 'thrissur', name_ml: 'തൃശ്ശൂർ', name_en: 'Thrissur', zone: 'central', headquarters_ml: 'തൃശ്ശൂർ' },
  { id: 'dist-pkd', slug: 'palakkad', name_ml: 'പാലക്കാട്', name_en: 'Palakkad', zone: 'central', headquarters_ml: 'പാലക്കാട്' },
  { id: 'dist-mpm', slug: 'malappuram', name_ml: 'മലപ്പുറം', name_en: 'Malappuram', zone: 'north', headquarters_ml: 'മലപ്പുറം' },
  { id: 'dist-kkd', slug: 'kozhikode', name_ml: 'കോഴിക്കോട്', name_en: 'Kozhikode', zone: 'north', headquarters_ml: 'കോഴിക്കോട്' },
  { id: 'dist-wyd', slug: 'wayanad', name_ml: 'വയനാട്', name_en: 'Wayanad', zone: 'north', headquarters_ml: 'കൽപ്പറ്റ' },
  { id: 'dist-knr', slug: 'kannur', name_ml: 'കണ്ണൂർ', name_en: 'Kannur', zone: 'north', headquarters_ml: 'കണ്ണൂർ' },
  { id: 'dist-ksd', slug: 'kasaragod', name_ml: 'കാസർഗോഡ്', name_en: 'Kasaragod', zone: 'north', headquarters_ml: 'കാസർഗോഡ്' },
];

export const SEED_VIDEOS: Video[] = [
  {
    id: 'vid-s1',
    youtube_id: 'M7lc1UVf-VE',
    title: 'സ്വർണം വാങ്ങുമ്പോൾ ഈ 3 കാര്യങ്ങൾ ഉറപ്പായും ശ്രദ്ധിക്കൂ!',
    is_short: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=600&q=80',
    category: 'ഗോൾഡ് ടിപ്പുകൾ',
    duration: '0:58',
    views: 18400,
    published_at: '2026-10-28T09:00:00Z',
    created_at: '2026-10-28T09:00:00Z'
  },
  {
    id: 'vid-s2',
    youtube_id: 'M7lc1UVf-VE',
    title: 'മാസം ₹5,000 SIP വഴി 1 കോടി രൂപ സമ്പാദ്യം നേടാൻ എത്ര വർഷം വേണം?',
    is_short: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=600&q=80',
    category: 'SIP & നിക്ഷേപം',
    duration: '0:45',
    views: 24500,
    published_at: '2026-10-27T12:30:00Z',
    created_at: '2026-10-27T12:30:00Z'
  },
  {
    id: 'vid-s3',
    youtube_id: 'M7lc1UVf-VE',
    title: 'യുഎഇ ദിർഹം ഇന്നത്തെ നിരക്ക്: നാട്ടിലേക്ക് പണമയക്കാൻ പറ്റിയ സമയമോ?',
    is_short: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80',
    category: 'NRI കറൻസി',
    duration: '0:50',
    views: 14200,
    published_at: '2026-10-28T07:15:00Z',
    created_at: '2026-10-28T07:15:00Z'
  },
  {
    id: 'vid-s4',
    youtube_id: 'M7lc1UVf-VE',
    title: 'കൊച്ചി ഇൻഫോപാർക്കിൽ പുതിയ 1000 ഐടി തൊഴിലവസരങ്ങൾ പ്രഖ്യാപിച്ചു',
    is_short: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80',
    category: 'ഐടി & കരിയർ',
    duration: '0:55',
    views: 31200,
    published_at: '2026-10-28T06:00:00Z',
    created_at: '2026-10-28T06:00:00Z'
  },
  {
    id: 'vid-f1',
    youtube_id: 'M7lc1UVf-VE',
    title: 'കേരളത്തിലെ സ്വർണവില എന്തുകൊണ്ട് കുതിച്ചുയരുന്നു? ആഗോള വിപണി വിശകലനം',
    is_short: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    category: 'സ്പെഷ്യൽ അനാലിസിസ്',
    duration: '12:45',
    views: 48900,
    published_at: '2026-10-28T08:00:00Z',
    created_at: '2026-10-28T08:00:00Z'
  },
  {
    id: 'vid-f2',
    youtube_id: 'M7lc1UVf-VE',
    title: 'ഓഹരി വിപണിയിൽ തുടക്കക്കാർ അറിയേണ്ട 5 അടിസ്ഥാന തത്വങ്ങൾ | The Profit Masterclass',
    is_short: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    category: 'ഇൻവെസ്റ്റ്മെന്റ് ക്ലാസ്',
    duration: '18:20',
    views: 62100,
    published_at: '2026-10-27T15:00:00Z',
    created_at: '2026-10-27T15:00:00Z'
  }
];
