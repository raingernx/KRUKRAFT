import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenSnapshot } from "@/lib/auth/token-snapshot";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthTokenSnapshot(req);

    return NextResponse.json(
      {
        data: {
          authenticated: auth.authenticated,
          user: auth.userId
            ? {
                id: auth.userId,
                name: auth.name,
                email: auth.email,
                image: auth.image,
              }
            : null,
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    console.error("[AUTH_VIEWER_GET]", error);
    return NextResponse.json(
      {
        data: {
          authenticated: false,
          user: null,
        },
      },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  }
}
