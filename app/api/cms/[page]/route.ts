import {
  getDefaultHomeCmsData,
  getDefaultIconsCmsData,
  getDefaultMagazineCmsData,
  getDefaultNewsCmsData,
  getDefaultRankingCmsData,
  mergeHomeCmsData,
} from "@/lib/cms";
import { getSupabaseAnonClient } from "@/lib/supabase/server";
import type { CmsPageSlug } from "@/types/cms";

type RouteContext = {
  params: Promise<{ page: string }>;
};

const pageSlugs: CmsPageSlug[] = ["home", "ranking", "news", "icons", "magazine"];

function isCmsPageSlug(page: string): page is CmsPageSlug {
  return pageSlugs.includes(page as CmsPageSlug);
}

function getDefaultData(page: CmsPageSlug) {
  if (page === "home") return getDefaultHomeCmsData();
  if (page === "ranking") return getDefaultRankingCmsData();
  if (page === "news") return getDefaultNewsCmsData();
  if (page === "icons") return getDefaultIconsCmsData();
  return getDefaultMagazineCmsData();
}

function normalizePageData(page: CmsPageSlug, data: unknown) {
  if (page === "home") return mergeHomeCmsData(data as Partial<ReturnType<typeof getDefaultHomeCmsData>> | null);
  return { ...getDefaultData(page), ...((data ?? {}) as object) };
}

export async function GET(request: Request, context: RouteContext) {
  const { page } = await context.params;
  if (!isCmsPageSlug(page)) return Response.json({ error: "Unknown CMS page" }, { status: 404 });

  const fallback = getDefaultData(page);
  const supabase = getSupabaseAnonClient();
  if (!supabase) {
    return Response.json({ data: fallback, source: "fallback" }, { headers: { "cache-control": "no-store" } });
  }

  const { data, error } = await supabase
    .from("cms_pages")
    .select("content, updated_at, published_at")
    .eq("slug", page)
    .eq("status", "public")
    .maybeSingle();

  if (error || !data?.content) {
    return Response.json({ data: fallback, source: "fallback", error: error?.message }, { headers: { "cache-control": "no-store" } });
  }

  return Response.json({
    data: normalizePageData(page, data.content),
    source: "supabase",
    meta: {
      updatedAt: data.updated_at,
      publishedAt: data.published_at,
    },
  }, { headers: { "cache-control": "no-store" } });
}
