"use client";

import type { ReactNode } from "react";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";

interface CategoryBrowseCardLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

export function CategoryBrowseCardLink({
  href,
  className,
  children,
}: CategoryBrowseCardLinkProps) {
  return (
    <IntentPrefetchLink
      href={href}
      className={className}
      prefetchMode="viewport"
      prefetchScope="category-browse-card"
      prefetchLimit={4}
      resourcesNavigationMode="listing"
    >
      {children}
    </IntentPrefetchLink>
  );
}
