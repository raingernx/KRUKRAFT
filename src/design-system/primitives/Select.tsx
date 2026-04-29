import * as React from "react"

import { cn } from "@/lib/utils"
import {
  getFieldControlSizeClassName,
  type FieldControlDensity,
  type FieldControlSize,
} from "./fieldRecipe"

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  error?: string
  hint?: string
  hintClassName?: string
  size?: FieldControlSize
  density?: FieldControlDensity
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({
  error,
  hint,
  hintClassName,
  id,
  className,
  size,
  density = "comfortable",
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}, ref) {
  const generatedId = React.useId()
  const selectId = id ?? generatedId
  const hintId = `${selectId}-hint`
  const errorId = `${selectId}-error`
  const describedBy =
    [ariaDescribedBy, error ? errorId : null, !error && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <div className="w-full space-y-1">
      <select
        ref={ref}
        id={selectId}
        data-slot="select"
        data-density={density}
        className={cn(
          "select-base",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/18",
          getFieldControlSizeClassName(size, density),
          "rounded-[var(--radius-sm)]",
          className,
        )}
        aria-describedby={describedBy}
        aria-invalid={ariaInvalid ?? Boolean(error)}
        {...props}
      />
      {error ? (
        <p id={errorId} className="text-caption text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={cn("text-caption text-muted-foreground", hintClassName)}>
          {hint}
        </p>
      ) : null}
    </div>
  )
})

Select.displayName = "Select"

export { Select }
