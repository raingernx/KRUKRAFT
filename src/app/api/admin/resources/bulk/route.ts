import { NextResponse } from "next/server";
import { after } from "next/server";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { authOptions } from "@/lib/auth";
import {
  CACHE_TAGS,
  deleteDiscoverRedisKeys,
  deleteRelatedResourcesRedisKeys,
  deleteResourceRedisKeys,
  getResourceCacheTag,
} from "@/lib/cache";
import { warmTargetedPublicCaches } from "@/services/performance/public-cache-warm.service";
import {
  createAdminResourcesInBulk,
  getAdminResourcePublicCacheTargets,
  mutateAdminResourcesInBulk,
  ResourceServiceError,
} from "@/services/resources/resource.service";

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

export async function POST(req: Request) {
  try {
    const { session, error } = await requireAdmin();
    if (error) return error;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const result = await createAdminResourcesInBulk(await req.json(), session.user.id);

    if (result.data.success > 0) {
      revalidateTag(CACHE_TAGS.discover, "max");
      revalidateTag(CACHE_TAGS.creatorPublic, "max");
      await deleteDiscoverRedisKeys();
      after(() => {
        void warmTargetedPublicCaches({
          trigger: "admin_resource_bulk_create",
          includeListings: true,
        }).catch((error) => {
          console.error("[ADMIN_RESOURCES_BULK_POST_WARM]", error);
        });
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    return handleServiceError(err, "[ADMIN_RESOURCES_BULK_POST]");
  }
}

export async function PATCH(req: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = await req.json();
    const targetIds = Array.isArray((body as { ids?: unknown })?.ids)
      ? ((body as { ids: unknown[] }).ids.filter(
          (value): value is string => typeof value === "string",
        ))
      : [];
    const action =
      typeof (body as { action?: unknown })?.action === "string"
        ? (body as { action: string }).action
        : null;
    const cacheTargets = await getAdminResourcePublicCacheTargets(targetIds);
    const result = await mutateAdminResourcesInBulk(body);

    if (result.data.updated > 0 || result.data.deleted > 0) {
      revalidateTag(CACHE_TAGS.discover, "max");
      revalidateTag(CACHE_TAGS.creatorPublic, "max");
      cacheTargets.forEach((target) => {
        revalidateTag(getResourceCacheTag(target.slug), "max");
      });
      await Promise.all([
        deleteDiscoverRedisKeys(),
        ...cacheTargets.map((target) =>
          Promise.all([
            deleteRelatedResourcesRedisKeys(target.id, [target.categoryId]),
            deleteResourceRedisKeys(target.slug),
          ]),
        ),
      ]);
      after(() => {
        void warmTargetedPublicCaches({
          trigger: "admin_resource_bulk_patch",
          includeListings: true,
          resourceTargets:
            action === "publish" || action === "moveToCategory"
              ? cacheTargets.map((target) => ({ id: target.id, slug: target.slug }))
              : [],
        }).catch((error) => {
          console.error("[ADMIN_RESOURCES_BULK_PATCH_WARM]", error);
        });
      });
    }

    return NextResponse.json(result);
  } catch (err) {
    return handleServiceError(err, "[ADMIN_RESOURCES_BULK_PATCH]");
  }
}
