"use client";

import { Skeleton } from "boneyard-js/react";
import { DashboardSettingsLoadingContent } from "@/components/dashboard/DashboardSettingsLoadingContent";
import { DashboardPageHeaderSkeleton } from "@/components/layout/dashboard/DashboardPageHeader";
import { DashboardPageStack } from "@/components/layout/dashboard/DashboardPageShell";
import { dashboardRuntimeShell } from "@/components/skeletons/dashboard-loading-contract";

const SETTINGS_PAGE_SKELETON_NAME = "settings-page";

export function SettingsPageSkeletonBonesPreview() {
  return (
    <Skeleton
      name={SETTINGS_PAGE_SKELETON_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <DashboardSettingsLoadingContent />
    </Skeleton>
  );
}

export function SettingsPageSkeleton() {
  return <DashboardSettingsLoadingContent />;
}

function SettingsRouteShellPreview() {
  return (
    <DashboardPageStack>
      <DashboardPageHeaderSkeleton titleWidth="w-32" descriptionWidth="w-72" />
    </DashboardPageStack>
  );
}

export function SettingsRouteShellSkeleton() {
  return dashboardRuntimeShell(
    <SettingsRouteShellPreview />,
    "dashboard-settings",
    { width: "narrow" },
  );
}
