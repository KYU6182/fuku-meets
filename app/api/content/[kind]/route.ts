import { adminIcons, adminNews, adminRankings } from "@/lib/adminData";
import { getSupabaseAnonClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ kind: string }>;
};

type ContentKind = "news" | "icons" | "rankings";

function isKind(kind: string): kind is ContentKind {
  return kind === "news" || kind === "icons" || kind === "rankings";
}

function fallback(kind: ContentKind) {
  if (kind === "news") return adminNews.map((item) => ({
    ...item,
    image: item.image,
    summary: item.excerpt,
    date: item.publishedAt,
    body: item.body.split(/\n\n+/),
  }));
  if (kind === "icons") return adminIcons.map((item, index) => ({
    ...item,
    rank: index + 1,
    image: item.image,
    attention: `${Math.max(70, 99 - index * 3).toFixed(1)}%`,
    copy: item.profile,
    tags: [item.category, item.area],
    favoriteSpots: [],
    comments: [],
  }));
  return adminRankings;
}

export async function GET(request: Request, context: RouteContext) {
  const { kind } = await context.params;
  if (!isKind(kind)) return Response.json({ error: "Unknown content kind" }, { status: 404 });

  const slug = new URL(request.url).searchParams.get("slug");
  const supabase = getSupabaseAnonClient();
  if (!supabase) {
    const items = fallback(kind);
    return Response.json({ items: slug ? items.filter((item: any) => item.slug === slug) : items, source: "fallback" }, { headers: { "cache-control": "no-store" } });
  }

  if (kind === "news") {
    let query = supabase.from("news").select("*").eq("status", "published").order("published_at", { ascending: false });
    if (slug) query = query.eq("slug", slug);
    const { data, error } = await query;
    if (error) return Response.json({ items: fallback(kind), source: "fallback", error: error.message }, { headers: { "cache-control": "no-store" } });
    return Response.json({ items: (data ?? []).map((row) => ({
      ...(row.content || {}),
      id: row.id,
      slug: row.slug,
      title: row.title,
      category: row.category,
      image: row.cover_image_url,
      summary: row.excerpt,
      date: row.published_at,
      body: String(row.body_markdown || "").split(/\n\n+/).filter(Boolean),
      relatedMeetIds: row.related_meet_ids || [],
      isLiveInfo: row.is_live_info,
      artistName: row.artist_name,
      venue: row.venue,
    })), source: "supabase" }, { headers: { "cache-control": "no-store" } });
  }

  if (kind === "icons") {
    let query = supabase.from("icons").select("*").eq("status", "published").order("rank", { ascending: true, nullsFirst: false });
    if (slug) query = query.eq("slug", slug);
    const { data, error } = await query;
    if (error) return Response.json({ items: fallback(kind), source: "fallback", error: error.message }, { headers: { "cache-control": "no-store" } });
    return Response.json({ items: (data ?? []).map((row) => ({
      ...(row.content || {}),
      id: row.id,
      slug: row.slug,
      name: row.name,
      category: row.category,
      area: row.area,
      image: row.avatar_url,
      avatarUrl: row.avatar_url,
      heroImageUrl: row.hero_image_url,
      galleryImages: row.gallery_images || [],
      instagram: row.instagram,
      votes: row.votes,
      supportCount: row.support_count,
      rank: row.rank,
      attention: row.attention_score ? `${row.attention_score}%` : "88.0%",
      copy: row.profile_text,
      profileText: row.profile_text,
      interviewText: row.interview_text,
      favoriteSpots: row.favorite_places || [],
      relatedMeetIds: row.related_meet_ids || [],
      relatedNewsIds: row.related_news_ids || [],
    })), source: "supabase" }, { headers: { "cache-control": "no-store" } });
  }

  let themesQuery = supabase.from("ranking_themes").select("*").eq("status", "published").order("sort_order", { ascending: true });
  if (slug) themesQuery = themesQuery.eq("slug", slug);
  const { data: themes, error: themesError } = await themesQuery;
  if (themesError) return Response.json({ items: fallback(kind), source: "fallback", error: themesError.message }, { headers: { "cache-control": "no-store" } });

  const themeIds = (themes ?? []).map((theme) => theme.id);
  const { data: entries, error: entriesError } = themeIds.length
    ? await supabase.from("ranking_entries").select("*").eq("status", "published").in("ranking_id", themeIds).order("rank", { ascending: true })
    : { data: [], error: null };
  if (entriesError) return Response.json({ items: fallback(kind), source: "fallback", error: entriesError.message }, { headers: { "cache-control": "no-store" } });

  return Response.json({
    items: (themes ?? []).map((theme) => ({
      ...(theme.content || {}),
      id: theme.id,
      slug: theme.slug,
      title: theme.title,
      category: String(theme.category || "daily").toLowerCase(),
      description: theme.description,
      period: [theme.period_start, theme.period_end].filter(Boolean).join(" - "),
      image: theme.thumbnail_url,
      top3: (entries ?? []).filter((entry) => entry.ranking_id === theme.id).slice(0, 3).map((entry) => entry.name),
      entries: (entries ?? [])
        .filter((entry) => entry.ranking_id === theme.id)
        .map((entry) => ({
          ...(entry.content || {}),
          id: entry.id,
          rank: entry.rank,
          slug: entry.slug,
          name: entry.name,
          area: entry.area,
          description: entry.description,
          tags: entry.tags || [],
          votes: entry.votes,
          image: entry.thumbnail_url,
          thumbnailUrl: entry.thumbnail_url,
          heroImageUrl: entry.hero_image_url,
          pickedComments: (entry.content?.pickedComments as string[] | undefined) ?? [],
        })),
    })),
    source: "supabase",
  }, { headers: { "cache-control": "no-store" } });
}
