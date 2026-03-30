import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getRecommendationReport } from "@/services/analytics/recommendation-report.service";

export async function GET(req: NextRequest) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.res;

  const { searchParams } = req.nextUrl;
  const start = searchParams.get("start") ?? undefined;
  const end   = searchParams.get("end")   ?? undefined;

  const report = await getRecommendationReport({ start, end });
  return NextResponse.json(report);
}
