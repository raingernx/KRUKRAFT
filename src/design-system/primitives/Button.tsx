import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "@/lib/icons"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-full border border-transparent bg-clip-padding",
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
          "bg-primary text-primary-foreground hover:bg-primary/92 active:bg-primary/84 disabled:bg-muted disabled:text-muted-foreground",
        default:
          "bg-primary text-primary-foreground hover:bg-primary/92 active:bg-primary/84 disabled:bg-muted disabled:text-muted-foreground",
        quiet:
          "bg-primary/20 text-foreground hover:bg-primary/24 active:bg-primary/28 disabled:bg-muted disabled:text-muted-foreground",
        dark:
          "bg-foreground text-background hover:bg-foreground/92 active:bg-foreground disabled:bg-muted disabled:text-muted-foreground",
        secondary:
          "bg-primary/20 text-foreground hover:bg-primary/24 active:bg-primary/28 disabled:bg-muted disabled:text-muted-foreground",
        outline:
          "border-border bg-card text-foreground hover:border-border-strong hover:bg-muted/40 active:bg-muted/55 disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
        ghost:
          "bg-warning-100 text-foreground hover:bg-warning-100/88 active:bg-warning-100/76 disabled:bg-muted disabled:text-muted-foreground dark:bg-warning-700/32 dark:text-foreground dark:hover:bg-warning-700/42 dark:active:bg-warning-700/50",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/92 active:bg-destructive/84 focus-visible:ring-destructive/30 disabled:bg-muted disabled:text-muted-foreground",
        destructive:
          "border-destructive/20 bg-destructive/10 text-destructive hover:border-destructive/30 hover:bg-destructive/15 focus-visible:ring-destructive/22 disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
        accent:
          "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 focus-visible:ring-warning-500/20 disabled:bg-muted disabled:text-muted-foreground",
        link:
          "rounded-none px-0 text-primary underline-offset-4 hover:text-foreground hover:underline disabled:text-muted-foreground",
      },
      size: {
        xs: "h-8 px-3 text-caption",
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        default: "h-11 px-5 text-sm",
        icon: "size-10",
        "icon-xs": "size-8",
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
