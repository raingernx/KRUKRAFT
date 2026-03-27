import { revalidateTag } from "next/cache";
import { deleteResourceRedisKeys, getResourceCacheTag } from "@/lib/cache";
import {
  findResourceById,
  rollbackResourceVersionRecord,
} from "@/repositories/resources/resource.repository";

export class ResourceVersionRollbackServiceError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super("Resource version rollback service error");
    this.status = status;
    this.payload = payload;
  }
}

interface RollbackResourceVersionInput {
  resourceId: string;
  versionId: string;
  adminUserId: string;
}

export async function rollbackResourceVersion(
  input: RollbackResourceVersionInput,
) {
  const result = await rollbackResourceVersionRecord({
    resourceId: input.resourceId,
    versionId: input.versionId,
    createdById: input.adminUserId ?? null,
  });

  if (!result) {
    throw new ResourceVersionRollbackServiceError(404, {
      error: "Version not found.",
    });
  }

  const resource = await findResourceById(input.resourceId);
  if (resource) {
    revalidateTag(getResourceCacheTag(resource.slug), "max");
    await deleteResourceRedisKeys(resource.slug);
  }

  return {
    id: result.newVersion.id,
    version: result.newVersion.version,
    fileName: result.newVersion.fileName,
    fileSize: result.newVersion.fileSize,
    mimeType: result.newVersion.mimeType,
    changelog: result.newVersion.changelog,
    createdAt: result.newVersion.createdAt,
  };
}
