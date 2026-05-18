import { adminUnauthorizedResponse, isAdminRequest } from "@/lib/adminServerAuth";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) return adminUnauthorizedResponse();
  const { id } = await context.params;
  const supabase = getSupabaseAdminClient();
  if (!supabase) return Response.json({ error: "Supabase is not configured" }, { status: 503 });

  const { error } = await supabase
    .from("meets")
    .update({ status: "archived", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

