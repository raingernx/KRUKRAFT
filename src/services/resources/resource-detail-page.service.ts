import {
  getResourceBySlug,
  getResourceDetailDeferredContent,
  getResourceMetadataBySlug,
} from "@/services/resource.service";
import {
  getResourceDetailExtras,
  getResourceDetailRelatedSection,
  getResourceDetailReviewSection,
  getResourceDetailTrustSummary,
} from "@/services/resources/resource.service";

/**
 * Canonical public resource-detail read surface.
 *
 * This keeps the route from reaching into multiple service owners directly,
 * while leaving the underlying query implementations unchanged for now.
 */
export async function getResourceDetailPageResource(slug: string) {
  return getResourceBySlug(slug);
}

export async function getResourceDetailPageMetadata(slug: string) {
  return getResourceMetadataBySlug(slug);
}

export async function getResourceDetailPageDeferredContent(slug: string) {
  return getResourceDetailDeferredContent(slug);
}

export async function getResourceDetailPageExtras(input: {
  resourceId: string;
  userId: string;
}) {
  return getResourceDetailExtras(input);
}

export async function getResourceDetailPageTrustSummary(input: {
  resourceId: string;
  resourceAverageRating: number | null;
  resourceSalesCount: number | null;
  resourceTotalReviews: number;
}) {
  return getResourceDetailTrustSummary(input);
}

export async function getResourceDetailPageRelatedSection(input: {
  resourceId: string;
  categoryId?: string | null;
  userId?: string;
  take?: number;
}) {
  return getResourceDetailRelatedSection(input);
}

export async function getResourceDetailPageReviewSection(input: {
  resourceId: string;
  userId?: string;
  isOwned: boolean;
  reviewTake?: number;
}) {
  return getResourceDetailReviewSection(input);
}
