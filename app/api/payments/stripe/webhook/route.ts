import Stripe from "stripe";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const supabase = getSupabaseAdminClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");

  if (!stripe || !webhookSecret) return Response.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  if (!supabase) return Response.json({ error: "Supabase is not configured" }, { status: 503 });
  if (!signature) return Response.json({ error: "Missing Stripe signature" }, { status: 400 });
  const admin = supabase;

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid signature";
    return Response.json({ error: message }, { status: 400 });
  }

  async function markSession(status: "expired" | "failed", session: Stripe.Checkout.Session) {
    const now = new Date().toISOString();
    const update = status === "expired"
      ? { status, canceled_at: now, updated_at: now }
      : { status, updated_at: now };
    const { error } = await admin
      .from("meet_orders")
      .update(update)
      .eq("stripe_session_id", session.id)
      .neq("status", "paid");
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return null;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { data: order, error: orderError } = await admin
      .from("meet_orders")
      .select("*")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (orderError) return Response.json({ error: orderError.message }, { status: 500 });
    if (order && order.status !== "paid") {
      const now = new Date().toISOString();
      const metadata = (order.metadata ?? {}) as Record<string, string>;
      const displayName = metadata.displayName || session.customer_details?.name || "FUKU-MEETS USER";
      const avatarUrl = metadata.avatarUrl || "";

      const { error: paidError } = await admin
        .from("meet_orders")
        .update({
          status: "paid",
          stripe_payment_intent_id: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
          paid_at: now,
          updated_at: now,
        })
        .eq("id", order.id);

      if (paidError) return Response.json({ error: paidError.message }, { status: 500 });

      const { data: existing, error: existingError } = await admin
        .from("meet_participants")
        .select("id")
        .eq("meet_slug", order.meet_slug)
        .eq("user_id", order.user_id)
        .eq("status", "confirmed")
        .maybeSingle();

      if (existingError) return Response.json({ error: existingError.message }, { status: 500 });

      if (!existing) {
        const { error: participantError } = await admin.from("meet_participants").insert({
          meet_id: order.meet_id,
          meet_slug: order.meet_slug,
          user_id: order.user_id,
          order_id: order.id,
          display_name: displayName,
          avatar_url: avatarUrl,
          status: "confirmed",
          joined_at: now,
          metadata: {
            email: order.email,
            stripeSessionId: session.id,
          },
        });
        if (participantError) return Response.json({ error: participantError.message }, { status: 500 });
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const result = await markSession("expired", event.data.object as Stripe.Checkout.Session);
    if (result) return result;
  }

  if (event.type === "checkout.session.async_payment_failed") {
    const result = await markSession("failed", event.data.object as Stripe.Checkout.Session);
    if (result) return result;
  }

  return Response.json({ received: true });
}
