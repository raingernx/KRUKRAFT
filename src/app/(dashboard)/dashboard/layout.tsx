import type { ReactNode } from "react";
import type { Metadata } from "next";

import { DashboardAppShell } from "@/components/dashboard/DashboardAppShell";

export const metadata: Metadata = {
  title: {
    default: "Dashboard | Krukraft",
    template: "%s | Dashboard | Krukraft",
  },
};

export default function DashboardRouteLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <DashboardAppShell>{children}</DashboardAppShell>;
}
