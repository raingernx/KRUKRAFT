import { NextResponse } from "next/server";
import { after } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { warmTargetedPublicCaches } from "@/services/performance/public-cache-warm.service";
import {
  permanentlyDeleteTrashedResource,
  ResourceTrashServiceError,
  restoreTrashedResource,
} from "@/services/resources/resource-trash.service";

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

// PATCH /api/admin/resources/[id]/trash  → restore from trash
export async function PATCH(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const admin = await requireAdmin();
    if ("error" in admin) {
      return admin.error;
    }

    const restored = await restoreTrashedResource({
      resourceId: id,
      adminUserId: admin.session.user.id,
    });
    if (restored.status === "PUBLISHED") {
      after(() => {
        void warmTargetedPublicCaches({
          trigger: "admin_resource_restore",
          includeListings: true,
          resourceTargets: [{ id: restored.id, slug: restored.slug }],
          creatorIdentifiers: [restored.authorId],
        }).catch((error) => {
          console.error("[ADMIN_RESOURCE_TRASH_PATCH_WARM]", error);
        });
      });
    }

    return NextResponse.json({ data: restored });
  } catch (err) {
    if (err instanceof ResourceTrashServiceError) {
      return NextResponse.json(err.payload, { status: err.status });
    }

    console.error("[ADMIN_RESOURCE_TRASH_PATCH]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}

// DELETE /api/admin/resources/[id]/trash  → hard delete (only for trashed items)
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const admin = await requireAdmin();
    if ("error" in admin) {
      return admin.error;
    }

    const deleted = await permanentlyDeleteTrashedResource({
      resourceId: id,
      adminUserId: admin.session.user.id,
    });
    after(() => {
      void warmTargetedPublicCaches({
        trigger: "admin_resource_delete_permanent",
        includeListings: true,
      }).catch((error) => {
        console.error("[ADMIN_RESOURCE_TRASH_DELETE_WARM]", error);
      });
    });

    return NextResponse.json({
      data: deleted,
    });
  } catch (err) {
    if (err instanceof ResourceTrashServiceError) {
      return NextResponse.json(err.payload, { status: err.status });
    }

    console.error("[ADMIN_RESOURCE_TRASH_DELETE]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
