"use client";

import type { MouseEvent, ReactNode } from "react";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";

interface HeroTrackedLinkProps {
  heroId?: string | null;
  experimentId?: string | null;
  variant?: string | null;
  href: string;
  className: string;
  children: ReactNode;
  resourcesNavigationMode?: "auto" | "discover" | "listing" | "detail" | null;
}

export function HeroTrackedLink({
  heroId,
  experimentId,
  variant,
  href,
  className,
  children,
  resourcesNavigationMode = "auto",
}: HeroTrackedLinkProps) {
  function handleClick(_event: MouseEvent<HTMLAnchorElement>) {
    if (!heroId) {
      return;
    }

    void fetch("/api/hero/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroId,
        experimentId: experimentId ?? null,
        variant: variant ?? null,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  return (
    <IntentPrefetchLink
      href={href}
      className={className}
      onClick={handleClick}
      prefetchMode="intent"
      prefetchScope="hero-cta"
      prefetchLimit={1}
      resourcesNavigationMode={resourcesNavigationMode ?? undefined}
    >
      {children}
    </IntentPrefetchLink>
  );
}
