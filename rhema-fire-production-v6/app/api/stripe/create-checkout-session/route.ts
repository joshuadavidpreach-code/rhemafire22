import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Scaffold only. Implement Stripe Checkout here:
  // - create a Checkout Session
  // - redirect to session.url
  // Then implement Stripe webhooks to grant MINISTRY_TRACK entitlement.
  return NextResponse.json(
    {
      error: "Stripe scaffolding only. Implement Checkout + webhooks to enable upgrades.",
      requiredEnv: ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID", "STRIPE_WEBHOOK_SECRET"],
    },
    { status: 501 }
  );
}
