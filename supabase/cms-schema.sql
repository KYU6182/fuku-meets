-- FUKU-MEETS CMS / MEET schema.
-- Apply this in Supabase SQL editor before using the production CMS.
-- Keep SUPABASE_SERVICE_ROLE_KEY server-only. Public clients read only published data through RLS.

create table if not exists public.cms_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  status text not null check (status in ('draft', 'public')),
  title text,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz,
  unique (slug, status)
);

create table if not exists public.cms_sections (
  id uuid primary key default gen_random_uuid(),
  page_slug text not null,
  status text not null check (status in ('draft', 'public')),
  section_id text not null,
  sort_order integer not null default 0,
  is_visible boolean not null default true,
  content jsonb not null default '{}'::jsonb,
  preset jsonb,
  updated_at timestamptz not null default now(),
  unique (page_slug, status, section_id)
);

create table if not exists public.cms_assets (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  name text not null,
  alt text,
  category text not null default 'other',
  bucket text not null,
  path text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.meets (
  id text primary key,
  slug text not null unique,
  title text not null,
  status text not null check (status in ('draft', 'published', 'closed', 'archived')),
  image text,
  area text,
  date date,
  start_time text,
  end_time text,
  participant_count integer not null default 0,
  capacity integer not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_pages enable row level security;
alter table public.cms_sections enable row level security;
alter table public.cms_assets enable row level security;
alter table public.meets enable row level security;

drop policy if exists "public read published cms pages" on public.cms_pages;
create policy "public read published cms pages"
  on public.cms_pages for select
  using (status = 'public');

drop policy if exists "public read published cms sections" on public.cms_sections;
create policy "public read published cms sections"
  on public.cms_sections for select
  using (status = 'public');

drop policy if exists "public read cms assets" on public.cms_assets;
create policy "public read cms assets"
  on public.cms_assets for select
  using (true);

drop policy if exists "public read published meets" on public.meets;
create policy "public read published meets"
  on public.meets for select
  using (status = 'published');

-- Admin writes are performed by server routes using service_role.
-- Future Supabase Auth migration:
-- - Add profiles.role and server-side role checks.
-- - Add admin_logs for every create/update/archive/publish operation.
-- - Keep direct HTML/CSS out of CMS content; store only preset keys and structured JSON.
