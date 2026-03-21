import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/rate-limit";
import { PaymentServiceError } from "@/services/payments/payment.service";
import { createCheckoutSession } from "@/services/payments/checkout.service";

/**
 * POST /api/checkout/session
 *
 * Creates a paid checkout session with the specified provider and returns a
 * redirect URL to the provider's hosted checkout page.
 *
 * Purchase completion is NOT performed here. It happens exclusively via the
 * provider's webhook after payment is confirmed server-side.
 *
 * Request body:
 *   { provider: "stripe" | "xendit", resourceId: string }
 *
 * Responses:
 *   200  { data: { url: string } }
 *   400  Validation error, or resource is free / not found
 *   401  Not authenticated
 *   409  Resource already owned
 *   429  Rate limit exceeded
 *   500  Unexpected server error
 */
export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimit(LIMITS.checkout, ip);

    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many checkout requests. Please try again shortly." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rl.limit),
            "X-RateLimit-Remaining": String(rl.remaining),
            "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)),
          },
        },
      );
    }

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be logged in to purchase." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const result = await createCheckoutSession(body, session.user.id);

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof PaymentServiceError) {
      return NextResponse.json(err.payload, { status: err.status });
    }

    console.error("[CHECKOUT_SESSION]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
