import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminServerAuth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import type { CmsImage } from "@/types/cms";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxSize = 5 * 1024 * 1024;

function bucketForCategory(category: string) {
  if (category === "icons") return "icons-images";
  if (category === "shop") return "meet-images";
  return "cms-images";
}

export async function GET(request: Request) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ images: [], source: "fallback" });

  const { data, error } = await supabase
    .from("cms_assets")
    .select("id,url,name,alt,category,bucket,path,created_at")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ images: [], source: "fallback", error: error.message });

  const images: CmsImage[] = (data ?? []).map((item) => ({
    id: String(item.id),
    url: String(item.url),
    name: String(item.name ?? "CMS image"),
    alt: String(item.alt ?? ""),
    category: item.category as CmsImage["category"],
    bucket: String(item.bucket ?? ""),
    path: String(item.path ?? ""),
    createdAt: String(item.created_at),
  }));
  return Response.json({ images, source: "supabase" });
}

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase is not configured" }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  const name = String(form.get("name") ?? "CMS image");
  const alt = String(form.get("alt") ?? "");
  const category = String(form.get("category") ?? "other") as CmsImage["category"];

  if (!(file instanceof File)) return Response.json({ error: "画像ファイルがありません" }, { status: 400 });
  if (!allowedTypes.has(file.type)) return Response.json({ error: "jpg / png / webp のみアップロードできます。SVGは禁止です。" }, { status: 400 });
  if (file.size > maxSize) return Response.json({ error: "画像は5MB以下にしてください。" }, { status: 400 });

  const bucket = bucketForCategory(category);
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${category}/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const bytes = await file.arrayBuffer();

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, bytes, { contentType: file.type, upsert: false });

  if (uploadError) return Response.json({ error: uploadError.message }, { status: 500 });

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(path);
  const url = publicUrl.publicUrl;

  const { data, error } = await supabase
    .from("cms_assets")
    .insert({
      url,
      name,
      alt,
      category,
      bucket,
      path,
      created_at: new Date().toISOString(),
    })
    .select("id,url,name,alt,category,created_at")
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  const image: CmsImage = {
    id: String(data.id),
    url: String(data.url),
    name: String(data.name ?? name),
    alt: String(data.alt ?? alt),
    category: data.category as CmsImage["category"],
    bucket,
    path,
    createdAt: String(data.created_at),
  };
  return Response.json({ image, bucket, source: "supabase" });
}

export async function DELETE(request: Request) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return Response.json({ error: "id is required" }, { status: 400 });
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ ok: false, source: "fallback" }, { status: 503 });

  const { data: asset } = await supabase
    .from("cms_assets")
    .select("bucket,path")
    .eq("id", id)
    .maybeSingle();
  if (asset?.bucket && asset?.path) {
    await supabase.storage.from(String(asset.bucket)).remove([String(asset.path)]);
  }
  const { error } = await supabase.from("cms_assets").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true, source: "supabase" });
}
