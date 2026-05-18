-- FUKU-MEETS content image / editor upgrade.
-- Apply in Supabase SQL editor after cms-schema.sql.
-- Admin writes must continue to use server routes with SUPABASE_SERVICE_ROLE_KEY only.

alter table if exists public.meets
  add column if not exists image_url text,
  add column if not exists hero_image_url text,
  add column if not exists gallery_images jsonb not null default '[]'::jsonb,
  add column if not exists related_news_ids jsonb not null default '[]'::jsonb,
  add column if not exists related_live_ids jsonb not null default '[]'::jsonb,
  add column if not exists detail_venue_name text,
  add column if not exists is_age20_only boolean not null default false,
  add column if not exists is_women_friendly boolean not null default false;

create table if not exists public.ranking_themes (
  id text primary key,
  slug text not null unique,
  title text not null,
  category text,
  description text,
  period_start date,
  period_end date,
  status text not null default 'draft' check (status in ('draft', 'published', 'private', 'archived')),
  sort_order integer not null default 0,
  thumbnail_url text,
  cta_href text,
  related_meet_ids jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ranking_entries (
  id text primary key,
  ranking_id text not null,
  slug text not null,
  name text not null,
  area text,
  description text,
  tags jsonb not null default '[]'::jsonb,
  votes integer not null default 0,
  rank integer not null default 0,
  thumbnail_url text,
  hero_image_url text,
  gallery_images jsonb not null default '[]'::jsonb,
  good_count integer not null default 0,
  save_count integer not null default 0,
  comment_count integer not null default 0,
  related_meet_ids jsonb not null default '[]'::jsonb,
  status text not null default 'published' check (status in ('draft', 'published', 'private', 'archived')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (ranking_id, slug)
);

create table if not exists public.icons (
  id text primary key,
  slug text not null unique,
  name text not null,
  title text,
  category text,
  area text,
  instagram text,
  is_cover_candidate boolean not null default false,
  rank integer,
  attention_score numeric,
  votes integer not null default 0,
  support_count integer not null default 0,
  status text not null default 'draft' check (status in ('pending', 'draft', 'published', 'private', 'archived')),
  avatar_url text,
  hero_image_url text,
  gallery_images jsonb not null default '[]'::jsonb,
  profile_text text,
  interview_text text,
  favorite_places jsonb not null default '[]'::jsonb,
  related_meet_ids jsonb not null default '[]'::jsonb,
  related_news_ids jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news (
  id text primary key,
  slug text not null unique,
  title text not null,
  category text,
  excerpt text,
  body_markdown text,
  cover_image_url text,
  content_images jsonb not null default '[]'::jsonb,
  published_at timestamptz,
  area text,
  tags jsonb not null default '[]'::jsonb,
  related_meet_ids jsonb not null default '[]'::jsonb,
  related_ranking_ids jsonb not null default '[]'::jsonb,
  related_icon_ids jsonb not null default '[]'::jsonb,
  event_date date,
  venue text,
  artist_name text,
  is_live_info boolean not null default false,
  is_visitor_friendly boolean not null default false,
  has_solo_meet boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.ranking_themes enable row level security;
alter table public.ranking_entries enable row level security;
alter table public.icons enable row level security;
alter table public.news enable row level security;

drop policy if exists "public read published ranking themes" on public.ranking_themes;
create policy "public read published ranking themes"
  on public.ranking_themes for select
  using (status = 'published');

drop policy if exists "public read published ranking entries" on public.ranking_entries;
create policy "public read published ranking entries"
  on public.ranking_entries for select
  using (status = 'published');

drop policy if exists "public read published icons" on public.icons;
create policy "public read published icons"
  on public.icons for select
  using (status = 'published');

drop policy if exists "public read published news" on public.news;
create policy "public read published news"
  on public.news for select
  using (status = 'published');

-- Storage buckets expected by the app:
-- cms-images, meet-images, icons-images.
-- Create them in Supabase Storage if they do not exist. Keep SVG uploads blocked in the server route.
-- Future hardening:
-- - Supabase Auth + profiles.role checks
-- - RLS write policies for admin roles
-- - admin_logs on every create/update/archive
-- - virus scanning and image dimension validation before publish
