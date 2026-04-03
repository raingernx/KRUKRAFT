import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getAdminResourceVersionsApiData } from "@/services/admin";

type Params = { params: Promise<{ id: string }> };

// GET /api/admin/resources/:id/versions
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireAdminApi();
    if (!auth.ok) return auth.res;

    const versions = await getAdminResourceVersionsApiData(id);
    if (!versions) {
      return NextResponse.json(
        { error: "Resource not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: versions });
  } catch (err) {
    console.error("[ADMIN_RESOURCE_VERSIONS_GET]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
