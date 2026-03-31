import { NextRequest, NextResponse } from "next/server";
import { getPlatform } from "@/services/platform.service";

export const dynamic = "force-dynamic";

const ASSET_KEYS = {
  "full-logo": "logoFullUrl",
  "icon-logo": "logoIconUrl",
  "og-logo": "logoOgUrl",
  "email-logo": "logoEmailUrl",
  favicon: "faviconUrl",
} as const;

type AssetKey = keyof typeof ASSET_KEYS;

function isAssetKey(value: string): value is AssetKey {
  return value in ASSET_KEYS;
}

function toAssetUrl(request: NextRequest, value: string) {
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }

  return new URL(value, request.url).toString();
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ asset: string }> },
) {
  const { asset } = await context.params;
  if (!isAssetKey(asset)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const platform = await getPlatform();
  const key = ASSET_KEYS[asset];
  const value = platform[key];

  if (!value) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.redirect(toAssetUrl(request, value), {
    status: 307,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
