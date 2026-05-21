import { defaultCommunities, getFallbackCategoryMeets } from "@/lib/communityMeet";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { CommunityMeet } from "@/types/communityMeet";

type RouteContext = {
  params: Promise<{ categoryId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { categoryId } = await context.params;
  const fallback = getFallbackCategoryMeets(categoryId);
  const supabase = getSupabaseAnonClient();
  if (!supabase) return Response.json({ communities: fallback, source: "fallback" });

  const { data: links, error: linksError } = await supabase
    .from("meet_category_links")
    .select("meet_slug,sort_order,is_pickup")
    .eq("category_id", categoryId)
    .order("is_pickup", { ascending: false })
    .order("sort_order", { ascending: true });

  if (linksError || !links?.length) {
    return Response.json({ communities: fallback, source: "fallback", error: linksError?.message });
  }

  const slugs = links.map((item) => item.meet_slug);
  const { data: rows, error: meetsError } = await supabase
    .from("meets")
    .select("slug,content,status")
    .in("slug", slugs)
    .eq("status", "published");

  if (meetsError || !rows?.length) {
    return Response.json({ communities: fallback, source: "fallback", error: meetsError?.message });
  }

  const bySlug = new Map(rows.map((row) => [row.slug, row.content as CommunityMeet]));
  const communities = slugs
    .map((slug) => bySlug.get(slug) ?? defaultCommunities.find((item) => item.slug === slug))
    .filter(Boolean) as CommunityMeet[];

  return Response.json({ communities: communities.length ? communities : fallback, source: "supabase" });
}
