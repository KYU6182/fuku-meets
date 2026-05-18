import { adminIcons, adminNews, adminRankings } from "@/lib/adminData";
import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminServerAuth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ kind: string }>;
};

type ContentKind = "news" | "icons" | "rankings";

type RankingEntryInput = {
  id?: string;
  slug: string;
  name: string;
  area?: string;
  description?: string;
  tags?: string[];
  votes?: number;
  rank?: number;
  image?: string;
  thumbnailUrl?: string;
  heroImageUrl?: string;
  heroImage?: string;
  galleryImages?: string[];
  goodCount?: number;
  saveCount?: number;
  commentCount?: number;
  relatedMeetIds?: string[];
  status?: string;
};

function isKind(kind: string): kind is ContentKind {
  return kind === "news" || kind === "icons" || kind === "rankings";
}

function normalizeSlug(value: string, fallback: string) {
  return (value || fallback)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function fallback(kind: ContentKind) {
  if (kind === "news") return adminNews;
  if (kind === "icons") return adminIcons;
  return adminRankings;
}

function normalizeNewsStatus(status?: string) {
  return status === "published" || status === "archived" ? status : "draft";
}

function toNumber(value: unknown, fallbackValue = 0) {
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : fallbackValue;
}

async function readContent(kind: ContentKind, includePrivate = true, slug?: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { items: fallback(kind), source: "fallback" as const };

  if (kind === "news") {
    let query = supabase.from("news").select("*").order("updated_at", { ascending: false });
    if (!includePrivate) query = query.eq("status", "published");
    if (slug) query = query.eq("slug", slug);
    const { data, error } = await query;
    if (error) return { items: fallback(kind), source: "fallback" as const, error: error.message };
    return { items: (data ?? []).map((row) => row.content || row), source: "supabase" as const };
  }

  if (kind === "icons") {
    let query = supabase.from("icons").select("*").order("rank", { ascending: true, nullsFirst: false });
    if (!includePrivate) query = query.eq("status", "published");
    if (slug) query = query.eq("slug", slug);
    const { data, error } = await query;
    if (error) return { items: fallback(kind), source: "fallback" as const, error: error.message };
    return { items: (data ?? []).map((row) => row.content || row), source: "supabase" as const };
  }

  let themesQuery = supabase.from("ranking_themes").select("*").order("sort_order", { ascending: true });
  if (!includePrivate) themesQuery = themesQuery.eq("status", "published");
  if (slug) themesQuery = themesQuery.eq("slug", slug);
  const { data: themes, error: themesError } = await themesQuery;
  if (themesError) return { items: fallback(kind), source: "fallback" as const, error: themesError.message };

  const themeIds = (themes ?? []).map((theme) => theme.id);
  const { data: entries, error: entriesError } = themeIds.length
    ? await supabase.from("ranking_entries").select("*").in("ranking_id", themeIds).order("rank", { ascending: true })
    : { data: [], error: null };
  if (entriesError) return { items: fallback(kind), source: "fallback" as const, error: entriesError.message };

  return {
    items: (themes ?? []).map((theme) => ({
      ...(theme.content || {}),
      id: theme.id,
      slug: theme.slug,
      title: theme.title,
      category: theme.category,
      description: theme.description,
      periodStart: theme.period_start,
      periodEnd: theme.period_end,
      image: theme.thumbnail_url,
      status: theme.status,
      entries: (entries ?? [])
        .filter((entry) => entry.ranking_id === theme.id)
        .map((entry) => ({
          ...(entry.content || {}),
          id: entry.id,
          rankingId: entry.ranking_id,
          slug: entry.slug,
          name: entry.name,
          area: entry.area,
          description: entry.description,
          tags: entry.tags ?? [],
          votes: entry.votes,
          rank: entry.rank,
          image: entry.thumbnail_url,
          thumbnailUrl: entry.thumbnail_url,
          heroImageUrl: entry.hero_image_url,
          status: entry.status,
        })),
    })),
    source: "supabase" as const,
  };
}

export async function GET(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const { kind } = await context.params;
  if (!isKind(kind)) return Response.json({ error: "Unknown content kind" }, { status: 404 });
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug") ?? undefined;
  return Response.json(await readContent(kind, true, slug), { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const { kind } = await context.params;
  if (!isKind(kind)) return Response.json({ error: "Unknown content kind" }, { status: 404 });
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase is not configured" }, { status: 503 });
  const body = await request.json();
  const now = new Date().toISOString();

  if (kind === "news") {
    const id = body.id || normalizeSlug(body.slug, `news-${Date.now()}`);
    const slug = normalizeSlug(body.slug, id);
    const content = {
      ...body,
      id,
      slug,
      image: body.image || body.coverImageUrl || body.cover_image_url || "",
      date: body.publishedAt || body.published_at || now,
    };
    const { data, error } = await supabase
      .from("news")
      .upsert(
        {
          id,
          slug,
          title: body.title || "無題の記事",
          category: body.category || "ローカルニュース",
          excerpt: body.excerpt || body.summary || "",
          body_markdown: body.body || body.bodyMarkdown || "",
          cover_image_url: content.image,
          content_images: body.contentImages || [],
          published_at: body.publishedAt || now,
          area: body.area || "",
          tags: body.tags || [],
          related_meet_ids: body.relatedMeetIds || [],
          related_ranking_ids: body.relatedRankingIds || [],
          related_icon_ids: body.relatedIconIds || [],
          event_date: body.eventDate || null,
          venue: body.venue || "",
          artist_name: body.artistName || "",
          is_live_info: Boolean(body.isLiveInfo),
          is_visitor_friendly: Boolean(body.isVisitorFriendly),
          has_solo_meet: Boolean(body.hasSoloMeet),
          status: normalizeNewsStatus(body.status),
          content,
          updated_at: now,
        },
        { onConflict: "id" },
      )
      .select("content")
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ item: data.content, source: "supabase" }, { headers: { "cache-control": "no-store" } });
  }

  if (kind === "icons") {
    const id = body.id || normalizeSlug(body.slug, `icon-${Date.now()}`);
    const slug = normalizeSlug(body.slug, id);
    const avatar = body.image || body.avatarUrl || body.avatar_url || "";
    const content = {
      ...body,
      id,
      slug,
      image: avatar,
      avatarUrl: avatar,
      heroImageUrl: body.heroImageUrl || body.heroImage || avatar,
      galleryImages: body.galleryImages || [],
      favoritePlaces: body.favoritePlaces || [],
    };
    const { data, error } = await supabase
      .from("icons")
      .upsert(
        {
          id,
          slug,
          name: body.name || "NO NAME",
          title: body.title || body.category || "",
          category: body.category || "",
          area: body.area || "",
          instagram: body.instagram || "",
          is_cover_candidate: Boolean(body.isCoverCandidate),
          rank: toNumber(body.rank, 99),
          attention_score: body.attentionScore ? Number(body.attentionScore) : null,
          votes: toNumber(body.votes),
          support_count: toNumber(body.supportCount),
          status: body.status || "draft",
          avatar_url: avatar,
          hero_image_url: content.heroImageUrl,
          gallery_images: content.galleryImages,
          profile_text: body.profile || body.profileText || "",
          interview_text: body.interviewText || "",
          favorite_places: content.favoritePlaces,
          related_meet_ids: body.relatedMeetIds || [],
          related_news_ids: body.relatedNewsIds || [],
          content,
          updated_at: now,
        },
        { onConflict: "id" },
      )
      .select("content")
      .single();
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json({ item: data.content, source: "supabase" }, { headers: { "cache-control": "no-store" } });
  }

  const id = body.id || normalizeSlug(body.slug, `ranking-${Date.now()}`);
  const slug = normalizeSlug(body.slug, id);
  const entries = (body.entries || []) as RankingEntryInput[];
  const content = { ...body, id, slug, image: body.image || body.thumbnailUrl || "", entries };
  const { error: themeError } = await supabase
    .from("ranking_themes")
    .upsert(
      {
        id,
        slug,
        title: body.title || "無題ランキング",
        category: body.category || "DAILY",
        description: body.description || "",
        period_start: body.periodStart || null,
        period_end: body.periodEnd || null,
        status: body.status || "draft",
        sort_order: toNumber(body.sortOrder),
        thumbnail_url: content.image,
        cta_href: body.ctaHref || `/ranking/${slug}`,
        related_meet_ids: body.relatedMeetIds || [],
        content,
        updated_at: now,
      },
      { onConflict: "id" },
    );
  if (themeError) return Response.json({ error: themeError.message }, { status: 500 });

  if (entries.length) {
    const entryRows = entries.map((entry, index) => {
      const entrySlug = normalizeSlug(entry.slug, `${slug}-${index + 1}`);
      const thumbnail = entry.image || entry.thumbnailUrl || "";
      return {
        id: entry.id || `${id}-${entrySlug}`,
        ranking_id: id,
        slug: entrySlug,
        name: entry.name || `候補 ${index + 1}`,
        area: entry.area || "",
        description: entry.description || "",
        tags: entry.tags || [],
        votes: toNumber(entry.votes),
        rank: toNumber(entry.rank, index + 1),
        thumbnail_url: thumbnail,
        hero_image_url: entry.heroImageUrl || entry.heroImage || thumbnail,
        gallery_images: entry.galleryImages || [],
        good_count: toNumber(entry.goodCount),
        save_count: toNumber(entry.saveCount),
        comment_count: toNumber(entry.commentCount),
        related_meet_ids: entry.relatedMeetIds || [],
        status: entry.status || "published",
        content: { ...entry, slug: entrySlug, image: thumbnail, thumbnailUrl: thumbnail },
        updated_at: now,
      };
    });
    const { error: entriesError } = await supabase.from("ranking_entries").upsert(entryRows, { onConflict: "id" });
    if (entriesError) return Response.json({ error: entriesError.message }, { status: 500 });
  }

  const result = await readContent("rankings", true, slug);
  return Response.json({ item: result.items[0] ?? content, source: "supabase" }, { headers: { "cache-control": "no-store" } });
}
