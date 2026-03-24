/**
 * DO NOT USE DIRECTLY
 * This is a base primitive implementation.
 * Use "@/design-system" instead.
 */
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles shared by every variant
  [
    "group/button inline-flex shrink-0 items-center justify-center gap-1.5",
    "rounded-xl border border-transparent bg-clip-padding",
    "font-ui text-sm font-semibold whitespace-nowrap",
    "transition-all outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-primary-500/20 focus-visible:ring-offset-1",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",

        default:
          "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800",

        dark:
          "bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950",

        secondary:
          "border-border-subtle bg-white text-text-primary hover:border-surface-300 hover:bg-surface-50",

        outline:
          "border-border-subtle bg-white text-text-primary hover:border-surface-300 hover:bg-surface-50",

        ghost:
          "bg-transparent text-text-secondary hover:bg-surface-100 hover:text-text-primary",

        danger:
          "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-500/20",

        destructive:
          "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-300 focus-visible:ring-red-500/20",

        accent:
          "bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700 focus-visible:ring-warning-500/20",

        link:
          "text-primary-700 underline-offset-4 hover:underline",
      },
      size: {
        sm:  "h-9 px-3 text-sm gap-1.5",
        md:  "h-11 px-4 text-sm",
        lg:  "h-12 px-5 text-base",

        xs:      "h-8 px-2.5 text-caption gap-1 rounded-lg",
        default: "h-11 px-4 text-sm",

        icon:    "size-10",
        "icon-xs":  "size-8 rounded-lg",
        "icon-sm":  "size-9",
        "icon-lg":  "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  loading = false,
  fullWidth = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    fullWidth?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

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
        // Slot.Root (radix-ui) uses React.Children.only — it must receive exactly
        // one React element. Skip the loading spinner when asChild is true.
        children
      ) : (
        <>
          {loading && <Loader2 className="size-4 animate-spin" />}
          {children}
        </>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
