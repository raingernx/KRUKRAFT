import { logActivity } from "@/lib/activity";
import { revalidateTag } from "next/cache";
import { deleteResourceRedisKeys, getResourceCacheTag } from "@/lib/cache";
import { storage } from "@/lib/storage";
import {
  findResourceUploadTargetById,
  replaceResourceFileAndCreateVersion,
} from "@/repositories/resources/resource.repository";

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

export class ResourceUploadServiceError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super("Resource upload service error");
    this.status = status;
    this.payload = payload;
  }
}

interface UploadAdminResourceFileInput {
  resourceId: FormDataEntryValue | null;
  file: FormDataEntryValue | null;
  adminUserId: string;
}

export async function uploadAdminResourceFile(
  input: UploadAdminResourceFileInput,
) {
  if (typeof input.resourceId !== "string" || !input.resourceId) {
    throw new ResourceUploadServiceError(400, {
      error: "resourceId is required.",
    });
  }

  if (!(input.file instanceof File) || input.file.size === 0) {
    throw new ResourceUploadServiceError(400, {
      error: "file is required and must not be empty.",
    });
  }

  if (input.file.size > MAX_FILE_SIZE_BYTES) {
    throw new ResourceUploadServiceError(400, {
      error: `File too large. Maximum allowed size is ${
        MAX_FILE_SIZE_BYTES / (1024 * 1024)
      } MB.`,
    });
  }

  const mimeType = input.file.type || "application/octet-stream";
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new ResourceUploadServiceError(400, {
      error:
        "Unsupported format. Allowed: PDF, DOCX, XLSX, ZIP, and common image types.",
    });
  }

  const resource = await findResourceUploadTargetById(input.resourceId);
  if (!resource) {
    throw new ResourceUploadServiceError(404, {
      error: "Resource not found.",
    });
  }

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
    throw new ResourceUploadServiceError(400, {
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
    createdById: input.adminUserId,
  });

  if (resource.fileKey && resource.fileKey !== fileKey) {
    storage.delete(resource.fileKey).catch((err) => {
      console.warn("[UPLOAD] Could not remove old file:", resource.fileKey, err);
    });
  }

  await logActivity({
    userId: input.adminUserId,
    action: "file_uploaded",
    entityType: "resource",
    entityId: input.resourceId,
    meta: {
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
