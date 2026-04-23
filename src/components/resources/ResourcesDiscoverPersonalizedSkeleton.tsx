import { ResourceCardSkeleton } from "@/components/resources/ResourceCardSkeleton";
import { LoadingSkeleton } from "@/design-system";

function ResourcesSectionHeaderSkeleton({
  titleWidth,
  descriptionWidth,
  showsViewAll = false,
}: {
  titleWidth: string;
  descriptionWidth: string;
  showsViewAll?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <LoadingSkeleton className={`h-6 ${titleWidth}`} />
        <LoadingSkeleton className={`h-4 ${descriptionWidth}`} />
      </div>
      {showsViewAll ? <LoadingSkeleton className="h-6 w-16 rounded-full" /> : null}
    </div>
  );
}

function ResourceCardRowSkeleton({
  cardCount,
}: {
  cardCount: number;
}) {
  return (
    <div className="grid gap-6 lg:gap-8 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]">
      {Array.from({ length: cardCount }).map((_, index) => (
        <ResourceCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ResourcesDiscoverPersonalizedSkeleton({
  cardCount,
}: {
  cardCount: number;
}) {
  return (
    <div className="space-y-12">
      <section className="space-y-5">
        <ResourcesSectionHeaderSkeleton
          titleWidth="w-52"
          descriptionWidth="w-full max-w-2xl"
        />
        <ResourceCardRowSkeleton cardCount={cardCount} />
      </section>

      <section className="space-y-5">
        <ResourcesSectionHeaderSkeleton
          titleWidth="w-64"
          descriptionWidth="w-full max-w-xl"
          showsViewAll
        />
        <ResourceCardRowSkeleton cardCount={Math.max(3, Math.min(cardCount, 4))} />
      </section>

      <section className="space-y-5">
        <ResourcesSectionHeaderSkeleton
          titleWidth="w-48"
          descriptionWidth="w-full max-w-2xl"
        />
        <ResourceCardRowSkeleton cardCount={Math.max(3, Math.min(cardCount, 4))} />
      </section>
    </div>
  );
}
