"use client";

import * as React from "react";

import { Button, type ButtonProps } from "@/design-system/primitives";
import { cn } from "@/lib/utils";

export type RowActionTone = "default" | "danger" | "success" | "muted";

export interface RowActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RowActions({ className, ...props }: RowActionsProps) {
  return (
    <div
      className={cn("flex items-center justify-end gap-2", className)}
      {...props}
    />
  );
}

export interface RowActionButtonProps extends ButtonProps {
  iconOnly?: boolean;
  tone?: RowActionTone;
}

const toneClasses: Record<RowActionTone, string> = {
  default:
    "border-border-strong bg-transparent text-foreground hover:border-border-strong hover:bg-muted/40 hover:text-foreground",
  danger:
    "border-danger-200 bg-transparent text-danger-600 hover:bg-danger-50 hover:text-danger-700",
  success:
    "border-emerald-200 bg-transparent text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700",
  muted:
    "border-border-strong bg-transparent text-muted-foreground hover:border-border-strong hover:bg-muted/40 hover:text-foreground",
};

const rowActionSizeClasses = {
  xs: "h-8 gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-xs",
  sm: "h-8 gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-xs",
  md: "h-10 gap-2 rounded-[var(--radius-sm)] px-4 text-sm",
  lg: "h-10 gap-2 rounded-[var(--radius-sm)] px-4 text-sm",
} as const;

function getRowActionSizeClass(size: ButtonProps["size"]) {
  switch (size) {
    case "md":
    case "lg":
      return rowActionSizeClasses.md;
    case "xs":
      return rowActionSizeClasses.xs;
    case "sm":
    default:
      return rowActionSizeClasses.sm;
  }
}

export function RowActionButton({
  className,
  variant,
  size,
  iconOnly = false,
  tone = "default",
  children,
  ...props
}: RowActionButtonProps) {
  const resolvedSize = size ?? "sm";
  const resolvedSizeClass = getRowActionSizeClass(resolvedSize);

  return (
    <Button
      variant={variant ?? "outline"}
      size={resolvedSize}
      className={cn(
        resolvedSizeClass,
        iconOnly &&
          (resolvedSize === "md" || resolvedSize === "lg"
            ? "size-10 px-0"
            : "size-8 px-0"),
        variant === "outline" || variant == null ? toneClasses[tone] : null,
        className,
      )}
      {...props}
    >
      {children}
    </Button>
  );
}

export interface RowActionMenuTriggerProps extends Omit<RowActionButtonProps, "iconOnly"> {
  "aria-label"?: string;
}

export function RowActionMenuTrigger({
  children,
  className,
  "aria-label": ariaLabel = "More actions",
  ...props
}: RowActionMenuTriggerProps) {
  return (
    <RowActionButton
      iconOnly
      aria-label={ariaLabel}
      className={className}
      {...props}
    >
      {children}
    </RowActionButton>
  );
}
