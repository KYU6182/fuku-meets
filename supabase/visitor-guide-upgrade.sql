-- FUKU-MEETS visitor guide / shop guide upgrade.
-- Apply after cms-schema.sql and content-media-upgrade.sql.
-- This keeps existing data intact and adds guide fields used by admin NEWS editing.

alter table if exists public.news
  add column if not exists type text not null default 'news',
  add column if not exists guide_category text,
  add column if not exists display_order integer not null default 0,
  add column if not exists target_tags jsonb not null default '[]'::jsonb;

create table if not exists public.shop_guides (
  id text primary key,
  slug text not null unique,
  title text not null,
  type text not null default 'shop_guide',
  category text,
  guide_category text,
  area text,
  excerpt text,
  body_markdown text,
  cover_image_url text,
  tags jsonb not null default '[]'::jsonb,
  target_tags jsonb not null default '[]'::jsonb,
  related_meet_ids jsonb not null default '[]'::jsonb,
  related_news_ids jsonb not null default '[]'::jsonb,
  related_spot_ids jsonb not null default '[]'::jsonb,
  display_order integer not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  published_at timestamptz,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shop_guides enable row level security;

drop policy if exists "public read published shop guides" on public.shop_guides;
create policy "public read published shop guides"
  on public.shop_guides for select
  using (status = 'published');

-- Admin writes are performed by server routes using SUPABASE_SERVICE_ROLE_KEY.
-- Future production hardening:
-- - Add admin-only RLS write policies via Supabase Auth profiles.role.
-- - Keep guide copy factual; verify venue/shop data from official sources before publishing.
-- - Related MEET cards should be reviewed before public release.
