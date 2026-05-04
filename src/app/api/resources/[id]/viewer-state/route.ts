import { NextRequest, NextResponse } from "next/server";
import { getAuthTokenSnapshot } from "@/lib/auth/token-snapshot";
import type { ResourceDetailViewerScope } from "@/lib/resources/resource-detail-viewer-state";
import {
  isMissingTableError,
  isTransientPrismaInfrastructureError,
} from "@/lib/prismaErrors";
import {
  getResourceDetailViewerBaseState,
  getResourceDetailViewerReviewState,
} from "@/services/resources";

type Params = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-dynamic";

function getViewerScope(searchParams: URLSearchParams): ResourceDetailViewerScope {
  return searchParams.get("scope") === "review" ? "review" : "base";
}

export async function GET(req: NextRequest, { params }: Params) {
  const { searchParams } = new URL(req.url);
  const scope = getViewerScope(searchParams);

  try {
    const auth = await getAuthTokenSnapshot(req);
    const { id } = await params;
    const data =
      scope === "review"
        ? await getResourceDetailViewerReviewState({
            resourceId: id,
            userId: auth.userId,
          })
        : await getResourceDetailViewerBaseState({
            fresh: searchParams.get("fresh") === "1",
            resourceId: id,
            userId: auth.userId,
            subscriptionStatus: auth.subscriptionStatus,
          });

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
      console.warn("[RESOURCE_DETAIL_VIEWER_STATE_FALLBACK]", {
        scope,
        error:
          error instanceof Error
            ? { message: error.message, name: error.name }
            : String(error),
        fallbackApplied: true,
      });

      return NextResponse.json(
        {
          data:
            scope === "review"
              ? null
              : {
                  authenticated: false,
                  userId: null,
                  subscriptionStatus: null,
                  isOwned: false,
                },
        },
        {
          headers: {
            "Cache-Control": "private, no-store, max-age=0",
          },
        },
      );
    }

    console.error("[RESOURCE_DETAIL_VIEWER_STATE_GET]", error);
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
