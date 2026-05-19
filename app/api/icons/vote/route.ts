import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return Response.json({ ok: false, message: "Supabaseが未設定です" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { slug?: string; mode?: "support" | "cover" } | null;
  const slug = body?.slug;
  const mode = body?.mode ?? "support";
  if (!slug) return Response.json({ ok: false, message: "slug is required" }, { status: 400 });

  const { data: icon, error: readError } = await supabase
    .from("icons")
    .select("id, votes, support_count")
    .eq("slug", slug)
    .maybeSingle();

  if (readError) return Response.json({ ok: false, message: readError.message }, { status: 500 });
  if (!icon) return Response.json({ ok: false, message: "FUKU ICONSが見つかりません" }, { status: 404 });

  const nextVotes = Number(icon.votes ?? 0) + 1;
  const nextSupport = mode === "support" ? Number(icon.support_count ?? 0) + 1 : Number(icon.support_count ?? 0);

  const { data, error } = await supabase
    .from("icons")
    .update({
      votes: nextVotes,
      support_count: nextSupport,
      updated_at: new Date().toISOString(),
    })
    .eq("id", icon.id)
    .select("votes, support_count")
    .single();

  if (error) return Response.json({ ok: false, message: error.message }, { status: 500 });
  return Response.json({
    ok: true,
    message: mode === "cover" ? "表紙投票しました" : "応援しました",
    votes: Number(data.votes ?? nextVotes),
    supportCount: Number(data.support_count ?? nextSupport),
  });
}
