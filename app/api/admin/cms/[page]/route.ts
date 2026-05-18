import {
  getDefaultHomeCmsData,
  getDefaultIconsCmsData,
  getDefaultMagazineCmsData,
  getDefaultNewsCmsData,
  getDefaultRankingCmsData,
  mergeHomeCmsData,
} from "@/lib/cms";
import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminServerAuth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { CmsPageSlug, CmsStatus, HomeCmsData, HomeSectionId } from "@/types/cms";

type RouteContext = {
  params: Promise<{ page: string }>;
};

type CmsPayload = {
  data?: unknown;
  status?: CmsStatus;
  action?: "save" | "publish" | "sync-defaults";
};

type CmsRouteResult = {
  data: unknown;
  source: "supabase" | "fallback";
  meta?: {
    updatedAt?: string | null;
    publishedAt?: string | null;
  };
  error?: string;
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
  if (page === "home") return mergeHomeCmsData(data as Partial<HomeCmsData> | null);
  return { ...getDefaultData(page), ...((data ?? {}) as object) };
}

function getTitle(page: CmsPageSlug, data: unknown) {
  if (page === "home") return mergeHomeCmsData(data as Partial<HomeCmsData> | null).hero.slides[0]?.title ?? "HOME";
  const record = data as { heroTitle?: string; title?: string; latestIssueTitle?: string };
  return record.heroTitle ?? record.title ?? record.latestIssueTitle ?? page.toUpperCase();
}

function getHomeSectionRows(page: CmsPageSlug, status: CmsStatus, data: unknown) {
  if (page !== "home") return [];
  const home = mergeHomeCmsData(data as Partial<HomeCmsData> | null);
  return home.sectionOrder.map((sectionId: HomeSectionId, index) => ({
    page_slug: page,
    status,
    section_id: sectionId,
    sort_order: index + 1,
    is_visible: home[sectionId].isVisible,
    content: home[sectionId],
    preset: null,
    updated_at: new Date().toISOString(),
  }));
}

async function readPage(page: CmsPageSlug, status: CmsStatus): Promise<CmsRouteResult> {
  const fallback = getDefaultData(page);
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { data: fallback, source: "fallback" };

  const { data, error } = await supabase
    .from("cms_pages")
    .select("content, updated_at, published_at")
    .eq("slug", page)
    .eq("status", status)
    .maybeSingle();

  if (data?.content && !error) {
    return {
      data: normalizePageData(page, data.content),
      source: "supabase",
      meta: { updatedAt: data.updated_at, publishedAt: data.published_at },
    };
  }

  if (status === "draft") {
    const published = await readPage(page, "public");
    if (published.source === "supabase") return published;
  }

  return { data: fallback, source: "fallback", error: error?.message };
}

async function writePage(page: CmsPageSlug, status: CmsStatus, data: unknown): Promise<CmsRouteResult> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return { data: normalizePageData(page, data), source: "fallback", error: "Supabase is not configured" };
  }

  const now = new Date().toISOString();
  const normalized = normalizePageData(page, data);
  const { data: row, error } = await supabase
    .from("cms_pages")
    .upsert(
      {
        slug: page,
        status,
        title: getTitle(page, normalized),
        content: normalized,
        updated_at: now,
        published_at: status === "public" ? now : null,
      },
      { onConflict: "slug,status" },
    )
    .select("content, updated_at, published_at")
    .single();

  if (error) {
    return { data: normalized, source: "fallback", error: error.message };
  }

  const sectionRows = getHomeSectionRows(page, status, normalized);
  if (sectionRows.length) {
    const { error: sectionsError } = await supabase
      .from("cms_sections")
      .upsert(sectionRows, { onConflict: "page_slug,status,section_id" });
    if (sectionsError) {
      return { data: normalized, source: "fallback", error: sectionsError.message };
    }
  }

  return {
    data: normalizePageData(page, row?.content ?? normalized),
    source: "supabase",
    meta: { updatedAt: row?.updated_at, publishedAt: row?.published_at },
  };
}

export async function GET(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const { page } = await context.params;
  if (!isCmsPageSlug(page)) return Response.json({ error: "Unknown CMS page" }, { status: 404 });
  const status = (new URL(request.url).searchParams.get("status") === "public" ? "public" : "draft") satisfies CmsStatus;
  return Response.json(await readPage(page, status), { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const { page } = await context.params;
  if (!isCmsPageSlug(page)) return Response.json({ error: "Unknown CMS page" }, { status: 404 });

  const body = (await request.json().catch(() => ({}))) as CmsPayload;
  const status: CmsStatus = body.action === "publish" || body.status === "public" ? "public" : "draft";
  const data = body.action === "sync-defaults" ? getDefaultData(page) : body.data ?? getDefaultData(page);
  const result = await writePage(page, status, data);
  const responseStatus = result.source === "supabase" ? 200 : 500;
  return Response.json(result, {
    status: responseStatus,
    headers: { "cache-control": "no-store" },
  });
}
