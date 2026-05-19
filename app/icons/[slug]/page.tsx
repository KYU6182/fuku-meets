import IconProfilePage from "@/components/IconProfilePage";
import { notFound } from "next/navigation";
import type { FukuIcon } from "@/lib/data/icons";
import { getSupabaseAnonClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPublicIcon(slug: string): Promise<FukuIcon | null> {
  const supabase = getSupabaseAnonClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("icons")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return null;
  return {
    id: String(data.id),
    slug: data.slug,
    rank: 1,
    name: data.name,
    category: data.category ?? "creator",
    tab: data.category ?? "creator",
    area: data.area ?? "福岡エリア",
    votes: Number(data.votes ?? 0),
    supportCount: Number(data.support_count ?? data.votes ?? 0),
    attention: data.attention_score ? `${data.attention_score}%` : "88.0%",
    image: data.avatar_url || data.hero_image_url || "/images/icons/yui.jpg",
    heroImage: data.hero_image_url || data.avatar_url || "/images/icons/yui.jpg",
    galleryImages: Array.isArray(data.gallery_images) ? data.gallery_images : [],
    instagram: data.instagram ?? "",
    copy: data.profile_text ?? "",
    profileText: data.profile_text ?? "",
    interviewText: data.interview_text ?? "",
    favoriteSpots: Array.isArray(data.favorite_places) ? data.favorite_places : [],
    comments: [],
    tags: [data.category, data.area].filter(Boolean) as string[],
  };
}

export default async function IconDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const icon = await getPublicIcon(slug);
  if (!icon) notFound();
  return <IconProfilePage icon={icon} />;
}
