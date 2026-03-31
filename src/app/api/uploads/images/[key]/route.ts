import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { storage } from "@/lib/storage";

export const runtime = "nodejs";

const VALID_KEY_REGEX = /^[a-zA-Z0-9._-]+$/;

function getContentTypeFromKey(key: string) {
  const lower = key.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  if (!VALID_KEY_REGEX.test(key)) {
    return NextResponse.json({ error: "Invalid image key." }, { status: 400 });
  }

  if (env.r2Configured) {
    return NextResponse.redirect(storage.getUrl(key));
  }

  try {
    const filePath = storage.getUrl(key);
    const buffer = await readFile(filePath);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": getContentTypeFromKey(key),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[PUBLIC_UPLOAD_IMAGE_GET]", error);
    return NextResponse.json({ error: "Image not found." }, { status: 404 });
  }
}
