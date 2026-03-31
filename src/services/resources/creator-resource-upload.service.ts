import { revalidateTag } from "next/cache";
import { logActivity } from "@/lib/activity";
import { deleteResourceRedisKeys, getResourceCacheTag } from "@/lib/cache";
import { storage } from "@/lib/storage";
import { findCreatorResourceById } from "@/repositories/creators/creator.repository";
import {
  clearAdminResourceFileById,
  replaceResourceFileAndCreateVersion,
} from "@/repositories/resources/resource.repository";
import {
  canAccessCreatorWorkspace,
  CreatorServiceError,
  getCreatorAccessState,
} from "@/services/creator.service";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024;

const ALLOWED_MIME_TYPES = new Set<string>([
  "application/pdf",
  "application/zip",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
]);

const FILE_KEY_REGEX = /^[a-zA-Z0-9._-]+$/;

export class CreatorResourceUploadServiceError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super("Creator resource upload service error");
    this.status = status;
    this.payload = payload;
  }
}

interface UploadCreatorResourceFileInput {
  resourceId: FormDataEntryValue | null;
  file: FormDataEntryValue | null;
  userId: string;
}

async function requireOwnedCreatorResource(userId: string, resourceId: string) {
  const access = await getCreatorAccessState(userId);

  if (!canAccessCreatorWorkspace(access)) {
    throw new CreatorServiceError(403, {
      error: "บัญชีนี้ยังไม่มีสิทธิ์ใช้งานพื้นที่ครีเอเตอร์",
    });
  }

  const resource = await findCreatorResourceById(userId, resourceId);
  if (!resource) {
    throw new CreatorResourceUploadServiceError(404, {
      error: "ไม่พบ resource ที่ต้องการอัปโหลดไฟล์",
    });
  }

  return resource;
}

export async function uploadCreatorResourceFile(
  input: UploadCreatorResourceFileInput,
) {
  if (typeof input.resourceId !== "string" || !input.resourceId) {
    throw new CreatorResourceUploadServiceError(400, {
      error: "resourceId is required.",
    });
  }

  if (!(input.file instanceof File) || input.file.size === 0) {
    throw new CreatorResourceUploadServiceError(400, {
      error: "file is required and must not be empty.",
    });
  }

  if (input.file.size > MAX_FILE_SIZE_BYTES) {
    throw new CreatorResourceUploadServiceError(400, {
      error: `File too large. Maximum allowed size is ${
        MAX_FILE_SIZE_BYTES / (1024 * 1024)
      } MB.`,
    });
  }

  const mimeType = input.file.type || "application/octet-stream";
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new CreatorResourceUploadServiceError(400, {
      error: "Unsupported format. Allowed: PDF, DOCX, XLSX, ZIP, and common image types.",
    });
  }

  const resource = await requireOwnedCreatorResource(input.userId, input.resourceId);

  const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const sanitizedName = input.file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 80);

  const fileKey = `${randomHex}-${sanitizedName}`;

  if (!FILE_KEY_REGEX.test(fileKey)) {
    throw new CreatorResourceUploadServiceError(400, {
      error: "Generated file key is invalid.",
    });
  }

  const buffer = Buffer.from(await input.file.arrayBuffer());
  await storage.upload(buffer, fileKey);

  const updated = await replaceResourceFileAndCreateVersion({
    resourceId: input.resourceId,
    fileKey,
    fileName: input.file.name,
    fileSize: input.file.size,
    mimeType,
    createdById: input.userId,
  });

  if (resource.fileKey && resource.fileKey !== fileKey) {
    storage.delete(resource.fileKey).catch((err) => {
      console.warn("[CREATOR_UPLOAD] Could not remove old file:", resource.fileKey, err);
    });
  }

  await logActivity({
    userId: input.userId,
    action: "creator_resource_file_uploaded",
    entity: "resource",
    entityId: input.resourceId,
    metadata: {
      fileName: updated.fileName ?? input.file.name,
      versioning: { createdVersion: true },
    },
  });

  revalidateTag(getResourceCacheTag(resource.slug), "max");
  await deleteResourceRedisKeys(resource.slug);

  return {
    fileKey: updated.fileKey,
    fileName: updated.fileName,
    fileSize: updated.fileSize,
  };
}

export async function clearCreatorResourceFile(userId: string, resourceId: string) {
  const resource = await requireOwnedCreatorResource(userId, resourceId);

  if (resource.fileKey) {
    await storage.delete(resource.fileKey).catch((err) => {
      console.warn("[CREATOR_UPLOAD_DELETE] Could not remove file:", resource.fileKey, err);
    });
  }

  const updated = await clearAdminResourceFileById(resourceId);

  await logActivity({
    userId,
    action: "creator_resource_file_removed",
    entity: "resource",
    entityId: resourceId,
    metadata: {
      fileName: resource.fileName ?? null,
    },
  });

  revalidateTag(getResourceCacheTag(updated.slug), "max");
  await deleteResourceRedisKeys(updated.slug);

  return updated;
}
