import { defaultCommunities } from "@/lib/communityMeet";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { CommunityMeet } from "@/types/communityMeet";

function fallbackMeet(slug: string) {
  return defaultCommunities.find((item) => item.slug === slug || item.id === slug) ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();
  const meetSlug = searchParams.get("meetSlug")?.trim();
  const supabase = getSupabaseAdminClient();

  if (!userId) return Response.json({ error: "userId is required" }, { status: 401 });
  if (!supabase) return Response.json({ error: "Supabase is not configured", chats: [], confirmed: false }, { status: 503 });

  let query = supabase
    .from("meet_participants")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "confirmed")
    .order("joined_at", { ascending: false });

  if (meetSlug) query = query.eq("meet_slug", meetSlug);

  const { data: participants, error } = await query;
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const rows = participants ?? [];
  const slugs = Array.from(new Set(rows.map((item) => item.meet_slug).filter(Boolean)));
  let meetMap = new Map<string, CommunityMeet>();

  if (slugs.length) {
    const { data: meets } = await supabase
      .from("meets")
      .select("slug,content")
      .in("slug", slugs);

    (meets ?? []).forEach((row) => {
      if (row.slug && row.content) meetMap.set(row.slug, row.content as CommunityMeet);
    });
  }

  slugs.forEach((slug) => {
    if (!meetMap.has(slug)) {
      const fallback = fallbackMeet(slug);
      if (fallback) meetMap.set(slug, fallback);
    }
  });

  const chats = rows.map((participant) => ({
    participant,
    meet: meetMap.get(participant.meet_slug) ?? fallbackMeet(participant.meet_slug),
  }));

  if (meetSlug) {
    return Response.json({
      confirmed: rows.length > 0,
      participant: rows[0] ?? null,
      meet: meetMap.get(meetSlug) ?? fallbackMeet(meetSlug),
    });
  }

  return Response.json({ chats });
}
