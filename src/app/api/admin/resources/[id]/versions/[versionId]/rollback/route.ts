import { NextResponse } from "next/server";
import { after } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { warmTargetedPublicCaches } from "@/services/performance/public-cache-warm.service";
import {
  rollbackResourceVersion,
  ResourceVersionRollbackServiceError,
} from "@/services/resources/resource-version-rollback.service";

type Params = { params: Promise<{ id: string; versionId: string }> };

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

// POST /api/admin/resources/:id/versions/:versionId/rollback
export async function POST(_req: Request, { params }: Params) {
  try {
    const admin = await requireAdmin();
    if ("error" in admin) {
      return admin.error;
    }

    const { id: resourceId, versionId } = await params;

    const rolledBack = await rollbackResourceVersion({
      resourceId,
      versionId,
      adminUserId: admin.session.user.id,
    });
    after(() => {
      void warmTargetedPublicCaches({
        trigger: "admin_resource_version_rollback",
        includeTrustSummaries: false,
        resourceIds: [resourceId],
      }).catch((error) => {
        console.error("[ADMIN_RESOURCE_VERSION_ROLLBACK_WARM]", error);
      });
    });

    return NextResponse.json({
      data: rolledBack,
    });
  } catch (err) {
    if (err instanceof ResourceVersionRollbackServiceError) {
      return NextResponse.json(err.payload, { status: err.status });
    }

    console.error("[ADMIN_RESOURCE_VERSION_ROLLBACK_POST]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
