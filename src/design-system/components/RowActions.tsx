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
    "border-border bg-transparent text-foreground hover:border-border hover:bg-inset hover:text-foreground active:border-border active:bg-inset active:text-foreground disabled:border-border disabled:bg-transparent disabled:text-ink-subtle",
  danger:
    "border-danger-200 bg-transparent text-danger-600 hover:border-danger-200 hover:bg-danger-50 hover:text-danger-700 active:border-danger-200 active:bg-danger-50 active:text-danger-700 disabled:border-danger-100 disabled:bg-transparent disabled:text-danger-300",
  success:
    "border-emerald-200 bg-transparent text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 active:border-emerald-200 active:bg-emerald-50 active:text-emerald-700 disabled:border-emerald-100 disabled:bg-transparent disabled:text-emerald-300",
  muted:
    "border-border bg-transparent text-muted-foreground hover:border-border hover:bg-inset hover:text-foreground active:border-border active:bg-inset active:text-foreground disabled:border-border disabled:bg-transparent disabled:text-ink-subtle",
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
        (variant === "outline" || variant == null) &&
          "focus-visible:border-2 focus-visible:border-primary focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
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
