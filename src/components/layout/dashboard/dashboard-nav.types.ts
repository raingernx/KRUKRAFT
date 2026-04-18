import type { AppIcon } from "@/lib/icons";

export type DashboardShellVariant = "user" | "creator" | "admin";

export interface DashboardNavItem {
  href: string;
  label: string;
  icon?: AppIcon;
  exact?: boolean;
  badge?: string | number;
}

export interface DashboardNavSection {
  id: string;
  label: string;
  items: DashboardNavItem[];
}
