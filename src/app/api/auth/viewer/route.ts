import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenSnapshot } from "@/lib/auth/token-snapshot";
import { resolveDashboardNavState } from "@/lib/dashboard/dashboard-permissions";
import {
  canAccessCreatorWorkspace,
  getCreatorAccessState,
} from "@/services/creator";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthTokenSnapshot(req);
    const creatorAccess = auth.userId
      ? await getCreatorAccessState(auth.userId).catch(() => null)
      : null;
    const { creatorNavMode } = resolveDashboardNavState({
      area: "dashboard",
      role: auth.role,
      isCreator: canAccessCreatorWorkspace(creatorAccess),
    });

    return NextResponse.json(
      {
        data: {
          authenticated: auth.authenticated,
          creatorMenuMode: creatorNavMode,
          user: auth.userId
            ? {
                id: auth.userId,
                name: auth.name,
                email: auth.email,
                image: auth.image,
                role: auth.role,
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
          creatorMenuMode: "hidden",
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
