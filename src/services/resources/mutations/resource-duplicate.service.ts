import {
  createDuplicatedAdminResource,
  findResourceBySlug,
  findResourceDuplicateSourceById,
} from "@/repositories/resources/resource.repository";

export class ResourceDuplicateServiceError extends Error {
  status: number;
  payload: unknown;

  constructor(status: number, payload: unknown) {
    super("Resource duplicate service error");
    this.status = status;
    this.payload = payload;
  }
}

interface DuplicateAdminResourceInput {
  resourceId: string;
  adminUserId: string;
}

export async function duplicateAdminResource(
  input: DuplicateAdminResourceInput,
) {
  const existing = await findResourceDuplicateSourceById(input.resourceId);

  if (!existing) {
    throw new ResourceDuplicateServiceError(404, {
      error: "Resource not found.",
    });
  }

  const baseTitle = existing.title.endsWith(" (Copy)")
    ? existing.title
    : `${existing.title} (Copy)`;

  const baseSlug = `${existing.slug}-copy`;
  let candidate = baseSlug;
  let attempt = 0;

  while (true) {
    const conflict = await findResourceBySlug(candidate);
    if (!conflict) break;
    attempt += 1;
    candidate = `${baseSlug}-${attempt}`;
  }

  const previewUrls = existing.previews.map((preview) => preview.imageUrl);
  const firstPreviewUrl = previewUrls.length > 0 ? previewUrls[0] : null;
  const tagIds = existing.tags.map((tagLink) => tagLink.tagId);

  const duplicated = await createDuplicatedAdminResource({
    title: baseTitle,
    slug: candidate,
    description: existing.description,
    type: existing.type,
    isFree: existing.isFree,
    price: existing.price,
    fileUrl: existing.fileUrl,
    categoryId: existing.categoryId,
    featured: existing.featured,
    previewUrl: firstPreviewUrl,
    authorId: input.adminUserId,
    tagIds,
    previewUrls,
  });

  return { id: duplicated.id };
}
