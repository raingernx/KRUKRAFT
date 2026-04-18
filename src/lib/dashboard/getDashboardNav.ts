import type {
  DashboardNavSection,
} from "@/components/layout/dashboard/dashboard-nav.types";
import {
  ADMIN_CREATOR_ENTRYPOINT_SECTION,
  getLegacyCreatorNavSection,
  insertDashboardCreatorSection,
} from "@/config/dashboard-nav/creator-nav";
import { ADMIN_DASHBOARD_NAV_SECTIONS } from "@/config/dashboard-nav/admin-nav";
import { USER_DASHBOARD_NAV_SECTIONS } from "@/config/dashboard-nav/user-nav";
import {
  resolveDashboardNavState,
  type DashboardNavContext,
} from "./dashboard-permissions";

export function getDashboardNav({
  area,
  role,
  isCreator,
}: DashboardNavContext): DashboardNavSection[] {
  const { shellVariant, creatorNavMode } = resolveDashboardNavState({
    area,
    role,
    isCreator,
  });

  if (shellVariant === "admin") {
    return ADMIN_DASHBOARD_NAV_SECTIONS;
  }

  const baseSections = [...USER_DASHBOARD_NAV_SECTIONS];

  if (role === "ADMIN") {
    return insertDashboardCreatorSection(
      baseSections,
      ADMIN_CREATOR_ENTRYPOINT_SECTION,
    );
  }

  if (creatorNavMode === "hidden") {
    return baseSections;
  }

  return insertDashboardCreatorSection(
    baseSections,
    getLegacyCreatorNavSection(creatorNavMode),
  );
}
