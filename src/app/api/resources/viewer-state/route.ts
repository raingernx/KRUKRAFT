import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenSnapshot } from "@/lib/auth/token-snapshot";
import type { ResourcesViewerScope } from "@/lib/resources/viewer-state";
import {
  isMissingTableError,
  isTransientPrismaInfrastructureError,
} from "@/lib/prismaErrors";
import {
  getResourcesViewerBaseState,
  getResourcesViewerDiscoverState,
} from "@/services/resources";

export const dynamic = "force-dynamic";

function getViewerScope(searchParams: URLSearchParams): ResourcesViewerScope {
  const scope = searchParams.get("scope");
  if (scope === "discover") {
    return "discover";
  }

  // Backward-compatible fallback for older callers still passing `mode=discover`.
  return searchParams.get("mode") === "discover" ? "discover" : "base";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scope = getViewerScope(searchParams);

  try {
    const auth = await getAuthTokenSnapshot(req);
    const data =
      scope === "discover"
        ? await getResourcesViewerDiscoverState({ userId: auth.userId })
        : await getResourcesViewerBaseState({ userId: auth.userId });

    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  } catch (error) {
    if (
      isMissingTableError(error) ||
      isTransientPrismaInfrastructureError(error)
    ) {
      console.warn("[RESOURCES_VIEWER_STATE_FALLBACK]", {
        scope,
        error:
          error instanceof Error
            ? { message: error.message, name: error.name }
            : String(error),
        fallbackApplied: true,
      });

      return NextResponse.json(
        { data: scope === "discover" ? null : { authenticated: false, ownedResourceIds: [] } },
        {
          headers: {
            "Cache-Control": "private, no-store, max-age=0",
          },
        },
      );
    }

    console.error("[RESOURCES_VIEWER_STATE_GET]", error);
    return NextResponse.json(
      { error: "Internal server error." },
      {
        status: 500,
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      },
    );
  }
}
