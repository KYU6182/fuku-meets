import { getDefaultHomeCmsData, mergeHomeCmsData } from "@/lib/cms";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { HomeCmsData } from "@/types/cms";

export async function getPublishedHomeForServer() {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return getDefaultHomeCmsData();

  try {
    const { data, error } = await supabase
      .from("cms_pages")
      .select("*")
      .eq("slug", "home")
      .eq("status", "public")
      .maybeSingle();

    if (error || !data) return getDefaultHomeCmsData();
    return mergeHomeCmsData((data.content ?? null) as Partial<HomeCmsData> | null);
  } catch {
    return getDefaultHomeCmsData();
  }
}
