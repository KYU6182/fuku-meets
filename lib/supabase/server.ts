import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let anonClient: SupabaseClient | null = null;
let adminClient: SupabaseClient | null = null;

function getUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function isSupabaseConfigured() {
  return Boolean(getUrl() && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabaseAnonClient() {
  const url = getUrl();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  anonClient ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return anonClient;
}

export function getSupabaseAdminClient() {
  const url = getUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  adminClient ??= createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

