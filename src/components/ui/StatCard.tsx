import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";

/**
 * StudyDock Stat Card. Used in dashboard and admin panels.
 * Style: quiet surface, subtle border, medium radius, p-5.
 * Layout: metric label, then metric value (e.g. "Downloads" / "1,240").
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, icon, className }: StatCardProps) {
  const displayValue =
    typeof value === "number" ? formatNumber(value) : value;

  return (
    <div
      className={cn(
        "min-w-0 rounded-xl border border-border-subtle bg-white p-5 shadow-none",
        className
      )}
    >
      {icon && <div className="mb-2 flex justify-start">{icon}</div>}
      <p className="text-caption text-text-secondary">{label}</p>
      <p className="mt-1 truncate text-lg font-semibold tabular-nums text-text-primary">
        {displayValue}
      </p>
    </div>
  );
}
