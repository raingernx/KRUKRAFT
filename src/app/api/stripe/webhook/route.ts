import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PaymentServiceError } from "@/services/payments/payment.service";
import {
  constructStripeWebhookEvent,
  handleStripeWebhookEvent,
} from "@/services/payments/stripe-webhook.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function handleServiceError(err: unknown) {
  if (err instanceof PaymentServiceError) {
    return NextResponse.json(err.payload, { status: err.status });
  }

  console.error("[WEBHOOK] Unhandled handler error:", err);
  return NextResponse.json(
    { error: "Webhook handler failed." },
    { status: 500 },
  );
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature) {
    console.error("[WEBHOOK] Missing stripe-signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Signature verification is isolated in its own try/catch so that any
  // failure (wrong secret, expired stripe listen session, tampered payload)
  // always returns 400 — never 500.
  //
  // The combined try/catch that was here before caused a subtle problem:
  // Next.js webpack can place the route and the service in separate module
  // chunks, giving each its own copy of the PaymentServiceError class.
  // When that happens `err instanceof PaymentServiceError` returns false in
  // handleServiceError, so every signature mismatch fell through to the 500
  // branch — including harmless unhandled events like payment_intent.created.
  let event: ReturnType<typeof constructStripeWebhookEvent>;
  try {
    event = constructStripeWebhookEvent(body, signature);
  } catch {
    // Log a hint so the most common cause (stale stripe listen secret) is
    // immediately visible in the terminal without digging through Stripe logs.
    console.error(
      "[WEBHOOK] Signature verification failed.",
      "If running stripe listen locally, copy the signing secret it prints on",
      "startup into STRIPE_WEBHOOK_SECRET in .env and restart the dev server.",
    );
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Event handling is in its own try/catch. Returning 500 here is intentional:
  // it signals Stripe to retry delivery, which is the correct behaviour for
  // transient failures (DB down, downstream API error, etc.).
  try {
    await handleStripeWebhookEvent(event);
    return NextResponse.json({ received: true });
  } catch (err) {
    return handleServiceError(err);
  }
}
