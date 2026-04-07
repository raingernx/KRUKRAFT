import { Suspense, type ReactNode } from "react";

import { DashboardGroupNavigationOverlay } from "@/components/providers/DashboardGroupNavigationOverlay";
import { DashboardGroupLoadingShell } from "@/components/skeletons/DashboardGroupLoadingShell";

import DashboardGroupLayoutContent from "./DashboardGroupLayoutContent";

export const dynamic = "force-dynamic";

interface DashboardGroupLayoutProps {
  children: ReactNode;
}

export default function DashboardGroupLayout({
  children,
}: DashboardGroupLayoutProps) {
  return (
    <>
      <DashboardGroupNavigationOverlay />
      <Suspense fallback={<DashboardGroupLoadingShell />}>
        <DashboardGroupLayoutContent>{children}</DashboardGroupLayoutContent>
      </Suspense>
    </>
  );
}
