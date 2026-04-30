import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, disabled, ...props }, ref) => {
  return (
    <SwitchPrimitives.Root
      ref={ref}
      disabled={disabled}
      className={cn(
        "inline-flex h-6 w-[46px] items-center rounded-full border transition-[background-color,border-color,opacity] duration-200",
        "border-border bg-muted",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        disabled &&
          "cursor-not-allowed data-[state=unchecked]:border-border-subtle data-[state=unchecked]:bg-card data-[state=checked]:border-primary/70 data-[state=checked]:bg-primary/70",
        className,
      )}
      {...props}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "h-5 w-5 rounded-full border border-border bg-background transition-transform duration-200",
          "translate-x-0.5 data-[state=checked]:translate-x-[24px]",
        )}
      />
    </SwitchPrimitives.Root>
  )
})

Switch.displayName = "Switch"

export { Switch }
