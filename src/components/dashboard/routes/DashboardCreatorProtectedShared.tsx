import type { ReactNode } from "react";
import Link from "next/link";

import { Button, EmptyState } from "@/design-system";

export type DashboardProtectedRouteState =
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

export function getDashboardStatusBadgeVariant(
  tone: "success" | "warning" | "neutral",
) {
  if (tone === "success") return "success";
  if (tone === "warning") return "warning";
  return "neutral";
}

export function DashboardProtectedRouteEmptyState({
  state,
  retryHref,
  icon,
}: {
  state: DashboardProtectedRouteState;
  retryHref: string;
  icon: ReactNode;
}) {
  return (
    <EmptyState
      icon={icon}
      title={state.title}
      description={state.description}
      action={
        state.state === "locked" ? (
          <Button asChild size="sm">
            <Link href={state.ctaHref}>{state.ctaLabel}</Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant="quiet">
            <Link href={retryHref}>Retry</Link>
          </Button>
        )
      }
      className="border-border-subtle py-16"
    />
  );
}
