import { NextResponse } from "next/server";
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
  }).catch((err) => console.error("[recommendation_click]", err));

  return NextResponse.json({ ok: true });
}
