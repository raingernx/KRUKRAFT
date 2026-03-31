import { NextResponse } from "next/server";
import { env } from "@/env";
import { hasValidInternalRouteSecret } from "@/lib/internal-route-auth";
import { findHotResourceSlugs } from "@/repositories/resources/resource.repository";

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

export async function GET(request: Request) {
  const secret = env.PERFORMANCE_WARM_SECRET?.trim();

  if (!secret) {
    return NextResponse.json(
      { error: "Warm secret is not configured." },
      { status: 503 },
    );
  }

  if (!hasValidInternalRouteSecret(request, secret)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const limitParam = parseInt(searchParams.get("limit") ?? "", 10);
  const limit = Number.isFinite(limitParam) && limitParam > 0
    ? Math.min(limitParam, MAX_LIMIT)
    : DEFAULT_LIMIT;

  try {
    const rows = await findHotResourceSlugs(limit);
    const slugs = rows.map((r) => r.slug);
    return NextResponse.json({ slugs });
  } catch (error) {
    console.error("[INTERNAL_HOT_SLUGS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch hot slugs." },
      { status: 500 },
    );
  }
}
