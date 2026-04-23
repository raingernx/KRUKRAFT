import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "@/lib/icons"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-1.5",
    "rounded-xl border border-transparent bg-clip-padding",
    "font-ui text-sm font-medium whitespace-nowrap",
    "shadow-none transition-[background-color,border-color,color,box-shadow,transform] outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:translate-y-px active:bg-primary/84",
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 active:translate-y-px active:bg-primary/84",
        quiet:
          "border-border bg-card text-foreground hover:border-border-strong hover:bg-muted/70",
        dark:
          "bg-foreground text-background hover:bg-foreground/92 active:translate-y-px active:bg-foreground",
        secondary:
          "border-border bg-card text-foreground hover:border-border-strong hover:bg-muted/70",
        outline:
          "border-border bg-card text-foreground hover:border-border-strong hover:bg-muted/70",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground",
        danger:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 active:translate-y-px active:bg-destructive/84 focus-visible:ring-destructive/30",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive hover:border-destructive/30 hover:bg-destructive/15 focus-visible:ring-destructive/22",
        accent:
          "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 focus-visible:ring-warning-500/20",
        link:
          "text-primary underline-offset-4 hover:text-foreground hover:underline",
      },
      size: {
        xs: "h-8 gap-1 rounded-lg px-3 text-caption",
        sm: "h-10 gap-1.5 px-3.5 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-5 text-sm",
        default: "h-11 px-4 text-sm",
        icon: "size-10",
        "icon-xs": "size-8 rounded-lg",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
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
  }

export type ButtonVariant =
  | "primary"
  | "quiet"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "destructive"
  | "accent"
  | "link"

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon"

export interface ButtonProps
  extends Omit<PrimitiveButtonProps, "variant" | "size" | "children"> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children?: React.ReactNode
}

function Button({
  variant = "primary",
  size = "md",
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

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      className={cn(
        buttonVariants({ variant, size }),
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
