import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { PaymentServiceError } from "@/services/payments/payment.service";
import { claimFreeResource } from "@/services/payments/checkout.service";

/**
 * POST /api/checkout/free
 *
 * Claims a free resource for the authenticated user. Creates a Purchase record
 * with status = COMPLETED and paymentProvider = "FREE".
 *
 * Idempotent: safe to call multiple times for the same user + resource.
 *
 * Request body:
 *   { resourceId: string }
 *
 * Responses:
 *   200  { success: true }
 *   400  Validation error, or resource is not free
 *   401  Not authenticated
 *   404  Resource not found / not published
 *   500  Unexpected server error
 */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "You must be signed in to claim this resource." },
        { status: 401 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const result = await claimFreeResource(body, session.user.id);

    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof PaymentServiceError) {
      return NextResponse.json(err.payload, { status: err.status });
    }

    console.error("[CHECKOUT_FREE]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
