import type { ReactNode } from "react";

import { DashboardPageHeader } from "@/components/layout/dashboard/DashboardPageHeader";

export type DashboardRouteIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  tone?: "info" | "featured" | "warning";
  action?: ReactNode;
};

export function DashboardRouteIntro({
  eyebrow,
  title,
  description,
  action,
}: DashboardRouteIntroProps) {
  return (
    <section className="border-b border-border-subtle pb-6">
      <DashboardPageHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={action}
      />
    </section>
  );
}
