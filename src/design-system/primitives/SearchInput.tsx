"use client";

import * as React from "react";
import { Loader2, Search, X } from "@/lib/icons";

import { cn } from "@/lib/utils";

export type SearchInputVariant = "default" | "hero";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  variant?: SearchInputVariant;
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

    const searchIcon = startAdornment ?? (
      <Search
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 text-muted-foreground",
          variant === "hero"
            ? "h-full w-12 p-4 sm:w-14 sm:p-[18px]"
            : "h-full w-11 p-3.5",
        )}
        aria-hidden
      />
    );

    const clearButton =
      !loading && onClear && hasValue ? (
        <button
          type="button"
          onClick={onClear}
          aria-label={clearLabel}
          className={cn(
            "absolute inset-y-0 right-0 rounded-xl text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            variant === "hero"
              ? "w-12 rounded-2xl p-4 sm:w-14 sm:p-[18px]"
              : "w-11 p-3.5",
          )}
        >
          <X className="h-4 w-4" />
        </button>
      ) : null;

    const loadingIndicator = loading ? (
      <Loader2
        className={cn(
          "absolute inset-y-0 right-0 animate-spin text-muted-foreground",
          variant === "hero"
            ? "h-full w-12 p-4 sm:w-14 sm:p-[18px]"
            : "h-full w-11 p-3.5",
        )}
      />
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
                  "input-base pl-11 pr-11",
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
