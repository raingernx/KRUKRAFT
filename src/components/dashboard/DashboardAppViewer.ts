import type { DashboardCreatorNavMode } from "@/lib/dashboard/dashboard-permissions";

export interface DashboardAppViewer {
  displayName: string;
  email: string | null;
  image: string | null;
  creatorPublicHref: string | null;
  creatorNavMode: DashboardCreatorNavMode;
  role: string | null;
  subscriptionStatus: string | null;
  isAuthenticated: boolean;
}
