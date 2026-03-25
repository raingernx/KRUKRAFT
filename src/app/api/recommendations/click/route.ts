import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/rate-limit";
import { recordAnalyticsEvent } from "@/analytics/event.service";

const ClickSchema = z.object({
  resourceId: z.string().min(1),
  experiment: z.string().min(1),
  variant:    z.string().min(1),
  section:    z.string().min(1),
});

function isRecommendationClickTransientDbError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2024"
  ) {
    return true;
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Timed out fetching a new connection from the connection pool") ||
    message.includes("Can't reach database server") ||
    message.includes("Error in PostgreSQL connection") ||
    message.includes("kind: Closed")
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimit(LIMITS.recommendationAnalytics, ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit":     String(rl.limit),
            "X-RateLimit-Remaining": String(rl.remaining),
            "Retry-After":           String(Math.ceil((rl.reset - Date.now()) / 1000)),
          },
        },
      );
    }
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = ClickSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed." }, { status: 400 });
  }

  const session = await getServerSession(authOptions);

  // Fire-and-forget — client does not wait for this write to complete.
  void recordAnalyticsEvent({
    eventType:  "RESOURCE_VIEW",
    userId:     session?.user?.id ?? null,
    resourceId: parsed.data.resourceId,
    metadata: {
      source:     "recommendation_click",
      experiment: parsed.data.experiment,
      variant:    parsed.data.variant,
      section:    parsed.data.section,
    },
  }).catch((error) => {
    if (isRecommendationClickTransientDbError(error)) {
      console.warn("[RECOMMENDATION_CLICK_BEST_EFFORT]", {
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : undefined,
      });
      return;
    }

    console.error("[recommendation_click]", error);
  });

  return NextResponse.json({ ok: true });
}
