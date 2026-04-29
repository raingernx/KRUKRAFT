"use client";

import * as React from "react";
import { Loader2, Search, X } from "@/lib/icons";

import { cn } from "@/lib/utils";
import {
  fieldEndAdornmentWidthClassNames,
  fieldEndAdornmentClassName,
  fieldInputBaseClassName,
  fieldStartAdornmentWidthClassNames,
  fieldStartAdornmentClassName,
  getFieldControlSizeClassName,
  resolveFieldControlSize,
  type FieldControlDensity,
  type FieldControlSize,
} from "./fieldRecipe";

export type SearchInputVariant = "default" | "hero";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: SearchInputVariant;
  size?: FieldControlSize;
  density?: FieldControlDensity;
  loading?: boolean;
  onClear?: () => void;
  clearLabel?: string;
  containerClassName?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  submitButton?: React.ReactNode;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      variant = "default",
      size,
      density = "comfortable",
      type = "search",
      loading = false,
      onClear,
      clearLabel = "Clear search",
      className,
      containerClassName,
      startAdornment,
      endAdornment,
      submitButton,
      value,
      ...props
    },
    ref,
  ) => {
    const hasValue =
      typeof value === "string"
        ? value.length > 0
        : typeof value === "number"
          ? true
          : false;
    const searchSize = size ?? (variant === "default" ? "md" : undefined);
    const resolvedSize = resolveFieldControlSize(searchSize, density);
    const inputSizeClassName = getFieldControlSizeClassName(searchSize, density);
    const startAdornmentSizeClassName = fieldStartAdornmentWidthClassNames[resolvedSize];
    const endAdornmentSizeClassName = fieldEndAdornmentWidthClassNames[resolvedSize];

    const searchIcon = startAdornment ?? (
      variant === "hero" ? (
        <Search
          className={cn(
            fieldStartAdornmentClassName,
            "pointer-events-none text-muted-foreground",
            "h-full w-12 p-4 sm:w-14 sm:p-[18px]",
          )}
          aria-hidden
        />
      ) : (
        <span
          className={cn(
            fieldStartAdornmentClassName,
            startAdornmentSizeClassName,
            "pointer-events-none justify-center text-muted-foreground",
          )}
          data-testid="search-input-start-adornment"
          aria-hidden="true"
        >
          <Search className="size-4" aria-hidden />
        </span>
      )
    );

    const clearButton =
      !loading && onClear && hasValue ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className={cn(
            fieldEndAdornmentClassName,
            "justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            variant === "hero"
              ? "w-12 rounded-xl p-4 sm:w-14 sm:p-[18px]"
              : cn(endAdornmentSizeClassName, "rounded-[var(--radius-sm)]"),
          )}
          data-testid="search-input-clear"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null;

    const loadingIndicator = loading ? (
      variant === "hero" ? (
        <Loader2
          className={cn(
            fieldEndAdornmentClassName,
            "animate-spin text-muted-foreground",
            "h-full w-12 p-4 sm:w-14 sm:p-[18px]",
          )}
        />
      ) : (
        <span
          className={cn(
            fieldEndAdornmentClassName,
            endAdornmentSizeClassName,
            "justify-center text-muted-foreground",
          )}
          data-testid="search-input-loading"
          aria-hidden="true"
        >
          <Loader2 className="size-4 animate-spin" />
        </span>
      )
    ) : null;

    const trailingAdornment = loadingIndicator ?? clearButton ?? endAdornment;

    const input = (
      <div className={cn("relative w-full", containerClassName)}>
        {searchIcon}
        <input
          ref={ref}
          type={type}
          value={value}
          className={cn(
            variant === "hero"
              ? [
                  "w-full rounded-2xl border border-input bg-background px-4",
                  "py-3.5 pl-12 pr-12 text-sm text-foreground shadow-none sm:py-4 sm:pl-14 sm:pr-14 sm:text-base",
                  "placeholder:text-muted-foreground outline-none",
                  "transition-[border-color,box-shadow,background-color] duration-150",
                  "hover:border-border",
                  "focus:border-ring focus:ring-2 focus:ring-ring/20 focus:ring-offset-0",
                  "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
                  "disabled:cursor-not-allowed disabled:border-border-subtle disabled:bg-muted/60 disabled:text-muted-foreground",
                ]
              : [
                  fieldInputBaseClassName,
                  inputSizeClassName,
                  "rounded-[var(--radius-sm)]",
                  resolvedSize === "sm"
                    ? "pl-9 pr-9"
                    : resolvedSize === "md"
                      ? "pl-10 pr-10"
                      : "pl-11 pr-11",
                ],
            className,
          )}
          {...props}
        />
        {trailingAdornment}
      </div>
    );

    if (!submitButton) {
      return input;
    }

    return (
      <div className="flex w-full items-stretch gap-3">
        {input}
        {submitButton}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
