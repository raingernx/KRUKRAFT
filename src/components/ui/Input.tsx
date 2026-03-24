/**
 * DO NOT USE DIRECTLY
 * This is a base primitive implementation.
 * Use "@/design-system" instead.
 */
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends Omit<React.ComponentProps<"input">, "prefix"> {
  /** Optional left icon/element rendered inside the input */
  leftAdornment?: React.ReactNode;
  /** Optional right element (clear button, unit label, etc.) */
  rightAdornment?: React.ReactNode;
}

/**
 * KruCraft Input — shared field styling with consistent height, radius,
 * semantic borders, and primary focus states.
 */
function Input({ className, type, leftAdornment, rightAdornment, ...props }: InputProps) {
  if (leftAdornment || rightAdornment) {
    return (
      <div className="relative">
        {leftAdornment && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center text-text-muted">
            {leftAdornment}
          </span>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            "input-base min-w-0",
            "aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/20",
            leftAdornment  && "pl-11",
            rightAdornment && "pr-11",
            className
          )}
          {...props}
        />
        {rightAdornment && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex w-11 items-center justify-center text-text-muted">
            {rightAdornment}
          </span>
        )}
      </div>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "input-base min-w-0",
        "aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
