import { NextResponse } from "next/server";
import { after } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import { CACHE_TAGS, getResourceCacheTag } from "@/lib/cache";
import { warmTargetedPublicCaches } from "@/services/performance/public-cache-warm.service";
import {
  ResourceServiceError,
  trashAdminResource,
  updateAdminResource,
} from "@/services/resources/resource.service";

type Params = { params: Promise<{ id: string }> };

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      session: null,
      error: NextResponse.json(
        { error: "Forbidden. Admin access required." },
        { status: 403 },
      ),
    };
  }

  return { session, error: undefined as NextResponse | undefined };
}

function handleServiceError(err: unknown, label: string) {
  if (err instanceof ResourceServiceError) {
    return NextResponse.json(err.payload, { status: err.status });
  }

  console.error(label, err);
  return NextResponse.json(
    { error: "Internal server error." },
    { status: 500 },
  );
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { session, error } = await requireAdmin();

    if (error) return error;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const result = await updateAdminResource(id, await req.json(), session.user.id);
    revalidateTag(CACHE_TAGS.discover, "max");
    revalidateTag(CACHE_TAGS.creatorPublic, "max");
    revalidateTag(getResourceCacheTag(result.data.slug), "max");
    after(() => {
      void warmTargetedPublicCaches({
        trigger: "admin_resource_update",
        includeListings: true,
        resourceTargets:
          result.data.status === "PUBLISHED"
            ? [{ id: result.data.id, slug: result.data.slug }]
            : [],
        creatorIdentifiers: [result.data.authorId],
      }).catch((error) => {
        console.error("[ADMIN_RESOURCES_PATCH_WARM]", error);
      });
    });

    return NextResponse.json(result);
  } catch (err) {
    return handleServiceError(err, "[ADMIN_RESOURCES_PATCH]");
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const { session, error } = await requireAdmin();

    if (error) return error;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const result = await trashAdminResource(id, session.user.id);
    revalidateTag(CACHE_TAGS.discover, "max");
    revalidateTag(CACHE_TAGS.creatorPublic, "max");
    after(() => {
      void warmTargetedPublicCaches({
        trigger: "admin_resource_trash",
        includeListings: true,
      }).catch((error) => {
        console.error("[ADMIN_RESOURCES_DELETE_WARM]", error);
      });
    });

    return NextResponse.json(result);
  } catch (err) {
    return handleServiceError(err, "[ADMIN_RESOURCES_DELETE]");
  }
}
