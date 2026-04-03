import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getAdminAuditApiData } from "@/services/admin";

const MAX_PAGE_SIZE = 50;

export async function GET(req: Request) {
  try {
    const auth = await requireAdminApi();
    if (!auth.ok) return auth.res;

    const url = new URL(req.url);
    const search = url.searchParams;

    const page = Math.max(1, parseInt(search.get("page") ?? "1", 10) || 1);
    const pageSizeRaw =
      parseInt(search.get("pageSize") ?? "20", 10) || 20;
    const pageSize = Math.min(Math.max(1, pageSizeRaw), MAX_PAGE_SIZE);

    const actionFilter = search.get("action") || undefined;
    const adminIdFilter = search.get("adminId") || undefined;
    const from = search.get("from");
    const to = search.get("to");

    const data = await getAdminAuditApiData({
      page,
      pageSize,
      actionFilter,
      adminIdFilter,
      from,
      to,
    });

    return NextResponse.json({
      data,
    });
  } catch (err) {
    console.error("[ADMIN_AUDIT_GET]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
