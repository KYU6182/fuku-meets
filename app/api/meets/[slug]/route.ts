import { defaultCommunities } from "@/lib/communityMeet";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { CommunityMeet } from "@/types/communityMeet";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const fallback = defaultCommunities.find((item) => item.slug === slug || item.id === slug) ?? defaultCommunities[0];
  const supabase = getSupabaseAnonClient();
  if (!supabase) return Response.json({ community: fallback, source: "fallback" });

  const { data, error } = await supabase
    .from("meets")
    .select("content")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data?.content) return Response.json({ community: fallback, source: "fallback", error: error?.message });
  return Response.json({ community: data.content as CommunityMeet, source: "supabase" });
}

