/**
 * /api/analytics/activity
 *
 * Lightweight endpoint for client-side fire-and-forget activity logging.
 * Used by client components that cannot call logActivity directly (e.g.
 * BuyButton, CheckoutSuccessTracker).
 *
 * Design:
 * - Accepts any `action` string and optional `metadata` object.
 * - Always returns 200 immediately — analytics must never disrupt a buyer flow.
 * - Associates the event with the current session user if present; anonymous
 *   events (unauthenticated) are also accepted and stored without a userId.
 */

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logActivity } from "@/lib/activity";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Always respond immediately regardless of what happens next.
  const respond = () => NextResponse.json({ ok: true });

  let action: string | undefined;
  let metadata: Record<string, unknown> | undefined;

  try {
    const body = await req.json();
    action = typeof body.action === "string" ? body.action : undefined;
    metadata =
      body.metadata && typeof body.metadata === "object"
        ? (body.metadata as Record<string, unknown>)
        : undefined;
  } catch {
    // Malformed JSON — still return 200; logging is best-effort.
    return respond();
  }

  if (!action) {
    return respond();
  }

  const session = await getServerSession(authOptions);
  const userId = session?.user?.id ?? null;

  void logActivity({
    userId,
    action,
    metadata: metadata ?? null,
    userAgent: req.headers.get("user-agent"),
  });

  return respond();
}
