import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { env } from "@/env";
import { checkRateLimit, getClientIp, LIMITS } from "@/lib/rate-limit";
import { storage } from "@/lib/storage";
import {
  canAccessCreatorWorkspace,
  getCreatorAccessState,
} from "@/services/creator";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimit(LIMITS.upload, ip);
    if (!rl.success) {
      return NextResponse.json(
        { error: "มีคำขออัปโหลดมากเกินไป กรุณาลองใหม่อีกครั้งในอีกสักครู่" },
        { status: 429 },
      );
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบก่อนใช้งาน" }, { status: 401 });
    }

    const access = await getCreatorAccessState(session.user.id);
    if (!canAccessCreatorWorkspace(access)) {
      return NextResponse.json(
        { error: "บัญชีนี้ยังไม่มีสิทธิ์ใช้งานพื้นที่ครีเอเตอร์" },
        { status: 403 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "กรุณาเลือกรูปภาพที่ต้องการอัปโหลด" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `รูปภาพต้องมีขนาดไม่เกิน ${MAX_FILE_SIZE_BYTES / (1024 * 1024)} MB` },
        { status: 400 },
      );
    }

    const mimeType = file.type || "application/octet-stream";
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
      return NextResponse.json(
        { error: "รองรับเฉพาะไฟล์ JPG, PNG, WebP หรือ GIF" },
        { status: 400 },
      );
    }

    const ext = mimeType === "image/jpeg" ? "jpg" : mimeType.split("/")[1] || "png";
    const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const key = `creator-preview-${randomHex}.${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    await storage.upload(buffer, key, { contentType: mimeType });

    const url = env.r2Configured ? storage.getUrl(key) : `/api/uploads/images/${key}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error("[CREATOR_UPLOAD_IMAGE]", error);
    return NextResponse.json(
      { error: "อัปโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง" },
      { status: 500 },
    );
  }
}
