import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import {
  getActiveUsersLast7Days,
  getTopViewedResources,
  getConversionFunnel,
} from "@/lib/analytics";

export async function GET() {
  try {
    const auth = await requireAdminApi();
    if (!auth.ok) return auth.res;

    const [activeUsers, topResources, funnel] = await Promise.all([
      getActiveUsersLast7Days(),
      getTopViewedResources(),
      getConversionFunnel(),
    ]);

    return NextResponse.json({
      activeUsers,
      topResources,
      funnel,
    });
  } catch (err) {
    console.error("[ADMIN_ANALYTICS_GET]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
