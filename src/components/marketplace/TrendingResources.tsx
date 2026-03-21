import { ResourceCard, type ResourceCardData } from "@/components/resources/ResourceCard";
import { RESOURCE_GRID_CLASSES } from "@/components/resources/ResourceGrid";

interface TrendingResourcesProps {
  resources: ResourceCardData[];
  ownedIds: string[];
}

export function TrendingResources({ resources, ownedIds }: TrendingResourcesProps) {
  if (!resources.length) return null;

  return (
    <section className="py-10">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-h3 font-semibold tracking-tight text-text-primary">
          Trending resources
        </h2>
      </div>
      <div className="grid gap-6 lg:gap-8 [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {resources.map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            variant="marketplace"
            owned={ownedIds.includes(resource.id)}
          />
        ))}
      </div>
    </section>
  );
}

