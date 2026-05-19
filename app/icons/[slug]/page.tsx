import IconProfilePage from "@/components/IconProfilePage";
import { icons, type FukuIcon } from "@/lib/data/icons";
import { getSupabaseAnonClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPublicIcon(slug: string): Promise<FukuIcon> {
  const fallback = icons.find((item) => item.slug === slug) ?? icons[0];
  const supabase = getSupabaseAnonClient();
  if (!supabase) return fallback;

  const { data, error } = await supabase
    .from("icons")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error || !data) return fallback;
  return {
    ...fallback,
    id: String(data.id ?? fallback.id),
    slug: data.slug ?? fallback.slug,
    name: data.name ?? fallback.name,
    category: data.category ?? fallback.category,
    tab: data.category ?? fallback.tab,
    area: data.area ?? fallback.area,
    votes: Number(data.votes ?? fallback.votes),
    supportCount: Number(data.support_count ?? data.votes ?? fallback.supportCount ?? fallback.votes),
    attention: data.attention_score ? `${data.attention_score}%` : fallback.attention,
    image: data.avatar_url || fallback.image,
    heroImage: data.hero_image_url || data.avatar_url || fallback.heroImage || fallback.image,
    galleryImages: Array.isArray(data.gallery_images) ? data.gallery_images : fallback.galleryImages,
    instagram: data.instagram ?? fallback.instagram,
    copy: data.profile_text ?? fallback.copy,
    profileText: data.profile_text ?? fallback.profileText,
    interviewText: data.interview_text ?? fallback.interviewText,
    favoriteSpots: Array.isArray(data.favorite_places) ? data.favorite_places : fallback.favoriteSpots,
    tags: [data.category, data.area].filter(Boolean) as string[],
  };
}

export default async function IconDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const icon = await getPublicIcon(slug);
  return <IconProfilePage icon={icon} />;
}
