import {
  BarChart2,
  CircleDollarSign,
  CircleUser,
  FileText,
  LayoutDashboard,
  Plus,
  ShoppingBag,
  Sparkles,
  Store,
} from "@/lib/icons";
import type {
  DashboardNavItem,
  DashboardNavSection,
} from "@/components/layout/dashboard/dashboard-nav.types";
import type { DashboardCreatorNavMode } from "@/lib/dashboard/dashboard-permissions";
import { routes } from "@/lib/routes";

const CREATOR_SECTION_ID = "creator";
const CREATOR_SECTION_LABEL = "Creator";

function createCreatorSection(items: DashboardNavItem[]): DashboardNavSection {
  return {
    id: CREATOR_SECTION_ID,
    label: CREATOR_SECTION_LABEL,
    items,
  };
}

const LEGACY_CREATOR_FULL_ITEMS: DashboardNavItem[] = [
  {
    href: routes.dashboardCreatorProfile,
    label: "Profile",
    icon: CircleUser,
  },
  {
    href: routes.dashboardCreator,
    label: "Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: routes.dashboardCreatorResources,
    label: "Resources",
    icon: FileText,
  },
  {
    href: routes.dashboardCreatorNewResource,
    label: "New Resource",
    icon: Plus,
  },
  {
    href: routes.dashboardCreatorSales,
    label: "Sales",
    icon: ShoppingBag,
  },
  {
    href: routes.dashboardCreatorAnalytics,
    label: "Analytics",
    icon: BarChart2,
  },
];

const LEGACY_CREATOR_APPLY_ITEMS: DashboardNavItem[] = [
  {
    href: routes.dashboardCreatorApply,
    label: "Become a Creator",
    icon: Sparkles,
  },
];

function getDashboardCreatorItems(
  creatorPublicHref: string | null | undefined,
): DashboardNavItem[] {
  return [
    {
      href: routes.dashboardCreator,
      label: "Workspace",
      icon: Sparkles,
      exact: true,
    },
    {
      href: routes.dashboardCreatorResources,
      label: "Resources",
      icon: FileText,
    },
    {
      href: routes.dashboardCreatorSales,
      label: "Earnings",
      icon: CircleDollarSign,
    },
    {
      href: creatorPublicHref ?? routes.dashboardCreatorProfile,
      label: "Storefront",
      icon: Store,
    },
  ];
}

export const ADMIN_CREATOR_ENTRYPOINT_SECTION: DashboardNavSection = {
  id: "creator-workspace",
  label: CREATOR_SECTION_LABEL,
  items: [
    {
      href: routes.dashboardCreator,
      label: "Creator Workspace",
      icon: Sparkles,
    },
  ],
};

export function getLegacyCreatorNavSection(
  creatorNavMode: Extract<DashboardCreatorNavMode, "apply" | "full">,
): DashboardNavSection {
  return creatorNavMode === "full"
    ? createCreatorSection(LEGACY_CREATOR_FULL_ITEMS)
    : createCreatorSection(LEGACY_CREATOR_APPLY_ITEMS);
}

export function getDashboardCreatorNavSection({
  creatorNavMode,
  creatorPublicHref,
}: {
  creatorNavMode: DashboardCreatorNavMode;
  creatorPublicHref?: string | null;
}): DashboardNavSection | null {
  if (creatorNavMode === "hidden") {
    return null;
  }

  if (creatorNavMode === "apply") {
    return createCreatorSection([
      {
        href: routes.dashboardCreatorApply,
        label: "Become a creator",
        icon: Sparkles,
      },
    ]);
  }

  return createCreatorSection(getDashboardCreatorItems(creatorPublicHref));
}

export function insertDashboardCreatorSection<T>(
  sections: readonly T[],
  creatorSection: T | null,
): T[] {
  if (!creatorSection) {
    return [...sections];
  }

  if (sections.length === 0) {
    return [creatorSection];
  }

  return [sections[0], creatorSection, ...sections.slice(1)];
}
