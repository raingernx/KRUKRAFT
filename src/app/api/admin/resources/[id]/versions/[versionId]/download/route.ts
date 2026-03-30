import { NextResponse } from "next/server";

import { requireAdminApi } from "@/lib/auth/require-admin-api";
import { getAdminResourceVersionDownloadData } from "@/services/admin-operations.service";
import { createReadStream, existsSync } from "fs";
import { stat } from "fs/promises";
import path from "path";

type Params = { params: Promise<{ id: string; versionId: string }> };

const UPLOAD_DIR = path.join(process.cwd(), "private-uploads");

// GET /api/admin/resources/:id/versions/:versionId/download
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id, versionId } = await params;
    const auth = await requireAdminApi();
    if (!auth.ok) return auth.res;

    const version = await getAdminResourceVersionDownloadData(id, versionId);

    if (!version) {
      return NextResponse.json(
        { error: "Version not found." },
        { status: 404 },
      );
    }

    if (!version.fileKey && !version.fileUrl) {
      return NextResponse.json(
        { error: "No file associated with this version." },
        { status: 404 },
      );
    }

    if (version.fileKey) {
      const filePath = path.join(UPLOAD_DIR, version.fileKey);

      if (!filePath.startsWith(UPLOAD_DIR + path.sep)) {
        return NextResponse.json(
          { error: "Invalid file reference." },
          { status: 400 },
        );
      }

      if (!existsSync(filePath)) {
        return NextResponse.json(
          { error: "File not found on disk." },
          { status: 404 },
        );
      }

      const fileStats = await stat(filePath);
      const contentType = version.mimeType ?? "application/octet-stream";
      const downloadName = version.fileName ?? version.fileKey;

      const nodeStream = createReadStream(filePath);
      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on("data", (chunk: Buffer | string) => {
            controller.enqueue(
              typeof chunk === "string" ? Buffer.from(chunk) : chunk,
            );
          });
          nodeStream.on("end", () => controller.close());
          nodeStream.on("error", (err) => controller.error(err));
        },
        cancel() {
          nodeStream.destroy();
        },
      });

      const safeFilename = downloadName.replace(/[^\w.\-]/g, "_");

      return new Response(webStream, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${safeFilename}"`,
          "Content-Length": String(fileStats.size),
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // For now, do not support external URLs on version history for admin download.
    return NextResponse.json(
      { error: "External fileUrl is not supported for version download." },
      { status: 400 },
    );
  } catch (err) {
    console.error("[ADMIN_RESOURCE_VERSION_DOWNLOAD_GET]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
