import { getSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return Response.json({ ok: false, message: "Supabaseが未設定です" }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as { rankingSlug?: string; entrySlug?: string } | null;
  const rankingSlug = body?.rankingSlug;
  const entrySlug = body?.entrySlug;
  if (!rankingSlug || !entrySlug) {
    return Response.json({ ok: false, message: "rankingSlug and entrySlug are required" }, { status: 400 });
  }

  const { data: theme, error: themeError } = await supabase
    .from("ranking_themes")
    .select("id")
    .eq("slug", rankingSlug)
    .maybeSingle();

  if (themeError) return Response.json({ ok: false, message: themeError.message }, { status: 500 });
  if (!theme) return Response.json({ ok: false, message: "ランキングが見つかりません" }, { status: 404 });

  const { data: entry, error: entryError } = await supabase
    .from("ranking_entries")
    .select("id, votes")
    .eq("ranking_id", theme.id)
    .eq("slug", entrySlug)
    .maybeSingle();

  if (entryError) return Response.json({ ok: false, message: entryError.message }, { status: 500 });
  if (!entry) return Response.json({ ok: false, message: "候補が見つかりません" }, { status: 404 });

  const nextVotes = Number(entry.votes ?? 0) + 1;
  const { data, error } = await supabase
    .from("ranking_entries")
    .update({ votes: nextVotes, updated_at: new Date().toISOString() })
    .eq("id", entry.id)
    .select("votes")
    .single();

  if (error) return Response.json({ ok: false, message: error.message }, { status: 500 });
  return Response.json({ ok: true, message: "投票しました", votes: Number(data.votes ?? nextVotes) });
}
