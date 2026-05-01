import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "@/lib/icons"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-[var(--radius-pill)] border border-transparent bg-clip-padding",
    "font-ui text-sm font-semibold whitespace-nowrap",
    "shadow-none transition-[background-color,border-color,color,box-shadow] outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:shadow-none",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed disabled:bg-muted disabled:text-muted-foreground",
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-pressed disabled:bg-muted disabled:text-muted-foreground",
        quiet:
          "border-primary-quiet-border bg-primary-quiet text-primary-quiet-foreground hover:bg-primary-quiet active:bg-primary-quiet disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
        soft:
          "border-primary-soft-border bg-primary-soft text-primary-soft-foreground hover:bg-primary-soft-hover active:bg-primary-soft-pressed disabled:border-primary-soft-border disabled:bg-primary-soft disabled:text-primary-soft-disabled-foreground",
        secondary:
          "bg-primary-quiet text-primary-quiet-foreground hover:bg-primary-quiet active:bg-primary-quiet disabled:bg-muted disabled:text-muted-foreground",
        outline:
          "border-border bg-card text-foreground hover:border-border-strong hover:bg-muted/40 active:bg-muted/55 disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
        ghost:
          "bg-action-ghost text-action-ghost-foreground hover:bg-action-ghost active:bg-action-ghost disabled:bg-muted disabled:text-muted-foreground",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/92 active:bg-destructive/84 focus-visible:ring-destructive/30 disabled:bg-muted disabled:text-muted-foreground",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive hover:border-destructive/30 hover:bg-destructive/15 focus-visible:ring-destructive/22 disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
        link:
          "rounded-none px-0 text-primary underline-offset-4 hover:text-foreground hover:underline disabled:text-muted-foreground",
      },
      size: {
        xs: "h-8 px-3 text-caption",
        sm: "h-8 px-4 text-sm",
        md: "h-10 px-6 text-sm",
        lg: "h-12 px-8 text-sm",
        default: "h-10 px-6 text-sm",
        icon: "size-10",
        "icon-xs": "size-8",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
)

type PrimitiveButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    fullWidth?: boolean
    density?: "comfortable" | "compact"
  }

export type ButtonVariant =
  | "primary"
  | "quiet"
  | "soft"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "destructive"
  | "link"

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon"

export interface ButtonProps
  extends Omit<PrimitiveButtonProps, "variant" | "size" | "children"> {
  variant?: ButtonVariant
  size?: ButtonSize
  density?: "comfortable" | "compact"
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

function Button({
  variant = "primary",
  size,
  density = "comfortable",
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  asChild,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  const resolvedSize = size ?? (density === "compact" ? "sm" : "md")

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={resolvedSize}
      data-density={density}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ variant, size: resolvedSize }),
        density === "compact" && variant !== "link" && "rounded-[var(--radius-sm)]",
        fullWidth && "w-full",
        className,
      )}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {!loading && leftIcon ? (
            <span aria-hidden="true" className="inline-flex items-center">
              {leftIcon}
            </span>
          ) : null}
          {children}
          {!loading && rightIcon ? (
            <span aria-hidden="true" className="inline-flex items-center">
              {rightIcon}
            </span>
          ) : null}
        </>
      )}
    </Comp>
  )
}

Button.displayName = "Button"

export { Button, buttonVariants }
