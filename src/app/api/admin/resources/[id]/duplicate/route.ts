import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  duplicateAdminResource,
  ResourceDuplicateServiceError,
} from "@/services/resources/resource-duplicate.service";

type Params = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }) };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 },
      ),
    };
  }

  return { session };
}

export async function POST(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    const admin = await requireAdmin();
    if ("error" in admin) {
      return admin.error;
    }

    const duplicated = await duplicateAdminResource({
      resourceId: id,
      adminUserId: admin.session.user.id,
    });

    return NextResponse.json({ data: duplicated });
  } catch (err) {
    if (err instanceof ResourceDuplicateServiceError) {
      return NextResponse.json(err.payload, { status: err.status });
    }

    console.error("[ADMIN_RESOURCE_DUPLICATE]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
