import { defaultCommunities } from "@/lib/communityMeet";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { CommunityMeet } from "@/types/communityMeet";

export async function GET() {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return Response.json({ communities: defaultCommunities.filter((item) => item.status === "published"), source: "fallback" });

  const { data, error } = await supabase
    .from("meets")
    .select("content")
    .eq("status", "published")
    .order("date", { ascending: true });

  if (error || !data?.length) {
    return Response.json({ communities: defaultCommunities.filter((item) => item.status === "published"), source: "fallback", error: error?.message });
  }

  return Response.json({
    communities: data.map((item) => item.content).filter(Boolean) as CommunityMeet[],
    source: "supabase",
  });
}

