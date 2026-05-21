import { getSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

type ChatMessageInput = {
  userId?: string;
  body?: string;
};

async function getParticipant(meetSlug: string, userId: string) {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return { supabase: null, participant: null, error: "Supabase is not configured" };

  const { data, error } = await supabase
    .from("meet_participants")
    .select("*")
    .eq("meet_slug", meetSlug)
    .eq("user_id", userId)
    .eq("status", "confirmed")
    .maybeSingle();

  return { supabase, participant: data, error: error?.message ?? null };
}

export async function GET(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId")?.trim();

  if (!userId) return Response.json({ error: "ログインしてから利用してください" }, { status: 401 });

  const { supabase, participant, error } = await getParticipant(slug, userId);
  if (!supabase) return Response.json({ error }, { status: 503 });
  if (error) return Response.json({ error }, { status: 500 });
  if (!participant) return Response.json({ error: "参加確定後に利用できます", messages: [] }, { status: 403 });

  const { data, error: messagesError } = await supabase
    .from("meet_chat_messages")
    .select("*")
    .eq("meet_slug", slug)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (messagesError) return Response.json({ error: messagesError.message }, { status: 500 });
  return Response.json({ messages: data ?? [] });
}

export async function POST(request: Request, context: RouteContext) {
  const { slug } = await context.params;
  const input = (await request.json()) as ChatMessageInput;
  const userId = input.userId?.trim();
  const body = input.body?.trim();

  if (!userId) return Response.json({ error: "ログインしてから利用してください" }, { status: 401 });
  if (!body) return Response.json({ error: "メッセージを入力してください" }, { status: 400 });
  if (body.length > 500) return Response.json({ error: "メッセージは500文字以内で入力してください" }, { status: 400 });

  const { supabase, participant, error } = await getParticipant(slug, userId);
  if (!supabase) return Response.json({ error }, { status: 503 });
  if (error) return Response.json({ error }, { status: 500 });
  if (!participant) return Response.json({ error: "参加確定後に利用できます" }, { status: 403 });

  const { data, error: insertError } = await supabase
    .from("meet_chat_messages")
    .insert({
      meet_slug: slug,
      user_id: userId,
      display_name: participant.display_name ?? "FUKU-MEETS USER",
      avatar_url: participant.avatar_url ?? "",
      body,
    })
    .select("*")
    .single();

  if (insertError) return Response.json({ error: insertError.message }, { status: 500 });
  return Response.json({ message: data });
}
