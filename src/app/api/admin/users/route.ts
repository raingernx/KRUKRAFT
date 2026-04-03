import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getAdminUserLookupData } from "@/services/admin";

/**
 * GET /api/admin/users?q=
 * Search users by name or email. Returns id, name, email for dropdown/assign-owner use.
 */
export async function GET(req: NextRequest) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.res;

  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim() ?? "";

    const users = await getAdminUserLookupData({ query: q, take: 20 });

    return NextResponse.json({ data: users });
  } catch (err) {
    console.error("[ADMIN_USERS_GET]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
