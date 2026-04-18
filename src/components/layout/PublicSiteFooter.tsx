"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { routes } from "@/lib/routes";

type Props = { children: ReactNode };

/**
 * Renders the website footer only on public routes. Admin pages (/…/admin/…)
 * dashboard pages, and dev-only review canvases do not show the footer so
 * app shells stay focused on their own navigation chrome.
 */
export function PublicSiteFooter({ children }: Props) {
  const pathname = usePathname();

  if (
    pathname?.startsWith("/dev") ||
    pathname?.startsWith(routes.admin) ||
    pathname?.startsWith(routes.dashboard)
  ) {
    return null;
  }

  return <>{children}</>;
}
