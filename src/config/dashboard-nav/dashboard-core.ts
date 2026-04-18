import {
  ArrowDownToLine,
  CreditCard,
  Home,
  Library,
  ReceiptText,
  Settings,
} from "@/lib/icons";
import type { DashboardNavSection } from "@/components/layout/dashboard/dashboard-nav.types";
import { routes } from "@/lib/routes";

export const CORE_DASHBOARD_NAV_SECTIONS: DashboardNavSection[] = [
  {
    id: "learn",
    label: "Learn",
    items: [
      {
        href: routes.dashboard,
        label: "Home",
        icon: Home,
        exact: true,
      },
      {
        href: routes.dashboardLibrary,
        label: "Library",
        icon: Library,
      },
      {
        href: routes.dashboardDownloads,
        label: "Downloads",
        icon: ArrowDownToLine,
        exact: true,
      },
      {
        href: routes.dashboardPurchases,
        label: "Purchases",
        icon: ReceiptText,
        exact: true,
      },
    ],
  },
  {
    id: "account",
    label: "Account",
    items: [
      {
        href: routes.dashboardMembership,
        label: "Membership",
        icon: CreditCard,
        exact: true,
      },
      {
        href: routes.dashboardSettings,
        label: "Settings",
        icon: Settings,
        exact: true,
      },
    ],
  },
];
