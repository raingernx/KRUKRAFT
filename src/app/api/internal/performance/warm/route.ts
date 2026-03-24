import { NextResponse } from "next/server";
import { logPerformanceEvent, withPerformanceTiming } from "@/lib/performance/observability";
import { warmPublicCaches } from "@/services/performance/public-cache-warm.service";

function isAuthorized(request: Request, secret: string) {
  const bearer = request.headers.get("authorization");
  const headerSecret = request.headers.get("x-warm-secret");

  return bearer === `Bearer ${secret}` || headerSecret === secret;
}

export async function POST(request: Request) {
  const secret = process.env.PERFORMANCE_WARM_SECRET?.trim();

  if (!secret) {
    return NextResponse.json(
      { error: "Performance warm secret is not configured." },
      { status: 503 },
    );
  }

  if (!isAuthorized(request, secret)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    return await withPerformanceTiming(
      "internal_performance_warm_endpoint",
      { trigger: "internal_endpoint" },
      async () => {
        const result = await warmPublicCaches({ trigger: "internal_endpoint" });
        return NextResponse.json({ data: result });
      },
    );
  } catch (error) {
    logPerformanceEvent("internal_performance_warm_endpoint:error", {
      trigger: "internal_endpoint",
    });
    console.error("[INTERNAL_PERFORMANCE_WARM_POST]", error);
    return NextResponse.json(
      { error: "Failed to warm public caches." },
      { status: 500 },
    );
  }
}
