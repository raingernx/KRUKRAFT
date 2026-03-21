import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ResourceCard, type ResourceCardData } from "@/components/resources/ResourceCard";

interface ResourceSectionProps {
  title: string;
  viewAllHref?: string;
  resources: ResourceCardData[];
  ownedIds?: string[];
}

/**
 * Resource section used on the marketplace home page.
 * Uses the same auto-fill grid as the rest of the marketplace so cards
 * are wide on large screens instead of trapped in a fixed-width scroll strip.
 */
export function ResourceSection({
  title,
  viewAllHref,
  resources,
  ownedIds = [],
}: ResourceSectionProps) {
  if (resources.length === 0) return null;

  return (
    <section>
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-h3 font-semibold tracking-tight text-zinc-900">
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="group flex items-center gap-1 text-[13px] font-medium text-brand-600 transition hover:underline hover:text-brand-700"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {/* Auto-fill grid — cards fill available width, min 280px each */}
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
