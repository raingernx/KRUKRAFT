import { Store } from "@/lib/icons";
import type { DashboardNavSection } from "@/components/layout/dashboard/dashboard-nav.types";
import { CORE_DASHBOARD_NAV_SECTIONS } from "@/config/dashboard-nav/dashboard-core";
import { routes } from "@/lib/routes";

export const USER_DASHBOARD_NAV_SECTIONS: DashboardNavSection[] = [
  {
    ...CORE_DASHBOARD_NAV_SECTIONS[0],
    id: "dashboard",
    label: "Dashboard",
  },
  {
    id: "explore",
    label: "Explore",
    items: [
      {
        href: routes.marketplace,
        label: "Marketplace",
        icon: Store,
        exact: true,
      },
    ],
  },
  {
    ...CORE_DASHBOARD_NAV_SECTIONS[1],
  },
];
