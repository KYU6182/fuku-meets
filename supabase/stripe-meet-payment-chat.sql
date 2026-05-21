create table if not exists meet_orders (
  id uuid primary key default gen_random_uuid(),
  meet_id text,
  meet_slug text not null,
  user_id text,
  email text,
  amount integer not null default 800,
  currency text not null default 'JPY',
  provider text not null default 'stripe',
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  status text not null default 'pending',
  paid_at timestamptz,
  canceled_at timestamptz,
  refunded_at timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table meet_orders add column if not exists meet_id text;
alter table meet_orders add column if not exists meet_slug text;
alter table meet_orders add column if not exists user_id text;
alter table meet_orders add column if not exists email text;
alter table meet_orders add column if not exists amount integer not null default 800;
alter table meet_orders add column if not exists currency text not null default 'JPY';
alter table meet_orders add column if not exists provider text not null default 'stripe';
alter table meet_orders add column if not exists stripe_session_id text unique;
alter table meet_orders add column if not exists stripe_payment_intent_id text;
alter table meet_orders add column if not exists status text not null default 'pending';
alter table meet_orders add column if not exists paid_at timestamptz;
alter table meet_orders add column if not exists canceled_at timestamptz;
alter table meet_orders add column if not exists refunded_at timestamptz;
alter table meet_orders add column if not exists metadata jsonb default '{}'::jsonb;
alter table meet_orders add column if not exists created_at timestamptz default now();
alter table meet_orders add column if not exists updated_at timestamptz default now();

create table if not exists meet_participants (
  id uuid primary key default gen_random_uuid(),
  meet_id text,
  meet_slug text not null,
  user_id text,
  order_id uuid references meet_orders(id) on delete set null,
  display_name text,
  avatar_url text,
  gender_label text,
  age_label text,
  area_label text,
  status text not null default 'confirmed',
  joined_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

alter table meet_participants add column if not exists meet_id text;
alter table meet_participants add column if not exists meet_slug text;
alter table meet_participants add column if not exists user_id text;
alter table meet_participants add column if not exists order_id uuid references meet_orders(id) on delete set null;
alter table meet_participants add column if not exists display_name text;
alter table meet_participants add column if not exists avatar_url text;
alter table meet_participants add column if not exists gender_label text;
alter table meet_participants add column if not exists age_label text;
alter table meet_participants add column if not exists area_label text;
alter table meet_participants add column if not exists status text not null default 'confirmed';
alter table meet_participants add column if not exists joined_at timestamptz default now();
alter table meet_participants add column if not exists metadata jsonb default '{}'::jsonb;

create table if not exists meet_chat_messages (
  id uuid primary key default gen_random_uuid(),
  meet_slug text not null,
  user_id text,
  display_name text,
  avatar_url text,
  body text not null,
  created_at timestamptz default now(),
  deleted_at timestamptz
);

alter table meet_chat_messages add column if not exists meet_slug text;
alter table meet_chat_messages add column if not exists user_id text;
alter table meet_chat_messages add column if not exists display_name text;
alter table meet_chat_messages add column if not exists avatar_url text;
alter table meet_chat_messages add column if not exists body text;
alter table meet_chat_messages add column if not exists created_at timestamptz default now();
alter table meet_chat_messages add column if not exists deleted_at timestamptz;

create table if not exists meet_categories (
  id text primary key,
  label text not null,
  subtitle text,
  icon text,
  sort_order integer default 0,
  is_visible boolean default true,
  created_at timestamptz default now()
);

alter table meet_categories add column if not exists label text;
alter table meet_categories add column if not exists subtitle text;
alter table meet_categories add column if not exists icon text;
alter table meet_categories add column if not exists sort_order integer default 0;
alter table meet_categories add column if not exists is_visible boolean default true;
alter table meet_categories add column if not exists created_at timestamptz default now();

create table if not exists meet_category_links (
  id uuid primary key default gen_random_uuid(),
  category_id text references meet_categories(id) on delete cascade,
  meet_slug text not null,
  sort_order integer default 0,
  is_pickup boolean default false,
  created_at timestamptz default now()
);

alter table meet_category_links add column if not exists category_id text references meet_categories(id) on delete cascade;
alter table meet_category_links add column if not exists meet_slug text;
alter table meet_category_links add column if not exists sort_order integer default 0;
alter table meet_category_links add column if not exists is_pickup boolean default false;
alter table meet_category_links add column if not exists created_at timestamptz default now();

create unique index if not exists meet_category_links_category_meet_unique
  on meet_category_links(category_id, meet_slug);
create index if not exists meet_orders_stripe_session_idx on meet_orders(stripe_session_id);
create index if not exists meet_orders_user_idx on meet_orders(user_id);
create index if not exists meet_participants_user_meet_idx on meet_participants(user_id, meet_slug, status);
create index if not exists meet_chat_messages_meet_idx on meet_chat_messages(meet_slug, created_at);

insert into meet_categories (id, label, subtitle, icon, sort_order, is_visible)
values
('men-relaxed', '男同士で気楽に', '気を使わず話せるMEET', 'users', 1, true),
('women-safe', '女の子同士で安心', '女性参加者が選びやすいMEET', 'heart-users', 2, true),
('new-fukuoka', '福岡はじめまして', '福岡に来たばかりの人へ', 'handshake', 3, true),
('expedition', '福岡遠征', 'ライブ・イベント遠征の夜に', 'suitcase', 4, true),
('tourism', '観光ついでにMEET', '旅先で地元のリアルに会う', 'camera', 5, true)
on conflict (id) do update set
label = excluded.label,
subtitle = excluded.subtitle,
icon = excluded.icon,
sort_order = excluded.sort_order,
is_visible = excluded.is_visible;

alter table meet_orders enable row level security;
alter table meet_participants enable row level security;
alter table meet_chat_messages enable row level security;
alter table meet_categories enable row level security;
alter table meet_category_links enable row level security;

drop policy if exists "Public can read visible meet categories" on meet_categories;
create policy "Public can read visible meet categories"
  on meet_categories for select
  using (is_visible = true);

drop policy if exists "Public can read meet category links" on meet_category_links;
create policy "Public can read meet category links"
  on meet_category_links for select
  using (true);
