import { getSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase is not configured" }, { status: 503 });

  const { data: order, error } = await supabase
    .from("meet_orders")
    .select("*")
    .eq("stripe_session_id", sessionId)
    .maybeSingle();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!order) return Response.json({ status: "missing" }, { status: 404 });

  const { data: participant } = await supabase
    .from("meet_participants")
    .select("id")
    .eq("meet_slug", order.meet_slug)
    .eq("user_id", order.user_id)
    .eq("status", "confirmed")
    .maybeSingle();

  return Response.json({
    status: order.status,
    meetSlug: order.meet_slug,
    participantConfirmed: Boolean(participant),
  });
}
