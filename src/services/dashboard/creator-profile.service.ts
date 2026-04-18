import { routes } from "@/lib/routes";
import {
  canAccessCreatorWorkspace,
  getCreatorAccessState,
  getCreatorProfile,
  type CreatorProfile,
} from "@/services/creator";

export type DashboardCreatorProfileData =
  | {
      state: "ready";
      profile: CreatorProfile;
    }
  | {
      state: "locked";
      title: string;
      description: string;
      ctaHref: string;
      ctaLabel: string;
    }
  | {
      state: "error";
      title: string;
      description: string;
    };

export async function getDashboardCreatorProfileData(
  userId: string,
): Promise<DashboardCreatorProfileData> {
  try {
    const access = await getCreatorAccessState(userId);

    if (!canAccessCreatorWorkspace(access)) {
      return {
        state: "locked",
        title: "Creator access is not active",
        description:
          "Apply for creator access before editing your storefront identity and public profile.",
        ctaHref: routes.dashboardCreatorApply,
        ctaLabel: "Apply for creator access",
      };
    }

    const profile = await getCreatorProfile(userId);

    if (!profile) {
      return {
        state: "error",
        title: "Could not load creator profile",
        description:
          "Refresh this route to retry. Your profile fields stay protected behind the dashboard session gate.",
      };
    }

    return {
      state: "ready",
      profile,
    };
  } catch {
    return {
      state: "error",
      title: "Could not load creator profile",
      description:
        "Refresh this route to retry. Your profile fields stay protected behind the dashboard session gate.",
    };
  }
}
