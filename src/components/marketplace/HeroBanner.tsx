import { HeroImpressionTracker } from "@/components/marketplace/HeroImpressionTracker";
import { HeroTrackedLink } from "@/components/marketplace/HeroTrackedLink";
import {
  HeroSurface,
  HeroSurfaceSkeleton,
  type HeroSurfaceConfig,
} from "@/components/marketplace/HeroSurface";
import { cn } from "@/lib/utils";

export type HomepageHeroConfig = HeroSurfaceConfig | null;

/**
 * Hero section for the discover page. Uses config from DB when provided, else defaults.
 */
export function HeroBanner({
  config,
  className,
}: {
  config?: HomepageHeroConfig;
  className?: string;
}) {
  const hero = config ?? null;
  const heroId = hero?.heroId ?? null;
  const experimentId = hero?.experimentId ?? null;
  const variant = hero?.variant ?? null;

  return (
    <>
      <HeroImpressionTracker
        heroId={heroId}
        experimentId={experimentId}
        variant={variant}
      />
      <HeroSurface
        config={hero}
        className={className}
        renderPrimaryCta={({ href, label, className }) => (
          <HeroTrackedLink
            heroId={heroId}
            experimentId={experimentId}
            variant={variant}
            href={href}
            className={className}
            resourcesNavigationMode={null}
          >
            {label}
          </HeroTrackedLink>
        )}
        renderSecondaryCta={({ href, label, className }) => (
          <HeroTrackedLink
            heroId={heroId}
            experimentId={experimentId}
            variant={variant}
            href={href}
            className={className}
            resourcesNavigationMode={null}
          >
            {label}
          </HeroTrackedLink>
        )}
      />
    </>
  );
}

export function HeroBannerSkeleton({
  config,
  className,
}: {
  config?: HomepageHeroConfig;
  className?: string;
}) {
  return <HeroSurfaceSkeleton config={config} className={className} />;
}

export function HeroBannerFallback({
  className,
}: {
  className?: string;
}) {
  return <HeroSurfaceSkeleton className={cn("w-full", className)} />;
}
