import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

export interface PaginationNavProps extends React.ComponentProps<"nav"> {}

export function PaginationNav({ className, ...props }: PaginationNavProps) {
  return (
    <nav
      aria-label="Pagination"
      className={cn("flex items-center justify-center gap-2", className)}
      {...props}
    />
  );
}

export interface PaginationListProps extends React.ComponentProps<"div"> {}

export function PaginationList({ className, ...props }: PaginationListProps) {
  return <div className={cn("flex items-center justify-center gap-1", className)} {...props} />;
}

type PrimitivePaginationButtonProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

export interface PaginationButtonProps extends PrimitivePaginationButtonProps {
  active?: boolean;
  size?: "sm" | "md";
}

export function PaginationButton({
  className,
  active = false,
  size = "md",
  type = "button",
  asChild = false,
  ...props
}: PaginationButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type={asChild ? undefined : type}
      className={cn(
        "inline-flex items-center justify-center gap-1 border font-medium whitespace-nowrap transition-colors outline-none select-none",
        "focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-40",
        size === "sm"
          ? "h-8 min-w-8 rounded-[var(--radius-sm)] px-3 text-xs"
          : "h-10 min-w-10 rounded-[var(--radius-sm)] px-4 text-sm",
        active
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary-hover"
          : "border-border-strong bg-transparent text-foreground hover:border-border-strong hover:bg-muted/40 hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export interface PaginationInfoProps extends React.ComponentProps<"span"> {}

export function PaginationInfo({ className, ...props }: PaginationInfoProps) {
  return <span className={cn("text-sm text-muted-foreground", className)} {...props} />;
}

export interface PaginationEllipsisProps extends React.ComponentProps<"span"> {}

export function PaginationEllipsis({ className, ...props }: PaginationEllipsisProps) {
  return (
    <span
      aria-hidden="true"
      className={cn("select-none px-1 text-sm text-muted-foreground", className)}
      {...props}
    >
      …
    </span>
  );
}

export function buildPaginationItems(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items: (number | "…")[] = [1];

  if (current > 3) {
    items.push("…");
  }

  for (
    let page = Math.max(2, current - 1);
    page <= Math.min(total - 1, current + 1);
    page += 1
  ) {
    items.push(page);
  }

  if (current < total - 2) {
    items.push("…");
  }

  items.push(total);

  return items;
}
