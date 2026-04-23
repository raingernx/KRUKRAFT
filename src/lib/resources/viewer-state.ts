import type { ResourceCardData } from "@/design-system/product";
import type { RecommendationVariant } from "@/lib/recommendations/experiment";

export type ResourcesViewerScope = "base" | "discover";

export interface ResourcesViewerBaseState {
  authenticated: boolean;
  ownedResourceIds: string[];
}

export interface ResourcesViewerDiscoverState {
  recommendationVariant: RecommendationVariant | null;
  recommendedForYou: ResourceCardData[];
  becauseYouStudied: ResourceCardData[];
  recommendedForLevel: ResourceCardData[];
  recentStudyTitle: string | null;
  recentCategoryName: string | null;
  recentCategorySlug: string | null;
}
