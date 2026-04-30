import type { ComponentType } from "react";

import { ArrowDownToLine, CircleDollarSign, FileText } from "@/lib/icons";
import { Card, CardContent } from "@/design-system";
import type { DashboardCreatorStatItem } from "@/services/dashboard/creator-overview.service";
import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  accentClassName?: string;
  iconClassName?: string;
};

const creatorStats: Stat[] = [
  {
    label: "Revenue",
    value: "$1,248",
    detail: "+12.4% over 30 days",
    icon: CircleDollarSign,
    accentClassName: "border-[hsl(var(--primary)/0.24)]",
    iconClassName:
      "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]",
  },
  {
    label: "Published resources",
    value: "18",
    detail: "3 drafts need review",
    icon: FileText,
    accentClassName: "border-[hsl(var(--chart-2)/0.24)]",
    iconClassName:
      "bg-[hsl(var(--chart-2)/0.12)] text-[hsl(var(--chart-2))]",
  },
  {
    label: "Downloads",
    value: "2,913",
    detail: "Science packs leading",
    icon: ArrowDownToLine,
    accentClassName: "border-[hsl(var(--chart-5)/0.24)]",
    iconClassName:
      "bg-[hsl(var(--chart-5)/0.12)] text-[hsl(var(--chart-5))]",
  },
];

const creatorStatToneByKey: Record<
  DashboardCreatorStatItem["key"],
  Pick<Stat, "icon" | "accentClassName" | "iconClassName">
> = {
  revenue: {
    icon: CircleDollarSign,
    accentClassName: "border-[hsl(var(--primary)/0.24)]",
    iconClassName:
      "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))]",
  },
  resources: {
    icon: FileText,
    accentClassName: "border-[hsl(var(--chart-2)/0.24)]",
    iconClassName:
      "bg-[hsl(var(--chart-2)/0.12)] text-[hsl(var(--chart-2))]",
  },
  downloads: {
    icon: ArrowDownToLine,
    accentClassName: "border-[hsl(var(--chart-5)/0.24)]",
    iconClassName:
      "bg-[hsl(var(--chart-5)/0.12)] text-[hsl(var(--chart-5))]",
  },
};

function mapCreatorStatItem(stat: DashboardCreatorStatItem): Stat {
  return {
    label: stat.label,
    value: stat.value,
    detail: stat.detail,
    ...creatorStatToneByKey[stat.key],
  };
}

function CreatorStatGrid({
  stats,
}: {
  stats: Stat[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          size="sm"
          className={cn("min-h-32", stat.accentClassName)}
        >
          <CardContent className="flex flex-1 flex-col justify-between py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate whitespace-nowrap text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-ui text-3xl font-semibold tabular-nums text-foreground">
                  {stat.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground",
                  stat.iconClassName,
                )}
              >
                <stat.icon className="size-4" aria-hidden />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{stat.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function DashboardCreatorStats({
  stats,
}: {
  stats?: DashboardCreatorStatItem[];
} = {}) {
  return (
    <CreatorStatGrid
      stats={stats ? stats.map(mapCreatorStatItem) : creatorStats}
    />
  );
}
