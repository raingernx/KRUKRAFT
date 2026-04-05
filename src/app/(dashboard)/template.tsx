import type { ReactNode } from "react";

import { DashboardNavigationReady } from "@/components/layout/dashboard/DashboardNavigationReady";

export default function DashboardGroupTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <DashboardNavigationReady />
      {children}
    </>
  );
}
