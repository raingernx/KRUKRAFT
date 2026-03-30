import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getAdminActivityFeedData } from "@/services/admin-operations.service";

export async function GET() {
  try {
    const auth = await requireAdminApi();
    if (!auth.ok) return auth.res;

    const entries = await getAdminActivityFeedData(50);

    return NextResponse.json({ data: entries });
  } catch (err) {
    console.error("[ADMIN_ACTIVITY_GET]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
