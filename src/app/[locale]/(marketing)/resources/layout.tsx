import type { ReactNode } from "react";
import { ResourcesLayoutShell } from "@/components/marketplace/ResourcesLayoutShell";

export default function LocaleResourcesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ResourcesLayoutShell>{children}</ResourcesLayoutShell>;
}
