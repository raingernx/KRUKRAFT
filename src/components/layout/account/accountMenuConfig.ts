import type { ComponentType } from "react";
import {
  BookOpen,
  CircleDollarSign,
  Home,
  Settings,
  ShoppingBag,
  Sparkles,
  FileText,
} from "@/lib/icons";
import { routes } from "@/lib/routes";

export type DashboardAccountCreatorMenuMode = "hidden" | "apply" | "full";

export interface DashboardAccountMenuItem {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

export const AUTHENTICATED_ACCOUNT_MENU_ACCOUNT_LINKS: readonly DashboardAccountMenuItem[] = [
  { href: routes.dashboard, label: "Dashboard home", icon: Home },
  { href: routes.dashboardPurchases, label: "Purchases", icon: ShoppingBag },
  { href: routes.dashboardSettings, label: "Settings", icon: Settings },
];

export const AUTHENTICATED_ACCOUNT_MENU_CREATOR_LINKS: readonly DashboardAccountMenuItem[] = [
  {
    href: routes.dashboardCreator,
    label: "Creator workspace",
    icon: Sparkles,
  },
  {
    href: routes.dashboardCreatorResources,
    label: "Creator resources",
    icon: FileText,
  },
  {
    href: routes.dashboardCreatorSales,
    label: "Creator earnings",
    icon: CircleDollarSign,
  },
];

export const AUTHENTICATED_ACCOUNT_MENU_CREATOR_APPLY_LINKS: readonly DashboardAccountMenuItem[] =
  [
    {
      href: routes.dashboardCreatorApply,
      label: "Become a creator",
      icon: Sparkles,
    },
  ];

export const LEGACY_DASHBOARD_AVATAR_MENU_LINKS: readonly DashboardAccountMenuItem[] = [
  { href: routes.dashboardLibrary, label: "My Library", icon: BookOpen },
  { href: routes.dashboardPurchases, label: "Purchases", icon: ShoppingBag },
  { href: routes.dashboardSettings, label: "Settings", icon: Settings },
];

export const PUBLIC_PROTECTED_AREA_PREFETCH_TARGETS = [
  routes.dashboard,
  routes.dashboardLibrary,
  routes.dashboardPurchases,
  routes.dashboardSettings,
  routes.dashboardMembership,
] as const;

export const LEGACY_DASHBOARD_AVATAR_MENU_PREFETCH_TARGETS =
  LEGACY_DASHBOARD_AVATAR_MENU_LINKS.map((item) => item.href);

export function getAuthenticatedAccountWarmTargets(
  creatorMenuMode: DashboardAccountCreatorMenuMode,
) {
  const targets: string[] = [
    routes.dashboard,
    routes.dashboardPurchases,
    routes.dashboardMembership,
    routes.dashboardSettings,
  ];

  if (creatorMenuMode === "apply") {
    targets.push(routes.dashboardCreatorApply);
  }

  if (creatorMenuMode === "full") {
    targets.push(
      routes.dashboardCreator,
      routes.dashboardCreatorResources,
      routes.dashboardCreatorSales,
      routes.dashboardCreatorProfile,
    );
  }

  return targets;
}
