import type { ResourceCardData } from "@/components/resources/ResourceCard";
import { PublicResourceCard } from "./PublicResourceCard";

function getResourcePreviewUrl(resource: ResourceCardData) {
  return resource.thumbnailUrl ?? resource.previewImages?.[0] ?? resource.previewUrl ?? null;
}

export function PublicResourceCardRow({
  resources,
  eagerCardCount = 0,
  eagerPreviewUrls = [],
  className = "grid gap-6 lg:gap-8 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]",
}: {
  resources: ResourceCardData[];
  eagerCardCount?: number;
  eagerPreviewUrls?: string[];
  className?: string;
}) {
  const eagerPreviewUrlSet = new Set(eagerPreviewUrls);

  return (
    <div className={className}>
      {resources.map((resource, index) => {
        const previewUrl = getResourcePreviewUrl(resource);
        const imageLoading =
          index < eagerCardCount ||
          (previewUrl !== null && eagerPreviewUrlSet.has(previewUrl))
            ? "eager"
            : undefined;

        return (
          <PublicResourceCard
            key={resource.id}
            resource={resource}
            imageLoading={imageLoading}
          />
        );
      })}
    </div>
  );
}
