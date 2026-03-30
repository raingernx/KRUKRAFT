import type { ReactNode } from "react";
import { ResourcesLayoutShell } from "@/components/marketplace/ResourcesLayoutShell";

export default function ResourcesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <ResourcesLayoutShell>{children}</ResourcesLayoutShell>;
}
