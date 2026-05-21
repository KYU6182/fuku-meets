import { NextResponse } from "next/server";
import { defaultCommunities } from "@/lib/communityMeet";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { getStripeClient } from "@/lib/stripe";
import type { CommunityMeet } from "@/types/communityMeet";

type CheckoutInput = {
  meetSlug?: string;
  userId?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
};

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const supabase = getSupabaseAdminClient();
  if (!stripe) return NextResponse.json({ error: "Stripe is not configured" }, { status: 503 });
  if (!supabase) return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });

  const input = (await request.json()) as CheckoutInput;
  const meetSlug = input.meetSlug?.trim();
  const userId = input.userId?.trim();
  if (!meetSlug) return NextResponse.json({ error: "meetSlug is required" }, { status: 400 });
  if (!userId) return NextResponse.json({ error: "ログインしてから参加してください" }, { status: 401 });

  const fallback = defaultCommunities.find((item) => item.slug === meetSlug || item.id === meetSlug) ?? defaultCommunities[0];
  const { data: meetRow, error: meetError } = await supabase
    .from("meets")
    .select("id,slug,title,status,content")
    .eq("slug", meetSlug)
    .maybeSingle();

  if (meetError) return NextResponse.json({ error: meetError.message }, { status: 500 });

  const meet = ((meetRow?.content as CommunityMeet | null) ?? fallback) as CommunityMeet;
  if (meetRow?.status && meetRow.status !== "published") {
    return NextResponse.json({ error: "このMEETは現在参加できません" }, { status: 400 });
  }

  const amount = Number(meet.fee ?? 800);
  const now = new Date().toISOString();
  const { data: order, error: orderError } = await supabase
    .from("meet_orders")
    .insert({
      meet_id: meetRow?.id ?? meet.id,
      meet_slug: meet.slug,
      user_id: userId,
      email: input.email ?? null,
      amount,
      currency: "JPY",
      provider: "stripe",
      status: "pending",
      metadata: {
        meetTitle: meet.title,
        displayName: input.displayName ?? "FUKU-MEETS USER",
        avatarUrl: input.avatarUrl ?? "",
      },
      created_at: now,
      updated_at: now,
    })
    .select("id")
    .single();

  if (orderError || !order) return NextResponse.json({ error: orderError?.message ?? "Order creation failed" }, { status: 500 });

  const siteUrl = getSiteUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "jpy",
          unit_amount: amount,
          product_data: {
            name: `${meet.title} 参加費`,
            description: "FUKU-MEETS MEET参加費",
          },
        },
      },
    ],
    metadata: {
      orderId: order.id,
      meetSlug: meet.slug,
      userId,
      displayName: input.displayName ?? "FUKU-MEETS USER",
      avatarUrl: input.avatarUrl ?? "",
    },
    customer_email: input.email || undefined,
    success_url: `${siteUrl}/meet/${meet.slug}/payment-pending?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/meet/${meet.slug}/payment-failed?session_id={CHECKOUT_SESSION_ID}`,
  });

  const { error: updateError } = await supabase
    .from("meet_orders")
    .update({ stripe_session_id: session.id, updated_at: new Date().toISOString() })
    .eq("id", order.id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ url: session.url, sessionId: session.id });
}
