import {
  MARKETPLACE_DEFAULT_PAGE,
  getCategoryLandingPageData,
  getRelatedResources,
  getMarketplaceResources,
  getResourceBySlug,
  getResourceDetailBodyContent,
  getResourceDetailFooterContent,
  getResourceDetailPurchaseMetaBySlug,
  getResourceMetadataBySlug,
  type MarketplaceFilters,
} from "./marketplace-resource-read.service";
import {
  createOwnedResource,
  getCachedNewResourcesInCategories,
  getCachedRecommendedResourcesByLevels,
  getDashboardOverviewRecommendations,
  getNewResourcesInCategories,
  getRecommendedResources,
  getRecommendedResourcesByLevels,
  listPublicResources,
  type ListPublicResourcesInput,
} from "../resource.service";

/**
 * Canonical public read surface for marketplace and user-facing resource flows.
 *
 * This keeps route/page owners from importing both legacy resource service
 * owners directly while leaving the underlying query implementations intact.
 */
export type { MarketplaceFilters, ListPublicResourcesInput };

export {
  MARKETPLACE_DEFAULT_PAGE,
  createOwnedResource,
  getCachedNewResourcesInCategories,
  getCachedRecommendedResourcesByLevels,
  getCategoryLandingPageData,
  getDashboardOverviewRecommendations,
  getMarketplaceResources,
  getNewResourcesInCategories,
  getRelatedResources,
  getRecommendedResources,
  getRecommendedResourcesByLevels,
  getResourceBySlug,
  getResourceDetailBodyContent,
  getResourceDetailFooterContent,
  getResourceDetailPurchaseMetaBySlug,
  getResourceMetadataBySlug,
  listPublicResources,
};
