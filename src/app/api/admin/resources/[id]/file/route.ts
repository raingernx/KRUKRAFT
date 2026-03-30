import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { deleteResourceRedisKeys, getResourceCacheTag } from "@/lib/cache";
import { clearAdminResourceFile } from "@/services/admin-operations.service";

// DELETE /api/admin/resources/:id/file
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const auth = await requireAdminApi();
    if (!auth.ok) return auth.res;

    // Clear private upload fields for the resource (but leave external fileUrl untouched)
    const updated = await clearAdminResourceFile(id);

    revalidateTag(getResourceCacheTag(updated.slug), "max");
    await deleteResourceRedisKeys(updated.slug);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_RESOURCE_FILE_DELETE]", error);

    return NextResponse.json(
      { error: "Failed to remove file" },
      { status: 500 },
    );
  }
}
