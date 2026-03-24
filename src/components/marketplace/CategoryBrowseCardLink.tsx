"use client";

import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import { beginResourcesNavigation } from "@/components/marketplace/resourcesNavigationState";

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
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    beginResourcesNavigation("listing", href);
  }

  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
