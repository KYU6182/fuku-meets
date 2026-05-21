import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminServerAuth";
import { defaultCommunities } from "@/lib/communityMeet";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { CommunityMeet } from "@/types/communityMeet";

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ communities: defaultCommunities, source: "fallback" });

  const { data, error } = await supabase.from("meets").select("content").order("updated_at", { ascending: false });
  if (error) return Response.json({ communities: defaultCommunities, source: "fallback", error: error.message });
  return Response.json({ communities: data.map((item) => item.content).filter(Boolean) as CommunityMeet[], source: "supabase" });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase is not configured" }, { status: 503 });
  const community = (await request.json()) as Partial<CommunityMeet>;
  const now = new Date().toISOString();
  const id = community.id ?? `meet-${Date.now()}`;
  const slug = community.slug ?? id;
  const content: CommunityMeet = {
    ...defaultCommunities[0],
    ...community,
    id,
    slug,
    status: community.status ?? "draft",
    updatedAt: now,
    createdAt: community.createdAt ?? now,
  };
  const { data, error } = await supabase
    .from("meets")
    .upsert(
      {
        id: content.id,
        slug: content.slug,
        title: content.title,
        status: content.status,
        image: content.image,
        image_url: content.image,
        hero_image_url: content.heroImage ?? content.image,
        gallery_images: content.galleryImages ?? [],
        related_news_ids: content.relatedNewsIds ?? [],
        related_live_ids: content.relatedLiveIds ?? [],
        detail_venue_name: content.detailVenueName ?? "",
        is_age20_only: content.isAge20Only ?? false,
        is_women_friendly: content.isWomenFriendly ?? false,
        area: content.area,
        date: content.date,
        start_time: content.startTime,
        end_time: content.endTime,
        participant_count: content.participantCount,
        capacity: content.capacity,
        content,
        updated_at: now,
        created_at: content.createdAt,
      },
      { onConflict: "id" },
    )
    .select("content")
    .single();
  if (error) return Response.json({ error: error.message }, { status: 500 });

  const categoryIds = content.homeCategoryIds ?? [];
  const { error: deleteLinksError } = await supabase.from("meet_category_links").delete().eq("meet_slug", content.slug);
  if (deleteLinksError) return Response.json({ error: deleteLinksError.message }, { status: 500 });

  if (categoryIds.length) {
    const links = categoryIds.map((categoryId, index) => ({
      category_id: categoryId,
      meet_slug: content.slug,
      sort_order: Number(content.homeCategorySortOrder ?? 0) + index,
      is_pickup: content.homePickup ?? false,
    }));
    const { error: insertLinksError } = await supabase.from("meet_category_links").insert(links);
    if (insertLinksError) return Response.json({ error: insertLinksError.message }, { status: 500 });
  }

  return Response.json({ community: data.content as CommunityMeet, source: "supabase" });
}
