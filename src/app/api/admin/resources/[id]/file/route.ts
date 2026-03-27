import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteResourceRedisKeys, getResourceCacheTag } from "@/lib/cache";
import { prisma } from "@/lib/prisma";

// DELETE /api/admin/resources/:id/file
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    // Require authenticated admin
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 },
      );
    }

    // Clear private upload fields for the resource (but leave external fileUrl untouched)
    const updated = await prisma.resource.update({
      where: { id },
      data: {
        fileKey: null,
        fileName: null,
        fileSize: null,
        mimeType: null,
      },
      select: { slug: true },
    });

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
