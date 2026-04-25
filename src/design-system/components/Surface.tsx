import * as React from "react";

import { cn } from "@/lib/utils";

const surfaceVariantClasses = {
  panel: "rounded-2xl border border-border bg-card shadow-card",
  subtle: "rounded-xl border border-border-subtle bg-card shadow-none",
  muted: "rounded-xl border border-border bg-muted/70 shadow-none",
} as const;

export interface SurfaceProps extends React.ComponentProps<"div"> {
  variant?: keyof typeof surfaceVariantClasses;
}

export function Surface({
  className,
  variant = "panel",
  ...props
}: SurfaceProps) {
  return (
    <div
      data-slot="surface"
      data-variant={variant}
      className={cn("min-w-0", surfaceVariantClasses[variant], className)}
      {...props}
    />
  );
}
