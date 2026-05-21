-- MEET detail upgrade for FUKU-MEETS.
-- The current app stores the full MEET payload in meets.content for backwards
-- compatibility. These columns make the new safety, private location, FAQ, and
-- related-MEET data queryable later without breaking existing rows.

alter table if exists public.meets
  add column if not exists fee integer default 800,
  add column if not exists safety jsonb default '{}'::jsonb,
  add column if not exists artist jsonb default '{}'::jsonb,
  add column if not exists participant_profiles jsonb default '[]'::jsonb,
  add column if not exists faqs jsonb default '[]'::jsonb,
  add column if not exists join_options jsonb default '{}'::jsonb,
  add column if not exists private_location jsonb default '{}'::jsonb,
  add column if not exists cancel_policy jsonb default '{}'::jsonb,
  add column if not exists related_meet_tabs jsonb default '[]'::jsonb;

comment on column public.meets.safety is 'MEET safety metadata: womenOnly, soloOk, splitBillRecommended, identityVerifiedRequired, hidden location, ratios.';
comment on column public.meets.private_location is 'Venue details shown only to confirmed participants: venue, address, map URL, reservation name, meeting memo, host contact memo.';
comment on column public.meets.participant_profiles is 'Anonymized participant atmosphere cards. Do not store real names, contact info, or detailed addresses here.';
