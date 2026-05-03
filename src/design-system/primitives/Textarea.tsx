import * as React from "react"

import { cn } from "@/lib/utils"
import { fieldInputBaseClassName } from "./fieldRecipe"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  hint?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({
  error,
  hint,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...props
}, ref) {
  const generatedId = React.useId()
  const textareaId = id ?? generatedId
  const hintId = `${textareaId}-hint`
  const errorId = `${textareaId}-error`
  const describedBy =
    [ariaDescribedBy, error ? errorId : null, !error && hint ? hintId : null]
      .filter(Boolean)
      .join(" ") || undefined

  return (
    <div className="w-full space-y-2">
      <textarea
        ref={ref}
        id={textareaId}
        data-slot="textarea"
        className={cn(
          fieldInputBaseClassName,
          "h-auto min-h-[120px] resize-y rounded-[var(--radius-md)] px-6 py-6 text-sm leading-5",
          "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/18",
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
        <p id={hintId} className={cn("text-caption text-muted-foreground")}>
          {hint}
        </p>
      ) : null}
    </div>
  )
})

Textarea.displayName = "Textarea"

export { Textarea }
