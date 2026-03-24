/**
 * DO NOT USE DIRECTLY
 * This is a base primitive implementation.
 * Use "@/design-system" instead.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select className={cn("select-base", className)} {...props}>
      {children}
    </select>
  );
}
