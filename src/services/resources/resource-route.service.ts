import { z } from "zod";
import {
  deleteResourceRouteRecord,
  findResourceById,
  findResourceRouteDetailById,
  incrementResourceViewCount,
  updateResourceRouteRecord,
} from "@/repositories/resources/resource.repository";

const previewMediaSchema = z.string().refine(
  (value) =>
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/"),
  {
    message:
      "Preview media must be a URL or uploaded image path (e.g. https://… or /uploads/…).",
  },
);

const UpdateResourceSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  isFree: z.boolean().optional(),
  price: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  categoryId: z.string().cuid().nullable().optional(),
  fileUrl: z.string().url().optional(),
  previewUrl: previewMediaSchema.nullable().optional(),
  previewUrls: z.array(previewMediaSchema).optional(),
});

export class ResourceRouteServiceError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super("Resource route service error");
    this.status = status;
    this.payload = payload;
  }
}

export async function getResourceRouteData(resourceId: string) {
  const resource = await findResourceRouteDetailById(resourceId);

  if (!resource) {
    throw new ResourceRouteServiceError(404, {
      error: "Resource not found.",
    });
  }

  void incrementResourceViewCount(resourceId).catch(() => {});

  return resource;
}

interface UpdateResourceRouteInput {
  resourceId: string;
  actorId: string;
  actorRole: string;
  loadBody: () => Promise<unknown>;
}

export async function updateResourceRoute(input: UpdateResourceRouteInput) {
  const resource = await findResourceById(input.resourceId);

  if (!resource) {
    throw new ResourceRouteServiceError(404, {
      error: "Resource not found.",
    });
  }

  const isOwner = resource.authorId === input.actorId;
  if (input.actorRole !== "ADMIN" && !isOwner) {
    throw new ResourceRouteServiceError(403, {
      error: "Forbidden.",
    });
  }

  const body = await input.loadBody();
  const parsed = UpdateResourceSchema.safeParse(body);
  if (!parsed.success) {
    throw new ResourceRouteServiceError(400, {
      error: parsed.error.errors[0].message,
    });
  }

  const normalizedPreviewUrls =
    parsed.data.previewUrls?.filter((url) => url.trim() !== "") ?? undefined;
  const nextPreviewUrl =
    normalizedPreviewUrls !== undefined
      ? parsed.data.previewUrl ?? normalizedPreviewUrls[0] ?? null
      : parsed.data.previewUrl;

  const updated = await updateResourceRouteRecord(input.resourceId, {
    ...(parsed.data.title !== undefined && { title: parsed.data.title }),
    ...(parsed.data.description !== undefined && {
      description: parsed.data.description,
    }),
    ...(parsed.data.status !== undefined && { status: parsed.data.status }),
    ...(parsed.data.isFree !== undefined && { isFree: parsed.data.isFree }),
    ...(parsed.data.price !== undefined && { price: parsed.data.price }),
    ...(parsed.data.featured !== undefined && { featured: parsed.data.featured }),
    ...(parsed.data.categoryId !== undefined && {
      categoryId: parsed.data.categoryId,
    }),
    ...(parsed.data.fileUrl !== undefined && { fileUrl: parsed.data.fileUrl }),
    ...(nextPreviewUrl !== undefined && { previewUrl: nextPreviewUrl }),
    ...(normalizedPreviewUrls !== undefined && {
      previewUrls: normalizedPreviewUrls,
    }),
  });

  return updated;
}

interface DeleteResourceRouteInput {
  resourceId: string;
  actorRole: string;
}

export async function deleteResourceRoute(input: DeleteResourceRouteInput) {
  const resource = await findResourceById(input.resourceId);

  if (!resource) {
    throw new ResourceRouteServiceError(404, {
      error: "Resource not found.",
    });
  }

  if (input.actorRole !== "ADMIN") {
    throw new ResourceRouteServiceError(403, {
      error: "Only admins can delete resources.",
    });
  }

  await deleteResourceRouteRecord(input.resourceId);

  return { deleted: true };
}
