-- replica/schema.sql : Malayalam news portal (web first, mobile app later)
-- Target: Postgres 15+ on Supabase (Mumbai, ap-south-1). All times timestamptz (UTC). Money as integer paise.
-- Browsers and the mobile app never read tables directly. They call /api/v1 (server, service role).
-- RLS below is a second lock: deny by default, then explicit policies.

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists citext;

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- ---------- users ----------
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email citext,
  phone text,
  display_name text,
  preferred_language text not null default 'ml' check (preferred_language in ('ml','en')),
  staff_role text check (staff_role in ('author','editor','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function current_staff_role() returns text
language sql stable security definer set search_path = public as $$
  select staff_role from profiles where id = auth.uid() $$;
create or replace function is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(current_staff_role() is not null, false) $$;
create or replace function is_editor() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(current_staff_role() in ('editor','admin'), false) $$;

create or replace function guard_staff_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.staff_role is distinct from old.staff_role
     and auth.uid() is not null
     and coalesce(current_staff_role(), '') <> 'admin' then
    raise exception 'only admins can change staff_role';
  end if;
  return new;
end $$;
create trigger profiles_guard_role before update on profiles
  for each row execute function guard_staff_role();

-- ---------- media ----------
create table media (
  id uuid primary key default gen_random_uuid(),
  storage_key text not null unique,
  url text,                       -- null when is_private (served by signed URL)
  is_private boolean not null default false,
  mime_type text not null,
  width int,
  height int,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  alt text,
  credit text,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on media (uploaded_by);

-- ---------- editorial ----------
create table authors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references profiles(id) on delete set null,   -- null for desk accounts like "The Profit Desk"
  slug text not null unique,
  display_name text not null,
  bio text,
  avatar_media_id uuid references media(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on authors (avatar_media_id);

create table categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ml text not null,
  name_en text not null,
  parent_id uuid references categories(id) on delete set null,
  sort_order int not null default 0,
  show_in_nav boolean not null default true,
  is_premium_section boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on categories (parent_id);
create index on categories (show_in_nav, sort_order);

create table tags (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ml text not null,
  name_en text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tags_name_trgm on tags using gin (name_ml gin_trgm_ops);

create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),   -- English slug, required, like the original URLs
  title text not null,
  excerpt text,
  category_id uuid not null references categories(id) on delete restrict,
  author_id uuid not null references authors(id) on delete restrict,
  hero_media_id uuid references media(id) on delete set null,
  status text not null default 'draft'
    check (status in ('draft','in_review','scheduled','published','archived')),
  published_at timestamptz,
  scheduled_for timestamptz,
  read_minutes int check (read_minutes > 0),
  is_premium boolean not null default false,
  preview_paragraphs int not null default 3 check (preview_paragraphs between 1 and 20),
  preview_html text,              -- what anonymous visitors, crawlers and non-members see on premium stories
  is_sponsored boolean not null default false,
  sponsor_name text,
  language text not null default 'ml' check (language in ('ml','en')),
  seo_title text,
  seo_description text,
  search tsvector,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint published_has_date check (status <> 'published' or published_at is not null),
  constraint scheduled_has_date check (status <> 'scheduled' or scheduled_for is not null),
  constraint sponsor_named check (not is_sponsored or sponsor_name is not null)
);
create index on articles (category_id, published_at desc) where status = 'published';
create index on articles (author_id, published_at desc) where status = 'published';
create index on articles (published_at desc) where status = 'published';
create index on articles (scheduled_for) where status = 'scheduled';
create index on articles (hero_media_id);
create index articles_search_gin on articles using gin (search);
create index articles_title_trgm on articles using gin (title gin_trgm_ops);

-- full body lives apart so premium text is never exposed by a table read
create table article_bodies (
  article_id uuid primary key references articles(id) on delete cascade,
  body_json jsonb not null,       -- editor document (source of truth, reused by the mobile app)
  body_html text not null,        -- rendered, sanitised
  body_text text not null,        -- plain text for search
  updated_at timestamptz not null default now()
);

create table article_tags (
  article_id uuid not null references articles(id) on delete cascade,
  tag_id uuid not null references tags(id) on delete cascade,
  primary key (article_id, tag_id)
);
create index on article_tags (tag_id);

create table article_revisions (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  editor_id uuid references profiles(id) on delete set null,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);
create index on article_revisions (article_id, created_at desc);
create index on article_revisions (editor_id);

-- home page pinning: slot_key like 'hero', 'top_markets', 'brand_keralam'
create table home_slots (
  slot_key text not null,
  position int not null check (position >= 0),
  article_id uuid not null references articles(id) on delete cascade,
  primary key (slot_key, position)
);
create index on home_slots (article_id);

-- search: title + excerpt always, body only when the story is free
create or replace function reindex_article(aid uuid) returns void language sql as $$
  update articles a
     set search = to_tsvector('simple',
           a.title || ' ' || coalesce(a.excerpt, '') || ' ' ||
           case when a.is_premium then ''
                else coalesce((select b.body_text from article_bodies b where b.article_id = a.id), '') end)
   where a.id = aid $$;
create or replace function trg_reindex_from_article() returns trigger language plpgsql as $$
begin perform reindex_article(new.id); return null; end $$;
create or replace function trg_reindex_from_body() returns trigger language plpgsql as $$
begin perform reindex_article(new.article_id); return null; end $$;
create trigger articles_reindex_ins after insert on articles
  for each row execute function trg_reindex_from_article();
create trigger articles_reindex_upd after update of title, excerpt, is_premium on articles
  for each row execute function trg_reindex_from_article();
create trigger bodies_reindex after insert or update of body_text on article_bodies
  for each row execute function trg_reindex_from_body();

-- ---------- reader features ----------
create table saves (
  user_id uuid not null references profiles(id) on delete cascade,
  article_id uuid not null references articles(id) on delete cascade,
  saved_at timestamptz not null default now(),
  primary key (user_id, article_id)
);
create index on saves (user_id, saved_at desc);
create index on saves (article_id);

create table interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  category_id uuid references categories(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint exactly_one_target check ((category_id is null) <> (tag_id is null))
);
create unique index interests_user_category on interests (user_id, category_id) where category_id is not null;
create unique index interests_user_tag on interests (user_id, tag_id) where tag_id is not null;
create index on interests (category_id);
create index on interests (tag_id);

create table read_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  article_id uuid not null references articles(id) on delete cascade,
  read_at timestamptz not null default now()
);
create index on read_events (user_id, read_at desc);
create index on read_events (article_id);

create table comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references articles(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,     -- kept anonymised after account deletion
  parent_id uuid references comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  status text not null default 'pending' check (status in ('pending','visible','hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on comments (article_id, created_at) where status = 'visible';
create index on comments (user_id);
create index on comments (parent_id);
create index on comments (status, created_at);

create table reactions (
  article_id uuid not null references articles(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  mood text not null check (mood in ('like','love','sad','angry','surprised')),
  created_at timestamptz not null default now(),
  primary key (article_id, user_id)
);
create index on reactions (user_id);

-- ---------- membership (Razorpay) ----------
create table plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  amount_paise int not null check (amount_paise >= 0),
  currency text not null default 'INR',
  billing_interval text not null check (billing_interval in ('month','year')),
  provider_plan_id text unique,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table memberships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan_id uuid not null references plans(id) on delete restrict,
  status text not null default 'pending'
    check (status in ('pending','active','past_due','cancelled','expired')),
  provider_subscription_id text unique,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on memberships (user_id);
create index on memberships (plan_id);
create index on memberships (status, current_period_end);
-- one live membership per person: the race of a double click is settled by the database
create unique index one_live_membership on memberships (user_id) where status in ('active','past_due');

create table payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,          -- records kept for tax after account deletion
  membership_id uuid references memberships(id) on delete set null,
  amount_paise int not null check (amount_paise >= 0),
  currency text not null default 'INR',
  status text not null check (status in ('created','authorized','captured','failed','refunded')),
  provider_payment_id text unique,
  provider_event_id text unique,     -- webhook idempotency key
  raw jsonb,
  created_at timestamptz not null default now()
);
create index on payments (user_id);
create index on payments (membership_id);

create or replace function has_active_membership(uid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from memberships m
                  where m.user_id = uid
                    and m.status in ('active','past_due')
                    and m.current_period_end > now()) $$;

-- ---------- magazine, video, rates ----------
create table magazine_issues (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  issue_date date not null,
  cover_media_id uuid references media(id) on delete set null,
  pdf_media_id uuid references media(id) on delete set null,       -- private media, signed URL for members
  is_premium boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index on magazine_issues (issue_date desc);
create index on magazine_issues (cover_media_id);
create index on magazine_issues (pdf_media_id);

create table videos (
  id uuid primary key default gen_random_uuid(),
  youtube_id text not null unique,
  title text not null,
  thumbnail_url text,
  is_short boolean not null default false,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index on videos (is_short, published_at desc);

create table daily_rates (
  id uuid primary key default gen_random_uuid(),
  rate_date date not null,                                       -- the IST calendar date
  metal text not null check (metal in ('gold_22k','gold_24k','silver')),
  region text not null default 'kerala',
  unit text not null check (unit in ('gram','pavan','kg')),
  amount_paise bigint not null check (amount_paise > 0),
  source text not null,                                          -- where the editor got the number
  entered_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (rate_date, metal, region, unit)
);
create index on daily_rates (entered_by);

-- ---------- ads ----------
create table ad_slots (
  id uuid primary key default gen_random_uuid(),
  slot_key text not null unique,
  description text,
  width int not null,
  height int not null
);

create table ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid not null references ad_slots(id) on delete cascade,
  advertiser text not null,
  creative_media_id uuid references media(id) on delete set null,
  click_url text not null check (click_url ~ '^https://'),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ad_window check (ends_at > starts_at)
);
create index on ad_campaigns (slot_id, starts_at, ends_at) where is_active;
create index on ad_campaigns (creative_media_id);

create table ad_daily_stats (
  campaign_id uuid not null references ad_campaigns(id) on delete cascade,
  day date not null,
  impressions int not null default 0,
  clicks int not null default 0,
  primary key (campaign_id, day)
);

-- ---------- push ----------
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,        -- null for anonymous browsers
  platform text not null check (platform in ('web','ios','android')),
  endpoint text not null unique,                                  -- web push endpoint or device token
  keys jsonb,
  topics text[] not null default '{}',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);
create index on push_subscriptions (user_id);
create index on push_subscriptions using gin (topics);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','media','authors','categories','tags','articles','comments',
                           'plans','memberships','magazine_issues','ad_campaigns']
  loop
    execute format('create trigger %I before update on %I for each row execute function set_updated_at()',
                   t || '_updated_at', t);
  end loop;
end $$;

-- ---------- row level security: deny by default ----------
do $$
declare t text;
begin
  foreach t in array array['profiles','media','authors','categories','tags','articles','article_bodies',
    'article_tags','article_revisions','home_slots','saves','interests','read_events','comments','reactions',
    'plans','memberships','payments','magazine_issues','videos','daily_rates','ad_slots','ad_campaigns',
    'ad_daily_stats','push_subscriptions']
  loop
    execute format('alter table %I enable row level security', t);
  end loop;
end $$;

-- public read, editor write
do $$
declare t text;
begin
  foreach t in array array['authors','categories','tags','article_tags','home_slots','videos','daily_rates','ad_slots']
  loop
    execute format('create policy %I on %I for select using (true)', t || '_read', t);
    execute format('create policy %I on %I for all using (is_editor()) with check (is_editor())', t || '_write', t);
  end loop;
end $$;

create policy media_read on media for select using (not is_private or is_staff());
create policy media_write on media for all using (is_staff()) with check (is_staff());

create policy magazine_read on magazine_issues for select using (true);
create policy magazine_write on magazine_issues for all using (is_editor()) with check (is_editor());

create policy plans_read on plans for select using (is_active or is_editor());
create policy plans_write on plans for all using (is_editor()) with check (is_editor());

create policy ads_read on ad_campaigns for select
  using ((is_active and now() between starts_at and ends_at) or is_editor());
create policy ads_write on ad_campaigns for all using (is_editor()) with check (is_editor());
create policy ad_stats_read on ad_daily_stats for select using (is_editor());

-- profiles: own row only
create policy profiles_own_read on profiles for select using (id = auth.uid() or is_staff());
create policy profiles_own_update on profiles for update using (id = auth.uid()) with check (id = auth.uid());

-- articles
create policy articles_public_read on articles for select
  using (status = 'published' and published_at <= now());
create policy articles_staff_read on articles for select using (is_staff());
create policy articles_insert on articles for insert with check (
  is_editor() or (status in ('draft','in_review')
                  and author_id in (select id from authors where profile_id = auth.uid())));
create policy articles_update on articles for update
  using (is_editor() or (author_id in (select id from authors where profile_id = auth.uid())
                         and status in ('draft','in_review')))
  with check (is_editor() or (author_id in (select id from authors where profile_id = auth.uid())
                         and status in ('draft','in_review')));
create policy articles_delete on articles for delete using (is_editor());

-- bodies: free stories to everyone once published, premium only to members, everything to staff
create policy bodies_read on article_bodies for select using (
  is_staff() or exists (
    select 1 from articles a
     where a.id = article_bodies.article_id
       and a.status = 'published' and a.published_at <= now()
       and (not a.is_premium or has_active_membership(auth.uid()))));
create policy bodies_write on article_bodies for all using (is_staff()) with check (is_staff());
create policy revisions_staff on article_revisions for all using (is_staff()) with check (is_staff());

-- reader-owned rows
create policy saves_own on saves for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy interests_own on interests for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy read_events_own on read_events for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy reactions_read on reactions for select using (true);
create policy reactions_own on reactions for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy push_own on push_subscriptions for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- comments
create policy comments_read on comments for select
  using (status = 'visible' or user_id = auth.uid() or is_staff());
create policy comments_insert on comments for insert with check (user_id = auth.uid());
create policy comments_update_own on comments for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy comments_delete_own on comments for delete using (user_id = auth.uid());
create policy comments_staff on comments for all using (is_staff()) with check (is_staff());

-- money: members may read their own rows. Writes happen only through the Razorpay webhook (service role).
create policy memberships_own_read on memberships for select using (user_id = auth.uid());
create policy payments_own_read on payments for select using (user_id = auth.uid());
