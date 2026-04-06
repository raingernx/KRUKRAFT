import type { ReactNode } from "react";
import { ResourcesLayoutShell } from "@/components/marketplace/ResourcesLayoutShell";
import { ResourcesNavigationOverlay } from "@/components/providers/ResourcesNavigationOverlay";

export default function ResourcesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ResourcesNavigationOverlay />
      <ResourcesLayoutShell>{children}</ResourcesLayoutShell>
    </>
  );
}
