"use client";

import { useDashboardNavigationState } from "./dashboardNavigationState";

export function DashboardNavigationFeedback() {
  const navigationState = useDashboardNavigationState();

  if (!navigationState.href) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-1"
    >
      <div className="relative h-full overflow-hidden bg-brand-100/60">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-500 via-brand-600 to-brand-500" />
      </div>
    </div>
  );
}
