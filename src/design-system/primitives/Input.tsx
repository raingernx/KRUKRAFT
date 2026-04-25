import * as React from "react"

import { cn } from "@/lib/utils"
import {
  fieldEndAdornmentWidthClassNames,
  fieldStartAdornmentWidthClassNames,
  fieldEndAdornmentClassName,
  fieldInputBaseClassName,
  fieldStartAdornmentClassName,
  getFieldControlSizeClassName,
  resolveFieldControlSize,
  type FieldControlDensity,
  type FieldControlSize,
} from "./fieldRecipe"

export interface InputProps extends Omit<React.ComponentProps<"input">, "prefix" | "size"> {
  leftAdornment?: React.ReactNode
  rightAdornment?: React.ReactNode
  error?: string
  hint?: string
  hintClassName?: string
  size?: FieldControlSize
  density?: FieldControlDensity
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input({
  error,
  hint,
  hintClassName,
  id,
  className,
  leftAdornment,
  rightAdornment,
  size,
  density = "comfortable",
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}, ref) {
  const generatedId = React.useId()
  const inputId = id ?? generatedId
  const hintId = `${inputId}-hint`
  const errorId = `${inputId}-error`
  const describedBy = [ariaDescribedBy, error ? errorId : null, !error && hint ? hintId : null]
    .filter(Boolean)
    .join(" ") || undefined

  const resolvedSize = resolveFieldControlSize(size, density)
  const inputSizeClassName = getFieldControlSizeClassName(size, density)
  const startAdornmentSizeClassName = fieldStartAdornmentWidthClassNames[resolvedSize]
  const endAdornmentSizeClassName = fieldEndAdornmentWidthClassNames[resolvedSize]

  return (
    <div className="w-full space-y-1">
      {leftAdornment || rightAdornment ? (
        <div className="relative">
          {leftAdornment ? (
            <span
              className={cn(
                fieldStartAdornmentClassName,
                startAdornmentSizeClassName,
                "pointer-events-none text-muted-foreground",
              )}
            >
              {leftAdornment}
            </span>
          ) : null}
          <input
            ref={ref}
            id={inputId}
            data-slot="input"
            data-density={density}
            className={cn(
              fieldInputBaseClassName,
              "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/18",
              inputSizeClassName,
              leftAdornment &&
                (resolvedSize === "sm" ? "pl-9" : resolvedSize === "md" ? "pl-10" : "pl-11"),
              rightAdornment &&
                (resolvedSize === "sm" ? "pr-9" : resolvedSize === "md" ? "pr-10" : "pr-11"),
              className,
            )}
            aria-describedby={describedBy}
            aria-invalid={ariaInvalid ?? Boolean(error)}
            {...props}
          />
          {rightAdornment ? (
            <span
              className={cn(
                fieldEndAdornmentClassName,
                endAdornmentSizeClassName,
                "pointer-events-none text-muted-foreground",
              )}
            >
              {rightAdornment}
            </span>
          ) : null}
        </div>
      ) : (
        <input
          ref={ref}
          id={inputId}
          data-slot="input"
          data-density={density}
          className={cn(
            fieldInputBaseClassName,
            "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/18",
            inputSizeClassName,
            className,
          )}
          aria-describedby={describedBy}
          aria-invalid={ariaInvalid ?? Boolean(error)}
          {...props}
        />
      )}
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

Input.displayName = "Input"

export { Input }
