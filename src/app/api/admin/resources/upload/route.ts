import { NextResponse } from "next/server";
import { after } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/rate-limit";
import { warmTargetedPublicCaches } from "@/services/performance/public-cache-warm.service";
import {
  ResourceUploadServiceError,
  uploadAdminResourceFile,
} from "@/services/resources/resource-upload.service";

// ── Route ─────────────────────────────────────────────────────────────────────

/**
 * POST /api/admin/resources/upload
 *
 * Accepts multipart/form-data with two fields:
 *   - resourceId  (string)  — the resource to attach the file to
 *   - file        (File)    — the uploaded file
 *
 * Persists the file via the storage abstraction and updates the Resource row
 * with fileKey, fileName, fileSize, mimeType.
 *
 * The previous fileKey (if any) is deleted via storage.delete() after the
 * DB update succeeds.
 *
 * Responses:
 *   200  { fileKey, fileName, fileSize }
 *   400  Missing fields / file too large / invalid key
 *   401  Not authenticated
 *   403  Not ADMIN
 *   404  Resource not found
 *   500  Unexpected server error
 */
export async function POST(req: Request) {
  try {
    // ── 0. Rate limit — 20 uploads / minute per IP ────────────────────────
    const ip = getClientIp(req);
    const rl = await checkRateLimit(LIMITS.upload, ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many upload requests. Please try again shortly." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit":     String(rl.limit),
            "X-RateLimit-Remaining": String(rl.remaining),
            "Retry-After":           String(Math.ceil((rl.reset - Date.now()) / 1000)),
          },
        }
      );
    }

    // ── 1. Require ADMIN session ──────────────────────────────────────────
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // ── 2. Parse multipart form data ─────────────────────────────────────
    const formData = await req.formData();
    const resourceId = formData.get("resourceId");
    const file = formData.get("file");

    const uploaded = await uploadAdminResourceFile({
      resourceId,
      file,
      adminUserId: session.user.id!,
    });
    after(() => {
      void warmTargetedPublicCaches({
        trigger: "admin_resource_upload",
        includeTrustSummaries: false,
        resourceIds: typeof resourceId === "string" ? [resourceId] : [],
      }).catch((error) => {
        console.error("[UPLOAD_POST_WARM]", error);
      });
    });

    return NextResponse.json(uploaded);
  } catch (err) {
    if (err instanceof ResourceUploadServiceError) {
      return NextResponse.json(err.payload, { status: err.status });
    }

    console.error("[UPLOAD_POST]", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
