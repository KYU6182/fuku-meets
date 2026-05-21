import { homeMeetCategories } from "@/lib/communityMeet";
import { getSupabaseAnonClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return Response.json({ categories: homeMeetCategories, source: "fallback" });

  const { data, error } = await supabase
    .from("meet_categories")
    .select("id,label,subtitle,icon,sort_order,is_visible")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) {
    return Response.json({ categories: homeMeetCategories, source: "fallback", error: error?.message });
  }

  return Response.json({
    categories: data.map((item) => ({
      id: item.id,
      label: item.label,
      subtitle: item.subtitle,
      icon: item.icon,
      sortOrder: item.sort_order,
      isVisible: item.is_visible,
    })),
    source: "supabase",
  });
}
